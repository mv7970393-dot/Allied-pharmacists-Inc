import { useState, useEffect } from "react";

const BRAND = "#1b4f72";
const BRAND_MID = "#2471a3";
const BRAND_LIGHT = "#d6e8f7";
const BRAND_XLIGHT = "#eaf4fc";
const GREEN = "#335525";
const ADMIN_EMAIL = "sally@alliedpharmacists.ca";

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
];

interface Doc {
  id: string;
  name: string;
  size: string;
  date: string;
  type: string;
}

type DocsMap = Record<string, Doc[]>;

const INITIAL_DOCS: DocsMap = {
  f1: [
    { id: "d1", name: "API-BD Showpad Portal Instructions.pdf", size: "—", date: "2025", type: "pdf" },
    { id: "d2", name: "BD Injection Technique Reference Card.pdf", size: "—", date: "2025", type: "pdf" },
  ],
  f2: [
    { id: "d3", name: "Minor Ailments Poster – Pharmacist (Male).png", size: "—", date: "2025", type: "img" },
    { id: "d4", name: "Minor Ailments Poster – Pharmacist (Female).png", size: "—", date: "2025", type: "img" },
    { id: "d5", name: "Minor Ailments Poster – Gold Background.png", size: "—", date: "2025", type: "img" },
    { id: "d6", name: "Minor Ailments Poster – Teal Background.png", size: "—", date: "2025", type: "img" },
    { id: "d7", name: "Minor Ailments Poster – One Visit One Solution (Photo).png", size: "—", date: "2025", type: "img" },
    { id: "d8", name: "Minor Ailments Poster – No Family Doctor (Illustrated).png", size: "—", date: "2025", type: "img" },
    { id: "d9", name: "Minor Ailments Poster – One Visit One Solution (Illustrated).png", size: "—", date: "2025", type: "img" },
    { id: "d10", name: "Minor Ailments Poster – No Family Doctor (Photo).png", size: "—", date: "2025", type: "img" },
  ],
  f3: [
    { id: "d11", name: "Progress in Practice – Webinar Announcement.png", size: "—", date: "Jan 26, 2026", type: "img" },
    { id: "d12", name: "Progress in Practice – Sustaining Clinical Services in 2026 and Beyond (Slides).pdf", size: "—", date: "Jan 26, 2026", type: "pdf" },
    { id: "d13", name: "MAPflow Incident Reporting – Exclusive API Rate Letter.pdf", size: "—", date: "2026", type: "pdf" },
    { id: "d14", name: "MAPflow – Incident Reporting Coming to MAPflow (Poster).png", size: "—", date: "2026", type: "img" },
  ],
  f4: [
    { id: "d15", name: "Payment Goat – Handheld Terminals Pricing Sheet.pdf", size: "—", date: "2026", type: "pdf" },
    { id: "d16", name: "Payment Goat – Merchant Info Form.pdf", size: "—", date: "2026", type: "pdf" },
  ],
  f5: [
    { id: "d17", name: "API Member Benefits Package.pdf", size: "—", date: "2026", type: "pdf" },
    { id: "d18", name: "Scotiabank – API Member Program Features.pdf", size: "—", date: "2025", type: "pdf" },
    { id: "d19", name: "Communimed – Your Pharmacist & You Program.pdf", size: "—", date: "2026", type: "pdf" },
    { id: "d20", name: "Richards Packaging – API Vials & Dispill Deal.pdf", size: "—", date: "2026", type: "pdf" },
  ],
  f6: [
    { id: "d21", name: "Frequent Dispensing – Documentation Consent Notification Form.pdf", size: "—", date: "2025", type: "pdf" },
    { id: "d22", name: "Consent Form for Seasonal Influenza (Flu) Vaccine.pdf", size: "—", date: "2025", type: "pdf" },
    { id: "d23", name: "ODB Short Dispensing Clinical Assessment Form.pdf", size: "—", date: "2025", type: "pdf" },
    { id: "d24", name: "Short Frequent Dispensing Clinical Assessment Form (Private Insurance).pdf", size: "—", date: "2025", type: "pdf" },
  ],
  f7: [
    { id: "d25", name: "API Flyer – Need More of Your Medication (Prescription Extension).pdf", size: "—", date: "2025", type: "pdf" },
    { id: "d26", name: "API Flyer – What is Gardasil 9 (HPV Vaccine).pdf", size: "—", date: "2025", type: "pdf" },
    { id: "d27", name: "API Flyer – We Prescribe for Minor Ailments.pdf", size: "—", date: "2025", type: "pdf" },
    { id: "d28", name: "API Flyer – Fight Seasonal Allergies.pdf", size: "—", date: "2025", type: "pdf" },
    { id: "d29", name: "API Flyer – Flu Season Is Here (Protect Yourself).pdf", size: "—", date: "2025", type: "pdf" },
    { id: "d30", name: "API Flyer – Flu Season We Offer Vaccines.pdf", size: "—", date: "2025", type: "pdf" },
    { id: "d31", name: "API Flyer – Minor Ailments Conditions List (Poster).png", size: "—", date: "2025", type: "img" },
  ],
  f8: [
    { id: "d32", name: "API Pharmacy Compliance & Inspection Toolkit.pdf", size: "—", date: "2025", type: "pdf" },
    { id: "d33", name: "API Compounding – Master Formulation Record Template.pdf", size: "—", date: "2025", type: "pdf" },
    { id: "d34", name: "API Policy and Procedure Manual Template.pdf", size: "—", date: "2025", type: "pdf" },
    { id: "d35", name: "Standards of Practice Template.pdf", size: "—", date: "2025", type: "pdf" },
  ],
  f9: [],
  f10: [],
  f11: [],
  f12: [],
};

