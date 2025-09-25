import {
  pgTable,
  unique,
  check,
  uuid,
  varchar,
  text,
  timestamp,
  index,
  foreignKey,
  integer,
  jsonb,
  boolean,
  numeric,
  bigint,
  inet,
  date,
  time,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const userProfiles = pgTable(
  'user_profiles',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    email: varchar({ length: 255 }).notNull(),
    fullName: varchar('full_name', { length: 255 }),
    avatarUrl: text('avatar_url'),
    role: varchar({ length: 20 }).default('traveler'),
    subscriptionTier: varchar('subscription_tier', { length: 20 }).default(
      'free',
    ),
    bio: text(),
    websiteUrl: text('website_url'),
    location: varchar({ length: 255 }),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    unique('user_profiles_email_key').on(table.email),
    check(
      'user_profiles_role_check',
      sql`(role)::text = ANY ((ARRAY['traveler'::character varying, 'author'::character varying, 'agency'::character varying, 'admin'::character varying])::text[])`,
    ),
    check(
      'user_profiles_subscription_tier_check',
      sql`(subscription_tier)::text = ANY ((ARRAY['free'::character varying, 'pro'::character varying, 'enterprise'::character varying])::text[])`,
    ),
  ],
);

export const itineraries = pgTable(
  'itineraries',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    userId: uuid('user_id'),
    title: varchar({ length: 255 }).notNull(),
    description: text(),
    destination: varchar({ length: 255 }),
    durationDays: integer('duration_days'),
    canvasData: jsonb('canvas_data').default({}),
    thumbnailUrl: text('thumbnail_url'),
    isPublic: boolean('is_public').default(false),
    isTemplate: boolean('is_template').default(false),
    price: numeric({ precision: 10, scale: 2 }).default('0'),
    currency: varchar({ length: 3 }).default('USD'),
    tags: text().array(),
    viewCount: integer('view_count').default(0),
    likeCount: integer('like_count').default(0),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    coverImageUrl: text('cover_image_url'),
    totalEstimatedCost: numeric('total_estimated_cost', {
      precision: 10,
      scale: 2,
    }),
    difficultyLevel: varchar('difficulty_level', { length: 20 }),
    groupSizeMin: integer('group_size_min').default(1),
    groupSizeMax: integer('group_size_max'),
    ageRestriction: varchar('age_restriction', { length: 50 }),
    seasonBest: text('season_best').array(),
    includes: text().array(),
    excludes: text().array(),
    totalDays: integer('total_days'),
    createdBy: varchar('created_by', { length: 100 }),
    isFeatured: boolean('is_featured'),
    category: varchar({ length: 100 }),
    travelers: integer('travelers'),
    travelType: varchar('travel_type', { length: 255 }),
  },
  (table) => [
    index('idx_itineraries_is_public').using(
      'btree',
      table.isPublic.asc().nullsLast().op('bool_ops'),
    ),
    index('idx_itineraries_is_template').using(
      'btree',
      table.isTemplate.asc().nullsLast().op('bool_ops'),
    ),
    index('idx_itineraries_user_id').using(
      'btree',
      table.userId.asc().nullsLast().op('uuid_ops'),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userProfiles.id],
      name: 'itineraries_user_id_fkey',
    }).onDelete('cascade'),
    check(
      'itineraries_difficulty_level_check',
      sql`(difficulty_level)::text = ANY ((ARRAY['easy'::character varying, 'moderate'::character varying, 'hard'::character varying])::text[])`,
    ),
  ],
);

export const designTemplates = pgTable(
  'design_templates',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    userId: uuid('user_id'),
    name: varchar({ length: 255 }).notNull(),
    description: text(),
    category: varchar({ length: 100 }),
    canvasData: jsonb('canvas_data').default({}).notNull(),
    thumbnailUrl: text('thumbnail_url'),
    isPublic: boolean('is_public').default(false),
    price: numeric({ precision: 10, scale: 2 }).default('0'),
    currency: varchar({ length: 3 }).default('USD'),
    tags: text().array(),
    downloadCount: integer('download_count').default(0),
    rating: numeric({ precision: 3, scale: 2 }).default('0'),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    index('idx_design_templates_category').using(
      'btree',
      table.category.asc().nullsLast().op('text_ops'),
    ),
    index('idx_design_templates_user_id').using(
      'btree',
      table.userId.asc().nullsLast().op('uuid_ops'),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userProfiles.id],
      name: 'design_templates_user_id_fkey',
    }).onDelete('cascade'),
  ],
);

