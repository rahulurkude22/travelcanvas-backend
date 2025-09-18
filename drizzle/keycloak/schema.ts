import {
  pgTable,
  integer,
  boolean,
  timestamp,
  varchar,
  index,
  foreignKey,
  unique,
  bigint,
  text,
  smallint,
  primaryKey,
  customType,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

const bytea = customType<{ data: Buffer }>({
  dataType() {
    return 'bytea';
  },
  fromDriver(value: unknown): Buffer {
    return value as Buffer; // pg returns Buffer for bytea
  },
});

export const databasechangeloglock = pgTable('databasechangeloglock', {
  id: integer().primaryKey().notNull(),
  locked: boolean().notNull(),
  lockgranted: timestamp({ mode: 'string' }),
  lockedby: varchar({ length: 255 }),
});

export const userFederationProvider = pgTable(
  'user_federation_provider',
  {
    id: varchar({ length: 36 }).primaryKey().notNull(),
    changedSyncPeriod: integer('changed_sync_period'),
    displayName: varchar('display_name', { length: 255 }),
    fullSyncPeriod: integer('full_sync_period'),
    lastSync: integer('last_sync'),
    priority: integer(),
    providerName: varchar('provider_name', { length: 255 }),
    realmId: varchar('realm_id', { length: 36 }),
  },
  (table) => [
    index('idx_usr_fed_prv_realm').using(
      'btree',
      table.realmId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.realmId],
      foreignColumns: [realm.id],
      name: 'fk_1fj32f6ptolw2qy60cd8n01e8',
    }),
  ],
);

export const databasechangelog = pgTable('databasechangelog', {
  id: varchar({ length: 255 }).notNull(),
  author: varchar({ length: 255 }).notNull(),
  filename: varchar({ length: 255 }).notNull(),
  dateexecuted: timestamp({ mode: 'string' }).notNull(),
  orderexecuted: integer().notNull(),
  exectype: varchar({ length: 10 }).notNull(),
  md5Sum: varchar({ length: 35 }),
  description: varchar({ length: 255 }),
  comments: varchar({ length: 255 }),
  tag: varchar({ length: 255 }),
  liquibase: varchar({ length: 20 }),
  contexts: varchar({ length: 255 }),
  labels: varchar({ length: 255 }),
  deploymentId: varchar('deployment_id', { length: 10 }),
});

export const identityProviderMapper = pgTable(
  'identity_provider_mapper',
  {
    id: varchar({ length: 36 }).primaryKey().notNull(),
    name: varchar({ length: 255 }).notNull(),
    idpAlias: varchar('idp_alias', { length: 255 }).notNull(),
    idpMapperName: varchar('idp_mapper_name', { length: 255 }).notNull(),
    realmId: varchar('realm_id', { length: 36 }).notNull(),
  },
  (table) => [
    index('idx_id_prov_mapp_realm').using(
      'btree',
      table.realmId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.realmId],
      foreignColumns: [realm.id],
      name: 'fk_idpm_realm',
    }),
  ],
);

export const userFederationMapper = pgTable(
  'user_federation_mapper',
  {
    id: varchar({ length: 36 }).primaryKey().notNull(),
    name: varchar({ length: 255 }).notNull(),
    federationProviderId: varchar('federation_provider_id', {
      length: 36,
    }).notNull(),
    federationMapperType: varchar('federation_mapper_type', {
      length: 255,
    }).notNull(),
    realmId: varchar('realm_id', { length: 36 }).notNull(),
  },
  (table) => [
    index('idx_usr_fed_map_fed_prv').using(
      'btree',
      table.federationProviderId.asc().nullsLast().op('text_ops'),
    ),
    index('idx_usr_fed_map_realm').using(
      'btree',
      table.realmId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.realmId],
      foreignColumns: [realm.id],
      name: 'fk_fedmapperpm_realm',
    }),
    foreignKey({
      columns: [table.federationProviderId],
      foreignColumns: [userFederationProvider.id],
      name: 'fk_fedmapperpm_fedprv',
    }),
  ],
);

export const authenticationFlow = pgTable(
  'authentication_flow',
  {
    id: varchar({ length: 36 }).primaryKey().notNull(),
    alias: varchar({ length: 255 }),
    description: varchar({ length: 255 }),
    realmId: varchar('realm_id', { length: 36 }),
    providerId: varchar('provider_id', { length: 36 })
      .default('basic-flow')
      .notNull(),
    topLevel: boolean('top_level').default(false).notNull(),
    builtIn: boolean('built_in').default(false).notNull(),
  },
  (table) => [
    index('idx_auth_flow_realm').using(
      'btree',
      table.realmId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.realmId],
      foreignColumns: [realm.id],
      name: 'fk_auth_flow_realm',
    }),
  ],
);

export const authenticationExecution = pgTable(
  'authentication_execution',
  {
    id: varchar({ length: 36 }).primaryKey().notNull(),
    alias: varchar({ length: 255 }),
    authenticator: varchar({ length: 36 }),
    realmId: varchar('realm_id', { length: 36 }),
    flowId: varchar('flow_id', { length: 36 }),
    requirement: integer(),
    priority: integer(),
    authenticatorFlow: boolean('authenticator_flow').default(false).notNull(),
    authFlowId: varchar('auth_flow_id', { length: 36 }),
    authConfig: varchar('auth_config', { length: 36 }),
  },
  (table) => [
    index('idx_auth_exec_flow').using(
      'btree',
      table.flowId.asc().nullsLast().op('text_ops'),
    ),
    index('idx_auth_exec_realm_flow').using(
      'btree',
      table.realmId.asc().nullsLast().op('text_ops'),
      table.flowId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.realmId],
      foreignColumns: [realm.id],
      name: 'fk_auth_exec_realm',
    }),
    foreignKey({
      columns: [table.flowId],
      foreignColumns: [authenticationFlow.id],
      name: 'fk_auth_exec_flow',
    }),
  ],
);

export const authenticatorConfig = pgTable(
  'authenticator_config',
  {
    id: varchar({ length: 36 }).primaryKey().notNull(),
    alias: varchar({ length: 255 }),
    realmId: varchar('realm_id', { length: 36 }),
  },
  (table) => [
    index('idx_auth_config_realm').using(
      'btree',
      table.realmId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.realmId],
      foreignColumns: [realm.id],
      name: 'fk_auth_realm',
    }),
  ],
);

export const keycloakRole = pgTable(
  'keycloak_role',
  {
    id: varchar({ length: 36 }).primaryKey().notNull(),
    clientRealmConstraint: varchar('client_realm_constraint', { length: 255 }),
    clientRole: boolean('client_role').default(false).notNull(),
    description: varchar({ length: 255 }),
    name: varchar({ length: 255 }),
    realmId: varchar('realm_id', { length: 255 }),
    client: varchar({ length: 36 }),
    realm: varchar({ length: 36 }),
  },
  (table) => [
    index('idx_keycloak_role_client').using(
      'btree',
      table.client.asc().nullsLast().op('text_ops'),
    ),
    index('idx_keycloak_role_realm').using(
      'btree',
      table.realm.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.realm],
      foreignColumns: [realm.id],
      name: 'fk_6vyqfe4cn4wlq8r6kt5vdsj5c',
    }),
    unique('UK_J3RWUVD56ONTGSUHOGM184WW2-2').on(
      table.clientRealmConstraint,
      table.name,
    ),
  ],
);

export const groupAttribute = pgTable(
  'group_attribute',
  {
    id: varchar({ length: 36 })
      .default('sybase-needs-something-here')
      .primaryKey()
      .notNull(),
    name: varchar({ length: 255 }).notNull(),
    value: varchar({ length: 255 }),
    groupId: varchar('group_id', { length: 36 }).notNull(),
  },
  (table) => [
    index('idx_group_att_by_name_value').using(
      'btree',
      sql`name`,
      sql`((value)::character varying(250))`,
    ),
    index('idx_group_attr_group').using(
      'btree',
      table.groupId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.groupId],
      foreignColumns: [keycloakGroup.id],
      name: 'fk_group_attribute_group',
    }),
  ],
);

