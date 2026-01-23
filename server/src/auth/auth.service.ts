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
            throw new ConflictException();
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

        if (!user) {
            throw new UnauthorizedException();
        }

        const isMatch = await bcrypt.compare(
            data.password,
            user.password
        );

        if (!isMatch) {
            throw new UnauthorizedException();
        }

        return {
            accessToken: await this.jwtService.signAsync({
                sub: user.id
            })
        };
    }
}
