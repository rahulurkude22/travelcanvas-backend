import { relations } from 'drizzle-orm/relations';
import {
  realm,
  userFederationProvider,
  identityProviderMapper,
  userFederationMapper,
  authenticationFlow,
  authenticationExecution,
  authenticatorConfig,
  keycloakRole,
  keycloakGroup,
  groupAttribute,
  client,
  protocolMapper,
  clientScope,
  component,
  clientInitialAccess,
  resourceServer,
  resourceServerResource,
  resourceServerScope,
  resourceAttribute,
  requiredActionProvider,
  roleAttribute,
  userEntity,
  userConsent,
  resourceServerPermTicket,
  resourceServerPolicy,
  componentConfig,
  userAttribute,
  identityProvider,
  credential,
  redirectUris,
  compositeRole,
  userRoleMapping,
  realmEventsListeners,
  webOrigins,
  scopeMapping,
  realmSupportedLocales,
  realmEnabledEventTypes,
  userRequiredAction,
  groupRoleMapping,
  realmDefaultGroups,
  resourceScope,
  resourcePolicy,
  scopePolicy,
  associatedPolicy,
  clientScopeRoleMapping,
  userConsentClientScope,
  resourceUris,
  realmSmtpConfig,
  userFederationConfig,
  identityProviderConfig,
  protocolMapperConfig,
  idpMapperConfig,
  clientNodeRegistrations,
  userFederationMapperConfig,
  policyConfig,
  clientScopeAttributes,
  defaultClientScope,
  realmAttribute,
  clientAttributes,
  userGroupMembership,
  realmRequiredCredential,
  federatedIdentity,
} from './schema';

export const userFederationProviderRelations = relations(
  userFederationProvider,
  ({ one, many }) => ({
    realm: one(realm, {
      fields: [userFederationProvider.realmId],
      references: [realm.id],
    }),
    userFederationMappers: many(userFederationMapper),
    userFederationConfigs: many(userFederationConfig),
  }),
);

export const realmRelations = relations(realm, ({ many }) => ({
  userFederationProviders: many(userFederationProvider),
  identityProviderMappers: many(identityProviderMapper),
  userFederationMappers: many(userFederationMapper),
  authenticationFlows: many(authenticationFlow),
  authenticationExecutions: many(authenticationExecution),
  authenticatorConfigs: many(authenticatorConfig),
  keycloakRoles: many(keycloakRole),
  components: many(component),
  clientInitialAccesses: many(clientInitialAccess),
  requiredActionProviders: many(requiredActionProvider),
  identityProviders: many(identityProvider),
  realmEventsListeners: many(realmEventsListeners),
  realmSupportedLocales: many(realmSupportedLocales),
  realmEnabledEventTypes: many(realmEnabledEventTypes),
  realmDefaultGroups: many(realmDefaultGroups),
  realmSmtpConfigs: many(realmSmtpConfig),
  defaultClientScopes: many(defaultClientScope),
  realmAttributes: many(realmAttribute),
  realmRequiredCredentials: many(realmRequiredCredential),
}));

export const identityProviderMapperRelations = relations(
  identityProviderMapper,
  ({ one, many }) => ({
    realm: one(realm, {
      fields: [identityProviderMapper.realmId],
      references: [realm.id],
    }),
    idpMapperConfigs: many(idpMapperConfig),
  }),
);

export const userFederationMapperRelations = relations(
  userFederationMapper,
  ({ one, many }) => ({
    realm: one(realm, {
      fields: [userFederationMapper.realmId],
      references: [realm.id],
    }),
    userFederationProvider: one(userFederationProvider, {
      fields: [userFederationMapper.federationProviderId],
      references: [userFederationProvider.id],
    }),
    userFederationMapperConfigs: many(userFederationMapperConfig),
  }),
);

export const authenticationFlowRelations = relations(
  authenticationFlow,
  ({ one, many }) => ({
    realm: one(realm, {
      fields: [authenticationFlow.realmId],
      references: [realm.id],
    }),
    authenticationExecutions: many(authenticationExecution),
  }),
);

