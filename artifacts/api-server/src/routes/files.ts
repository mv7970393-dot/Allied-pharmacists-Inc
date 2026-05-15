import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { db } from "@workspace/db";
import { filesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { objectStorageClient } from "../lib/objectStorage.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TMP_DIR = path.resolve(__dirname, "../../tmp");
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

const BUCKET_ID = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID!;

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, TMP_DIR),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

const router = Router();

router.get("/files", async (_req, res) => {
  try {
    const files = await db.select().from(filesTable).orderBy(filesTable.createdAt);
    res.json(files.map(f => ({
      id: f.id,
      originalName: f.originalName,
      storedName: f.objectPath,
      folderId: f.folderId,
      size: f.size,
      date: f.date,
      type: f.type,
      uploadedBy: f.uploadedBy,
    })));
  } catch (err) {
    res.status(500).json({ error: "Failed to list files" });
  }
});

router.post("/files/upload", upload.single("file"), async (req, res) => {
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

  const objectName = `files/${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;

  try {
    const bucket = objectStorageClient.bucket(BUCKET_ID);
    await bucket.upload(req.file.path, { destination: objectName });
    fs.unlinkSync(req.file.path);

    const id = `upload-${Date.now()}`;
    const entry = {
      id,
      originalName: req.file.originalname,
      objectPath: objectName,
      folderId: folderId || "f1",
      size: req.file.size,
      date: new Date().toLocaleDateString("en-CA"),
      type,
      uploadedBy: uploadedBy || "admin",
    };

    await db.insert(filesTable).values(entry);
    res.status(201).json({ ...entry, storedName: objectName });
  } catch (err) {
    if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: "Upload failed" });
  }
});

router.get("/files/:id/download", async (req, res) => {
  try {
    const [file] = await db.select().from(filesTable).where(eq(filesTable.id, req.params.id));
    if (!file) { res.status(404).json({ error: "File not found" }); return; }

    const bucket = objectStorageClient.bucket(BUCKET_ID);
    const gcsFile = bucket.file(file.objectPath);
    const [exists] = await gcsFile.exists();
    if (!exists) { res.status(404).json({ error: "File not found in storage" }); return; }

    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(file.originalName)}"`);
    gcsFile.createReadStream().pipe(res);
  } catch (err) {
    res.status(500).json({ error: "Download failed" });
  }
});

router.delete("/files/:id", async (req, res) => {
  try {
    const [file] = await db.select().from(filesTable).where(eq(filesTable.id, req.params.id));
    if (!file) { res.status(404).json({ error: "File not found" }); return; }

    const bucket = objectStorageClient.bucket(BUCKET_ID);
    const gcsFile = bucket.file(file.objectPath);
    const [exists] = await gcsFile.exists();
    if (exists) await gcsFile.delete();

    await db.delete(filesTable).where(eq(filesTable.id, req.params.id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

export default router;
