"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function DisclaimerModal({ open, onOpenChange }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-2xl border border-border shadow-sm">
                <DialogHeader className="space-y-2">
                    <DialogTitle className="text-3xl font-semibold text-center mb-2">
                        Aviso importante
                    </DialogTitle>
                </DialogHeader>

                <div className="text-sm text-muted-foreground leading-relaxed space-y-5 mb-5">
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            A versão atual da inteligência artificial utilizada para análise e geração de insights
                            está em <strong>fase de testes</strong>.
                        </li>
                        <li>
                            Os dados analisados são oficialmente coletados do <strong>Jira</strong>, porém a análise
                            automatizada pode conter <strong>imprecisões ou interpretações incorretas</strong>.
                        </li>
                        <li>
                            Recomenda-se sempre verificar informações críticas ou decisões estratégicas com os
                            <strong> registros oficiais</strong> antes de agir com base nos insights gerados.
                        </li>
                        <li>
                            O agente ainda <strong>não possui memória de conversas</strong>, portanto cada pergunta
                            deve ser feita de forma <strong>completa em uma única mensagem</strong>.
                        </li>
                    </ul>
                </div>

                <Button
                    onClick={() => onOpenChange(false)}
                    className="bg-accent text-accent-foreground hover:bg-accent/80 rounded-xl cursor-pointer"
                >
                    Entendi
                </Button>
            </DialogContent>
        </Dialog>
    )
}