export const userFavorites = pgTable(
  'user_favorites',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    userId: uuid('user_id'),
    itineraryId: uuid('itinerary_id'),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    index('idx_user_favorites_user_id').using(
      'btree',
      table.userId.asc().nullsLast().op('uuid_ops'),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userProfiles.id],
      name: 'user_favorites_user_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.itineraryId],
      foreignColumns: [itineraries.id],
      name: 'user_favorites_itinerary_id_fkey',
    }).onDelete('cascade'),
    unique('user_favorites_user_id_itinerary_id_key').on(
      table.userId,
      table.itineraryId,
    ),
  ],
);

export const collaborations = pgTable(
  'collaborations',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    itineraryId: uuid('itinerary_id'),
    userId: uuid('user_id'),
    permissionLevel: varchar('permission_level', { length: 20 }).default(
      'view',
    ),
    invitedBy: uuid('invited_by'),
    status: varchar({ length: 20 }).default('pending'),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    index('idx_collaborations_itinerary_id').using(
      'btree',
      table.itineraryId.asc().nullsLast().op('uuid_ops'),
    ),
    index('idx_collaborations_user_id').using(
      'btree',
      table.userId.asc().nullsLast().op('uuid_ops'),
    ),
    foreignKey({
      columns: [table.itineraryId],
      foreignColumns: [itineraries.id],
      name: 'collaborations_itinerary_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userProfiles.id],
      name: 'collaborations_user_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.invitedBy],
      foreignColumns: [userProfiles.id],
      name: 'collaborations_invited_by_fkey',
    }),
    unique('collaborations_itinerary_id_user_id_key').on(
      table.itineraryId,
      table.userId,
    ),
    check(
      'collaborations_permission_level_check',
      sql`(permission_level)::text = ANY ((ARRAY['view'::character varying, 'edit'::character varying, 'admin'::character varying])::text[])`,
    ),
    check(
      'collaborations_status_check',
      sql`(status)::text = ANY ((ARRAY['pending'::character varying, 'accepted'::character varying, 'declined'::character varying])::text[])`,
    ),
  ],
);

export const assetLibrary = pgTable(
  'asset_library',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    userId: uuid('user_id'),
    filename: varchar({ length: 255 }).notNull(),
    originalName: varchar('original_name', { length: 255 }).notNull(),
    fileType: varchar('file_type', { length: 50 }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    fileSize: bigint('file_size', { mode: 'number' }).notNull(),
    fileUrl: text('file_url').notNull(),
    thumbnailUrl: text('thumbnail_url'),
    altText: text('alt_text'),
    tags: text().array(),
    isPublic: boolean('is_public').default(false),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    index('idx_asset_library_file_type').using(
      'btree',
      table.fileType.asc().nullsLast().op('text_ops'),
    ),
    index('idx_asset_library_is_public').using(
      'btree',
      table.isPublic.asc().nullsLast().op('bool_ops'),
    ),
    index('idx_asset_library_user_id').using(
      'btree',
      table.userId.asc().nullsLast().op('uuid_ops'),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userProfiles.id],
      name: 'asset_library_user_id_fkey',
    }).onDelete('cascade'),
  ],
);

