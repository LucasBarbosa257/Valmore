import { Injectable } from '@nestjs/common';
import { UsersDao } from './dao';
import { CreateUserPayload, FindUserByEmailPayload, User } from './interfaces';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersDao: UsersDao
    ) { }

    public async findOneByEmail(
        data: FindUserByEmailPayload
    ): Promise<User | null> {
        return await this.usersDao.findOneByEmail(data);
    }

    public async create(
        data: CreateUserPayload
    ): Promise<string> {
        const id = randomUUID();

        await this.usersDao.create({
            id,
            ...data
        });

        return id;
    }
}
