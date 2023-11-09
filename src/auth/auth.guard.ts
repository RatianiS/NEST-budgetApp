import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { log } from 'console';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(context: ExecutionContext) {
    // request object
    const request = context.switchToHttp().getRequest();

    const headers = request['headers'];

    const hasTokenInHeader = 'authorization' in headers;
    if (!hasTokenInHeader) {
      return false;
    }

    const token = headers['authorization'];

    // token validation
    try {
      const payload = this.jwt.verify(token);
      const userId = payload.id;

      request.userId = userId;
    } catch (error) {
      console.log(error);

      return false;
    }

    return true;
  }
}