export const protocolMapper = pgTable(
  'protocol_mapper',
  {
    id: varchar({ length: 36 }).primaryKey().notNull(),
    name: varchar({ length: 255 }).notNull(),
    protocol: varchar({ length: 255 }).notNull(),
    protocolMapperName: varchar('protocol_mapper_name', {
      length: 255,
    }).notNull(),
    clientId: varchar('client_id', { length: 36 }),
    clientScopeId: varchar('client_scope_id', { length: 36 }),
  },
  (table) => [
    index('idx_clscope_protmap').using(
      'btree',
      table.clientScopeId.asc().nullsLast().op('text_ops'),
    ),
    index('idx_protocol_mapper_client').using(
      'btree',
      table.clientId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.clientId],
      foreignColumns: [client.id],
      name: 'fk_pcm_realm',
    }),
    foreignKey({
      columns: [table.clientScopeId],
      foreignColumns: [clientScope.id],
      name: 'fk_cli_scope_mapper',
    }),
  ],
);

export const federatedUser = pgTable('federated_user', {
  id: varchar({ length: 255 }).primaryKey().notNull(),
  storageProviderId: varchar('storage_provider_id', { length: 255 }),
  realmId: varchar('realm_id', { length: 36 }).notNull(),
});

export const component = pgTable(
  'component',
  {
    id: varchar({ length: 36 }).primaryKey().notNull(),
    name: varchar({ length: 255 }),
    parentId: varchar('parent_id', { length: 36 }),
    providerId: varchar('provider_id', { length: 36 }),
    providerType: varchar('provider_type', { length: 255 }),
    realmId: varchar('realm_id', { length: 36 }),
    subType: varchar('sub_type', { length: 255 }),
  },
  (table) => [
    index('idx_component_provider_type').using(
      'btree',
      table.providerType.asc().nullsLast().op('text_ops'),
    ),
    index('idx_component_realm').using(
      'btree',
      table.realmId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.realmId],
      foreignColumns: [realm.id],
      name: 'fk_component_realm',
    }),
  ],
);

export const clientInitialAccess = pgTable(
  'client_initial_access',
  {
    id: varchar({ length: 36 }).primaryKey().notNull(),
    realmId: varchar('realm_id', { length: 36 }).notNull(),
    timestamp: integer(),
    expiration: integer(),
    count: integer(),
    remainingCount: integer('remaining_count'),
  },
  (table) => [
    index('idx_client_init_acc_realm').using(
      'btree',
      table.realmId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.realmId],
      foreignColumns: [realm.id],
      name: 'fk_client_init_acc_realm',
    }),
  ],
);

export const userEntity = pgTable(
  'user_entity',
  {
    id: varchar({ length: 36 }).primaryKey().notNull(),
    email: varchar({ length: 255 }),
    emailConstraint: varchar('email_constraint', { length: 255 }),
    emailVerified: boolean('email_verified').default(false).notNull(),
    enabled: boolean().default(false).notNull(),
    federationLink: varchar('federation_link', { length: 255 }),
    firstName: varchar('first_name', { length: 255 }),
    lastName: varchar('last_name', { length: 255 }),
    realmId: varchar('realm_id', { length: 255 }),
    username: varchar({ length: 255 }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    createdTimestamp: bigint('created_timestamp', { mode: 'number' }),
    serviceAccountClientLink: varchar('service_account_client_link', {
      length: 255,
    }),
    notBefore: integer('not_before').default(0).notNull(),
  },
  (table) => [
    index('idx_user_email').using(
      'btree',
      table.email.asc().nullsLast().op('text_ops'),
    ),
    index('idx_user_service_account').using(
      'btree',
      table.realmId.asc().nullsLast().op('text_ops'),
      table.serviceAccountClientLink.asc().nullsLast().op('text_ops'),
    ),
    unique('uk_dykn684sl8up1crfei6eckhd7').on(
      table.emailConstraint,
      table.realmId,
    ),
    unique('uk_ru8tt6t700s9v50bu18ws5ha6').on(table.realmId, table.username),
  ],
);

export const fedUserConsent = pgTable(
  'fed_user_consent',
  {
    id: varchar({ length: 36 }).primaryKey().notNull(),
    clientId: varchar('client_id', { length: 255 }),
    userId: varchar('user_id', { length: 255 }).notNull(),
    realmId: varchar('realm_id', { length: 36 }).notNull(),
    storageProviderId: varchar('storage_provider_id', { length: 36 }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    createdDate: bigint('created_date', { mode: 'number' }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    lastUpdatedDate: bigint('last_updated_date', { mode: 'number' }),
    clientStorageProvider: varchar('client_storage_provider', { length: 36 }),
    externalClientId: varchar('external_client_id', { length: 255 }),
  },
  (table) => [
    index('idx_fu_cnsnt_ext').using(
      'btree',
      table.userId.asc().nullsLast().op('text_ops'),
      table.clientStorageProvider.asc().nullsLast().op('text_ops'),
      table.externalClientId.asc().nullsLast().op('text_ops'),
    ),
    index('idx_fu_consent').using(
      'btree',
      table.userId.asc().nullsLast().op('text_ops'),
      table.clientId.asc().nullsLast().op('text_ops'),
    ),
    index('idx_fu_consent_ru').using(
      'btree',
      table.realmId.asc().nullsLast().op('text_ops'),
      table.userId.asc().nullsLast().op('text_ops'),
    ),
  ],
);

export const clientScope = pgTable(
  'client_scope',
  {
    id: varchar({ length: 36 }).primaryKey().notNull(),
    name: varchar({ length: 255 }),
    realmId: varchar('realm_id', { length: 36 }),
    description: varchar({ length: 255 }),
    protocol: varchar({ length: 255 }),
  },
  (table) => [
    index('idx_realm_clscope').using(
      'btree',
      table.realmId.asc().nullsLast().op('text_ops'),
    ),
    unique('uk_cli_scope').on(table.name, table.realmId),
  ],
);

export const resourceServerResource = pgTable(
  'resource_server_resource',
  {
    id: varchar({ length: 36 }).primaryKey().notNull(),
    name: varchar({ length: 255 }).notNull(),
    type: varchar({ length: 255 }),
    iconUri: varchar('icon_uri', { length: 255 }),
    owner: varchar({ length: 255 }).notNull(),
    resourceServerId: varchar('resource_server_id', { length: 36 }).notNull(),
    ownerManagedAccess: boolean('owner_managed_access')
      .default(false)
      .notNull(),
    displayName: varchar('display_name', { length: 255 }),
  },
  (table) => [
    index('idx_res_srv_res_res_srv').using(
      'btree',
      table.resourceServerId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.resourceServerId],
      foreignColumns: [resourceServer.id],
      name: 'fk_frsrho213xcx4wnkog82ssrfy',
    }),
    unique('uk_frsr6t700s9v50bu18ws5ha6').on(
      table.name,
      table.owner,
      table.resourceServerId,
    ),
  ],
);

export const resourceServerScope = pgTable(
  'resource_server_scope',
  {
    id: varchar({ length: 36 }).primaryKey().notNull(),
    name: varchar({ length: 255 }).notNull(),
    iconUri: varchar('icon_uri', { length: 255 }),
    resourceServerId: varchar('resource_server_id', { length: 36 }).notNull(),
    displayName: varchar('display_name', { length: 255 }),
  },
  (table) => [
    index('idx_res_srv_scope_res_srv').using(
      'btree',
      table.resourceServerId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.resourceServerId],
      foreignColumns: [resourceServer.id],
      name: 'fk_frsrso213xcx4wnkog82ssrfy',
    }),
    unique('uk_frsrst700s9v50bu18ws5ha6').on(
      table.name,
      table.resourceServerId,
    ),
  ],
);

export const resourceAttribute = pgTable(
  'resource_attribute',
  {
    id: varchar({ length: 36 })
      .default('sybase-needs-something-here')
      .primaryKey()
      .notNull(),
    name: varchar({ length: 255 }).notNull(),
    value: varchar({ length: 255 }),
    resourceId: varchar('resource_id', { length: 36 }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.resourceId],
      foreignColumns: [resourceServerResource.id],
      name: 'fk_5hrm2vlf9ql5fu022kqepovbr',
    }),
  ],
);

export const requiredActionProvider = pgTable(
  'required_action_provider',
  {
    id: varchar({ length: 36 }).primaryKey().notNull(),
    alias: varchar({ length: 255 }),
    name: varchar({ length: 255 }),
    realmId: varchar('realm_id', { length: 36 }),
    enabled: boolean().default(false).notNull(),
    defaultAction: boolean('default_action').default(false).notNull(),
    providerId: varchar('provider_id', { length: 255 }),
    priority: integer(),
  },
  (table) => [
    index('idx_req_act_prov_realm').using(
      'btree',
      table.realmId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.realmId],
      foreignColumns: [realm.id],
      name: 'fk_req_act_realm',
    }),
  ],
);