export const authenticationExecutionRelations = relations(
  authenticationExecution,
  ({ one }) => ({
    realm: one(realm, {
      fields: [authenticationExecution.realmId],
      references: [realm.id],
    }),
    authenticationFlow: one(authenticationFlow, {
      fields: [authenticationExecution.flowId],
      references: [authenticationFlow.id],
    }),
  }),
);

export const authenticatorConfigRelations = relations(
  authenticatorConfig,
  ({ one }) => ({
    realm: one(realm, {
      fields: [authenticatorConfig.realmId],
      references: [realm.id],
    }),
  }),
);

export const keycloakRoleRelations = relations(
  keycloakRole,
  ({ one, many }) => ({
    realm: one(realm, {
      fields: [keycloakRole.realm],
      references: [realm.id],
    }),
    roleAttributes: many(roleAttribute),
    compositeRoles_composite: many(compositeRole, {
      relationName: 'compositeRole_composite_keycloakRole_id',
    }),
    compositeRoles_childRole: many(compositeRole, {
      relationName: 'compositeRole_childRole_keycloakRole_id',
    }),
  }),
);

export const groupAttributeRelations = relations(groupAttribute, ({ one }) => ({
  keycloakGroup: one(keycloakGroup, {
    fields: [groupAttribute.groupId],
    references: [keycloakGroup.id],
  }),
}));

export const keycloakGroupRelations = relations(keycloakGroup, ({ many }) => ({
  groupAttributes: many(groupAttribute),
  groupRoleMappings: many(groupRoleMapping),
}));

export const protocolMapperRelations = relations(
  protocolMapper,
  ({ one, many }) => ({
    client: one(client, {
      fields: [protocolMapper.clientId],
      references: [client.id],
    }),
    clientScope: one(clientScope, {
      fields: [protocolMapper.clientScopeId],
      references: [clientScope.id],
    }),
    protocolMapperConfigs: many(protocolMapperConfig),
  }),
);

export const clientRelations = relations(client, ({ many }) => ({
  protocolMappers: many(protocolMapper),
  redirectUrises: many(redirectUris),
  webOrigins: many(webOrigins),
  scopeMappings: many(scopeMapping),
  clientNodeRegistrations: many(clientNodeRegistrations),
  clientAttributes: many(clientAttributes),
}));

export const clientScopeRelations = relations(clientScope, ({ many }) => ({
  protocolMappers: many(protocolMapper),
  clientScopeRoleMappings: many(clientScopeRoleMapping),
  clientScopeAttributes: many(clientScopeAttributes),
}));

export const componentRelations = relations(component, ({ one, many }) => ({
  realm: one(realm, {
    fields: [component.realmId],
    references: [realm.id],
  }),
  componentConfigs: many(componentConfig),
}));

export const clientInitialAccessRelations = relations(
  clientInitialAccess,
  ({ one }) => ({
    realm: one(realm, {
      fields: [clientInitialAccess.realmId],
      references: [realm.id],
    }),
  }),
);

export const resourceServerResourceRelations = relations(
  resourceServerResource,
  ({ one, many }) => ({
    resourceServer: one(resourceServer, {
      fields: [resourceServerResource.resourceServerId],
      references: [resourceServer.id],
    }),
    resourceAttributes: many(resourceAttribute),
    resourceServerPermTickets: many(resourceServerPermTicket),
    resourceScopes: many(resourceScope),
    resourcePolicies: many(resourcePolicy),
    resourceUrises: many(resourceUris),
  }),
);

export const resourceServerRelations = relations(
  resourceServer,
  ({ many }) => ({
    resourceServerResources: many(resourceServerResource),
    resourceServerScopes: many(resourceServerScope),
    resourceServerPermTickets: many(resourceServerPermTicket),
    resourceServerPolicies: many(resourceServerPolicy),
  }),
);

export const resourceServerScopeRelations = relations(
  resourceServerScope,
  ({ one, many }) => ({
    resourceServer: one(resourceServer, {
      fields: [resourceServerScope.resourceServerId],
      references: [resourceServer.id],
    }),
    resourceServerPermTickets: many(resourceServerPermTicket),
    resourceScopes: many(resourceScope),
    scopePolicies: many(scopePolicy),
  }),
);

