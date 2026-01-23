import { Module } from '@nestjs/common';
import { JiraModule } from './jira/jira.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [JiraModule, AiModule]
})
export class IntegrationsModule {}
