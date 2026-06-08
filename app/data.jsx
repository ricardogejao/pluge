/* global React, Icon, StatusBadge, PlugBadge, Rating, Avatar, Button */

/* ----------------------------------------------------------
   Charger data — x/y are % positions on the map
---------------------------------------------------------- */
const CHARGERS = [
  { id: "c1", title: "Garagem Vila Madalena", host: "Marina", vibe: "garage",   locationType: "Garagem residencial",
    plug: "Tipo 2", kw: 11, price: 1.20, distance: 0.4, status: "available", rating: 4.93, sessions: 128,
    address: "R. Harmonia, 248 · Vila Madalena", x: 47, y: 52, hours: "06:00 – 23:00" },
  { id: "c2", title: "Cobertura Pinheiros", host: "Rafael", vibe: "building", locationType: "Prédio · vaga coberta",
    plug: "CCS", kw: 50, price: 1.85, distance: 0.9, status: "available", rating: 4.81, sessions: 76,
    address: "R. dos Pinheiros, 1102 · Pinheiros", x: 28, y: 36, hours: "24 horas" },
  { id: "c3", title: "Quintal Perdizes", host: "Beatriz", vibe: "driveway", locationType: "Quintal · acesso fácil",
    plug: "Tipo 2", kw: 7.4, price: 0.98, distance: 1.3, status: "busy", rating: 4.67, sessions: 54,
    address: "R. Apiacás, 60 · Perdizes", x: 64, y: 28, hours: "07:00 – 22:00" },
  { id: "c4", title: "Estac. Faria Lima", host: "Diego", vibe: "parking", locationType: "Estacionamento privado",
    plug: "CHAdeMO", kw: 50, price: 2.10, distance: 1.8, status: "reserved", rating: 4.74, sessions: 91,
    address: "Av. Faria Lima, 3400 · Itaim", x: 72, y: 64, hours: "24 horas" },
  { id: "c5", title: "Casa Sumaré", host: "Letícia", vibe: "garage", locationType: "Garagem residencial",
    plug: "Tipo 2", kw: 11, price: 1.10, distance: 2.2, status: "available", rating: 5.00, sessions: 33,
    address: "R. Cardoso de Almeida, 880 · Sumaré", x: 38, y: 74, hours: "08:00 – 20:00" },
  { id: "c6", title: "Loft Higienópolis", host: "André", vibe: "building", locationType: "Prédio · subsolo",
    plug: "CCS", kw: 22, price: 1.55, distance: 2.6, status: "available", rating: 4.88, sessions: 142,
    address: "Av. Angélica, 1500 · Higienópolis", x: 56, y: 18, hours: "24 horas" },
];

/* ----------------------------------------------------------
   Dark vector map — drawn street grid
---------------------------------------------------------- */
function MapBase() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 720" preserveAspectRatio="xMidYMid slice"
      style={{ position: "absolute", inset: 0 }}>
      <rect width="400" height="720" fill="var(--map-bg)" />
      {/* park */}
      <path d="M30 380 Q90 350 150 400 T250 430 L240 540 Q150 560 60 530 Z" fill="var(--map-park)" />
      {/* river */}
      <path d="M-20 600 Q120 560 220 640 T460 660 L460 760 L-20 760 Z" fill="var(--map-river)" />
      <path d="M-20 600 Q120 560 220 640 T460 660" fill="none" stroke="var(--map-river-line)" strokeWidth="3" />
      {/* blocks */}
      {[
        [40,60,90,70],[150,40,80,90],[250,60,90,80],[60,180,80,80],[160,160,70,70],
        [255,170,90,90],[40,300,80,60],[280,300,80,70],[160,560,90,80],[40,640,90,70],[270,600,90,90],
      ].map(([x,y,w,h],i)=>(
        <rect key={i} x={x} y={y} width={w} height={h} rx="3" fill="var(--map-block)" />
      ))}
      {/* roads */}
      <g stroke="var(--map-road)" strokeWidth="9" strokeLinecap="round">
        <line x1="0" y1="150" x2="400" y2="135" />
        <line x1="0" y1="285" x2="400" y2="295" />
        <line x1="0" y1="560" x2="400" y2="545" />
        <line x1="145" y1="0" x2="135" y2="720" />
        <line x1="245" y1="0" x2="255" y2="720" />
        <line x1="40" y1="0" x2="60" y2="720" />
      </g>
      {/* diagonal avenue */}
      <line x1="-20" y1="60" x2="420" y2="500" stroke="var(--map-road2)" strokeWidth="12" strokeLinecap="round" />
      <line x1="-20" y1="60" x2="420" y2="500" stroke="var(--map-ave-line)" strokeWidth="2" strokeDasharray="2 10" />
    </svg>
  );
}

