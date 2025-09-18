-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "databasechangeloglock" (
	"id" integer PRIMARY KEY NOT NULL,
	"locked" boolean NOT NULL,
	"lockgranted" timestamp,
	"lockedby" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "user_federation_provider" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"changed_sync_period" integer,
	"display_name" varchar(255),
	"full_sync_period" integer,
	"last_sync" integer,
	"priority" integer,
	"provider_name" varchar(255),
	"realm_id" varchar(36)
);
--> statement-breakpoint
CREATE TABLE "databasechangelog" (
	"id" varchar(255) NOT NULL,
	"author" varchar(255) NOT NULL,
	"filename" varchar(255) NOT NULL,
	"dateexecuted" timestamp NOT NULL,
	"orderexecuted" integer NOT NULL,
	"exectype" varchar(10) NOT NULL,
	"md5sum" varchar(35),
	"description" varchar(255),
	"comments" varchar(255),
	"tag" varchar(255),
	"liquibase" varchar(20),
	"contexts" varchar(255),
	"labels" varchar(255),
	"deployment_id" varchar(10)
);
--> statement-breakpoint
CREATE TABLE "identity_provider_mapper" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"idp_alias" varchar(255) NOT NULL,
	"idp_mapper_name" varchar(255) NOT NULL,
	"realm_id" varchar(36) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_federation_mapper" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"federation_provider_id" varchar(36) NOT NULL,
	"federation_mapper_type" varchar(255) NOT NULL,
	"realm_id" varchar(36) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "authentication_flow" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"alias" varchar(255),
	"description" varchar(255),
	"realm_id" varchar(36),
	"provider_id" varchar(36) DEFAULT 'basic-flow' NOT NULL,
	"top_level" boolean DEFAULT false NOT NULL,
	"built_in" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "authentication_execution" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"alias" varchar(255),
	"authenticator" varchar(36),
	"realm_id" varchar(36),
	"flow_id" varchar(36),
	"requirement" integer,
	"priority" integer,
	"authenticator_flow" boolean DEFAULT false NOT NULL,
	"auth_flow_id" varchar(36),
	"auth_config" varchar(36)
);
--> statement-breakpoint
CREATE TABLE "authenticator_config" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"alias" varchar(255),
	"realm_id" varchar(36)
);
--> statement-breakpoint
CREATE TABLE "keycloak_role" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"client_realm_constraint" varchar(255),
	"client_role" boolean DEFAULT false NOT NULL,
	"description" varchar(255),
	"name" varchar(255),
	"realm_id" varchar(255),
	"client" varchar(36),
	"realm" varchar(36),
	CONSTRAINT "UK_J3RWUVD56ONTGSUHOGM184WW2-2" UNIQUE("client_realm_constraint","name")
);
--> statement-breakpoint
CREATE TABLE "group_attribute" (
	"id" varchar(36) PRIMARY KEY DEFAULT 'sybase-needs-something-here' NOT NULL,
	"name" varchar(255) NOT NULL,
	"value" varchar(255),
	"group_id" varchar(36) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "protocol_mapper" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"protocol" varchar(255) NOT NULL,
	"protocol_mapper_name" varchar(255) NOT NULL,
	"client_id" varchar(36),
	"client_scope_id" varchar(36)
);
--> statement-breakpoint
CREATE TABLE "federated_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"storage_provider_id" varchar(255),
	"realm_id" varchar(36) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "component" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"parent_id" varchar(36),
	"provider_id" varchar(36),
	"provider_type" varchar(255),
	"realm_id" varchar(36),
	"sub_type" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "client_initial_access" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"realm_id" varchar(36) NOT NULL,
	"timestamp" integer,
	"expiration" integer,
	"count" integer,
	"remaining_count" integer
);
--> statement-breakpoint
CREATE TABLE "user_entity" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"email" varchar(255),
	"email_constraint" varchar(255),
	"email_verified" boolean DEFAULT false NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	"federation_link" varchar(255),
	"first_name" varchar(255),
	"last_name" varchar(255),
	"realm_id" varchar(255),
	"username" varchar(255),
	"created_timestamp" bigint,
	"service_account_client_link" varchar(255),
	"not_before" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "uk_dykn684sl8up1crfei6eckhd7" UNIQUE("email_constraint","realm_id"),
	CONSTRAINT "uk_ru8tt6t700s9v50bu18ws5ha6" UNIQUE("realm_id","username")
);
--> statement-breakpoint
CREATE TABLE "fed_user_consent" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"client_id" varchar(255),
	"user_id" varchar(255) NOT NULL,
	"realm_id" varchar(36) NOT NULL,
	"storage_provider_id" varchar(36),
	"created_date" bigint,
	"last_updated_date" bigint,
	"client_storage_provider" varchar(36),
	"external_client_id" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "client_scope" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"realm_id" varchar(36),
	"description" varchar(255),
	"protocol" varchar(255),
	CONSTRAINT "uk_cli_scope" UNIQUE("name","realm_id")
);
--> statement-breakpoint
CREATE TABLE "resource_server_resource" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" varchar(255),
	"icon_uri" varchar(255),
	"owner" varchar(255) NOT NULL,
	"resource_server_id" varchar(36) NOT NULL,
	"owner_managed_access" boolean DEFAULT false NOT NULL,
	"display_name" varchar(255),
	CONSTRAINT "uk_frsr6t700s9v50bu18ws5ha6" UNIQUE("name","owner","resource_server_id")
);
--> statement-breakpoint
CREATE TABLE "resource_server_scope" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"icon_uri" varchar(255),
	"resource_server_id" varchar(36) NOT NULL,
	"display_name" varchar(255),
	CONSTRAINT "uk_frsrst700s9v50bu18ws5ha6" UNIQUE("name","resource_server_id")
);
--> statement-breakpoint
CREATE TABLE "resource_attribute" (
	"id" varchar(36) PRIMARY KEY DEFAULT 'sybase-needs-something-here' NOT NULL,
	"name" varchar(255) NOT NULL,
	"value" varchar(255),
	"resource_id" varchar(36) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "required_action_provider" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"alias" varchar(255),
	"name" varchar(255),
	"realm_id" varchar(36),
	"enabled" boolean DEFAULT false NOT NULL,
	"default_action" boolean DEFAULT false NOT NULL,
	"provider_id" varchar(255),
	"priority" integer
);
--> statement-breakpoint
CREATE TABLE "role_attribute" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"role_id" varchar(36) NOT NULL,
	"name" varchar(255) NOT NULL,
	"value" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "fed_user_credential" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"salt" "bytea",
	"type" varchar(255),
	"created_date" bigint,
	"user_id" varchar(255) NOT NULL,
	"realm_id" varchar(36) NOT NULL,
	"storage_provider_id" varchar(36),
	"user_label" varchar(255),
	"secret_data" text,
	"credential_data" text,
	"priority" integer
);
--> statement-breakpoint
CREATE TABLE "migration_model" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"version" varchar(36),
	"update_time" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "uk_migration_version" UNIQUE("version"),
	CONSTRAINT "uk_migration_update_time" UNIQUE("update_time")
);
--> statement-breakpoint
CREATE TABLE "client" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	"full_scope_allowed" boolean DEFAULT false NOT NULL,
	"client_id" varchar(255),
	"not_before" integer,
	"public_client" boolean DEFAULT false NOT NULL,
	"secret" varchar(255),
	"base_url" varchar(255),
	"bearer_only" boolean DEFAULT false NOT NULL,
	"management_url" varchar(255),
	"surrogate_auth_required" boolean DEFAULT false NOT NULL,
	"realm_id" varchar(36),
	"protocol" varchar(255),
	"node_rereg_timeout" integer DEFAULT 0,
	"frontchannel_logout" boolean DEFAULT false NOT NULL,
	"consent_required" boolean DEFAULT false NOT NULL,
	"name" varchar(255),
	"service_accounts_enabled" boolean DEFAULT false NOT NULL,
	"client_authenticator_type" varchar(255),
	"root_url" varchar(255),
	"description" varchar(255),
	"registration_token" varchar(255),
	"standard_flow_enabled" boolean DEFAULT true NOT NULL,
	"implicit_flow_enabled" boolean DEFAULT false NOT NULL,
	"direct_access_grants_enabled" boolean DEFAULT false NOT NULL,
	"always_display_in_console" boolean DEFAULT false NOT NULL,
	CONSTRAINT "uk_b71cjlbenv945rb6gcon438at" UNIQUE("client_id","realm_id")
);
--> statement-breakpoint
CREATE TABLE "user_consent" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"client_id" varchar(255),
	"user_id" varchar(36) NOT NULL,
	"created_date" bigint,
	"last_updated_date" bigint,
	"client_storage_provider" varchar(36),
	"external_client_id" varchar(255),
	CONSTRAINT "uk_local_consent" UNIQUE("client_id","user_id"),
	CONSTRAINT "uk_external_consent" UNIQUE("user_id","client_storage_provider","external_client_id")
);
--> statement-breakpoint
CREATE TABLE "resource_server_perm_ticket" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"owner" varchar(255) NOT NULL,
	"requester" varchar(255) NOT NULL,
	"created_timestamp" bigint NOT NULL,
	"granted_timestamp" bigint,
	"resource_id" varchar(36) NOT NULL,
	"scope_id" varchar(36),
	"resource_server_id" varchar(36) NOT NULL,
	"policy_id" varchar(36),
	CONSTRAINT "uk_frsr6t700s9v50bu18ws5pmt" UNIQUE("owner","requester","resource_id","scope_id","resource_server_id")
);
--> statement-breakpoint
CREATE TABLE "realm" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"access_code_lifespan" integer,
	"user_action_lifespan" integer,
	"access_token_lifespan" integer,
	"account_theme" varchar(255),
	"admin_theme" varchar(255),
	"email_theme" varchar(255),
	"enabled" boolean DEFAULT false NOT NULL,
	"events_enabled" boolean DEFAULT false NOT NULL,
	"events_expiration" bigint,
	"login_theme" varchar(255),
	"name" varchar(255),
	"not_before" integer,
	"password_policy" varchar(2550),
	"registration_allowed" boolean DEFAULT false NOT NULL,
	"remember_me" boolean DEFAULT false NOT NULL,
	"reset_password_allowed" boolean DEFAULT false NOT NULL,
	"social" boolean DEFAULT false NOT NULL,
	"ssl_required" varchar(255),
	"sso_idle_timeout" integer,
	"sso_max_lifespan" integer,
	"update_profile_on_soc_login" boolean DEFAULT false NOT NULL,
	"verify_email" boolean DEFAULT false NOT NULL,
	"master_admin_client" varchar(36),
	"login_lifespan" integer,
	"internationalization_enabled" boolean DEFAULT false NOT NULL,
	"default_locale" varchar(255),
	"reg_email_as_username" boolean DEFAULT false NOT NULL,
	"admin_events_enabled" boolean DEFAULT false NOT NULL,
	"admin_events_details_enabled" boolean DEFAULT false NOT NULL,
	"edit_username_allowed" boolean DEFAULT false NOT NULL,
	"otp_policy_counter" integer DEFAULT 0,
	"otp_policy_window" integer DEFAULT 1,
	"otp_policy_period" integer DEFAULT 30,
	"otp_policy_digits" integer DEFAULT 6,
	"otp_policy_alg" varchar(36) DEFAULT 'HmacSHA1',
	"otp_policy_type" varchar(36) DEFAULT 'totp',
	"browser_flow" varchar(36),
	"registration_flow" varchar(36),
	"direct_grant_flow" varchar(36),
	"reset_credentials_flow" varchar(36),
	"client_auth_flow" varchar(36),
	"offline_session_idle_timeout" integer DEFAULT 0,
	"revoke_refresh_token" boolean DEFAULT false NOT NULL,
	"access_token_life_implicit" integer DEFAULT 0,
	"login_with_email_allowed" boolean DEFAULT true NOT NULL,
	"duplicate_emails_allowed" boolean DEFAULT false NOT NULL,
	"docker_auth_flow" varchar(36),
	"refresh_token_max_reuse" integer DEFAULT 0,
	"allow_user_managed_access" boolean DEFAULT false NOT NULL,
	"sso_max_lifespan_remember_me" integer DEFAULT 0 NOT NULL,
	"sso_idle_timeout_remember_me" integer DEFAULT 0 NOT NULL,
	"default_role" varchar(255),
	CONSTRAINT "uk_orvsdmla56612eaefiq6wl5oi" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "resource_server_policy" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(255),
	"type" varchar(255) NOT NULL,
	"decision_strategy" smallint,
	"logic" smallint,
	"resource_server_id" varchar(36) NOT NULL,
	"owner" varchar(255),
	CONSTRAINT "uk_frsrpt700s9v50bu18ws5ha6" UNIQUE("name","resource_server_id")
);
--> statement-breakpoint
CREATE TABLE "resource_server" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"allow_rs_remote_mgmt" boolean DEFAULT false NOT NULL,
	"policy_enforce_mode" smallint NOT NULL,
	"decision_strategy" smallint DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "component_config" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"component_id" varchar(36) NOT NULL,
	"name" varchar(255) NOT NULL,
	"value" text
);
--> statement-breakpoint
CREATE TABLE "event_entity" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"client_id" varchar(255),
	"details_json" varchar(2550),
	"error" varchar(255),
	"ip_address" varchar(255),
	"realm_id" varchar(255),
	"session_id" varchar(255),
	"event_time" bigint,
	"type" varchar(255),
	"user_id" varchar(255),
	"details_json_long_value" text
);
--> statement-breakpoint
CREATE TABLE "user_attribute" (
	"name" varchar(255) NOT NULL,
	"value" varchar(255),
	"user_id" varchar(36) NOT NULL,
	"id" varchar(36) PRIMARY KEY DEFAULT 'sybase-needs-something-here' NOT NULL,
	"long_value_hash" "bytea",
	"long_value_hash_lower_case" "bytea",
	"long_value" text
);
--> statement-breakpoint
CREATE TABLE "fed_user_attribute" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"realm_id" varchar(36) NOT NULL,
	"storage_provider_id" varchar(36),
	"value" varchar(2024),
	"long_value_hash" "bytea",
	"long_value_hash_lower_case" "bytea",
	"long_value" text
);
--> statement-breakpoint
CREATE TABLE "revoked_token" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"expire" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "identity_provider" (
	"internal_id" varchar(36) PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	"provider_alias" varchar(255),
	"provider_id" varchar(255),
	"store_token" boolean DEFAULT false NOT NULL,
	"authenticate_by_default" boolean DEFAULT false NOT NULL,
	"realm_id" varchar(36),
	"add_token_role" boolean DEFAULT true NOT NULL,
	"trust_email" boolean DEFAULT false NOT NULL,
	"first_broker_login_flow_id" varchar(36),
	"post_broker_login_flow_id" varchar(36),
	"provider_display_name" varchar(255),
	"link_only" boolean DEFAULT false NOT NULL,
	"organization_id" varchar(255),
	"hide_on_login" boolean DEFAULT false,
	CONSTRAINT "uk_2daelwnibji49avxsrtuf6xj33" UNIQUE("provider_alias","realm_id")
);
--> statement-breakpoint
CREATE TABLE "org" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"enabled" boolean NOT NULL,
	"realm_id" varchar(255) NOT NULL,
	"group_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(4000),
	"alias" varchar(255) NOT NULL,
	"redirect_url" varchar(2048),
	CONSTRAINT "uk_org_name" UNIQUE("realm_id","name"),
	CONSTRAINT "uk_org_alias" UNIQUE("realm_id","alias"),
	CONSTRAINT "uk_org_group" UNIQUE("group_id")
);
--> statement-breakpoint
CREATE TABLE "jgroups_ping" (
	"address" varchar(200) PRIMARY KEY NOT NULL,
	"name" varchar(200),
	"cluster_name" varchar(200) NOT NULL,
	"ip" varchar(200) NOT NULL,
	"coord" boolean
);
--> statement-breakpoint
CREATE TABLE "admin_event_entity" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"admin_event_time" bigint,
	"realm_id" varchar(255),
	"operation_type" varchar(255),
	"auth_realm_id" varchar(255),
	"auth_client_id" varchar(255),
	"auth_user_id" varchar(255),
	"ip_address" varchar(255),
	"resource_path" varchar(2550),
	"representation" text,
	"error" varchar(255),
	"resource_type" varchar(64),
	"details_json" text
);
--> statement-breakpoint
CREATE TABLE "server_config" (
	"server_config_key" varchar(255) PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"version" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "credential" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"salt" "bytea",
	"type" varchar(255),
	"user_id" varchar(36),
	"created_date" bigint,
	"user_label" varchar(255),
	"secret_data" text,
	"credential_data" text,
	"priority" integer,
	"version" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "keycloak_group" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"parent_group" varchar(36) NOT NULL,
	"realm_id" varchar(36),
	"type" integer DEFAULT 0 NOT NULL,
	"description" varchar(255),
	CONSTRAINT "sibling_names" UNIQUE("name","parent_group","realm_id")
);
--> statement-breakpoint
CREATE TABLE "redirect_uris" (
	"client_id" varchar(36) NOT NULL,
	"value" varchar(255) NOT NULL,
	CONSTRAINT "constraint_redirect_uris" PRIMARY KEY("client_id","value")
);
--> statement-breakpoint
CREATE TABLE "composite_role" (
	"composite" varchar(36) NOT NULL,
	"child_role" varchar(36) NOT NULL,
	CONSTRAINT "constraint_composite_role" PRIMARY KEY("composite","child_role")
);
--> statement-breakpoint
CREATE TABLE "user_role_mapping" (
	"role_id" varchar(255) NOT NULL,
	"user_id" varchar(36) NOT NULL,
	CONSTRAINT "constraint_c" PRIMARY KEY("role_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "realm_events_listeners" (
	"realm_id" varchar(36) NOT NULL,
	"value" varchar(255) NOT NULL,
	CONSTRAINT "constr_realm_events_listeners" PRIMARY KEY("realm_id","value")
);
--> statement-breakpoint
CREATE TABLE "web_origins" (
	"client_id" varchar(36) NOT NULL,
	"value" varchar(255) NOT NULL,
	CONSTRAINT "constraint_web_origins" PRIMARY KEY("client_id","value")
);
--> statement-breakpoint
CREATE TABLE "scope_mapping" (
	"client_id" varchar(36) NOT NULL,
	"role_id" varchar(36) NOT NULL,
	CONSTRAINT "constraint_81" PRIMARY KEY("client_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "realm_supported_locales" (
	"realm_id" varchar(36) NOT NULL,
	"value" varchar(255) NOT NULL,
	CONSTRAINT "constr_realm_supported_locales" PRIMARY KEY("realm_id","value")
);
--> statement-breakpoint
CREATE TABLE "realm_enabled_event_types" (
	"realm_id" varchar(36) NOT NULL,
	"value" varchar(255) NOT NULL,
	CONSTRAINT "constr_realm_enabl_event_types" PRIMARY KEY("realm_id","value")
);
--> statement-breakpoint
CREATE TABLE "user_required_action" (
	"user_id" varchar(36) NOT NULL,
	"required_action" varchar(255) DEFAULT ' ' NOT NULL,
	CONSTRAINT "constraint_required_action" PRIMARY KEY("user_id","required_action")
);
--> statement-breakpoint
CREATE TABLE "group_role_mapping" (
	"role_id" varchar(36) NOT NULL,
	"group_id" varchar(36) NOT NULL,
	CONSTRAINT "constraint_group_role" PRIMARY KEY("role_id","group_id")
);
--> statement-breakpoint
CREATE TABLE "realm_default_groups" (
	"realm_id" varchar(36) NOT NULL,
	"group_id" varchar(36) NOT NULL,
	CONSTRAINT "constr_realm_default_groups" PRIMARY KEY("realm_id","group_id"),
	CONSTRAINT "con_group_id_def_groups" UNIQUE("group_id")
);
--> statement-breakpoint
CREATE TABLE "resource_scope" (
	"resource_id" varchar(36) NOT NULL,
	"scope_id" varchar(36) NOT NULL,
	CONSTRAINT "constraint_farsrsp" PRIMARY KEY("resource_id","scope_id")
);
--> statement-breakpoint
CREATE TABLE "resource_policy" (
	"resource_id" varchar(36) NOT NULL,
	"policy_id" varchar(36) NOT NULL,
	CONSTRAINT "constraint_farsrpp" PRIMARY KEY("resource_id","policy_id")
);
--> statement-breakpoint
CREATE TABLE "scope_policy" (
	"scope_id" varchar(36) NOT NULL,
	"policy_id" varchar(36) NOT NULL,
	CONSTRAINT "constraint_farsrsps" PRIMARY KEY("scope_id","policy_id")
);
--> statement-breakpoint
CREATE TABLE "associated_policy" (
	"policy_id" varchar(36) NOT NULL,
	"associated_policy_id" varchar(36) NOT NULL,
	CONSTRAINT "constraint_farsrpap" PRIMARY KEY("policy_id","associated_policy_id")
);
--> statement-breakpoint
CREATE TABLE "client_scope_role_mapping" (
	"scope_id" varchar(36) NOT NULL,
	"role_id" varchar(36) NOT NULL,
	CONSTRAINT "pk_template_scope" PRIMARY KEY("scope_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "user_consent_client_scope" (
	"user_consent_id" varchar(36) NOT NULL,
	"scope_id" varchar(36) NOT NULL,
	CONSTRAINT "constraint_grntcsnt_clsc_pm" PRIMARY KEY("user_consent_id","scope_id")
);
--> statement-breakpoint
CREATE TABLE "fed_user_consent_cl_scope" (
	"user_consent_id" varchar(36) NOT NULL,
	"scope_id" varchar(36) NOT NULL,
	CONSTRAINT "constraint_fgrntcsnt_clsc_pm" PRIMARY KEY("user_consent_id","scope_id")
);
--> statement-breakpoint
CREATE TABLE "resource_uris" (
	"resource_id" varchar(36) NOT NULL,
	"value" varchar(255) NOT NULL,
	CONSTRAINT "constraint_resour_uris_pk" PRIMARY KEY("resource_id","value")
);
--> statement-breakpoint
CREATE TABLE "realm_smtp_config" (
	"realm_id" varchar(36) NOT NULL,
	"value" varchar(255),
	"name" varchar(255) NOT NULL,
	CONSTRAINT "constraint_e" PRIMARY KEY("realm_id","name")
);
--> statement-breakpoint
CREATE TABLE "user_federation_config" (
	"user_federation_provider_id" varchar(36) NOT NULL,
	"value" varchar(255),
	"name" varchar(255) NOT NULL,
	CONSTRAINT "constraint_f9" PRIMARY KEY("user_federation_provider_id","name")
);
--> statement-breakpoint
CREATE TABLE "identity_provider_config" (
	"identity_provider_id" varchar(36) NOT NULL,
	"value" text,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "constraint_d" PRIMARY KEY("identity_provider_id","name")
);
--> statement-breakpoint
CREATE TABLE "protocol_mapper_config" (
	"protocol_mapper_id" varchar(36) NOT NULL,
	"value" text,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "constraint_pmconfig" PRIMARY KEY("protocol_mapper_id","name")
);
--> statement-breakpoint
CREATE TABLE "idp_mapper_config" (
	"idp_mapper_id" varchar(36) NOT NULL,
	"value" text,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "constraint_idpmconfig" PRIMARY KEY("idp_mapper_id","name")
);
--> statement-breakpoint
CREATE TABLE "client_node_registrations" (
	"client_id" varchar(36) NOT NULL,
	"value" integer,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "constraint_84" PRIMARY KEY("client_id","name")
);
--> statement-breakpoint
CREATE TABLE "user_federation_mapper_config" (
	"user_federation_mapper_id" varchar(36) NOT NULL,
	"value" varchar(255),
	"name" varchar(255) NOT NULL,
	CONSTRAINT "constraint_fedmapper_cfg_pm" PRIMARY KEY("user_federation_mapper_id","name")
);
--> statement-breakpoint
CREATE TABLE "authenticator_config_entry" (
	"authenticator_id" varchar(36) NOT NULL,
	"value" text,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "constraint_auth_cfg_pk" PRIMARY KEY("authenticator_id","name")
);
--> statement-breakpoint
CREATE TABLE "required_action_config" (
	"required_action_id" varchar(36) NOT NULL,
	"value" text,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "constraint_req_act_cfg_pk" PRIMARY KEY("required_action_id","name")
);
--> statement-breakpoint
CREATE TABLE "policy_config" (
	"policy_id" varchar(36) NOT NULL,
	"name" varchar(255) NOT NULL,
	"value" text,
	CONSTRAINT "constraint_dpc" PRIMARY KEY("policy_id","name")
);
--> statement-breakpoint
CREATE TABLE "client_auth_flow_bindings" (
	"client_id" varchar(36) NOT NULL,
	"flow_id" varchar(36),
	"binding_name" varchar(255) NOT NULL,
	CONSTRAINT "c_cli_flow_bind" PRIMARY KEY("client_id","binding_name")
);
--> statement-breakpoint
CREATE TABLE "client_scope_attributes" (
	"scope_id" varchar(36) NOT NULL,
	"value" varchar(2048),
	"name" varchar(255) NOT NULL,
	CONSTRAINT "pk_cl_tmpl_attr" PRIMARY KEY("scope_id","name")
);
--> statement-breakpoint
CREATE TABLE "default_client_scope" (
	"realm_id" varchar(36) NOT NULL,
	"scope_id" varchar(36) NOT NULL,
	"default_scope" boolean DEFAULT false NOT NULL,
	CONSTRAINT "r_def_cli_scope_bind" PRIMARY KEY("realm_id","scope_id")
);
--> statement-breakpoint
CREATE TABLE "client_scope_client" (
	"client_id" varchar(255) NOT NULL,
	"scope_id" varchar(255) NOT NULL,
	"default_scope" boolean DEFAULT false NOT NULL,
	CONSTRAINT "c_cli_scope_bind" PRIMARY KEY("client_id","scope_id")
);
--> statement-breakpoint
CREATE TABLE "realm_attribute" (
	"name" varchar(255) NOT NULL,
	"realm_id" varchar(36) NOT NULL,
	"value" text,
	CONSTRAINT "constraint_9" PRIMARY KEY("name","realm_id")
);
--> statement-breakpoint
CREATE TABLE "realm_localizations" (
	"realm_id" varchar(255) NOT NULL,
	"locale" varchar(255) NOT NULL,
	"texts" text NOT NULL,
	CONSTRAINT "realm_localizations_pkey" PRIMARY KEY("realm_id","locale")
);
--> statement-breakpoint
CREATE TABLE "client_attributes" (
	"client_id" varchar(36) NOT NULL,
	"name" varchar(255) NOT NULL,
	"value" text,
	CONSTRAINT "constraint_3c" PRIMARY KEY("client_id","name")
);
--> statement-breakpoint
CREATE TABLE "user_group_membership" (
	"group_id" varchar(36) NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"membership_type" varchar(255) NOT NULL,
	CONSTRAINT "constraint_user_group" PRIMARY KEY("group_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "fed_user_group_membership" (
	"group_id" varchar(36) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"realm_id" varchar(36) NOT NULL,
	"storage_provider_id" varchar(36),
	CONSTRAINT "constr_fed_user_group" PRIMARY KEY("group_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "fed_user_required_action" (
	"required_action" varchar(255) DEFAULT ' ' NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"realm_id" varchar(36) NOT NULL,
	"storage_provider_id" varchar(36),
	CONSTRAINT "constr_fed_required_action" PRIMARY KEY("required_action","user_id")
);
--> statement-breakpoint
CREATE TABLE "fed_user_role_mapping" (
	"role_id" varchar(36) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"realm_id" varchar(36) NOT NULL,
	"storage_provider_id" varchar(36),
	CONSTRAINT "constr_fed_user_role" PRIMARY KEY("role_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "org_domain" (
	"id" varchar(36) NOT NULL,
	"name" varchar(255) NOT NULL,
	"verified" boolean NOT NULL,
	"org_id" varchar(255) NOT NULL,
	CONSTRAINT "ORG_DOMAIN_pkey" PRIMARY KEY("id","name")
);
--> statement-breakpoint
CREATE TABLE "realm_required_credential" (
	"type" varchar(255) NOT NULL,
	"form_label" varchar(255),
	"input" boolean DEFAULT false NOT NULL,
	"secret" boolean DEFAULT false NOT NULL,
	"realm_id" varchar(36) NOT NULL,
	CONSTRAINT "constraint_92" PRIMARY KEY("type","realm_id")
);
--> statement-breakpoint
CREATE TABLE "federated_identity" (
	"identity_provider" varchar(255) NOT NULL,
	"realm_id" varchar(36),
	"federated_user_id" varchar(255),
	"federated_username" varchar(255),
	"token" text,
	"user_id" varchar(36) NOT NULL,
	CONSTRAINT "constraint_40" PRIMARY KEY("identity_provider","user_id")
);
--> statement-breakpoint
CREATE TABLE "broker_link" (
	"identity_provider" varchar(255) NOT NULL,
	"storage_provider_id" varchar(255),
	"realm_id" varchar(36) NOT NULL,
	"broker_user_id" varchar(255),
	"broker_username" varchar(255),
	"token" text,
	"user_id" varchar(255) NOT NULL,
	CONSTRAINT "constr_broker_link_pk" PRIMARY KEY("identity_provider","user_id")
);
--> statement-breakpoint
CREATE TABLE "offline_client_session" (
	"user_session_id" varchar(36) NOT NULL,
	"client_id" varchar(255) NOT NULL,
	"offline_flag" varchar(4) NOT NULL,
	"timestamp" integer,
	"data" text,
	"client_storage_provider" varchar(36) DEFAULT 'local' NOT NULL,
	"external_client_id" varchar(255) DEFAULT 'local' NOT NULL,
	"version" integer DEFAULT 0,
	CONSTRAINT "constraint_offl_cl_ses_pk3" PRIMARY KEY("user_session_id","client_id","offline_flag","client_storage_provider","external_client_id")
);
--> statement-breakpoint
CREATE TABLE "offline_user_session" (
	"user_session_id" varchar(36) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"realm_id" varchar(36) NOT NULL,
	"created_on" integer NOT NULL,
	"offline_flag" varchar(4) NOT NULL,
	"data" text,
	"last_session_refresh" integer DEFAULT 0 NOT NULL,
	"broker_session_id" varchar(1024),
	"version" integer DEFAULT 0,
	CONSTRAINT "constraint_offl_us_ses_pk2" PRIMARY KEY("user_session_id","offline_flag")
);
--> statement-breakpoint
ALTER TABLE "user_federation_provider" ADD CONSTRAINT "fk_1fj32f6ptolw2qy60cd8n01e8" FOREIGN KEY ("realm_id") REFERENCES "public"."realm"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "identity_provider_mapper" ADD CONSTRAINT "fk_idpm_realm" FOREIGN KEY ("realm_id") REFERENCES "public"."realm"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_federation_mapper" ADD CONSTRAINT "fk_fedmapperpm_realm" FOREIGN KEY ("realm_id") REFERENCES "public"."realm"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_federation_mapper" ADD CONSTRAINT "fk_fedmapperpm_fedprv" FOREIGN KEY ("federation_provider_id") REFERENCES "public"."user_federation_provider"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authentication_flow" ADD CONSTRAINT "fk_auth_flow_realm" FOREIGN KEY ("realm_id") REFERENCES "public"."realm"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authentication_execution" ADD CONSTRAINT "fk_auth_exec_realm" FOREIGN KEY ("realm_id") REFERENCES "public"."realm"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authentication_execution" ADD CONSTRAINT "fk_auth_exec_flow" FOREIGN KEY ("flow_id") REFERENCES "public"."authentication_flow"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authenticator_config" ADD CONSTRAINT "fk_auth_realm" FOREIGN KEY ("realm_id") REFERENCES "public"."realm"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "keycloak_role" ADD CONSTRAINT "fk_6vyqfe4cn4wlq8r6kt5vdsj5c" FOREIGN KEY ("realm") REFERENCES "public"."realm"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_attribute" ADD CONSTRAINT "fk_group_attribute_group" FOREIGN KEY ("group_id") REFERENCES "public"."keycloak_group"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "protocol_mapper" ADD CONSTRAINT "fk_pcm_realm" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "protocol_mapper" ADD CONSTRAINT "fk_cli_scope_mapper" FOREIGN KEY ("client_scope_id") REFERENCES "public"."client_scope"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "component" ADD CONSTRAINT "fk_component_realm" FOREIGN KEY ("realm_id") REFERENCES "public"."realm"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_initial_access" ADD CONSTRAINT "fk_client_init_acc_realm" FOREIGN KEY ("realm_id") REFERENCES "public"."realm"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource_server_resource" ADD CONSTRAINT "fk_frsrho213xcx4wnkog82ssrfy" FOREIGN KEY ("resource_server_id") REFERENCES "public"."resource_server"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource_server_scope" ADD CONSTRAINT "fk_frsrso213xcx4wnkog82ssrfy" FOREIGN KEY ("resource_server_id") REFERENCES "public"."resource_server"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource_attribute" ADD CONSTRAINT "fk_5hrm2vlf9ql5fu022kqepovbr" FOREIGN KEY ("resource_id") REFERENCES "public"."resource_server_resource"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "required_action_provider" ADD CONSTRAINT "fk_req_act_realm" FOREIGN KEY ("realm_id") REFERENCES "public"."realm"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_attribute" ADD CONSTRAINT "fk_role_attribute_id" FOREIGN KEY ("role_id") REFERENCES "public"."keycloak_role"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_consent" ADD CONSTRAINT "fk_grntcsnt_user" FOREIGN KEY ("user_id") REFERENCES "public"."user_entity"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource_server_perm_ticket" ADD CONSTRAINT "fk_frsrho213xcx4wnkog82sspmt" FOREIGN KEY ("resource_server_id") REFERENCES "public"."resource_server"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource_server_perm_ticket" ADD CONSTRAINT "fk_frsrho213xcx4wnkog83sspmt" FOREIGN KEY ("resource_id") REFERENCES "public"."resource_server_resource"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource_server_perm_ticket" ADD CONSTRAINT "fk_frsrho213xcx4wnkog84sspmt" FOREIGN KEY ("scope_id") REFERENCES "public"."resource_server_scope"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource_server_perm_ticket" ADD CONSTRAINT "fk_frsrpo2128cx4wnkog82ssrfy" FOREIGN KEY ("policy_id") REFERENCES "public"."resource_server_policy"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource_server_policy" ADD CONSTRAINT "fk_frsrpo213xcx4wnkog82ssrfy" FOREIGN KEY ("resource_server_id") REFERENCES "public"."resource_server"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "component_config" ADD CONSTRAINT "fk_component_config" FOREIGN KEY ("component_id") REFERENCES "public"."component"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_attribute" ADD CONSTRAINT "fk_5hrm2vlf9ql5fu043kqepovbr" FOREIGN KEY ("user_id") REFERENCES "public"."user_entity"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "identity_provider" ADD CONSTRAINT "fk2b4ebc52ae5c3b34" FOREIGN KEY ("realm_id") REFERENCES "public"."realm"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credential" ADD CONSTRAINT "fk_pfyr0glasqyl0dei3kl69r6v0" FOREIGN KEY ("user_id") REFERENCES "public"."user_entity"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "redirect_uris" ADD CONSTRAINT "fk_1burs8pb4ouj97h5wuppahv9f" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "composite_role" ADD CONSTRAINT "fk_a63wvekftu8jo1pnj81e7mce2" FOREIGN KEY ("composite") REFERENCES "public"."keycloak_role"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "composite_role" ADD CONSTRAINT "fk_gr7thllb9lu8q4vqa4524jjy8" FOREIGN KEY ("child_role") REFERENCES "public"."keycloak_role"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_role_mapping" ADD CONSTRAINT "fk_c4fqv34p1mbylloxang7b1q3l" FOREIGN KEY ("user_id") REFERENCES "public"."user_entity"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "realm_events_listeners" ADD CONSTRAINT "fk_h846o4h0w8epx5nxev9f5y69j" FOREIGN KEY ("realm_id") REFERENCES "public"."realm"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "web_origins" ADD CONSTRAINT "fk_lojpho213xcx4wnkog82ssrfy" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scope_mapping" ADD CONSTRAINT "fk_ouse064plmlr732lxjcn1q5f1" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "realm_supported_locales" ADD CONSTRAINT "fk_supported_locales_realm" FOREIGN KEY ("realm_id") REFERENCES "public"."realm"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "realm_enabled_event_types" ADD CONSTRAINT "fk_h846o4h0w8epx5nwedrf5y69j" FOREIGN KEY ("realm_id") REFERENCES "public"."realm"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_required_action" ADD CONSTRAINT "fk_6qj3w1jw9cvafhe19bwsiuvmd" FOREIGN KEY ("user_id") REFERENCES "public"."user_entity"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_role_mapping" ADD CONSTRAINT "fk_group_role_group" FOREIGN KEY ("group_id") REFERENCES "public"."keycloak_group"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "realm_default_groups" ADD CONSTRAINT "fk_def_groups_realm" FOREIGN KEY ("realm_id") REFERENCES "public"."realm"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource_scope" ADD CONSTRAINT "fk_frsrpos13xcx4wnkog82ssrfy" FOREIGN KEY ("resource_id") REFERENCES "public"."resource_server_resource"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource_scope" ADD CONSTRAINT "fk_frsrps213xcx4wnkog82ssrfy" FOREIGN KEY ("scope_id") REFERENCES "public"."resource_server_scope"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource_policy" ADD CONSTRAINT "fk_frsrpos53xcx4wnkog82ssrfy" FOREIGN KEY ("resource_id") REFERENCES "public"."resource_server_resource"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource_policy" ADD CONSTRAINT "fk_frsrpp213xcx4wnkog82ssrfy" FOREIGN KEY ("policy_id") REFERENCES "public"."resource_server_policy"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scope_policy" ADD CONSTRAINT "fk_frsrpass3xcx4wnkog82ssrfy" FOREIGN KEY ("scope_id") REFERENCES "public"."resource_server_scope"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scope_policy" ADD CONSTRAINT "fk_frsrasp13xcx4wnkog82ssrfy" FOREIGN KEY ("policy_id") REFERENCES "public"."resource_server_policy"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "associated_policy" ADD CONSTRAINT "fk_frsrpas14xcx4wnkog82ssrfy" FOREIGN KEY ("policy_id") REFERENCES "public"."resource_server_policy"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "associated_policy" ADD CONSTRAINT "fk_frsr5s213xcx4wnkog82ssrfy" FOREIGN KEY ("associated_policy_id") REFERENCES "public"."resource_server_policy"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_scope_role_mapping" ADD CONSTRAINT "fk_cl_scope_rm_scope" FOREIGN KEY ("scope_id") REFERENCES "public"."client_scope"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_consent_client_scope" ADD CONSTRAINT "fk_grntcsnt_clsc_usc" FOREIGN KEY ("user_consent_id") REFERENCES "public"."user_consent"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource_uris" ADD CONSTRAINT "fk_resource_server_uris" FOREIGN KEY ("resource_id") REFERENCES "public"."resource_server_resource"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "realm_smtp_config" ADD CONSTRAINT "fk_70ej8xdxgxd0b9hh6180irr0o" FOREIGN KEY ("realm_id") REFERENCES "public"."realm"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_federation_config" ADD CONSTRAINT "fk_t13hpu1j94r2ebpekr39x5eu5" FOREIGN KEY ("user_federation_provider_id") REFERENCES "public"."user_federation_provider"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "identity_provider_config" ADD CONSTRAINT "fkdc4897cf864c4e43" FOREIGN KEY ("identity_provider_id") REFERENCES "public"."identity_provider"("internal_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "protocol_mapper_config" ADD CONSTRAINT "fk_pmconfig" FOREIGN KEY ("protocol_mapper_id") REFERENCES "public"."protocol_mapper"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "idp_mapper_config" ADD CONSTRAINT "fk_idpmconfig" FOREIGN KEY ("idp_mapper_id") REFERENCES "public"."identity_provider_mapper"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_node_registrations" ADD CONSTRAINT "fk4129723ba992f594" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_federation_mapper_config" ADD CONSTRAINT "fk_fedmapper_cfg" FOREIGN KEY ("user_federation_mapper_id") REFERENCES "public"."user_federation_mapper"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "policy_config" ADD CONSTRAINT "fkdc34197cf864c4e43" FOREIGN KEY ("policy_id") REFERENCES "public"."resource_server_policy"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_scope_attributes" ADD CONSTRAINT "fk_cl_scope_attr_scope" FOREIGN KEY ("scope_id") REFERENCES "public"."client_scope"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "default_client_scope" ADD CONSTRAINT "fk_r_def_cli_scope_realm" FOREIGN KEY ("realm_id") REFERENCES "public"."realm"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "realm_attribute" ADD CONSTRAINT "fk_8shxd6l3e9atqukacxgpffptw" FOREIGN KEY ("realm_id") REFERENCES "public"."realm"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_attributes" ADD CONSTRAINT "fk3c47c64beacca966" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_group_membership" ADD CONSTRAINT "fk_user_group_user" FOREIGN KEY ("user_id") REFERENCES "public"."user_entity"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "realm_required_credential" ADD CONSTRAINT "fk_5hg65lybevavkqfki3kponh9v" FOREIGN KEY ("realm_id") REFERENCES "public"."realm"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "federated_identity" ADD CONSTRAINT "fk404288b92ef007a6" FOREIGN KEY ("user_id") REFERENCES "public"."user_entity"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_usr_fed_prv_realm" ON "user_federation_provider" USING btree ("realm_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_id_prov_mapp_realm" ON "identity_provider_mapper" USING btree ("realm_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_usr_fed_map_fed_prv" ON "user_federation_mapper" USING btree ("federation_provider_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_usr_fed_map_realm" ON "user_federation_mapper" USING btree ("realm_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_auth_flow_realm" ON "authentication_flow" USING btree ("realm_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_auth_exec_flow" ON "authentication_execution" USING btree ("flow_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_auth_exec_realm_flow" ON "authentication_execution" USING btree ("realm_id" text_ops,"flow_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_auth_config_realm" ON "authenticator_config" USING btree ("realm_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_keycloak_role_client" ON "keycloak_role" USING btree ("client" text_ops);--> statement-breakpoint
CREATE INDEX "idx_keycloak_role_realm" ON "keycloak_role" USING btree ("realm" text_ops);--> statement-breakpoint
CREATE INDEX "idx_group_att_by_name_value" ON "group_attribute" USING btree (name text_ops,((value)::character varying(250)) text_ops);--> statement-breakpoint
CREATE INDEX "idx_group_attr_group" ON "group_attribute" USING btree ("group_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_clscope_protmap" ON "protocol_mapper" USING btree ("client_scope_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_protocol_mapper_client" ON "protocol_mapper" USING btree ("client_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_component_provider_type" ON "component" USING btree ("provider_type" text_ops);--> statement-breakpoint
CREATE INDEX "idx_component_realm" ON "component" USING btree ("realm_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_client_init_acc_realm" ON "client_initial_access" USING btree ("realm_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_user_email" ON "user_entity" USING btree ("email" text_ops);--> statement-breakpoint
CREATE INDEX "idx_user_service_account" ON "user_entity" USING btree ("realm_id" text_ops,"service_account_client_link" text_ops);--> statement-breakpoint
CREATE INDEX "idx_fu_cnsnt_ext" ON "fed_user_consent" USING btree ("user_id" text_ops,"client_storage_provider" text_ops,"external_client_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_fu_consent" ON "fed_user_consent" USING btree ("user_id" text_ops,"client_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_fu_consent_ru" ON "fed_user_consent" USING btree ("realm_id" text_ops,"user_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_realm_clscope" ON "client_scope" USING btree ("realm_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_res_srv_res_res_srv" ON "resource_server_resource" USING btree ("resource_server_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_res_srv_scope_res_srv" ON "resource_server_scope" USING btree ("resource_server_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_req_act_prov_realm" ON "required_action_provider" USING btree ("realm_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_role_attribute" ON "role_attribute" USING btree ("role_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_fu_credential" ON "fed_user_credential" USING btree ("user_id" text_ops,"type" text_ops);--> statement-breakpoint
CREATE INDEX "idx_fu_credential_ru" ON "fed_user_credential" USING btree ("realm_id" text_ops,"user_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_update_time" ON "migration_model" USING btree ("update_time" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_client_id" ON "client" USING btree ("client_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_user_consent" ON "user_consent" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_perm_ticket_owner" ON "resource_server_perm_ticket" USING btree ("owner" text_ops);--> statement-breakpoint
CREATE INDEX "idx_perm_ticket_requester" ON "resource_server_perm_ticket" USING btree ("requester" text_ops);--> statement-breakpoint
CREATE INDEX "idx_realm_master_adm_cli" ON "realm" USING btree ("master_admin_client" text_ops);--> statement-breakpoint
CREATE INDEX "idx_res_serv_pol_res_serv" ON "resource_server_policy" USING btree ("resource_server_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_compo_config_compo" ON "component_config" USING btree ("component_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_event_time" ON "event_entity" USING btree ("realm_id" int8_ops,"event_time" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_user_attribute" ON "user_attribute" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_user_attribute_name" ON "user_attribute" USING btree ("name" text_ops,"value" text_ops);--> statement-breakpoint
CREATE INDEX "user_attr_long_values" ON "user_attribute" USING btree ("long_value_hash" bytea_ops,"name" bytea_ops);--> statement-breakpoint
CREATE INDEX "user_attr_long_values_lower_case" ON "user_attribute" USING btree ("long_value_hash_lower_case" bytea_ops,"name" text_ops);--> statement-breakpoint
CREATE INDEX "fed_user_attr_long_values" ON "fed_user_attribute" USING btree ("long_value_hash" text_ops,"name" text_ops);--> statement-breakpoint
CREATE INDEX "fed_user_attr_long_values_lower_case" ON "fed_user_attribute" USING btree ("long_value_hash_lower_case" bytea_ops,"name" bytea_ops);--> statement-breakpoint
CREATE INDEX "idx_fu_attribute" ON "fed_user_attribute" USING btree ("user_id" text_ops,"realm_id" text_ops,"name" text_ops);--> statement-breakpoint
CREATE INDEX "idx_rev_token_on_expire" ON "revoked_token" USING btree ("expire" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_ident_prov_realm" ON "identity_provider" USING btree ("realm_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_idp_for_login" ON "identity_provider" USING btree ("realm_id" text_ops,"enabled" bool_ops,"link_only" text_ops,"hide_on_login" bool_ops,"organization_id" bool_ops);--> statement-breakpoint
CREATE INDEX "idx_idp_realm_org" ON "identity_provider" USING btree ("realm_id" text_ops,"organization_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_admin_event_time" ON "admin_event_entity" USING btree ("realm_id" int8_ops,"admin_event_time" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_user_credential" ON "credential" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_redir_uri_client" ON "redirect_uris" USING btree ("client_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_composite" ON "composite_role" USING btree ("composite" text_ops);--> statement-breakpoint
CREATE INDEX "idx_composite_child" ON "composite_role" USING btree ("child_role" text_ops);--> statement-breakpoint
CREATE INDEX "idx_user_role_mapping" ON "user_role_mapping" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_realm_evt_list_realm" ON "realm_events_listeners" USING btree ("realm_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_web_orig_client" ON "web_origins" USING btree ("client_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_scope_mapping_role" ON "scope_mapping" USING btree ("role_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_realm_supp_local_realm" ON "realm_supported_locales" USING btree ("realm_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_realm_evt_types_realm" ON "realm_enabled_event_types" USING btree ("realm_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_user_reqactions" ON "user_required_action" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_group_role_mapp_group" ON "group_role_mapping" USING btree ("group_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_realm_def_grp_realm" ON "realm_default_groups" USING btree ("realm_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_res_scope_scope" ON "resource_scope" USING btree ("scope_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_res_policy_policy" ON "resource_policy" USING btree ("policy_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_scope_policy_policy" ON "scope_policy" USING btree ("policy_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_assoc_pol_assoc_pol_id" ON "associated_policy" USING btree ("associated_policy_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_clscope_role" ON "client_scope_role_mapping" USING btree ("scope_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_role_clscope" ON "client_scope_role_mapping" USING btree ("role_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_usconsent_clscope" ON "user_consent_client_scope" USING btree ("user_consent_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_usconsent_scope_id" ON "user_consent_client_scope" USING btree ("scope_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_clscope_attrs" ON "client_scope_attributes" USING btree ("scope_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_defcls_realm" ON "default_client_scope" USING btree ("realm_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_defcls_scope" ON "default_client_scope" USING btree ("scope_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_cl_clscope" ON "client_scope_client" USING btree ("scope_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_clscope_cl" ON "client_scope_client" USING btree ("client_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_realm_attr_realm" ON "realm_attribute" USING btree ("realm_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_client_att_by_name_value" ON "client_attributes" USING btree (name text_ops,substr(value, 1, 255) text_ops);--> statement-breakpoint
CREATE INDEX "idx_user_group_mapping" ON "user_group_membership" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_fu_group_membership" ON "fed_user_group_membership" USING btree ("user_id" text_ops,"group_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_fu_group_membership_ru" ON "fed_user_group_membership" USING btree ("realm_id" text_ops,"user_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_fu_required_action" ON "fed_user_required_action" USING btree ("user_id" text_ops,"required_action" text_ops);--> statement-breakpoint
CREATE INDEX "idx_fu_required_action_ru" ON "fed_user_required_action" USING btree ("realm_id" text_ops,"user_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_fu_role_mapping" ON "fed_user_role_mapping" USING btree ("user_id" text_ops,"role_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_fu_role_mapping_ru" ON "fed_user_role_mapping" USING btree ("realm_id" text_ops,"user_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_org_domain_org_id" ON "org_domain" USING btree ("org_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_fedidentity_feduser" ON "federated_identity" USING btree ("federated_user_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_fedidentity_user" ON "federated_identity" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_offline_uss_by_broker_session_id" ON "offline_user_session" USING btree ("broker_session_id" text_ops,"realm_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_offline_uss_by_last_session_refresh" ON "offline_user_session" USING btree ("realm_id" int4_ops,"offline_flag" int4_ops,"last_session_refresh" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_offline_uss_by_user" ON "offline_user_session" USING btree ("user_id" text_ops,"realm_id" text_ops,"offline_flag" text_ops);
*/