export const templateReviews = pgTable(
  'template_reviews',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    templateId: uuid('template_id'),
    userId: uuid('user_id'),
    rating: integer(),
    reviewText: text('review_text'),
    isVerifiedPurchase: boolean('is_verified_purchase').default(false),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    index('idx_template_reviews_rating').using(
      'btree',
      table.rating.asc().nullsLast().op('int4_ops'),
    ),
    index('idx_template_reviews_template_id').using(
      'btree',
      table.templateId.asc().nullsLast().op('uuid_ops'),
    ),
    index('idx_template_reviews_user_id').using(
      'btree',
      table.userId.asc().nullsLast().op('uuid_ops'),
    ),
    foreignKey({
      columns: [table.templateId],
      foreignColumns: [designTemplates.id],
      name: 'template_reviews_template_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userProfiles.id],
      name: 'template_reviews_user_id_fkey',
    }).onDelete('cascade'),
    unique('template_reviews_template_id_user_id_key').on(
      table.templateId,
      table.userId,
    ),
    check(
      'template_reviews_rating_check',
      sql`(rating >= 1) AND (rating <= 5)`,
    ),
  ],
);

export const contentBlocks = pgTable(
  'content_blocks',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    userId: uuid('user_id'),
    type: varchar({ length: 50 }).notNull(),
    title: varchar({ length: 255 }),
    content: jsonb().default({}).notNull(),
    thumbnailUrl: text('thumbnail_url'),
    tags: text().array(),
    isPublic: boolean('is_public').default(false),
    usageCount: integer('usage_count').default(0),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    index('idx_content_blocks_is_public').using(
      'btree',
      table.isPublic.asc().nullsLast().op('bool_ops'),
    ),
    index('idx_content_blocks_type').using(
      'btree',
      table.type.asc().nullsLast().op('text_ops'),
    ),
    index('idx_content_blocks_user_id').using(
      'btree',
      table.userId.asc().nullsLast().op('uuid_ops'),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userProfiles.id],
      name: 'content_blocks_user_id_fkey',
    }).onDelete('cascade'),
    check(
      'content_blocks_type_check',
      sql`(type)::text = ANY ((ARRAY['text'::character varying, 'image'::character varying, 'location'::character varying, 'activity'::character varying, 'accommodation'::character varying, 'transport'::character varying])::text[])`,
    ),
  ],
);

export const templateCategories = pgTable(
  'template_categories',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    name: varchar({ length: 100 }).notNull(),
    description: text(),
    icon: varchar({ length: 50 }),
    color: varchar({ length: 7 }),
    sortOrder: integer('sort_order').default(0),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    index('idx_template_categories_is_active').using(
      'btree',
      table.isActive.asc().nullsLast().op('bool_ops'),
    ),
    index('idx_template_categories_sort_order').using(
      'btree',
      table.sortOrder.asc().nullsLast().op('int4_ops'),
    ),
    unique('template_categories_name_key').on(table.name),
  ],
);

export const adminActivityLogs = pgTable(
  'admin_activity_logs',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    adminUserId: uuid('admin_user_id'),
    action: varchar({ length: 100 }).notNull(),
    targetType: varchar('target_type', { length: 50 }),
    targetId: uuid('target_id'),
    details: jsonb().default({}),
    ipAddress: inet('ip_address'),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    index('idx_admin_activity_logs_action').using(
      'btree',
      table.action.asc().nullsLast().op('text_ops'),
    ),
    index('idx_admin_activity_logs_admin_user_id').using(
      'btree',
      table.adminUserId.asc().nullsLast().op('uuid_ops'),
    ),
    index('idx_admin_activity_logs_created_at').using(
      'btree',
      table.createdAt.asc().nullsLast().op('timestamptz_ops'),
    ),
    index('idx_admin_activity_logs_target_type').using(
      'btree',
      table.targetType.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.adminUserId],
      foreignColumns: [userProfiles.id],
      name: 'admin_activity_logs_admin_user_id_fkey',
    }).onDelete('set null'),
  ],
);