/* Pin variants */
function MapPin({ c, active, onClick }) {
  let bg = "var(--color-primary)", fg = "#000", ring = "var(--ring-primary)";
  if (c.status === "busy" || c.status === "reserved") { bg = "var(--bg-surface-2)"; fg = "var(--text-tertiary)"; ring = "transparent"; }
  if (c.urgent) { bg = "var(--color-urgent)"; fg = "#fff"; ring = "rgba(255,107,53,.3)"; }
  const sz = active ? 46 : 38;
  return (
    <button onClick={() => onClick(c)} style={{
      position: "absolute", left: c.x + "%", top: c.y + "%", transform: "translate(-50%,-50%)",
      width: sz, height: sz, borderRadius: "50%", background: bg, border: "none", cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
      boxShadow: active ? `0 0 0 6px ${ring}, 0 6px 18px rgba(0,0,0,.5)` : `0 0 0 4px ${ring}, 0 4px 12px rgba(0,0,0,.4)`,
      transition: "all .18s cubic-bezier(.2,0,0,1)", zIndex: active ? 5 : 2,
    }}>
      <Icon name="bolt" size={active ? 22 : 18} color={fg} />
    </button>
  );
}

/* ----------------------------------------------------------
   Reservation bottom sheet (Uber-style)
---------------------------------------------------------- */
function BottomSheet({ c, onReserve, onDetails }) {
  if (!c) return null;
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, bottom: 0, background: "var(--bg-surface)",
      borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: "12px 18px 92px",
      boxShadow: "var(--shadow-sheet)", zIndex: 10,
    }}>
      <div style={{ width: 40, height: 4, borderRadius: 2, background: "var(--bg-surface-2)", margin: "0 auto 16px" }} />
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Avatar name={c.host} size={48} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="t-h2" style={{ color: "var(--text-primary)" }}>{c.title}</div>
          <div className="t-caption" style={{ color: "var(--text-secondary)", marginTop: 2 }}>
            Host {c.host} · <Rating value={c.rating} sessions={c.sessions} />
          </div>
        </div>
        <StatusBadge status={c.status} />
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 14, alignItems: "center", color: "var(--text-secondary)" }}>
        <Icon name="map-pin" size={16} />
        <span className="t-caption" style={{ color: "var(--text-secondary)" }}>{c.address}</span>
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 14, padding: "14px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <SheetStat icon="plug" label="Plug" value={c.plug} />
        <SheetStat icon="bolt" label="Potência" value={c.kw + " kW"} />
        <SheetStat icon="clock" label="Horário" value={c.hours} />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
        <div>
          <span className="t-num" style={{ fontSize: 26, color: "var(--text-primary)" }}>R$ {c.price.toFixed(2).replace(".", ",")}</span>
          <span className="t-caption" style={{ color: "var(--text-secondary)" }}> / kWh</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="secondary" onClick={onDetails}>Ver detalhes</Button>
          <Button variant="primary" icon="bolt" onClick={() => onReserve(c)}
            disabled={c.status === "busy"}>Reservar</Button>
        </div>
      </div>
    </div>
  );
}
function SheetStat({ icon, label, value }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--text-tertiary)" }}>
        <Icon name={icon} size={13} />
        <span className="t-label" style={{ color: "var(--text-tertiary)", fontSize: 10 }}>{label}</span>
      </div>
      <div className="t-caption" style={{ color: "var(--text-primary)", marginTop: 5, fontWeight: 500 }}>{value}</div>
    </div>
  );
}

Object.assign(window, { CHARGERS, MapBase, MapPin, BottomSheet });
