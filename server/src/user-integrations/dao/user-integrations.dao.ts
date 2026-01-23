import { Injectable } from "@nestjs/common";
import { DatabaseConnection } from "src/shared/database/database.connection";
import { CreateUserIntegrationInput, UpdateUserIntegrationInput } from "../interfaces";

@Injectable()
export class UserIntegrationsDao {
    private readonly table = 'user_integrations';

    constructor(
       private readonly dbConnection: DatabaseConnection 
    ) {}

    public async create(
        data: CreateUserIntegrationInput
    ): Promise<void> {
        const query = `
            INSERT INTO ${this.table} (
                id,
                provider,
                host,
                api_token
            ) VALUES (
                $1, $2, $3, $4 
            )
        `;

        await this.dbConnection.execute(
            query,
            [
                data.id,
                data.provider,
                data.host,
                data.api_token
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