import { useState, useCallback } from "react";

const ACCOUNT_ID = "2016253208521227";
const CÍLOVÉ_CPA = 300;

function parseName(name) {
  const parts = name.toLowerCase().split("_");
  const TYPY = ["video", "banner", "carousel", "image", "reel"];
  const FIRMY = { fs: "FairShare", op: "Oceň podíl", rvp: "Rychlý výkup podílu" };
  const MESICE = ["01","02","03","04","05","06","07","08","09","10","11","12"];
  if (parts.length < 3) return null;
  const typ = TYPY.includes(parts[0]) ? parts[0] : null;
  if (!typ) return null;
  const firma = FIRMY[parts[1]] || null;
  if (!firma) return null;
  const last = parts[parts.length - 1];
  const secondLast = parts[parts.length - 2];
  if (/^20\d{2}$/.test(last) && MESICE.includes(secondLast)) {
    const rok = last, mesic = secondLast;
    const obsahParts = parts.slice(2, parts.length - 2);
    const POZNAMKY = ["manychat", "fbform", "outro", "special", "v2", "v3", "v4"];
    if (obsahParts.length > 1 && POZNAMKY.some(p => obsahParts[obsahParts.length-1].includes(p))) {
      const poznamka = obsahParts[obsahParts.length - 1];
      const obsah = obsahParts.slice(0, -1).join(" ");
      return { typ, firma, obsah: obsah.charAt(0).toUpperCase() + obsah.slice(1), poznamka: poznamka.charAt(0).toUpperCase() + poznamka.slice(1), mesic, rok, novy: true };
    }
    const obsah = obsahParts.join(" ");
    return { typ, firma, obsah: obsah.charAt(0).toUpperCase() + obsah.slice(1), poznamka: null, mesic, rok, novy: true };
  }
  return null;
}

function getMetaAdLink(adId, accountId) {
  return `https://www.facebook.com/adsmanager/manage/ads?act=${accountId}&selected_ad_ids=${adId}`;
}

function vyhodnoceni(cpr) {
  if (cpr <= CÍLOVÉ_CPA) return "Škálovat";
  if (cpr <= CÍLOVÉ_CPA * 1.5) return "Udržet";
  return "Vypnout";
}

