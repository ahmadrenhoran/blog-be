CREATE TABLE "portfolio_media" (
	"id" serial PRIMARY KEY NOT NULL,
	"portfolio_id" integer NOT NULL,
	"url" varchar(255) NOT NULL,
	"type" varchar(50) DEFAULT 'image',
	"alt" varchar(255),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio_sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"portfolio_id" integer NOT NULL,
	"type" varchar(50) NOT NULL,
	"title" varchar(255),
	"content" jsonb NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio_tools" (
	"id" serial PRIMARY KEY NOT NULL,
	"portfolio_id" integer NOT NULL,
	"tool_id" integer NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tools" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"icon_url" varchar(255),
	"category" varchar(100),
	"website_url" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tools_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "portfolios" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "portfolios" ADD COLUMN "slug" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "portfolios" ADD COLUMN "short_description" jsonb;--> statement-breakpoint
ALTER TABLE "portfolios" ADD COLUMN "category" varchar(100);--> statement-breakpoint
ALTER TABLE "portfolios" ADD COLUMN "cover_image" varchar(255);--> statement-breakpoint
ALTER TABLE "portfolios" ADD COLUMN "live_url" varchar(255);--> statement-breakpoint
ALTER TABLE "portfolios" ADD COLUMN "is_published" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "portfolios" ADD COLUMN "custom_fields" jsonb;--> statement-breakpoint
ALTER TABLE "portfolio_media" ADD CONSTRAINT "portfolio_media_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_sections" ADD CONSTRAINT "portfolio_sections_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_tools" ADD CONSTRAINT "portfolio_tools_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_tools" ADD CONSTRAINT "portfolio_tools_tool_id_tools_id_fk" FOREIGN KEY ("tool_id") REFERENCES "public"."tools"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolios" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "portfolios" DROP COLUMN "image_url";--> statement-breakpoint
ALTER TABLE "portfolios" DROP COLUMN "tech_stack";--> statement-breakpoint
ALTER TABLE "portfolios" DROP COLUMN "demo_url";--> statement-breakpoint
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_slug_unique" UNIQUE("slug");