export const roleAttribute = pgTable(
  'role_attribute',
  {
    id: varchar({ length: 36 }).primaryKey().notNull(),
    roleId: varchar('role_id', { length: 36 }).notNull(),
    name: varchar({ length: 255 }).notNull(),
    value: varchar({ length: 255 }),
  },
  (table) => [
    index('idx_role_attribute').using(
      'btree',
      table.roleId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.roleId],
      foreignColumns: [keycloakRole.id],
      name: 'fk_role_attribute_id',
    }),
  ],
);

export const fedUserCredential = pgTable(
  'fed_user_credential',
  {
    id: varchar({ length: 36 }).primaryKey().notNull(),
    // TODO: failed to parse database type 'bytea'
    salt: bytea('salt'),
    type: varchar({ length: 255 }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    createdDate: bigint('created_date', { mode: 'number' }),
    userId: varchar('user_id', { length: 255 }).notNull(),
    realmId: varchar('realm_id', { length: 36 }).notNull(),
    storageProviderId: varchar('storage_provider_id', { length: 36 }),
    userLabel: varchar('user_label', { length: 255 }),
    secretData: text('secret_data'),
    credentialData: text('credential_data'),
    priority: integer(),
  },
  (table) => [
    index('idx_fu_credential').using(
      'btree',
      table.userId.asc().nullsLast().op('text_ops'),
      table.type.asc().nullsLast().op('text_ops'),
    ),
    index('idx_fu_credential_ru').using(
      'btree',
      table.realmId.asc().nullsLast().op('text_ops'),
      table.userId.asc().nullsLast().op('text_ops'),
    ),
  ],
);

export const migrationModel = pgTable(
  'migration_model',
  {
    id: varchar({ length: 36 }).primaryKey().notNull(),
    version: varchar({ length: 36 }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    updateTime: bigint('update_time', { mode: 'number' }).default(0).notNull(),
  },
  (table) => [
    index('idx_update_time').using(
      'btree',
      table.updateTime.asc().nullsLast().op('int8_ops'),
    ),
    unique('uk_migration_version').on(table.version),
    unique('uk_migration_update_time').on(table.updateTime),
  ],
);

export const client = pgTable(
  'client',
  {
    id: varchar({ length: 36 }).primaryKey().notNull(),
    enabled: boolean().default(false).notNull(),
    fullScopeAllowed: boolean('full_scope_allowed').default(false).notNull(),
    clientId: varchar('client_id', { length: 255 }),
    notBefore: integer('not_before'),
    publicClient: boolean('public_client').default(false).notNull(),
    secret: varchar({ length: 255 }),
    baseUrl: varchar('base_url', { length: 255 }),
    bearerOnly: boolean('bearer_only').default(false).notNull(),
    managementUrl: varchar('management_url', { length: 255 }),
    surrogateAuthRequired: boolean('surrogate_auth_required')
      .default(false)
      .notNull(),
    realmId: varchar('realm_id', { length: 36 }),
    protocol: varchar({ length: 255 }),
    nodeReregTimeout: integer('node_rereg_timeout').default(0),
    frontchannelLogout: boolean('frontchannel_logout').default(false).notNull(),
    consentRequired: boolean('consent_required').default(false).notNull(),
    name: varchar({ length: 255 }),
    serviceAccountsEnabled: boolean('service_accounts_enabled')
      .default(false)
      .notNull(),
    clientAuthenticatorType: varchar('client_authenticator_type', {
      length: 255,
    }),
    rootUrl: varchar('root_url', { length: 255 }),
    description: varchar({ length: 255 }),
    registrationToken: varchar('registration_token', { length: 255 }),
    standardFlowEnabled: boolean('standard_flow_enabled')
      .default(true)
      .notNull(),
    implicitFlowEnabled: boolean('implicit_flow_enabled')
      .default(false)
      .notNull(),
    directAccessGrantsEnabled: boolean('direct_access_grants_enabled')
      .default(false)
      .notNull(),
    alwaysDisplayInConsole: boolean('always_display_in_console')
      .default(false)
      .notNull(),
  },
  (table) => [
    index('idx_client_id').using(
      'btree',
      table.clientId.asc().nullsLast().op('text_ops'),
    ),
    unique('uk_b71cjlbenv945rb6gcon438at').on(table.clientId, table.realmId),
  ],
);

export const userConsent = pgTable(
  'user_consent',
  {
    id: varchar({ length: 36 }).primaryKey().notNull(),
    clientId: varchar('client_id', { length: 255 }),
    userId: varchar('user_id', { length: 36 }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    createdDate: bigint('created_date', { mode: 'number' }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    lastUpdatedDate: bigint('last_updated_date', { mode: 'number' }),
    clientStorageProvider: varchar('client_storage_provider', { length: 36 }),
    externalClientId: varchar('external_client_id', { length: 255 }),
  },
  (table) => [
    index('idx_user_consent').using(
      'btree',
      table.userId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userEntity.id],
      name: 'fk_grntcsnt_user',
    }),
    unique('uk_local_consent').on(table.clientId, table.userId),
    unique('uk_external_consent').on(
      table.userId,
      table.clientStorageProvider,
      table.externalClientId,
    ),
  ],
);

export const resourceServerPermTicket = pgTable(
  'resource_server_perm_ticket',
  {
    id: varchar({ length: 36 }).primaryKey().notNull(),
    owner: varchar({ length: 255 }).notNull(),
    requester: varchar({ length: 255 }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    createdTimestamp: bigint('created_timestamp', { mode: 'number' }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    grantedTimestamp: bigint('granted_timestamp', { mode: 'number' }),
    resourceId: varchar('resource_id', { length: 36 }).notNull(),
    scopeId: varchar('scope_id', { length: 36 }),
    resourceServerId: varchar('resource_server_id', { length: 36 }).notNull(),
    policyId: varchar('policy_id', { length: 36 }),
  },
  (table) => [
    index('idx_perm_ticket_owner').using(
      'btree',
      table.owner.asc().nullsLast().op('text_ops'),
    ),
    index('idx_perm_ticket_requester').using(
      'btree',
      table.requester.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.resourceServerId],
      foreignColumns: [resourceServer.id],
      name: 'fk_frsrho213xcx4wnkog82sspmt',
    }),
    foreignKey({
      columns: [table.resourceId],
      foreignColumns: [resourceServerResource.id],
      name: 'fk_frsrho213xcx4wnkog83sspmt',
    }),
    foreignKey({
      columns: [table.scopeId],
      foreignColumns: [resourceServerScope.id],
      name: 'fk_frsrho213xcx4wnkog84sspmt',
    }),
    foreignKey({
      columns: [table.policyId],
      foreignColumns: [resourceServerPolicy.id],
      name: 'fk_frsrpo2128cx4wnkog82ssrfy',
    }),
    unique('uk_frsr6t700s9v50bu18ws5pmt').on(
      table.owner,
      table.requester,
      table.resourceId,
      table.scopeId,
      table.resourceServerId,
    ),
  ],
);

export const realm = pgTable(
  'realm',
  {
    id: varchar({ length: 36 }).primaryKey().notNull(),
    accessCodeLifespan: integer('access_code_lifespan'),
    userActionLifespan: integer('user_action_lifespan'),
    accessTokenLifespan: integer('access_token_lifespan'),
    accountTheme: varchar('account_theme', { length: 255 }),
    adminTheme: varchar('admin_theme', { length: 255 }),
    emailTheme: varchar('email_theme', { length: 255 }),
    enabled: boolean().default(false).notNull(),
    eventsEnabled: boolean('events_enabled').default(false).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    eventsExpiration: bigint('events_expiration', { mode: 'number' }),
    loginTheme: varchar('login_theme', { length: 255 }),
    name: varchar({ length: 255 }),
    notBefore: integer('not_before'),
    passwordPolicy: varchar('password_policy', { length: 2550 }),
    registrationAllowed: boolean('registration_allowed')
      .default(false)
      .notNull(),
    rememberMe: boolean('remember_me').default(false).notNull(),
    resetPasswordAllowed: boolean('reset_password_allowed')
      .default(false)
      .notNull(),
    social: boolean().default(false).notNull(),
    sslRequired: varchar('ssl_required', { length: 255 }),
    ssoIdleTimeout: integer('sso_idle_timeout'),
    ssoMaxLifespan: integer('sso_max_lifespan'),
    updateProfileOnSocLogin: boolean('update_profile_on_soc_login')
      .default(false)
      .notNull(),
    verifyEmail: boolean('verify_email').default(false).notNull(),
    masterAdminClient: varchar('master_admin_client', { length: 36 }),
    loginLifespan: integer('login_lifespan'),
    internationalizationEnabled: boolean('internationalization_enabled')
      .default(false)
      .notNull(),
    defaultLocale: varchar('default_locale', { length: 255 }),
    regEmailAsUsername: boolean('reg_email_as_username')
      .default(false)
      .notNull(),
    adminEventsEnabled: boolean('admin_events_enabled')
      .default(false)
      .notNull(),
    adminEventsDetailsEnabled: boolean('admin_events_details_enabled')
      .default(false)
      .notNull(),
    editUsernameAllowed: boolean('edit_username_allowed')
      .default(false)
      .notNull(),
    otpPolicyCounter: integer('otp_policy_counter').default(0),
    otpPolicyWindow: integer('otp_policy_window').default(1),
    otpPolicyPeriod: integer('otp_policy_period').default(30),
    otpPolicyDigits: integer('otp_policy_digits').default(6),
    otpPolicyAlg: varchar('otp_policy_alg', { length: 36 }).default('HmacSHA1'),
    otpPolicyType: varchar('otp_policy_type', { length: 36 }).default('totp'),
    browserFlow: varchar('browser_flow', { length: 36 }),
    registrationFlow: varchar('registration_flow', { length: 36 }),
    directGrantFlow: varchar('direct_grant_flow', { length: 36 }),
    resetCredentialsFlow: varchar('reset_credentials_flow', { length: 36 }),
    clientAuthFlow: varchar('client_auth_flow', { length: 36 }),
    offlineSessionIdleTimeout: integer('offline_session_idle_timeout').default(
      0,
    ),
    revokeRefreshToken: boolean('revoke_refresh_token')
      .default(false)
      .notNull(),
    accessTokenLifeImplicit: integer('access_token_life_implicit').default(0),
    loginWithEmailAllowed: boolean('login_with_email_allowed')
      .default(true)
      .notNull(),
    duplicateEmailsAllowed: boolean('duplicate_emails_allowed')
      .default(false)
      .notNull(),
    dockerAuthFlow: varchar('docker_auth_flow', { length: 36 }),
    refreshTokenMaxReuse: integer('refresh_token_max_reuse').default(0),
    allowUserManagedAccess: boolean('allow_user_managed_access')
      .default(false)
      .notNull(),
    ssoMaxLifespanRememberMe: integer('sso_max_lifespan_remember_me')
      .default(0)
      .notNull(),
    ssoIdleTimeoutRememberMe: integer('sso_idle_timeout_remember_me')
      .default(0)
      .notNull(),
    defaultRole: varchar('default_role', { length: 255 }),
  },
  (table) => [
    index('idx_realm_master_adm_cli').using(
      'btree',
      table.masterAdminClient.asc().nullsLast().op('text_ops'),
    ),
    unique('uk_orvsdmla56612eaefiq6wl5oi').on(table.name),
  ],
);

export const resourceServerPolicy = pgTable(
  'resource_server_policy',
  {
    id: varchar({ length: 36 }).primaryKey().notNull(),
    name: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 255 }),
    type: varchar({ length: 255 }).notNull(),
    decisionStrategy: smallint('decision_strategy'),
    logic: smallint(),
    resourceServerId: varchar('resource_server_id', { length: 36 }).notNull(),
    owner: varchar({ length: 255 }),
  },
  (table) => [
    index('idx_res_serv_pol_res_serv').using(
      'btree',
      table.resourceServerId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.resourceServerId],
      foreignColumns: [resourceServer.id],
      name: 'fk_frsrpo213xcx4wnkog82ssrfy',
    }),
    unique('uk_frsrpt700s9v50bu18ws5ha6').on(
      table.name,
      table.resourceServerId,
    ),
  ],
);

