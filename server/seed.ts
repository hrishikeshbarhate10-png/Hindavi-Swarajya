import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";
import { fortImages } from "@shared/schema";
import { eq, inArray } from "drizzle-orm";

function createDb() {
  const connectionString = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;
  if (!connectionString) return null;
  const useSSL = !!process.env.SUPABASE_DATABASE_URL;
  const pool = new pg.Pool({ connectionString, ssl: useSSL ? { rejectUnauthorized: false } : false });
  return drizzle(pool, { schema });
}

// First URL of each fort MUST exactly match the fort's main imageUrl column
// so that image[0] === fort.imageUrl after ORDER BY id
const FORT_IMAGES: { fortId: number; url: string }[] = [
  // Raigad Fort (id=1) — imageUrl: photo-1596489370043-424a101b0b5e
  { fortId: 1, url: "https://images.unsplash.com/photo-1596489370043-424a101b0b5e" },
  { fortId: 1, url: "https://images.unsplash.com/photo-1621510444583-02fcebfbb9d8" },
  { fortId: 1, url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b" },
  { fortId: 1, url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4" },
  { fortId: 1, url: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606" },
  // Sinhagad (id=2) — imageUrl: photo-1549495632-15d9cc0ebf28
  { fortId: 2, url: "https://images.unsplash.com/photo-1549495632-15d9cc0ebf28" },
  { fortId: 2, url: "https://images.unsplash.com/photo-1508009603885-50cf7c579365" },
  { fortId: 2, url: "https://images.unsplash.com/photo-1434394354979-a235cd36269d" },
  { fortId: 2, url: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f" },
  { fortId: 2, url: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9" },
  // Pratapgad (id=3) — imageUrl: photo-1600100397608-f010f41cb822
  { fortId: 3, url: "https://images.unsplash.com/photo-1600100397608-f010f41cb822" },
  { fortId: 3, url: "https://images.unsplash.com/photo-1598091383021-15ddea10925d" },
  { fortId: 3, url: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5" },
  { fortId: 3, url: "https://images.unsplash.com/photo-1592285896110-8d88b5b3a5d8" },
  { fortId: 3, url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96" },
];

const TARGET_FORT_IDS = [1, 2, 3];

// Version bump this string to force a re-seed on next startup
const SEED_VERSION = "v3";
const SEED_MARKER_URL = `__seed_version__:${SEED_VERSION}`;

export async function seedFortImages() {
  const db = createDb();
  if (!db) return;

  try {
    // Check for current version marker (scoped to fort 1)
    const marker = await db
      .select()
      .from(fortImages)
      .where(eq(fortImages.url, SEED_MARKER_URL))
      .limit(1);

    if (marker.length > 0) return; // Already seeded this version

    // Delete only the rows belonging to the three target forts — no collateral damage
    await db.delete(fortImages).where(inArray(fortImages.fortId, TARGET_FORT_IDS));

    // Insert 5 images per fort plus a scoped version marker on fort 1
    const toInsert = [
      ...FORT_IMAGES,
      { fortId: 1, url: SEED_MARKER_URL },
    ];
    await db.insert(fortImages).values(toInsert);
    console.log(`[seed] Fort images seeded (${SEED_VERSION}): ${FORT_IMAGES.length} images across 3 forts`);
  } catch (err) {
    console.error("[seed] Fort image seeding failed:", err);
  }
}
