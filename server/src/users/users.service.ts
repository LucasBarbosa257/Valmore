import { Injectable } from '@nestjs/common';
import { UsersDao } from './dao';
import { CreateUserPayload, FindUserByEmailPayload, User } from './interfaces';
import { randomUUID } from 'crypto';
import { UserIntegrationsService } from 'src/user-integrations/user-integrations.service';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersDao: UsersDao,
        private readonly userIntegrationsService: UserIntegrationsService
    ) { }

    public async findByEmail(
        data: FindUserByEmailPayload
    ): Promise<User | null> {
        return await this.usersDao.findByEmail(data);
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
