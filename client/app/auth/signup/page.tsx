"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUpSchema, type SignUpSchema } from "@/schemas/auth/signupSchema"
import { useSignUp } from "@/hooks/auth/useSignup"
import Link from "next/link"

export default function SignUpPage() {
    const [showPassword, setShowPassword] = useState(false)
    const signUpMutation = useSignUp()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpSchema>({
        resolver: zodResolver(signUpSchema),
    })

    const onSubmit = (data: SignUpSchema) => {
        signUpMutation.mutate({
            name: data.name,
            email: data.email,
            password: data.password,
        })
    }

    return (
        <div className="relative flex items-center justify-center bg-background px-4 py-20 overflow-hidden">
            <div className="absolute inset-0 -z-10">
                <div className="absolute left-1/2 top-[-120px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-accent/20 blur-[140px]" />
            </div>

            <Card className="w-full max-w-md bg-card border border-border shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="text-center space-y-2 py-6">
                    <CardTitle className="text-3xl font-bold tracking-tight">
                        Crie sua conta no Valmore
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Comece a extrair valor real dos dados do Jira
                    </p>
                </CardHeader>

                <CardContent className="px-6 pb-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Digite seu nome"
                                    {...register("name")}
                                    disabled={signUpMutation.isPending}
                                    className="pl-10 py-5"
                                />
                            </div>
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Digite seu email"
                                    {...register("email")}
                                    disabled={signUpMutation.isPending}
                                    className="pl-10 py-5"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Digite sua senha"
                                    {...register("password")}
                                    disabled={signUpMutation.isPending}
                                    className="pl-10 pr-10 py-5"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors cursor-pointer"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={signUpMutation.isPending}
                            className="w-full py-5 bg-accent text-accent-foreground hover:bg-accent/80 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {signUpMutation.isPending ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Criando conta...
                                </>
                            ) : (
                                "Criar conta"
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        Já tem uma conta?{" "}
                        <Link
                            href="/auth/signin"
                            className="font-medium text-accent hover:underline"
                        >
                            Fazer login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
