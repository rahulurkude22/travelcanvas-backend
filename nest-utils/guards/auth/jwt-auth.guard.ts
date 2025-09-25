import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'nest-utils/decorators/public/public.decorator';
import { Observable } from 'rxjs';
import { KeycloakJwtPayload } from 'types/canvas';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      try {
        return super.canActivate(context);
      } catch {
        return true;
      }
    }
    return super.canActivate(context);
  }

  handleRequest<TUser = KeycloakJwtPayload>(
    err: any,
    user: TUser,
    info: any,
    context: ExecutionContext,
  ): TUser | null {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      if (err || !user) return null;
      return { ...user };
    }

    if (err || !user) throw err || new UnauthorizedException();
    return { ...user };
  }
}
