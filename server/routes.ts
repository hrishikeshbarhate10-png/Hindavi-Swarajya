import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";

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

  app.get(api.stories.list.path, async (req, res) => {
    const results = await storage.getBattleStories();
    res.json(results);
  });

  app.get(api.quiz.daily.path, async (req, res) => {
    const quiz = await storage.getDailyQuiz();
    if (!quiz) return res.status(404).json({ message: "No quiz found" });
    res.json(quiz);
  });

  return httpServer;
}
