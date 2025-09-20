import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { type FastifyRequest } from 'fastify';
import { KeycloakJwtPayload } from 'types/canvas';

export interface AuthenticatedRequest extends FastifyRequest {
  user: KeycloakJwtPayload;
}

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext): KeycloakJwtPayload => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return data ? request.user?.[data] : request.user;
  },
);
