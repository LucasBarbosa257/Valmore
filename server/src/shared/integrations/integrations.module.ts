import { Module } from '@nestjs/common';
import { JiraModule } from './jira/jira.module';

@Module({
  imports: [JiraModule]
})
export class IntegrationsModule {}