export const contentReports = pgTable(
  'content_reports',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    reporterUserId: uuid('reporter_user_id'),
    contentType: varchar('content_type', { length: 50 }).notNull(),
    contentId: uuid('content_id').notNull(),
    reason: varchar({ length: 100 }).notNull(),
    description: text(),
    status: varchar({ length: 20 }).default('pending'),
    adminNotes: text('admin_notes'),
    resolvedBy: uuid('resolved_by'),
    resolvedAt: timestamp('resolved_at', {
      withTimezone: true,
      mode: 'string',
    }),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    index('idx_content_reports_content_type').using(
      'btree',
      table.contentType.asc().nullsLast().op('text_ops'),
    ),
    index('idx_content_reports_created_at').using(
      'btree',
      table.createdAt.asc().nullsLast().op('timestamptz_ops'),
    ),
    index('idx_content_reports_reporter_user_id').using(
      'btree',
      table.reporterUserId.asc().nullsLast().op('uuid_ops'),
    ),
    index('idx_content_reports_status').using(
      'btree',
      table.status.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.reporterUserId],
      foreignColumns: [userProfiles.id],
      name: 'content_reports_reporter_user_id_fkey',
    }).onDelete('set null'),
    foreignKey({
      columns: [table.resolvedBy],
      foreignColumns: [userProfiles.id],
      name: 'content_reports_resolved_by_fkey',
    }).onDelete('set null'),
    check(
      'content_reports_content_type_check',
      sql`(content_type)::text = ANY ((ARRAY['itinerary'::character varying, 'template'::character varying, 'review'::character varying, 'user'::character varying])::text[])`,
    ),
    check(
      'content_reports_status_check',
      sql`(status)::text = ANY ((ARRAY['pending'::character varying, 'reviewing'::character varying, 'resolved'::character varying, 'dismissed'::character varying])::text[])`,
    ),
  ],
);

export const analyticsDaily = pgTable(
  'analytics_daily',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    date: date().notNull(),
    metricType: varchar('metric_type', { length: 50 }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    metricValue: bigint('metric_value', { mode: 'number' })
      .default(0)
      .notNull(),
    dimensions: jsonb().default({}),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    index('idx_analytics_daily_date').using(
      'btree',
      table.date.asc().nullsLast().op('date_ops'),
    ),
    index('idx_analytics_daily_metric_type').using(
      'btree',
      table.metricType.asc().nullsLast().op('text_ops'),
    ),
    unique('analytics_daily_date_metric_type_dimensions_key').on(
      table.date,
      table.metricType,
      table.dimensions,
    ),
  ],
);

export const systemSettings = pgTable(
  'system_settings',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    key: varchar({ length: 100 }).notNull(),
    value: jsonb().notNull(),
    description: text(),
    category: varchar({ length: 50 }).default('general'),
    isPublic: boolean('is_public').default(false),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    index('idx_system_settings_category').using(
      'btree',
      table.category.asc().nullsLast().op('text_ops'),
    ),
    index('idx_system_settings_is_public').using(
      'btree',
      table.isPublic.asc().nullsLast().op('bool_ops'),
    ),
    unique('system_settings_key_key').on(table.key),
  ],
);

export const userSubscriptions = pgTable(
  'user_subscriptions',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    userId: uuid('user_id'),
    planId: uuid('plan_id'),
    status: varchar({ length: 20 }).default('active'),
    currentPeriodStart: timestamp('current_period_start', {
      withTimezone: true,
      mode: 'string',
    }),
    currentPeriodEnd: timestamp('current_period_end', {
      withTimezone: true,
      mode: 'string',
    }),
    cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
    stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
    stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    index('idx_user_subscriptions_current_period_end').using(
      'btree',
      table.currentPeriodEnd.asc().nullsLast().op('timestamptz_ops'),
    ),
    index('idx_user_subscriptions_status').using(
      'btree',
      table.status.asc().nullsLast().op('text_ops'),
    ),
    index('idx_user_subscriptions_user_id').using(
      'btree',
      table.userId.asc().nullsLast().op('uuid_ops'),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userProfiles.id],
      name: 'user_subscriptions_user_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.planId],
      foreignColumns: [subscriptionPlans.id],
      name: 'user_subscriptions_plan_id_fkey',
    }),
    check(
      'user_subscriptions_status_check',
      sql`(status)::text = ANY ((ARRAY['active'::character varying, 'cancelled'::character varying, 'expired'::character varying, 'past_due'::character varying])::text[])`,
    ),
  ],
);

