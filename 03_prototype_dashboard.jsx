import { useState } from "react";

const ACCOUNTS = [
  {
    id: 1,
    name: "Meridian Health Partners",
    contact: "Sarah Chen · VP Strategy",
    stage: "Contracting",
    stageIndex: 3,
    lastContact: 3,
    priority: "High",
    health: "warm",
    aiSummary: "Sarah confirmed budget approval in the Nov 14 thread. Legal review is underway on their end — she mentioned their counsel needs 2–3 weeks. Relationship is warm; she asked a personal question about your SF trip.",
    nextAction: "Follow up on legal timeline — check in without pressure",
    draftMessage: "Hi Sarah — hope the week's been kind. Just wanted to check in on how the legal review is progressing on your end. No rush at all, just want to make sure we're set for a smooth close. Let me know if there's anything we can do to help move things along!",
    threads: 12,
    sentiment: 88,
    stageSuggestion: "Active Client",
    tags: ["Healthcare", "Q4 Close"],
  },
  {
    id: 2,
    name: "Beacon Capital Group",
    contact: "Marcus Webb · Managing Director",
    stage: "Proposal",
    stageIndex: 2,
    lastContact: 18,
    priority: "High",
    health: "cooling",
    aiSummary: "Last meaningful exchange was 18 days ago when Marcus requested the revised scope doc. He opened it (read receipt confirmed) but hasn't responded. Prior to that, two strong calls where he mentioned Q1 budget approval. Radio silence is unusual for him.",
    nextAction: "Re-engage with a value-add touchpoint — not a direct follow-up ask",
    draftMessage: "Hi Marcus — I came across this piece on LP portfolio optimization that felt relevant given what you shared about your Q1 priorities. Thought it might be useful context. Would love to reconnect whenever timing works for you.",
    threads: 8,
    sentiment: 52,
    stageSuggestion: null,
    tags: ["FinServ", "At Risk"],
  },
  {
    id: 3,
    name: "Thornfield Manufacturing",
    contact: "Elena Rossi · COO",
    stage: "Active Client",
    stageIndex: 4,
    lastContact: 7,
    priority: "Medium",
    health: "warm",
    aiSummary: "Ongoing engagement — last call was productive. Elena flagged a potential expansion opportunity into their European ops division. She mentioned wanting to introduce us to their EMEA lead in January. Strong relationship with consistent responsiveness.",
    nextAction: "Schedule January intro call with EMEA lead",
    draftMessage: "Hi Elena — following up on our last conversation. You mentioned potentially introducing us to your EMEA lead in January — would love to get something on the calendar before the holidays get busy. When works for a quick call to coordinate?",
    threads: 31,
    sentiment: 94,
    stageSuggestion: null,
    tags: ["Manufacturing", "Expansion"],
  },
  {
    id: 4,
    name: "Axiom Digital Ventures",
    contact: "Priya Nair · Head of Partnerships",
    stage: "Qualified",
    stageIndex: 1,
    lastContact: 34,
    priority: "Medium",
    health: "cold",
    aiSummary: "Initial discovery call in October went well — Priya was enthusiastic. She said she'd 'loop in her CEO after the board meeting.' No contact since. 34 days of silence. The original interest was genuine; the delay is likely internal prioritization, not disinterest.",
    nextAction: "Re-engage with light touch — acknowledge the gap, reference original conversation",
    draftMessage: "Hi Priya — I know Q4 tends to be a blur. I've been thinking about the conversation we had in October and the alignment you mentioned around your 2025 partnership goals. Would love to reconnect when you surface for air — even a quick 20-minute catch-up would be great.",
    threads: 3,
    sentiment: 34,
    stageSuggestion: null,
    tags: ["Tech", "Re-engage"],
  },
  {
    id: 5,
    name: "Harrow & Associates",
    contact: "David Harrow · Founding Partner",
    stage: "Prospect",
    stageIndex: 0,
    lastContact: 2,
    priority: "Low",
    health: "warm",
    aiSummary: "Warm intro from Elena (Thornfield) last week. Initial email exchange very positive — David is curious but early stage. He mentioned reviewing our website and having 'a few questions.' No urgency; building relationship.",
    nextAction: "Schedule introductory call — David expressed interest in a call",
    draftMessage: "Hi David — great connecting via Elena. I'd love to learn more about where you're focused and share a bit about what we've been working on. Would a 30-minute intro call this week or next work for you?",
    threads: 2,
    sentiment: 76,
    stageSuggestion: "Qualified",
    tags: ["Consulting", "New"],
  },
];

