import { useState, useCallback } from "react";

const ACCOUNT_ID = "2016253208521227";
const DRIVE_FOLDER_URL = "https://drive.google.com/drive/folders/1OY2mGDgnUrFeYL5qOqyoRf2_NYpMCBVc";

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

function getMetaAdLink(adId) {
  return `https://www.facebook.com/adsmanager/manage/ads?act=${ACCOUNT_ID}&selected_ad_ids=${adId}`;
}

function getDriveSearchLink(name) {
  if (!DRIVE_FOLDER_URL) return null;
  return `${DRIVE_FOLDER_URL}?q=${encodeURIComponent(name)}`;
}

function vyhodnoceni(cpr, skalovatDo = 300, vypnoutOd = 450) {
  if (!cpr || cpr === 0) return "Nedostatek dat";
  if (cpr <= skalovatDo) return "Škálovat";
  if (cpr <= vypnoutOd) return "Udržet";
  return "Vypnout";
}

const DEMO_ADS = [
  { id: "ad_001", name: "video_fs_hadka_manychat_04_2026", status: "ACTIVE", start_date: "2026-04-01", campaign: "Konverze – FairShare Q2 2026", adset: "Broad CZ 25-55", format: "Video", placement: "Reels", spend: 3200, impressions: 28000, reach: 18000, clicks: 310, link_clicks: 280, ctr: 1.11, cpc: 10.3, cpm: 114, roas: 4.1, cpr: 267, cvr: 4.2, cost_per_lead: 220, results: 12, leads: 14, purchases: 4, frequency: 1.6, thruplay: 8400, video_p25: 15200, video_p50: 11800, video_p75: 9200, video_p100: 5600 },
  { id: "ad_002", name: "video_fs_avatarka_fbform_03_2026", status: "ACTIVE", start_date: "2026-03-15", campaign: "Leady – FairShare Q1 2026", adset: "Lookalike 1% CZ", format: "Video", placement: "Facebook Feed", spend: 5800, impressions: 62000, reach: 41000, clicks: 480, link_clicks: 420, ctr: 0.77, cpc: 12.1, cpm: 94, roas: 2.8, cpr: 483, cvr: 2.1, cost_per_lead: 390, results: 12, leads: 15, purchases: 2, frequency: 1.5, thruplay: 14000, video_p25: 28000, video_p50: 19000, video_p75: 13000, video_p100: 7200 },
  { id: "ad_003", name: "video_fs_testimonial_04_2026", status: "ACTIVE", start_date: "2026-04-03", campaign: "Konverze – FairShare Q2 2026", adset: "Retargeting web", format: "Video", placement: "Facebook Feed, Reels", spend: 4100, impressions: 35000, reach: 22000, clicks: 390, link_clicks: 350, ctr: 1.11, cpc: 10.5, cpm: 117, roas: 3.9, cpr: 293, cvr: 3.8, cost_per_lead: 240, results: 14, leads: 17, purchases: 5, frequency: 1.6, thruplay: 9800, video_p25: 18200, video_p50: 13400, video_p75: 9800, video_p100: 5100 },
  { id: "ad_004", name: "banner_fs_sleva33_03_2026", status: "PAUSED", start_date: "2026-03-01", campaign: "Konverze – FairShare Q1 2026", adset: "Zájemci bydlení CZ", format: "Banner", placement: "Facebook Feed", spend: 2100, impressions: 41000, reach: 31000, clicks: 168, link_clicks: 140, ctr: 0.41, cpc: 12.5, cpm: 51, roas: 0.8, cpr: 1050, cvr: 0.5, cost_per_lead: 890, results: 2, leads: 2, purchases: 0, frequency: 1.3, thruplay: 0, video_p25: 0, video_p50: 0, video_p75: 0, video_p100: 0 },
  { id: "ad_005", name: "video_fs_problem_solution_04_2026", status: "ACTIVE", start_date: "2026-04-10", campaign: "Konverze – FairShare Q2 2026", adset: "Broad CZ 25-65", format: "Video", placement: "Reels", spend: 6200, impressions: 54000, reach: 35000, clicks: 648, link_clicks: 590, ctr: 1.2, cpc: 9.6, cpm: 115, roas: 5.2, cpr: 211, cvr: 5.1, cost_per_lead: 175, results: 29, leads: 35, purchases: 12, frequency: 1.5, thruplay: 18200, video_p25: 29000, video_p50: 22000, video_p75: 16000, video_p100: 9400 },
  { id: "ad_006", name: "carousel_fs_produkty_02_2026", status: "PAUSED", start_date: "2026-02-10", campaign: "Awareness – FairShare Q1 2026", adset: "Zájemci nemovitosti CZ", format: "Carousel", placement: "Facebook Feed", spend: 1800, impressions: 29000, reach: 21000, clicks: 145, link_clicks: 120, ctr: 0.5, cpc: 12.4, cpm: 62, roas: 1.1, cpr: 900, cvr: 0.8, cost_per_lead: 750, results: 2, leads: 2, purchases: 0, frequency: 1.4, thruplay: 0, video_p25: 0, video_p50: 0, video_p75: 0, video_p100: 0 },
  { id: "ad_007", name: "video_fs_ugc_recenze_manychat_04_2026", status: "ACTIVE", start_date: "2026-04-05", campaign: "Leady – FairShare Q2 2026", adset: "Lookalike 2% CZ", format: "Video", placement: "Instagram Feed, Reels", spend: 7400, impressions: 81000, reach: 52000, clicks: 810, link_clicks: 740, ctr: 1.0, cpc: 9.1, cpm: 91, roas: 4.7, cpr: 246, cvr: 4.1, cost_per_lead: 200, results: 30, leads: 37, purchases: 10, frequency: 1.6, thruplay: 24300, video_p25: 42000, video_p50: 31000, video_p75: 22000, video_p100: 12000 },
  { id: "ad_008", name: "DN_komentar_demontaz_11_2024", status: "ACTIVE", start_date: "2024-11-03", campaign: "Konverze – Den a noc Q4 2024", adset: "Lookalike kupující CZ 1%", format: "Video", placement: "Facebook Feed", spend: 19629, impressions: 185280, reach: 136910, clicks: 1740, link_clicks: 1580, ctr: 0.94, cpc: 11.3, cpm: 106, roas: 4.2, cpr: 384, cvr: 3.8, cost_per_lead: 210, results: 51, leads: 93, purchases: 18, frequency: 1.4, thruplay: 62000, video_p25: 98000, video_p50: 74000, video_p75: 52000, video_p100: 28000 },
  { id: "ad_009", name: "AI_hook_horko_v1_07_2025", status: "ACTIVE", start_date: "2025-07-12", campaign: "Konverze – Léto 2025", adset: "Broad CZ 25-65", format: "Video", placement: "Reels", spend: 5849, impressions: 27440, reach: 15382, clicks: 293, link_clicks: 265, ctr: 1.07, cpc: 20.0, cpm: 213, roas: 3.6, cpr: 344, cvr: 3.1, cost_per_lead: 290, results: 17, leads: 20, purchases: 5, frequency: 1.8, thruplay: 7200, video_p25: 14800, video_p50: 10200, video_p75: 7100, video_p100: 3800 },
  { id: "ad_010", name: "AI_83procent_reklamace_11_2025", status: "PAUSED", start_date: "2025-11-01", campaign: "Konverze – Podzim 2025", adset: "Broad CZ 25-65", format: "Video", placement: "Facebook Feed", spend: 4091, impressions: 12545, reach: 10732, clicks: 73, link_clicks: 62, ctr: 0.58, cpc: 56.8, cpm: 326, roas: 0.3, cpr: 4091, cvr: 0.2, cost_per_lead: 3800, results: 1, leads: 1, purchases: 0, frequency: 1.2, thruplay: 1800, video_p25: 4200, video_p50: 2800, video_p75: 1900, video_p100: 800 },
];

