import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Injectable()
export class DatabaseConnection implements OnModuleDestroy {
    private readonly pool: Pool;

    constructor(
        private readonly configService: ConfigService
    ) {
        this.pool = new Pool({
            host: this.configService.getOrThrow('DATABASE_HOST'),
            port: Number(this.configService.getOrThrow('DATABASE_PORT')),
            database: this.configService.getOrThrow('DATABASE_NAME'),
            user: this.configService.getOrThrow('DATABASE_USER'),
            password: this.configService.getOrThrow('DATABASE_PASSWORD'),
            max: 10
        });
    }

    public async execute(
        query: string,
        values: any[] = [],
    ): Promise<any[]> {
        const result = await this.pool.query(query, values);

        return result.rows;
    }

    public async onModuleDestroy() {
        await this.pool.end();
    }
}
