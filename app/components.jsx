/* global React */
const { useState, useEffect, useRef } = React;

/* ----------------------------------------------------------
   Icon — Tabler webfont
---------------------------------------------------------- */
function Icon({ name, size, color, style, className }) {
  return <i className={"ti ti-" + name + (className ? " " + className : "")}
    style={{ fontSize: size || 20, color: color || "inherit", lineHeight: 1, ...style }} />;
}

/* ----------------------------------------------------------
   Button
---------------------------------------------------------- */
function Button({ variant = "primary", icon, children, block, lg, onClick, disabled, style }) {
  const cls = ["btn", "btn-" + (disabled ? "disabled" : variant)];
  if (block) cls.push("btn-block");
  if (lg) cls.push("btn-lg");
  return (
    <button className={cls.join(" ")} onClick={disabled ? undefined : onClick} disabled={disabled} style={style}>
      {icon && <Icon name={icon} size={18} />}
      {children}
    </button>
  );
}

/* ----------------------------------------------------------
   Status / plug badges
---------------------------------------------------------- */
const STATUS = {
  available: { cls: "badge-available", label: "Disponível", icon: null },
  busy:      { cls: "badge-busy",      label: "Ocupado",    icon: null },
  reserved:  { cls: "badge-reserved",  label: "Reservado",  icon: null },
  charging:  { cls: "badge-charging",  label: "Carregando", icon: "bolt" },
};
function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.available;
  return <span className={"badge " + s.cls}>{s.icon && <Icon name={s.icon} size={12} />}{s.label}</span>;
}
function PlugBadge({ type }) {
  return <span className="badge badge-plug"><Icon name="plug" size={12} />{type}</span>;
}

/* ----------------------------------------------------------
   Rating — stars + session count
---------------------------------------------------------- */
function Rating({ value, sessions, size = 13 }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      <Icon name="star-filled" size={size} color="var(--color-warning)" />
      <span className="t-caption" style={{ color: "var(--text-primary)", fontWeight: 600 }}>{value.toFixed(2)}</span>
      {sessions != null && (
        <span className="t-caption" style={{ color: "var(--text-secondary)" }}>· {sessions} sessões</span>
      )}
    </span>
  );
}

