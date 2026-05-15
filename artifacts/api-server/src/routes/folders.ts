import { Router } from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

interface FileMeta {
  id: string;
  originalName: string;
  storedName: string;
  folderId: string;
  size: number;
  date: string;
  type: string;
  uploadedBy: string;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.resolve(__dirname, "../../uploads");
const FOLDERS_FILE = path.join(UPLOADS_DIR, "folders.json");

interface CustomFolder {
  id: string;
  name: string;
  createdAt: string;
}

function readFolders(): CustomFolder[] {
  if (!fs.existsSync(FOLDERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(FOLDERS_FILE, "utf-8"));
}

function writeFolders(folders: CustomFolder[]): void {
  fs.writeFileSync(FOLDERS_FILE, JSON.stringify(folders, null, 2));
}

const router = Router();

router.get("/folders", (_req, res) => {
  res.json(readFolders());
});

router.post("/folders", (req, res) => {
  const { name } = req.body as { name: string };
  if (!name || !name.trim()) {
    res.status(400).json({ error: "Folder name is required" });
    return;
  }
  const folder: CustomFolder = {
    id: `cf-${Date.now()}`,
    name: name.trim(),
    createdAt: new Date().toISOString(),
  };
  const folders = readFolders();
  folders.push(folder);
  writeFolders(folders);
  res.status(201).json(folder);
});

router.delete("/folders/:id", (req, res) => {
  const folders = readFolders();
  const idx = folders.findIndex((f) => f.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: "Folder not found" });
    return;
  }
  folders.splice(idx, 1);
  writeFolders(folders);

  const META_FILE = path.join(UPLOADS_DIR, "meta.json");
  if (fs.existsSync(META_FILE)) {
    const meta: FileMeta[] = JSON.parse(fs.readFileSync(META_FILE, "utf-8"));
    const remaining = meta.filter((f) => {
      if (f.folderId === req.params.id) {
        const filePath = path.join(UPLOADS_DIR, f.storedName);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        return false;
      }
      return true;
    });
    fs.writeFileSync(META_FILE, JSON.stringify(remaining, null, 2));
  }

  res.json({ success: true });
});

export default router;
