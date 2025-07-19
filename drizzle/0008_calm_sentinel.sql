CREATE TYPE "public"."product_status" AS ENUM('UPLOADING', 'QUEUED', 'PROCESSING', 'SUCCESS', 'FAILED');--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "status" "product_status" NOT NULL;