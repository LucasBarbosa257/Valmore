import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    constructor(
        private readonly configService: ConfigService
    ) { }

    canActivate(
        context: ExecutionContext
    ): boolean {
        const request = context.switchToHttp().getRequest<Request>();

        const apiKey = request.headers['x-api-key'];

        if (!apiKey) {
            throw new UnauthorizedException('API key not provided.');
        }

        const validApiKey = this.configService.getOrThrow<string>('API_KEY');

        console.log(apiKey, validApiKey)
        if (apiKey !== validApiKey) {
            throw new UnauthorizedException('Invalid API key.');
        }

        return true;
    }
}
