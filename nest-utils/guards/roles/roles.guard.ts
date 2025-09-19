import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from 'nest-utils/decorators/roles/roles.decorator';

interface JwtUser {
  sub: string;
  resourceRoles: Record<string, { roles: string[] }>;
  scopes: string[];
  username: string;
  realmRoles?: string[];
}

interface JwtFastifyRequest {
  user: JwtUser;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest<JwtFastifyRequest>();
    const userRoles = user.realmRoles || [];

    const hasRole = requiredRoles.some((role) => userRoles.includes(role));
    if (!hasRole) {
      throw new ForbiddenException('You do not have the required role');
    }
    return true;
  }
}
