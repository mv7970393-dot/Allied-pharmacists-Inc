import { Router } from "express";
import { db } from "@workspace/db";
import { foldersTable, filesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { objectStorageClient } from "../lib/objectStorage.js";

const BUCKET_ID = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID!;

const router = Router();

router.get("/folders", async (_req, res) => {
  try {
    const folders = await db.select().from(foldersTable).orderBy(foldersTable.createdAt);
    res.json(folders.map(f => ({ id: f.id, name: f.name })));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch folders" });
  }
});

router.post("/folders", async (req, res) => {
  const { name } = req.body as { name: string };
  if (!name || !name.trim()) {
    res.status(400).json({ error: "Folder name is required" });
    return;
  }
  const folder = {
    id: `cf-${Date.now()}`,
    name: name.trim(),
  };
  try {
    await db.insert(foldersTable).values(folder);
    res.status(201).json(folder);
  } catch (err) {
    res.status(500).json({ error: "Failed to create folder" });
  }
});

router.delete("/folders/:id", async (req, res) => {
  try {
    const [folder] = await db.select().from(foldersTable).where(eq(foldersTable.id, req.params.id));
    if (!folder) { res.status(404).json({ error: "Folder not found" }); return; }

    const folderFiles = await db.select().from(filesTable).where(eq(filesTable.folderId, req.params.id));
    const bucket = objectStorageClient.bucket(BUCKET_ID);
    for (const file of folderFiles) {
      try {
        const gcsFile = bucket.file(file.objectPath);
        const [exists] = await gcsFile.exists();
        if (exists) await gcsFile.delete();
      } catch {}
    }
    await db.delete(filesTable).where(eq(filesTable.folderId, req.params.id));
    await db.delete(foldersTable).where(eq(foldersTable.id, req.params.id));

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete folder" });
  }
});

export default router;
