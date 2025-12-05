"use client"

import * as React from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

export function UserAuthForm({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    async function loginWithGoogle() {
        setIsLoading(true)
        try {
            await signIn("google", { callbackUrl: "/" })
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <form onSubmit={async (e) => {
                e.preventDefault()
                setIsLoading(true)
                const formData = new FormData(e.currentTarget)
                const email = formData.get("email") as string
                const password = formData.get("password") as string

                if (!email || !password) {
                    setIsLoading(false)
                    return
                }

                try {
                    const result = await signIn("credentials", {
                        email,
                        password,
                        callbackUrl: "/admin", // Redirect to admin by default if using creds, or just /
                        redirect: true,
                    })
                } catch (error) {
                    console.error(error)
                } finally {
                    setIsLoading(false)
                }
            }}>
                <div className="grid gap-2">
                    <div className="grid gap-1">
                        <Input
                            id="email"
                            name="email"
                            placeholder="name@example.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading}
                        />
                        <Input
                            id="password"
                            name="password"
                            placeholder="Password"
                            type="password"
                            autoCapitalize="none"
                            autoComplete="current-password"
                            autoCorrect="off"
                            disabled={isLoading}
                        />
                    </div>
                    <Button disabled={isLoading}>
                        {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Sign In with Email
                    </Button>
                </div>
            </form>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>
            <Button
                variant="outline"
                type="button"
                disabled={isLoading}
                onClick={loginWithGoogle}
                className="w-full"
            >
                {isLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Icons.google className="mr-2 h-4 w-4" />
                )}{" "}
                Google
            </Button>
        </div>
    )
}
