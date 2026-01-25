import { ConflictException, Injectable } from '@nestjs/common';
import { UserIntegrationsService } from 'src/user-integrations/user-integrations.service';
import { UserIntegration } from 'src/user-integrations/interfaces';
import { JiraClient } from './jira.client';
import { GetProjectsResult } from './interfaces';

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
}
