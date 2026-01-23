import { Body, Controller, Post } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('signup')
    public async signUp(
        @Body() body: SignUpDto
    ): Promise<AuthResponseDto> {
        return await this.authService.signUp(body);
    }

    @Post('signin')
    public async signIn(
        @Body() body: SignInDto
    ): Promise<AuthResponseDto> {
        return await this.authService.signIn(body);
    }

    @Post('logout')
    public async logout(): Promise<void> {
        
    }
}
