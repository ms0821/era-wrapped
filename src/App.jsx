import { useState, useEffect } from "react";

const STORAGE_KEY = "era_wrapped_history";

const TR = {
  appName: "Era Wrapped",
  tagline: { tr: "Bu ay hangi era'daydın?", en: "What era were you in this month?" },
  sub: { tr: "Her ay yeni bir keşif. Takip et, karşılaştır, paylaş.", en: "A new discovery every month. Track, compare, share." },
  start: { tr: "Başla", en: "Start" },
  questions: { tr: "soru", en: "questions" },
  minutes: { tr: "dakika", en: "minutes" },
  next: { tr: "Devam", en: "Next" },
  finish: { tr: "Bitir", en: "Finish" },
  orEnter: { tr: "ya da Enter", en: "or Enter" },
  calculating: { tr: "Era hesaplanıyor...", en: "Calculating your era..." },
  thisMonth: { tr: "Bu ay sen", en: "This month you were in" },
  bestMoment: { tr: "En iyi an", en: "Best moment" },
  hardestMoment: { tr: "En zor an", en: "Hardest moment" },
  copyText: { tr: "Paylaşım Metnini Kopyala", en: "Copy Share Text" },
  copied: { tr: "✓ Kopyalandı!", en: "✓ Copied!" },
  again: { tr: "Tekrar", en: "Again" },
  history: { tr: "Era Geçmişi", en: "Era History" },
  map: { tr: "Era Haritası", en: "Era Map" },
  noHistory: { tr: "Henüz kayıtlı era yok. İlk eranı oluştur!", en: "No eras saved yet. Create your first era!" },
  savedEras: { tr: "Kaydedilen Eralar", en: "Saved Eras" },
  deleteEra: { tr: "Sil", en: "Delete" },
  back: { tr: "← Geri", en: "← Back" },
  place: { tr: "yer", en: "places" },
  films: { tr: "film/dizi", en: "films/shows" },
  books: { tr: "kitap", en: "books" },
  hearts: { tr: "çarpıntı", en: "crushes" },
  cries: { tr: "ağlama", en: "cries" },
};

const MONTHS_TR = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
const MONTHS_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function getSteps(lang) {
  return lang === "tr" ? [
    { emoji: "👤", q: "Adın ne?", type: "text", ph: "adını yaz...", key: "name" },
    { emoji: "📅", q: "Hangi ayı özetliyoruz?", type: "month", ph: "", key: "month" },
    { emoji: "✈️", q: "Kaç farklı yere gittin?", type: "number", ph: "2", key: "cities" },
    { emoji: "🎬", q: "Kaç film veya dizi izledin?", type: "number", ph: "8", key: "movies" },
    { emoji: "📚", q: "Kaç kitap okudun?", type: "number", ph: "1", key: "books" },
    { emoji: "💘", q: "Kalp çarpıntısı yaşadın mı? Kaç kez?", type: "number", ph: "0", key: "relationships" },
    { emoji: "😭", q: "Kaç kez ağladın (yaklaşık)?", type: "number", ph: "3", key: "cried" },
    { emoji: "🌟", q: "Bu ayın en güzel anı neydi?", type: "text", ph: "küçük ama anlamlı bişey...", key: "highlight" },
    { emoji: "🌧️", q: "En zor anın neydi?", type: "text", ph: "geçti, geçer...", key: "lowlight" },
    { emoji: "✨", q: "Bu ayı tek kelimeyle özetle", type: "text", ph: "karmaşık", key: "word" },
  ] : [
    { emoji: "👤", q: "What's your name?", type: "text", ph: "your name...", key: "name" },
    { emoji: "📅", q: "Which month are we summing up?", type: "month", ph: "", key: "month" },
    { emoji: "✈️", q: "How many places did you visit?", type: "number", ph: "2", key: "cities" },
    { emoji: "🎬", q: "How many films or shows did you watch?", type: "number", ph: "8", key: "movies" },
    { emoji: "📚", q: "How many books did you read?", type: "number", ph: "1", key: "books" },
    { emoji: "💘", q: "Any heart flutters? How many?", type: "number", ph: "0", key: "relationships" },
    { emoji: "😭", q: "How many times did you cry (roughly)?", type: "number", ph: "3", key: "cried" },
    { emoji: "🌟", q: "What was your best moment this month?", type: "text", ph: "small but meaningful...", key: "highlight" },
    { emoji: "🌧️", q: "What was your hardest moment?", type: "text", ph: "it passed, it always does...", key: "lowlight" },
    { emoji: "✨", q: "Summarize this month in one word", type: "text", ph: "chaotic", key: "word" },
  ];
}

