import { Metadata } from "next"
import Link from "next/link"
import { UserAuthForm } from "@/components/user-auth-form"

export const metadata: Metadata = {
    title: "Login",
    description: "Login to your account",
}

export default function LoginPage() {
    return (
        <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
            {/* Background effects */}
            <div className="absolute -top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[100px]" />
            <div className="absolute -bottom-[20%] -right-[10%] h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[100px]" />

            <div className="z-10 mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] p-8 rounded-xl border border-border/50 bg-card/50 backdrop-blur-xl shadow-xl">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Welcome back
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Sign in to continue your learning journey
                    </p>
                </div>
                <UserAuthForm />
                <p className="px-8 text-center text-xs text-muted-foreground">
                    By clicking continue, you agree to our{" "}
                    <Link
                        href="/terms"
                        className="hover:text-primary underline underline-offset-4 transition-colors"
                    >
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                        href="/privacy"
                        className="hover:text-primary underline underline-offset-4 transition-colors"
                    >
                        Privacy Policy
                    </Link>
                    .
                </p>
            </div>
        </div>
    )
}
