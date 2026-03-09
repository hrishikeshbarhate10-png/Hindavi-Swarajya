import { pgTable, text, serial, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const forts = pgTable("forts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  region: text("region").notNull(),
  builtYear: integer("built_year"),
  strategicImportance: text("strategic_importance").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  latitude: real("latitude"),
  longitude: real("longitude"),
  difficulty: text("difficulty"),
  bestTime: text("best_time"),
});

export const fortImages = pgTable("fort_images", {
  id: serial("id").primaryKey(),
  fortId: integer("fort_id").notNull(),
  url: text("url").notNull(),
});

export const artifacts = pgTable("artifacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  historicalUsage: text("historical_usage").notNull(),
  fortId: integer("fort_id"), // related to a fort (optional)
  imageUrl: text("image_url").notNull(),
});

export const timelineEvents = pgTable("timeline_events", {
  id: serial("id").primaryKey(),
  year: integer("year").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
});

// === BASE SCHEMAS ===
export const insertFortSchema = createInsertSchema(forts).omit({ id: true });
export const insertFortImageSchema = createInsertSchema(fortImages).omit({ id: true });
export const insertArtifactSchema = createInsertSchema(artifacts).omit({ id: true });
export const insertTimelineEventSchema = createInsertSchema(timelineEvents).omit({ id: true });

// === EXPLICIT API CONTRACT TYPES ===

export type Fort = typeof forts.$inferSelect;
export type InsertFort = z.infer<typeof insertFortSchema>;

export type FortImage = typeof fortImages.$inferSelect;
export type InsertFortImage = z.infer<typeof insertFortImageSchema>;

export type Artifact = typeof artifacts.$inferSelect;
export type InsertArtifact = z.infer<typeof insertArtifactSchema>;

export type TimelineEvent = typeof timelineEvents.$inferSelect;
export type InsertTimelineEvent = z.infer<typeof insertTimelineEventSchema>;

export type FortResponse = Fort & { images: FortImage[] };
export type FortsListResponse = Fort[];
export type ArtifactsListResponse = Artifact[];
export type TimelineListResponse = TimelineEvent[];
