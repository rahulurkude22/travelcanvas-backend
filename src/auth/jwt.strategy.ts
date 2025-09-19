import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import * as jwksRsa from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { KeycloakJwtPayload } from 'types/canvas';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const keycloakUrl = new ConfigService().get<string>('KEYCLOAK_URL')!;
    const keycloakRealm = new ConfigService().get<string>('KEYCLOAK_REALM')!;
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() as (
        req: Request,
      ) => string | null,
      ignoreExpiration: false,
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${keycloakUrl}/realms/${keycloakRealm}/protocol/openid-connect/certs`,
      }),
      algorithms: ['RS256'],
    });
  }
  validate(payload: KeycloakJwtPayload) {
    return {
      sub: payload.sub,
      username: payload.preferred_username,
      realmRoles: payload.realm_access?.roles || [],
      resourceRoles: payload.resource_access || {},
      scopes: (payload.scope || '').split(' '), // OAuth2 scopes
    };
  }
}