const DEMO_ADS = [
  { id: "ad_001", name: "video_fs_hadka_manychat_04_2026", status: "ACTIVE", start_date: "2026-04-01", campaign: "Konverze – FairShare Q2 2026", adset: "Broad CZ 25-55", format: "Video", placement: "Reels", spend: 3200, impressions: 28000, reach: 18000, clicks: 310, ctr: 1.11, cpc: 10.3, cpm: 114, roas: 4.1, cpr: 267, cvr: 4.2, cost_per_lead: 220, results: 12, drive_url: "" },
  { id: "ad_002", name: "video_fs_avatarka_fbform_03_2026", status: "ACTIVE", start_date: "2026-03-15", campaign: "Leady – FairShare Q1 2026", adset: "Lookalike 1% CZ", format: "Video", placement: "Facebook Feed", spend: 5800, impressions: 62000, reach: 41000, clicks: 480, ctr: 0.77, cpc: 12.1, cpm: 94, roas: 2.8, cpr: 483, cvr: 2.1, cost_per_lead: 390, results: 12, drive_url: "" },
  { id: "ad_003", name: "video_fs_testimonial_04_2026", status: "ACTIVE", start_date: "2026-04-03", campaign: "Konverze – FairShare Q2 2026", adset: "Retargeting web", format: "Video", placement: "Facebook Feed, Reels", spend: 4100, impressions: 35000, reach: 22000, clicks: 390, ctr: 1.11, cpc: 10.5, cpm: 117, roas: 3.9, cpr: 293, cvr: 3.8, cost_per_lead: 240, results: 14, drive_url: "" },
  { id: "ad_004", name: "banner_fs_sleva33_03_2026", status: "PAUSED", start_date: "2026-03-01", campaign: "Konverze – FairShare Q1 2026", adset: "Zájemci bydlení CZ", format: "Banner", placement: "Facebook Feed", spend: 2100, impressions: 41000, reach: 31000, clicks: 168, ctr: 0.41, cpc: 12.5, cpm: 51, roas: 0.8, cpr: 1050, cvr: 0.5, cost_per_lead: 890, results: 2, drive_url: "" },
  { id: "ad_005", name: "video_fs_problem_solution_04_2026", status: "ACTIVE", start_date: "2026-04-10", campaign: "Konverze – FairShare Q2 2026", adset: "Broad CZ 25-65", format: "Video", placement: "Reels", spend: 6200, impressions: 54000, reach: 35000, clicks: 648, ctr: 1.2, cpc: 9.6, cpm: 115, roas: 5.2, cpr: 211, cvr: 5.1, cost_per_lead: 175, results: 29, drive_url: "" },
  { id: "ad_006", name: "carousel_fs_produkty_02_2026", status: "PAUSED", start_date: "2026-02-10", campaign: "Awareness – FairShare Q1 2026", adset: "Zájemci nemovitosti CZ", format: "Carousel", placement: "Facebook Feed", spend: 1800, impressions: 29000, reach: 21000, clicks: 145, ctr: 0.5, cpc: 12.4, cpm: 62, roas: 1.1, cpr: 900, cvr: 0.8, cost_per_lead: 750, results: 2, drive_url: "" },
  { id: "ad_007", name: "video_fs_ugc_recenze_manychat_04_2026", status: "ACTIVE", start_date: "2026-04-05", campaign: "Leady – FairShare Q2 2026", adset: "Lookalike 2% CZ", format: "Video", placement: "Instagram Feed, Reels", spend: 7400, impressions: 81000, reach: 52000, clicks: 810, ctr: 1.0, cpc: 9.1, cpm: 91, roas: 4.7, cpr: 246, cvr: 4.1, cost_per_lead: 200, results: 30, drive_url: "" },
  { id: "ad_008", name: "DN_komentar_demontaz_11_2024", status: "ACTIVE", start_date: "2024-11-03", campaign: "Konverze – Den a noc Q4 2024", adset: "Lookalike kupující CZ 1%", format: "Video", placement: "Facebook Feed", spend: 19629, impressions: 185280, reach: 136910, clicks: 1740, ctr: 0.94, cpc: 11.3, cpm: 106, roas: 4.2, cpr: 384, cvr: 3.8, cost_per_lead: 210, results: 51, drive_url: "" },
  { id: "ad_009", name: "AI_hook_horko_v1_07_2025", status: "ACTIVE", start_date: "2025-07-12", campaign: "Konverze – Léto 2025", adset: "Broad CZ 25-65", format: "Video", placement: "Reels", spend: 5849, impressions: 27440, reach: 15382, clicks: 293, ctr: 1.07, cpc: 20.0, cpm: 213, roas: 3.6, cpr: 344, cvr: 3.1, cost_per_lead: 290, results: 17, drive_url: "" },
  { id: "ad_010", name: "AI_83procent_reklamace_11_2025", status: "PAUSED", start_date: "2025-11-01", campaign: "Konverze – Podzim 2025", adset: "Broad CZ 25-65", format: "Video", placement: "Facebook Feed", spend: 4091, impressions: 12545, reach: 10732, clicks: 73, ctr: 0.58, cpc: 56.8, cpm: 326, roas: 0.3, cpr: 4091, cvr: 0.2, cost_per_lead: 3800, results: 1, drive_url: "" },
];

const VERDICT_CFG = {
  "Škálovat": { bg: "#EAF3DE", text: "#27500A", border: "#639922", icon: "ti-trending-up" },
  "Udržet":   { bg: "#E6F1FB", text: "#0C447C", border: "#378ADD", icon: "ti-minus" },
  "Vypnout":  { bg: "#FCEBEB", text: "#791F1F", border: "#E24B4A", icon: "ti-trending-down" },
};

const STATUS_CFG = {
  ACTIVE: { bg: "#EAF3DE", text: "#27500A", dot: "#639922" },
  PAUSED: { bg: "#F1EFE8", text: "#444441", dot: "#888780" },
};

