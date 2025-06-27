ALTER TABLE "categories" DROP CONSTRAINT "categories_name_unique";--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "store_id" uuid NOT NULL;--> statement-breakpoint
CREATE INDEX "categories_store_id_name_idx" ON "categories" USING btree ("store_id","name");--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_store_id_name_unique" UNIQUE("store_id","name");