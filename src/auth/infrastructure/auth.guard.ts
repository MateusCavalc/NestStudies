import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(req);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      req['user'] = await this.authService.verifyJwt(token)
    } catch {
      throw new UnauthorizedException();
    }

    return true;

  }

  private extractTokenFromHeader(req): string | undefined {
    const [authType, token] =
      req.headers.authorization ?
        req.headers.authorization.split(' ') : [];

    return authType === 'Bearer' ?
      token : undefined;
  }

}