interface Settings {
  theme: "light" | "dark";
  fontSize: "small" | "medium" | "large";
}

interface Activity {
  action: string;
  email: string;
  time: string;
}

function SettingsModal({ onClose, settings, onSettingsChange }: {
  onClose: () => void;
  settings: Settings;
  onSettingsChange: (s: Settings) => void;
}) {
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--bg-card)", borderRadius: 16, padding: 28, width: 400, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: BRAND }}>Display Settings</div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, color: "#8a9db0", cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: BRAND, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 8 }}>Theme</label>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => onSettingsChange({ ...settings, theme: "light" })} style={{ flex: 1, padding: 10, borderRadius: 8, border: `2px solid ${settings.theme === "light" ? BRAND : "#cdd8e3"}`, background: settings.theme === "light" ? BRAND_XLIGHT : "transparent", color: settings.theme === "light" ? BRAND : "inherit", fontWeight: 600 }}>☀️ Light</button>
            <button onClick={() => onSettingsChange({ ...settings, theme: "dark" })} style={{ flex: 1, padding: 10, borderRadius: 8, border: `2px solid ${settings.theme === "dark" ? BRAND : "#cdd8e3"}`, background: settings.theme === "dark" ? BRAND_XLIGHT : "transparent", color: settings.theme === "dark" ? BRAND : "inherit", fontWeight: 600 }}>🌙 Dark</button>
          </div>
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: BRAND, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 8 }}>Font Size</label>
          <div style={{ display: "flex", gap: 8 }}>
            {(["small", "medium", "large"] as const).map((sz) => (
              <button key={sz} onClick={() => onSettingsChange({ ...settings, fontSize: sz })} style={{ flex: 1, padding: 10, borderRadius: 8, border: `2px solid ${settings.fontSize === sz ? BRAND : "#cdd8e3"}`, background: settings.fontSize === sz ? BRAND_XLIGHT : "transparent", color: settings.fontSize === sz ? BRAND : "inherit", fontWeight: 600, textTransform: "capitalize" }}>{sz}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminPanel({ onClose, activities, onUpload, folders, docs }: {
  onClose: () => void;
  activities: Activity[];
  onUpload: (folderId: string, doc: Doc) => void;
  folders: typeof INITIAL_FOLDERS;
  docs: DocsMap;
}) {
  const [tab, setTab] = useState<"activity" | "upload" | "files">("activity");
  const [uploadFolder, setUploadFolder] = useState("f1");
  const [uploadName, setUploadName] = useState("");
  const [uploadType, setUploadType] = useState("pdf");

  const fs = (localStorage.getItem("ap_fontSize") === "small" ? "12px" : localStorage.getItem("ap_fontSize") === "large" ? "16px" : "14px");

  const handleUpload = () => {
    if (!uploadName.trim()) return;
    const newDoc: Doc = {
      id: "d" + Date.now(),
      name: uploadName.trim(),
      size: "—",
      date: new Date().toLocaleDateString(),
      type: uploadType,
    };
    onUpload(uploadFolder, newDoc);
    setUploadName("");
    alert("File added successfully!");
  };

  const tabStyle = (active: boolean) => ({
    padding: "8px 16px", borderRadius: 8, border: "none",
    background: active ? BRAND : "transparent",
    color: active ? "white" : "inherit",
    fontWeight: 600, fontSize: fs, cursor: "pointer"
  });

  return (
    <div onClick={onClose} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--bg-card)", borderRadius: 16, padding: 28, width: 700, maxHeight: "85vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: BRAND }}>⚙️ Admin Control Panel</div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, color: "#8a9db0", cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 20, borderBottom: "2px solid var(--border-color)", paddingBottom: 8 }}>
          <button style={tabStyle(tab === "activity")} onClick={() => setTab("activity")}>📊 Activity Log</button>
          <button style={tabStyle(tab === "upload")} onClick={() => setTab("upload")}>📤 Upload File</button>
          <button style={tabStyle(tab === "files")} onClick={() => setTab("files")}>📁 Manage Files</button>
        </div>

        {tab === "activity" && (
          <div>
            <h3 style={{ marginBottom: 12, fontSize: 14, color: BRAND }}>Recent Activity</h3>
            <div style={{ maxHeight: 400, overflow: "auto" }}>
              {activities.length === 0
                ? <div style={{ color: "#8a9db0", fontSize: fs, padding: 20, textAlign: "center" }}>No activity recorded yet.</div>
                : activities.slice().reverse().map((a, i) => (
                  <div key={i} style={{ padding: "12px", borderBottom: "1px solid var(--border-color)", fontSize: fs }}>
                    <div style={{ fontWeight: 600 }}>{a.action}</div>
                    <div style={{ color: "#8a9db0", marginTop: 4 }}>User: {a.email} • {a.time}</div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {tab === "upload" && (
          <div>
            <h3 style={{ marginBottom: 16, fontSize: 14, color: BRAND }}>Upload New File</h3>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: BRAND, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 6 }}>Target Folder</label>
              <select value={uploadFolder} onChange={(e) => setUploadFolder(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid var(--border-color)", fontSize: fs }}>
                {folders.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: BRAND, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 6 }}>File Name</label>
              <input type="text" value={uploadName} onChange={(e) => setUploadName(e.target.value)} placeholder="e.g., New Document.pdf" style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid var(--border-color)", fontSize: fs }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: BRAND, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 6 }}>File Type</label>
              <div style={{ display: "flex", gap: 8 }}>
                {["pdf", "img", "doc", "xls", "ppt"].map((t) => (
                  <button key={t} onClick={() => setUploadType(t)} style={{ padding: "8px 16px", borderRadius: 8, border: `2px solid ${uploadType === t ? BRAND : "var(--border-color)"}`, background: uploadType === t ? BRAND_XLIGHT : "transparent", color: uploadType === t ? BRAND : "inherit", fontWeight: 600, textTransform: "uppercase", fontSize: 12, cursor: "pointer" }}>{t}</button>
                ))}
              </div>
            </div>
            <button onClick={handleUpload} style={{ padding: "12px 24px", background: BRAND, color: "white", border: "none", borderRadius: 8, fontWeight: 700, fontSize: fs, cursor: "pointer" }}>✓ Add File to Portal</button>
          </div>
        )}

        {tab === "files" && (
          <div>
            <h3 style={{ marginBottom: 12, fontSize: 14, color: BRAND }}>All Files ({Object.values(docs).flat().length})</h3>
            <div style={{ maxHeight: 400, overflow: "auto" }}>
              {Object.entries(docs).map(([fid, files]) => {
                const folder = folders.find((f) => f.id === fid);
                return files.length > 0 && (
                  <div key={fid} style={{ marginBottom: 16 }}>
                    <div style={{ fontWeight: 700, fontSize: fs, color: BRAND, padding: "8px 0", borderBottom: "1px solid var(--border-color)" }}>{folder?.name || fid}</div>
                    {files.map((f) => (
                      <div key={f.id} style={{ padding: "8px 0", fontSize: fs, borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between" }}>
                        <span>{f.name}</span>
                        <span style={{ color: "#8a9db0" }}>{f.date}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
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
    <div style={{ background: "var(--bg-card)", borderRadius: 10, border: "1px solid var(--border-color)", overflow: "hidden", fontSize: fs }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", padding: "10px 18px", background: "#f0f7fd", borderBottom: "1px solid var(--border-color)", fontSize: 10, fontWeight: 700, color: "#7a90a4", letterSpacing: 0.8, textTransform: "uppercase" }}>
        <div>Name</div><div>Size</div><div>Date</div><div></div>
      </div>
      {docs.map((doc, i) => {
        const ft = types[doc.type] || types.pdf;
        return (
          <div key={doc.id} className="doc-row" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", padding: "12px 18px", alignItems: "center", borderBottom: i < docs.length - 1 ? "1px solid var(--border-color)" : "none", transition: "background 0.12s", fontSize: fs }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 6, background: ft.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: ft.color, flexShrink: 0 }}>{ft.label}</div>
              <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>{doc.name}</span>
            </div>
            <div style={{ color: "#8a9db0" }}>{doc.size}</div>
            <div style={{ color: "#8a9db0" }}>{doc.date}</div>
            <button className="dl-btn" onClick={() => onDownload(doc)} style={{ padding: "6px 14px", background: BRAND_XLIGHT, border: "1px solid #a8c8e0", color: BRAND, borderRadius: 6, fontSize: 12, fontWeight: 600, transition: "all 0.15s", cursor: "pointer" }}>↓ Download</button>
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
  const [showSettings, setShowSettings] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [docs, setDocs] = useState<DocsMap>(() => {
    const saved = localStorage.getItem("ap_docs");
    return saved ? JSON.parse(saved) : INITIAL_DOCS;
  });
  const [settings, setSettings] = useState<Settings>({
    theme: (localStorage.getItem("ap_theme") as "light" | "dark") || "light",
    fontSize: (localStorage.getItem("ap_fontSize") as "small" | "medium" | "large") || "medium",
  });

  const isAdmin = loggedInUser === ADMIN_EMAIL;
  const allDocs = Object.values(docs).flat();
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
    const savedActivities = localStorage.getItem("ap_activities");
    if (savedActivities) setActivities(JSON.parse(savedActivities));
  }, []);

  const logActivity = (action: string, user?: string) => {
    const entry: Activity = { action, email: user || loggedInUser || email, time: new Date().toLocaleString() };
    setActivities((prev) => {
      const newActivities = [...prev, entry];
      localStorage.setItem("ap_activities", JSON.stringify(newActivities));
      return newActivities;
    });
  };

  const updateSettings = (newSettings: Settings) => {
    localStorage.setItem("ap_theme", newSettings.theme);
    localStorage.setItem("ap_fontSize", newSettings.fontSize);
    setSettings(newSettings);
    setShowSettings(false);
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
    localStorage.setItem("ap_user", JSON.stringify({ email: t, approved: true }));
    logActivity(`${t} logged in`, t);
    setLoggedInUser(t);
    setScreen("portal");
  };

  const handleLogout = () => {
    logActivity(`${loggedInUser} logged out`);
    localStorage.removeItem("ap_user");
    setLoggedInUser(null);
    setEmail("");
    setScreen("login");
    setActiveFolder(null);
  };

  const handleUpload = (folderId: string, newDoc: Doc) => {
    const updatedDocs = { ...docs };
    if (!updatedDocs[folderId]) updatedDocs[folderId] = [];
    updatedDocs[folderId] = [...updatedDocs[folderId], newDoc];
    setDocs(updatedDocs);
    localStorage.setItem("ap_docs", JSON.stringify(updatedDocs));
    logActivity(`Admin uploaded "${newDoc.name}" to folder`);
  };

  const handleDownload = (doc: Doc) => {
    logActivity(`${loggedInUser} downloaded "${doc.name}"`);
    showToast(`Downloading "${doc.name}"…`);
  };

  const activeDocs = activeFolder ? (docs[activeFolder] || []) : [];
  const searchResults = search ? allDocs.filter((d) => d.name.toLowerCase().includes(search.toLowerCase())) : [];
  const showingSearch = !!search;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-main)", fontSize: fs }}>
      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 999, background: BRAND, color: "white", padding: "11px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600, boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
          {toast}
        </div>
      )}

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} settings={settings} onSettingsChange={updateSettings} />}
      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} activities={activities} onUpload={handleUpload} folders={INITIAL_FOLDERS} docs={docs} />}

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
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1a2a3a", marginBottom: 4 }}>Sign in with your work email</div>
              <div style={{ fontSize: 13, color: "#6b7a8d", marginBottom: 22 }}>Enter your email to access the member portal.</div>
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
              <button onClick={handleLogin} style={{ width: "100%", marginTop: 18, padding: "13px", background: BRAND, color: "white", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Sign In →</button>
              <div style={{ marginTop: 18, padding: "11px 14px", background: BRAND_XLIGHT, borderRadius: 7, fontSize: 12, color: "#5a6a7a", lineHeight: 1.6 }}>
                🔒 Enter any valid email to access the portal.
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
              {INITIAL_FOLDERS.map((f) => (
                <div
                  key={f.id}
                  className={`folder-row${activeFolder === f.id && !search ? " active" : ""}`}
                  onClick={() => { setActiveFolder(f.id); setSearch(""); }}
                  style={{ padding: "8px 12px", borderRadius: 6, cursor: "pointer", fontSize: fs, color: "var(--text-primary)", display: "flex", alignItems: "center", justifyContent: "space-between", borderLeft: "3px solid transparent", marginBottom: 1, transition: "all 0.15s", lineHeight: 1.3 }}
                >
                  <span style={{ flex: 1, paddingRight: 6 }}>{f.name}</span>
                  <span style={{ fontSize: 11, color: "#8a9db0", flexShrink: 0 }}>{(docs[f.id] || []).length || ""}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: "14px 16px", borderTop: "1px solid var(--border-color)" }}>
              <div style={{ fontSize: 11, color: "#8a9db0", marginBottom: 3 }}>Signed in as</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: BRAND, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 8 }}>{loggedInUser}</div>
              <div style={{ display: "flex", gap: 6 }}>
                {isAdmin && (
                  <button onClick={() => setShowAdmin(true)} style={{ flex: 1, padding: "8px", background: "#e8f5e9", border: "1px solid #a5d6a7", color: GREEN, borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }} title="Admin Panel">⚙️</button>
                )}
                <button onClick={() => setShowSettings(true)} style={{ flex: 1, padding: "8px", background: BRAND_XLIGHT, border: `1px solid ${BRAND_LIGHT}`, color: BRAND, borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }} title="Settings">☀️</button>
                <button onClick={handleLogout} style={{ flex: 1, padding: "8px", background: BRAND_XLIGHT, border: `1px solid ${BRAND_LIGHT}`, color: BRAND, borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Sign Out</button>
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
                placeholder="Search documents..."
                style={{ width: 300, padding: "9px 14px", border: `1.5px solid ${search ? BRAND : "var(--border-color)"}`, borderRadius: 7, fontSize: fs, background: "#f7fafd", color: "var(--text-primary)", outline: "none" }}
              />
              <div style={{ fontSize: 13, color: "#8a9db0", fontWeight: 500, whiteSpace: "nowrap" }}>
                {showingSearch ? `${searchResults.length} result${searchResults.length !== 1 ? "s" : ""}` : activeFolder ? `${activeDocs.length} file${activeDocs.length !== 1 ? "s" : ""}` : `${allDocs.length} total files`}
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
              {!activeFolder && !showingSearch && (
                <>
                  <div style={{ fontSize: 22, fontWeight: 800, color: BRAND, marginBottom: 4 }}>Document Library</div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 24 }}>Select a folder to browse, or use the search bar above.</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 14 }}>
                    {INITIAL_FOLDERS.map((f) => (
                      <div key={f.id} className="folder-card" onClick={() => setActiveFolder(f.id)} style={{ background: "var(--bg-card)", borderRadius: 10, border: "1px solid var(--border-color)", borderTop: `3px solid ${BRAND}`, padding: "18px 18px 14px", cursor: "pointer", transition: "all 0.2s", boxShadow: "0 2px 6px rgba(27,79,114,0.05)", fontSize: fs }}>
                        <div style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: 6, lineHeight: 1.4 }}>{f.name}</div>
                        <div style={{ fontSize: 12, color: "#8a9db0" }}>{(docs[f.id] || []).length} file{(docs[f.id] || []).length !== 1 ? "s" : ""}</div>
                      </div>
                    ))}
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