export const resourceServer = pgTable('resource_server', {
  id: varchar({ length: 36 }).primaryKey().notNull(),
  allowRsRemoteMgmt: boolean('allow_rs_remote_mgmt').default(false).notNull(),
  policyEnforceMode: smallint('policy_enforce_mode').notNull(),
  decisionStrategy: smallint('decision_strategy').default(1).notNull(),
});

export const componentConfig = pgTable(
  'component_config',
  {
    id: varchar({ length: 36 }).primaryKey().notNull(),
    componentId: varchar('component_id', { length: 36 }).notNull(),
    name: varchar({ length: 255 }).notNull(),
    value: text(),
  },
  (table) => [
    index('idx_compo_config_compo').using(
      'btree',
      table.componentId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.componentId],
      foreignColumns: [component.id],
      name: 'fk_component_config',
    }),
  ],
);

export const eventEntity = pgTable(
  'event_entity',
  {
    id: varchar({ length: 36 }).primaryKey().notNull(),
    clientId: varchar('client_id', { length: 255 }),
    detailsJson: varchar('details_json', { length: 2550 }),
    error: varchar({ length: 255 }),
    ipAddress: varchar('ip_address', { length: 255 }),
    realmId: varchar('realm_id', { length: 255 }),
    sessionId: varchar('session_id', { length: 255 }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    eventTime: bigint('event_time', { mode: 'number' }),
    type: varchar({ length: 255 }),
    userId: varchar('user_id', { length: 255 }),
    detailsJsonLongValue: text('details_json_long_value'),
  },
  (table) => [
    index('idx_event_time').using(
      'btree',
      table.realmId.asc().nullsLast().op('int8_ops'),
      table.eventTime.asc().nullsLast().op('int8_ops'),
    ),
  ],
);

export const userAttribute = pgTable(
  'user_attribute',
  {
    name: varchar({ length: 255 }).notNull(),
    value: varchar({ length: 255 }),
    userId: varchar('user_id', { length: 36 }).notNull(),
    id: varchar({ length: 36 })
      .default('sybase-needs-something-here')
      .primaryKey()
      .notNull(),
    // TODO: failed to parse database type 'bytea'
    longValueHash: bytea('long_value_hash'),
    // TODO: failed to parse database type 'bytea'
    longValueHashLowerCase: bytea('long_value_hash_lower_case'),
    longValue: text('long_value'),
  },
  (table) => [
    index('idx_user_attribute').using(
      'btree',
      table.userId.asc().nullsLast().op('text_ops'),
    ),
    index('idx_user_attribute_name').using(
      'btree',
      table.name.asc().nullsLast().op('text_ops'),
      table.value.asc().nullsLast().op('text_ops'),
    ),
    index('user_attr_long_values').using(
      'btree',
      table.longValueHash.asc().nullsLast().op('bytea_ops'),
      table.name.asc().nullsLast().op('bytea_ops'),
    ),
    index('user_attr_long_values_lower_case').using(
      'btree',
      table.longValueHashLowerCase.asc().nullsLast().op('bytea_ops'),
      table.name.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userEntity.id],
      name: 'fk_5hrm2vlf9ql5fu043kqepovbr',
    }),
  ],
);

