"use client"

import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { Loader2, Send, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

import { useChat } from "@/hooks/chat/useChat"
import { useListUserIntegrations } from "@/hooks/user-integrations/useListUserIntegrations"

import { chatSchema, ChatSchema } from "@/schemas/chat/chatSchema"

import DisclaimerModal from "./components/DisclaimerModal"
import JiraIntegrationModal from "./components/JiraIntegrationModal"

interface Message {
    id: string
    question: string
    answer?: string
    isPending?: boolean
}

const QUICK_PROMPTS = [
    "Como foi a última semana de trabalho?",
    "O que o time conseguiu entregar recentemente?",
    "Quais entregas geraram mais valor até agora?",

    "Como está o volume de trabalho aberto hoje?",
    "Onde está concentrado o esforço do time?",
    "Há muito trabalho em andamento ao mesmo tempo?",

    "Como está a distribuição de trabalho entre as pessoas?",
    "Quem está com mais demandas abertas atualmente?",
    "Há pessoas com carga acima do normal?",

    "Como está o tempo investido nos projetos em andamento?",
    "Onde o tempo está sendo mais consumido?",
    "Há iniciativas consumindo tempo demais para o valor entregue?",

    "Quais entregas estão dentro do prazo?",
    "O que já está atrasado?",
    "O que está próximo do prazo final?",

    "Como está o ritmo de entrega do time?",
    "O volume de entregas está compatível com o tamanho do time?",
    "O time está conseguindo concluir o que começa?",

    "Quais projetos concentram mais riscos hoje?",
    "Onde há acúmulo de trabalho aberto?",
    "Há entregas importantes em risco agora?",

    "No que o time está focado neste momento?",
    "Esse foco está alinhado com as prioridades atuais?",
    "Há esforço sendo gasto fora do que é mais importante?",

    "Onde decisões podem acelerar as entregas?",
    "Quais pontos hoje dependem de decisão?",
    "Qual decisão teria mais impacto agora?"
]

const PENDING_MESSAGES = [
    "Processando dados do Jira",
    "Calculando métricas de fluxo",
    "Analisando histórico de tickets",
    "Mapeando gargalos no pipeline",
    "Correlacionando dados de entrega",
    "Detectando sinais de risco",
    "Identificando oportunidades de melhoria",
    "Analisando padrões de entrega",
    "Cruzando dados para gerar insights",
    "Construindo uma visão estratégica",
]

export default function ChatPage() {
    const chatMutation = useChat()
    const { user_integrations, isPending } = useListUserIntegrations()

    const messagesRef = useRef<HTMLDivElement>(null)

    const [messages, setMessages] = useState<Message[]>([])
    const [showIntegrationModal, setShowIntegrationModal] = useState(false)
    const [showDisclaimerModal, setShowDisclaimerModal] = useState(false)

    const [fade, setFade] = useState(true)
    const [pendingFade, setPendingFade] = useState(true)

    const [pendingMessageIndex, setPendingMessageIndex] = useState(0)
    const [currentPrompts, setCurrentPrompts] = useState<string[]>(() => {
        const shuffled = [...QUICK_PROMPTS].sort(() => 0.5 - Math.random())
        return shuffled.slice(0, 3)
    })

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

    const getRandomPrompts = () => {
        const shuffled = [...QUICK_PROMPTS].sort(() => 0.5 - Math.random())
        return shuffled.slice(0, 3)
    }

    useEffect(() => {
        const hasSeenDisclaimer = localStorage.getItem("valmore-disclaimer")

        if (!hasSeenDisclaimer) {
            setShowDisclaimerModal(true)
            localStorage.setItem("valmore-disclaimer", "true")
        }
    }, [])

    useEffect(() => {
        if (!jiraConfigured || messages.length > 0) return

        setCurrentPrompts(getRandomPrompts())

        const interval = setInterval(() => {
            setFade(false)

            setTimeout(() => {
                setCurrentPrompts(getRandomPrompts())
                setFade(true)
            }, 300)
        }, 8000)

        return () => clearInterval(interval)
    }, [jiraConfigured, messages.length])

    useEffect(() => {
        if (!chatMutation.isPending) return

        const interval = setInterval(() => {
            setPendingFade(false)

            setTimeout(() => {
                setPendingMessageIndex(
                    (prev) => (prev + 1) % PENDING_MESSAGES.length
                )
                setPendingFade(true)
            }, 300)
        }, 6000)

        return () => clearInterval(interval)
    }, [chatMutation.isPending])

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

    return (
        <>
            <DisclaimerModal
                open={showDisclaimerModal}
                onOpenChange={setShowDisclaimerModal}
            />

            <JiraIntegrationModal
                open={showIntegrationModal}
                onOpenChange={setShowIntegrationModal}
                integration={jiraIntegration}
            />

            <div className="relative bg-background px-4 py-5 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute left-1/2 top-[-120px] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-accent/20 blur-[160px]" />
                </div>

                <div className="container mx-auto max-w-5xl">
                    <Card className="h-[85vh] flex flex-col rounded-2xl border border-border shadow-sm overflow-hidden py-0">
                        <div className="border-b px-6 py-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold tracking-tight">
                                    Valmore
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Transformando dados do Jira em visão real de valor entregue
                                </p>
                            </div>

                            {jiraConfigured && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setShowIntegrationModal(true)
                                    }
                                    disabled={chatMutation.isPending}
                                    className="cursor-pointer gap-2"
                                >
                                    <Settings className="h-4 w-4" />
                                    Editar Jira
                                </Button>
                            )}
                        </div>

                        <div
                            ref={messagesRef}
                            className="flex-1 overflow-y-auto px-6 py-2 space-y-6"
                        >
                            {isPending ? (
                                <div className="flex justify-center">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                </div>
                            ) : !jiraConfigured ? (
                                <div className="flex flex-col items-center gap-4 py-24 text-center">
                                    <p className="text-muted-foreground max-w-md">
                                        Para usar o Valmore, configure a integração com o Jira.
                                    </p>

                                    <Button
                                        onClick={() =>
                                            setShowIntegrationModal(true)
                                        }
                                        className="bg-accent text-accent-foreground hover:bg-accent/80 rounded-xl cursor-pointer"
                                    >
                                        Configurar integração
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    {messages.map((message) => (
                                        <div key={message.id}>
                                            <div className="flex justify-end mb-6">
                                                <div className="bg-accent text-accent-foreground px-5 py-3 rounded-2xl max-w-[75%] text-sm shadow-sm">
                                                    {message.question}
                                                </div>
                                            </div>

                                            {message.isPending && (
                                                <div className="flex justify-start">
                                                    <div className="bg-card border border-border px-4 py-3 rounded-2xl flex items-center gap-2 text-sm text-muted-foreground shadow-sm">
                                                        <Loader2 className="h-4 w-4 animate-spin" />

                                                        <span
                                                            className={`transition-opacity duration-500 ${pendingFade
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                                }`}
                                                        >
                                                            {
                                                                PENDING_MESSAGES[
                                                                pendingMessageIndex
                                                                ]
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            {message.answer && (
                                                <div className="flex justify-start">
                                                    <div className="bg-card border border-border px-5 py-4 rounded-2xl max-w-[90%] text-sm shadow-sm prose prose-sm dark:prose-invert">
                                                        <ReactMarkdown
                                                            remarkPlugins={[
                                                                remarkGfm,
                                                            ]}
                                                            components={{
                                                                h1: ({
                                                                    children,
                                                                }) => (
                                                                    <h1 className="text-lg font-semibold mt-6 mb-4">
                                                                        {
                                                                            children
                                                                        }
                                                                    </h1>
                                                                ),
                                                                h2: ({
                                                                    children,
                                                                }) => (
                                                                    <h2 className="text-base font-semibold mt-5 mb-3">
                                                                        {
                                                                            children
                                                                        }
                                                                    </h2>
                                                                ),
                                                                h3: ({
                                                                    children,
                                                                }) => (
                                                                    <h3 className="text-sm font-semibold mt-4 mb-2">
                                                                        {
                                                                            children
                                                                        }
                                                                    </h3>
                                                                ),
                                                                p: ({
                                                                    children,
                                                                }) => (
                                                                    <p className="leading-relaxed mb-4">
                                                                        {
                                                                            children
                                                                        }
                                                                    </p>
                                                                ),
                                                                ul: ({
                                                                    children,
                                                                }) => (
                                                                    <ul className="list-disc pl-5 space-y-1 mb-4">
                                                                        {
                                                                            children
                                                                        }
                                                                    </ul>
                                                                ),
                                                                ol: ({
                                                                    children,
                                                                }) => (
                                                                    <ol className="list-decimal pl-5 space-y-1 mb-4">
                                                                        {
                                                                            children
                                                                        }
                                                                    </ol>
                                                                ),
                                                                li: ({
                                                                    children,
                                                                }) => (
                                                                    <li className="leading-relaxed">
                                                                        {
                                                                            children
                                                                        }
                                                                    </li>
                                                                ),
                                                                strong: ({
                                                                    children,
                                                                }) => (
                                                                    <strong className="font-semibold">
                                                                        {
                                                                            children
                                                                        }
                                                                    </strong>
                                                                ),
                                                                blockquote: ({
                                                                    children,
                                                                }) => (
                                                                    <blockquote className="border-l-2 border-accent pl-4 italic text-muted-foreground mb-4">
                                                                        {
                                                                            children
                                                                        }
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
                                        <div className="flex flex-col items-center gap-4">
                                            <p className="text-muted-foreground text-center">
                                                Escolha uma das sugestões abaixo
                                                ou escreva sua própria pergunta
                                            </p>

                                            <div
                                                className={`flex flex-wrap gap-4 justify-center max-w-[90%] transition-opacity duration-500 ${fade
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                                    }`}
                                            >
                                                {currentPrompts.map(
                                                    (prompt) => (
                                                        <Button
                                                            key={prompt}
                                                            variant="secondary"
                                                            size="sm"
                                                            onClick={() =>
                                                                sendMessage(
                                                                    prompt
                                                                )
                                                            }
                                                            className="cursor-pointer border-2 hover:border-accent px-5 rounded-lg max-w-full whitespace-normal break-words py-6"
                                                        >
                                                            {prompt}
                                                        </Button>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="border-t px-6 py-4">
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="flex gap-3"
                            >
                                <div className="flex-1">
                                    <Input
                                        placeholder="Faça uma pergunta estratégica para o Valmore…"
                                        {...register("message")}
                                        disabled={
                                            !jiraConfigured ||
                                            chatMutation.isPending
                                        }
                                        className="py-5"
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
                                    disabled={
                                        !jiraConfigured ||
                                        chatMutation.isPending
                                    }
                                    className="h-[48px] w-[48px] bg-accent text-accent-foreground hover:bg-accent/80 rounded-xl cursor-pointer"
                                >
                                    <Send className="h-5 w-5" />
                                </Button>
                            </form>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    )
}