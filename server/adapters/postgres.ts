import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";
import { forts, fortImages, artifacts, timelineEvents, battleStories, quizQuestions } from "@shared/schema";
import type { Fort, FortImage, Artifact, TimelineEvent, BattleStory, QuizQuestion } from "@shared/schema";
import { eq, ilike, or, sql } from "drizzle-orm";
import type { IStorage } from "../storage";

function createPostgresDb() {
  const connectionString = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;
  if (!connectionString) throw new Error("No database connection string found. Set SUPABASE_DATABASE_URL or DATABASE_URL.");

  const useSSL = !!process.env.SUPABASE_DATABASE_URL;
  const pool = new pg.Pool({
    connectionString,
    ssl: useSSL ? { rejectUnauthorized: false } : false,
  });

  return drizzle(pool, { schema });
}

export class PostgresAdapter implements IStorage {
  private db = createPostgresDb();

  async getForts(search?: string, region?: string): Promise<Fort[]> {
    let query = this.db.select().from(forts).$dynamic();
    if (region) query = query.where(ilike(forts.region, `%${region}%`));
    if (search) query = query.where(or(ilike(forts.name, `%${search}%`), ilike(forts.location, `%${search}%`)));
    return await query;
  }

  async getFort(id: number): Promise<(Fort & { images: FortImage[] }) | undefined> {
    const [fort] = await this.db.select().from(forts).where(eq(forts.id, id));
    if (!fort) return undefined;
    const images = await this.db.select().from(fortImages).where(eq(fortImages.fortId, id));
    return { ...fort, images };
  }

  async getArtifacts(): Promise<Artifact[]> {
    return await this.db.select().from(artifacts);
  }

  async getTimelineEvents(): Promise<TimelineEvent[]> {
    return await this.db.select().from(timelineEvents).orderBy(timelineEvents.year);
  }

  async getBattleStories(): Promise<BattleStory[]> {
    return await this.db.select().from(battleStories);
  }

  async getDailyQuiz(): Promise<QuizQuestion | undefined> {
    const [quiz] = await this.db.select().from(quizQuestions).orderBy(sql`RANDOM()`).limit(1);
    return quiz;
  }
}
