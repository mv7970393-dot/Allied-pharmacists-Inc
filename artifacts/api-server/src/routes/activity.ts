import { Router } from "express";
import { db } from "@workspace/db";
import { activityTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router = Router();

router.get("/activity", async (_req, res) => {
  try {
    const entries = await db.select().from(activityTable).orderBy(desc(activityTable.createdAt)).limit(200);
    res.json(entries.map(e => ({
      id: e.id,
      email: e.email,
      action: e.action,
      detail: e.detail,
      time: e.time,
      timestamp: Number(e.timestamp),
    })));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch activity" });
  }
});

router.post("/activity", async (req, res) => {
  const { email, action, detail } = req.body as { email: string; action: string; detail?: string };
  if (!email || !action) {
    res.status(400).json({ error: "email and action are required" });
    return;
  }
  const now = Date.now();
  const entry = {
    id: `act-${now}-${Math.random().toString(36).slice(2)}`,
    email,
    action,
    detail: detail || "",
    time: new Date().toLocaleString("en-CA", { hour12: false }),
    timestamp: String(now),
  };
  try {
    await db.insert(activityTable).values(entry);
    res.status(201).json({ ...entry, timestamp: now });
  } catch (err) {
    res.status(500).json({ error: "Failed to log activity" });
  }
});

export default router;