export const fedUserAttribute = pgTable(
  'fed_user_attribute',
  {
    id: varchar({ length: 36 }).primaryKey().notNull(),
    name: varchar({ length: 255 }).notNull(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    realmId: varchar('realm_id', { length: 36 }).notNull(),
    storageProviderId: varchar('storage_provider_id', { length: 36 }),
    value: varchar({ length: 2024 }),
    // TODO: failed to parse database type 'bytea'
    longValueHash: bytea('long_value_hash'),
    // TODO: failed to parse database type 'bytea'
    longValueHashLowerCase: bytea('long_value_hash_lower_case'),
    longValue: text('long_value'),
  },
  (table) => [
    index('fed_user_attr_long_values').using(
      'btree',
      table.longValueHash.asc().nullsLast().op('text_ops'),
      table.name.asc().nullsLast().op('text_ops'),
    ),
    index('fed_user_attr_long_values_lower_case').using(
      'btree',
      table.longValueHashLowerCase.asc().nullsLast().op('bytea_ops'),
      table.name.asc().nullsLast().op('bytea_ops'),
    ),
    index('idx_fu_attribute').using(
      'btree',
      table.userId.asc().nullsLast().op('text_ops'),
      table.realmId.asc().nullsLast().op('text_ops'),
      table.name.asc().nullsLast().op('text_ops'),
    ),
  ],
);

export const revokedToken = pgTable(
  'revoked_token',
  {
    id: varchar({ length: 255 }).primaryKey().notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    expire: bigint({ mode: 'number' }).notNull(),
  },
  (table) => [
    index('idx_rev_token_on_expire').using(
      'btree',
      table.expire.asc().nullsLast().op('int8_ops'),
    ),
  ],
);

export const identityProvider = pgTable(
  'identity_provider',
  {
    internalId: varchar('internal_id', { length: 36 }).primaryKey().notNull(),
    enabled: boolean().default(false).notNull(),
    providerAlias: varchar('provider_alias', { length: 255 }),
    providerId: varchar('provider_id', { length: 255 }),
    storeToken: boolean('store_token').default(false).notNull(),
    authenticateByDefault: boolean('authenticate_by_default')
      .default(false)
      .notNull(),
    realmId: varchar('realm_id', { length: 36 }),
    addTokenRole: boolean('add_token_role').default(true).notNull(),
    trustEmail: boolean('trust_email').default(false).notNull(),
    firstBrokerLoginFlowId: varchar('first_broker_login_flow_id', {
      length: 36,
    }),
    postBrokerLoginFlowId: varchar('post_broker_login_flow_id', { length: 36 }),
    providerDisplayName: varchar('provider_display_name', { length: 255 }),
    linkOnly: boolean('link_only').default(false).notNull(),
    organizationId: varchar('organization_id', { length: 255 }),
    hideOnLogin: boolean('hide_on_login').default(false),
  },
  (table) => [
    index('idx_ident_prov_realm').using(
      'btree',
      table.realmId.asc().nullsLast().op('text_ops'),
    ),
    index('idx_idp_for_login').using(
      'btree',
      table.realmId.asc().nullsLast().op('text_ops'),
      table.enabled.asc().nullsLast().op('bool_ops'),
      table.linkOnly.asc().nullsLast().op('text_ops'),
      table.hideOnLogin.asc().nullsLast().op('bool_ops'),
      table.organizationId.asc().nullsLast().op('bool_ops'),
    ),
    index('idx_idp_realm_org').using(
      'btree',
      table.realmId.asc().nullsLast().op('text_ops'),
      table.organizationId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.realmId],
      foreignColumns: [realm.id],
      name: 'fk2b4ebc52ae5c3b34',
    }),
    unique('uk_2daelwnibji49avxsrtuf6xj33').on(
      table.providerAlias,
      table.realmId,
    ),
  ],
);

export const org = pgTable(
  'org',
  {
    id: varchar({ length: 255 }).primaryKey().notNull(),
    enabled: boolean().notNull(),
    realmId: varchar('realm_id', { length: 255 }).notNull(),
    groupId: varchar('group_id', { length: 255 }).notNull(),
    name: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 4000 }),
    alias: varchar({ length: 255 }).notNull(),
    redirectUrl: varchar('redirect_url', { length: 2048 }),
  },
  (table) => [
    unique('uk_org_name').on(table.realmId, table.name),
    unique('uk_org_alias').on(table.realmId, table.alias),
    unique('uk_org_group').on(table.groupId),
  ],
);

export const jgroupsPing = pgTable('jgroups_ping', {
  address: varchar({ length: 200 }).primaryKey().notNull(),
  name: varchar({ length: 200 }),
  clusterName: varchar('cluster_name', { length: 200 }).notNull(),
  ip: varchar({ length: 200 }).notNull(),
  coord: boolean(),
});

export const adminEventEntity = pgTable(
  'admin_event_entity',
  {
    id: varchar({ length: 36 }).primaryKey().notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    adminEventTime: bigint('admin_event_time', { mode: 'number' }),
    realmId: varchar('realm_id', { length: 255 }),
    operationType: varchar('operation_type', { length: 255 }),
    authRealmId: varchar('auth_realm_id', { length: 255 }),
    authClientId: varchar('auth_client_id', { length: 255 }),
    authUserId: varchar('auth_user_id', { length: 255 }),
    ipAddress: varchar('ip_address', { length: 255 }),
    resourcePath: varchar('resource_path', { length: 2550 }),
    representation: text(),
    error: varchar({ length: 255 }),
    resourceType: varchar('resource_type', { length: 64 }),
    detailsJson: text('details_json'),
  },
  (table) => [
    index('idx_admin_event_time').using(
      'btree',
      table.realmId.asc().nullsLast().op('int8_ops'),
      table.adminEventTime.asc().nullsLast().op('int8_ops'),
    ),
  ],
);

export const serverConfig = pgTable('server_config', {
  serverConfigKey: varchar('server_config_key', { length: 255 })
    .primaryKey()
    .notNull(),
  value: text().notNull(),
  version: integer().default(0),
});

export const credential = pgTable(
  'credential',
  {
    id: varchar({ length: 36 }).primaryKey().notNull(),
    // TODO: failed to parse database type 'bytea'
    salt: bytea('salt'),
    type: varchar({ length: 255 }),
    userId: varchar('user_id', { length: 36 }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    createdDate: bigint('created_date', { mode: 'number' }),
    userLabel: varchar('user_label', { length: 255 }),
    secretData: text('secret_data'),
    credentialData: text('credential_data'),
    priority: integer(),
    version: integer().default(0),
  },
  (table) => [
    index('idx_user_credential').using(
      'btree',
      table.userId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userEntity.id],
      name: 'fk_pfyr0glasqyl0dei3kl69r6v0',
    }),
  ],
);

export const keycloakGroup = pgTable(
  'keycloak_group',
  {
    id: varchar({ length: 36 }).primaryKey().notNull(),
    name: varchar({ length: 255 }),
    parentGroup: varchar('parent_group', { length: 36 }).notNull(),
    realmId: varchar('realm_id', { length: 36 }),
    type: integer().default(0).notNull(),
    description: varchar({ length: 255 }),
  },
  (table) => [
    unique('sibling_names').on(table.name, table.parentGroup, table.realmId),
  ],
);

export const redirectUris = pgTable(
  'redirect_uris',
  {
    clientId: varchar('client_id', { length: 36 }).notNull(),
    value: varchar({ length: 255 }).notNull(),
  },
  (table) => [
    index('idx_redir_uri_client').using(
      'btree',
      table.clientId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.clientId],
      foreignColumns: [client.id],
      name: 'fk_1burs8pb4ouj97h5wuppahv9f',
    }),
    primaryKey({
      columns: [table.clientId, table.value],
      name: 'constraint_redirect_uris',
    }),
  ],
);

export const compositeRole = pgTable(
  'composite_role',
  {
    composite: varchar({ length: 36 }).notNull(),
    childRole: varchar('child_role', { length: 36 }).notNull(),
  },
  (table) => [
    index('idx_composite').using(
      'btree',
      table.composite.asc().nullsLast().op('text_ops'),
    ),
    index('idx_composite_child').using(
      'btree',
      table.childRole.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.composite],
      foreignColumns: [keycloakRole.id],
      name: 'fk_a63wvekftu8jo1pnj81e7mce2',
    }),
    foreignKey({
      columns: [table.childRole],
      foreignColumns: [keycloakRole.id],
      name: 'fk_gr7thllb9lu8q4vqa4524jjy8',
    }),
    primaryKey({
      columns: [table.composite, table.childRole],
      name: 'constraint_composite_role',
    }),
  ],
);

export const userRoleMapping = pgTable(
  'user_role_mapping',
  {
    roleId: varchar('role_id', { length: 255 }).notNull(),
    userId: varchar('user_id', { length: 36 }).notNull(),
  },
  (table) => [
    index('idx_user_role_mapping').using(
      'btree',
      table.userId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userEntity.id],
      name: 'fk_c4fqv34p1mbylloxang7b1q3l',
    }),
    primaryKey({ columns: [table.roleId, table.userId], name: 'constraint_c' }),
  ],
);

export const realmEventsListeners = pgTable(
  'realm_events_listeners',
  {
    realmId: varchar('realm_id', { length: 36 }).notNull(),
    value: varchar({ length: 255 }).notNull(),
  },
  (table) => [
    index('idx_realm_evt_list_realm').using(
      'btree',
      table.realmId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.realmId],
      foreignColumns: [realm.id],
      name: 'fk_h846o4h0w8epx5nxev9f5y69j',
    }),
    primaryKey({
      columns: [table.realmId, table.value],
      name: 'constr_realm_events_listeners',
    }),
  ],
);

export const webOrigins = pgTable(
  'web_origins',
  {
    clientId: varchar('client_id', { length: 36 }).notNull(),
    value: varchar({ length: 255 }).notNull(),
  },
  (table) => [
    index('idx_web_orig_client').using(
      'btree',
      table.clientId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.clientId],
      foreignColumns: [client.id],
      name: 'fk_lojpho213xcx4wnkog82ssrfy',
    }),
    primaryKey({
      columns: [table.clientId, table.value],
      name: 'constraint_web_origins',
    }),
  ],
);

