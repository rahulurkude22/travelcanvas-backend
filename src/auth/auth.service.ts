import { HttpService } from '@nestjs/axios';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, map, timeout } from 'rxjs';
import { LoginBodyDto } from './dto/login-body.dto';
import { RegisterBodyDto } from './dto/register-body.dto';
import { KeycloakService } from './keycloak-service/keycloak-service';
import { type Dbtype } from 'src/database/database.module';
import { userProfiles } from 'drizzle/migrations/schema';

export interface KeycloakTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  'not-before-policy': number;
  session_state: string;
  scope: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject('DB') private readonly db: Dbtype,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly keycloakService: KeycloakService,
  ) {}

  async login(body: LoginBodyDto, grantType?: string, client_id?: string) {
    try {
      const { username, password } = body;
      const realmName = this.configService.get<string>('KEYCLOAK_REALM')!;
      const userClientId = this.configService.get<string>(
        'KEYCLOAK_USER_CLIENT_ID',
      )!;
      const clientId = client_id ?? userClientId;
      const clientSecret = await this.keycloakService.getClientSecret(
        realmName,
        client_id ?? userClientId,
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
      params.append('grant_type', grantType ?? 'password');

      const data = await firstValueFrom(
        this.httpService
          .post<KeycloakTokenResponse>(keycloakUrl, params.toString(), {
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
      console.log(error);
      throw new InternalServerErrorException(error.response.data.errorMessage);
    }
  }

  async register(registerBodyDto: RegisterBodyDto) {
    try {
      const { username, firstName, lastName, email, password, phoneNumber } =
        registerBodyDto;

      const adminClientId = this.configService.get<string>(
        'KEYCLOAK_ADMIN_CLIENT_ID',
      )!;

      const userClientId = this.configService.get<string>(
        'KEYCLOAK_USER_CLIENT_ID',
      )!;

      const realmName = this.configService.get<string>('KEYCLOAK_REALM')!;
      const keycloakUrl = `${this.configService.get<string>('KEYCLOAK_URL')!}/admin/realms/${realmName}/users`;

      const ADMIN_USERNAME = this.configService.get<string>('ADMIN_USERNAME')!;
      const ADMIN_PASSWORD = this.configService.get<string>('ADMIN_PASSWORD')!;

      const loginBodyDto = {
        username: ADMIN_USERNAME,
        password: ADMIN_PASSWORD,
      };

      const {
        data: { access_token },
      } = await this.login(loginBodyDto, 'client_credentials', adminClientId);

      if (!access_token) {
        throw new UnauthorizedException('Admin authorisation failed.');
      }

      const userPayload = {
        username,
        firstName,
        lastName,
        email,
        attributes: {
          phoneNumber,
        },
        enabled: true,
        credentials: [
          {
            type: 'password',
            value: password,
            temporary: false,
          },
        ],
        emailVerified: false,
      };

      const registeredUser = await firstValueFrom(
        this.httpService
          .post<unknown>(keycloakUrl, userPayload, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${access_token}`,
            },
          })
          .pipe(
            map((res) => res),
            timeout(5000),
          ),
      );

      if (registeredUser.status === 201) {
        const newUser = await this.keycloakService.getSingleUser(username);
        if (newUser) {
          await this.db.insert(userProfiles).values({
            id: newUser.id ?? crypto.randomUUID(),
            email: newUser.email ?? '',
            fullName: `${newUser.firstName} ${newUser.lastName}`.trim(),
            role: 'traveler',
          });
        }
      }

      const loggedInUser = await this.login(
        { username, password },
        'password',
        userClientId,
      );

      return { ...loggedInUser };
    } catch (error) {
      throw new InternalServerErrorException(error.response.data.errorMessage);
    }
  }

  async logout(userId: string, accessToken: string) {
    try {
      const realmName = this.configService.get<string>('KEYCLOAK_REALM')!;
      const keycloakUrl = `${this.configService.get<string>('KEYCLOAK_URL')!}/realms/${realmName}/protocol/openid-connect/logout`;

      // const adminClientId = this.configService.get<string>(
      //   'KEYCLOAK_ADMIN_CLIENT_ID',
      // )!;
      // const ADMIN_USERNAME = this.configService.get<string>('ADMIN_USERNAME')!;
      // const ADMIN_PASSWORD = this.configService.get<string>('ADMIN_PASSWORD')!;
      // const {
      //   data: { access_token },
      // } = await this.login(
      //   { username: ADMIN_USERNAME, password: ADMIN_PASSWORD },
      //   'client_credentials',
      //   adminClientId,
      // );
      await firstValueFrom(
        this.httpService
          .post<unknown>(
            keycloakUrl,
            {},
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          )
          .pipe(
            map((res) => res.data),
            timeout(5000),
          ),
      );

      return { success: true };
    } catch (error) {
      throw new InternalServerErrorException(error.response.data.errorMessage);
    }
  }
}
