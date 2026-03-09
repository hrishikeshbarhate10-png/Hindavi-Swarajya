import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { db } from "./db";
import { forts, fortImages, artifacts, timelineEvents } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.forts.list.path, async (req, res) => {
    const search = req.query.search as string | undefined;
    const region = req.query.region as string | undefined;
    const results = await storage.getForts(search, region);
    res.json(results);
  });

  app.get(api.forts.get.path, async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(404).json({ message: "Invalid ID" });
    }
    const fort = await storage.getFort(id);
    if (!fort) {
      return res.status(404).json({ message: "Fort not found" });
    }
    res.json(fort);
  });

  app.get(api.artifacts.list.path, async (req, res) => {
    const results = await storage.getArtifacts();
    res.json(results);
  });

  app.get(api.timeline.list.path, async (req, res) => {
    const results = await storage.getTimelineEvents();
    res.json(results);
  });

  // Seed DB on start
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingForts = await storage.getForts();
  if (existingForts.length === 0) {
    const [raigad] = await db.insert(forts).values({
      name: "Raigad Fort",
      location: "Mahad, Maharashtra",
      region: "Maharashtra",
      builtYear: 1030,
      strategicImportance: "Capital of Maratha Empire",
      description: "Raigad is a hill fort situated in Mahad, Raigad district of Maharashtra. Chhatrapati Shivaji Maharaj built this fort and made it his capital in 1674 when he was crowned King of a Maratha Kingdom which later developed into the Maratha Empire.",
      imageUrl: "https://images.unsplash.com/photo-1596489370043-424a101b0b5e",
      latitude: 18.2327,
      longitude: 73.4447,
      difficulty: "Medium",
      bestTime: "October - March",
    }).returning();

    await db.insert(fortImages).values([
      { fortId: raigad.id, url: "https://images.unsplash.com/photo-1596489370043-424a101b0b5e" },
      { fortId: raigad.id, url: "https://images.unsplash.com/photo-1621510444583-02fcebfbb9d8" }
    ]);

    const [sinhagad] = await db.insert(forts).values({
      name: "Sinhagad",
      location: "Pune, Maharashtra",
      region: "Maharashtra",
      builtYear: 1300,
      strategicImportance: "Key to controlling Pune region",
      description: "Sinhagad is a hill fortress located at around 30 km southwest of the city of Pune. Some of the information available at this fort suggests that the fort could have been built two thousand years ago. The fort was previously known as Kondhana.",
      imageUrl: "https://images.unsplash.com/photo-1549495632-15d9cc0ebf28",
      latitude: 18.3663,
      longitude: 73.7559,
      difficulty: "Easy to Medium",
      bestTime: "Monsoon & Winter",
    }).returning();

    await db.insert(fortImages).values([
      { fortId: sinhagad.id, url: "https://images.unsplash.com/photo-1549495632-15d9cc0ebf28" }
    ]);
    
    const [pratapgad] = await db.insert(forts).values({
      name: "Pratapgad",
      location: "Satara, Maharashtra",
      region: "Maharashtra",
      builtYear: 1656,
      strategicImportance: "Guarding the Par pass",
      description: "Pratapgad is a large hill fort located in Satara district. It is famous as the site of the Battle of Pratapgad between Shivaji and Afzal Khan.",
      imageUrl: "https://images.unsplash.com/photo-1600100397608-f010f41cb822",
      latitude: 17.9254,
      longitude: 73.5786,
      difficulty: "Medium",
      bestTime: "October - February",
    }).returning();
    
    await db.insert(fortImages).values([
      { fortId: pratapgad.id, url: "https://images.unsplash.com/photo-1600100397608-f010f41cb822" }
    ]);

    await db.insert(artifacts).values([
      { name: "Bhavani Talwar", historicalUsage: "Sword of Shivaji Maharaj", fortId: raigad.id, imageUrl: "https://images.unsplash.com/photo-1590497576472-882ab2752101" },
      { name: "Wagh Nakh", historicalUsage: "Tiger Claws used in the battle of Pratapgad", fortId: pratapgad.id, imageUrl: "https://images.unsplash.com/photo-1582134515582-747d8b560867" },
      { name: "Shivrai Coin", historicalUsage: "Currency during the Maratha Empire", fortId: undefined, imageUrl: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833" },
    ]);

    await db.insert(timelineEvents).values([
      { year: 1630, title: "Birth of Shivaji Maharaj", description: "Shivaji was born in the hill-fort of Shivneri, near the city of Junnar.", imageUrl: null },
      { year: 1645, title: "Capture of Torna Fort", description: "Shivaji took control of Torna Fort at the young age of 15.", imageUrl: null },
      { year: 1656, title: "Capture of Raigad", description: "Shivaji captured the fort of Javli and later built Raigad.", imageUrl: null },
      { year: 1659, title: "Battle of Pratapgad", description: "Shivaji Maharaj defeated Afzal Khan at Pratapgad.", imageUrl: null },
      { year: 1674, title: "Coronation at Raigad", description: "Shivaji Maharaj was crowned as the Chhatrapati (Emperor) of the Maratha Empire.", imageUrl: "https://images.unsplash.com/photo-1596489370043-424a101b0b5e" },
      { year: 1680, title: "Legacy of the Maratha Empire", description: "Chhatrapati Shivaji Maharaj passed away, but his legacy continued to expand the empire.", imageUrl: null },
    ]);
  }
}
