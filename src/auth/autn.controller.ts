import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthToken, InputSignIn, InputSignUp } from './auth.interface';
import { AuthGuard } from './auth.guard';
import { request } from 'http';

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

  @UseGuards(AuthGuard)
  @Get('session')
  session(@Req() request: AppRequest) {
    return this.service.session(request.userId);
  }
}
