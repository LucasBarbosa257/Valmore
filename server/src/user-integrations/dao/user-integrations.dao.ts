import { Injectable } from "@nestjs/common";
import { DatabaseConnection } from "src/shared/database/database.connection";
import { CreateUserIntegrationInput, FindUserIntegrationByUserIdAndProviderInput, FindUserIntegrationsByUserIdInput, UpdateUserIntegrationInput, UserIntegration } from "../interfaces";

@Injectable()
export class UserIntegrationsDao {
    private readonly table = 'user_integrations';

    constructor(
       private readonly dbConnection: DatabaseConnection 
    ) {}

    public async findAllByUserId(
        data: FindUserIntegrationsByUserIdInput
    ): Promise<UserIntegration[]> {
        const query = `
            SELECT *
            FROM ${this.table}
            WHERE user_id = $1
        `;

        return await this.dbConnection.execute(
            query,
            [data.user_id]
        );
    }

    public async findByUserIdAndProvider(
        data: FindUserIntegrationByUserIdAndProviderInput
    ): Promise<UserIntegration | null> {
        const query = `
            SELECT *
            FROM ${this.table}
            WHERE user_id = $1 AND provider = $2
        `;

        const result = await this.dbConnection.execute(
            query,
            [
                data.user_id,
                data.provider
            ]
        );

        return result[0] ?? null;
    }

    public async create(
        data: CreateUserIntegrationInput
    ): Promise<void> {
        const query = `
            INSERT INTO ${this.table} (
                id,
                user_id,
                provider
            ) VALUES (
                $1, $2, $3
            )
        `;

        await this.dbConnection.execute(
            query,
            [
                data.id,
                data.user_id,
                data.provider
            ]
        );
    }

    public async update(
        data: UpdateUserIntegrationInput
    ): Promise<void> {
        const query = `
            UPDATE ${this.table}
            SET
                host = $1,
                email = $2,
                api_token = $3,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $4
        `;    

        await this.dbConnection.execute(
            query,
            [
                data.host,
                data.email,
                data.api_token,
                data.id
            ]
        );
    }
}