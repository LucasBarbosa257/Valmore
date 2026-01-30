# Valmore 🚀

Valmore é uma **plataforma de análise estratégica para lideranças**, baseada em **agentes de Inteligência Artificial**, que transforma dados técnicos do Jira em **insights claros e orientados ao negócio**.

Diferente de ferramentas tradicionais de gestão, o Valmore não se limita a exibir métricas operacionais. Ele **interpreta, correlaciona e contextualiza** informações como cards, épicos, estimativas, tempo registrado e andamento das atividades, entregando respostas diretas para perguntas estratégicas, em tempo real.

A solução elimina relatórios manuais, reduz reuniões operacionais e atua como uma ponte inteligente entre **times técnicos e liderança**, promovendo decisões mais rápidas, transparentes e baseadas em dados confiáveis.

---

## 🖥️ Tecnologias

### Frontend

* **Next.js 15** – framework React moderno para aplicações web.
* **Tailwind CSS 4** – estilização utilitária e responsiva.
* **shadcn/ui** – componentes de interface reutilizáveis e consistentes.
* **Lucide Icons** – biblioteca de ícones leves e customizáveis.
* **TanStack Query** – gerenciamento eficiente de estado assíncrono, cache e sincronização de dados.
* **React Markdown** – renderização e formatação de respostas em Markdown geradas pela IA.

### Backend

* **NestJS** – framework Node.js escalável e modular.
* **JWT Authentication** – autenticação segura de usuários.
* **API Key Guards** – proteção de rotas sensíveis e serviços internos.
* **Jira Client customizado** – camada dedicada para integração com a API do Jira.

### Inteligência Artificial

* **Python** – linguagem principal para os agentes de IA.
* **Agno** – framework para construção de agentes inteligentes.
* **Agentes especializados em gestão estratégica** – foco em análise de projetos, produtividade, riscos e contexto organizacional.
* **Contexto orientado ao Jira** – interpretação semântica de dados técnicos e históricos.

### Banco de Dados

* **PostgreSQL** – banco de dados relacional confiável e escalável.

### Infraestrutura & DevOps

* **Docker & Docker Compose** – padronização do ambiente e orquestração dos serviços.
* **Vercel** – hospedagem do frontend.
* **AWS** – hospedagem do backend, agentes de IA e banco de dados.

---

## ⚙️ Funcionalidades

* Autenticação de usuários via **JWT**.
* Integração com a **API do Jira** para coleta de dados técnicos.
* Análise automática de:
  * Cards, épicos e sprints
  * Estimativas vs. tempo registrado
  * Andamento de atividades
  * Produtividade e gargalos
* Geração de **insights estratégicos em linguagem natural**.
* Respostas diretas para perguntas de liderança.
* Persistência de dados no **PostgreSQL**.
* Interface moderna, responsiva e orientada à leitura estratégica.

---

## 🐳 Executando o projeto localmente

### Pré-requisitos

* Docker
* Docker Compose
* Git

### Passo a passo

```bash
git clone <url-do-repositorio> valmore
cd valmore
```

1. Preencha corretamente todas as variáveis de ambiente (`.env`) dos serviços:

   * Frontend
   * Backend
   * Serviço de IA
   * Banco de dados

2. Suba todo o projeto de uma vez com o Docker:

```bash
docker compose build -d
```

Após isso, **toda a aplicação estará rodando e funcional**, incluindo frontend, backend, agentes de IA e banco de dados.

---

## 📌 Status

🚧 Projeto em evolução contínua, com foco em escalabilidade, novos agentes e análises cada vez mais estratégicas.
