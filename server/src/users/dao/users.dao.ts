import { Injectable } from "@nestjs/common";
import { CreateUserInput, FindUserByEmailInput, User } from "../interfaces";
import { DatabaseConnection } from "src/shared/database/database.connection";

@Injectable()
export class UsersDao {
    private readonly table = 'users';

    constructor(
        private readonly dbConnection: DatabaseConnection
    ) { }

    public async findByEmail(
        data: FindUserByEmailInput
    ): Promise<User | null> {
        const query = `
            SELECT *
            FROM ${this.table}
            WHERE EMAIL = $1
            LIMIT 1;
        `;

        const result = await this.dbConnection.execute(
            query,
            [data.email]
        );

        return result[0] ?? null;
    }

    public async create(
        data: CreateUserInput
    ): Promise<void> {
        const query = `
            INSERT INTO ${this.table} (
                id,
                name,
                email,
                password
            ) VALUES ( 
                $1, $2, $3, $4 
            );
        `;

        await this.dbConnection.execute(
            query,
            [
                data.id,
                data.name,
                data.email,
                data.password
            ]
        );
    }
}