const METRICS = [
  { key: "spend", label: "Spend", fmt: v => v.toLocaleString("cs") + " Kč" },
  { key: "impressions", label: "Impr.", fmt: v => v.toLocaleString("cs") },
  { key: "reach", label: "Dosah", fmt: v => v.toLocaleString("cs") },
  { key: "clicks", label: "Clicks", fmt: v => v.toLocaleString("cs") },
  { key: "ctr", label: "CTR", fmt: v => v.toFixed(2) + "%" },
  { key: "cpc", label: "CPC", fmt: v => v.toFixed(0) + " Kč" },
  { key: "cpm", label: "CPM", fmt: v => v.toFixed(0) + " Kč" },
  { key: "roas", label: "ROAS", fmt: v => v.toFixed(1) + "×" },
  { key: "cpr", label: "CPR", fmt: v => v.toFixed(0) + " Kč" },
  { key: "cvr", label: "CVR", fmt: v => v.toFixed(1) + "%" },
  { key: "cost_per_lead", label: "CPL", fmt: v => v.toFixed(0) + " Kč" },
  { key: "results", label: "Výsl.", fmt: v => v },
];

function avg(arr, key) { return arr.reduce((s, a) => s + (a[key] || 0), 0) / arr.length; }
function isGood(key, val, all) {
  const a = avg(all, key);
  return ["cpc","cpm","cpr","cost_per_lead"].includes(key) ? val < a * 0.85 : val > a * 1.15;
}
function isBad(key, val, all) {
  const a = avg(all, key);
  return ["cpc","cpm","cpr","cost_per_lead"].includes(key) ? val > a * 1.3 : val < a * 0.7;
}

function formatDate(dateStr) {
  if (!dateStr) return "–";
  const d = new Date(dateStr);
  return d.toLocaleDateString("cs-CZ", { day: "numeric", month: "numeric", year: "numeric" });
}

function VerdiktBadge({ cpr, small }) {
  const v = vyhodnoceni(cpr);
  const c = VERDICT_CFG[v];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: c.bg, color: c.text, border: `1px solid ${c.border}`, borderRadius: 20, padding: small ? "2px 8px" : "3px 10px", fontSize: small ? 11 : 12, fontWeight: 500, whiteSpace: "nowrap" }}>
      <i className={`ti ${c.icon}`} style={{ fontSize: small ? 11 : 13 }} aria-hidden="true" />
      {v}
    </span>
  );
}

function MetricGrid({ ad, allAds, keys }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
      {METRICS.filter(m => keys.includes(m.key)).map(m => {
        const good = isGood(m.key, ad[m.key], allAds);
        const bad = isBad(m.key, ad[m.key], allAds);
        return (
          <div key={m.key} style={{ background: good ? "#EAF3DE" : bad ? "#FCEBEB" : "var(--color-background-secondary)", borderRadius: 8, padding: "8px 10px" }}>
            <div style={{ fontSize: 10, fontWeight: 500, color: good ? "#3B6D11" : bad ? "#A32D2D" : "var(--color-text-secondary)", marginBottom: 2 }}>{m.label}</div>
            <div style={{ fontSize: 15, fontWeight: 500, color: good ? "#27500A" : bad ? "#791F1F" : "var(--color-text-primary)" }}>{m.fmt(ad[m.key])}</div>
          </div>
        );
      })}
    </div>
  );
}

