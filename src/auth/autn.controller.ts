import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthToken,
  InputForgotPass,
  InputSignIn,
  InputSignUp,
} from './auth.interface';
import { AuthGuard } from './auth.guard';

interface AppRequest extends Request {
  userId: string;
}

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('signin')
  signIn(@Body() input: InputSignIn): Promise<AuthToken> {
    return this.service.signin(input);
  }

  @Post('signup')
  signUp(@Body() input: InputSignUp): Promise<AuthToken> {
    return this.service.signup(input);
  }

  @Post('forgot-password')
  forgotPass(@Body() input: InputForgotPass): Promise<void> {
    return this.service.forgotPassword(input);
  }

  @UseGuards(AuthGuard)
  @Post('deactivation')
  deactivation(@Req() request: AppRequest): Promise<void> {
    return this.service.deactivateUser(request.userId);
  }

  @UseGuards(AuthGuard)
  @Get('session')
  session(@Req() request: AppRequest) {
    return this.service.session(request.userId);
  }
}
