import { useState, useEffect, useRef } from "react";

const BRAND = "#1b4f72";
const BRAND_MID = "#2471a3";
const BRAND_LIGHT = "#d6e8f7";
const BRAND_XLIGHT = "#eaf4fc";
const GREEN = "#335525";
const ADMIN_EMAIL = "sally@alliedpharmacists.ca";
const API_BASE = "/api";

const INITIAL_FOLDERS = [
  { id: "f1", name: "API & BD Showpad Resources" },
  { id: "f2", name: "API & MAPFLOW Minor Ailments Posters" },
  { id: "f3", name: "API & Mapflow Webinar Recording" },
  { id: "f4", name: "API & Payment Goat Deal" },
  { id: "f5", name: "API Benefits" },
  { id: "f6", name: "API Downloadable Forms" },
  { id: "f7", name: "API Flyer Program" },
  { id: "f8", name: "API Pharmacy Compliance & Inspection Toolkit" },
  { id: "f9", name: "API's Advocacy for Independent Pharmacy" },
  { id: "f10", name: "Events Attended by API" },
  { id: "f11", name: "Store Planograms" },
  { id: "f12", name: "Monthly Newsletters" },
  { id: "f13", name: "App" },
];

interface Doc {
  id: string;
  name: string;
  size: string;
  date: string;
  type: string;
  folderId?: string;
  downloadUrl?: string;
}

type DocsMap = Record<string, Doc[]>;

const STATIC_DOCS: DocsMap = {
  f1: [], f2: [], f3: [], f4: [], f5: [], f6: [],
  f7: [], f8: [], f9: [], f10: [], f11: [], f12: [],
};

interface Settings {
  theme: "light" | "dark";
  fontSize: "small" | "medium" | "large";
}

