import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, "../../uploads");
const LOG_FILE = path.join(DATA_DIR, "activity.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface ActivityEntry {
  id: string;
  email: string;
  action: string;
  detail: string;
  time: string;
  timestamp: number;
}

function readLog(): ActivityEntry[] {
  if (!fs.existsSync(LOG_FILE)) return [];
  return JSON.parse(fs.readFileSync(LOG_FILE, "utf-8"));
}

function writeLog(entries: ActivityEntry[]): void {
  fs.writeFileSync(LOG_FILE, JSON.stringify(entries, null, 2));
}

const router = Router();

router.get("/activity", (_req, res) => {
  const log = readLog();
  res.json(log.slice(-200).reverse());
});

router.post("/activity", (req, res) => {
  const { email, action, detail } = req.body as { email: string; action: string; detail?: string };
  if (!email || !action) {
    res.status(400).json({ error: "email and action are required" });
    return;
  }
  const entry: ActivityEntry = {
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    email,
    action,
    detail: detail || "",
    time: new Date().toLocaleString("en-CA", { hour12: false }),
    timestamp: Date.now(),
  };
  const log = readLog();
  log.push(entry);
  writeLog(log);
  res.status(201).json(entry);
});

export default router;
