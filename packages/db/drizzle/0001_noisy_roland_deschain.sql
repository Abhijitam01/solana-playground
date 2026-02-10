ALTER TABLE "user_code" ALTER COLUMN "code" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_code" ADD COLUMN "gist_id" text;--> statement-breakpoint
ALTER TABLE "user_code" ADD COLUMN "gist_url" text;