export const scopeMapping = pgTable(
  'scope_mapping',
  {
    clientId: varchar('client_id', { length: 36 }).notNull(),
    roleId: varchar('role_id', { length: 36 }).notNull(),
  },
  (table) => [
    index('idx_scope_mapping_role').using(
      'btree',
      table.roleId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.clientId],
      foreignColumns: [client.id],
      name: 'fk_ouse064plmlr732lxjcn1q5f1',
    }),
    primaryKey({
      columns: [table.clientId, table.roleId],
      name: 'constraint_81',
    }),
  ],
);

export const realmSupportedLocales = pgTable(
  'realm_supported_locales',
  {
    realmId: varchar('realm_id', { length: 36 }).notNull(),
    value: varchar({ length: 255 }).notNull(),
  },
  (table) => [
    index('idx_realm_supp_local_realm').using(
      'btree',
      table.realmId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.realmId],
      foreignColumns: [realm.id],
      name: 'fk_supported_locales_realm',
    }),
    primaryKey({
      columns: [table.realmId, table.value],
      name: 'constr_realm_supported_locales',
    }),
  ],
);

export const realmEnabledEventTypes = pgTable(
  'realm_enabled_event_types',
  {
    realmId: varchar('realm_id', { length: 36 }).notNull(),
    value: varchar({ length: 255 }).notNull(),
  },
  (table) => [
    index('idx_realm_evt_types_realm').using(
      'btree',
      table.realmId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.realmId],
      foreignColumns: [realm.id],
      name: 'fk_h846o4h0w8epx5nwedrf5y69j',
    }),
    primaryKey({
      columns: [table.realmId, table.value],
      name: 'constr_realm_enabl_event_types',
    }),
  ],
);

export const userRequiredAction = pgTable(
  'user_required_action',
  {
    userId: varchar('user_id', { length: 36 }).notNull(),
    requiredAction: varchar('required_action', { length: 255 })
      .default(' ')
      .notNull(),
  },
  (table) => [
    index('idx_user_reqactions').using(
      'btree',
      table.userId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userEntity.id],
      name: 'fk_6qj3w1jw9cvafhe19bwsiuvmd',
    }),
    primaryKey({
      columns: [table.userId, table.requiredAction],
      name: 'constraint_required_action',
    }),
  ],
);

export const groupRoleMapping = pgTable(
  'group_role_mapping',
  {
    roleId: varchar('role_id', { length: 36 }).notNull(),
    groupId: varchar('group_id', { length: 36 }).notNull(),
  },
  (table) => [
    index('idx_group_role_mapp_group').using(
      'btree',
      table.groupId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.groupId],
      foreignColumns: [keycloakGroup.id],
      name: 'fk_group_role_group',
    }),
    primaryKey({
      columns: [table.roleId, table.groupId],
      name: 'constraint_group_role',
    }),
  ],
);

export const realmDefaultGroups = pgTable(
  'realm_default_groups',
  {
    realmId: varchar('realm_id', { length: 36 }).notNull(),
    groupId: varchar('group_id', { length: 36 }).notNull(),
  },
  (table) => [
    index('idx_realm_def_grp_realm').using(
      'btree',
      table.realmId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.realmId],
      foreignColumns: [realm.id],
      name: 'fk_def_groups_realm',
    }),
    primaryKey({
      columns: [table.realmId, table.groupId],
      name: 'constr_realm_default_groups',
    }),
    unique('con_group_id_def_groups').on(table.groupId),
  ],
);

export const resourceScope = pgTable(
  'resource_scope',
  {
    resourceId: varchar('resource_id', { length: 36 }).notNull(),
    scopeId: varchar('scope_id', { length: 36 }).notNull(),
  },
  (table) => [
    index('idx_res_scope_scope').using(
      'btree',
      table.scopeId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.resourceId],
      foreignColumns: [resourceServerResource.id],
      name: 'fk_frsrpos13xcx4wnkog82ssrfy',
    }),
    foreignKey({
      columns: [table.scopeId],
      foreignColumns: [resourceServerScope.id],
      name: 'fk_frsrps213xcx4wnkog82ssrfy',
    }),
    primaryKey({
      columns: [table.resourceId, table.scopeId],
      name: 'constraint_farsrsp',
    }),
  ],
);

export const resourcePolicy = pgTable(
  'resource_policy',
  {
    resourceId: varchar('resource_id', { length: 36 }).notNull(),
    policyId: varchar('policy_id', { length: 36 }).notNull(),
  },
  (table) => [
    index('idx_res_policy_policy').using(
      'btree',
      table.policyId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.resourceId],
      foreignColumns: [resourceServerResource.id],
      name: 'fk_frsrpos53xcx4wnkog82ssrfy',
    }),
    foreignKey({
      columns: [table.policyId],
      foreignColumns: [resourceServerPolicy.id],
      name: 'fk_frsrpp213xcx4wnkog82ssrfy',
    }),
    primaryKey({
      columns: [table.resourceId, table.policyId],
      name: 'constraint_farsrpp',
    }),
  ],
);

export const scopePolicy = pgTable(
  'scope_policy',
  {
    scopeId: varchar('scope_id', { length: 36 }).notNull(),
    policyId: varchar('policy_id', { length: 36 }).notNull(),
  },
  (table) => [
    index('idx_scope_policy_policy').using(
      'btree',
      table.policyId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.scopeId],
      foreignColumns: [resourceServerScope.id],
      name: 'fk_frsrpass3xcx4wnkog82ssrfy',
    }),
    foreignKey({
      columns: [table.policyId],
      foreignColumns: [resourceServerPolicy.id],
      name: 'fk_frsrasp13xcx4wnkog82ssrfy',
    }),
    primaryKey({
      columns: [table.scopeId, table.policyId],
      name: 'constraint_farsrsps',
    }),
  ],
);

export const associatedPolicy = pgTable(
  'associated_policy',
  {
    policyId: varchar('policy_id', { length: 36 }).notNull(),
    associatedPolicyId: varchar('associated_policy_id', {
      length: 36,
    }).notNull(),
  },
  (table) => [
    index('idx_assoc_pol_assoc_pol_id').using(
      'btree',
      table.associatedPolicyId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.policyId],
      foreignColumns: [resourceServerPolicy.id],
      name: 'fk_frsrpas14xcx4wnkog82ssrfy',
    }),
    foreignKey({
      columns: [table.associatedPolicyId],
      foreignColumns: [resourceServerPolicy.id],
      name: 'fk_frsr5s213xcx4wnkog82ssrfy',
    }),
    primaryKey({
      columns: [table.policyId, table.associatedPolicyId],
      name: 'constraint_farsrpap',
    }),
  ],
);

export const clientScopeRoleMapping = pgTable(
  'client_scope_role_mapping',
  {
    scopeId: varchar('scope_id', { length: 36 }).notNull(),
    roleId: varchar('role_id', { length: 36 }).notNull(),
  },
  (table) => [
    index('idx_clscope_role').using(
      'btree',
      table.scopeId.asc().nullsLast().op('text_ops'),
    ),
    index('idx_role_clscope').using(
      'btree',
      table.roleId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.scopeId],
      foreignColumns: [clientScope.id],
      name: 'fk_cl_scope_rm_scope',
    }),
    primaryKey({
      columns: [table.scopeId, table.roleId],
      name: 'pk_template_scope',
    }),
  ],
);

export const userConsentClientScope = pgTable(
  'user_consent_client_scope',
  {
    userConsentId: varchar('user_consent_id', { length: 36 }).notNull(),
    scopeId: varchar('scope_id', { length: 36 }).notNull(),
  },
  (table) => [
    index('idx_usconsent_clscope').using(
      'btree',
      table.userConsentId.asc().nullsLast().op('text_ops'),
    ),
    index('idx_usconsent_scope_id').using(
      'btree',
      table.scopeId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.userConsentId],
      foreignColumns: [userConsent.id],
      name: 'fk_grntcsnt_clsc_usc',
    }),
    primaryKey({
      columns: [table.userConsentId, table.scopeId],
      name: 'constraint_grntcsnt_clsc_pm',
    }),
  ],
);

export const fedUserConsentClScope = pgTable(
  'fed_user_consent_cl_scope',
  {
    userConsentId: varchar('user_consent_id', { length: 36 }).notNull(),
    scopeId: varchar('scope_id', { length: 36 }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.userConsentId, table.scopeId],
      name: 'constraint_fgrntcsnt_clsc_pm',
    }),
  ],
);

