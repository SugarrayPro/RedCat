import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { SignInInput } from './dto/sign-in.input';
import { SignUpInput } from './dto/sign-up.input';
import { User } from '../user/entities/user.entity';
import { SignInResponse } from './dto/sign-in.response';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { UseGuards } from '@nestjs/common';
import { RefreshTokenInput } from './dto/refresh-token.input';

@Public()
@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => User)
  signUp(@Args('signUpInput') signUpInput: SignUpInput) {
    return this.authService.signUp(signUpInput);
  }

  @Public()
  @Mutation(() => SignInResponse)
  signIn(@Args('signInInput') signInInput: SignInInput) {
    return this.authService.signIn(signInInput);
  }

  @UseGuards(RefreshTokenGuard)
  @Mutation(() => SignInResponse)
  async refreshTokens(@Args('input') input: RefreshTokenInput): Promise<any> {
    return this.authService.refreshTokens(input.refreshToken);
  }
}