const VERDICT_CFG = {
  "Škálovat":       { bg: "#EAF3DE", text: "#27500A", border: "#639922", icon: "ti-trending-up" },
  "Udržet":         { bg: "#E6F1FB", text: "#0C447C", border: "#378ADD", icon: "ti-minus" },
  "Vypnout":        { bg: "#FCEBEB", text: "#791F1F", border: "#E24B4A", icon: "ti-trending-down" },
  "Nedostatek dat": { bg: "#F1EFE8", text: "#5F5E5A", border: "#888780", icon: "ti-help" },
};

const STATUS_CFG = {
  ACTIVE: { bg: "#EAF3DE", text: "#27500A", dot: "#639922" },
  PAUSED: { bg: "#F1EFE8", text: "#444441", dot: "#888780" },
};

const ROW_METRICS = [
  { key: "results", label: "Výsledky", fmt: v => v ?? "–" },
  { key: "cpr",     label: "CPR",      fmt: v => v ? v.toFixed(0) + " Kč" : "–" },
  { key: "ctr",     label: "CTR",      fmt: v => v ? v.toFixed(2) + "%" : "–" },
  { key: "cpc",     label: "CPC",      fmt: v => v ? v.toFixed(0) + " Kč" : "–" },
  { key: "spend",   label: "Spend",    fmt: v => v ? v.toLocaleString("cs") + " Kč" : "–" },
];

