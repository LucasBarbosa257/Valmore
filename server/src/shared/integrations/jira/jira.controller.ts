import { Controller, Get, Query, Request } from '@nestjs/common';
import { JiraService } from './jira.service';
import { AuthRequestDto } from 'src/auth/dto';

@Controller('integrations/jira')
export class JiraController {
    constructor(
        private readonly jiraService: JiraService
    ) {}

    @Get('projects')
    public async getProjects(
        @Request() req: AuthRequestDto
    ): Promise<any> {
        return await this.jiraService.getProjects({
            user_id: req.user.sub
        });
    }

    @Get('issue-tree')
    public async getIssueTree(
        @Request() req: AuthRequestDto,
        @Query('project_id') projectId: string
    ): Promise<any> {
        return await this.jiraService.getIssueTree({
            user_id: req.user.sub,
            project_id: projectId
        });
    }
}
