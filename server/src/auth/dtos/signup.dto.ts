import { IsEmail, IsNumber, IsString, Length, MaxLength } from "class-validator";

export class SignupDto {
    @IsString()
    @MaxLength(60)
    name: string;
    
    @IsString()
    @IsEmail()
    @MaxLength(100)
    email: string;

    @IsString()
    @Length(8, 50)
    password: string;
}