const themes = [
  { name: "Cosmos", bg: "#0a0812", surface: "#131020", card: "#1c1830", accent: "#a78bfa", glow: "#7c3aed", text: "#ede8ff", muted: "#7068a0", border: "#2a2540" },
  { name: "Ember", bg: "#110a08", surface: "#1e1410", card: "#2a1c18", accent: "#fb923c", glow: "#ea580c", text: "#fff0e8", muted: "#907060", border: "#3a2820" },
  { name: "Arctic", bg: "#08101a", surface: "#101820", card: "#182030", accent: "#38bdf8", glow: "#0284c7", text: "#e8f4ff", muted: "#507080", border: "#203040" },
  { name: "Bloom", bg: "#120810", surface: "#1e1220", card: "#2a1a28", accent: "#f472b6", glow: "#db2777", text: "#ffe8f8", muted: "#906080", border: "#382048" },
  { name: "Forest", bg: "#08120a", surface: "#101e14", card: "#18281e", accent: "#4ade80", glow: "#16a34a", text: "#e8ffe8", muted: "#508060", border: "#204028" },
];

const ERA_COLORS = {
  "Healing": "#4ade80", "Villain": "#f87171", "Main Character": "#facc15",
  "NPC": "#94a3b8", "Glowup": "#fb923c", "Soft Life": "#f9a8d4",
  "Burnout": "#f87171", "Chaos": "#a78bfa", "Delulu": "#f472b6",
  "Mystery": "#38bdf8", "Rot Mode": "#94a3b8", "That Girl": "#facc15",
  "Redemption": "#4ade80", "Undefined": "#6b7280",
};

function getEraColor(eraName) {
  for (const [key, color] of Object.entries(ERA_COLORS)) {
    if (eraName?.toLowerCase().includes(key.toLowerCase())) return color;
  }
  return "#a78bfa";
}