export const resourceAttributeRelations = relations(
  resourceAttribute,
  ({ one }) => ({
    resourceServerResource: one(resourceServerResource, {
      fields: [resourceAttribute.resourceId],
      references: [resourceServerResource.id],
    }),
  }),
);

export const requiredActionProviderRelations = relations(
  requiredActionProvider,
  ({ one }) => ({
    realm: one(realm, {
      fields: [requiredActionProvider.realmId],
      references: [realm.id],
    }),
  }),
);

export const roleAttributeRelations = relations(roleAttribute, ({ one }) => ({
  keycloakRole: one(keycloakRole, {
    fields: [roleAttribute.roleId],
    references: [keycloakRole.id],
  }),
}));

export const userConsentRelations = relations(userConsent, ({ one, many }) => ({
  userEntity: one(userEntity, {
    fields: [userConsent.userId],
    references: [userEntity.id],
  }),
  userConsentClientScopes: many(userConsentClientScope),
}));

export const userEntityRelations = relations(userEntity, ({ many }) => ({
  userConsents: many(userConsent),
  userAttributes: many(userAttribute),
  credentials: many(credential),
  userRoleMappings: many(userRoleMapping),
  userRequiredActions: many(userRequiredAction),
  userGroupMemberships: many(userGroupMembership),
  federatedIdentities: many(federatedIdentity),
}));

export const resourceServerPermTicketRelations = relations(
  resourceServerPermTicket,
  ({ one }) => ({
    resourceServer: one(resourceServer, {
      fields: [resourceServerPermTicket.resourceServerId],
      references: [resourceServer.id],
    }),
    resourceServerResource: one(resourceServerResource, {
      fields: [resourceServerPermTicket.resourceId],
      references: [resourceServerResource.id],
    }),
    resourceServerScope: one(resourceServerScope, {
      fields: [resourceServerPermTicket.scopeId],
      references: [resourceServerScope.id],
    }),
    resourceServerPolicy: one(resourceServerPolicy, {
      fields: [resourceServerPermTicket.policyId],
      references: [resourceServerPolicy.id],
    }),
  }),
);

export const resourceServerPolicyRelations = relations(
  resourceServerPolicy,
  ({ one, many }) => ({
    resourceServerPermTickets: many(resourceServerPermTicket),
    resourceServer: one(resourceServer, {
      fields: [resourceServerPolicy.resourceServerId],
      references: [resourceServer.id],
    }),
    resourcePolicies: many(resourcePolicy),
    scopePolicies: many(scopePolicy),
    associatedPolicies_policyId: many(associatedPolicy, {
      relationName: 'associatedPolicy_policyId_resourceServerPolicy_id',
    }),
    associatedPolicies_associatedPolicyId: many(associatedPolicy, {
      relationName:
        'associatedPolicy_associatedPolicyId_resourceServerPolicy_id',
    }),
    policyConfigs: many(policyConfig),
  }),
);

export const componentConfigRelations = relations(
  componentConfig,
  ({ one }) => ({
    component: one(component, {
      fields: [componentConfig.componentId],
      references: [component.id],
    }),
  }),
);

export const userAttributeRelations = relations(userAttribute, ({ one }) => ({
  userEntity: one(userEntity, {
    fields: [userAttribute.userId],
    references: [userEntity.id],
  }),
}));

export const identityProviderRelations = relations(
  identityProvider,
  ({ one, many }) => ({
    realm: one(realm, {
      fields: [identityProvider.realmId],
      references: [realm.id],
    }),
    identityProviderConfigs: many(identityProviderConfig),
  }),
);

export const credentialRelations = relations(credential, ({ one }) => ({
  userEntity: one(userEntity, {
    fields: [credential.userId],
    references: [userEntity.id],
  }),
}));

export const redirectUrisRelations = relations(redirectUris, ({ one }) => ({
  client: one(client, {
    fields: [redirectUris.clientId],
    references: [client.id],
  }),
}));

export const compositeRoleRelations = relations(compositeRole, ({ one }) => ({
  keycloakRole_composite: one(keycloakRole, {
    fields: [compositeRole.composite],
    references: [keycloakRole.id],
    relationName: 'compositeRole_composite_keycloakRole_id',
  }),
  keycloakRole_childRole: one(keycloakRole, {
    fields: [compositeRole.childRole],
    references: [keycloakRole.id],
    relationName: 'compositeRole_childRole_keycloakRole_id',
  }),
}));

