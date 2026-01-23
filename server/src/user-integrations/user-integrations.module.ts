import { Module } from '@nestjs/common';
import { UserIntegrationsService } from './user-integrations.service';

@Module({
  providers: [UserIntegrationsService]
})
export class UserIntegrationsModule {}
