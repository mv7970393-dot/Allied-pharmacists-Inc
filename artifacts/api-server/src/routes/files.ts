import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.resolve(__dirname, "../../uploads");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const META_FILE = path.join(UPLOADS_DIR, "meta.json");

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

function readMeta(): FileMeta[] {
  if (!fs.existsSync(META_FILE)) return [];
  return JSON.parse(fs.readFileSync(META_FILE, "utf-8"));
}

function writeMeta(meta: FileMeta[]): void {
  fs.writeFileSync(META_FILE, JSON.stringify(meta, null, 2));
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

const router = Router();

router.get("/files", (_req, res) => {
  const meta = readMeta();
  res.json(meta);
});

router.post("/files/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  const { folderId, uploadedBy } = req.body as { folderId: string; uploadedBy: string };
  const ext = path.extname(req.file.originalname).toLowerCase();
  let type = "doc";
  if ([".pdf"].includes(ext)) type = "pdf";
  else if ([".png", ".jpg", ".jpeg", ".gif", ".webp"].includes(ext)) type = "img";
  else if ([".xls", ".xlsx"].includes(ext)) type = "xls";
  else if ([".ppt", ".pptx"].includes(ext)) type = "ppt";

  const entry: FileMeta = {
    id: `upload-${Date.now()}`,
    originalName: req.file.originalname,
    storedName: req.file.filename,
    folderId: folderId || "f1",
    size: req.file.size,
    date: new Date().toLocaleDateString("en-CA"),
    type,
    uploadedBy: uploadedBy || "admin",
  };

  const meta = readMeta();
  meta.push(entry);
  writeMeta(meta);

  res.status(201).json(entry);
});

router.get("/files/:id/download", (req, res) => {
  const meta = readMeta();
  const entry = meta.find((m) => m.id === req.params.id);
  if (!entry) {
    res.status(404).json({ error: "File not found" });
    return;
  }
  const filePath = path.join(UPLOADS_DIR, entry.storedName);
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "File not found on disk" });
    return;
  }
  res.download(filePath, entry.originalName);
});

router.delete("/files/:id", (req, res) => {
  const meta = readMeta();
  const idx = meta.findIndex((m) => m.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: "File not found" });
    return;
  }
  const entry = meta[idx];
  const filePath = path.join(UPLOADS_DIR, entry.storedName);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  meta.splice(idx, 1);
  writeMeta(meta);
  res.json({ success: true });
});

export default router;
