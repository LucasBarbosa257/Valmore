import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersDao } from './dao';
import { UserIntegrationsModule } from 'src/user-integrations/user-integrations.module';

@Module({
  imports: [UserIntegrationsModule],
  providers: [
    UsersService, 
    UsersDao
  ],
  exports: [UsersService],
})
export class UsersModule {}
