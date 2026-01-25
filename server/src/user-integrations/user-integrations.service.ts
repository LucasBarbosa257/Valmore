import { Injectable } from '@nestjs/common';
import { UserIntegrationsDao } from './dao';
import { randomUUID } from 'crypto';
import { UpdateUserIntegrationDto } from './dto/update-user-integration.dto';
import { CreateUserIntegrationPayload, FindUserIntegrationByUserIdAndProviderInput, FindUserIntegrationsByUserIdInput, UserIntegration } from './interfaces';

@Injectable()
export class UserIntegrationsService {
    constructor(
        private readonly userIntegrationsDao: UserIntegrationsDao
    ) {}

    public async findAllByUserId(
        data: FindUserIntegrationsByUserIdInput
    ): Promise<UserIntegration[]> {
        return await this.userIntegrationsDao.findAllByUserId({
            user_id: data.user_id
        });
    }

    public async findByUserIdAndProvider(
        data: FindUserIntegrationByUserIdAndProviderInput
    ): Promise<UserIntegration | null> {
        return await this.userIntegrationsDao.findByUserIdAndProvider({
            user_id: data.user_id,
            provider: data.provider
        });
    }

    public async create(
        data: CreateUserIntegrationPayload
    ): Promise<void> {
        await this.userIntegrationsDao.create({
            id: randomUUID(),
            user_id: data.user_id,
            provider: data.provider
        });
    }

    public async update(
        data: UpdateUserIntegrationDto
    ): Promise<void> {
        await this.userIntegrationsDao.update({
            id: data.id,
            host: data.host,
            email: data.email,
            api_token: data.api_token
        });
    }
}