interface Activity {
  id: string;
  email: string;
  action: string;
  detail: string;
  time: string;
  timestamp: number;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function GearIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

interface Folder { id: string; name: string; }

function ControlPanel({ onClose, isAdmin, settings, onSettingsChange, loggedInUser, allFolders, onFoldersChange }: {
  onClose: () => void;
  isAdmin: boolean;
  settings: Settings;
  onSettingsChange: (s: Settings) => void;
  loggedInUser: string;
  allFolders: Folder[];
  onFoldersChange: () => void;
}) {
  const [tab, setTab] = useState<"settings" | "activity" | "upload" | "files" | "folders">("settings");
  const [uploadFolder, setUploadFolder] = useState("f1");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [serverFiles, setServerFiles] = useState<(Activity & { originalName?: string; folderId?: string; size?: number })[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [folderMsg, setFolderMsg] = useState("");
  const [addingFolder, setAddingFolder] = useState(false);
  const [customFolderIds, setCustomFolderIds] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`${API_BASE}/folders`).then(r => r.json()).then((data: Folder[]) => {
      setCustomFolderIds(data.map(f => f.id));
    }).catch(() => {});
  }, [allFolders]);

  const fs = settings.fontSize === "small" ? "12px" : settings.fontSize === "large" ? "16px" : "14px";

  useEffect(() => {
    if (tab === "activity") fetchActivity();
    if (tab === "files") fetchServerFiles();
  }, [tab]);

  const fetchActivity = async () => {
    setLoadingActivity(true);
    try {
      const res = await fetch(`${API_BASE}/activity`);
      if (res.ok) setActivities(await res.json());
    } catch {}
    setLoadingActivity(false);
  };

  const fetchServerFiles = async () => {
    try {
      const res = await fetch(`${API_BASE}/files`);
      if (res.ok) setServerFiles(await res.json());
    } catch {}
  };

  const handleUpload = async () => {
    if (!uploadFile) { setUploadMsg("Please select a file."); return; }
    setUploading(true);
    setUploadMsg("");
    const form = new FormData();
    form.append("file", uploadFile);
    form.append("folderId", uploadFolder);
    form.append("uploadedBy", loggedInUser);
    try {
      const res = await fetch(`${API_BASE}/files/upload`, { method: "POST", body: form });
      if (res.ok) {
        setUploadMsg("✓ File uploaded successfully!");
        setUploadFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        await fetch(`${API_BASE}/activity`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: loggedInUser, action: "Uploaded file", detail: uploadFile.name }),
        });
      } else {
        setUploadMsg("Upload failed. Try again.");
      }
    } catch {
      setUploadMsg("Upload failed. Check your connection.");
    }
    setUploading(false);
  };

  const handleDeleteFile = async (id: string) => {
    if (!confirm("Delete this file?")) return;
    await fetch(`${API_BASE}/files/${id}`, { method: "DELETE" });
    fetchServerFiles();
  };

  const handleAddFolder = async () => {
    if (!newFolderName.trim()) { setFolderMsg("Please enter a folder name."); return; }
    setAddingFolder(true);
    setFolderMsg("");
    try {
      const res = await fetch(`${API_BASE}/folders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newFolderName.trim() }),
      });
      if (res.ok) {
        setFolderMsg("✓ Folder added successfully!");
        setNewFolderName("");
        onFoldersChange();
      } else {
        setFolderMsg("Failed to add folder.");
      }
    } catch { setFolderMsg("Error. Check your connection."); }
    setAddingFolder(false);
  };

  const handleDeleteFolder = async (id: string, name: string) => {
    if (!confirm(`Delete folder "${name}"? Files in it will remain but won't be shown.`)) return;
    await fetch(`${API_BASE}/folders/${id}`, { method: "DELETE" });
    onFoldersChange();
  };

  const tabBtn = (key: typeof tab, label: string) => (
    <button
      onClick={() => setTab(key)}
      style={{ padding: "8px 14px", borderRadius: 8, border: "none", background: tab === key ? BRAND : "transparent", color: tab === key ? "white" : "var(--text-primary)", fontWeight: 600, fontSize: fs, cursor: "pointer", whiteSpace: "nowrap" }}
    >{label}</button>
  );

  return (
    <div onClick={onClose} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--bg-card)", borderRadius: 16, padding: 28, width: isAdmin ? 720 : 420, maxHeight: "88vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ color: BRAND }}><GearIcon /></div>
            <div style={{ fontSize: 18, fontWeight: 800, color: BRAND }}>Control Panel</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, color: "#8a9db0", cursor: "pointer" }}>✕</button>
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 20, borderBottom: "2px solid var(--border-color)", paddingBottom: 10, overflowX: "auto" }}>
          {tabBtn("settings", "⚙️ Display")}
          {isAdmin && tabBtn("activity", "📊 Activity Log")}
          {isAdmin && tabBtn("upload", "📤 Upload File")}
          {isAdmin && tabBtn("files", "📁 Manage Files")}
          {isAdmin && tabBtn("folders", "🗂️ Folders")}
        </div>

        {tab === "settings" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: BRAND, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 10 }}>Theme</label>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => onSettingsChange({ ...settings, theme: "light" })} style={{ flex: 1, padding: "12px", borderRadius: 10, border: `2px solid ${settings.theme === "light" ? BRAND : "var(--border-color)"}`, background: settings.theme === "light" ? BRAND_XLIGHT : "transparent", color: settings.theme === "light" ? BRAND : "var(--text-primary)", fontWeight: 700, cursor: "pointer", fontSize: fs }}>☀️ Light Mode</button>
                <button onClick={() => onSettingsChange({ ...settings, theme: "dark" })} style={{ flex: 1, padding: "12px", borderRadius: 10, border: `2px solid ${settings.theme === "dark" ? BRAND : "var(--border-color)"}`, background: settings.theme === "dark" ? BRAND : "transparent", color: settings.theme === "dark" ? "white" : "var(--text-primary)", fontWeight: 700, cursor: "pointer", fontSize: fs }}>🌙 Dark Mode</button>
              </div>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: BRAND, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 10 }}>Text Size</label>
              <div style={{ display: "flex", gap: 8 }}>
                {(["small", "medium", "large"] as const).map((sz) => (
                  <button key={sz} onClick={() => onSettingsChange({ ...settings, fontSize: sz })} style={{ flex: 1, padding: "12px", borderRadius: 10, border: `2px solid ${settings.fontSize === sz ? BRAND : "var(--border-color)"}`, background: settings.fontSize === sz ? BRAND_XLIGHT : "transparent", color: settings.fontSize === sz ? BRAND : "var(--text-primary)", fontWeight: 700, cursor: "pointer", fontSize: sz === "small" ? "12px" : sz === "large" ? "16px" : "14px", textTransform: "capitalize" }}>{sz === "small" ? "A" : sz === "medium" ? "A" : "A"}<span style={{ fontSize: 10, display: "block", marginTop: 2 }}>{sz}</span></button>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "activity" && isAdmin && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ fontSize: 14, color: BRAND, fontWeight: 700 }}>Member Activity Log</h3>
              <button onClick={fetchActivity} style={{ padding: "5px 12px", background: BRAND_XLIGHT, border: `1px solid ${BRAND_LIGHT}`, color: BRAND, borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>↺ Refresh</button>
            </div>
            {loadingActivity ? (
              <div style={{ textAlign: "center", padding: 40, color: "#8a9db0" }}>Loading…</div>
            ) : activities.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: "#8a9db0", fontSize: fs }}>No activity yet.</div>
            ) : (
              <div style={{ maxHeight: 420, overflow: "auto" }}>
                {activities.map((a) => (
                  <div key={a.id} style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-color)", borderRadius: 6, marginBottom: 4, background: "var(--bg-main)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                      <div>
                        <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: fs }}>{a.action}</div>
                        {a.detail && <div style={{ fontSize: 12, color: "#8a9db0", marginTop: 2 }}>📄 {a.detail}</div>}
                        <div style={{ fontSize: 11, color: BRAND_MID, marginTop: 4, fontWeight: 600 }}>👤 {a.email}</div>
                      </div>
                      <div style={{ fontSize: 11, color: "#8a9db0", whiteSpace: "nowrap", flexShrink: 0 }}>{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "folders" && isAdmin && (
          <div>
            <h3 style={{ marginBottom: 16, fontSize: 14, color: BRAND, fontWeight: 700 }}>Manage Folders</h3>
            <div style={{ marginBottom: 20, padding: 16, background: "var(--bg-main)", borderRadius: 10, border: "1px solid var(--border-color)" }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: BRAND, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 8 }}>Add New Folder</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={newFolderName}
                  onChange={(e) => { setNewFolderName(e.target.value); setFolderMsg(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleAddFolder()}
                  placeholder="Folder name…"
                  style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1.5px solid var(--border-color)", fontSize: fs, background: "var(--bg-card)", color: "var(--text-primary)", outline: "none" }}
                />
                <button onClick={handleAddFolder} disabled={addingFolder} style={{ padding: "10px 18px", background: BRAND, color: "white", border: "none", borderRadius: 8, fontWeight: 700, fontSize: fs, cursor: addingFolder ? "not-allowed" : "pointer" }}>
                  {addingFolder ? "…" : "+ Add"}
                </button>
              </div>
              {folderMsg && (
                <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 6, background: folderMsg.startsWith("✓") ? "#e8f5e9" : "#fde8e8", color: folderMsg.startsWith("✓") ? GREEN : "#c0392b", fontWeight: 600, fontSize: 12 }}>
                  {folderMsg}
                </div>
              )}
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#8a9db0", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>All Folders ({allFolders.length})</div>
            <div style={{ maxHeight: 340, overflow: "auto" }}>
              {allFolders.map((f) => (
                <div key={f.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderBottom: "1px solid var(--border-color)", borderRadius: 6, marginBottom: 2, background: "var(--bg-main)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14 }}>📁</span>
                    <span style={{ fontSize: fs, color: "var(--text-primary)", fontWeight: 500 }}>{f.name}</span>
                  </div>
                  {customFolderIds.includes(f.id) ? (
                    <button onClick={() => handleDeleteFolder(f.id, f.name)} style={{ padding: "5px 10px", background: "#fde8e8", border: "1px solid #f5c6c6", color: "#c0392b", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>🗑 Delete</button>
                  ) : (
                    <span style={{ fontSize: 11, color: "#8a9db0" }}>Default</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "upload" && isAdmin && (
          <div>
            <h3 style={{ marginBottom: 16, fontSize: 14, color: BRAND, fontWeight: 700 }}>Upload File to Portal</h3>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: BRAND, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 6 }}>Target Folder</label>
              <select value={uploadFolder} onChange={(e) => setUploadFolder(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid var(--border-color)", fontSize: fs, background: "var(--bg-card)", color: "var(--text-primary)" }}>
                {allFolders.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: BRAND, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 6 }}>Select File</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{ border: `2px dashed ${uploadFile ? BRAND : "var(--border-color)"}`, borderRadius: 10, padding: "24px", textAlign: "center", cursor: "pointer", background: uploadFile ? BRAND_XLIGHT : "var(--bg-main)", transition: "all 0.2s" }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>📁</div>
                <div style={{ fontWeight: 600, color: uploadFile ? BRAND : "var(--text-secondary)", fontSize: fs }}>
                  {uploadFile ? uploadFile.name : "Click to choose a file"}
                </div>
                {uploadFile && <div style={{ fontSize: 12, color: "#8a9db0", marginTop: 4 }}>{formatBytes(uploadFile.size)}</div>}
                <div style={{ fontSize: 11, color: "#8a9db0", marginTop: 6 }}>PDF, images, documents — up to 50 MB</div>
              </div>
              <input ref={fileInputRef} type="file" style={{ display: "none" }} onChange={(e) => { setUploadFile(e.target.files?.[0] || null); setUploadMsg(""); }} />
            </div>
            {uploadMsg && (
              <div style={{ marginBottom: 12, padding: "10px 14px", borderRadius: 8, background: uploadMsg.startsWith("✓") ? "#e8f5e9" : "#fde8e8", color: uploadMsg.startsWith("✓") ? GREEN : "#c0392b", fontWeight: 600, fontSize: fs }}>
                {uploadMsg}
              </div>
            )}
            <button onClick={handleUpload} disabled={uploading || !uploadFile} style={{ padding: "12px 24px", background: uploading || !uploadFile ? "#aac4d8" : BRAND, color: "white", border: "none", borderRadius: 8, fontWeight: 700, fontSize: fs, cursor: uploading || !uploadFile ? "not-allowed" : "pointer", width: "100%" }}>
              {uploading ? "Uploading…" : "✓ Upload File to Portal"}
            </button>
          </div>
        )}

        {tab === "files" && isAdmin && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ fontSize: 14, color: BRAND, fontWeight: 700 }}>Uploaded Files ({serverFiles.length})</h3>
              <button onClick={fetchServerFiles} style={{ padding: "5px 12px", background: BRAND_XLIGHT, border: `1px solid ${BRAND_LIGHT}`, color: BRAND, borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>↺ Refresh</button>
            </div>
            {serverFiles.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: "#8a9db0", fontSize: fs }}>No files uploaded yet. Use the Upload tab to add files.</div>
            ) : (
              <div style={{ maxHeight: 420, overflow: "auto" }}>
                {serverFiles.map((f: any) => {
                  const folder = allFolders.find((fl) => fl.id === f.folderId);
                  return (
                    <div key={f.id} style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: fs, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.originalName}</div>
                        <div style={{ fontSize: 11, color: "#8a9db0", marginTop: 2 }}>{folder?.name || f.folderId} • {formatBytes(f.size || 0)} • {f.date}</div>
                        <div style={{ fontSize: 11, color: BRAND_MID, marginTop: 1 }}>by {f.uploadedBy}</div>
                      </div>
                      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                        <a href={`${API_BASE}/files/${f.id}/download`} download style={{ padding: "6px 12px", background: BRAND_XLIGHT, border: `1px solid ${BRAND_LIGHT}`, color: BRAND, borderRadius: 6, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>↓</a>
                        <button onClick={() => handleDeleteFile(f.id)} style={{ padding: "6px 12px", background: "#fde8e8", border: "1px solid #f5c6c6", color: "#c0392b", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>🗑</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function DocTable({ docs, onDownload, fs }: { docs: Doc[]; onDownload: (doc: Doc) => void; fs: string }) {
  const types: Record<string, { bg: string; color: string; label: string }> = {
    pdf: { bg: "#fde8e8", color: "#c0392b", label: "PDF" },
    img: { bg: "#e8f4fd", color: "#1a6fa8", label: "IMG" },
    doc: { bg: "#dbeafe", color: "#1d4ed8", label: "DOC" },
    xls: { bg: "#dcfce7", color: "#15803d", label: "XLS" },
    ppt: { bg: "#fef3c7", color: "#b45309", label: "PPT" },
  };

  return (
    <div style={{ background: "var(--bg-card)", borderRadius: 10, border: "1px solid var(--border-color)", overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", padding: "10px 18px", background: "#f0f7fd", borderBottom: "1px solid var(--border-color)", fontSize: 10, fontWeight: 700, color: "#7a90a4", letterSpacing: 0.8, textTransform: "uppercase" }}>
        <div>Name</div><div>Size</div><div>Date</div><div></div>
      </div>
      {docs.map((doc, i) => {
        const ft = types[doc.type] || types.pdf;
        return (
          <div key={doc.id} className="doc-row" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", padding: "12px 18px", alignItems: "center", borderBottom: i < docs.length - 1 ? "1px solid var(--border-color)" : "none", transition: "background 0.12s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 6, background: ft.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: ft.color, flexShrink: 0 }}>{ft.label}</div>
              <span style={{ fontWeight: 500, color: "var(--text-primary)", fontSize: fs }}>{doc.name}</span>
            </div>
            <div style={{ color: "#8a9db0", fontSize: fs }}>{doc.size}</div>
            <div style={{ color: "#8a9db0", fontSize: fs }}>{doc.date}</div>
            {doc.downloadUrl ? (
              <a href={doc.downloadUrl} download className="dl-btn" style={{ padding: "6px 14px", background: BRAND_XLIGHT, border: "1px solid #a8c8e0", color: BRAND, borderRadius: 6, fontSize: 12, fontWeight: 600, transition: "all 0.15s", textDecoration: "none" }}>↓ Download</a>
            ) : (
              <button className="dl-btn" onClick={() => onDownload(doc)} style={{ padding: "6px 14px", background: BRAND_XLIGHT, border: "1px solid #a8c8e0", color: BRAND, borderRadius: 6, fontSize: 12, fontWeight: 600, transition: "all 0.15s", cursor: "pointer" }}>↓ Download</button>
            )}
          </div>
        );
      })}
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState<"login" | "portal">("login");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [serverDocs, setServerDocs] = useState<Doc[]>([]);
  const [customFolders, setCustomFolders] = useState<Folder[]>([]);
  const [settings, setSettings] = useState<Settings>({
    theme: (localStorage.getItem("ap_theme") as "light" | "dark") || "light",
    fontSize: (localStorage.getItem("ap_fontSize") as "small" | "medium" | "large") || "medium",
  });

  const isAdmin = loggedInUser === ADMIN_EMAIL;
  const fs = settings.fontSize === "small" ? "12px" : settings.fontSize === "large" ? "16px" : "14px";

  useEffect(() => {
    document.body.className = `theme-${settings.theme}`;
  }, [settings.theme]);

  useEffect(() => {
    const saved = localStorage.getItem("ap_user");
    if (saved) {
      const u = JSON.parse(saved);
      setLoggedInUser(u.email);
      setScreen("portal");
    }
  }, []);

  useEffect(() => {
    if (screen === "portal") { fetchServerDocs(); fetchCustomFolders(); }
  }, [screen]);

  const fetchCustomFolders = async () => {
    try {
      const res = await fetch(`${API_BASE}/folders`);
      if (res.ok) setCustomFolders(await res.json());
    } catch {}
  };

  const fetchServerDocs = async () => {
    try {
      const res = await fetch(`${API_BASE}/files`);
      if (res.ok) {
        const files = await res.json();
        const mapped: Doc[] = files.map((f: any) => ({
          id: f.id,
          name: f.originalName,
          size: formatBytes(f.size),
          date: f.date,
          type: f.type,
          folderId: f.folderId,
          downloadUrl: `${API_BASE}/files/${f.id}/download`,
        }));
        setServerDocs(mapped);
      }
    } catch {}
  };

  const logActivity = async (action: string, detail?: string) => {
    try {
      await fetch(`${API_BASE}/activity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loggedInUser || email, action, detail: detail || "" }),
      });
    } catch {}
  };

  const updateSettings = (newSettings: Settings) => {
    localStorage.setItem("ap_theme", newSettings.theme);
    localStorage.setItem("ap_fontSize", newSettings.fontSize);
    setSettings(newSettings);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = () => {
    const t = email.trim().toLowerCase();
    if (!t || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    localStorage.setItem("ap_user", JSON.stringify({ email: t }));
    setLoggedInUser(t);
    setScreen("portal");
    fetch(`${API_BASE}/activity`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: t, action: "Signed in", detail: "" }),
    }).catch(() => {});
  };

  const handleLogout = () => {
    logActivity("Signed out");
    localStorage.removeItem("ap_user");
    setLoggedInUser(null);
    setEmail("");
    setScreen("login");
    setActiveFolder(null);
  };

  const handleDownload = (doc: Doc) => {
    logActivity("Downloaded file", doc.name);
    showToast(`Downloading "${doc.name}"…`);
  };

  const combinedDocs = (folderId: string): Doc[] => {
    const staticList = STATIC_DOCS[folderId] || [];
    const uploaded = serverDocs.filter((d) => d.folderId === folderId);
    return [...staticList, ...uploaded];
  };

  const allDocs: Doc[] = [
    ...Object.entries(STATIC_DOCS).flatMap(([fid, docs]) =>
      docs.map((d) => ({ ...d, folderId: fid }))
    ),
    ...serverDocs,
  ];

  const activeDocs = activeFolder ? combinedDocs(activeFolder) : [];
  const searchResults = search
    ? allDocs.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
    : [];
  const showingSearch = !!search;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-main)", fontSize: fs }}>
      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 999, background: BRAND, color: "white", padding: "11px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600, boxShadow: "0 4px 16px rgba(0,0,0,0.2)", animation: "fadeIn 0.2s" }}>
          {toast}
        </div>
      )}

      {showPanel && (
        <ControlPanel
          onClose={() => { setShowPanel(false); fetchServerDocs(); fetchCustomFolders(); }}
          isAdmin={isAdmin}
          settings={settings}
          onSettingsChange={updateSettings}
          loggedInUser={loggedInUser || ""}
          allFolders={[...INITIAL_FOLDERS, ...customFolders]}
          onFoldersChange={fetchCustomFolders}
        />
      )}

      {screen === "login" && (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: `linear-gradient(160deg,${BRAND} 0%,${BRAND_MID} 60%,#5dade2 100%)` }}>
          <div style={{ width: 420, background: "white", borderRadius: 16, boxShadow: "0 24px 64px rgba(0,0,0,0.25)", overflow: "hidden" }}>
            <div style={{ background: BRAND, padding: "24px 36px 20px", borderBottom: `4px solid ${GREEN}`, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 90 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: "white", letterSpacing: 0.5 }}>Allied Pharmacists Inc.</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 4, letterSpacing: 1 }}>MEMBER PORTAL</div>
              </div>
            </div>
            <div style={{ padding: "32px 36px" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1a2a3a", marginBottom: 4 }}>Sign in with your email</div>
              <div style={{ fontSize: 13, color: "#6b7a8d", marginBottom: 22 }}>Enter your email address to access the member portal and download resources.</div>
              <label style={{ fontSize: 11, fontWeight: 700, color: BRAND, letterSpacing: 0.8, textTransform: "uppercase" }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="you@example.com"
                style={{ width: "100%", marginTop: 7, padding: "12px 14px", border: `2px solid ${emailError ? "#e74c3c" : "#cdd8e3"}`, borderRadius: 8, fontSize: 14, color: "#1a2a3a", background: "#f7fafd", outline: "none", boxSizing: "border-box" }}
              />
              {emailError && <div style={{ color: "#e74c3c", fontSize: 12, marginTop: 5 }}>{emailError}</div>}
              <button onClick={handleLogin} style={{ width: "100%", marginTop: 18, padding: "13px", background: BRAND, color: "white", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                Access Portal →
              </button>
              <div style={{ marginTop: 18, padding: "11px 14px", background: BRAND_XLIGHT, borderRadius: 7, fontSize: 12, color: "#5a6a7a", lineHeight: 1.6 }}>
                🔒 Your email is used only to track access. No password required.
              </div>
            </div>
          </div>
        </div>
      )}

      {screen === "portal" && (
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <div style={{ width: 272, background: "var(--bg-sidebar)", borderRight: "1px solid var(--border-color)", display: "flex", flexDirection: "column", flexShrink: 0, boxShadow: "2px 0 12px rgba(27,79,114,0.07)" }}>
            <div style={{ padding: "16px 14px 14px", borderBottom: `3px solid ${GREEN}`, background: BRAND }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: "white" }}>Allied Pharmacists Inc.</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginTop: 4 }}>Member Document Portal</div>
            </div>

            <div style={{ padding: "12px 8px", flex: 1, overflowY: "auto" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#8a9db0", letterSpacing: 1, textTransform: "uppercase", padding: "4px 12px 8px" }}>Navigation</div>
              <div
                className={`folder-row${!activeFolder && !search ? " active" : ""}`}
                onClick={() => { setActiveFolder(null); setSearch(""); }}
                style={{ padding: "9px 12px", borderRadius: 6, cursor: "pointer", fontSize: fs, color: "var(--text-primary)", display: "flex", alignItems: "center", justifyContent: "space-between", borderLeft: "3px solid transparent", marginBottom: 1, transition: "all 0.15s" }}
              >
                <span>All Documents</span>
                <span style={{ fontSize: 11, color: "#8a9db0" }}>{allDocs.length}</span>
              </div>

              <div style={{ fontSize: 10, fontWeight: 700, color: "#8a9db0", letterSpacing: 1, textTransform: "uppercase", padding: "12px 12px 8px" }}>Folders</div>
              {[...INITIAL_FOLDERS, ...customFolders].map((f) => {
                const count = combinedDocs(f.id).length;
                return (
                  <div
                    key={f.id}
                    className={`folder-row${activeFolder === f.id && !search ? " active" : ""}`}
                    onClick={() => { setActiveFolder(f.id); setSearch(""); }}
                    style={{ padding: "8px 12px", borderRadius: 6, cursor: "pointer", fontSize: fs, color: "var(--text-primary)", display: "flex", alignItems: "center", justifyContent: "space-between", borderLeft: "3px solid transparent", marginBottom: 1, transition: "all 0.15s", lineHeight: 1.3 }}
                  >
                    <span style={{ flex: 1, paddingRight: 6 }}>{f.name}</span>
                    <span style={{ fontSize: 11, color: "#8a9db0", flexShrink: 0 }}>{count || ""}</span>
                  </div>
                );
              })}
            </div>

            <div style={{ padding: "14px 16px", borderTop: "1px solid var(--border-color)" }}>
              <div style={{ fontSize: 11, color: "#8a9db0", marginBottom: 3 }}>Signed in as</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: BRAND, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 8 }}>{loggedInUser}</div>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={() => setShowPanel(true)}
                  title={isAdmin ? "Control Panel" : "Settings"}
                  style={{ flex: 1, padding: "9px 8px", background: BRAND_XLIGHT, border: `1px solid ${BRAND_LIGHT}`, color: BRAND, borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}
                >
                  <GearIcon />
                  <span style={{ fontSize: 11 }}>{isAdmin ? "Admin" : "Settings"}</span>
                </button>
                <button onClick={handleLogout} style={{ flex: 1, padding: "9px 8px", background: BRAND_XLIGHT, border: `1px solid ${BRAND_LIGHT}`, color: BRAND, borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Sign Out</button>
              </div>
            </div>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border-color)", padding: "12px 28px", display: "flex", alignItems: "center", gap: 20, boxShadow: "0 1px 6px rgba(27,79,114,0.06)" }}>
              <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: 0.2 }}>
                <span style={{ color: "#4cae4f" }}>Allied </span>
                <span style={{ color: "#2b5ea7" }}>Pharmacists Inc.</span>
              </div>
              <div style={{ flex: 1 }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search documents…"
                style={{ width: 300, padding: "9px 14px", border: `1.5px solid ${search ? BRAND : "var(--border-color)"}`, borderRadius: 7, fontSize: fs, background: "#f7fafd", color: "var(--text-primary)", outline: "none" }}
              />
              <div style={{ fontSize: 13, color: "#8a9db0", fontWeight: 500, whiteSpace: "nowrap" }}>
                {showingSearch
                  ? `${searchResults.length} result${searchResults.length !== 1 ? "s" : ""}`
                  : activeFolder
                  ? `${activeDocs.length} file${activeDocs.length !== 1 ? "s" : ""}`
                  : `${allDocs.length} total files`}
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
              {!activeFolder && !showingSearch && (
                <>
                  <div style={{ fontSize: 22, fontWeight: 800, color: BRAND, marginBottom: 4 }}>Document Library</div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 24 }}>Select a folder to browse, or use the search bar above.</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 14 }}>
                    {INITIAL_FOLDERS.map((f) => {
                      const count = combinedDocs(f.id).length;
                      return (
                        <div key={f.id} className="folder-card" onClick={() => setActiveFolder(f.id)} style={{ background: "var(--bg-card)", borderRadius: 10, border: "1px solid var(--border-color)", borderTop: `3px solid ${BRAND}`, padding: "18px 18px 14px", cursor: "pointer", transition: "all 0.2s", boxShadow: "0 2px 6px rgba(27,79,114,0.05)" }}>
                          <div style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: 6, lineHeight: 1.4, fontSize: fs }}>{f.name}</div>
                          <div style={{ fontSize: 12, color: "#8a9db0" }}>{count} file{count !== 1 ? "s" : ""}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ marginTop: 36 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: BRAND, marginBottom: 14 }}>Recent Files</div>
                    <DocTable docs={allDocs.slice(0, 8)} onDownload={handleDownload} fs={fs} />
                  </div>
                </>
              )}

              {activeFolder && !showingSearch && (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                    <button onClick={() => setActiveFolder(null)} style={{ background: BRAND_XLIGHT, border: `1px solid ${BRAND_LIGHT}`, color: BRAND, padding: "6px 14px", borderRadius: 6, fontWeight: 600, fontSize: fs, cursor: "pointer" }}>← Back</button>
                    <div style={{ fontSize: 18, fontWeight: 800, color: BRAND }}>{INITIAL_FOLDERS.find((f) => f.id === activeFolder)?.name}</div>
                  </div>
                  {activeDocs.length === 0
                    ? <div style={{ textAlign: "center", color: "#8a9db0", padding: "60px 0", fontSize: fs }}>This folder is currently empty.</div>
                    : <DocTable docs={activeDocs} onDownload={handleDownload} fs={fs} />}
                </>
              )}

              {showingSearch && (
                <>
                  <div style={{ fontSize: 18, fontWeight: 800, color: BRAND, marginBottom: 16 }}>Search results for "{search}"</div>
                  {searchResults.length === 0
                    ? <div style={{ textAlign: "center", color: "#8a9db0", padding: "60px 0", fontSize: fs }}>No documents found.</div>
                    : <DocTable docs={searchResults} onDownload={handleDownload} fs={fs} />}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