const STAGES = ["Prospect", "Qualified", "Proposal", "Contracting", "Active Client"];

const HEALTH_CONFIG = {
  warm: { label: "Warm", color: "#1a7a4a", bg: "#d4f0e0", dot: "#1a7a4a" },
  cooling: { label: "Cooling", color: "#b85c00", bg: "#fde8da", dot: "#d4522a" },
  cold: { label: "Cold", color: "#5c2a90", bg: "#ede0f8", dot: "#7c44c0" },
};

const PRIORITY_COLOR = {
  High: { bg: "#1a1a1a", color: "#fff" },
  Medium: { bg: "#555", color: "#fff" },
  Low: { bg: "#ddd", color: "#444" },
};

function Tag({ children, style }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: 4,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      border: "1px solid rgba(0,0,0,0.1)",
      ...style
    }}>{children}</span>
  );
}

function SentimentBar({ value }) {
  const color = value >= 75 ? "#1a7a4a" : value >= 50 ? "#b85c00" : "#7c44c0";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 4, background: "#eee", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 2, transition: "width 0.6s ease" }} />
      </div>
      <span style={{ fontSize: 12, color, fontWeight: 600, minWidth: 28 }}>{value}</span>
    </div>
  );
}

function StageBar({ current }) {
  return (
    <div style={{ display: "flex", gap: 2, marginBottom: 4 }}>
      {STAGES.map((s, i) => (
        <div key={s} style={{
          flex: 1,
          height: 4,
          borderRadius: 2,
          background: i <= current ? "#d4522a" : "#e5e2db",
          transition: "background 0.3s",
        }} title={s} />
      ))}
    </div>
  );
}

