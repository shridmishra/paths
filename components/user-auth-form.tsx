"use client"

import * as React from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
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
