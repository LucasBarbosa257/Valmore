"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"

import {
    updateUserIntegrationSchema,
    UpdateUserIntegrationSchema,
} from "@/schemas/user-integrations/updateUserIntegrationSchema"
import { useUpdateUserIntegration } from "@/hooks/user-integrations/useUpdateUserIntegration"
import toast from "react-hot-toast"

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    integration: any
}

export default function JiraIntegrationModal({
    open,
    onOpenChange,
    integration,
}: Props) {
    const queryClient = useQueryClient()
    const updateIntegrationMutation = useUpdateUserIntegration()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UpdateUserIntegrationSchema>({
        resolver: zodResolver(updateUserIntegrationSchema),
        defaultValues: {
            host: integration?.host || "",
            email: integration?.email || "",
            api_token: integration?.api_token || "",
        },
    })

    useEffect(() => {
        if (open) {
            reset({
                host: integration?.host || "",
                email: integration?.email || "",
                api_token: integration?.api_token || "",
            })
        }
    }, [open, integration, reset])

    const onSubmit = (data: UpdateUserIntegrationSchema) => {
        updateIntegrationMutation.mutate(
            {
                id: integration?.id,
                ...data,
            },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: ["user-integrations"],
                    })
                    
                    onOpenChange(false)

                    toast.success("A integração com o Jira foi configurada com sucesso.")
                },
                onError: () => {
                    toast.error("Ocorreu um erro ao tentar configurar a integração com o Jira. Tente novamente mais tarde!")
                }
            }
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-2xl border border-border shadow-sm">
                <DialogHeader className="space-y-1">
                    <DialogTitle className="text-2xl font-bold tracking-tight">
                        Integração com Jira
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Conecte ou edite sua integração para análises estratégicas
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
                    <div className="space-y-2">
                        <Label>Host</Label>
                        <Input
                            {...register("host")}
                            placeholder="Digite o host da sua empresa"
                            className="py-5"
                        />
                        {errors.host && (
                            <p className="text-sm text-red-500">{errors.host.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                            {...register("email")}
                            placeholder="Digite o seu email do Jira"
                            className="py-5"
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>API Token</Label>
                        <Input
                            {...register("api_token")}
                            placeholder="Digite o API Token da sua conta do Jira"
                            className="py-5"
                        />
                        {errors.api_token && (
                            <p className="text-sm text-red-500">
                                {errors.api_token.message}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={updateIntegrationMutation.isPending}
                        className="w-full py-5 bg-accent text-accent-foreground hover:bg-accent/80 rounded-xl cursor-pointer"
                    >
                        {updateIntegrationMutation.isPending ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            "Salvar integração"
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