const ALL_METRICS = [
  { key: "spend",         label: "Spend",        fmt: v => v?.toLocaleString("cs") + " Kč", group: "Výkonnost" },
  { key: "results",       label: "Výsledky",     fmt: v => v, group: "Výkonnost" },
  { key: "cpr",           label: "CPR",          fmt: v => v?.toFixed(0) + " Kč", group: "Výkonnost" },
  { key: "roas",          label: "ROAS",         fmt: v => v?.toFixed(1) + "×", group: "Výkonnost" },
  { key: "leads",         label: "Leads",        fmt: v => v, group: "Výkonnost" },
  { key: "purchases",     label: "Nákupy",       fmt: v => v, group: "Výkonnost" },
  { key: "cost_per_lead", label: "CPL",          fmt: v => v?.toFixed(0) + " Kč", group: "Výkonnost" },
  { key: "impressions",   label: "Impressions",  fmt: v => v?.toLocaleString("cs"), group: "Dosah" },
  { key: "reach",         label: "Dosah",        fmt: v => v?.toLocaleString("cs"), group: "Dosah" },
  { key: "frequency",     label: "Frequency",    fmt: v => v?.toFixed(1) + "×", group: "Dosah" },
  { key: "clicks",        label: "Clicks",       fmt: v => v?.toLocaleString("cs"), group: "Engagement" },
  { key: "link_clicks",   label: "Link Clicks",  fmt: v => v?.toLocaleString("cs"), group: "Engagement" },
  { key: "ctr",           label: "CTR",          fmt: v => v?.toFixed(2) + "%", group: "Engagement" },
  { key: "cpc",           label: "CPC",          fmt: v => v?.toFixed(0) + " Kč", group: "Engagement" },
  { key: "cpm",           label: "CPM",          fmt: v => v?.toFixed(0) + " Kč", group: "Engagement" },
  { key: "cvr",           label: "CVR",          fmt: v => v?.toFixed(1) + "%", group: "Engagement" },
  { key: "thruplay",      label: "ThruPlays",    fmt: v => v?.toLocaleString("cs"), group: "Video" },
  { key: "video_p25",     label: "25% dohráno",  fmt: v => v?.toLocaleString("cs"), group: "Video" },
  { key: "video_p50",     label: "50% dohráno",  fmt: v => v?.toLocaleString("cs"), group: "Video" },
  { key: "video_p75",     label: "75% dohráno",  fmt: v => v?.toLocaleString("cs"), group: "Video" },
  { key: "video_p100",    label: "100% dohráno", fmt: v => v?.toLocaleString("cs"), group: "Video" },
];

function avg(arr, key) {
  const vals = arr.map(a => a[key]).filter(v => v != null && v > 0);
  return vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : 0;
}
function isGood(key, val, all) {
  if (!val) return false;
  const a = avg(all, key);
  return ["cpc","cpm","cpr","cost_per_lead"].includes(key) ? val < a * 0.85 : val > a * 1.15;
}
function isBad(key, val, all) {
  if (!val) return false;
  const a = avg(all, key);
  return ["cpc","cpm","cpr","cost_per_lead"].includes(key) ? val > a * 1.3 : val < a * 0.7;
}

function formatDate(dateStr) {
  if (!dateStr) return "–";
  return new Date(dateStr).toLocaleDateString("cs-CZ", { day: "numeric", month: "numeric", year: "numeric" });
}

function VerdiktBadge({ cpr, small, skalovatDo = 300, vypnoutOd = 450 }) {
  const v = vyhodnoceni(cpr, skalovatDo, vypnoutOd);
  const c = VERDICT_CFG[v] || VERDICT_CFG["Nedostatek dat"];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: c.bg, color: c.text, border: `1px solid ${c.border}`, borderRadius: 20, padding: small ? "2px 8px" : "3px 10px", fontSize: small ? 11 : 12, fontWeight: 500, whiteSpace: "nowrap" }}>
      <i className={`ti ${c.icon}`} style={{ fontSize: small ? 11 : 13 }} aria-hidden="true" />{v}
    </span>
  );
}