async function fetchEra(answers, lang) {
  const monthIdx = answers.month ? parseInt(answers.month.split("-")[1]) - 1 : 0;
  const monthName = lang === "tr" ? MONTHS_TR[monthIdx] + " " + answers.month?.split("-")[0] : MONTHS_EN[monthIdx] + " " + answers.month?.split("-")[0];

  const prompt = lang === "tr"
    ? `Sen bir Z kuşağı hayat ve vibe analisti. Verilen aylık verilere göre kişinin bu ayki "era"sını belirle ve ona "sen" diye hitap ederek samimi, arkadaşça bir açıklama yaz.

Veriler:
- İsim: ${answers.name}
- Dönem: ${monthName}
- Gidilen yer: ${answers.cities}
- Film/dizi: ${answers.movies}
- Kitap: ${answers.books}
- Kalp çarpıntısı: ${answers.relationships}
- Ağlama: ${answers.cried}
- En güzel an: ${answers.highlight}
- En zor an: ${answers.lowlight}
- Ayın kelimesi: ${answers.word}

Era ismi Gen-Z / TikTok slangiyle İngilizce olsun (örnek: Healing Era, Villain Arc, Main Character Mode, Soft Life Era, Burnout Arc, Glowup Era, Delulu Season, Chaotic Good Era, Rot Mode, Redemption Arc, Mystery Arc, NPC Season, That Girl Era vb.)

Açıklama ise tamamen Türkçe, samimi, arkadaş gibi, "sen" diye hitap eden, 2-3 cümle olsun. Kişinin verilerini kullanarak kişisel yap.

SADECE bu JSON'u döndür:
{"era":"...","emoji":"...","vibe":"..."}`
    : `You are a Gen-Z life and vibe analyst. Based on the monthly data below, determine this person's era and write a warm, personal description addressing them as "you".

Data:
- Name: ${answers.name}
- Period: ${monthName}
- Places visited: ${answers.cities}
- Films/shows: ${answers.movies}
- Books: ${answers.books}
- Heart flutters: ${answers.relationships}
- Times cried: ${answers.cried}
- Best moment: ${answers.highlight}
- Hardest moment: ${answers.lowlight}
- Month word: ${answers.word}

Era name should be Gen-Z / TikTok slang English (e.g. Healing Era, Villain Arc, Main Character Mode, Soft Life Era, Burnout Arc, Glowup Era, Delulu Season, Chaotic Good Era, Rot Mode, Redemption Arc, Mystery Arc, NPC Season, That Girl Era etc.)

Description should be casual, friendly, 2-3 sentences, addressing them as "you", using their data to make it personal.

Return ONLY this JSON:
{"era":"...","emoji":"...","vibe":"..."}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  const text = data.content.map(i => i.text || "").join("");
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

// ─── ERA MAP ────────────────────────────────────────────────
function EraMap({ history, t, lang, theme, onBack }) {
  const sorted = [...history].sort((a, b) => a.month?.localeCompare(b.month));

  return (
    <div style={{ animation: "rise 0.5s cubic-bezier(.16,1,.3,1)" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: theme.muted, cursor: "pointer", fontSize: "13px", marginBottom: "24px", padding: 0 }}>{t.back[lang]}</button>
      <h2 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "6px", letterSpacing: "-0.5px" }}>{t.map[lang]}</h2>
      <p style={{ fontSize: "13px", color: theme.muted, marginBottom: "28px" }}>{lang === "tr" ? "Eraların zaman içindeki yolculuğu" : "Your era journey over time"}</p>

      {history.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: theme.muted, fontSize: "14px" }}>{t.noHistory[lang]}</div>
      ) : (
        <>
          {/* Timeline */}
          <div style={{ position: "relative", paddingLeft: "24px", marginBottom: "32px" }}>
            <div style={{ position: "absolute", left: "8px", top: 0, bottom: 0, width: "2px", background: `linear-gradient(to bottom, ${theme.accent}88, transparent)`, borderRadius: "99px" }} />
            {sorted.map((entry, i) => {
              const color = getEraColor(entry.era?.era);
              const monthIdx = entry.month ? parseInt(entry.month.split("-")[1]) - 1 : 0;
              const monthStr = lang === "tr" ? MONTHS_TR[monthIdx] : MONTHS_EN[monthIdx];
              return (
                <div key={i} style={{ display: "flex", gap: "16px", marginBottom: "20px", alignItems: "flex-start", animation: `rise 0.4s ${i * 0.07}s both cubic-bezier(.16,1,.3,1)` }}>
                  <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: color, border: `2px solid ${theme.bg}`, marginTop: "3px", flexShrink: 0, boxShadow: `0 0 12px ${color}88` }} />
                  <div style={{ background: theme.surface, borderRadius: "14px", padding: "14px 16px", flex: 1, border: `1px solid ${color}33` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <span style={{ fontSize: "16px", fontWeight: "800", color }}>{entry.era?.emoji} {entry.era?.era}</span>
                      <span style={{ fontSize: "11px", color: theme.muted }}>{monthStr}</span>
                    </div>
                    <div style={{ fontSize: "12px", color: theme.muted, lineHeight: 1.5 }}>{entry.era?.vibe}</div>
                    <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
                      {[["✈️", entry.cities], ["🎬", entry.movies], ["📚", entry.books], ["😭", entry.cried]].map(([icon, val], j) => (
                        <span key={j} style={{ fontSize: "11px", background: theme.card, borderRadius: "6px", padding: "3px 8px", color: theme.muted }}>{icon} {val}</span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Era frequency chart */}
          {history.length >= 2 && (() => {
            const freq = {};
            history.forEach(e => { const k = e.era?.era || "?"; freq[k] = (freq[k] || 0) + 1; });
            const max = Math.max(...Object.values(freq));
            return (
              <div style={{ background: theme.surface, borderRadius: "20px", padding: "20px", border: `1px solid ${theme.border}` }}>
                <div style={{ fontSize: "13px", fontWeight: "700", marginBottom: "16px", color: theme.muted, letterSpacing: "1px", textTransform: "uppercase" }}>
                  {lang === "tr" ? "En çok yaşanan eralar" : "Most frequent eras"}
                </div>
                {Object.entries(freq).sort((a, b) => b[1] - a[1]).map(([era, count], i) => {
                  const color = getEraColor(era);
                  return (
                    <div key={i} style={{ marginBottom: "10px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "12px" }}>
                        <span style={{ color: theme.text }}>{era}</span>
                        <span style={{ color: theme.muted }}>{count}x</span>
                      </div>
                      <div style={{ height: "6px", background: theme.card, borderRadius: "99px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${(count / max) * 100}%`, background: color, borderRadius: "99px", transition: "width 1s cubic-bezier(.16,1,.3,1)" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </>
      )}
    </div>
  );
}

