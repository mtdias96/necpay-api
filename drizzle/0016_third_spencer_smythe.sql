ALTER TABLE "orders" DROP CONSTRAINT "orders_operator_id_stores_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_operator_id_accounts_id_fk" FOREIGN KEY ("operator_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;