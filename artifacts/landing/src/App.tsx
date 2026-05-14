const BRAND = "#1b4f72";
const BRAND_MID = "#2471a3";
const GREEN = "#335525";
const PORTAL_URL = "/";

const features = [
  { icon: "📋", title: "Forms & Compliance", desc: "Downloadable consent forms, clinical assessment tools, and pharmacy inspection toolkits." },
  { icon: "📣", title: "Marketing Materials", desc: "Ready-to-print patient flyers for vaccines, minor ailments, and prescription services." },
  { icon: "🤝", title: "Member Benefits", desc: "Exclusive deals with Scotiabank, Richards Packaging, Payment Goat, and more." },
  { icon: "📸", title: "Posters & Signage", desc: "High-resolution minor ailment and service posters to display in your pharmacy." },
  { icon: "🎓", title: "Webinar Resources", desc: "Slides and recordings from clinical education sessions and partner webinars." },
  { icon: "🏥", title: "Advocacy & Policy", desc: "Stay informed with API's advocacy work and policy updates for independent pharmacy." },
];

const stats = [
  { value: "35+", label: "Resources Available" },
  { value: "12", label: "Resource Categories" },
  { value: "100%", label: "Free for Members" },
];

export default function App() {
  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh", background: "#f0f7fd", color: "#1a2a3a" }}>
      <nav style={{ background: "white", borderBottom: "1px solid #cdd8e8", padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 10px rgba(27,79,114,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 8, background: BRAND, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>💊</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: BRAND }}>Allied Pharmacists Inc.</div>
            <div style={{ fontSize: 10, color: "#8a9db0", letterSpacing: 0.8, textTransform: "uppercase" }}>Member Resources</div>
          </div>
        </div>
        <a href={PORTAL_URL} style={{ padding: "10px 24px", background: BRAND, color: "white", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none", transition: "background 0.2s" }}>
          Member Portal →
        </a>
      </nav>

      <div style={{ background: `linear-gradient(150deg, ${BRAND} 0%, ${BRAND_MID} 55%, #5dade2 100%)`, padding: "80px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ position: "absolute", bottom: -80, left: -40, width: 250, height: 250, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "relative", maxWidth: 680, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "6px 18px", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 24 }}>
            For API Members Only
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 900, color: "white", lineHeight: 1.2, marginBottom: 20, letterSpacing: -0.5 }}>
            Your Independent Pharmacy<br />Resource Hub
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, marginBottom: 36, maxWidth: 560, margin: "0 auto 36px" }}>
            Access exclusive forms, marketing materials, compliance tools, and member benefits — all in one place, available 24/7.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={PORTAL_URL} style={{ padding: "15px 36px", background: "white", color: BRAND, borderRadius: 10, fontWeight: 800, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 24px rgba(0,0,0,0.2)", transition: "transform 0.2s" }}>
              Access Member Portal →
            </a>
            <a href="#features" style={{ padding: "15px 36px", background: "rgba(255,255,255,0.15)", color: "white", borderRadius: 10, fontWeight: 700, fontSize: 16, textDecoration: "none", border: "2px solid rgba(255,255,255,0.3)" }}>
              See What's Inside
            </a>
          </div>
        </div>
      </div>

      <div style={{ background: BRAND, borderTop: `4px solid ${GREEN}`, borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "28px 40px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 20 }}>
          {stats.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: "white" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", letterSpacing: 0.8, textTransform: "uppercase", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div id="features" style={{ padding: "72px 40px", maxWidth: 1060, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: BRAND, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 10 }}>Resource Categories</div>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#1a2a3a", marginBottom: 14 }}>Everything Your Pharmacy Needs</h2>
          <p style={{ fontSize: 15, color: "#6b7a8d", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
            Allied Pharmacists Inc. provides independent pharmacies with a complete library of practice resources.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 22 }}>
          {features.map((f) => (
            <div key={f.title} style={{ background: "white", borderRadius: 12, padding: "24px 26px", border: "1px solid #cdd8e8", borderTop: `3px solid ${BRAND}`, boxShadow: "0 2px 8px rgba(27,79,114,0.06)", transition: "all 0.2s" }} className="feature-card">
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#1a2a3a", marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: "#6b7a8d", lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_MID} 100%)`, padding: "72px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ fontSize: 34, marginBottom: 20 }}>💊</div>
          <h2 style={{ fontSize: 30, fontWeight: 800, color: "white", marginBottom: 16 }}>Ready to Access Your Resources?</h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", marginBottom: 32, lineHeight: 1.7 }}>
            Sign in with your email address to instantly access all member documents, forms, and marketing materials.
          </p>
          <a href={PORTAL_URL} style={{ display: "inline-block", padding: "16px 48px", background: "white", color: BRAND, borderRadius: 10, fontWeight: 800, fontSize: 17, textDecoration: "none", boxShadow: "0 8px 28px rgba(0,0,0,0.2)" }}>
            Go to Member Portal →
          </a>
          <div style={{ marginTop: 20, fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
            No password required — just your email address.
          </div>
        </div>
      </div>

      <footer style={{ background: "#0e2d45", padding: "32px 40px", textAlign: "center" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>Allied Pharmacists Inc.</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Member Document Portal — For API Members Only</div>
      </footer>

      <style>{`
        .feature-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(27,79,114,0.14) !important; }
      `}</style>
    </div>
  );
}
