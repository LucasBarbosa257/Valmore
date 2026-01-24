import { Injectable } from "@nestjs/common";
import { DatabaseConnection } from "src/shared/database/database.connection";
import { CreateUserIntegrationInput, UpdateUserIntegrationInput, UserIntegration } from "../interfaces";

@Injectable()
export class UserIntegrationsDao {
    private readonly table = 'user_integrations';

    constructor(
       private readonly dbConnection: DatabaseConnection 
    ) {}

    public async findAll(): Promise<UserIntegration[]> {
        const query = `
            SELECT
                id,
                provider,
                host,
                api_token
            FROM ${this.table}
        `;

        return await this.dbConnection.execute(query);
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
                api_token = $2,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $3
        `;    

        await this.dbConnection.execute(
            query,
            [
                data.host,
                data.api_token,
                data.id
            ]
        );
    }
}