export const subscriptionPlans = pgTable(
  'subscription_plans',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    name: varchar({ length: 50 }).notNull(),
    description: text(),
    price: numeric({ precision: 10, scale: 2 }).notNull(),
    currency: varchar({ length: 3 }).default('USD'),
    billingInterval: varchar('billing_interval', { length: 20 }).default(
      'monthly',
    ),
    features: jsonb().default([]),
    limits: jsonb().default({}),
    isActive: boolean('is_active').default(true),
    sortOrder: integer('sort_order').default(0),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    index('idx_subscription_plans_is_active').using(
      'btree',
      table.isActive.asc().nullsLast().op('bool_ops'),
    ),
    index('idx_subscription_plans_sort_order').using(
      'btree',
      table.sortOrder.asc().nullsLast().op('int4_ops'),
    ),
    unique('subscription_plans_name_key').on(table.name),
    check(
      'subscription_plans_billing_interval_check',
      sql`(billing_interval)::text = ANY ((ARRAY['monthly'::character varying, 'yearly'::character varying])::text[])`,
    ),
  ],
);

export const purchases = pgTable(
  'purchases',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    buyerUserId: uuid('buyer_user_id'),
    sellerUserId: uuid('seller_user_id'),
    itemType: varchar('item_type', { length: 20 }).notNull(),
    itemId: uuid('item_id').notNull(),
    amount: numeric({ precision: 10, scale: 2 }).notNull(),
    currency: varchar({ length: 3 }).default('USD'),
    platformFee: numeric('platform_fee', { precision: 10, scale: 2 }).default(
      '0',
    ),
    sellerEarnings: numeric('seller_earnings', {
      precision: 10,
      scale: 2,
    }).default('0'),
    paymentMethod: varchar('payment_method', { length: 50 }),
    paymentStatus: varchar('payment_status', { length: 20 }).default('pending'),
    stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    index('idx_purchases_buyer_user_id').using(
      'btree',
      table.buyerUserId.asc().nullsLast().op('uuid_ops'),
    ),
    index('idx_purchases_created_at').using(
      'btree',
      table.createdAt.asc().nullsLast().op('timestamptz_ops'),
    ),
    index('idx_purchases_item_type').using(
      'btree',
      table.itemType.asc().nullsLast().op('text_ops'),
    ),
    index('idx_purchases_payment_status').using(
      'btree',
      table.paymentStatus.asc().nullsLast().op('text_ops'),
    ),
    index('idx_purchases_seller_user_id').using(
      'btree',
      table.sellerUserId.asc().nullsLast().op('uuid_ops'),
    ),
    foreignKey({
      columns: [table.buyerUserId],
      foreignColumns: [userProfiles.id],
      name: 'purchases_buyer_user_id_fkey',
    }).onDelete('set null'),
    foreignKey({
      columns: [table.sellerUserId],
      foreignColumns: [userProfiles.id],
      name: 'purchases_seller_user_id_fkey',
    }).onDelete('set null'),
    check(
      'purchases_item_type_check',
      sql`(item_type)::text = ANY ((ARRAY['template'::character varying, 'itinerary'::character varying])::text[])`,
    ),
    check(
      'purchases_payment_status_check',
      sql`(payment_status)::text = ANY ((ARRAY['pending'::character varying, 'completed'::character varying, 'failed'::character varying, 'refunded'::character varying])::text[])`,
    ),
  ],
);

export const creatorEarnings = pgTable(
  'creator_earnings',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    userId: uuid('user_id'),
    totalEarnings: numeric('total_earnings', {
      precision: 12,
      scale: 2,
    }).default('0'),
    availableBalance: numeric('available_balance', {
      precision: 12,
      scale: 2,
    }).default('0'),
    pendingBalance: numeric('pending_balance', {
      precision: 12,
      scale: 2,
    }).default('0'),
    totalWithdrawn: numeric('total_withdrawn', {
      precision: 12,
      scale: 2,
    }).default('0'),
    lastPayoutAt: timestamp('last_payout_at', {
      withTimezone: true,
      mode: 'string',
    }),
    stripeAccountId: varchar('stripe_account_id', { length: 255 }),
    payoutSchedule: varchar('payout_schedule', { length: 20 }).default(
      'monthly',
    ),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    index('idx_creator_earnings_user_id').using(
      'btree',
      table.userId.asc().nullsLast().op('uuid_ops'),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userProfiles.id],
      name: 'creator_earnings_user_id_fkey',
    }).onDelete('cascade'),
    unique('creator_earnings_user_id_key').on(table.userId),
    check(
      'creator_earnings_payout_schedule_check',
      sql`(payout_schedule)::text = ANY ((ARRAY['weekly'::character varying, 'monthly'::character varying])::text[])`,
    ),
  ],
);

