import { ConflictException, Injectable } from '@nestjs/common';
import { UserIntegrationsService } from 'src/user-integrations/user-integrations.service';
import { UserIntegration } from 'src/user-integrations/interfaces';
import { JiraClient } from './jira.client';
import { GetProjectsResult, JiraIssue, JiraIssueTree, MappedJiraEpic, MappedJiraIssue, GetIssuesResult } from './interfaces';



@Injectable()
export class JiraService {
    constructor(
        private readonly userIntegrationsService: UserIntegrationsService
    ) { }

    public async getProjects(
        data: {
            user_id: string;
        }
    ): Promise<any> {
        const jiraClient = await this.getJiraClient(data.user_id);

        const response: GetProjectsResult[] = await jiraClient.fetch({
            method: 'GET',
            endpoint: 'project/recent'
        });

        const projects = response.map(
            (project) => ({
                id: project.id,
                key: project.key,
                name: project.name
            })
        );

        return projects;
    }

    public async getIssueTree(
        data: {
            user_id: string;
            project_id: string;
        }
    ): Promise<JiraIssueTree> {
        const jiraClient = await this.getJiraClient(data.user_id);

        const response: GetIssuesResult = await jiraClient.fetch({
            method: 'POST',
            endpoint: 'search/jql',
            body: {
                jql: `project = ${data.project_id} ORDER BY created DESC`,
                maxResults: 100,
                fields: [
                    'summary',
                    'issuetype',
                    'parent',
                    'assignee',
                    'status',
                    'duedate',
                    'resolutiondate',
                    'timetracking',
                    'created',
                    'updated',
                ]
            }
        });

        const mappedIssues = this.mapIssues(response.issues);

        return this.generateIssueTree(mappedIssues);
    }

    private async getJiraClient(
        user_id: string
    ): Promise<JiraClient> {
        const userIntegration = await this.getUserIntegration(user_id);

        return new JiraClient(
            userIntegration.host,
            userIntegration.email,
            userIntegration.api_token
        );
    }

    private async getUserIntegration(
        user_id: string
    ): Promise<UserIntegration> {
        const userIntegration = await this.userIntegrationsService.findByUserIdAndProvider({
            user_id,
            provider: 'jira'
        });

        if (!userIntegration || !userIntegration.host) {
            throw new ConflictException('Jira integration is not configured for this user');
        }

        return userIntegration;
    }

    private mapIssues(
        issues: JiraIssue[]
    ): MappedJiraIssue[] {
        return issues.map(
            (issue) => ({
                id: issue.id,
                key: issue.key,
                name: issue.fields.summary,
                type: issue.fields.issuetype?.name ?? null,
                status: issue.fields.status?.name ?? null,
                assignee: issue.fields.assignee?.displayName ?? null,
                due_date: issue.fields.duedate,
                resolution_date: issue.fields.resolutiondate,
                time_spent: issue.fields.timetracking?.timeSpent ?? null,
                created_at: issue.fields.created,
                last_update: issue.fields.updated,
                parent: {
                    id: issue.fields.parent?.id ?? null,
                    key: issue.fields.parent?.key ?? null,
                    name: issue.fields.parent?.fields?.summary ?? null,
                    type: issue.fields.parent?.fields?.issuetype?.name ?? null,
                    status: issue.fields.parent?.fields?.status?.name ?? null
                }
            })
        );
    }

    private generateIssueTree(
        mappedIssues: MappedJiraIssue[]
    ): JiraIssueTree {
        const issueTree = new Map();

        mappedIssues.forEach(issue => {
            if (issue.parent?.type === 'Epic' && !issueTree.has(issue.parent.id)) {
                issueTree.set(issue.parent.id, {
                    ...issue.parent,
                    tasks: []
                });
            }
        });

        mappedIssues.forEach(issue => {
            if (issue.type === 'Task' && issueTree.has(issue.parent.id)) {
                const epic: MappedJiraEpic = issueTree.get(issue.parent.id);

                const alreadyExists = epic.tasks.some(
                    (task) => task.id === issue.id
                );

                if (!alreadyExists) {
                    const { parent, ...taskWithoutParent } = issue;

                    epic.tasks.push({
                        ...taskWithoutParent,
                        subtasks: []
                    });
                }
            }
        });

        mappedIssues.forEach(issue => {
            if (issue.type === 'Subtask') {
                issueTree.forEach((epic: MappedJiraEpic) => {
                    const task = epic.tasks.find(
                        (task) => task.id === issue.parent.id
                    );

                    if (!task) return;

                    const alreadyExists = task.subtasks.some(
                        (subtask) => subtask.id === issue.id
                    );

                    if (!alreadyExists) {
                        const { parent, ...subtaskWithoutParent } = issue;

                        task.subtasks.push(subtaskWithoutParent);
                    }
                });
            }
        });


        return {
            epics: Array.from(issueTree.values())
        };
    }
}
