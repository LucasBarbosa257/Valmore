import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { AuthResponseDto } from './dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService
    ) { }

    public async signUp(
        data: SignUpDto
    ): Promise<AuthResponseDto> {
        const user = await this.usersService.findOneByEmail({
            email: data.email
        });

        if (user) {
            throw new ConflictException("This email address is already in use.");
        }

        const userId = await this.usersService.create({
            name: data.name,
            email: data.email,
            password: await bcrypt.hash(data.password, 12)
        });

        return {
            accessToken: await this.jwtService.signAsync({
                sub: userId
            })
        };
    }

    public async signIn(
        data: SignInDto
    ): Promise<AuthResponseDto> {
        const user = await this.usersService.findOneByEmail({
            email: data.email
        });

        const isValid = user && await bcrypt.compare(
            data.password,
            user.password
        );

        if (!isValid) {
            throw new UnauthorizedException('The email address or password is incorrect.');
        }

        return {
            accessToken: await this.jwtService.signAsync({
                sub: user.id
            })
        };
    }
}