export const categories = pgTable(
  'categories',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    name: varchar({ length: 255 }).notNull(),
    description: text(),
    icon: varchar({ length: 255 }),
    color: varchar({ length: 255 }),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [unique('categories_name_key').on(table.name)],
);

export const userSessions = pgTable(
  'user_sessions',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid('user_id').notNull(),
    sessionToken: varchar('session_token', { length: 64 }).notNull(),
    expiresAt: timestamp('expires_at', {
      withTimezone: true,
      mode: 'string',
    }).notNull(),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    index('idx_user_sessions_token').using(
      'btree',
      table.sessionToken.asc().nullsLast().op('text_ops'),
    ),
    index('idx_user_sessions_user_id').using(
      'btree',
      table.userId.asc().nullsLast().op('uuid_ops'),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userProfiles.id],
      name: 'user_sessions_user_id_fkey',
    }).onDelete('cascade'),
    unique('user_sessions_session_token_key').on(table.sessionToken),
  ],
);

export const activityTypes = pgTable(
  'activity_types',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    name: varchar({ length: 100 }).notNull(),
    icon: varchar({ length: 50 }),
    color: varchar({ length: 7 }),
    description: text(),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    category: varchar({ length: 100 }),
  },
  (table) => [unique('activity_types_name_key').on(table.name)],
);

export const destinations = pgTable(
  'destinations',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    name: varchar({ length: 255 }).notNull(),
    country: varchar({ length: 100 }).notNull(),
    region: varchar({ length: 100 }),
    description: text(),
    coverImageUrl: text('cover_image_url'),
    galleryImages: text('gallery_images').array(),
    latitude: numeric({ precision: 10, scale: 8 }),
    longitude: numeric({ precision: 11, scale: 8 }),
    timezone: varchar({ length: 50 }),
    currency: varchar({ length: 3 }),
    bestTimeToVisit: text('best_time_to_visit'),
    averageTemperature: jsonb('average_temperature'),
    popularActivities: text('popular_activities').array(),
    travelTips: text('travel_tips'),
    safetyRating: integer('safety_rating'),
    costLevel: varchar('cost_level', { length: 20 }).default('moderate'),
    createdBy: uuid('created_by'),
    isVerified: boolean('is_verified').default(false),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    index('idx_destinations_country').using(
      'btree',
      table.country.asc().nullsLast().op('text_ops'),
    ),
    index('idx_destinations_location').using(
      'btree',
      table.latitude.asc().nullsLast().op('numeric_ops'),
      table.longitude.asc().nullsLast().op('numeric_ops'),
    ),
    index('idx_destinations_name').using(
      'btree',
      table.name.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.createdBy],
      foreignColumns: [userProfiles.id],
      name: 'destinations_created_by_fkey',
    }),
    check(
      'destinations_safety_rating_check',
      sql`(safety_rating >= 1) AND (safety_rating <= 5)`,
    ),
    check(
      'destinations_cost_level_check',
      sql`(cost_level)::text = ANY ((ARRAY['budget'::character varying, 'moderate'::character varying, 'luxury'::character varying])::text[])`,
    ),
  ],
);

