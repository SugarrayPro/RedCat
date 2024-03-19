import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { AccessTokenPayload } from '../types/access-token-payload';
import { UserService } from '../../user/user.service';
import { ForbiddenError } from '@nestjs/apollo';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'access-token',
) {
  constructor(
    public config: ConfigService,
    public authService: AuthService,
    public userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: AccessTokenPayload) {
    const user = await this.userService.findOneByEmail(payload.email);
    if (!user) {
      throw new ForbiddenError('User not found');
    }

    return payload;
  }
}
