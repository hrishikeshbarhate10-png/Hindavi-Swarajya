import { db } from "./db";
import { forts, fortImages, artifacts, timelineEvents, type Fort, type FortImage, type Artifact, type TimelineEvent } from "@shared/schema";
import { eq, ilike, or } from "drizzle-orm";

export interface IStorage {
  getForts(search?: string, region?: string): Promise<Fort[]>;
  getFort(id: number): Promise<(Fort & { images: FortImage[] }) | undefined>;
  getArtifacts(): Promise<Artifact[]>;
  getTimelineEvents(): Promise<TimelineEvent[]>;
}

export class DatabaseStorage implements IStorage {
  async getForts(search?: string, region?: string): Promise<Fort[]> {
    let query = db.select().from(forts).$dynamic();
    if (region) {
      query = query.where(ilike(forts.region, `%${region}%`));
    }
    if (search) {
      query = query.where(or(ilike(forts.name, `%${search}%`), ilike(forts.location, `%${search}%`)));
    }
    return await query;
  }

  async getFort(id: number): Promise<(Fort & { images: FortImage[] }) | undefined> {
    const [fort] = await db.select().from(forts).where(eq(forts.id, id));
    if (!fort) return undefined;
    const images = await db.select().from(fortImages).where(eq(fortImages.fortId, id));
    return { ...fort, images };
  }

  async getArtifacts(): Promise<Artifact[]> {
    return await db.select().from(artifacts);
  }

  async getTimelineEvents(): Promise<TimelineEvent[]> {
    return await db.select().from(timelineEvents).orderBy(timelineEvents.year);
  }
}

export const storage = new DatabaseStorage();
