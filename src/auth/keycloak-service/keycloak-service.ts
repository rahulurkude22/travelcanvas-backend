import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { client, realm, userEntity } from 'drizzle/keycloak/schema';
import { type keycloakDbtype } from 'src/database/database.module';

@Injectable()
export class KeycloakService {
  constructor(
    @Inject('KEYCLOAK_DB') private readonly keyCloakDb: keycloakDbtype,
  ) {}

  async getClientSecret(
    realmName: string,
    clientId: string | undefined,
  ): Promise<string | null> {
    const result = await this.keyCloakDb
      .select({ secret: client.secret })
      .from(client)
      .innerJoin(realm, eq(realm.id, client.realmId))
      .where(
        and(eq(realm.name, realmName), eq(client.clientId, clientId ?? '')),
      );
    return result.length > 0 ? result[0].secret : null;
  }

  async getSingleUser(
    userName: string,
  ): Promise<typeof userEntity.$inferInsert | null> {
    const [user] = await this.keyCloakDb
      .select()
      .from(userEntity)
      .where(eq(userEntity.username, userName));
    return user ?? null;
  }
}
