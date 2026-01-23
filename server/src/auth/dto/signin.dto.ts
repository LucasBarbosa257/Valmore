import { IsEmail, IsString, Length, MaxLength } from "class-validator";

export class SignInDto {
    @IsString()
    @IsEmail()
    @MaxLength(100)
    email: string;

    @IsString()
    @Length(8, 50)
    password: string;
}