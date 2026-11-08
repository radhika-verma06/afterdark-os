import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient(): PrismaClient {
  if (process.env.VERCEL) {
    // Vercel's deployment filesystem is read-only. Copy the seeded synthetic
    // demo database into /tmp once per warm function instance.
    const seed = path.join(process.cwd(), "prisma", "demo.db");
    const runtime = "/tmp/afterdark.db";
    try {
      if (!fs.existsSync(runtime) && fs.existsSync(seed)) {
        fs.copyFileSync(seed, runtime);
      }
    } catch {
      /* the API will return its normal "database not ready" response */
    }
    return new PrismaClient({
      datasources: { db: { url: "file:/tmp/afterdark.db" } },
    });
  }
  return new PrismaClient();
}

export const db = globalForPrisma.prisma ?? createClient();
if (process.env.NODE_ENV !== "production" || process.env.VERCEL) {
  globalForPrisma.prisma = db;
}
