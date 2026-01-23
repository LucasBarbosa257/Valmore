import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { IntegrationsModule } from './integrations/integrations.module';

@Global()
@Module({
  imports: [
    DatabaseModule, 
    IntegrationsModule
  ],
  exports: [
    DatabaseModule, 
    IntegrationsModule
  ]
})
export class SharedModule {}
