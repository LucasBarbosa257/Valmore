import { Controller, Get, Request } from '@nestjs/common';
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
    ) {
        return await this.jiraService.getProjects({
            user_id: req.user.sub
        });
    }
}
