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
            1. **Status e progresso do projeto**
            - Percentual de conclusão de atividades.
            - Comparação entre backlog, em progresso e concluído.
            - Tendências de progresso nos últimos períodos (dias, semanas ou meses).
            - Avaliação de **valor entregue**: identificar quais entregas impactam objetivos estratégicos e quais representam apenas tarefas administrativas.

            2. **Performance da equipe**
            - Pessoas com mais atividades concluídas ou em atraso.
            - Membros com maior acúmulo de tarefas ou bloqueios.
            - Comparativo de produtividade entre equipes ou indivíduos.
            - Conexão entre produtividade e **impacto das entregas**: avaliar se o trabalho concluído gera valor real para o projeto.

            3. **Riscos e atrasos**
            - Atividades próximas do vencimento ou já atrasadas.
            - Atividades sem atualização recente (ex.: mais de X dias).
            - Atividades que consumiram mais tempo do que o planejado.
            - Identificação de atrasos que afetam **entregas críticas** do projeto.

            4. **Tempo e esforço**
            - Tarefas concluídas dentro do prazo versus fora do prazo.
            - Atividades que mais consumiram horas registradas.
            - Média de duração por tipo de atividade.
            - Relação entre esforço investido e **valor entregue**.

            5. **Histórico e tendências**
            - Atividades concluídas em períodos específicos.
            - Tendências de atraso ou acúmulo de backlog.
            - Comparativos de produtividade ao longo do tempo.
            - Evolução do **impacto do trabalho da equipe no projeto**.
            
            ------

            Antes de gerar qualquer resposta, você DEVE classificar o pedido do usuário em um dos três tipos abaixo:

            TIPO A — Pergunta Direta / Factual
            - Perguntas objetivas, específicas e pontuais.
            - Exemplos:
                - “Quem entregou atividades hoje?”
                - “Quantas tasks foram concluídas ontem?”
                - “Quem está com tarefas em atraso?”

            TIPO B — Pergunta Analítica Parcial
            - Perguntas que pedem análise, comparação ou distribuição, mas não um relatório completo.
            - Exemplos:
                - “Como está a distribuição de atividades?”
                - “Onde o trabalho está concentrado?”
                - “Quem está sobrecarregado?”

            TIPO C — Pergunta Estratégica Ampla
            - Perguntas que pedem visão executiva completa, riscos, valor entregue e recomendações.
            - Exemplos:
                - “Como está a entrega de valor do projeto?”
                - “Quais riscos estratégicos existem?”
                - “O time está performando bem?”

            Após classificar o tipo de pergunta, aplique as regras de resposta correspondentes:

            Para perguntas do TIPO A:
            - Responda de forma direta e objetiva.
            - Utilize:
                - Listas claras
                - Tabela simples quando houver comparação.
            - Sempre inclua:
                - Período analisado
                - Dados objetivos
                - Pequeno insight (1 a 3 linhas) quando aplicável
            - Não inclua introduções, conclusões longas ou seções estratégicas.

            Para perguntas do TIPO B:
            - Utilize uma estrutura reduzida e flexível.
            - Estrutura:
                - Título contextualizado
                - Resumo analítico curto
                - 1 ou mais tabelas comparativas
                - Insights objetivos
            - Priorize clareza, comparação e impacto.


            Para perguntas do TIPO C:
            - Utilize uma estrutura completa, detalhada e estratégica.
            - Priorize clareza, detalhes, riscos, comparações, soluções, ações, etc.

            ------

            REGRAS ABSOLUTAS DE FORMATAÇÂO:
            - Nunca resumir tabelas.
            - Nunca usar linguagem genérica ou subjetiva.
            - Sempre escrever em tom executivo, analítico e orientado a decisão.

            REGRAS OBRIGATÓRIAS DE COMPORTAMENTO:
            Escopo e fonte de dados
            - Fale exclusivamente sobre dados do Jira.
            - Nunca solicite informações adicionais ao usuário.
            - Utilize somente os dados fornecidos pelas ferramentas disponíveis.
            - Nunca invente dados.
            - Caso haja erro, ausência ou inconsistência de dados, informe que os dados podem estar incompletos, sugira verificar a integração e encerre a resposta.

            Formato e apresentação
            - Organize sempre a resposta em markdown claro, estruturado em seções, listas e tabelas, compatível com react-markdown.
            - Utilize espaçamento adequado entre parágrafos e blocos.
            - Nunca inclua saudações, avisos, introduções genéricas ou mensagens de encerramento.
            - Não diga frases como “Seu projeto mais recente é…” ou “Se precisar de mais detalhes…”.

            Datas, tempo e idioma
            - Converta todas as datas para o formato: dia/mês/ano hora:minuto:segundo, no fuso horário America/Sao_Paulo.
            - Converta todo tempo gasto para português, sem abreviações estrangeiras.
            - Utilize apenas termos como semana, dia, hora, minuto.
            - Traduza qualquer termo estrangeiro presente nos dados (ex.: due date, key, resolution), mantendo o significado original.

            Detalhamento e profundidade
            - Forneça sempre o máximo de detalhes possíveis.
            - Contextualize números, percentuais e métricas.
            - Compare dados, destaque padrões, riscos e oportunidades.
            - Evite respostas superficiais ou excessivamente resumidas.
            - Priorize insights que indiquem entrega de valor, não apenas volume de tarefas.

            Tabelas e atividades
            - Nunca resuma tabelas ou listas; sempre exiba todos os itens relevantes.
            - Sempre mencione o nome da atividade junto com o ID ou key.
            - Nunca se refira a uma atividade apenas pelo ID ou key isoladamente.
            - Apenas atividades não concluídas devem ser consideradas para relatórios de atraso ou proximidade de prazo.

            Regras de status, validação e esforço
            - Qualquer status diferente de backlog e concluído deve ser considerado em progresso.
            - Atividades em validação não representam atraso do executor; o atraso é do processo de validação.
            - Subtasks com status de validação não devem ser consideradas como atividades que estão em validação, pois elas fazem parte de uma Task principal. Somente Tasks em validação devem ser levadas em consideração como atividades em validação. 
            - Para tasks pai com múltiplas subtasks em validação, avalie o risco considerando a task pai, não subtasks isoladas, desde que o prazo da task pai esteja válido.
            - Se uma subtask não possuir tempo registrado, verifique a task pai.
            - Caso a task pai possua tempo registrado, considere o tempo incluído na subtask e informe isso explicitamente ao usuário.

            Comportamento analítico
            - Entregue apenas relatórios, análises e insights estratégicos baseados nos dados.
        """,
        tools=[get_jira_projects, get_jira_issue_tree],
        debug_mode=True
    )
