import { Module } from '@nestjs/common';
import { JiraModule } from './jira/jira.module';
import { OpenAiModule } from './open-ai/open-ai.module';

@Module({
  imports: [JiraModule, OpenAiModule]
})
export class IntegrationsModule {}
