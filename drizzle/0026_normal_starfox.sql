DROP TABLE "employees" CASCADE;--> statement-breakpoint
ALTER TABLE "store_employees" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."role";--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('ADMIN', 'MEMBER', 'READONLY');--> statement-breakpoint
ALTER TABLE "store_employees" ALTER COLUMN "role" SET DATA TYPE "public"."role" USING "role"::"public"."role";