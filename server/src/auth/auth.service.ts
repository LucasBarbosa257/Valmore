import { Injectable } from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { AuthResponseDto } from './dtos';

@Injectable()
export class AuthService {
    public async signup(
        data: SignupDto
    ): Promise<AuthResponseDto> {

    }
}
