/* global React, Icon, Button, StatusBadge, PlugBadge, Rating, Avatar, PhotoPlaceholder, ChargerCard, CircularProgress, CHARGERS, MapBase, MapPin, BottomSheet */
const { useState: useS, useEffect: useE } = React;

/* ===========================================================
   1 · HOME / MAP
=========================================================== */
function MapScreen({ selected, onSelectPin, onReserve, onDetails, emergency, onToggleEmergency }) {
  const list = emergency
    ? CHARGERS.map((c, i) => ({ ...c, urgent: i === 0 && c.status === "available" }))
    : CHARGERS;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <MapBase />
      {list.map(c => (
        <MapPin key={c.id} c={c} active={selected && selected.id === c.id} onClick={onSelectPin} />
      ))}

      {/* Search */}
      <div style={{ position: "absolute", top: 56, left: 16, right: 16, zIndex: 8 }}>
        <div className="input" style={{ boxShadow: "var(--shadow-pop)" }}>
          <Icon name="search" size={20} />
          <input placeholder="Onde você está?" readOnly />
          <Icon name="adjustments-horizontal" size={20} color="var(--text-primary)" />
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }} className="scroll-hide">
          {["Disponível agora", "Tipo 2", "CCS", "Até R$ 1,50"].map(f => (
            <span key={f} className="badge" style={{
              background: "var(--bg-surface)", color: "var(--text-secondary)",
              borderRadius: 999, padding: "8px 13px", border: "1px solid var(--border)",
              boxShadow: "var(--shadow-pop)",
            }}>{f}</span>
          ))}
        </div>
      </div>

      {/* Emergency toggle */}
      <button onClick={onToggleEmergency} style={{
        position: "absolute", right: 16, bottom: selected ? 300 : 96, zIndex: 9,
        width: 52, height: 52, borderRadius: "50%", border: "none", cursor: "pointer",
        background: emergency ? "var(--color-urgent)" : "var(--bg-surface)",
        boxShadow: "var(--shadow-pop)", display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background .2s, bottom .25s cubic-bezier(.2,0,0,1)",
      }}>
        <Icon name="bolt" size={24} color={emergency ? "#fff" : "var(--color-urgent)"} />
      </button>

      <BottomSheet c={selected} onReserve={onReserve} onDetails={onDetails} />
    </div>
  );
}

/* ===========================================================
   2 · LISTA
=========================================================== */
function ListScreen({ onOpen }) {
  const [sort, setSort] = useS("near");
  const chips = [{ id: "near", label: "Mais perto" }, { id: "price", label: "Menor preço" }, { id: "rating", label: "Melhor avaliado" }];
  let data = [...CHARGERS];
  if (sort === "price") data.sort((a, b) => a.price - b.price);
  if (sort === "rating") data.sort((a, b) => b.rating - a.rating);
  if (sort === "near") data.sort((a, b) => a.distance - b.distance);
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: "var(--bg-primary)" }}>
      <div style={{ padding: "56px 18px 12px" }}>
        <div className="t-display" style={{ color: "var(--text-primary)" }}>Carregadores</div>
        <div className="t-caption" style={{ color: "var(--text-secondary)", marginTop: 4 }}>
          {CHARGERS.length} perto de você · Vila Madalena, SP
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 16 }} className="scroll-hide">
          {chips.map(ch => (
            <button key={ch.id} onClick={() => setSort(ch.id)} style={{
              border: "none", cursor: "pointer", fontFamily: "var(--font)", fontSize: 12, fontWeight: 600,
              padding: "8px 14px", borderRadius: 999, whiteSpace: "nowrap",
              background: sort === ch.id ? "var(--color-primary)" : "var(--bg-surface-2)",
              color: sort === ch.id ? "#000" : "var(--text-secondary)",
            }}>{ch.label}</button>
          ))}
        </div>
      </div>
      <div className="scroll-hide" style={{ flex: 1, overflowY: "auto", padding: "4px 18px 100px", display: "flex", flexDirection: "column", gap: 16 }}>
        {data.map(c => <ChargerCard key={c.id} c={c} onClick={() => onOpen(c)} />)}
      </div>
    </div>
  );
}

