CREATE TABLE "notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	"url" varchar(32) NOT NULL,
	CONSTRAINT "notes_url_unique" UNIQUE("url")
);
