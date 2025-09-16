-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "user_profiles" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"full_name" varchar(255),
	"avatar_url" text,
	"role" varchar(20) DEFAULT 'traveler',
	"subscription_tier" varchar(20) DEFAULT 'free',
	"bio" text,
	"website_url" text,
	"location" varchar(255),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "user_profiles_email_key" UNIQUE("email"),
	CONSTRAINT "user_profiles_role_check" CHECK ((role)::text = ANY ((ARRAY['traveler'::character varying, 'author'::character varying, 'agency'::character varying, 'admin'::character varying])::text[])),
	CONSTRAINT "user_profiles_subscription_tier_check" CHECK ((subscription_tier)::text = ANY ((ARRAY['free'::character varying, 'pro'::character varying, 'enterprise'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "itineraries" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_id" uuid,
	"title" varchar(255) NOT NULL,
	"description" text,
	"destination" varchar(255),
	"duration_days" integer,
	"canvas_data" jsonb DEFAULT '{}'::jsonb,
	"thumbnail_url" text,
	"is_public" boolean DEFAULT false,
	"is_template" boolean DEFAULT false,
	"price" numeric(10, 2) DEFAULT '0',
	"currency" varchar(3) DEFAULT 'USD',
	"tags" text[],
	"view_count" integer DEFAULT 0,
	"like_count" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"cover_image_url" text,
	"total_estimated_cost" numeric(10, 2),
	"difficulty_level" varchar(20),
	"group_size_min" integer DEFAULT 1,
	"group_size_max" integer,
	"age_restriction" varchar(50),
	"season_best" text[],
	"includes" text[],
	"excludes" text[],
	"total_days" integer,
	"created_by" varchar(100),
	"is_featured" boolean,
	"category" varchar(100),
	CONSTRAINT "itineraries_difficulty_level_check" CHECK ((difficulty_level)::text = ANY ((ARRAY['easy'::character varying, 'moderate'::character varying, 'hard'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "design_templates" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_id" uuid,
	"name" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(100),
	"canvas_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"thumbnail_url" text,
	"is_public" boolean DEFAULT false,
	"price" numeric(10, 2) DEFAULT '0',
	"currency" varchar(3) DEFAULT 'USD',
	"tags" text[],
	"download_count" integer DEFAULT 0,
	"rating" numeric(3, 2) DEFAULT '0',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_favorites" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_id" uuid,
	"itinerary_id" uuid,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "user_favorites_user_id_itinerary_id_key" UNIQUE("user_id","itinerary_id")
);
--> statement-breakpoint
CREATE TABLE "collaborations" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"itinerary_id" uuid,
	"user_id" uuid,
	"permission_level" varchar(20) DEFAULT 'view',
	"invited_by" uuid,
	"status" varchar(20) DEFAULT 'pending',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "collaborations_itinerary_id_user_id_key" UNIQUE("itinerary_id","user_id"),
	CONSTRAINT "collaborations_permission_level_check" CHECK ((permission_level)::text = ANY ((ARRAY['view'::character varying, 'edit'::character varying, 'admin'::character varying])::text[])),
	CONSTRAINT "collaborations_status_check" CHECK ((status)::text = ANY ((ARRAY['pending'::character varying, 'accepted'::character varying, 'declined'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "asset_library" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_id" uuid,
	"filename" varchar(255) NOT NULL,
	"original_name" varchar(255) NOT NULL,
	"file_type" varchar(50) NOT NULL,
	"file_size" bigint NOT NULL,
	"file_url" text NOT NULL,
	"thumbnail_url" text,
	"alt_text" text,
	"tags" text[],
	"is_public" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "template_reviews" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"template_id" uuid,
	"user_id" uuid,
	"rating" integer,
	"review_text" text,
	"is_verified_purchase" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "template_reviews_template_id_user_id_key" UNIQUE("template_id","user_id"),
	CONSTRAINT "template_reviews_rating_check" CHECK ((rating >= 1) AND (rating <= 5))
);
--> statement-breakpoint
CREATE TABLE "content_blocks" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_id" uuid,
	"type" varchar(50) NOT NULL,
	"title" varchar(255),
	"content" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"thumbnail_url" text,
	"tags" text[],
	"is_public" boolean DEFAULT false,
	"usage_count" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "content_blocks_type_check" CHECK ((type)::text = ANY ((ARRAY['text'::character varying, 'image'::character varying, 'location'::character varying, 'activity'::character varying, 'accommodation'::character varying, 'transport'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "template_categories" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"icon" varchar(50),
	"color" varchar(7),
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "template_categories_name_key" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "admin_activity_logs" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"admin_user_id" uuid,
	"action" varchar(100) NOT NULL,
	"target_type" varchar(50),
	"target_id" uuid,
	"details" jsonb DEFAULT '{}'::jsonb,
	"ip_address" "inet",
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "content_reports" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"reporter_user_id" uuid,
	"content_type" varchar(50) NOT NULL,
	"content_id" uuid NOT NULL,
	"reason" varchar(100) NOT NULL,
	"description" text,
	"status" varchar(20) DEFAULT 'pending',
	"admin_notes" text,
	"resolved_by" uuid,
	"resolved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "content_reports_content_type_check" CHECK ((content_type)::text = ANY ((ARRAY['itinerary'::character varying, 'template'::character varying, 'review'::character varying, 'user'::character varying])::text[])),
	CONSTRAINT "content_reports_status_check" CHECK ((status)::text = ANY ((ARRAY['pending'::character varying, 'reviewing'::character varying, 'resolved'::character varying, 'dismissed'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "analytics_daily" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"date" date NOT NULL,
	"metric_type" varchar(50) NOT NULL,
	"metric_value" bigint DEFAULT 0 NOT NULL,
	"dimensions" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "analytics_daily_date_metric_type_dimensions_key" UNIQUE("date","metric_type","dimensions")
);
--> statement-breakpoint
CREATE TABLE "system_settings" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"key" varchar(100) NOT NULL,
	"value" jsonb NOT NULL,
	"description" text,
	"category" varchar(50) DEFAULT 'general',
	"is_public" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "system_settings_key_key" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "user_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_id" uuid,
	"plan_id" uuid,
	"status" varchar(20) DEFAULT 'active',
	"current_period_start" timestamp with time zone,
	"current_period_end" timestamp with time zone,
	"cancel_at_period_end" boolean DEFAULT false,
	"stripe_subscription_id" varchar(255),
	"stripe_customer_id" varchar(255),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "user_subscriptions_status_check" CHECK ((status)::text = ANY ((ARRAY['active'::character varying, 'cancelled'::character varying, 'expired'::character varying, 'past_due'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "subscription_plans" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" text,
	"price" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD',
	"billing_interval" varchar(20) DEFAULT 'monthly',
	"features" jsonb DEFAULT '[]'::jsonb,
	"limits" jsonb DEFAULT '{}'::jsonb,
	"is_active" boolean DEFAULT true,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "subscription_plans_name_key" UNIQUE("name"),
	CONSTRAINT "subscription_plans_billing_interval_check" CHECK ((billing_interval)::text = ANY ((ARRAY['monthly'::character varying, 'yearly'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "purchases" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"buyer_user_id" uuid,
	"seller_user_id" uuid,
	"item_type" varchar(20) NOT NULL,
	"item_id" uuid NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD',
	"platform_fee" numeric(10, 2) DEFAULT '0',
	"seller_earnings" numeric(10, 2) DEFAULT '0',
	"payment_method" varchar(50),
	"payment_status" varchar(20) DEFAULT 'pending',
	"stripe_payment_intent_id" varchar(255),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "purchases_item_type_check" CHECK ((item_type)::text = ANY ((ARRAY['template'::character varying, 'itinerary'::character varying])::text[])),
	CONSTRAINT "purchases_payment_status_check" CHECK ((payment_status)::text = ANY ((ARRAY['pending'::character varying, 'completed'::character varying, 'failed'::character varying, 'refunded'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "creator_earnings" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_id" uuid,
	"total_earnings" numeric(12, 2) DEFAULT '0',
	"available_balance" numeric(12, 2) DEFAULT '0',
	"pending_balance" numeric(12, 2) DEFAULT '0',
	"total_withdrawn" numeric(12, 2) DEFAULT '0',
	"last_payout_at" timestamp with time zone,
	"stripe_account_id" varchar(255),
	"payout_schedule" varchar(20) DEFAULT 'monthly',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "creator_earnings_user_id_key" UNIQUE("user_id"),
	CONSTRAINT "creator_earnings_payout_schedule_check" CHECK ((payout_schedule)::text = ANY ((ARRAY['weekly'::character varying, 'monthly'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"icon" varchar(255),
	"color" varchar(255),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "categories_name_key" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"session_token" varchar(64) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "user_sessions_session_token_key" UNIQUE("session_token")
);
--> statement-breakpoint
CREATE TABLE "activity_types" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar(100) NOT NULL,
	"icon" varchar(50),
	"color" varchar(7),
	"description" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"category" varchar(100),
	CONSTRAINT "activity_types_name_key" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "destinations" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar(255) NOT NULL,
	"country" varchar(100) NOT NULL,
	"region" varchar(100),
	"description" text,
	"cover_image_url" text,
	"gallery_images" text[],
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"timezone" varchar(50),
	"currency" varchar(3),
	"best_time_to_visit" text,
	"average_temperature" jsonb,
	"popular_activities" text[],
	"travel_tips" text,
	"safety_rating" integer,
	"cost_level" varchar(20) DEFAULT 'moderate',
	"created_by" uuid,
	"is_verified" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "destinations_safety_rating_check" CHECK ((safety_rating >= 1) AND (safety_rating <= 5)),
	CONSTRAINT "destinations_cost_level_check" CHECK ((cost_level)::text = ANY ((ARRAY['budget'::character varying, 'moderate'::character varying, 'luxury'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "itinerary_items" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"itinerary_day_id" uuid,
	"activity_type_id" uuid,
	"destination_id" uuid,
	"title" varchar(255) NOT NULL,
	"description" text,
	"start_time" time,
	"end_time" time,
	"duration_minutes" integer,
	"estimated_cost" numeric(10, 2),
	"currency" varchar(3) DEFAULT 'USD',
	"rating" numeric(3, 2),
	"difficulty_level" varchar(20),
	"booking_required" boolean DEFAULT false,
	"booking_url" text,
	"contact_info" jsonb,
	"location_name" varchar(255),
	"address" text,
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"photos" text[],
	"notes" text,
	"order_index" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "itinerary_items_rating_check" CHECK ((rating >= (0)::numeric) AND (rating <= (5)::numeric)),
	CONSTRAINT "itinerary_items_difficulty_level_check" CHECK ((difficulty_level)::text = ANY ((ARRAY['easy'::character varying, 'moderate'::character varying, 'hard'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "itinerary_days" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"itinerary_id" uuid,
	"day_number" integer NOT NULL,
	"title" varchar(255),
	"description" text,
	"activities" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"destination_id" uuid,
	"accommodation_name" varchar(255),
	"accommodation_address" text,
	"accommodation_cost" numeric(10, 2),
	"transportation_info" jsonb,
	"meals_info" jsonb,
	"day_total_cost" numeric(10, 2),
	CONSTRAINT "itinerary_days_itinerary_id_day_number_key" UNIQUE("itinerary_id","day_number")
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_id" uuid,
	"reviewable_type" varchar(50) NOT NULL,
	"reviewable_id" uuid NOT NULL,
	"rating" integer,
	"title" varchar(255),
	"content" text,
	"photos" text[],
	"helpful_count" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "reviews_rating_check" CHECK ((rating >= 1) AND (rating <= 5))
);
--> statement-breakpoint
CREATE TABLE "user_bucket_lists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"itinerary_id" uuid NOT NULL,
	"added_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"notes" text,
	CONSTRAINT "user_bucket_lists_user_id_itinerary_id_key" UNIQUE("user_id","itinerary_id")
);
--> statement-breakpoint
CREATE TABLE "quote_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"itinerary_id" uuid,
	"full_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone_number" varchar(50),
	"travel_start_date" date,
	"travel_end_date" date,
	"number_of_travelers" integer DEFAULT 1,
	"tour_category" varchar(100),
	"special_requirements" text,
	"budget_range" varchar(100),
	"accommodation_preference" varchar(100),
	"status" varchar(50) DEFAULT 'pending',
	"priority" varchar(20) DEFAULT 'normal',
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"admin_notes" text,
	"assigned_to" uuid
);
--> statement-breakpoint
CREATE TABLE "quote_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quote_request_id" uuid NOT NULL,
	"responder_id" uuid,
	"response_type" varchar(50) DEFAULT 'quote',
	"subject" varchar(255),
	"message" text NOT NULL,
	"quoted_price" numeric(10, 2),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
ALTER TABLE "itineraries" ADD CONSTRAINT "itineraries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "design_templates" ADD CONSTRAINT "design_templates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "public"."itineraries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collaborations" ADD CONSTRAINT "collaborations_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "public"."itineraries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collaborations" ADD CONSTRAINT "collaborations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collaborations" ADD CONSTRAINT "collaborations_invited_by_fkey" FOREIGN KEY ("invited_by") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_library" ADD CONSTRAINT "asset_library_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_reviews" ADD CONSTRAINT "template_reviews_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "public"."design_templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_reviews" ADD CONSTRAINT "template_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_blocks" ADD CONSTRAINT "content_blocks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_activity_logs" ADD CONSTRAINT "admin_activity_logs_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "public"."user_profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_reports" ADD CONSTRAINT "content_reports_reporter_user_id_fkey" FOREIGN KEY ("reporter_user_id") REFERENCES "public"."user_profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_reports" ADD CONSTRAINT "content_reports_resolved_by_fkey" FOREIGN KEY ("resolved_by") REFERENCES "public"."user_profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "public"."subscription_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_buyer_user_id_fkey" FOREIGN KEY ("buyer_user_id") REFERENCES "public"."user_profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_seller_user_id_fkey" FOREIGN KEY ("seller_user_id") REFERENCES "public"."user_profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creator_earnings" ADD CONSTRAINT "creator_earnings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "destinations" ADD CONSTRAINT "destinations_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itinerary_items" ADD CONSTRAINT "itinerary_items_itinerary_day_id_fkey" FOREIGN KEY ("itinerary_day_id") REFERENCES "public"."itinerary_days"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itinerary_items" ADD CONSTRAINT "itinerary_items_activity_type_id_fkey" FOREIGN KEY ("activity_type_id") REFERENCES "public"."activity_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itinerary_items" ADD CONSTRAINT "itinerary_items_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itinerary_days" ADD CONSTRAINT "itinerary_days_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "public"."itineraries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itinerary_days" ADD CONSTRAINT "itinerary_days_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_bucket_lists" ADD CONSTRAINT "user_bucket_lists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_bucket_lists" ADD CONSTRAINT "user_bucket_lists_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "public"."itineraries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quote_requests" ADD CONSTRAINT "quote_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quote_requests" ADD CONSTRAINT "quote_requests_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "public"."itineraries"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quote_requests" ADD CONSTRAINT "quote_requests_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "public"."user_profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quote_responses" ADD CONSTRAINT "quote_responses_quote_request_id_fkey" FOREIGN KEY ("quote_request_id") REFERENCES "public"."quote_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quote_responses" ADD CONSTRAINT "quote_responses_responder_id_fkey" FOREIGN KEY ("responder_id") REFERENCES "public"."user_profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_itineraries_is_public" ON "itineraries" USING btree ("is_public" bool_ops);--> statement-breakpoint
CREATE INDEX "idx_itineraries_is_template" ON "itineraries" USING btree ("is_template" bool_ops);--> statement-breakpoint
CREATE INDEX "idx_itineraries_user_id" ON "itineraries" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_design_templates_category" ON "design_templates" USING btree ("category" text_ops);--> statement-breakpoint
CREATE INDEX "idx_design_templates_user_id" ON "design_templates" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_user_favorites_user_id" ON "user_favorites" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_collaborations_itinerary_id" ON "collaborations" USING btree ("itinerary_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_collaborations_user_id" ON "collaborations" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_asset_library_file_type" ON "asset_library" USING btree ("file_type" text_ops);--> statement-breakpoint
CREATE INDEX "idx_asset_library_is_public" ON "asset_library" USING btree ("is_public" bool_ops);--> statement-breakpoint
CREATE INDEX "idx_asset_library_user_id" ON "asset_library" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_template_reviews_rating" ON "template_reviews" USING btree ("rating" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_template_reviews_template_id" ON "template_reviews" USING btree ("template_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_template_reviews_user_id" ON "template_reviews" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_content_blocks_is_public" ON "content_blocks" USING btree ("is_public" bool_ops);--> statement-breakpoint
CREATE INDEX "idx_content_blocks_type" ON "content_blocks" USING btree ("type" text_ops);--> statement-breakpoint
CREATE INDEX "idx_content_blocks_user_id" ON "content_blocks" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_template_categories_is_active" ON "template_categories" USING btree ("is_active" bool_ops);--> statement-breakpoint
CREATE INDEX "idx_template_categories_sort_order" ON "template_categories" USING btree ("sort_order" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_admin_activity_logs_action" ON "admin_activity_logs" USING btree ("action" text_ops);--> statement-breakpoint
CREATE INDEX "idx_admin_activity_logs_admin_user_id" ON "admin_activity_logs" USING btree ("admin_user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_admin_activity_logs_created_at" ON "admin_activity_logs" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_admin_activity_logs_target_type" ON "admin_activity_logs" USING btree ("target_type" text_ops);--> statement-breakpoint
CREATE INDEX "idx_content_reports_content_type" ON "content_reports" USING btree ("content_type" text_ops);--> statement-breakpoint
CREATE INDEX "idx_content_reports_created_at" ON "content_reports" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_content_reports_reporter_user_id" ON "content_reports" USING btree ("reporter_user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_content_reports_status" ON "content_reports" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "idx_analytics_daily_date" ON "analytics_daily" USING btree ("date" date_ops);--> statement-breakpoint
CREATE INDEX "idx_analytics_daily_metric_type" ON "analytics_daily" USING btree ("metric_type" text_ops);--> statement-breakpoint
CREATE INDEX "idx_system_settings_category" ON "system_settings" USING btree ("category" text_ops);--> statement-breakpoint
CREATE INDEX "idx_system_settings_is_public" ON "system_settings" USING btree ("is_public" bool_ops);--> statement-breakpoint
CREATE INDEX "idx_user_subscriptions_current_period_end" ON "user_subscriptions" USING btree ("current_period_end" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_user_subscriptions_status" ON "user_subscriptions" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "idx_user_subscriptions_user_id" ON "user_subscriptions" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_subscription_plans_is_active" ON "subscription_plans" USING btree ("is_active" bool_ops);--> statement-breakpoint
CREATE INDEX "idx_subscription_plans_sort_order" ON "subscription_plans" USING btree ("sort_order" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_purchases_buyer_user_id" ON "purchases" USING btree ("buyer_user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_purchases_created_at" ON "purchases" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_purchases_item_type" ON "purchases" USING btree ("item_type" text_ops);--> statement-breakpoint
CREATE INDEX "idx_purchases_payment_status" ON "purchases" USING btree ("payment_status" text_ops);--> statement-breakpoint
CREATE INDEX "idx_purchases_seller_user_id" ON "purchases" USING btree ("seller_user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_creator_earnings_user_id" ON "creator_earnings" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_user_sessions_token" ON "user_sessions" USING btree ("session_token" text_ops);--> statement-breakpoint
CREATE INDEX "idx_user_sessions_user_id" ON "user_sessions" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_destinations_country" ON "destinations" USING btree ("country" text_ops);--> statement-breakpoint
CREATE INDEX "idx_destinations_location" ON "destinations" USING btree ("latitude" numeric_ops,"longitude" numeric_ops);--> statement-breakpoint
CREATE INDEX "idx_destinations_name" ON "destinations" USING btree ("name" text_ops);--> statement-breakpoint
CREATE INDEX "idx_itinerary_items_day_id" ON "itinerary_items" USING btree ("itinerary_day_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_itinerary_items_destination" ON "itinerary_items" USING btree ("destination_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_itinerary_items_order" ON "itinerary_items" USING btree ("itinerary_day_id" int4_ops,"order_index" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_itinerary_items_type" ON "itinerary_items" USING btree ("activity_type_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_itinerary_days_itinerary_id" ON "itinerary_days" USING btree ("itinerary_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_reviews_reviewable" ON "reviews" USING btree ("reviewable_type" text_ops,"reviewable_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_reviews_user" ON "reviews" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_bucket_lists_itinerary_id" ON "user_bucket_lists" USING btree ("itinerary_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_bucket_lists_user_id" ON "user_bucket_lists" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_quote_requests_created_at" ON "quote_requests" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_quote_requests_status" ON "quote_requests" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "idx_quote_requests_user_id" ON "quote_requests" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_quote_responses_request_id" ON "quote_responses" USING btree ("quote_request_id" uuid_ops);
*/