// ─── HISTORY LIST ───────────────────────────────────────────
function HistoryList({ history, setHistory, t, lang, theme, onBack }) {
  function deleteEra(idx) {
    const updated = history.filter((_, i) => i !== idx);
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  return (
    <div style={{ animation: "rise 0.5s cubic-bezier(.16,1,.3,1)" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: theme.muted, cursor: "pointer", fontSize: "13px", marginBottom: "24px", padding: 0 }}>{t.back[lang]}</button>
      <h2 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "6px", letterSpacing: "-0.5px" }}>{t.savedEras[lang]}</h2>
      <p style={{ fontSize: "13px", color: theme.muted, marginBottom: "28px" }}>{history.length} era {lang === "tr" ? "kaydedildi" : "saved"}</p>
      {history.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: theme.muted, fontSize: "14px" }}>{t.noHistory[lang]}</div>
      ) : [...history].reverse().map((entry, i) => {
        const color = getEraColor(entry.era?.era);
        const monthIdx = entry.month ? parseInt(entry.month.split("-")[1]) - 1 : 0;
        const monthStr = (lang === "tr" ? MONTHS_TR[monthIdx] : MONTHS_EN[monthIdx]) + " " + entry.month?.split("-")[0];
        return (
          <div key={i} style={{ background: theme.surface, borderRadius: "16px", padding: "16px", marginBottom: "12px", border: `1px solid ${color}33`, animation: `rise 0.4s ${i * 0.06}s both cubic-bezier(.16,1,.3,1)` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: "18px", fontWeight: "800", color, marginBottom: "4px" }}>{entry.era?.emoji} {entry.era?.era}</div>
                <div style={{ fontSize: "12px", color: theme.muted }}>{entry.name} · {monthStr}</div>
                <div style={{ fontSize: "12px", color: theme.muted, marginTop: "6px", lineHeight: 1.5, fontStyle: "italic" }}>"{entry.era?.vibe?.slice(0, 80)}..."</div>
              </div>
              <button onClick={() => deleteEra(history.length - 1 - i)} style={{ background: "none", border: `1px solid ${theme.border}`, color: theme.muted, borderRadius: "8px", padding: "4px 10px", fontSize: "11px", cursor: "pointer" }}>
                {t.deleteEra[lang]}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── MAIN APP ───────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState("tr");
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState("");
  const [done, setDone] = useState(false);
  const [themeIdx, setThemeIdx] = useState(0);
  const [era, setEra] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState("home"); // home | history | map
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
  });

  const t = TR;
  const theme = themes[themeIdx];
  const steps = getSteps(lang);
  const progress = step >= 0 ? ((step + 1) / steps.length) * 100 : 0;

  async function next() {
    const val = current;
    if (steps[step].type === "month" ? !val : !val.trim()) return;
    const updated = { ...answers, [steps[step].key]: val };
    setAnswers(updated);
    setCurrent("");
    if (step + 1 >= steps.length) {
      setDone(true);
      setLoading(true);
      try {
        const result = await fetchEra(updated, lang);
        setEra(result);
        const entry = { ...updated, era: result, lang, savedAt: new Date().toISOString() };
        const newHistory = [...history, entry];
        setHistory(newHistory);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      } catch {
        setEra({ era: "Undefined Era", emoji: "🌀", vibe: lang === "tr" ? "Bu ay seni tanımlamak bile zor. Belki de bu belirsizlik tam da senin süper gücün." : "This month was hard to define. Maybe that ambiguity is exactly your superpower." });
      }
      setLoading(false);
    } else setStep(s => s + 1);
  }

  function onKey(e) { if (e.key === "Enter") next(); }

  function reset() { setStep(-1); setAnswers({}); setCurrent(""); setDone(false); setEra(null); setView("home"); }

  function copy() {
    const a = answers;
    const monthIdx = a.month ? parseInt(a.month.split("-")[1]) - 1 : 0;
    const monthStr = lang === "tr" ? MONTHS_TR[monthIdx] + " " + a.month?.split("-")[0] : MONTHS_EN[monthIdx] + " " + a.month?.split("-")[0];
    const eraLine = era ? `\n${era.emoji} ${era.era}\n${era.vibe}\n` : "";
    navigator.clipboard.writeText(`${monthStr} — ${a.name}\n${eraLine}\n✈️ ${a.cities} ${t.place[lang]}\n🎬 ${a.movies} ${t.films[lang]}\n📚 ${a.books} ${t.books[lang]}\n💘 ${a.relationships} ${t.hearts[lang]}\n😭 ${a.cried} ${t.cries[lang]}\n\n🌟 "${a.highlight}"\n🌧️ "${a.lowlight}"\n\n${a.word?.toUpperCase()}\n\n— erawrapped.app`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const eraColor = era ? getEraColor(era.era) : theme.accent;

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, color: theme.text, fontFamily: "'Inter', -apple-system, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 20px", transition: "background 0.7s ease, color 0.7s ease" }}>

      {/* Ambient glows */}
      <div style={{ position: "fixed", inset: 0, background: `radial-gradient(ellipse 100% 60% at 50% -5%, ${theme.glow}20, transparent)`, pointerEvents: "none", transition: "background 0.7s ease" }} />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: "50%", background: `radial-gradient(ellipse 80% 80% at 50% 110%, ${theme.glow}10, transparent)`, pointerEvents: "none" }} />

      {/* Top bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10, backdropFilter: "blur(12px)", background: theme.bg + "cc" }}>
        <span style={{ fontSize: "15px", fontWeight: "800", letterSpacing: "-0.5px", color: theme.accent, cursor: "pointer" }} onClick={reset}>Era Wrapped</span>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {step === -1 && !done && view === "home" && history.length > 0 && (
            <>
              <button onClick={() => setView("history")} style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.muted, borderRadius: "8px", padding: "6px 12px", fontSize: "12px", cursor: "pointer" }}>
                {t.history[lang]}
              </button>
              <button onClick={() => setView("map")} style={{ background: theme.surface, border: `1px solid ${theme.accent}55`, color: theme.accent, borderRadius: "8px", padding: "6px 12px", fontSize: "12px", cursor: "pointer" }}>
                {t.map[lang]}
              </button>
            </>
          )}
          <button onClick={() => setLang(l => l === "tr" ? "en" : "tr")} style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.muted, borderRadius: "8px", padding: "6px 10px", fontSize: "12px", cursor: "pointer", fontWeight: "600" }}>
            {lang === "tr" ? "EN" : "TR"}
          </button>
        </div>
      </div>

      <div style={{ width: "100%", maxWidth: "460px", position: "relative", zIndex: 1, paddingTop: "60px" }}>

        {/* History view */}
        {view === "history" && <HistoryList history={history} setHistory={setHistory} t={t} lang={lang} theme={theme} onBack={() => setView("home")} />}

        {/* Map view */}
        {view === "map" && <EraMap history={history} t={t} lang={lang} theme={theme} onBack={() => setView("home")} />}

        {/* Landing */}
        {view === "home" && step === -1 && !done && (
          <div style={{ textAlign: "center", animation: "rise 0.7s cubic-bezier(.16,1,.3,1)" }}>

            {/* Avatar placeholder with glow */}
            <div style={{ width: "72px", height: "72px", borderRadius: "24px", background: `linear-gradient(135deg, ${theme.accent}44, ${theme.glow}22)`, border: `1px solid ${theme.accent}55`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 32px", fontSize: "28px", boxShadow: `0 0 40px ${theme.accent}33` }}>✨</div>

            <div style={{ fontSize: "11px", letterSpacing: "4px", color: theme.accent, marginBottom: "12px", textTransform: "uppercase", opacity: 0.8 }}>Era Wrapped</div>
            <h1 style={{ fontSize: "clamp(34px, 8vw, 52px)", fontWeight: "900", letterSpacing: "-2px", lineHeight: 1.1, marginBottom: "16px" }}>
              {lang === "tr" ? <>Bu ay <span style={{ color: theme.accent }}>hangi</span><br />era'daydın?</> : <>What era were<br />you in <span style={{ color: theme.accent }}>this month?</span></>}
            </h1>
            <p style={{ fontSize: "14px", color: theme.muted, lineHeight: 1.7, marginBottom: "40px" }}>
              {lang === "tr" ? "Her ay yeni bir keşif. Takip et, karşılaştır, paylaş." : "A new discovery every month. Track, compare, share."}
            </p>

            {/* Theme selector */}
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "36px" }}>
              {themes.map((th, i) => (
                <button key={i} onClick={() => setThemeIdx(i)} title={th.name} style={{ width: "28px", height: "28px", borderRadius: "50%", background: `radial-gradient(circle, ${th.accent}, ${th.glow})`, border: i === themeIdx ? `3px solid ${theme.text}` : "3px solid transparent", cursor: "pointer", transition: "all 0.3s", transform: i === themeIdx ? "scale(1.25)" : "scale(1)", boxShadow: i === themeIdx ? `0 0 16px ${th.accent}88` : "none" }} />
              ))}
            </div>

            <button onClick={() => setStep(0)} style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.glow})`, color: "#fff", border: "none", borderRadius: "16px", padding: "18px 56px", fontSize: "16px", fontWeight: "800", cursor: "pointer", transition: "all 0.3s", boxShadow: `0 4px 32px ${theme.accent}55`, letterSpacing: "-0.3px" }}
              onMouseEnter={e => { e.target.style.transform = "translateY(-3px) scale(1.02)"; e.target.style.boxShadow = `0 12px 48px ${theme.accent}77`; }}
              onMouseLeave={e => { e.target.style.transform = "translateY(0) scale(1)"; e.target.style.boxShadow = `0 4px 32px ${theme.accent}55`; }}>
              {t.start[lang]} →
            </button>

            {history.length > 0 && (
              <div style={{ marginTop: "20px", fontSize: "12px", color: theme.muted }}>
                {history.length} era {lang === "tr" ? "kayıtlı" : "saved"} ·{" "}
                <span style={{ color: theme.accent, cursor: "pointer" }} onClick={() => setView("map")}>{t.map[lang]}</span>
              </div>
            )}

            <div style={{ marginTop: "16px", fontSize: "12px", color: theme.muted }}>{steps.length} {t.questions[lang]} · 2 {t.minutes[lang]}</div>
          </div>
        )}

        {/* Questions */}
        {view === "home" && step >= 0 && !done && (
          <div key={step} style={{ animation: "rise 0.45s cubic-bezier(.16,1,.3,1)" }}>
            <div style={{ marginBottom: "44px" }}>
              <div style={{ height: "3px", background: theme.border, borderRadius: "99px", overflow: "hidden", marginBottom: "8px" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${theme.accent}99, ${theme.accent})`, borderRadius: "99px", transition: "width 0.5s cubic-bezier(.16,1,.3,1)" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", fontSize: "11px", color: theme.muted }}>{step + 1} / {steps.length}</div>
            </div>

            <div style={{ fontSize: "38px", marginBottom: "18px" }}>{steps[step].emoji}</div>
            <h2 style={{ fontSize: "clamp(20px, 4vw, 28px)", fontWeight: "800", marginBottom: "36px", lineHeight: 1.3, letterSpacing: "-0.5px" }}>{steps[step].q}</h2>

            {steps[step].type === "month" ? (
              <input type="month" value={current} onChange={e => setCurrent(e.target.value)} autoFocus style={{ width: "100%", background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "14px", padding: "16px 20px", fontSize: "18px", color: theme.text, outline: "none", boxSizing: "border-box", colorScheme: "dark", fontFamily: "inherit" }}
                onFocus={e => e.target.style.borderColor = theme.accent}
                onBlur={e => e.target.style.borderColor = theme.border} />
            ) : (
              <input type={steps[step].type} value={current} onChange={e => setCurrent(e.target.value)} onKeyDown={onKey} placeholder={steps[step].ph} autoFocus style={{ width: "100%", background: "transparent", border: "none", borderBottom: `2px solid ${theme.border}`, padding: "12px 0", fontSize: "28px", color: theme.text, outline: "none", caretColor: theme.accent, boxSizing: "border-box", fontFamily: "inherit", transition: "border-color 0.3s" }}
                onFocus={e => e.target.style.borderBottomColor = theme.accent}
                onBlur={e => e.target.style.borderBottomColor = theme.border} />
            )}

            <div style={{ marginTop: "40px", display: "flex", gap: "12px", alignItems: "center" }}>
              <button onClick={next} style={{ background: current.trim() ? `linear-gradient(135deg, ${theme.accent}, ${theme.glow})` : theme.surface, color: current.trim() ? "#fff" : theme.muted, border: "none", borderRadius: "14px", padding: "14px 36px", fontSize: "15px", fontWeight: "700", cursor: current.trim() ? "pointer" : "default", transition: "all 0.3s", boxShadow: current.trim() ? `0 4px 24px ${theme.accent}44` : "none" }}>
                {step + 1 >= steps.length ? t.finish[lang] : t.next[lang]} →
              </button>
              {steps[step].type !== "month" && <span style={{ fontSize: "11px", color: theme.muted }}>{t.orEnter[lang]}</span>}
            </div>
          </div>
        )}

        {/* Result */}
        {view === "home" && done && (
          <div style={{ animation: "rise 0.7s cubic-bezier(.16,1,.3,1)" }}>

            {/* ERA hero */}
            <div style={{ background: loading ? theme.surface : `linear-gradient(135deg, ${eraColor}18, ${eraColor}08)`, borderRadius: "24px", padding: "36px 28px", marginBottom: "14px", border: `1px solid ${loading ? theme.border : eraColor + "44"}`, textAlign: "center", transition: "all 0.6s ease", boxShadow: loading ? "none" : `0 0 80px ${eraColor}18` }}>
              {loading ? (
                <div style={{ padding: "16px 0" }}>
                  <div style={{ fontSize: "32px", marginBottom: "16px", animation: "float 2s ease infinite" }}>✨</div>
                  <div style={{ fontSize: "13px", color: theme.muted, letterSpacing: "1px" }}>{t.calculating[lang]}</div>
                </div>
              ) : era && (
                <>
                  <div style={{ fontSize: "11px", color: theme.muted, letterSpacing: "4px", textTransform: "uppercase", marginBottom: "16px" }}>{t.thisMonth[lang]}</div>
                  <div style={{ fontSize: "56px", marginBottom: "12px", filter: `drop-shadow(0 0 20px ${eraColor}88)` }}>{era.emoji}</div>
                  <div style={{ fontSize: "clamp(24px, 5vw, 36px)", fontWeight: "900", letterSpacing: "-1px", marginBottom: "14px", color: eraColor, textShadow: `0 0 40px ${eraColor}66` }}>
                    {era.era}
                  </div>
                  <div style={{ fontSize: "14px", color: theme.text, lineHeight: 1.75, opacity: 0.85 }}>{era.vibe}</div>
                </>
              )}
            </div>

            {/* Stats */}
            <div style={{ background: theme.surface, borderRadius: "20px", padding: "22px", border: `1px solid ${theme.border}`, marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
                <div>
                  <div style={{ fontSize: "17px", fontWeight: "800", letterSpacing: "-0.5px" }}>{answers.name}</div>
                  <div style={{ fontSize: "12px", color: theme.muted, marginTop: "2px" }}>
                    {answers.month ? (lang === "tr" ? MONTHS_TR : MONTHS_EN)[parseInt(answers.month.split("-")[1]) - 1] + " " + answers.month.split("-")[0] : ""}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  {themes.map((th, i) => (
                    <button key={i} onClick={() => setThemeIdx(i)} style={{ width: "14px", height: "14px", borderRadius: "50%", background: th.accent, border: i === themeIdx ? `2px solid ${theme.text}` : "2px solid transparent", cursor: "pointer", transition: "all 0.2s", transform: i === themeIdx ? "scale(1.3)" : "scale(1)" }} />
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "14px" }}>
                {[
                  { icon: "✈️", label: t.place[lang], val: answers.cities },
                  { icon: "🎬", label: t.films[lang], val: answers.movies },
                  { icon: "📚", label: t.books[lang], val: answers.books },
                  { icon: "💘", label: t.hearts[lang], val: answers.relationships },
                  { icon: "😭", label: t.cries[lang], val: answers.cried },
                  { icon: "✨", label: answers.word, val: "" },
                ].map((s, i) => (
                  <div key={i} style={{ background: theme.card, borderRadius: "12px", padding: "12px 8px", textAlign: "center", border: `1px solid ${theme.border}` }}>
                    <div style={{ fontSize: "17px", fontWeight: "900", color: theme.accent }}>{s.val || s.icon}</div>
                    <div style={{ fontSize: "10px", color: theme.muted, marginTop: "2px", lineHeight: 1.3 }}>{s.val ? s.icon + " " + s.label : s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[{ label: "🌟 " + t.bestMoment[lang], val: answers.highlight }, { label: "🌧️ " + t.hardestMoment[lang], val: answers.lowlight }].map((item, i) => (
                  <div key={i} style={{ background: theme.card, borderRadius: "12px", padding: "12px 14px", border: `1px solid ${theme.border}` }}>
                    <div style={{ fontSize: "10px", color: theme.accent, marginBottom: "4px", letterSpacing: "1px" }}>{item.label}</div>
                    <div style={{ fontSize: "13px", fontStyle: "italic", color: theme.muted }}>"{item.val}"</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
              <button onClick={copy} style={{ flex: 1, background: `linear-gradient(135deg, ${theme.accent}, ${theme.glow})`, color: "#fff", border: "none", borderRadius: "14px", padding: "16px", fontSize: "14px", fontWeight: "700", cursor: "pointer", transition: "all 0.2s", boxShadow: `0 4px 20px ${theme.accent}44` }}
                onMouseEnter={e => e.target.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.target.style.transform = "translateY(0)"}>
                {copied ? t.copied[lang] : t.copyText[lang]}
              </button>
              <button onClick={reset} style={{ background: theme.surface, color: theme.muted, border: `1px solid ${theme.border}`, borderRadius: "14px", padding: "16px 18px", fontSize: "18px", cursor: "pointer" }}>↺</button>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setView("history")} style={{ flex: 1, background: theme.surface, color: theme.muted, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "12px", fontSize: "13px", cursor: "pointer" }}>
                📋 {t.history[lang]}
              </button>
              <button onClick={() => setView("map")} style={{ flex: 1, background: theme.surface, color: theme.accent, border: `1px solid ${theme.accent}44`, borderRadius: "12px", padding: "12px", fontSize: "13px", cursor: "pointer" }}>
                🗺️ {t.map[lang]}
              </button>
            </div>

            <div style={{ textAlign: "center", marginTop: "16px", fontSize: "11px", color: theme.border }}>erawrapped.app</div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}
