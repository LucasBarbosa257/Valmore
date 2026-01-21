import { Body, Controller, Post } from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('signup')
    public async signup(
        @Body() body: SignupDto
    ): Promise<AuthResponseDto> {
        return this.authService.signup(body);
    }
}