/* ===========================================================
   3 · DETALHE
=========================================================== */
function DetailScreen({ c, onBack, onReserve }) {
  if (!c) return null;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: "var(--bg-primary)" }}>
      <div className="scroll-hide" style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ position: "relative" }}>
          <PhotoPlaceholder vibe={c.vibe} height={280} label={c.locationType} topInset={56} />
          <button onClick={onBack} style={{
            position: "absolute", top: 52, left: 16, width: 40, height: 40, borderRadius: "50%",
            background: "rgba(10,10,10,.6)", backdropFilter: "blur(8px)", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}><Icon name="arrow-left" size={20} color="#fff" /></button>
          <div style={{ position: "absolute", bottom: 14, right: 16 }}><StatusBadge status={c.status} /></div>
        </div>

        <div style={{ padding: "20px 18px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div className="t-h1" style={{ color: "var(--text-primary)" }}>{c.title}</div>
          </div>
          <div style={{ marginTop: 8 }}><Rating value={c.rating} sessions={c.sessions} size={15} /></div>
          <div className="t-caption" style={{ color: "var(--text-secondary)", marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="map-pin" size={15} />{c.address}
          </div>

          {/* Host */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 20, padding: "14px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
            <Avatar name={c.host} size={48} />
            <div style={{ flex: 1 }}>
              <div className="t-h2" style={{ color: "var(--text-primary)" }}>Host {c.host}</div>
              <div className="t-caption" style={{ color: "var(--text-secondary)" }}>Verificado · responde em ~5 min</div>
            </div>
            <button style={{ width: 42, height: 42, borderRadius: "50%", background: "var(--bg-surface-2)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="message-2" size={19} color="var(--text-primary)" />
            </button>
          </div>

          {/* Specs */}
          <div className="t-label" style={{ color: "var(--text-tertiary)", marginTop: 22, marginBottom: 12 }}>Especificações</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Spec icon="plug" label="Tipo de plug" value={c.plug} />
            <Spec icon="bolt" label="Potência" value={c.kw + " kW"} />
            <Spec icon="clock" label="Disponível" value={c.hours} />
            <Spec icon="gauge" label="Tempo médio" value={"~" + Math.round(40 / c.kw * 60) + " min"} />
          </div>

          {/* Mini map */}
          <div className="t-label" style={{ color: "var(--text-tertiary)", marginTop: 22, marginBottom: 12 }}>Localização</div>
          <div style={{ position: "relative", height: 140, borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--border)" }}>
            <MapBase />
            <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
              width: 40, height: 40, borderRadius: "50%", background: "var(--color-primary)",
              display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 6px var(--ring-primary)" }}>
              <Icon name="bolt" size={20} color="#000" />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky reserve bar */}
      <div style={{ padding: "14px 18px 22px", borderTop: "1px solid var(--border)", background: "var(--bg-primary)",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div>
          <span className="t-num" style={{ fontSize: 24, color: "var(--text-primary)" }}>R$ {c.price.toFixed(2).replace(".", ",")}</span>
          <span className="t-caption" style={{ color: "var(--text-secondary)" }}> / kWh</span>
        </div>
        <Button variant="primary" lg icon="bolt" onClick={() => onReserve(c)} disabled={c.status === "busy"}
          style={{ flex: 1, maxWidth: 200 }}>Reservar agora</Button>
      </div>
    </div>
  );
}
function Spec({ icon, label, value }) {
  return (
    <div style={{ background: "var(--bg-surface)", borderRadius: "var(--radius-md)", padding: "14px 14px", border: "1px solid var(--border)" }}>
      <Icon name={icon} size={18} color="var(--color-primary)" />
      <div className="t-label" style={{ color: "var(--text-tertiary)", marginTop: 10 }}>{label}</div>
      <div className="t-body" style={{ color: "var(--text-primary)", fontWeight: 500, marginTop: 4 }}>{value}</div>
    </div>
  );
}

/* ===========================================================
   4 · SESSÃO ATIVA
=========================================================== */
function SessionScreen({ session, onEnd, onGoMap }) {
  if (!session) {
    return (
      <div style={{ position: "absolute", inset: 0, background: "var(--bg-primary)", display: "flex",
        flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
        <div style={{ width: 88, height: 88, borderRadius: "50%", background: "var(--bg-surface)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="bolt" size={40} color="var(--text-tertiary)" />
        </div>
        <div className="t-h1" style={{ color: "var(--text-primary)", marginTop: 22 }}>Nenhuma sessão ativa</div>
        <div className="t-body" style={{ color: "var(--text-secondary)", marginTop: 8, maxWidth: 240 }}>
          Reserve um carregador no mapa para iniciar uma sessão de carga.
        </div>
        <div style={{ marginTop: 24 }}><Button variant="primary" icon="map" onClick={onGoMap}>Abrir o mapa</Button></div>
      </div>
    );
  }
  const c = session.charger;
  const remaining = Math.max(0, Math.ceil((100 - session.pct) / 100 * session.totalMin));
  return (
    <div style={{ position: "absolute", inset: 0, background: "var(--bg-primary)", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "56px 18px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div className="t-label" style={{ color: "var(--color-primary)" }}>● Sessão ativa</div>
          <div className="t-h2" style={{ color: "var(--text-primary)", marginTop: 6 }}>{c.title}</div>
        </div>
        <StatusBadge status="charging" />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
        <CircularProgress pct={session.pct} size={216} stroke={16}>
          <Icon name="bolt-filled" size={24} color="var(--color-primary)" />
          <div className="t-num" style={{ fontSize: 52, color: "var(--text-primary)", marginTop: 4 }}>{Math.round(session.pct)}<span style={{ fontSize: 24 }}>%</span></div>
          <div className="t-caption" style={{ color: "var(--text-secondary)" }}>bateria</div>
        </CircularProgress>
        <div className="t-caption" style={{ color: "var(--text-secondary)", marginTop: 14 }}>
          {session.pct >= 100 ? "Carga concluída" : `~${remaining} min restantes`}
        </div>
      </div>

      <div style={{ padding: "0 18px" }}>
        <div style={{ display: "flex", gap: 10 }}>
          <Metric label="Energia" value={session.kwh.toFixed(1)} unit="kWh" />
          <Metric label="Tempo" value={fmtTime(session.elapsed)} unit="" />
          <Metric label="Custo" value={"R$ " + session.cost.toFixed(2).replace(".", ",")} unit="" accent />
        </div>
      </div>

      <div style={{ padding: "18px 18px 96px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "var(--bg-surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
          <Avatar name={c.host} size={40} />
          <div style={{ flex: 1 }}>
            <div className="t-body" style={{ color: "var(--text-primary)", fontWeight: 500 }}>Host {c.host}</div>
            <div className="t-caption" style={{ color: "var(--text-secondary)" }}>{c.plug} · {c.kw} kW · R$ {c.price.toFixed(2).replace(".", ",")}/kWh</div>
          </div>
          <Icon name="message-2" size={20} color="var(--text-secondary)" />
        </div>
        <Button variant="urgent" block lg icon="player-stop-filled" onClick={onEnd}>Encerrar sessão</Button>
      </div>
    </div>
  );
}
function Metric({ label, value, unit, accent }) {
  return (
    <div style={{ flex: 1, background: "var(--bg-surface)", borderRadius: "var(--radius-md)", padding: "14px 12px", border: "1px solid var(--border)", textAlign: "center" }}>
      <div className="t-label" style={{ color: "var(--text-tertiary)" }}>{label}</div>
      <div className="t-num" style={{ fontSize: 20, color: accent ? "var(--color-primary)" : "#fff", marginTop: 8 }}>
        {value}{unit && <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)" }}> {unit}</span>}
      </div>
    </div>
  );
}
function fmtTime(sec) {
  const m = Math.floor(sec / 60), s = Math.floor(sec % 60);
  return m + ":" + String(s).padStart(2, "0");
}

Object.assign(window, { MapScreen, ListScreen, DetailScreen, SessionScreen, fmtTime });