export const resourceUris = pgTable(
  'resource_uris',
  {
    resourceId: varchar('resource_id', { length: 36 }).notNull(),
    value: varchar({ length: 255 }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.resourceId],
      foreignColumns: [resourceServerResource.id],
      name: 'fk_resource_server_uris',
    }),
    primaryKey({
      columns: [table.resourceId, table.value],
      name: 'constraint_resour_uris_pk',
    }),
  ],
);

export const realmSmtpConfig = pgTable(
  'realm_smtp_config',
  {
    realmId: varchar('realm_id', { length: 36 }).notNull(),
    value: varchar({ length: 255 }),
    name: varchar({ length: 255 }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.realmId],
      foreignColumns: [realm.id],
      name: 'fk_70ej8xdxgxd0b9hh6180irr0o',
    }),
    primaryKey({ columns: [table.realmId, table.name], name: 'constraint_e' }),
  ],
);

export const userFederationConfig = pgTable(
  'user_federation_config',
  {
    userFederationProviderId: varchar('user_federation_provider_id', {
      length: 36,
    }).notNull(),
    value: varchar({ length: 255 }),
    name: varchar({ length: 255 }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userFederationProviderId],
      foreignColumns: [userFederationProvider.id],
      name: 'fk_t13hpu1j94r2ebpekr39x5eu5',
    }),
    primaryKey({
      columns: [table.userFederationProviderId, table.name],
      name: 'constraint_f9',
    }),
  ],
);

export const identityProviderConfig = pgTable(
  'identity_provider_config',
  {
    identityProviderId: varchar('identity_provider_id', {
      length: 36,
    }).notNull(),
    value: text(),
    name: varchar({ length: 255 }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.identityProviderId],
      foreignColumns: [identityProvider.internalId],
      name: 'fkdc4897cf864c4e43',
    }),
    primaryKey({
      columns: [table.identityProviderId, table.name],
      name: 'constraint_d',
    }),
  ],
);

export const protocolMapperConfig = pgTable(
  'protocol_mapper_config',
  {
    protocolMapperId: varchar('protocol_mapper_id', { length: 36 }).notNull(),
    value: text(),
    name: varchar({ length: 255 }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.protocolMapperId],
      foreignColumns: [protocolMapper.id],
      name: 'fk_pmconfig',
    }),
    primaryKey({
      columns: [table.protocolMapperId, table.name],
      name: 'constraint_pmconfig',
    }),
  ],
);

export const idpMapperConfig = pgTable(
  'idp_mapper_config',
  {
    idpMapperId: varchar('idp_mapper_id', { length: 36 }).notNull(),
    value: text(),
    name: varchar({ length: 255 }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.idpMapperId],
      foreignColumns: [identityProviderMapper.id],
      name: 'fk_idpmconfig',
    }),
    primaryKey({
      columns: [table.idpMapperId, table.name],
      name: 'constraint_idpmconfig',
    }),
  ],
);

export const clientNodeRegistrations = pgTable(
  'client_node_registrations',
  {
    clientId: varchar('client_id', { length: 36 }).notNull(),
    value: integer(),
    name: varchar({ length: 255 }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.clientId],
      foreignColumns: [client.id],
      name: 'fk4129723ba992f594',
    }),
    primaryKey({
      columns: [table.clientId, table.name],
      name: 'constraint_84',
    }),
  ],
);

export const userFederationMapperConfig = pgTable(
  'user_federation_mapper_config',
  {
    userFederationMapperId: varchar('user_federation_mapper_id', {
      length: 36,
    }).notNull(),
    value: varchar({ length: 255 }),
    name: varchar({ length: 255 }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userFederationMapperId],
      foreignColumns: [userFederationMapper.id],
      name: 'fk_fedmapper_cfg',
    }),
    primaryKey({
      columns: [table.userFederationMapperId, table.name],
      name: 'constraint_fedmapper_cfg_pm',
    }),
  ],
);

export const authenticatorConfigEntry = pgTable(
  'authenticator_config_entry',
  {
    authenticatorId: varchar('authenticator_id', { length: 36 }).notNull(),
    value: text(),
    name: varchar({ length: 255 }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.authenticatorId, table.name],
      name: 'constraint_auth_cfg_pk',
    }),
  ],
);

export const requiredActionConfig = pgTable(
  'required_action_config',
  {
    requiredActionId: varchar('required_action_id', { length: 36 }).notNull(),
    value: text(),
    name: varchar({ length: 255 }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.requiredActionId, table.name],
      name: 'constraint_req_act_cfg_pk',
    }),
  ],
);

export const policyConfig = pgTable(
  'policy_config',
  {
    policyId: varchar('policy_id', { length: 36 }).notNull(),
    name: varchar({ length: 255 }).notNull(),
    value: text(),
  },
  (table) => [
    foreignKey({
      columns: [table.policyId],
      foreignColumns: [resourceServerPolicy.id],
      name: 'fkdc34197cf864c4e43',
    }),
    primaryKey({
      columns: [table.policyId, table.name],
      name: 'constraint_dpc',
    }),
  ],
);

export const clientAuthFlowBindings = pgTable(
  'client_auth_flow_bindings',
  {
    clientId: varchar('client_id', { length: 36 }).notNull(),
    flowId: varchar('flow_id', { length: 36 }),
    bindingName: varchar('binding_name', { length: 255 }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.clientId, table.bindingName],
      name: 'c_cli_flow_bind',
    }),
  ],
);

export const clientScopeAttributes = pgTable(
  'client_scope_attributes',
  {
    scopeId: varchar('scope_id', { length: 36 }).notNull(),
    value: varchar({ length: 2048 }),
    name: varchar({ length: 255 }).notNull(),
  },
  (table) => [
    index('idx_clscope_attrs').using(
      'btree',
      table.scopeId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.scopeId],
      foreignColumns: [clientScope.id],
      name: 'fk_cl_scope_attr_scope',
    }),
    primaryKey({
      columns: [table.scopeId, table.name],
      name: 'pk_cl_tmpl_attr',
    }),
  ],
);

export const defaultClientScope = pgTable(
  'default_client_scope',
  {
    realmId: varchar('realm_id', { length: 36 }).notNull(),
    scopeId: varchar('scope_id', { length: 36 }).notNull(),
    defaultScope: boolean('default_scope').default(false).notNull(),
  },
  (table) => [
    index('idx_defcls_realm').using(
      'btree',
      table.realmId.asc().nullsLast().op('text_ops'),
    ),
    index('idx_defcls_scope').using(
      'btree',
      table.scopeId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.realmId],
      foreignColumns: [realm.id],
      name: 'fk_r_def_cli_scope_realm',
    }),
    primaryKey({
      columns: [table.realmId, table.scopeId],
      name: 'r_def_cli_scope_bind',
    }),
  ],
);

export const clientScopeClient = pgTable(
  'client_scope_client',
  {
    clientId: varchar('client_id', { length: 255 }).notNull(),
    scopeId: varchar('scope_id', { length: 255 }).notNull(),
    defaultScope: boolean('default_scope').default(false).notNull(),
  },
  (table) => [
    index('idx_cl_clscope').using(
      'btree',
      table.scopeId.asc().nullsLast().op('text_ops'),
    ),
    index('idx_clscope_cl').using(
      'btree',
      table.clientId.asc().nullsLast().op('text_ops'),
    ),
    primaryKey({
      columns: [table.clientId, table.scopeId],
      name: 'c_cli_scope_bind',
    }),
  ],
);

export const realmAttribute = pgTable(
  'realm_attribute',
  {
    name: varchar({ length: 255 }).notNull(),
    realmId: varchar('realm_id', { length: 36 }).notNull(),
    value: text(),
  },
  (table) => [
    index('idx_realm_attr_realm').using(
      'btree',
      table.realmId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.realmId],
      foreignColumns: [realm.id],
      name: 'fk_8shxd6l3e9atqukacxgpffptw',
    }),
    primaryKey({ columns: [table.name, table.realmId], name: 'constraint_9' }),
  ],
);

export const realmLocalizations = pgTable(
  'realm_localizations',
  {
    realmId: varchar('realm_id', { length: 255 }).notNull(),
    locale: varchar({ length: 255 }).notNull(),
    texts: text().notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.realmId, table.locale],
      name: 'realm_localizations_pkey',
    }),
  ],
);

