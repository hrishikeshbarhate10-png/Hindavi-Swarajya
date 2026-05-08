CREATE TABLE "artifacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"historical_usage" text NOT NULL,
	"fort_id" integer,
	"image_url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "battle_stories" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"content" text NOT NULL,
	"image_url" text
);
--> statement-breakpoint
CREATE TABLE "fort_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"fort_id" integer NOT NULL,
	"url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "forts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"location" text NOT NULL,
	"region" text NOT NULL,
	"built_year" integer,
	"strategic_importance" text NOT NULL,
	"description" text NOT NULL,
	"image_url" text NOT NULL,
	"latitude" real,
	"longitude" real,
	"difficulty" text,
	"best_time" text
);
--> statement-breakpoint
CREATE TABLE "quiz_questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"options" text[] NOT NULL,
	"correct_answer" text NOT NULL,
	"explanation" text
);
--> statement-breakpoint
CREATE TABLE "timeline_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"year" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"image_url" text
);
