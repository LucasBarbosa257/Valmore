import { Injectable } from '@nestjs/common';
import { UsersDao } from './dao';
import { CreateUserPayload, FindUserByEmailInput, User } from './interfaces';
import { randomUUID } from 'crypto';
import { UserIntegrationsService } from 'src/user-integrations/user-integrations.service';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersDao: UsersDao,
        private readonly userIntegrationsService: UserIntegrationsService
    ) { }

    public async findByEmail(
        data: FindUserByEmailInput
    ): Promise<User | null> {
        return await this.usersDao.findByEmail({
            email: data.email
        });
    }

    public async create(
        data: CreateUserPayload
    ): Promise<string> {
        const id = randomUUID();

        await this.usersDao.create({
            id,
            name: data.name,
            email: data.email,
            password: data.password
        });

        await this.userIntegrationsService.create({
            user_id: id,
            provider: 'jira'
        });

        return id;
    }
}