function AccountCard({ account, onClick, selected }) {
  const h = HEALTH_CONFIG[account.health];
  const p = PRIORITY_COLOR[account.priority];
  return (
    <div
      onClick={() => onClick(account)}
      style={{
        background: selected ? "#0f0e0c" : "white",
        color: selected ? "white" : "#0f0e0c",
        border: `1.5px solid ${selected ? "#0f0e0c" : "#ddd9d0"}`,
        borderRadius: 10,
        padding: "16px 18px",
        cursor: "pointer",
        transition: "all 0.15s",
        marginBottom: 8,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{account.name}</div>
          <div style={{ fontSize: 12, color: selected ? "rgba(255,255,255,0.6)" : "#7a7468" }}>{account.contact}</div>
        </div>
        <Tag style={{ background: p.bg, color: p.color, border: "none" }}>{account.priority}</Tag>
      </div>

      <StageBar current={account.stageIndex} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{
            display: "inline-block",
            width: 7, height: 7,
            borderRadius: "50%",
            background: h.dot,
            flexShrink: 0,
          }} />
          <span style={{ fontSize: 12, color: selected ? "rgba(255,255,255,0.7)" : h.color, fontWeight: 500 }}>{h.label}</span>
        </div>
        <span style={{ fontSize: 12, color: selected ? "rgba(255,255,255,0.5)" : "#7a7468" }}>
          {account.lastContact === 0 ? "Today" : `${account.lastContact}d ago`}
        </span>
      </div>
    </div>
  );
}

function DetailPanel({ account, onClose }) {
  const [tab, setTab] = useState("overview");
  const [draftEdited, setDraftEdited] = useState(account.draftMessage);
  const [stageConfirmed, setStageConfirmed] = useState(false);
  const [stageDismissed, setStageDismissed] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const h = HEALTH_CONFIG[account.health];

  const handleSend = () => {
    setMessageSent(true);
    setTimeout(() => setMessageSent(false), 3000);
  };

  return (
    <div style={{
      flex: 1,
      background: "#f7f4ef",
      height: "100%",
      overflow: "auto",
      padding: "32px 36px",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
            <span style={{
              fontFamily: "monospace",
              fontSize: 10,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#7a7468",
            }}>Account Detail</span>
          </div>
          <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 26, fontWeight: 700, marginBottom: 4, color: "#0f0e0c" }}>
            {account.name}
          </h2>
          <div style={{ fontSize: 14, color: "#7a7468" }}>{account.contact}</div>
        </div>
        <button onClick={onClose} style={{
          background: "none", border: "1.5px solid #ddd9d0", borderRadius: 6,
          padding: "6px 12px", cursor: "pointer", fontSize: 13, color: "#7a7468",
        }}>← Back</button>
      </div>

      {/* Quick stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
        {[
          { label: "Stage", value: account.stage },
          { label: "Last Contact", value: account.lastContact === 0 ? "Today" : `${account.lastContact} days ago` },
          { label: "Threads", value: account.threads },
          { label: "Relationship Health", value: h.label },
        ].map(({ label, value }) => (
          <div key={label} style={{ background: "white", border: "1px solid #ddd9d0", borderRadius: 8, padding: "12px 16px" }}>
            <div style={{ fontSize: 11, color: "#7a7468", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#0f0e0c" }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Stage bar */}
      <div style={{ background: "white", border: "1px solid #ddd9d0", borderRadius: 8, padding: "16px 20px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#7a7468", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Pipeline Stage</div>
        <div style={{ display: "flex", gap: 0 }}>
          {STAGES.map((s, i) => (
            <div key={s} style={{ flex: 1, textAlign: "center" }}>
              <div style={{
                height: 6,
                background: i <= account.stageIndex ? "#d4522a" : "#e5e2db",
                borderRadius: i === 0 ? "4px 0 0 4px" : i === STAGES.length - 1 ? "0 4px 4px 0" : 0,
                marginBottom: 6,
              }} />
              <div style={{
                fontSize: 11,
                color: i === account.stageIndex ? "#d4522a" : "#7a7468",
                fontWeight: i === account.stageIndex ? 700 : 400,
              }}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stage suggestion banner */}
      {account.stageSuggestion && !stageConfirmed && !stageDismissed && (
        <div style={{
          background: "#fff8e7",
          border: "1.5px solid #f0d070",
          borderRadius: 8,
          padding: "14px 18px",
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#b85c00", marginBottom: 2 }}>🤖 AI Stage Suggestion</div>
            <div style={{ fontSize: 13, color: "#4a3a00" }}>
              Conversation signals suggest advancing to <strong>{account.stageSuggestion}</strong>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setStageConfirmed(true)} style={{
              background: "#0f0e0c", color: "white", border: "none", borderRadius: 6,
              padding: "7px 14px", cursor: "pointer", fontSize: 12, fontWeight: 600,
            }}>Confirm</button>
            <button onClick={() => setStageDismissed(true)} style={{
              background: "white", color: "#7a7468", border: "1px solid #ddd9d0", borderRadius: 6,
              padding: "7px 14px", cursor: "pointer", fontSize: 12,
            }}>Dismiss</button>
          </div>
        </div>
      )}
      {stageConfirmed && (
        <div style={{ background: "#d4f0e0", border: "1px solid #b0e8c8", borderRadius: 8, padding: "10px 16px", marginBottom: 16, fontSize: 13, color: "#1a5c34" }}>
          ✓ Stage updated to <strong>{account.stageSuggestion}</strong>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "2px solid #ddd9d0" }}>
        {["overview", "draft"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: "none",
            border: "none",
            borderBottom: tab === t ? "2px solid #d4522a" : "2px solid transparent",
            marginBottom: -2,
            padding: "8px 18px",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: tab === t ? 600 : 400,
            color: tab === t ? "#d4522a" : "#7a7468",
            textTransform: "capitalize",
          }}>{t === "draft" ? "Follow-up Draft" : "AI Overview"}</button>
        ))}
      </div>

      {tab === "overview" && (
        <div>
          {/* AI Summary */}
          <div style={{ background: "white", border: "1px solid #ddd9d0", borderRadius: 8, padding: "20px", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: "#7a7468", textTransform: "uppercase", letterSpacing: "0.08em" }}>🤖 AI Relationship Summary</div>
              <span style={{ fontSize: 11, color: "#7a7468" }}>Updated 2h ago</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "#2a2824", margin: 0 }}>{account.aiSummary}</p>
          </div>

          {/* Sentiment */}
          <div style={{ background: "white", border: "1px solid #ddd9d0", borderRadius: 8, padding: "20px", marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: "#7a7468", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Relationship Sentiment Score</div>
            <SentimentBar value={account.sentiment} />
            <div style={{ fontSize: 12, color: "#7a7468", marginTop: 8 }}>
              Based on {account.threads} analyzed email threads
            </div>
          </div>

          {/* Next action */}
          <div style={{ background: "#fff8e7", border: "1.5px solid #f0d070", borderRadius: 8, padding: "18px 20px" }}>
            <div style={{ fontSize: 11, color: "#b85c00", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 8 }}>Suggested Next Action</div>
            <p style={{ fontSize: 14, color: "#2a1a00", margin: 0, lineHeight: 1.6 }}>{account.nextAction}</p>
          </div>

          {/* Tags */}
          <div style={{ marginTop: 16, display: "flex", gap: 6, flexWrap: "wrap" }}>
            {account.tags.map(t => (
              <Tag key={t} style={{ background: "#f0f0f0", color: "#444" }}>{t}</Tag>
            ))}
          </div>
        </div>
      )}

      {tab === "draft" && (
        <div>
          <div style={{ background: "white", border: "1px solid #ddd9d0", borderRadius: 8, padding: "20px", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: "#7a7468", textTransform: "uppercase", letterSpacing: "0.08em" }}>🤖 AI-Drafted Message</div>
              <Tag style={{ background: "#fde8da", color: "#8c3010", border: "none" }}>Review before sending</Tag>
            </div>
            <textarea
              value={draftEdited}
              onChange={e => setDraftEdited(e.target.value)}
              style={{
                width: "100%",
                minHeight: 140,
                border: "1.5px solid #e5e2db",
                borderRadius: 6,
                padding: "14px",
                fontSize: 14,
                lineHeight: 1.7,
                color: "#0f0e0c",
                fontFamily: "inherit",
                resize: "vertical",
                background: "#fdfcfa",
              }}
            />
            <div style={{ fontSize: 12, color: "#7a7468", marginTop: 8 }}>
              ✏️ Edit this draft before sending. AI never sends on your behalf.
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={handleSend} style={{
              background: "#0f0e0c", color: "white", border: "none",
              borderRadius: 8, padding: "12px 24px", cursor: "pointer",
              fontSize: 14, fontWeight: 600, flex: 1,
            }}>
              {messageSent ? "✓ Marked as Sent" : "Open in Email Client →"}
            </button>
            <button onClick={() => setDraftEdited(account.draftMessage)} style={{
              background: "white", color: "#7a7468",
              border: "1.5px solid #ddd9d0", borderRadius: 8,
              padding: "12px 18px", cursor: "pointer", fontSize: 13,
            }}>Reset Draft</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const alerts = ACCOUNTS.filter(a => a.health === "cold" || (a.health === "cooling" && a.lastContact > 14));

  const filtered = ACCOUNTS.filter(a => {
    if (filter !== "All" && a.health !== filter.toLowerCase() && a.stage !== filter) return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.contact.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const healthCounts = {
    warm: ACCOUNTS.filter(a => a.health === "warm").length,
    cooling: ACCOUNTS.filter(a => a.health === "cooling").length,
    cold: ACCOUNTS.filter(a => a.health === "cold").length,
  };

  return (
    <div style={{
      fontFamily: "'DM Sans', -apple-system, sans-serif",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "#f7f4ef",
      color: "#0f0e0c",
    }}>
      {/* Top nav */}
      <div style={{
        background: "#0f0e0c",
        color: "white",
        padding: "0 24px",
        height: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 26, height: 26, background: "#d4522a",
            borderRadius: 6, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 13, fontWeight: 700, color: "white",
          }}>A</div>
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.01em" }}>Ajaia CRM Intelligence</span>
          <span style={{
            fontSize: 10, background: "rgba(212,82,42,0.25)", color: "#ff9f7a",
            padding: "2px 7px", borderRadius: 10, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600,
          }}>V1 Prototype</span>
        </div>
        <div style={{ display: "flex", gap: 24, fontSize: 13 }}>
          {["Dashboard", "Accounts", "Alerts", "Digest"].map(item => (
            <span key={item} style={{
              color: item === "Dashboard" ? "white" : "rgba(255,255,255,0.5)",
              cursor: "pointer", fontWeight: item === "Dashboard" ? 600 : 400,
            }}>{item}</span>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* LEFT PANEL */}
        <div style={{
          width: 320,
          flexShrink: 0,
          background: "#f0ede8",
          borderRight: "1px solid #ddd9d0",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}>
          {/* Health summary */}
          <div style={{ padding: "16px 16px 0" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 14 }}>
              {Object.entries(healthCounts).map(([h, count]) => {
                const cfg = HEALTH_CONFIG[h];
                return (
                  <div key={h} onClick={() => setFilter(filter === h ? "All" : h)} style={{
                    background: filter === h ? cfg.dot : "white",
                    border: `1.5px solid ${filter === h ? cfg.dot : "#ddd9d0"}`,
                    borderRadius: 8,
                    padding: "10px 8px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: filter === h ? "white" : cfg.color }}>{count}</div>
                    <div style={{ fontSize: 10, color: filter === h ? "rgba(255,255,255,0.8)" : cfg.color, textTransform: "uppercase", letterSpacing: "0.08em" }}>{cfg.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Search */}
            <div style={{ position: "relative", marginBottom: 12 }}>
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#7a7468", fontSize: 14 }}>🔍</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search accounts..."
                style={{
                  width: "100%",
                  border: "1.5px solid #ddd9d0",
                  borderRadius: 7,
                  padding: "8px 10px 8px 30px",
                  fontSize: 13,
                  background: "white",
                  color: "#0f0e0c",
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
            </div>
          </div>

          {/* Alerts strip */}
          {alerts.length > 0 && (
            <div style={{
              margin: "0 16px 12px",
              background: "#fff3ee",
              border: "1.5px solid #ffcab5",
              borderRadius: 8,
              padding: "10px 12px",
            }}>
              <div style={{ fontSize: 11, color: "#d4522a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
                🔔 {alerts.length} Re-engagement Alert{alerts.length > 1 ? "s" : ""}
              </div>
              {alerts.map(a => (
                <div key={a.id} onClick={() => setSelected(a)} style={{
                  fontSize: 12, color: "#2a2824", cursor: "pointer",
                  padding: "3px 0",
                  borderBottom: "1px solid rgba(212,82,42,0.1)",
                }}>
                  {a.name} · {a.lastContact}d silent
                </div>
              ))}
            </div>
          )}

          {/* Account list */}
          <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 16px" }}>
            <div style={{ fontSize: 11, color: "#7a7468", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, marginTop: 4 }}>
              {filtered.length} Account{filtered.length !== 1 ? "s" : ""}
            </div>
            {filtered.map(a => (
              <AccountCard
                key={a.id}
                account={a}
                onClick={setSelected}
                selected={selected?.id === a.id}
              />
            ))}
          </div>
        </div>

        {/* MAIN PANEL */}
        {selected ? (
          <DetailPanel account={selected} onClose={() => setSelected(null)} />
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#7a7468" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>👈</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Select an account</div>
            <div style={{ fontSize: 13 }}>Click any account to view AI insights, sentiment, and follow-up drafts</div>

            {/* Stats overview */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 48, width: "100%", maxWidth: 560, padding: "0 40px" }}>
              {[
                { value: ACCOUNTS.length, label: "Total Accounts" },
                { value: alerts.length, label: "Need Re-engagement" },
                { value: ACCOUNTS.filter(a => a.stageSuggestion).length, label: "Stage Suggestions" },
              ].map(({ value, label }) => (
                <div key={label} style={{ background: "white", border: "1px solid #ddd9d0", borderRadius: 10, padding: "20px 16px", textAlign: "center" }}>
                  <div style={{ fontFamily: "Georgia, serif", fontSize: 32, fontWeight: 700, color: "#d4522a" }}>{value}</div>
                  <div style={{ fontSize: 12, color: "#7a7468", marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