/* ----------------------------------------------------------
   Host avatar — initial + verification tick
---------------------------------------------------------- */
function Avatar({ name, size = 44, verified = true }) {
  const initial = (name || "?").trim().charAt(0).toUpperCase();
  const tick = Math.round(size * 0.42);
  return (
    <div style={{ position: "relative", width: size, height: size, flex: "0 0 auto" }}>
      <div style={{
        width: size, height: size, borderRadius: "50%", background: "var(--bg-surface-2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--text-primary)", fontWeight: 600, fontSize: size * 0.4, fontFamily: "var(--font)",
      }}>{initial}</div>
      {verified && (
        <div style={{
          position: "absolute", right: -2, bottom: -2, width: tick, height: tick, borderRadius: "50%",
          background: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center",
          border: "2px solid var(--bg-surface)",
        }}>
          <Icon name="check" size={tick * 0.62} color="#000" style={{ fontWeight: 700 }} />
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------------
   Location photo placeholder — styled, dark, varied by vibe
---------------------------------------------------------- */
const VIBES = {
  garage:   { grad: "radial-gradient(120% 120% at 70% 10%, #232a26 0%, #14171a 55%, #0c0e10 100%)", icon: "home", tint: "#00D46A" },
  driveway: { grad: "radial-gradient(120% 120% at 30% 20%, #2a2620 0%, #17140f 55%, #0c0b09 100%)", icon: "car", tint: "#FFB800" },
  building: { grad: "radial-gradient(130% 120% at 80% 0%, #1f2530 0%, #131720 55%, #0a0c10 100%)", icon: "building", tint: "#5b9bff" },
  parking:  { grad: "radial-gradient(120% 120% at 40% 15%, #262226 0%, #15131a 55%, #0b0a0d 100%)", icon: "parking", tint: "#b08bff" },
  street:   { grad: "radial-gradient(120% 120% at 60% 10%, #20262a 0%, #12161a 55%, #0a0d0f 100%)", icon: "map-pin", tint: "#00D46A" },
};
function PhotoPlaceholder({ vibe = "garage", height = 168, label, topInset = 12, children }) {
  const v = VIBES[vibe] || VIBES.garage;
  return (
    <div style={{
      position: "relative", height, background: v.grad, overflow: "hidden",
    }}>
      {/* faint structural lines to read as architecture */}
      <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, opacity: 0.5 }}>
        <line x1="0" y1="150" x2="400" y2="138" stroke="rgba(255,255,255,.06)" strokeWidth="1" />
        <line x1="60" y1="200" x2="120" y2="60" stroke="rgba(255,255,255,.04)" strokeWidth="1" />
        <line x1="300" y1="200" x2="250" y2="40" stroke="rgba(255,255,255,.04)" strokeWidth="1" />
        <rect x="270" y="70" width="90" height="120" fill="rgba(255,255,255,.02)" />
      </svg>
      <Icon name="charging-pile" size={46} color={v.tint}
        style={{ position: "absolute", left: 18, bottom: 16, opacity: 0.9, filter: "drop-shadow(0 2px 8px rgba(0,0,0,.5))" }} />
      {label && (
        <span className="t-label photo-label" style={{
          position: "absolute", top: topInset, left: 12, color: "rgba(255,255,255,.8)",
          background: "rgba(0,0,0,.35)", backdropFilter: "blur(4px)", padding: "5px 9px", borderRadius: 6,
        }}>{label}</span>
      )}
      {children}
    </div>
  );
}

/* ----------------------------------------------------------
   Charger card — Airbnb style
---------------------------------------------------------- */
function ChargerCard({ c, onClick }) {
  return (
    <div className="card" onClick={onClick} style={{ cursor: "pointer", flexShrink: 0 }}>
      <PhotoPlaceholder vibe={c.vibe} label={c.locationType}>
        <div style={{ position: "absolute", top: 12, right: 12 }}><StatusBadge status={c.status} /></div>
      </PhotoPlaceholder>
      <div style={{ padding: "14px 16px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
          <span className="t-h2" style={{ color: "var(--text-primary)" }}>{c.title}</span>
          <Rating value={c.rating} sessions={c.sessions} />
        </div>
        <div className="t-caption" style={{ color: "var(--text-secondary)", marginTop: 4 }}>
          Host {c.host} · {c.distance} km
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
          <PlugBadge type={c.plug} />
          <span className="badge badge-plug"><Icon name="bolt" size={12} />{c.kw} kW</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 14 }}>
          <span className="t-num" style={{ fontSize: 22, color: "var(--text-primary)" }}>R$ {c.price.toFixed(2).replace(".", ",")}</span>
          <span className="t-caption" style={{ color: "var(--text-secondary)" }}>/ kWh</span>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------
   Bottom navigation
---------------------------------------------------------- */
const NAV = [
  { id: "map", icon: "map", label: "Mapa" },
  { id: "list", icon: "list", label: "Lista" },
  { id: "sessions", icon: "bolt", label: "Sessões" },
  { id: "profile", icon: "user", label: "Perfil" },
];
function BottomNav({ active, onChange }) {
  return (
    <div style={{
      display: "flex", gap: 4, background: "var(--bg-surface)",
      border: "1px solid var(--border)", borderRadius: 24,
      boxShadow: "var(--shadow-pop)", padding: 7,
      backdropFilter: "blur(12px)",
    }}>
      {NAV.map(n => {
        const on = active === n.id;
        return (
          <button key={n.id} onClick={() => onChange(n.id)} style={{
            flex: 1, background: on ? "var(--fill-primary)" : "transparent",
            border: "none", cursor: "pointer", borderRadius: 16,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            color: on ? "var(--color-primary)" : "var(--text-tertiary)",
            fontFamily: "var(--font)", padding: "9px 0 8px",
            transition: "background .2s cubic-bezier(.2,0,0,1), color .2s",
          }}>
            <Icon name={n.icon} size={22} />
            <span style={{ fontSize: 10, fontWeight: on ? 600 : 500 }}>{n.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ----------------------------------------------------------
   Circular progress (charging)
---------------------------------------------------------- */
function CircularProgress({ pct, size = 200, stroke = 14, color = "var(--color-primary)", children }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const off = circ * (1 - pct / 100);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--bg-surface-2)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={off}
          style={{ transition: "stroke-dashoffset .6s cubic-bezier(.2,0,0,1)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center" }}>{children}</div>
    </div>
  );
}

Object.assign(window, {
  Icon, Button, StatusBadge, PlugBadge, Rating, Avatar,
  PhotoPlaceholder, ChargerCard, BottomNav, CircularProgress, STATUS, NAV,
});