export const clientAttributes = pgTable(
  'client_attributes',
  {
    clientId: varchar('client_id', { length: 36 }).notNull(),
    name: varchar({ length: 255 }).notNull(),
    value: text(),
  },
  (table) => [
    index('idx_client_att_by_name_value').using(
      'btree',
      sql`name`,
      sql`substr(value, 1, 255)`,
    ),
    foreignKey({
      columns: [table.clientId],
      foreignColumns: [client.id],
      name: 'fk3c47c64beacca966',
    }),
    primaryKey({
      columns: [table.clientId, table.name],
      name: 'constraint_3c',
    }),
  ],
);

export const userGroupMembership = pgTable(
  'user_group_membership',
  {
    groupId: varchar('group_id', { length: 36 }).notNull(),
    userId: varchar('user_id', { length: 36 }).notNull(),
    membershipType: varchar('membership_type', { length: 255 }).notNull(),
  },
  (table) => [
    index('idx_user_group_mapping').using(
      'btree',
      table.userId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userEntity.id],
      name: 'fk_user_group_user',
    }),
    primaryKey({
      columns: [table.groupId, table.userId],
      name: 'constraint_user_group',
    }),
  ],
);

export const fedUserGroupMembership = pgTable(
  'fed_user_group_membership',
  {
    groupId: varchar('group_id', { length: 36 }).notNull(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    realmId: varchar('realm_id', { length: 36 }).notNull(),
    storageProviderId: varchar('storage_provider_id', { length: 36 }),
  },
  (table) => [
    index('idx_fu_group_membership').using(
      'btree',
      table.userId.asc().nullsLast().op('text_ops'),
      table.groupId.asc().nullsLast().op('text_ops'),
    ),
    index('idx_fu_group_membership_ru').using(
      'btree',
      table.realmId.asc().nullsLast().op('text_ops'),
      table.userId.asc().nullsLast().op('text_ops'),
    ),
    primaryKey({
      columns: [table.groupId, table.userId],
      name: 'constr_fed_user_group',
    }),
  ],
);

export const fedUserRequiredAction = pgTable(
  'fed_user_required_action',
  {
    requiredAction: varchar('required_action', { length: 255 })
      .default(' ')
      .notNull(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    realmId: varchar('realm_id', { length: 36 }).notNull(),
    storageProviderId: varchar('storage_provider_id', { length: 36 }),
  },
  (table) => [
    index('idx_fu_required_action').using(
      'btree',
      table.userId.asc().nullsLast().op('text_ops'),
      table.requiredAction.asc().nullsLast().op('text_ops'),
    ),
    index('idx_fu_required_action_ru').using(
      'btree',
      table.realmId.asc().nullsLast().op('text_ops'),
      table.userId.asc().nullsLast().op('text_ops'),
    ),
    primaryKey({
      columns: [table.requiredAction, table.userId],
      name: 'constr_fed_required_action',
    }),
  ],
);

export const fedUserRoleMapping = pgTable(
  'fed_user_role_mapping',
  {
    roleId: varchar('role_id', { length: 36 }).notNull(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    realmId: varchar('realm_id', { length: 36 }).notNull(),
    storageProviderId: varchar('storage_provider_id', { length: 36 }),
  },
  (table) => [
    index('idx_fu_role_mapping').using(
      'btree',
      table.userId.asc().nullsLast().op('text_ops'),
      table.roleId.asc().nullsLast().op('text_ops'),
    ),
    index('idx_fu_role_mapping_ru').using(
      'btree',
      table.realmId.asc().nullsLast().op('text_ops'),
      table.userId.asc().nullsLast().op('text_ops'),
    ),
    primaryKey({
      columns: [table.roleId, table.userId],
      name: 'constr_fed_user_role',
    }),
  ],
);

export const orgDomain = pgTable(
  'org_domain',
  {
    id: varchar({ length: 36 }).notNull(),
    name: varchar({ length: 255 }).notNull(),
    verified: boolean().notNull(),
    orgId: varchar('org_id', { length: 255 }).notNull(),
  },
  (table) => [
    index('idx_org_domain_org_id').using(
      'btree',
      table.orgId.asc().nullsLast().op('text_ops'),
    ),
    primaryKey({ columns: [table.id, table.name], name: 'ORG_DOMAIN_pkey' }),
  ],
);

export const realmRequiredCredential = pgTable(
  'realm_required_credential',
  {
    type: varchar({ length: 255 }).notNull(),
    formLabel: varchar('form_label', { length: 255 }),
    input: boolean().default(false).notNull(),
    secret: boolean().default(false).notNull(),
    realmId: varchar('realm_id', { length: 36 }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.realmId],
      foreignColumns: [realm.id],
      name: 'fk_5hg65lybevavkqfki3kponh9v',
    }),
    primaryKey({ columns: [table.type, table.realmId], name: 'constraint_92' }),
  ],
);

export const federatedIdentity = pgTable(
  'federated_identity',
  {
    identityProvider: varchar('identity_provider', { length: 255 }).notNull(),
    realmId: varchar('realm_id', { length: 36 }),
    federatedUserId: varchar('federated_user_id', { length: 255 }),
    federatedUsername: varchar('federated_username', { length: 255 }),
    token: text(),
    userId: varchar('user_id', { length: 36 }).notNull(),
  },
  (table) => [
    index('idx_fedidentity_feduser').using(
      'btree',
      table.federatedUserId.asc().nullsLast().op('text_ops'),
    ),
    index('idx_fedidentity_user').using(
      'btree',
      table.userId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userEntity.id],
      name: 'fk404288b92ef007a6',
    }),
    primaryKey({
      columns: [table.identityProvider, table.userId],
      name: 'constraint_40',
    }),
  ],
);

export const brokerLink = pgTable(
  'broker_link',
  {
    identityProvider: varchar('identity_provider', { length: 255 }).notNull(),
    storageProviderId: varchar('storage_provider_id', { length: 255 }),
    realmId: varchar('realm_id', { length: 36 }).notNull(),
    brokerUserId: varchar('broker_user_id', { length: 255 }),
    brokerUsername: varchar('broker_username', { length: 255 }),
    token: text(),
    userId: varchar('user_id', { length: 255 }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.identityProvider, table.userId],
      name: 'constr_broker_link_pk',
    }),
  ],
);

export const offlineClientSession = pgTable(
  'offline_client_session',
  {
    userSessionId: varchar('user_session_id', { length: 36 }).notNull(),
    clientId: varchar('client_id', { length: 255 }).notNull(),
    offlineFlag: varchar('offline_flag', { length: 4 }).notNull(),
    timestamp: integer(),
    data: text(),
    clientStorageProvider: varchar('client_storage_provider', { length: 36 })
      .default('local')
      .notNull(),
    externalClientId: varchar('external_client_id', { length: 255 })
      .default('local')
      .notNull(),
    version: integer().default(0),
  },
  (table) => [
    primaryKey({
      columns: [
        table.userSessionId,
        table.clientId,
        table.offlineFlag,
        table.clientStorageProvider,
        table.externalClientId,
      ],
      name: 'constraint_offl_cl_ses_pk3',
    }),
  ],
);

export const offlineUserSession = pgTable(
  'offline_user_session',
  {
    userSessionId: varchar('user_session_id', { length: 36 }).notNull(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    realmId: varchar('realm_id', { length: 36 }).notNull(),
    createdOn: integer('created_on').notNull(),
    offlineFlag: varchar('offline_flag', { length: 4 }).notNull(),
    data: text(),
    lastSessionRefresh: integer('last_session_refresh').default(0).notNull(),
    brokerSessionId: varchar('broker_session_id', { length: 1024 }),
    version: integer().default(0),
  },
  (table) => [
    index('idx_offline_uss_by_broker_session_id').using(
      'btree',
      table.brokerSessionId.asc().nullsLast().op('text_ops'),
      table.realmId.asc().nullsLast().op('text_ops'),
    ),
    index('idx_offline_uss_by_last_session_refresh').using(
      'btree',
      table.realmId.asc().nullsLast().op('int4_ops'),
      table.offlineFlag.asc().nullsLast().op('int4_ops'),
      table.lastSessionRefresh.asc().nullsLast().op('int4_ops'),
    ),
    index('idx_offline_uss_by_user').using(
      'btree',
      table.userId.asc().nullsLast().op('text_ops'),
      table.realmId.asc().nullsLast().op('text_ops'),
      table.offlineFlag.asc().nullsLast().op('text_ops'),
    ),
    primaryKey({
      columns: [table.userSessionId, table.offlineFlag],
      name: 'constraint_offl_us_ses_pk2',
    }),
  ],
);
