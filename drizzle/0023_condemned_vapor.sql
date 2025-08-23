CREATE TYPE "public"."stock_movement_type" AS ENUM('ENTRY', 'EXIT');--> statement-breakpoint
ALTER TABLE "stock_movements" ALTER COLUMN "type" SET NOT NULL;