export const itineraryItems = pgTable(
  'itinerary_items',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    itineraryDayId: uuid('itinerary_day_id'),
    activityTypeId: uuid('activity_type_id'),
    destinationId: uuid('destination_id'),
    title: varchar({ length: 255 }).notNull(),
    description: text(),
    startTime: time('start_time'),
    endTime: time('end_time'),
    durationMinutes: integer('duration_minutes'),
    estimatedCost: numeric('estimated_cost', { precision: 10, scale: 2 }),
    currency: varchar({ length: 3 }).default('USD'),
    rating: numeric({ precision: 3, scale: 2 }),
    difficultyLevel: varchar('difficulty_level', { length: 20 }),
    bookingRequired: boolean('booking_required').default(false),
    bookingUrl: text('booking_url'),
    contactInfo: jsonb('contact_info'),
    locationName: varchar('location_name', { length: 255 }),
    address: text(),
    latitude: numeric({ precision: 10, scale: 8 }),
    longitude: numeric({ precision: 11, scale: 8 }),
    photos: text().array(),
    notes: text(),
    orderIndex: integer('order_index').default(0),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    index('idx_itinerary_items_day_id').using(
      'btree',
      table.itineraryDayId.asc().nullsLast().op('uuid_ops'),
    ),
    index('idx_itinerary_items_destination').using(
      'btree',
      table.destinationId.asc().nullsLast().op('uuid_ops'),
    ),
    index('idx_itinerary_items_order').using(
      'btree',
      table.itineraryDayId.asc().nullsLast().op('int4_ops'),
      table.orderIndex.asc().nullsLast().op('uuid_ops'),
    ),
    index('idx_itinerary_items_type').using(
      'btree',
      table.activityTypeId.asc().nullsLast().op('uuid_ops'),
    ),
    foreignKey({
      columns: [table.itineraryDayId],
      foreignColumns: [itineraryDays.id],
      name: 'itinerary_items_itinerary_day_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.activityTypeId],
      foreignColumns: [activityTypes.id],
      name: 'itinerary_items_activity_type_id_fkey',
    }),
    foreignKey({
      columns: [table.destinationId],
      foreignColumns: [destinations.id],
      name: 'itinerary_items_destination_id_fkey',
    }),
    check(
      'itinerary_items_rating_check',
      sql`(rating >= (0)::numeric) AND (rating <= (5)::numeric)`,
    ),
    check(
      'itinerary_items_difficulty_level_check',
      sql`(difficulty_level)::text = ANY ((ARRAY['easy'::character varying, 'moderate'::character varying, 'hard'::character varying])::text[])`,
    ),
  ],
);

export const itineraryDays = pgTable(
  'itinerary_days',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    itineraryId: uuid('itinerary_id'),
    dayNumber: integer('day_number').notNull(),
    title: varchar({ length: 255 }),
    description: text(),
    activities: jsonb().default([]),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    destinationId: uuid('destination_id'),
    accommodationName: varchar('accommodation_name', { length: 255 }),
    accommodationAddress: text('accommodation_address'),
    accommodationCost: numeric('accommodation_cost', {
      precision: 10,
      scale: 2,
    }),
    transportationInfo: jsonb('transportation_info'),
    mealsInfo: jsonb('meals_info'),
    dayTotalCost: numeric('day_total_cost', { precision: 10, scale: 2 }),
  },
  (table) => [
    index('idx_itinerary_days_itinerary_id').using(
      'btree',
      table.itineraryId.asc().nullsLast().op('uuid_ops'),
    ),
    foreignKey({
      columns: [table.itineraryId],
      foreignColumns: [itineraries.id],
      name: 'itinerary_days_itinerary_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.destinationId],
      foreignColumns: [destinations.id],
      name: 'itinerary_days_destination_id_fkey',
    }),
    unique('itinerary_days_itinerary_id_day_number_key').on(
      table.itineraryId,
      table.dayNumber,
    ),
  ],
);

export const reviews = pgTable(
  'reviews',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    userId: uuid('user_id'),
    reviewableType: varchar('reviewable_type', { length: 50 }).notNull(),
    reviewableId: uuid('reviewable_id').notNull(),
    rating: integer(),
    title: varchar({ length: 255 }),
    content: text(),
    photos: text().array(),
    helpfulCount: integer('helpful_count').default(0),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    index('idx_reviews_reviewable').using(
      'btree',
      table.reviewableType.asc().nullsLast().op('text_ops'),
      table.reviewableId.asc().nullsLast().op('text_ops'),
    ),
    index('idx_reviews_user').using(
      'btree',
      table.userId.asc().nullsLast().op('uuid_ops'),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userProfiles.id],
      name: 'reviews_user_id_fkey',
    }).onDelete('cascade'),
    check('reviews_rating_check', sql`(rating >= 1) AND (rating <= 5)`),
  ],
);