export const userRoleMappingRelations = relations(
  userRoleMapping,
  ({ one }) => ({
    userEntity: one(userEntity, {
      fields: [userRoleMapping.userId],
      references: [userEntity.id],
    }),
  }),
);

export const realmEventsListenersRelations = relations(
  realmEventsListeners,
  ({ one }) => ({
    realm: one(realm, {
      fields: [realmEventsListeners.realmId],
      references: [realm.id],
    }),
  }),
);

export const webOriginsRelations = relations(webOrigins, ({ one }) => ({
  client: one(client, {
    fields: [webOrigins.clientId],
    references: [client.id],
  }),
}));

export const scopeMappingRelations = relations(scopeMapping, ({ one }) => ({
  client: one(client, {
    fields: [scopeMapping.clientId],
    references: [client.id],
  }),
}));

export const realmSupportedLocalesRelations = relations(
  realmSupportedLocales,
  ({ one }) => ({
    realm: one(realm, {
      fields: [realmSupportedLocales.realmId],
      references: [realm.id],
    }),
  }),
);

export const realmEnabledEventTypesRelations = relations(
  realmEnabledEventTypes,
  ({ one }) => ({
    realm: one(realm, {
      fields: [realmEnabledEventTypes.realmId],
      references: [realm.id],
    }),
  }),
);

export const userRequiredActionRelations = relations(
  userRequiredAction,
  ({ one }) => ({
    userEntity: one(userEntity, {
      fields: [userRequiredAction.userId],
      references: [userEntity.id],
    }),
  }),
);

export const groupRoleMappingRelations = relations(
  groupRoleMapping,
  ({ one }) => ({
    keycloakGroup: one(keycloakGroup, {
      fields: [groupRoleMapping.groupId],
      references: [keycloakGroup.id],
    }),
  }),
);

export const realmDefaultGroupsRelations = relations(
  realmDefaultGroups,
  ({ one }) => ({
    realm: one(realm, {
      fields: [realmDefaultGroups.realmId],
      references: [realm.id],
    }),
  }),
);

export const resourceScopeRelations = relations(resourceScope, ({ one }) => ({
  resourceServerResource: one(resourceServerResource, {
    fields: [resourceScope.resourceId],
    references: [resourceServerResource.id],
  }),
  resourceServerScope: one(resourceServerScope, {
    fields: [resourceScope.scopeId],
    references: [resourceServerScope.id],
  }),
}));

export const resourcePolicyRelations = relations(resourcePolicy, ({ one }) => ({
  resourceServerResource: one(resourceServerResource, {
    fields: [resourcePolicy.resourceId],
    references: [resourceServerResource.id],
  }),
  resourceServerPolicy: one(resourceServerPolicy, {
    fields: [resourcePolicy.policyId],
    references: [resourceServerPolicy.id],
  }),
}));

export const scopePolicyRelations = relations(scopePolicy, ({ one }) => ({
  resourceServerScope: one(resourceServerScope, {
    fields: [scopePolicy.scopeId],
    references: [resourceServerScope.id],
  }),
  resourceServerPolicy: one(resourceServerPolicy, {
    fields: [scopePolicy.policyId],
    references: [resourceServerPolicy.id],
  }),
}));

export const associatedPolicyRelations = relations(
  associatedPolicy,
  ({ one }) => ({
    resourceServerPolicy_policyId: one(resourceServerPolicy, {
      fields: [associatedPolicy.policyId],
      references: [resourceServerPolicy.id],
      relationName: 'associatedPolicy_policyId_resourceServerPolicy_id',
    }),
    resourceServerPolicy_associatedPolicyId: one(resourceServerPolicy, {
      fields: [associatedPolicy.associatedPolicyId],
      references: [resourceServerPolicy.id],
      relationName:
        'associatedPolicy_associatedPolicyId_resourceServerPolicy_id',
    }),
  }),
);

export const clientScopeRoleMappingRelations = relations(
  clientScopeRoleMapping,
  ({ one }) => ({
    clientScope: one(clientScope, {
      fields: [clientScopeRoleMapping.scopeId],
      references: [clientScope.id],
    }),
  }),
);

