import { IsString, maxLength } from "class-validator";

export class CreateUserIntegrationDto {
    @IsString()
    provider: string;

    host: string;

    api_token: string;
}