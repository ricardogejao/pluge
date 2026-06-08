/* global React, ReactDOM, MapScreen, ListScreen, DetailScreen, SessionScreen, HostScreen, ProfileScreen, BottomNav, CHARGERS, useTweaks, TweaksPanel, TweakSection, TweakColor, TweakSlider, TweakToggle, TweakRadio */
const { useState, useEffect, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "escuro",
  "accent": ["#B98BFF", "#8B5CF6"],
  "radius": 1,
  "showLabels": true
}/*EDITMODE-END*/;

const BATTERY = 60; // kWh pack

// Kiosk mode: ?screen=map|list|detail|session|host renders one locked screen
// (dark + purple) for embedding in the Design System overview.
const PARAMS = new URLSearchParams(location.search);
const SCREEN = PARAMS.get("screen");
const KIOSK = !!SCREEN;
function makeSession() {
  const c = CHARGERS[1], startPct = 28, pct = 64;
  const kwh = (pct - startPct) / 100 * BATTERY;
  return { charger: c, pct, startPct, elapsed: 312, kwh, cost: kwh * c.price,
    totalMin: Math.round((100 - startPct) / 100 * (BATTERY / c.kw * 60)) };
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [tab, setTab] = useState(SCREEN === "list" ? "list" : SCREEN === "session" ? "sessions" : SCREEN === "profile" ? "profile" : "map");
  const [view, setView] = useState(SCREEN === "detail" ? "detail" : SCREEN === "host" ? "host" : null);
  const [selected, setSelected] = useState(SCREEN === "map" ? CHARGERS[0] : null); // map pin
  const [detailC, setDetailC] = useState(SCREEN === "detail" ? CHARGERS[0] : null);
  const [session, setSession] = useState(SCREEN === "session" ? makeSession() : null);
  const [emergency, setEmergency] = useState(false);
  const [toast, setToast] = useState(null);

  // apply tweaks to CSS vars
  useEffect(() => {
    const r = document.documentElement.style;
    r.setProperty("--color-primary", t.accent[0]);
    r.setProperty("--color-primary-dark", t.accent[1] || t.accent[0]);
    const a = t.accent[0].replace("#", "");
    const rr = parseInt(a.slice(0,2),16), gg = parseInt(a.slice(2,4),16), bb = parseInt(a.slice(4,6),16);
    r.setProperty("--fill-primary", `rgba(${rr},${gg},${bb},0.13)`);
    r.setProperty("--ring-primary", `rgba(${rr},${gg},${bb},0.28)`);
    [["--radius-sm",8],["--radius-md",12],["--radius-lg",16]].forEach(([k,v]) =>
      r.setProperty(k, Math.round(v * t.radius) + "px"));
  }, [t.accent, t.radius]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", t.theme === "claro" ? "light" : "dark");
  }, [t.theme]);

  useEffect(() => {
    document.documentElement.toggleAttribute("data-hide-labels", !t.showLabels);
  }, [t.showLabels]);

  // Kiosk: lock to dark + purple regardless of stored tweaks, drop the stage chrome
  useEffect(() => {
    if (!KIOSK) return;
    const r = document.documentElement;
    r.setAttribute("data-theme", "dark");
    r.style.setProperty("--color-primary", "#B98BFF");
    r.style.setProperty("--color-primary-dark", "#8B5CF6");
    r.style.setProperty("--fill-primary", "rgba(185,139,255,0.13)");
    r.style.setProperty("--ring-primary", "rgba(185,139,255,0.28)");
    document.body.style.background = "transparent";
  });

  // live charging session
  useEffect(() => {
    if (!session || session.pct >= 100) return;
    const id = setInterval(() => {
      setSession(s => {
        if (!s || s.pct >= 100) return s;
        const pct = Math.min(100, s.pct + 0.7);
        const kwh = (pct - s.startPct) / 100 * BATTERY;
        return { ...s, pct, elapsed: s.elapsed + 0.5, kwh, cost: kwh * s.charger.price };
      });
    }, 500);
    return () => clearInterval(id);
  }, [session && session.pct >= 100, !!session]);

  function flash(msg) { setToast(msg); setTimeout(() => setToast(null), 2200); }

  function startSession(c) {
    const startPct = 28;
    setSession({ charger: c, pct: startPct, startPct, elapsed: 0, kwh: 0, cost: 0, totalMin: Math.round((100 - startPct) / 100 * (BATTERY / c.kw * 60)) });
    setView(null); setSelected(null); setTab("sessions");
    flash("Reserva confirmada · sessão iniciada");
  }
  function endSession() { setSession(null); setTab("map"); flash("Sessão encerrada"); }

  function openDetail(c) { setDetailC(c); setView("detail"); }

  // fit 390×844 frame to viewport
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () => setScale(KIOSK
      ? Math.min(window.innerWidth / 390, window.innerHeight / 844)
      : Math.min(1, (window.innerHeight - 32) / 844, (window.innerWidth - 32) / 390));
    fit(); window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
      <div style={{
        position: "relative", width: 390, height: 844, background: "var(--bg-primary)",
        borderRadius: KIOSK ? 0 : "var(--radius-full)", overflow: "hidden",
        boxShadow: KIOSK ? "none" : "0 40px 120px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.04)",
      }}>
        {/* status bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 52, zIndex: 20, display: "flex",
          alignItems: "center", justifyContent: "space-between", padding: "0 26px", pointerEvents: "none" }}>
          <span style={{ color: view === "detail" ? "#fff" : "var(--text-primary)", fontSize: 14, fontWeight: 600, fontFamily: "var(--font)" }}>9:41</span>
          <div style={{ display: "flex", gap: 6, alignItems: "center", color: view === "detail" ? "#fff" : "var(--text-primary)" }}>
            <Icon name="signal-4g" size={16} /><Icon name="wifi" size={16} /><Icon name="battery-3" size={18} />
          </div>
        </div>

        {/* views */}
        {view === "detail"
          ? <DetailScreen c={detailC} onBack={() => setView(null)} onReserve={startSession} />
          : view === "host"
          ? <HostScreen onBack={() => setView(null)} />
          : (
            <>
              {tab === "map" && <MapScreen selected={selected} onSelectPin={setSelected}
                onReserve={startSession} onDetails={() => openDetail(selected)}
                emergency={emergency} onToggleEmergency={() => { setEmergency(e => !e); flash(emergency ? "Modo normal" : "Modo emergência ativo"); }} />}
              {tab === "list" && <ListScreen onOpen={openDetail} />}
              {tab === "sessions" && <SessionScreen session={session} onEnd={endSession} onGoMap={() => setTab("map")} />}
              {tab === "profile" && <ProfileScreen onOpenHost={() => setView("host")} />}
            </>
          )}

        {/* bottom nav (hidden in pushed views) */}
        {!view && (
          <div style={{ position: "absolute", left: 12, right: 12, bottom: 14, zIndex: 15 }}>
            <BottomNav active={tab} onChange={(id) => { setTab(id); setSelected(null); }} />
          </div>
        )}

        {/* session mini-banner across tabs */}
        {session && tab !== "sessions" && !view && (
          <div onClick={() => setTab("sessions")} style={{
            position: "absolute", left: 12, right: 12, bottom: 92, zIndex: 16, cursor: "pointer",
            background: "var(--color-primary)", color: "#000", borderRadius: 14, padding: "10px 14px",
            display: "flex", alignItems: "center", gap: 10, boxShadow: "var(--shadow-pop)",
          }}>
            <Icon name="bolt-filled" size={18} />
            <span style={{ fontFamily: "var(--font)", fontWeight: 700, fontSize: 13 }}>Carregando · {Math.round(session.pct)}%</span>
            <span style={{ fontFamily: "var(--font)", fontSize: 12, opacity: .8, marginLeft: "auto" }}>R$ {session.cost.toFixed(2).replace(".", ",")}</span>
          </div>
        )}

        {/* toast */}
        {toast && (
          <div style={{ position: "absolute", left: "50%", top: 70, transform: "translateX(-50%)", zIndex: 30,
            background: "var(--bg-surface)", color: "var(--text-primary)", border: "1px solid var(--border)",
            padding: "10px 16px", borderRadius: 999, fontFamily: "var(--font)", fontSize: 13, fontWeight: 500,
            boxShadow: "var(--shadow-pop)", whiteSpace: "nowrap" }}>{toast}</div>
        )}
      </div>
      </div>

      {!KIOSK && <TweaksPanel>
        <TweakSection label="Tema" />
        <TweakRadio label="Aparência" value={t.theme} options={["escuro", "claro"]}
          onChange={(v) => setTweak("theme", v)} />
        <TweakSection label="Cor de ação" />
        <TweakColor label="Accent" value={t.accent}
          options={[["#00D46A","#00A854"],["#2EC4FF","#0E9BD6"],["#B98BFF","#8B5CF6"],["#FFB800","#E0A100"]]}
          onChange={(v) => setTweak("accent", v)} />
        <TweakSection label="Forma" />
        <TweakSlider label="Raio das bordas" value={t.radius} min={0.5} max={1.6} step={0.1}
          onChange={(v) => setTweak("radius", v)} />
        <TweakToggle label="Rótulos nas fotos" value={t.showLabels}
          onChange={(v) => setTweak("showLabels", v)} />
      </TweaksPanel>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
