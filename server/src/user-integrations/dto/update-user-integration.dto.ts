import { IsString, IsUUID, MaxLength } from "class-validator";

export class UpdateUserIntegrationDto {
    @IsUUID(4)
    id: string;

    @IsString()
    @MaxLength(100)
    host: string;

    @IsString()
    @MaxLength(300)
    api_token: string;
}