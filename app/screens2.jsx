/* global React, Icon, Button, Avatar, Rating */

/* ===========================================================
   5 · DASHBOARD DO HOST
=========================================================== */
function HostScreen({ onBack }) {
  const week = [
    { d: "Seg", n: 2, h: 38 }, { d: "Ter", n: 1, h: 22 }, { d: "Qua", n: 3, h: 60 },
    { d: "Qui", n: 2, h: 44 }, { d: "Sex", n: 4, h: 82 }, { d: "Sáb", n: 3, h: 56 }, { d: "Dom", n: 1, h: 18 },
  ];
  const maxH = Math.max(...week.map(w => w.h));
  const agenda = [
    { time: "Hoje · 14:30", who: "Carla M.", car: "BYD Dolphin", kwh: "32 kWh", status: "reserved" },
    { time: "Hoje · 19:00", who: "Pedro R.", car: "Tesla Model 3", kwh: "48 kWh", status: "reserved" },
    { time: "Amanhã · 08:15", who: "Júlia S.", car: "Volvo EX30", kwh: "26 kWh", status: "reserved" },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: "var(--bg-primary)" }}>
      <div className="scroll-hide" style={{ flex: 1, overflowY: "auto", padding: "56px 18px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--bg-surface)", border: "1px solid var(--border)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="arrow-left" size={20} color="var(--text-primary)" />
          </button>
          <div>
            <div className="t-h1" style={{ color: "var(--text-primary)" }}>Painel do Host</div>
            <div className="t-caption" style={{ color: "var(--text-secondary)" }}>Junho 2026</div>
          </div>
        </div>

        {/* Earnings hero */}
        <div style={{ marginTop: 22, background: "var(--bg-surface)", borderRadius: "var(--radius-lg)", padding: "22px 20px", border: "1px solid var(--border)" }}>
          <div className="t-label" style={{ color: "var(--text-tertiary)" }}>Ganhos do mês</div>
          <div className="t-num" style={{ fontSize: 40, color: "var(--color-primary)", marginTop: 8 }}>R$ 1.284,50</div>
          <div className="t-caption" style={{ color: "var(--text-secondary)", marginTop: 6, display: "flex", alignItems: "center", gap: 5 }}>
            <Icon name="trending-up" size={15} color="var(--color-primary)" /> +18% vs. maio
          </div>
        </div>

        {/* Stat row */}
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <HostStat icon="bolt" label="Sessões" value="16" />
          <HostStat icon="clock-hour-4" label="Horas" value="32h" />
          <HostStat icon="star-filled" label="Avaliação" value="4,93" warning />
        </div>

        {/* Week chart */}
        <div className="t-label" style={{ color: "var(--text-tertiary)", marginTop: 24, marginBottom: 14 }}>Agenda da semana</div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8, height: 110, padding: "0 2px" }}>
          {week.map((w, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ width: "100%", maxWidth: 26, height: (w.h / maxH * 84) + "px", borderRadius: 6,
                background: i === 4 ? "var(--color-primary)" : "var(--bg-surface-2)" }} />
              <span className="t-caption" style={{ color: i === 4 ? "var(--color-primary)" : "var(--text-tertiary)", fontSize: 11 }}>{w.d}</span>
            </div>
          ))}
        </div>

        {/* Agenda */}
        <div className="t-label" style={{ color: "var(--text-tertiary)", marginTop: 24, marginBottom: 12 }}>Próximas reservas</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {agenda.map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--bg-surface)", borderRadius: "var(--radius-md)", padding: "12px 14px", border: "1px solid var(--border)" }}>
              <Avatar name={a.who} size={42} verified={false} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="t-body" style={{ color: "var(--text-primary)", fontWeight: 500 }}>{a.who}</div>
                <div className="t-caption" style={{ color: "var(--text-secondary)" }}>{a.car} · {a.kwh}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="t-caption" style={{ color: "var(--color-warning)", fontWeight: 600 }}>{a.time.split(" · ")[0]}</div>
                <div className="t-caption" style={{ color: "var(--text-secondary)" }}>{a.time.split(" · ")[1]}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function HostStat({ icon, label, value, warning }) {
  return (
    <div style={{ flex: 1, background: "var(--bg-surface)", borderRadius: "var(--radius-md)", padding: "14px 12px", border: "1px solid var(--border)" }}>
      <Icon name={icon} size={17} color={warning ? "var(--color-warning)" : "var(--color-primary)"} />
      <div className="t-num" style={{ fontSize: 20, color: "var(--text-primary)", marginTop: 10 }}>{value}</div>
      <div className="t-label" style={{ color: "var(--text-tertiary)", marginTop: 4 }}>{label}</div>
    </div>
  );
}

/* ===========================================================
   PERFIL
=========================================================== */
function ProfileScreen({ onOpenHost }) {
  const items = [
    { icon: "credit-card", label: "Pagamento", sub: "•••• 4827" },
    { icon: "history", label: "Histórico de sessões", sub: "23 cargas" },
    { icon: "car", label: "Meus veículos", sub: "Tesla Model 3" },
    { icon: "bell", label: "Notificações", sub: "" },
    { icon: "help-circle", label: "Ajuda e suporte", sub: "" },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: "var(--bg-primary)" }}>
      <div className="scroll-hide" style={{ flex: 1, overflowY: "auto", padding: "56px 18px 100px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Avatar name="Você" size={64} />
          <div>
            <div className="t-h1" style={{ color: "var(--text-primary)" }}>Lucas Andrade</div>
            <div className="t-caption" style={{ color: "var(--text-secondary)", marginTop: 2 }}>
              <Rating value={4.91} sessions={23} />
            </div>
          </div>
        </div>

        {/* Host CTA */}
        <div onClick={onOpenHost} style={{ marginTop: 22, cursor: "pointer", background: "var(--bg-surface)", borderRadius: "var(--radius-lg)", padding: "18px 18px", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--fill-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="charging-pile" size={24} color="var(--color-primary)" />
          </div>
          <div style={{ flex: 1 }}>
            <div className="t-h2" style={{ color: "var(--text-primary)" }}>Painel do Host</div>
            <div className="t-caption" style={{ color: "var(--text-secondary)", marginTop: 2 }}>R$ 1.284,50 este mês · 16 sessões</div>
          </div>
          <Icon name="chevron-right" size={20} color="var(--text-tertiary)" />
        </div>

        <div style={{ marginTop: 16, background: "var(--bg-surface)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", overflow: "hidden" }}>
          {items.map((it, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px",
              borderTop: i ? "1px solid var(--border)" : "none", cursor: "pointer" }}>
              <Icon name={it.icon} size={20} color="var(--text-secondary)" />
              <span className="t-body" style={{ flex: 1, color: "var(--text-primary)" }}>{it.label}</span>
              {it.sub && <span className="t-caption" style={{ color: "var(--text-tertiary)" }}>{it.sub}</span>}
              <Icon name="chevron-right" size={18} color="var(--text-tertiary)" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HostScreen, ProfileScreen });
