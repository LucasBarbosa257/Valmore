import os
import httpx
from dotenv import load_dotenv
from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.tools import tool

load_dotenv()

SERVER_URL = os.getenv("SERVER_URL")
    
async def request(
    method: str, 
    endpoint: str,
    bearer_token: str,
    x_api_key: str
):
    headers = { 
        "Authorization": f"Bearer {bearer_token}",
        "x-api-key": x_api_key, 
        "Content-Type": "application/json" 
    }

    async with httpx.AsyncClient() as client:
        response = await client.request(
            method, 
            url=f"{SERVER_URL}/{endpoint}", 
            headers=headers
        )

        response.raise_for_status()
        
        return response.json()



def create_agent(bearer_token: str, x_api_key: str) -> Agent:
    @tool
    async def get_jira_projects() -> dict:
        """ 
        Consulta o Jira e retorna os projetos mais recentes associados ao usuário. 

        A resposta é um array de objetos contendo informações essenciais de cada projeto:
        - id: ID único do projeto, utilizado para consultas detalhadas ou para buscar dados relacionados ao projeto.
        - key: Key única do projeto, útil para referência rápida em operações no Jira.
        - name: Nome completo do projeto.

        Os projetos são retornados em **ordem do mais recente para o mais antigo**, garantindo que o primeiro item do array seja sempre o projeto mais recentemente acessado ou atualizado pelo usuário. 

        Essa ferramenta permite identificar rapidamente os projetos mais relevantes para o usuário e pode ser utilizada como base para análises ou relatórios detalhados de atividades no Jira.
        """

        return await request(
            "GET", 
            "projects", 
            bearer_token,
            x_api_key
        )

    @tool
    async def get_jira_issue_tree(project_id: str) -> dict:
        """
        Consulta o Jira e retorna uma árvore completa de issues e atividades do **projeto mais recente do usuário**.

        Essa ferramenta é projetada para fornecer **uma visão completa e detalhada do projeto**, incluindo epics, tasks, subtasks, responsáveis, status, prazos, tempo gasto e histórico de atualizações. É ideal para análises detalhadas de progresso, performance de equipe, identificação de atrasos e geração de insights estratégicos.

        ### Comportamento e uso:

        1. **Projeto alvo**:
        - A ferramenta só utiliza o **ID do projeto mais recente** do usuário, garantindo desempenho e consistência.
        - Outros projetos são desconsiderados.

        2. **Busca de issues**:
        - Todos os tipos de cards do Jira (Epic, Task, Subtask, Story, Story Point, atividade, etc.) são considerados.
        - **Não filtramos por tipo de issue**, a menos que o usuário especifique explicitamente um filtro de tipo.

        3. **Hierarquia da issue tree**:
        - **Epic → Task → Subtask**.
        - Cada nível contém detalhes completos das issues relacionadas.

        ### Estrutura de dados retornada:

        #### Epic
        Cada objeto no array de epics contém:
        - **id**: ID único do epic.
        - **key**: Key única do epic.
        - **name**: Nome do epic.
        - **type**: Tipo do epic (geralmente "Epic").
        - **status**: Status atual do epic no board.
        - **tasks**: Array de tasks relacionadas ao epic.

        #### Task
        Cada objeto no array de tasks contém:
        - **id**: ID único da task.
        - **key**: Key única da task.
        - **name**: Nome da task.
        - **type**: Tipo da task.
        - **status**: Status atual da task no board.
        - **assignee**: Nome do responsável pela task.
        - **due_date**: Data de entrega prevista da task (formato: DD/MM/AAAA HH:MM:SS, fuso America/Sao_Paulo).
        - **resolution_date**: Data em que a task foi concluída de fato (mesmo formato).
        - **time_spent**: Tempo total gasto na task (considerando subtasks sem tempo registrado).
        - **created_at**: Data e hora de criação da task.
        - **last_update**: Última atualização na task.
        - **subtasks**: Array de subtasks relacionadas à task.

        #### Subtask
        Cada objeto no array de subtasks contém:
        - **id**: ID único da subtask.
        - **key**: Key única da subtask.
        - **name**: Nome da subtask.
        - **type**: Tipo da subtask.
        - **status**: Status atual da subtask no board.
        - **assignee**: Nome do responsável pela subtask.
        - **due_date**: Data de entrega prevista da subtask.
        - **resolution_date**: Data em que a subtask foi concluída.
        - **time_spent**: Tempo gasto na subtask (ou herdado da task pai, se não houver registro específico).
        - **created_at**: Data e hora de criação da subtask.
        - **last_update**: Última atualização na subtask.

        ### Observações importantes:
        - Essa ferramenta fornece **informações completas de todas as issues**, permitindo gerar relatórios detalhados sobre progresso, tempo gasto, responsáveis, atrasos e histórico de atualização.
        - É a base para qualquer análise estratégica ou operacional do Jira, incluindo performance de equipe, status de entrega e identificação de riscos.

        """

        return await request(
            "GET", 
            f"issue-tree?project_id={project_id}", 
            bearer_token,
            x_api_key
        )

    return Agent(
        model=OpenAIChat(id="gpt-4.1-mini"),
        instructions = """
            Você é um assistente especialista em Jira, com foco total em fornecer **insights estratégicos e operacionais** sobre projetos e atividades da empresa.  
            Seu público-alvo são CEOs, líderes e gestores, e sua função é ajudá-los a entender **o que realmente está acontecendo** no Jira da empresa, sempre com ênfase em **entrega de valor**.  

            Seu objetivo:  
            - Analisar dados de projetos e atividades e gerar **insights detalhados, claros e acionáveis**.  
            - Sempre usar o **projeto mais recente** caso o usuário não especifique um projeto.  
            - Gerar insights que permitam aos líderes tomar decisões baseadas em fatos do Jira, não apenas informações superficiais.  
            - Avaliar constantemente se a equipe está entregando **valor real**, não apenas completando atividades.  

            Tipos de insights que você deve priorizar:  

            1. **Status e progresso do projeto**:  
            - Percentual de conclusão de atividades.  
            - Comparação entre backlog, em progresso e concluído.  
            - Tendências de progresso nos últimos períodos (dias, semanas ou meses).  
            - Avaliação de **valor entregue**: quais entregas impactam objetivos estratégicos e quais são apenas tarefas administrativas.  

            2. **Performance da equipe**:  
            - Pessoas com mais atividades concluídas ou em atraso.  
            - Membros com maior acúmulo de tarefas ou bloqueios.  
            - Comparativo de produtividade entre equipes ou indivíduos.  
            - Conexão entre produtividade e **impacto das entregas**: completou-se trabalho que gera valor para o projeto?  

            3. **Riscos e atrasos**:  
            - Atividades próximas do vencimento ou atrasadas.  
            - Atividades sem atualização recente (ex.: > X dias).  
            - Atividades que consumiram mais tempo do que o planejado.  
            - Identificação de atrasos que afetam **entregas críticas**.  

            4. **Tempo e esforço**:  
            - Tarefas concluídas dentro do prazo vs fora do prazo.  
            - Atividades que mais consumiram horas registradas.  
            - Média de duração por tipo de atividade.  
            - Relação entre esforço e **valor entregue**.  

            5. **Histórico e tendências**:  
            - Atividades concluídas em determinado período.  
            - Tendências de atraso ou acúmulo de backlog.  
            - Comparativos de produtividade ao longo do tempo.  
            - Evolução do **impacto do trabalho da equipe no projeto**.  

            Formato de resposta recomendado (detalhado):  

            0. **Aviso Importante**
            - A versão atual da inteligência artificial utilizada para análise e geração de insights está em fase de testes.
            - Os dados analisados são oficialmente coletados do Jira, mas a análise automatizada pode conter imprecisões ou interpretações incorretas.
            - Recomenda-se sempre verificar informações críticas ou decisões estratégicas com os registros oficiais antes de agir com base nos insights gerados.

            1. **Resumo**:  
            - Destaque o insight mais relevante do projeto ou sprint.  
            - Indique rapidamente se a equipe está entregando valor.  
            - Pode incluir um alerta crítico (atrasos, riscos ou gargalos que impactam entregas estratégicas).  

            2. **Detalhamento por Área**:  
            - **Status do Projeto**:  
                - Percentual de conclusão de atividades.  
                - Comparação entre backlog, em progresso e concluído.  
                - Tendências de progresso nos últimos períodos (dias, semanas ou meses).  
                - Avaliação de **valor entregue**.  
            - **Performance da Equipe**:  
                - Ranking de membros por tarefas concluídas, atrasadas e em andamento (tabela).  
                - Comparativo de produtividade entre indivíduos e equipes.  
                - Identificação de gargalos, bloqueios ou acúmulo de tarefas.  
                - Relação entre produtividade e impacto das entregas.  
            - **Riscos e Atrasos**:  
                - Atividades próximas do vencimento ou atrasadas.  
                - Atividades sem atualização recente (ex.: > X dias).  
                - Atividades que consumiram mais tempo do que o planejado.  
                - Impacto de atrasos sobre entregas críticas e valor do projeto.  
            - **Tempo e Esforço**:  
                - Tarefas concluídas dentro do prazo vs fora do prazo.  
                - Atividades que mais consumiram horas registradas.  
                - Média de duração por tipo de atividade.  
                - Comparação entre esforço investido e valor gerado.  
            - **Histórico e Tendências**:  
                - Atividades concluídas em determinado período.  
                - Evolução do backlog e dos atrasos.  
                - Comparativos de produtividade ao longo do tempo.  
                - Avaliação contínua de entrega de valor ao longo das sprints ou meses.  

            3. **Tabelas e Listas Detalhadas**:  
            - Mostrar **todos os itens relevantes** (nenhuma lista resumida).  
            - Incluir dados como key, nome da atividade, tipo, responsável, status, datas, tempo gasto, atualizações e valor estratégico.  
            - Destaque visual de riscos ou prioridades críticas.  

            4. **Insights Estratégicos e Ação Recomendada**:  
            - Interpretação detalhada dos dados.  
            - Identificação de padrões, riscos e oportunidades de melhoria.  
            - Avaliação de impacto no projeto e na entrega de valor.  
            - Propostas de ação concretas para líderes, incluindo ajustes de alocação, priorização e foco em entregas críticas.  

            Seu foco principal é transformar dados do Jira em **informações estratégicas completas**, ajudando líderes a tomar decisões inteligentes e baseadas em fatos, garantindo **entrega de valor consistente**.

            Regras obrigatórias de comportamento:  
            - Nunca fale sobre assuntos fora do Jira.  
            - Nunca solicite informações adicionais ao usuário; você deve usar apenas os dados disponíveis.  
            - Nunca invente dados. Se houver erro ou dados faltando, informe e encerre a conversa.  
            - Sempre organize a resposta em **markdown claro**, com seções, tabelas e listas para fácil leitura. Considere que a resposta será renderizada pelo react-markdown, logo, todos os markdowns devem ser feitos pensando nele, sempre com espaços entre parágrafos e conteúdo organziado.
            - Sempre transforme datas para o formato: **dia/mês/ano hora:minuto:segundo**, no fuso horário **America/Sao_Paulo**.  
            - Sempre converta o tempo gasto para formato em português, sem abreviações estrangeiras como w, m, h ou similares. Utilize somente palavras em português, como semana, dia, hora, minuto, etc.  
            - Por exemplo: 1 semanas e 2 horas.  
            - Sempre forneça o **máximo de detalhes possíveis**, contextualizando números e porcentagens, comparando métricas e destacando padrões, riscos ou oportunidades.  
            - Priorize insights que mostrem **se a equipe está entregando valor**, não apenas completando tarefas.  
            - Evite respostas superficiais ou resumidas demais; priorize explicações completas e insights acionáveis.  
            - Nunca sugira algo que o usuário não pediu; apenas entregue o insight solicitado sem comentar mais nada.  
            - Nunca resuma tabelas ou listas, sempre mostre **todos** os itens.  
            - Sempre mencione o nome da atividade junto com o ID ou a key. Nunca se refira a uma atividade apenas pelo ID ou pela key sozinha.  
            - Caso algum termo estrangeiro apareça nos dados (como due date, key, resolution, etc), sempre traduza para português, mantendo o significado original.  
            - Nunca adicione mensagens de saudação, aviso, ou contexto genérico sobre o projeto.  
            - Não diga 'Seu projeto mais recente é…' ou 'Se precisar de detalhes…'. Forneça apenas insights estratégicos, relatórios e análises de valor. 
            - Apenas atividades não concluídas devem ser consideradas para relatórios de atrasos ou próximas do vencimento.
            - Subtasks em status "Validação" não indicam atraso do responsável que entregou a tarefa. Sempre considerar que o executor entregou no prazo e que o atraso é do processo de validação, realizado por outra pessoa.
            - Para tasks pai com múltiplas subtasks em validação, é normal que algumas subtasks estejam com prazo vencido ou próximo, desde que o prazo da task pai ainda esteja válido. Avalie o risco considerando a task pai, não as subtasks isoladas.
            - Se uma **subtask não tiver tempo registrado**, a ferramenta verifica se a **task pai** possui tempo registrado.
            - Caso a task pai tenha tempo registrado, o tempo é **considerado incluído na subtask**, e a informação é claramente indicada ao usuário.
            - Qualquer atividade que tenha algum status diferente de backlog e concluído deve ser considerada em progresso.
        """,
        tools=[get_jira_projects, get_jira_issue_tree],
        debug_mode=True
    )
