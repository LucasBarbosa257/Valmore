"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Send } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { useChat } from "@/hooks/chat/useChat"
import { chatSchema, ChatSchema } from "@/schemas/chat/chatSchema"
import { useListUserIntegrations } from "@/hooks/user-integrations/useListUserIntegrations"
import { useUpdateUserIntegration } from "@/hooks/user-integrations/useUpdateUserIntegration"
import {
    updateUserIntegrationSchema,
    UpdateUserIntegrationSchema,
} from "@/schemas/user-integrations/updateUserIntegrationSchema"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface Message {
    id: string
    question: string
    answer?: string
    isPending?: boolean
}

const QUICK_PROMPTS = [
    "Como foi a última semana?",
    "Como está a produtividade atual?",
    "Como está o desempenho dos membros da equipe?",
]

export default function ChatPage() {
    const queryClient = useQueryClient()

    const chatMutation = useChat()
    const updateIntegrationMutation = useUpdateUserIntegration()
    const { user_integrations, isPending } = useListUserIntegrations()

    const [messages, setMessages] = useState<Message[]>([])
    const [showIntegrationModal, setShowIntegrationModal] = useState(false)
    const [showDisclaimerModal, setShowDisclaimerModal] = useState(false)

    const messagesRef = useRef<HTMLDivElement>(null)

    const jiraIntegration = user_integrations?.find(
        (i) => i.provider === "jira"
    )

    const jiraConfigured =
        jiraIntegration &&
        jiraIntegration.host &&
        jiraIntegration.email &&
        jiraIntegration.api_token

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ChatSchema>({
        resolver: zodResolver(chatSchema),
    })

    const {
        register: registerIntegration,
        handleSubmit: handleSubmitIntegration,
        formState: { errors: integrationErrors },
    } = useForm<UpdateUserIntegrationSchema>({
        resolver: zodResolver(updateUserIntegrationSchema),
        defaultValues: {
            host: jiraIntegration?.host || "",
            email: jiraIntegration?.email || "",
            api_token: jiraIntegration?.api_token || "",
        },
    })

    useEffect(() => {
        const hasSeenDisclaimer = localStorage.getItem("valmore-disclaimer")
        if (!hasSeenDisclaimer) {
            setShowDisclaimerModal(true)
            localStorage.setItem("valmore-disclaimer", "true")
        }
    }, [])

    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight
        }
    }, [messages, chatMutation.isPending])

    const sendMessage = (message: string) => {
        reset()

        setMessages([
            {
                id: crypto.randomUUID(),
                question: message,
                isPending: true,
            },
        ])

        chatMutation.mutate(
            { message },
            {
                onSuccess: (response) => {
                    setMessages([
                        {
                            id: crypto.randomUUID(),
                            question: message,
                            answer: response.content,
                        },
                    ])
                },
                onError: () => {
                    setMessages([
                        {
                            id: crypto.randomUUID(),
                            question: message,
                            answer: "Erro ao gerar resposta. Tente novamente.",
                        },
                    ])
                },
            }
        )
    }

    const onSubmit = (data: ChatSchema) => {
        sendMessage(data.message)
    }

    const onSubmitIntegration = (data: UpdateUserIntegrationSchema) => {
        updateIntegrationMutation.mutate({
            id: jiraIntegration?.id,
            ...data
        }, {
            onSuccess: async () => {
                await queryClient.invalidateQueries({
                    queryKey: ["user-integrations"],
                })
                setShowIntegrationModal(false)
            },
        })
    }

    return (
        <>
            {/* DISCLAIMER */}
            <Dialog open={showDisclaimerModal} onOpenChange={setShowDisclaimerModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Aviso importante</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Esta é uma versão de testes do Valmore. As análises podem conter
                        erros. Sempre valide informações críticas antes de tomar decisões.
                        Nesta versão, o chat não possui memória.
                    </p>
                    <Button onClick={() => setShowDisclaimerModal(false)}>
                        Entendi
                    </Button>
                </DialogContent>
            </Dialog>

            {/* MODAL INTEGRAÇÃO */}
            <Dialog
                open={showIntegrationModal}
                onOpenChange={setShowIntegrationModal}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Configurar integração com Jira</DialogTitle>
                    </DialogHeader>

                    <form
                        onSubmit={handleSubmitIntegration(onSubmitIntegration)}
                        className="space-y-4"
                    >
                        <div>
                            <Label>Host</Label>
                            <Input {...registerIntegration("host")} />
                            {integrationErrors.host && (
                                <p className="text-xs text-red-500">
                                    {integrationErrors.host.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label>Email</Label>
                            <Input {...registerIntegration("email")} />
                            {integrationErrors.email && (
                                <p className="text-xs text-red-500">
                                    {integrationErrors.email.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label>API Token</Label>
                            <Input {...registerIntegration("api_token")} />
                            {integrationErrors.api_token && (
                                <p className="text-xs text-red-500">
                                    {integrationErrors.api_token.message}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={updateIntegrationMutation.isPending}
                        >
                            {updateIntegrationMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Salvar"
                            )}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* CHAT */}
            <div className="flex flex-col h-[85vh] bg-background border border-border rounded-xl overflow-hidden">
                <div
                    ref={messagesRef}
                    className="flex-1 overflow-y-auto px-4 py-6 space-y-6"
                >
                    <div className="container mx-auto max-w-7xl space-y-6">
                        {isPending ? (
                            <div className="flex justify-center">
                                <Loader2 className="h-6 w-6 animate-spin" />
                            </div>
                        ) : !jiraConfigured ? (
                            <div className="flex flex-col items-center gap-4 py-24 text-center">
                                <p className="text-muted-foreground max-w-md">
                                    Para usar o Valmore, você precisa configurar a integração com o Jira.
                                </p>
                                <Button onClick={() => setShowIntegrationModal(true)}>
                                    Configurar integração
                                </Button>
                            </div>
                        ) : (
                            <>
                                {messages.map((message) => (
                                    <div key={message.id}>
                                        <div className="flex justify-end mb-6">
                                            <div className="bg-primary text-primary-foreground px-4 py-3 rounded-2xl max-w-[90%] text-sm">
                                                {message.question}
                                            </div>
                                        </div>

                                        {message.isPending && (
                                            <div className="flex justify-start">
                                                <div className="bg-muted px-4 py-3 rounded-2xl flex items-center gap-2 text-sm">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Analisando dados do Jira...
                                                </div>
                                            </div>
                                        )}

                                        {message.answer && (
                                            <div className="flex justify-start">
                                                <div className="bg-muted px-4 py-3 rounded-2xl max-w-[90%] text-sm prose prose-sm dark:prose-invert">
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkGfm]}
                                                        components={{
                                                            h1: ({ children }) => (
                                                                <h1 className="mb-4 mt-6 text-lg font-semibold">
                                                                    {children}
                                                                </h1>
                                                            ),
                                                            h2: ({ children }) => (
                                                                <h2 className="mb-3 mt-5 text-base font-semibold">
                                                                    {children}
                                                                </h2>
                                                            ),
                                                            h3: ({ children }) => (
                                                                <h3 className="mb-2 mt-4 text-sm font-semibold">
                                                                    {children}
                                                                </h3>
                                                            ),
                                                            p: ({ children }) => (
                                                                <p className="mb-4 leading-relaxed">
                                                                    {children}
                                                                </p>
                                                            ),
                                                            ul: ({ children }) => (
                                                                <ul className="mb-4 list-disc pl-5 space-y-1">
                                                                    {children}
                                                                </ul>
                                                            ),
                                                            ol: ({ children }) => (
                                                                <ol className="mb-4 list-decimal pl-5 space-y-1">
                                                                    {children}
                                                                </ol>
                                                            ),
                                                            li: ({ children }) => (
                                                                <li className="leading-relaxed">
                                                                    {children}
                                                                </li>
                                                            ),
                                                            strong: ({ children }) => (
                                                                <strong className="font-semibold">
                                                                    {children}
                                                                </strong>
                                                            ),
                                                            blockquote: ({ children }) => (
                                                                <blockquote className="border-l-2 border-border pl-4 italic text-muted-foreground mb-4">
                                                                    {children}
                                                                </blockquote>
                                                            ),
                                                        }}
                                                    >
                                                        {message.answer}
                                                    </ReactMarkdown>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {messages.length === 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {QUICK_PROMPTS.map((prompt) => (
                                            <Button
                                                key={prompt}
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => sendMessage(prompt)}
                                            >
                                                {prompt}
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* INPUT */}
                <div className="border-t border-border px-4 py-3">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="container mx-auto max-w-3xl flex gap-3"
                    >
                        <div className="flex-1">
                            <Input
                                placeholder="Faça uma pergunta completa para o Valmore..."
                                {...register("message")}
                                disabled={!jiraConfigured || chatMutation.isPending}
                            />
                            {errors.message && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.message.message}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            size="icon"
                            disabled={!jiraConfigured || chatMutation.isPending}
                        >
                            {chatMutation.isPending ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <Send className="h-5 w-5" />
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    )
}
