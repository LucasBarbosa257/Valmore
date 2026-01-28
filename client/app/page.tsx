import { Button } from "@/components/ui/button"
import { ArrowRight, Github, BarChart3, Brain, LineChart } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <main className="bg-background text-foreground">
      <section className="relative overflow-hidden py-16">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[-100px] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-accent/20 blur-[140px]" />
        </div>

        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl text-center">
            <span className="mb-4 inline-block rounded-full border px-4 py-1 text-sm text-muted-foreground">
              Insights estratégicos a partir do Jira
            </span>

            <h1 className="mb-6 text-balance text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              Clareza real sobre a <br />
              <span className="bg-accent bg-clip-text text-transparent">
                entrega de valor
              </span>
            </h1>

            <p className="mx-auto mb-12 max-w-3xl text-pretty text-lg text-muted-foreground md:text-xl">
              O <strong>Valmore</strong> transforma dados técnicos do Jira em insights claros para CEOs e líderes.
              Acompanhe progresso, gargalos e impacto real das entregas com apoio de inteligência artificial.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/chat">
                <Button
                  size="lg"
                  className="group bg-accent/90 text-accent-foreground hover:bg-accent/70 cursor-pointer"
                >
                  Experimentar o Valmore
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>

              <a
                href="https://github.com/LucasBarbosa257/Valmore"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="
                    gap-2 cursor-pointer
                    hover:bg-white hover:text-black hover:border-black
                  "
                >
                  <Github className="h-4 w-4" />
                  Ver no GitHub
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-semibold md:text-4xl">
              De dados operacionais a decisões estratégicas
            </h2>
            <p className="text-muted-foreground">
              O Valmore atua como um agente de IA que interpreta o Jira do ponto de vista da liderança.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <Brain className="mb-4 h-8 w-8 text-accent" />
              <h3 className="mb-2 text-lg font-semibold">IA focada em gestão</h3>
              <p className="text-sm text-muted-foreground">
                Insights gerados com linguagem executiva, sem ruído técnico.
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <BarChart3 className="mb-4 h-8 w-8 text-accent" />
              <h3 className="mb-2 text-lg font-semibold">Visão clara do progresso</h3>
              <p className="text-sm text-muted-foreground">
                Entenda o que está avançando, o que está parado e por quê.
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <LineChart className="mb-4 h-8 w-8 text-accent" />
              <h3 className="mb-2 text-lg font-semibold">Entrega de valor real</h3>
              <p className="text-sm text-muted-foreground">
                Acompanhe impacto de entregas, não apenas tarefas concluídas.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
