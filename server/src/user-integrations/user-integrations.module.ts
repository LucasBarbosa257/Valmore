import { Module } from '@nestjs/common';
import { UserIntegrationsService } from './user-integrations.service';
import { UserIntegrationsDao } from './dao';
import { UserIntegrationsController } from './user-integrations.controller';

@Module({
  providers: [
    UserIntegrationsService,
    UserIntegrationsDao
  ],
  exports: [UserIntegrationsService],
  controllers: [UserIntegrationsController]
})
export class UserIntegrationsModule {}