function AIAnalysis({ ad, allAds }) {
  const [state, setState] = useState("idle");
  const [result, setResult] = useState(null);

  const run = useCallback(async () => {
    setState("loading");
    const parsed = parseName(ad.name);
    const avgCpr = avg(allAds, "cpr").toFixed(0);
    const avgCtr = avg(allAds, "ctr").toFixed(2);
    const avgRoas = avg(allAds, "roas").toFixed(1);
    const kreativaInfo = parsed
      ? `Typ: ${parsed.typ}, Firma: ${parsed.firma}, Obsah/téma: "${parsed.obsah}"${parsed.poznamka ? `, Poznámka: ${parsed.poznamka}` : ""}, Datum: ${parsed.mesic}/${parsed.rok}`
      : `Název (starý formát): ${ad.name}`;

    const prompt = `Jsi expert na Meta Ads pro firmu FairShare (podíly na nemovitostech, spoluvlastnictví). Vyhodnoť tuto kreativu.

Cílové KPI účtu:
- Cílové CPA/CPR: ${CÍLOVÉ_CPA} Kč a méně = škálovat, ${CÍLOVÉ_CPA}–${CÍLOVÉ_CPA * 1.5} Kč = udržet, nad ${CÍLOVÉ_CPA * 1.5} Kč = vypnout

Průměry účtu (benchmark):
- CPR: ${avgCpr} Kč | CTR: ${avgCtr}% | ROAS: ${avgRoas}×

Kreativa:
${kreativaInfo}
Kampaň: ${ad.campaign} | Ad set: ${ad.adset}
Formát: ${ad.format} | Umístění: ${ad.placement} | Status: ${ad.status}
Spuštění: ${formatDate(ad.start_date)}
Spend: ${ad.spend.toLocaleString("cs")} Kč | Dosah: ${ad.reach.toLocaleString("cs")} | Impressions: ${ad.impressions.toLocaleString("cs")}
CTR: ${ad.ctr.toFixed(2)}% | CPC: ${ad.cpc.toFixed(0)} Kč | CPM: ${ad.cpm.toFixed(0)} Kč
ROAS: ${ad.roas.toFixed(1)}× | CPR: ${ad.cpr.toFixed(0)} Kč | CVR: ${ad.cvr.toFixed(1)}% | CPL: ${ad.cost_per_lead.toFixed(0)} Kč | Výsledky: ${ad.results}

Vrať POUZE JSON bez markdown:
{
  "verdict": "Škálovat" nebo "Udržet" nebo "Vypnout",
  "verdict_duvod": "1-2 věty proč právě tento verdict – konkrétní čísla",
  "co_funguje": ["max 3 body"],
  "co_nefunguje": ["max 3 body"],
  "obsah_kreativy": "Analýza obsahu/tématu kreativy a proč to může nebo nemusí fungovat u cílové skupiny FairShare (2-3 věty)",
  "doporuceni": ["2-3 konkrétní akční kroky"],
  "ab_navrh": "Jeden konkrétní A/B test návrh"
}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: prompt }] }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      setResult(JSON.parse(text.replace(/```json|```/g, "").trim()));
      setState("done");
    } catch { setState("error"); }
  }, [ad, allAds]);

  if (state === "idle") return (
    <button onClick={run} style={{ width: "100%", padding: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 500, fontSize: 13 }}>
      <i className="ti ti-sparkles" style={{ fontSize: 15, color: "#7F77DD" }} aria-hidden="true" />
      Spustit AI analýzu ↗
    </button>
  );
  if (state === "loading") return <div style={{ padding: "16px 0", textAlign: "center", fontSize: 13, color: "var(--color-text-secondary)" }}>Claude analyzuje kreativu...</div>;
  if (state === "error") return (
    <div style={{ padding: 10, background: "#FCEBEB", borderRadius: 8, fontSize: 13, color: "#791F1F", display: "flex", justifyContent: "space-between" }}>
      Chyba při analýze. <button onClick={run} style={{ fontSize: 12 }}>Zkusit znovu</button>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
        <VerdiktBadge cpr={ad.cpr} />
        <div style={{ flex: 1, fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.5, minWidth: 200 }}>{result.verdict_duvod}</div>
        <button onClick={run} style={{ fontSize: 11, padding: "3px 8px" }}>Obnovit</button>
      </div>
      <div style={{ background: "#EEEDFE", borderRadius: 8, padding: "10px 14px" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: "#534AB7", marginBottom: 4 }}>
          <i className="ti ti-eye" style={{ fontSize: 13, marginRight: 4 }} aria-hidden="true" />Analýza obsahu kreativy
        </div>
        <div style={{ fontSize: 13, color: "#3C3489", lineHeight: 1.55 }}>{result.obsah_kreativy}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div style={{ background: "#EAF3DE", borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: "#3B6D11", marginBottom: 6 }}>✓ Co funguje</div>
          {result.co_funguje?.map((s, i) => <div key={i} style={{ fontSize: 12, color: "#27500A", marginBottom: 3, lineHeight: 1.4 }}>• {s}</div>)}
        </div>
        <div style={{ background: "#FCEBEB", borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: "#A32D2D", marginBottom: 6 }}>✗ Co nefunguje</div>
          {result.co_nefunguje?.map((s, i) => <div key={i} style={{ fontSize: 12, color: "#791F1F", marginBottom: 3, lineHeight: 1.4 }}>• {s}</div>)}
        </div>
      </div>
      <div style={{ background: "var(--color-background-secondary)", borderRadius: 8, padding: "10px 14px" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 6 }}>
          <i className="ti ti-list-check" style={{ fontSize: 13, marginRight: 4 }} aria-hidden="true" />Doporučení
        </div>
        {result.doporuceni?.map((d, i) => (
          <div key={i} style={{ fontSize: 13, marginBottom: 4, lineHeight: 1.4, display: "flex", gap: 8 }}>
            <span style={{ color: "var(--color-text-secondary)", flexShrink: 0 }}>{i + 1}.</span> {d}
          </div>
        ))}
      </div>
      <div style={{ borderLeft: "3px solid #7F77DD", paddingLeft: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 3 }}>
          <i className="ti ti-test-pipe" style={{ fontSize: 13, marginRight: 4 }} aria-hidden="true" />A/B test návrh
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.5 }}>{result.ab_navrh}</div>
      </div>
    </div>
  );
}

function DetailRow({ ad, allAds }) {
  const [open, setOpen] = useState(false);
  const sc = STATUS_CFG[ad.status] || STATUS_CFG.PAUSED;
  const parsed = parseName(ad.name);
  const metaLink = getMetaAdLink(ad.id, ACCOUNT_ID);

  return (
    <div style={{ borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
      <div
        onClick={() => setOpen(v => !v)}
        style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(0,1.3fr) minmax(0,1.3fr) 95px 110px 100px 30px", alignItems: "center", padding: "10px 18px", cursor: "pointer", gap: 10 }}
        onMouseEnter={e => e.currentTarget.style.background = "var(--color-background-secondary)"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ad.name}</div>
          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 2 }}>
            {parsed ? `${parsed.typ} · ${parsed.firma}` : "Starý formát"}
          </div>
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 1 }}>Sestava</div>
          <div style={{ fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ad.adset}</div>
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 1 }}>Kampaň</div>
          <div style={{ fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ad.campaign}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 1 }}>Spuštění</div>
          <div style={{ fontSize: 12 }}>{formatDate(ad.start_date)}</div>
        </div>
        <div><VerdiktBadge cpr={ad.cpr} small /></div>
        <div>
          <span style={{ fontSize: 11, background: sc.bg, color: sc.text, padding: "2px 7px", borderRadius: 20, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: sc.dot }} />{ad.status}
          </span>
        </div>
        <div style={{ textAlign: "right" }}>
          <i className={`ti ti-chevron-${open ? "up" : "down"}`} style={{ fontSize: 13, color: "var(--color-text-secondary)" }} aria-hidden="true" />
        </div>
      </div>

      {open && (
        <div style={{ padding: "0 18px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <a href={metaLink} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "#185FA5", background: "#E6F1FB", padding: "5px 12px", borderRadius: 20, textDecoration: "none", fontWeight: 500 }}
              onClick={e => e.stopPropagation()}>
              <i className="ti ti-brand-meta" style={{ fontSize: 14 }} aria-hidden="true" /> Otevřít v Meta
            </a>
            {ad.drive_url ? (
              <a href={ad.drive_url} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "#27500A", background: "#EAF3DE", padding: "5px 12px", borderRadius: 20, textDecoration: "none", fontWeight: 500 }}
                onClick={e => e.stopPropagation()}>
                <i className="ti ti-brand-google-drive" style={{ fontSize: 14 }} aria-hidden="true" /> Otevřít v Drive
              </a>
            ) : (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--color-text-secondary)", background: "var(--color-background-secondary)", padding: "5px 12px", borderRadius: 20 }}>
                <i className="ti ti-brand-google-drive" style={{ fontSize: 14 }} aria-hidden="true" /> Drive odkaz chybí
              </span>
            )}
          </div>
          <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--color-text-secondary)", flexWrap: "wrap" }}>
            <span><i className="ti ti-device-tv" style={{ fontSize: 13, verticalAlign: -2, marginRight: 4 }} />{ad.format}</span>
            <span><i className="ti ti-layout" style={{ fontSize: 13, verticalAlign: -2, marginRight: 4 }} />{ad.placement}</span>
            {parsed && <span><i className="ti ti-tag" style={{ fontSize: 13, verticalAlign: -2, marginRight: 4 }} />{parsed.obsah}{parsed.poznamka ? ` · ${parsed.poznamka}` : ""}</span>}
          </div>
          <div>
            <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 6 }}>Všechny metriky <span style={{ fontSize: 10 }}>(zelená = nad průměrem, červená = pod průměrem)</span></div>
            <MetricGrid ad={ad} allAds={allAds} keys={["spend","impressions","reach","clicks","ctr","cpc","cpm","roas","cpr","cvr","cost_per_lead","results"]} />
          </div>
          <div style={{ borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: 14 }}>
            <AIAnalysis ad={ad} allAds={allAds} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [ads, setAds] = useState(DEMO_ADS);
  const [loading, setLoading] = useState(false);
  const [liveError, setLiveError] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Vše");
  const [filterTyp, setFilterTyp] = useState("Vše typy");
  const [filterVyhodnoceni, setFilterVyhodnoceni] = useState("Vše");
  const [sortKey, setSortKey] = useState("start_date");
  const [sortDir, setSortDir] = useState("desc");

  const typy = ["Vše typy", ...Array.from(new Set(ads.map(a => { const p = parseName(a.name); return p ? p.typ : "starý formát"; })))];

  const filtered = ads.filter(a => {
    if (filterStatus !== "Vše" && a.status !== filterStatus) return false;
    if (filterTyp !== "Vše typy") { const p = parseName(a.name); if ((p ? p.typ : "starý formát") !== filterTyp) return false; }
    if (filterVyhodnoceni !== "Vše" && vyhodnoceni(a.cpr) !== filterVyhodnoceni) return false;
    if (search) { const q = search.toLowerCase(); if (!a.name.toLowerCase().includes(q) && !a.campaign.toLowerCase().includes(q) && !a.adset.toLowerCase().includes(q)) return false; }
    return true;
  }).sort((a, b) => {
    if (sortKey === "start_date") return sortDir === "desc" ? new Date(b.start_date) - new Date(a.start_date) : new Date(a.start_date) - new Date(b.start_date);
    return sortDir === "desc" ? (b[sortKey] || 0) - (a[sortKey] || 0) : (a[sortKey] || 0) - (b[sortKey] || 0);
  });

  const totalSpend = ads.reduce((s, a) => s + a.spend, 0);
  const skalovani = ads.filter(a => vyhodnoceni(a.cpr) === "Škálovat").length;
  const vypnout = ads.filter(a => vyhodnoceni(a.cpr) === "Vypnout").length;
  const novyFormat = ads.filter(a => parseName(a.name)).length;

  const loadLive = async () => {
    setLoading(true); setLiveError(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: `Načti reklamy z Meta účtu ${ACCOUNT_ID}. Vrať JSON pole nebo {"error":"no_access"}.` }], mcp_servers: [{ type: "url", url: "https://mcp.facebook.com/ads", name: "meta" }] }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      if (text.includes("no_access") || text.includes("not enabled")) throw new Error();
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      if (Array.isArray(parsed) && parsed.length > 0) { setAds(parsed); setIsLive(true); } else throw new Error();
    } catch { setLiveError("Meta API pro FairShare ještě není aktivní. Zobrazuji demo data."); }
    finally { setLoading(false); }
  };

  const SortBtn = ({ k, label }) => (
    <span onClick={() => { if (sortKey === k) setSortDir(d => d === "desc" ? "asc" : "desc"); else { setSortKey(k); setSortDir("desc"); } }}
      style={{ cursor: "pointer", color: sortKey === k ? "var(--color-text-primary)" : "inherit", userSelect: "none" }}>
      {label}{sortKey === k ? (sortDir === "desc" ? " ↓" : " ↑") : ""}
    </span>
  );

  return (
    <div style={{ fontFamily: "var(--font-sans)", color: "var(--color-text-primary)" }}>
      <h2 className="sr-only">FairShare Meta Ads – vyhodnocení kreativ</h2>
      <div style={{ padding: "18px 18px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 2, display: "flex", alignItems: "center", gap: 6 }}>
              <i className="ti ti-brand-meta" style={{ fontSize: 13 }} aria-hidden="true" />
              FairShare – Zacíleno
              <span style={{ fontSize: 10, padding: "1px 7px", borderRadius: 10, fontWeight: 500, background: isLive ? "#EAF3DE" : "#FAEEDA", color: isLive ? "#27500A" : "#633806" }}>
                {isLive ? "Live data" : "Demo data"}
              </span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 500 }}>Vyhodnocení kreativ</div>
          </div>
          <button onClick={loadLive} disabled={loading} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", fontSize: 13 }}>
            <i className="ti ti-refresh" style={{ fontSize: 14 }} aria-hidden="true" />
            {loading ? "Načítám..." : "Načíst z Meta ↗"}
          </button>
        </div>

        {liveError && (
          <div style={{ background: "#FAEEDA", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#633806", marginBottom: 12, display: "flex", gap: 8 }}>
            <i className="ti ti-info-circle" style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }} aria-hidden="true" />{liveError}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 14 }}>
          {[
            { label: "Celkový spend", value: totalSpend.toLocaleString("cs") + " Kč", sub: ads.length + " kreativ" },
            { label: "Škálovat", value: skalovani, sub: `CPR pod ${CÍLOVÉ_CPA} Kč`, ok: true },
            { label: "Vypnout", value: vypnout, sub: `CPR nad ${CÍLOVÉ_CPA * 1.5} Kč`, bad: true },
            { label: "Nový formát názvů", value: `${novyFormat} / ${ads.length}`, sub: "kreativ pojmenováno správně" },
          ].map(c => (
            <div key={c.label} style={{ background: c.ok ? "#EAF3DE" : c.bad ? "#FCEBEB" : "var(--color-background-secondary)", borderRadius: 8, padding: "10px 14px" }}>
              <div style={{ fontSize: 11, color: c.ok ? "#3B6D11" : c.bad ? "#A32D2D" : "var(--color-text-secondary)", marginBottom: 2 }}>{c.label}</div>
              <div style={{ fontSize: 20, fontWeight: 500, color: c.ok ? "#27500A" : c.bad ? "#791F1F" : "var(--color-text-primary)" }}>{c.value}</div>
              {c.sub && <div style={{ fontSize: 11, color: c.ok ? "#3B6D11" : c.bad ? "#A32D2D" : "var(--color-text-secondary)" }}>{c.sub}</div>}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          <input placeholder="Hledat název, kampaň, sestava..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, minWidth: 180, fontSize: 13 }} />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ fontSize: 13 }}>
            <option>Vše</option><option>ACTIVE</option><option>PAUSED</option>
          </select>
          <select value={filterTyp} onChange={e => setFilterTyp(e.target.value)} style={{ fontSize: 13 }}>
            {typy.map(t => <option key={t}>{t}</option>)}
          </select>
          <select value={filterVyhodnoceni} onChange={e => setFilterVyhodnoceni(e.target.value)} style={{ fontSize: 13 }}>
            <option>Vše</option><option>Škálovat</option><option>Udržet</option><option>Vypnout</option>
          </select>
        </div>
        <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 10 }}>
          {filtered.length} z {ads.length} kreativ · kliknutím zobrazíš detail a AI analýzu
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(0,1.3fr) minmax(0,1.3fr) 95px 110px 100px 30px", padding: "7px 18px", background: "var(--color-background-secondary)", borderBottom: "0.5px solid var(--color-border-tertiary)", fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", gap: 10 }}>
        <div>Kreativa</div>
        <div>Sestava</div>
        <div>Kampaň</div>
        <div><SortBtn k="start_date" label="Spuštění" /></div>
        <div>Vyhodnocení</div>
        <div>Status</div>
        <div />
      </div>

      {filtered.map(ad => <DetailRow key={ad.id} ad={ad} allAds={ads} />)}
      {filtered.length === 0 && (
        <div style={{ padding: "32px 18px", textAlign: "center", fontSize: 13, color: "var(--color-text-secondary)" }}>
          Žádné kreativy neodpovídají filtru.
        </div>
      )}
    </div>
  );
}
