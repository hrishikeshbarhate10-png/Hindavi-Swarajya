import type { Fort, FortImage, Artifact, TimelineEvent, BattleStory, QuizQuestion } from "@shared/schema";
import { PostgresAdapter } from "./adapters/postgres";

// ─── Storage Interface ────────────────────────────────────────────────────────
// This is the single contract all database adapters must implement.
// To add a new database (Oracle, MySQL, etc.):
//   1. Create server/adapters/your-db.ts implementing IStorage
//   2. Import it below and add a case in the factory switch
//   3. Set DB_ADAPTER=your-db in your environment variables

export interface IStorage {
  getForts(search?: string, region?: string): Promise<Fort[]>;
  getFort(id: number): Promise<(Fort & { images: FortImage[] }) | undefined>;
  getArtifacts(): Promise<Artifact[]>;
  getArtifact(id: number): Promise<Artifact | undefined>;
  getTimelineEvents(): Promise<TimelineEvent[]>;
  getBattleStories(): Promise<BattleStory[]>;
  getBattleStory(id: number): Promise<BattleStory | undefined>;
  getDailyQuiz(): Promise<QuizQuestion | undefined>;
}

// ─── Adapter Factory ──────────────────────────────────────────────────────────
// Set DB_ADAPTER env var to switch databases:
//   DB_ADAPTER=postgres  → PostgreSQL / Supabase (default)
//   DB_ADAPTER=oracle    → add server/adapters/oracle.ts, import & register below
//   DB_ADAPTER=mysql     → add server/adapters/mysql.ts, import & register below

function createStorage(): IStorage {
  const adapter = (process.env.DB_ADAPTER || "postgres").toLowerCase();

  switch (adapter) {
    case "postgres":
    case "supabase":
      return new PostgresAdapter();

    // To add Oracle:
    // case "oracle":
    //   return new OracleAdapter();   // import OracleAdapter from "./adapters/oracle"

    // To add MySQL:
    // case "mysql":
    //   return new MySQLAdapter();    // import MySQLAdapter from "./adapters/mysql"

    default:
      throw new Error(`Unknown DB_ADAPTER: "${adapter}". Supported: postgres, supabase`);
  }
}

export const storage: IStorage = createStorage();
