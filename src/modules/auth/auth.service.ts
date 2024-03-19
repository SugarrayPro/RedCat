import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SignInInput } from './dto/sign-in.input';
import { SignUpInput } from './dto/sign-up.input';
import { AccessTokenPayload } from './types/access-token-payload';
import { hash, verify } from 'argon2';
import { Role } from './enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  private generateAccessTokenPair(payload: AccessTokenPayload) {
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async signIn(signInUserInput: SignInInput) {
    const user = await this.usersService.findOneByEmail(signInUserInput.email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await verify(
      user.password,
      signInUserInput.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return {
      ...this.generateAccessTokenPair({
        email: user.email,
        id: user.id,
        roles: user.roles,
      }),
      user,
    };
  }

  async signUp(signUpInput: SignUpInput) {
    const existingUser = await this.usersService.findOneByEmail(
      signUpInput.email,
    );

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    if (signUpInput.roles && signUpInput.roles.includes(Role.ADMIN)) {
      throw new BadRequestException('Cannot sign up with an ADMIN role');
    }

    const password = await hash(signUpInput.password);

    return this.usersService.create({
      ...signUpInput,
      password,
    });
  }

  async refreshTokens(refreshToken: string) {
    const decodedToken = this.jwtService.verify(refreshToken);
    if (!decodedToken) {
      throw new ForbiddenException('Invalid refresh token');
    }

    return this.generateAccessTokenPair({
      id: decodedToken.id,
      email: decodedToken.email,
      roles: decodedToken.roles,
    });
  }
}
