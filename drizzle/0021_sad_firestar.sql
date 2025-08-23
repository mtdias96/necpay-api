CREATE TYPE "public"."role" AS ENUM('OWNER', 'ADMIN', 'MEMBER', 'READONLY');--> statement-breakpoint
CREATE TABLE "store_employees" (
	"account_id" uuid NOT NULL,
	"store_id" uuid NOT NULL,
	"role" "role" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "store_employees_account_id_store_id_pk" PRIMARY KEY("account_id","store_id")
);
--> statement-breakpoint
ALTER TABLE "store_employees" ADD CONSTRAINT "store_employees_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_employees" ADD CONSTRAINT "store_employees_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE no action ON UPDATE no action;