function IconLink({ href, icon, color, bg, label }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      onClick={e => e.stopPropagation()}
      style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 8, background: bg, color, textDecoration: "none", flexShrink: 0, fontSize: 12, fontWeight: 500, whiteSpace: "nowrap" }}>
      <i className={`ti ${icon}`} style={{ fontSize: 14 }} aria-hidden="true" />
      {label}
    </a>
  );
}

function MetricGroup({ title, metrics, ad, allAds }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 6 }}>
        {metrics.map(m => {
          const val = ad[m.key];
          const good = isGood(m.key, val, allAds);
          const bad = isBad(m.key, val, allAds);
          return (
            <div key={m.key} style={{ background: good ? "#EAF3DE" : bad ? "#FCEBEB" : "var(--color-background-secondary)", borderRadius: 8, padding: "8px 10px" }}>
              <div style={{ fontSize: 10, fontWeight: 500, color: good ? "#3B6D11" : bad ? "#A32D2D" : "var(--color-text-secondary)", marginBottom: 2 }}>{m.label}</div>
              <div style={{ fontSize: 15, fontWeight: 500, color: good ? "#27500A" : bad ? "#791F1F" : "var(--color-text-primary)" }}>{val != null ? m.fmt(val) : "–"}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AIAnalysis({ ad, allAds, skalovatDo = 300, vypnoutOd = 450 }) {
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

Cílové KPI: CPR pod ${skalovatDo} Kč = škálovat, ${skalovatDo}–${vypnoutOd} Kč = udržet, nad ${vypnoutOd} Kč = vypnout
Průměry účtu: CPR ${avgCpr} Kč | CTR ${avgCtr}% | ROAS ${avgRoas}×

Kreativa: ${kreativaInfo}
Kampaň: ${ad.campaign} | Sestava: ${ad.adset} | Formát: ${ad.format} | Umístění: ${ad.placement}
Spend: ${ad.spend?.toLocaleString("cs")} Kč | Reach: ${ad.reach?.toLocaleString("cs")} | Impressions: ${ad.impressions?.toLocaleString("cs")} | Frequency: ${ad.frequency?.toFixed(1)}×
CTR: ${ad.ctr?.toFixed(2)}% | CPC: ${ad.cpc?.toFixed(0)} Kč | CPM: ${ad.cpm?.toFixed(0)} Kč | CVR: ${ad.cvr?.toFixed(1)}%
ROAS: ${ad.roas?.toFixed(1)}× | CPR: ${ad.cpr?.toFixed(0)} Kč | CPL: ${ad.cost_per_lead?.toFixed(0)} Kč
Výsledky: ${ad.results} | Leads: ${ad.leads} | Nákupy: ${ad.purchases}
Video – ThruPlays: ${ad.thruplay?.toLocaleString("cs")} | 25%: ${ad.video_p25?.toLocaleString("cs")} | 50%: ${ad.video_p50?.toLocaleString("cs")} | 75%: ${ad.video_p75?.toLocaleString("cs")} | 100%: ${ad.video_p100?.toLocaleString("cs")}

Vrať POUZE JSON bez markdown:
{
  "verdict": "Škálovat" nebo "Udržet" nebo "Vypnout",
  "verdict_duvod": "1-2 věty proč – konkrétní čísla vs benchmark",
  "co_funguje": ["max 3 body"],
  "co_nefunguje": ["max 3 body"],
  "obsah_kreativy": "Analýza obsahu/tématu a proč to funguje nebo ne u cílové skupiny FairShare (2-3 věty)",
  "doporuceni": ["2-3 konkrétní kroky"],
  "ab_navrh": "Jeden konkrétní A/B test"
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
      <i className="ti ti-sparkles" style={{ fontSize: 15, color: "#7F77DD" }} aria-hidden="true" />Spustit AI analýzu ↗
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
        <VerdiktBadge cpr={ad.cpr} skalovatDo={skalovatDo} vypnoutOd={vypnoutOd} />
        <div style={{ flex: 1, fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.5, minWidth: 200 }}>{result.verdict_duvod}</div>
        <button onClick={run} style={{ fontSize: 11, padding: "3px 8px" }}>Obnovit</button>
      </div>
      <div style={{ background: "#EEEDFE", borderRadius: 8, padding: "10px 14px" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: "#534AB7", marginBottom: 4 }}>Analýza obsahu kreativy</div>
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
        <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 6 }}>Doporučení</div>
        {result.doporuceni?.map((d, i) => (
          <div key={i} style={{ fontSize: 13, marginBottom: 4, lineHeight: 1.4, display: "flex", gap: 8 }}>
            <span style={{ color: "var(--color-text-secondary)", flexShrink: 0 }}>{i + 1}.</span>{d}
          </div>
        ))}
      </div>
      <div style={{ borderLeft: "3px solid #7F77DD", paddingLeft: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 3 }}>A/B test návrh</div>
        <div style={{ fontSize: 13, lineHeight: 1.5 }}>{result.ab_navrh}</div>
      </div>
    </div>
  );
}

// Grid template: name | sestava | kampan | spusteni | [metriky x5] | vyhodnoceni | status | meta | drive | chevron
const GRID = "minmax(220px,3fr) minmax(140px,1.5fr) minmax(160px,1.8fr) 90px repeat(5, minmax(80px,1fr)) 130px 95px 85px 85px 28px";

function DetailRow({ ad, allAds, expandedId, setExpandedId, skalovatDo, vypnoutOd }) {
  const open = expandedId === ad.id;
  const setOpen = (val) => setExpandedId(val ? ad.id : null);
  const sc = STATUS_CFG[ad.status] || STATUS_CFG.PAUSED;
  const parsed = parseName(ad.name);
  const metaLink = getMetaAdLink(ad.id);
  const driveLink = getDriveSearchLink(ad.name);
  const groups = ["Výkonnost", "Dosah", "Engagement", "Video"];

  return (
    <div id={"row-" + ad.id} style={{ borderBottom: "1px solid var(--color-border-tertiary)" }}>
      <div
        onClick={() => setOpen(v => !v)}
        style={{ display: "grid", gridTemplateColumns: GRID, alignItems: "center", padding: "12px 18px", cursor: "pointer", gap: 12, borderLeft: open ? "3px solid #7F77DD" : "3px solid transparent", transition: "border-left 0.15s" }}
        onMouseEnter={e => e.currentTarget.style.background = "var(--color-background-secondary)"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        {/* Název – plný, bez ořezu */}
        <div style={{ fontSize: 13, fontWeight: 500, wordBreak: "break-all" }}>{ad.name}</div>

        {/* Sestava */}
        <div style={{ fontSize: 12, color: "var(--color-text-primary)", wordBreak: "break-word" }}>{ad.adset}</div>

        {/* Kampaň */}
        <div style={{ fontSize: 12, color: "var(--color-text-primary)", wordBreak: "break-word" }}>{ad.campaign}</div>

        {/* Datum */}
        <div style={{ fontSize: 12 }}>{formatDate(ad.start_date)}</div>

        {/* Metriky */}
        {ROW_METRICS.map(m => {
          const val = ad[m.key];
          const good = isGood(m.key, val, allAds);
          const bad = isBad(m.key, val, allAds);
          return (
            <div key={m.key} style={{ textAlign: "right", fontSize: 13, fontWeight: good || bad ? 500 : 400, color: good ? "#27500A" : bad ? "#A32D2D" : "var(--color-text-primary)" }}>
              {val != null ? m.fmt(val) : "–"}
            </div>
          );
        })}

        {/* Vyhodnocení */}
        <div><VerdiktBadge cpr={ad.cpr} small skalovatDo={skalovatDo} vypnoutOd={vypnoutOd} /></div>

        {/* Status */}
        <div>
          <span style={{ fontSize: 11, background: sc.bg, color: sc.text, padding: "2px 7px", borderRadius: 20, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: sc.dot }} />{ad.status}
          </span>
        </div>

        {/* Meta odkaz */}
        <div style={{ display: "flex", alignItems: "center" }} onClick={e => e.stopPropagation()}>
          <IconLink href={metaLink} icon="ti-brand-meta" color="#185FA5" bg="#E6F1FB" label="Meta" />
        </div>

        {/* Drive odkaz */}
        <div style={{ display: "flex", alignItems: "center" }} onClick={e => e.stopPropagation()}>
          {driveLink
            ? <IconLink href={driveLink} icon="ti-brand-google-drive" color="#27500A" bg="#EAF3DE" label="Drive" />
            : <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>–</span>
          }
        </div>

        {/* Chevron */}
        <div style={{ textAlign: "right" }}>
          <i className={`ti ti-chevron-${open ? "up" : "down"}`} style={{ fontSize: 13, color: "var(--color-text-secondary)" }} aria-hidden="true" />
        </div>
      </div>

      {open && (
        <div style={{ padding: "0 16px 20px", display: "flex", flexDirection: "column", gap: 16, background: "var(--color-background-secondary)", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
          {/* Zavřít */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12 }}>
            <div style={{ display: "flex", gap: 12, fontSize: 12, color: "var(--color-text-secondary)", flexWrap: "wrap" }}>
              <span><i className="ti ti-device-tv" style={{ fontSize: 13, verticalAlign: -2, marginRight: 4 }} />{ad.format}</span>
              <span><i className="ti ti-layout" style={{ fontSize: 13, verticalAlign: -2, marginRight: 4 }} />{ad.placement}</span>
              {parsed && <span><i className="ti ti-tag" style={{ fontSize: 13, verticalAlign: -2, marginRight: 4 }} />{parsed.obsah}{parsed.poznamka ? ` · ${parsed.poznamka}` : ""}</span>}
            </div>
            <button onClick={() => setOpen(false)} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, padding: "4px 10px", flexShrink: 0 }}>
              <i className="ti ti-x" style={{ fontSize: 13 }} /> Zavřít
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>Zelená = nad průměrem účtu · Červená = pod průměrem</div>
            {groups.map(g => {
              const gMetrics = ALL_METRICS.filter(m => m.group === g);
              const hasData = gMetrics.some(m => ad[m.key] != null && ad[m.key] > 0);
              if (!hasData) return null;
              return <MetricGroup key={g} title={g} metrics={gMetrics} ad={ad} allAds={allAds} />;
            })}
          </div>
          <div style={{ borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: 14 }}>
            <AIAnalysis ad={ad} allAds={allAds} skalovatDo={skalovatDo} vypnoutOd={vypnoutOd} />
          </div>
          {/* Zavřít dole */}
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 4 }}>
            <button onClick={() => setOpen(false)} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, padding: "6px 16px" }}>
              <i className="ti ti-chevron-up" style={{ fontSize: 13 }} /> Zavřít detail
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [prahovaSkalovatDo, setPrahovaSkalovatDo] = useState(300);
  const [prahovaVypnoutOd, setPrahovaVypnoutOd] = useState(450);
  const [ads, setAds] = useState(DEMO_ADS);
  const [loading, setLoading] = useState(false);
  const [liveError, setLiveError] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("vse");
  const [filterTyp, setFilterTyp] = useState("vse");
  const [filterVyhodnoceni, setFilterVyhodnoceni] = useState("vse");
  const [sortKey, setSortKey] = useState("start_date");
  const [sortDir, setSortDir] = useState("desc");
  const [expandedId, setExpandedId] = useState(null);

  const typy = Array.from(new Set(ads.map(a => { const p = parseName(a.name); return p ? p.typ : "stary"; })));

  const filtered = ads.filter(a => {
    if (filterStatus !== "vse" && a.status !== filterStatus) return false;
    if (filterTyp !== "vse") { const p = parseName(a.name); if ((p ? p.typ : "stary") !== filterTyp) return false; }
    if (filterVyhodnoceni !== "vse" && vyhodnoceni(a.cpr, prahovaSkalovatDo, prahovaVypnoutOd) !== filterVyhodnoceni) return false;
    if (search) { const q = search.toLowerCase(); if (!a.name.toLowerCase().includes(q) && !a.campaign.toLowerCase().includes(q) && !a.adset.toLowerCase().includes(q)) return false; }
    return true;
  }).sort((a, b) => {
    if (sortKey === "start_date") return sortDir === "desc" ? new Date(b.start_date) - new Date(a.start_date) : new Date(a.start_date) - new Date(b.start_date);
    return sortDir === "desc" ? (b[sortKey] || 0) - (a[sortKey] || 0) : (a[sortKey] || 0) - (b[sortKey] || 0);
  });

  const totalSpend = ads.reduce((s, a) => s + (a.spend || 0), 0);
  const bestAd = [...ads].filter(a => a.cpr > 0).sort((a, b) => a.cpr - b.cpr)[0] || null;
  const skalovani = ads.filter(a => vyhodnoceni(a.cpr, prahovaSkalovatDo, prahovaVypnoutOd) === "Škálovat").length;
  const vypnout = ads.filter(a => vyhodnoceni(a.cpr, prahovaSkalovatDo, prahovaVypnoutOd) === "Vypnout").length;

  const loadLive = async () => {
    setLoading(true); setLiveError(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 2000,
          messages: [{ role: "user", content: `Načti všechny aktivní a pozastavené reklamy z Meta ad účtu ${ACCOUNT_ID} za posledních 90 dní. Pro každou reklamu vrať JSON pole s poli: id, name, status, start_date, campaign, adset, format, placement, spend, impressions, reach, clicks, link_clicks, ctr, cpc, cpm, roas, cpr, cvr, cost_per_lead, results, leads, purchases, frequency, thruplay, video_p25, video_p50, video_p75, video_p100. Vrať pouze JSON bez komentářů. Pokud nemáš přístup vrať {"error":"no_access"}.` }],
          mcp_servers: [{ type: "url", url: "https://mcp.facebook.com/ads", name: "meta" }],
        }),
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
              <i className="ti ti-brand-meta" style={{ fontSize: 13 }} aria-hidden="true" />FairShare – Zacíleno
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

        {/* Prahové hodnoty CPA */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
            <i className="ti ti-target" style={{ fontSize: 12 }} /> Prahové hodnoty CPA
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {/* Škálovat */}
            <div style={{ background: "#EAF3DE", border: "1px solid #B7DCA0", borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <i className="ti ti-trending-up" style={{ fontSize: 14, color: "#27500A" }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#27500A", textTransform: "uppercase", letterSpacing: "0.04em" }}>Škálovat</span>
              </div>
              <div style={{ fontSize: 11, color: "#3B6D11", marginBottom: 6 }}>CPR pod</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  type="number"
                  value={prahovaSkalovatDo}
                  onChange={e => setPrahovaSkalovatDo(Number(e.target.value) || 0)}
                  style={{ width: "100%", fontSize: 20, fontWeight: 700, color: "#27500A", background: "transparent", border: "none", borderBottom: "2px solid #B7DCA0", borderRadius: 0, padding: "2px 0", outline: "none" }}
                />
                <span style={{ fontSize: 13, color: "#3B6D11", flexShrink: 0 }}>Kč</span>
              </div>
            </div>
            {/* Udržet */}
            <div style={{ background: "#E6F1FB", border: "1px solid #A8CEEF", borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <i className="ti ti-minus" style={{ fontSize: 14, color: "#0C447C" }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#0C447C", textTransform: "uppercase", letterSpacing: "0.04em" }}>Udržet</span>
              </div>
              <div style={{ fontSize: 11, color: "#185FA5", marginBottom: 6 }}>CPR {prahovaSkalovatDo} – {prahovaVypnoutOd} Kč</div>
              <div style={{ fontSize: 13, color: "#185FA5", fontStyle: "italic" }}>automaticky</div>
            </div>
            {/* Vypnout */}
            <div style={{ background: "#FCEBEB", border: "1px solid #F0B8B8", borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <i className="ti ti-trending-down" style={{ fontSize: 14, color: "#791F1F" }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#791F1F", textTransform: "uppercase", letterSpacing: "0.04em" }}>Vypnout</span>
              </div>
              <div style={{ fontSize: 11, color: "#A32D2D", marginBottom: 6 }}>CPR nad</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  type="number"
                  value={prahovaVypnoutOd}
                  onChange={e => setPrahovaVypnoutOd(Number(e.target.value) || 0)}
                  style={{ width: "100%", fontSize: 20, fontWeight: 700, color: "#791F1F", background: "transparent", border: "none", borderBottom: "2px solid #F0B8B8", borderRadius: 0, padding: "2px 0", outline: "none" }}
                />
                <span style={{ fontSize: 13, color: "#A32D2D", flexShrink: 0 }}>Kč</span>
              </div>
            </div>
          </div>
        </div>

        {liveError && (
          <div style={{ background: "#FAEEDA", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#633806", marginBottom: 12, display: "flex", gap: 8 }}>
            <i className="ti ti-info-circle" style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }} aria-hidden="true" />{liveError}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8, marginBottom: 14 }}>
          {/* Nejúspěšnější kreativa – kliknutelná */}
          <div
            onClick={() => { if (bestAd) { setExpandedId(bestAd.id); setTimeout(() => document.getElementById("row-" + bestAd.id)?.scrollIntoView({ behavior: "smooth", block: "center" }), 50); } }}
            style={{ background: "#EEEDFE", borderRadius: 8, padding: "10px 14px", cursor: bestAd ? "pointer" : "default", border: "1px solid transparent", transition: "border 0.15s" }}
            onMouseEnter={e => { if (bestAd) e.currentTarget.style.border = "1px solid #7F77DD"; }}
            onMouseLeave={e => e.currentTarget.style.border = "1px solid transparent"}
          >
            <div style={{ fontSize: 11, color: "#534AB7", marginBottom: 4, fontWeight: 500, display: "flex", alignItems: "center", gap: 5 }}>
              <i className="ti ti-trophy" style={{ fontSize: 13 }} /> Nejúspěšnější kreativa
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#3C3489", wordBreak: "break-all", lineHeight: 1.4 }}>
              {bestAd ? bestAd.name : "–"}
            </div>
            {bestAd && <div style={{ fontSize: 11, color: "#534AB7", marginTop: 4 }}>CPR: {bestAd.cpr?.toFixed(0)} Kč · {bestAd.results} výsledků · klikni pro detail ↓</div>}
          </div>
          <div style={{ background: "#EAF3DE", borderRadius: 8, padding: "10px 14px" }}>
            <div style={{ fontSize: 11, color: "#3B6D11", marginBottom: 2, fontWeight: 500 }}>Škálovat</div>
            <div style={{ fontSize: 20, fontWeight: 500, color: "#27500A" }}>{skalovani}</div>
            <div style={{ fontSize: 11, color: "#3B6D11" }}>{`CPR pod ${prahovaSkalovatDo} Kč`}</div>
          </div>
          <div style={{ background: "#FCEBEB", borderRadius: 8, padding: "10px 14px" }}>
            <div style={{ fontSize: 11, color: "#A32D2D", marginBottom: 2, fontWeight: 500 }}>Vypnout</div>
            <div style={{ fontSize: 20, fontWeight: 500, color: "#791F1F" }}>{vypnout}</div>
            <div style={{ fontSize: 11, color: "#A32D2D" }}>{`CPR nad ${prahovaVypnoutOd} Kč`}</div>
          </div>

        </div>

        {/* Filtry – jasně pojmenované */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10, alignItems: "center", rowGap: 6 }}>
          <input placeholder="Hledat název, kampaň, sestavu..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, minWidth: 200, fontSize: 13 }} />

          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ fontSize: 13 }}>
            <option value="vse">Stav: všechny</option>
            <option value="ACTIVE">Stav: aktivní</option>
            <option value="PAUSED">Stav: pozastavené</option>
          </select>

          <select value={filterTyp} onChange={e => setFilterTyp(e.target.value)} style={{ fontSize: 13 }}>
            <option value="vse">Typ kreativy: všechny</option>
            {typy.map(t => <option key={t} value={t}>{t === "stary" ? "Starý formát" : t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>

          <select value={filterVyhodnoceni} onChange={e => setFilterVyhodnoceni(e.target.value)} style={{ fontSize: 13 }}>
            <option value="vse">Vyhodnocení: všechny</option>
            <option value="Škálovat">Vyhodnocení: škálovat</option>
            <option value="Udržet">Vyhodnocení: udržet</option>
            <option value="Vypnout">Vyhodnocení: vypnout</option>
          </select>
        </div>

        <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 10 }}>
          {filtered.length} z {ads.length} kreativ · kliknutím na řádek zobrazíš detail, metriky a AI analýzu
        </div>
      </div>

      {/* Desktop tabulka */}
      <div style={{ overflowX: "auto" }}>
        <div style={{ minWidth: 1300 }}>
          <div style={{ display: "grid", gridTemplateColumns: GRID, padding: "9px 18px", background: "var(--color-background-secondary)", borderBottom: "2px solid var(--color-border-secondary)", borderTop: "1px solid var(--color-border-secondary)", fontSize: 11, fontWeight: 700, color: "var(--color-text-primary)", gap: 12, textTransform: "uppercase", letterSpacing: "0.04em", padding: "10px 18px" }}>
            <div>Kreativa</div>
            <div>Sestava</div>
            <div>Kampaň</div>
            <div><SortBtn k="start_date" label="Spuštění" /></div>
            {ROW_METRICS.map(m => <div key={m.key} style={{ textAlign: "right" }}><SortBtn k={m.key} label={m.label} /></div>)}
            <div>Vyhodnocení</div>
            <div>Stav</div>
            <div>Meta</div>
            <div>Drive</div>
            <div />
          </div>
          {filtered.map(ad => <DetailRow key={ad.id} ad={ad} allAds={ads} expandedId={expandedId} setExpandedId={setExpandedId} skalovatDo={prahovaSkalovatDo} vypnoutOd={prahovaVypnoutOd} />)}
          {filtered.length === 0 && (
            <div style={{ padding: "32px 18px", textAlign: "center", fontSize: 13, color: "var(--color-text-secondary)" }}>
              Žádné kreativy neodpovídají filtru.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
