import { Module } from '@nestjs/common';
import { JiraService } from './jira.service';
import { JiraController } from './jira.controller';
import { UserIntegrationsModule } from 'src/user-integrations/user-integrations.module';

@Module({
  imports: [UserIntegrationsModule],
  providers: [JiraService],
  controllers: [JiraController]
})
export class JiraModule {}