export const userBucketLists = pgTable(
  'user_bucket_lists',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid('user_id').notNull(),
    itineraryId: uuid('itinerary_id').notNull(),
    addedAt: timestamp('added_at', {
      withTimezone: true,
      mode: 'string',
    }).default(sql`CURRENT_TIMESTAMP`),
    notes: text(),
  },
  (table) => [
    index('idx_bucket_lists_itinerary_id').using(
      'btree',
      table.itineraryId.asc().nullsLast().op('uuid_ops'),
    ),
    index('idx_bucket_lists_user_id').using(
      'btree',
      table.userId.asc().nullsLast().op('uuid_ops'),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userProfiles.id],
      name: 'user_bucket_lists_user_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.itineraryId],
      foreignColumns: [itineraries.id],
      name: 'user_bucket_lists_itinerary_id_fkey',
    }).onDelete('cascade'),
    unique('user_bucket_lists_user_id_itinerary_id_key').on(
      table.userId,
      table.itineraryId,
    ),
  ],
);

export const quoteRequests = pgTable(
  'quote_requests',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid('user_id'),
    itineraryId: uuid('itinerary_id'),
    fullName: varchar('full_name', { length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull(),
    phoneNumber: varchar('phone_number', { length: 50 }),
    travelStartDate: date('travel_start_date'),
    travelEndDate: date('travel_end_date'),
    numberOfTravelers: integer('number_of_travelers').default(1),
    tourCategory: varchar('tour_category', { length: 100 }),
    specialRequirements: text('special_requirements'),
    budgetRange: varchar('budget_range', { length: 100 }),
    accommodationPreference: varchar('accommodation_preference', {
      length: 100,
    }),
    status: varchar({ length: 50 }).default('pending'),
    priority: varchar({ length: 20 }).default('normal'),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).default(sql`CURRENT_TIMESTAMP`),
    adminNotes: text('admin_notes'),
    assignedTo: uuid('assigned_to'),
  },
  (table) => [
    index('idx_quote_requests_created_at').using(
      'btree',
      table.createdAt.asc().nullsLast().op('timestamptz_ops'),
    ),
    index('idx_quote_requests_status').using(
      'btree',
      table.status.asc().nullsLast().op('text_ops'),
    ),
    index('idx_quote_requests_user_id').using(
      'btree',
      table.userId.asc().nullsLast().op('uuid_ops'),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userProfiles.id],
      name: 'quote_requests_user_id_fkey',
    }).onDelete('set null'),
    foreignKey({
      columns: [table.itineraryId],
      foreignColumns: [itineraries.id],
      name: 'quote_requests_itinerary_id_fkey',
    }).onDelete('set null'),
    foreignKey({
      columns: [table.assignedTo],
      foreignColumns: [userProfiles.id],
      name: 'quote_requests_assigned_to_fkey',
    }).onDelete('set null'),
  ],
);

export const quoteResponses = pgTable(
  'quote_responses',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    quoteRequestId: uuid('quote_request_id').notNull(),
    responderId: uuid('responder_id'),
    responseType: varchar('response_type', { length: 50 }).default('quote'),
    subject: varchar({ length: 255 }),
    message: text().notNull(),
    quotedPrice: numeric('quoted_price', { precision: 10, scale: 2 }),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index('idx_quote_responses_request_id').using(
      'btree',
      table.quoteRequestId.asc().nullsLast().op('uuid_ops'),
    ),
    foreignKey({
      columns: [table.quoteRequestId],
      foreignColumns: [quoteRequests.id],
      name: 'quote_responses_quote_request_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.responderId],
      foreignColumns: [userProfiles.id],
      name: 'quote_responses_responder_id_fkey',
    }).onDelete('set null'),
  ],
);