export const userConsentClientScopeRelations = relations(
  userConsentClientScope,
  ({ one }) => ({
    userConsent: one(userConsent, {
      fields: [userConsentClientScope.userConsentId],
      references: [userConsent.id],
    }),
  }),
);

export const resourceUrisRelations = relations(resourceUris, ({ one }) => ({
  resourceServerResource: one(resourceServerResource, {
    fields: [resourceUris.resourceId],
    references: [resourceServerResource.id],
  }),
}));

export const realmSmtpConfigRelations = relations(
  realmSmtpConfig,
  ({ one }) => ({
    realm: one(realm, {
      fields: [realmSmtpConfig.realmId],
      references: [realm.id],
    }),
  }),
);

export const userFederationConfigRelations = relations(
  userFederationConfig,
  ({ one }) => ({
    userFederationProvider: one(userFederationProvider, {
      fields: [userFederationConfig.userFederationProviderId],
      references: [userFederationProvider.id],
    }),
  }),
);

export const identityProviderConfigRelations = relations(
  identityProviderConfig,
  ({ one }) => ({
    identityProvider: one(identityProvider, {
      fields: [identityProviderConfig.identityProviderId],
      references: [identityProvider.internalId],
    }),
  }),
);

export const protocolMapperConfigRelations = relations(
  protocolMapperConfig,
  ({ one }) => ({
    protocolMapper: one(protocolMapper, {
      fields: [protocolMapperConfig.protocolMapperId],
      references: [protocolMapper.id],
    }),
  }),
);

export const idpMapperConfigRelations = relations(
  idpMapperConfig,
  ({ one }) => ({
    identityProviderMapper: one(identityProviderMapper, {
      fields: [idpMapperConfig.idpMapperId],
      references: [identityProviderMapper.id],
    }),
  }),
);

export const clientNodeRegistrationsRelations = relations(
  clientNodeRegistrations,
  ({ one }) => ({
    client: one(client, {
      fields: [clientNodeRegistrations.clientId],
      references: [client.id],
    }),
  }),
);

export const userFederationMapperConfigRelations = relations(
  userFederationMapperConfig,
  ({ one }) => ({
    userFederationMapper: one(userFederationMapper, {
      fields: [userFederationMapperConfig.userFederationMapperId],
      references: [userFederationMapper.id],
    }),
  }),
);

export const policyConfigRelations = relations(policyConfig, ({ one }) => ({
  resourceServerPolicy: one(resourceServerPolicy, {
    fields: [policyConfig.policyId],
    references: [resourceServerPolicy.id],
  }),
}));

export const clientScopeAttributesRelations = relations(
  clientScopeAttributes,
  ({ one }) => ({
    clientScope: one(clientScope, {
      fields: [clientScopeAttributes.scopeId],
      references: [clientScope.id],
    }),
  }),
);

export const defaultClientScopeRelations = relations(
  defaultClientScope,
  ({ one }) => ({
    realm: one(realm, {
      fields: [defaultClientScope.realmId],
      references: [realm.id],
    }),
  }),
);

export const realmAttributeRelations = relations(realmAttribute, ({ one }) => ({
  realm: one(realm, {
    fields: [realmAttribute.realmId],
    references: [realm.id],
  }),
}));

export const clientAttributesRelations = relations(
  clientAttributes,
  ({ one }) => ({
    client: one(client, {
      fields: [clientAttributes.clientId],
      references: [client.id],
    }),
  }),
);

export const userGroupMembershipRelations = relations(
  userGroupMembership,
  ({ one }) => ({
    userEntity: one(userEntity, {
      fields: [userGroupMembership.userId],
      references: [userEntity.id],
    }),
  }),
);

export const realmRequiredCredentialRelations = relations(
  realmRequiredCredential,
  ({ one }) => ({
    realm: one(realm, {
      fields: [realmRequiredCredential.realmId],
      references: [realm.id],
    }),
  }),
);

export const federatedIdentityRelations = relations(
  federatedIdentity,
  ({ one }) => ({
    userEntity: one(userEntity, {
      fields: [federatedIdentity.userId],
      references: [userEntity.id],
    }),
  }),
);
