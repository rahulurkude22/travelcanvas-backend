import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, map, timeout } from 'rxjs';
import { LoginBodyDto } from './dto/login-body.dto';
import { KeycloakService } from './keycloak-service/keycloak-service';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly keycloakService: KeycloakService,
  ) {}

  async login(body: LoginBodyDto) {
    try {
      const { username, password } = body;

      const realmName = this.configService.get<string>('KEYCLOAK_REALM')!;
      const clientId = this.configService.get<string>('KEYCLOAK_CLIENT_ID')!;
      const clientSecret = await this.keycloakService.getClientSecret(
        realmName,
        clientId,
      );

      if (!clientSecret) {
        throw new UnauthorizedException(
          `Client secret not found for client ${clientId} in realm ${realmName}: ${clientSecret}`,
        );
      }

      const keycloakUrl = `${this.configService.get<string>('KEYCLOAK_URL')!}/realms/${realmName}/protocol/openid-connect/token`;

      const params = new URLSearchParams();
      params.append('client_id', clientId);
      params.append('client_secret', clientSecret);
      params.append('username', username);
      params.append('password', password);
      params.append('grant_type', 'password');

      const data = await firstValueFrom(
        this.httpService
          .post<unknown>(keycloakUrl, params.toString(), {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
          .pipe(
            map((res) => res.data),
            timeout(5000),
          ),
      );

      return { success: true, data };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
