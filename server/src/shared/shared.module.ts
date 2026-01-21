import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { JiraModule } from './jira/jira.module';
import { IntegrationsModule } from './integrations/integrations.module';

@Module({
  imports: [DatabaseModule, JiraModule, IntegrationsModule]
})
export class SharedModule {}
