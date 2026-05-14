import { useState, useEffect, useCallback, useRef } from "react";

const ACCOUNT_ID = "2016253208521227";

const DEMO_ADS = [
  {
    id: "ad_001", name: "DN_komentar_den_noc_11_2024", status: "ACTIVE",
    campaign: "Konverze – Den a noc Q4 2024", adset: "Zájemci žaluzie CZ 25-55", format: "Video", placement: "Facebook Feed",
    spend: 1929, impressions: 8572, reach: 7430, clicks: 78, ctr: 0.91, cpc: 24.74, cpm: 225, roas: 1.8,
    cpr: 482, cvr: 1.9, cost_per_lead: 320, results: 4,
  },
  {
    id: "ad_002", name: "DN_komentar_demontaz_11_2024", status: "ACTIVE",
    campaign: "Konverze – Den a noc Q4 2024", adset: "Lookalike kupující CZ 1%", format: "Video", placement: "Facebook Feed, Reels",
    spend: 19629, impressions: 185280, reach: 136910, clicks: 1740, ctr: 0.94, cpc: 11.3, cpm: 106, roas: 4.2,
    cpr: 384, cvr: 3.8, cost_per_lead: 210, results: 51,
  },
  {
    id: "ad_003", name: "DN_timelapse_vysledek_09_2024", status: "ACTIVE",
    campaign: "Konverze – Den a noc Q4 2024", adset: "Retargeting web návštěvníci", format: "Video", placement: "Instagram Feed",
    spend: 11120, impressions: 83010, reach: 49142, clicks: 690, ctr: 0.83, cpc: 16.1, cpm: 134, roas: 3.1,
    cpr: 358, cvr: 2.3, cost_per_lead: 280, results: 31,
  },
  {
    id: "ad_004", name: "PLISE_mluvene_produktove_06_2024", status: "ACTIVE",
    campaign: "Konverze – Plisé žaluzie 2024", adset: "Zájemci bydlení CZ 30-60", format: "Video", placement: "Facebook Feed",
    spend: 5632, impressions: 43323, reach: 29575, clicks: 386, ctr: 0.89, cpc: 14.6, cpm: 130, roas: 0.9,
    cpr: 1126, cvr: 0.7, cost_per_lead: 940, results: 5,
  },
  {
    id: "ad_005", name: "AI_hook_pes_v2_07_2025", status: "ACTIVE",
    campaign: "Konverze – Léto 2025", adset: "Broad CZ 25-65", format: "Video", placement: "Reels",
    spend: 4239, impressions: 21745, reach: 12182, clicks: 196, ctr: 0.9, cpc: 21.6, cpm: 195, roas: 2.3,
    cpr: 424, cvr: 2.1, cost_per_lead: 350, results: 10,
  },
  {
    id: "ad_006", name: "AI_hook_horko_v1_07_2025", status: "ACTIVE",
    campaign: "Konverze – Léto 2025", adset: "Broad CZ 25-65", format: "Video", placement: "Reels",
    spend: 5849, impressions: 27440, reach: 15382, clicks: 293, ctr: 1.07, cpc: 20.0, cpm: 213, roas: 3.6,
    cpr: 344, cvr: 3.1, cost_per_lead: 290, results: 17,
  },
  {
    id: "ad_007", name: "AI_trapit_montaz_zena_11_2025", status: "ACTIVE",
    campaign: "Konverze – Podzim 2025", adset: "Zájemci renovace CZ", format: "Video", placement: "Facebook Feed",
    spend: 5655, impressions: 20791, reach: 15034, clicks: 126, ctr: 0.61, cpc: 44.9, cpm: 272, roas: 1.4,
    cpr: 707, cvr: 0.9, cost_per_lead: 590, results: 8,
  },
  {
    id: "ad_008", name: "DN_rozdil_sleva33_09_2024", status: "PAUSED",
    campaign: "Konverze – Den a noc Q4 2024", adset: "Lookalike kupující CZ 1%", format: "Video", placement: "Facebook Feed",
    spend: 11900, impressions: 104562, reach: 78923, clicks: 590, ctr: 0.57, cpc: 20.2, cpm: 114, roas: 2.1,
    cpr: 850, cvr: 1.2, cost_per_lead: 700, results: 14,
  },
  {
    id: "ad_009", name: "PLISE_jakprobihamontaz_03_2025", status: "ACTIVE",
    campaign: "Konverze – Plisé žaluzie 2025", adset: "Retargeting web návštěvníci", format: "Video", placement: "Instagram Feed, Reels",
    spend: 3028, impressions: 22423, reach: 14336, clicks: 223, ctr: 1.0, cpc: 13.6, cpm: 135, roas: 4.8,
    cpr: 189, cvr: 5.2, cost_per_lead: 160, results: 16,
  },
  {
    id: "ad_010", name: "AI_83procent_reklamace_11_2025", status: "PAUSED",
    campaign: "Konverze – Podzim 2025", adset: "Broad CZ 25-65", format: "Video", placement: "Facebook Feed",
    spend: 4091, impressions: 12545, reach: 10732, clicks: 73, ctr: 0.58, cpc: 56.8, cpm: 326, roas: 0.3,
    cpr: 4091, cvr: 0.2, cost_per_lead: 3800, results: 1,
  },
  {
    id: "ad_011", name: "INFLUENCER_miriamk_shrnuti_12_2025", status: "ACTIVE",
    campaign: "Konverze – Influencer Q4 2025", adset: "Lookalike kupující CZ 2%", format: "Video", placement: "Instagram Feed, Reels",
    spend: 12875, impressions: 90118, reach: 50223, clicks: 468, ctr: 0.52, cpc: 27.5, cpm: 143, roas: 3.9,
    cpr: 368, cvr: 2.7, cost_per_lead: 310, results: 35,
  },
  {
    id: "ad_012", name: "INFLUENCER_miriamk_timelapse_12_2025", status: "ACTIVE",
    campaign: "Konverze – Influencer Q4 2025", adset: "Lookalike kupující CZ 2%", format: "Video", placement: "Instagram Feed",
    spend: 9667, impressions: 64637, reach: 42056, clicks: 316, ctr: 0.49, cpc: 30.7, cpm: 149, roas: 2.8,
    cpr: 483, cvr: 1.9, cost_per_lead: 400, results: 20,
  },
];

const METRICS = [
  { key: "spend", label: "Spend", fmt: v => v.toLocaleString("cs") + " Kč", desc: "Celkové výdaje" },
  { key: "impressions", label: "Impressions", fmt: v => v.toLocaleString("cs"), desc: "Počet zobrazení" },
  { key: "reach", label: "Dosah", fmt: v => v.toLocaleString("cs"), desc: "Unikátní uživatelé" },
  { key: "clicks", label: "Clicks", fmt: v => v.toLocaleString("cs"), desc: "Počet kliknutí" },
  { key: "ctr", label: "CTR", fmt: v => v.toFixed(2) + " %", desc: "Click-through rate" },
  { key: "cpc", label: "CPC", fmt: v => v.toFixed(0) + " Kč", desc: "Cena za kliknutí" },
  { key: "cpm", label: "CPM", fmt: v => v.toFixed(0) + " Kč", desc: "Cena za 1000 zobrazení" },
  { key: "roas", label: "ROAS", fmt: v => v.toFixed(1) + "×", desc: "Návratnost výdajů na reklamu" },
  { key: "cpr", label: "CPR", fmt: v => v.toFixed(0) + " Kč", desc: "Cena za výsledek" },
  { key: "cvr", label: "CVR", fmt: v => v.toFixed(1) + " %", desc: "Conversion rate" },
  { key: "cost_per_lead", label: "CPL", fmt: v => v.toFixed(0) + " Kč", desc: "Cena za lead" },
  { key: "results", label: "Výsledky", fmt: v => v.toLocaleString("cs"), desc: "Počet výsledků (nákupy/leady)" },
];

const STATUS_CFG = {
  ACTIVE: { bg: "#EAF3DE", text: "#27500A", dot: "#639922" },
  PAUSED: { bg: "#F1EFE8", text: "#444441", dot: "#888780" },
};

function fmt(key, val) {
  const m = METRICS.find(m => m.key === key);
  return m ? m.fmt(val) : val;
}

function isGood(key, val, all) {
  const vals = all.map(a => a[key]).filter(v => v != null);
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  const lowerBetter = ["cpc", "cpm", "cpr", "cvr", "cost_per_lead"].includes(key);
  if (lowerBetter) return val < avg * 0.85;
  return val > avg * 1.15;
}

function isBad(key, val, all) {
  const vals = all.map(a => a[key]).filter(v => v != null);
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  const lowerBetter = ["cpc", "cpm", "cpr", "cvr", "cost_per_lead"].includes(key);
  if (lowerBetter) return val > avg * 1.3;
  return val < avg * 0.7;
}

function MetricPill({ label, value, good, bad }) {
  const bg = good ? "#EAF3DE" : bad ? "#FCEBEB" : "var(--color-background-secondary)";
  const color = good ? "#27500A" : bad ? "#791F1F" : "var(--color-text-primary)";
  return (
    <div style={{ background: bg, borderRadius: 8, padding: "8px 12px", minWidth: 0 }}>
      <div style={{ fontSize: 10, color: good ? "#3B6D11" : bad ? "#A32D2D" : "var(--color-text-secondary)", marginBottom: 2, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 500, color }}>{value}</div>
    </div>
  );
}

function AIAnalysis({ ad, allAds }) {
  const [state, setState] = useState("idle");
  const [result, setResult] = useState(null);

  const run = useCallback(async () => {
    setState("loading");
    const avgRoas = (allAds.reduce((s, a) => s + a.roas, 0) / allAds.length).toFixed(1);
    const avgCpr = (allAds.reduce((s, a) => s + a.cpr, 0) / allAds.length).toFixed(0);
    const avgCtr = (allAds.reduce((s, a) => s + a.ctr, 0) / allAds.length).toFixed(2);

    const prompt = `Jsi senior Meta Ads specialista pro e-shop prodávající žaluzie a stínící techniku na míru (FairShare / Žaluzieee.cz). Analyzuješ kreativu na základě skutečných dat.

Průměrné hodnoty účtu (benchmark):
- ROAS: ${avgRoas}×, CPR: ${avgCpr} Kč, CTR: ${avgCtr}%

Data kreativy:
Název: ${ad.name}
Kampaň: ${ad.campaign}
Ad set: ${ad.adset}
Formát: ${ad.format} | Umístění: ${ad.placement}
Status: ${ad.status}
Spend: ${ad.spend.toLocaleString("cs")} Kč | Impressions: ${ad.impressions.toLocaleString("cs")} | Dosah: ${ad.reach.toLocaleString("cs")}
Clicks: ${ad.clicks} | CTR: ${ad.ctr.toFixed(2)}% | CPC: ${ad.cpc.toFixed(0)} Kč | CPM: ${ad.cpm.toFixed(0)} Kč
ROAS: ${ad.roas.toFixed(1)}× | CPR: ${ad.cpr.toFixed(0)} Kč | CVR: ${ad.cvr.toFixed(1)}% | CPL: ${ad.cost_per_lead.toFixed(0)} Kč | Výsledky: ${ad.results}

Odpověz POUZE jako JSON (bez markdown, bez backtick, bez komentářů):
{
  "verdict": "Funguje nejlépe" nebo "Funguje dobře" nebo "Průměrné" nebo "Nefunguje",
  "score": číslo 1-10,
  "hlavni_zaver": "Jedna věta – hlavní závěr o kreativě",
  "silne": ["max 3 body"],
  "slabe": ["max 3 body"],
  "doporuceni": "Konkrétní akce: škálovat / pozastavit / upravit / otestovat. 2-3 věty.",
  "ab_test": "Jeden konkrétní návrh na A/B test pro tuto kreativu"
}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      setResult(parsed);
      setState("done");
    } catch {
      setState("error");
    }
  }, [ad, allAds]);

  const VERDICT_CFG = {
    "Funguje nejlépe": { bg: "#EAF3DE", text: "#27500A", dot: "#639922" },
    "Funguje dobře": { bg: "#E6F1FB", text: "#0C447C", dot: "#378ADD" },
    "Průměrné": { bg: "#FAEEDA", text: "#633806", dot: "#BA7517" },
    "Nefunguje": { bg: "#FCEBEB", text: "#791F1F", dot: "#E24B4A" },
  };

  if (state === "idle") return (
    <button onClick={run} style={{ width: "100%", padding: "9px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 13, fontWeight: 500 }}>
      <i className="ti ti-sparkles" style={{ fontSize: 15, color: "#7F77DD" }} aria-hidden="true" />
      Spustit AI analýzu ↗
    </button>
  );

  if (state === "loading") return (
    <div style={{ padding: "14px 0", textAlign: "center", fontSize: 13, color: "var(--color-text-secondary)" }}>
      Claude analyzuje data...
    </div>
  );

  if (state === "error") return (
    <div style={{ padding: "10px", background: "#FCEBEB", borderRadius: 8, fontSize: 13, color: "#791F1F", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      Chyba při analýze.
      <button onClick={run} style={{ fontSize: 12, padding: "3px 10px", cursor: "pointer" }}>Zkusit znovu</button>
    </div>
  );

  const vc = VERDICT_CFG[result.verdict] || VERDICT_CFG["Průměrné"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: vc.bg, color: vc.text, fontSize: 12, fontWeight: 500, padding: "3px 10px", borderRadius: 20 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: vc.dot }} />
            {result.verdict}
          </span>
          <div style={{ display: "flex", gap: 2 }}>
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} style={{ width: 14, height: 5, borderRadius: 3, background: i < result.score ? "#7F77DD" : "var(--color-border-tertiary)" }} />
            ))}
            <span style={{ fontSize: 11, color: "var(--color-text-secondary)", marginLeft: 4 }}>{result.score}/10</span>
          </div>
        </div>
        <button onClick={run} style={{ fontSize: 11, padding: "2px 8px", cursor: "pointer" }}>Obnovit</button>
      </div>

      <div style={{ fontSize: 13, color: "var(--color-text-primary)", fontStyle: "italic", paddingLeft: 10, borderLeft: "2px solid #7F77DD" }}>
        {result.hlavni_zaver}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div style={{ background: "#EAF3DE", borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: "#3B6D11", marginBottom: 5 }}>Silné stránky</div>
          {result.silne?.map((s, i) => <div key={i} style={{ fontSize: 12, color: "#27500A", marginBottom: 3, lineHeight: 1.4 }}>• {s}</div>)}
        </div>
        <div style={{ background: "#FCEBEB", borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: "#A32D2D", marginBottom: 5 }}>Slabé stránky</div>
          {result.slabe?.map((s, i) => <div key={i} style={{ fontSize: 12, color: "#791F1F", marginBottom: 3, lineHeight: 1.4 }}>• {s}</div>)}
        </div>
      </div>

      <div style={{ background: "#EEEDFE", borderRadius: 8, padding: "10px 12px" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: "#534AB7", marginBottom: 4 }}>Doporučení</div>
        <div style={{ fontSize: 13, color: "#3C3489", lineHeight: 1.5 }}>{result.doporuceni}</div>
      </div>

      <div style={{ background: "var(--color-background-secondary)", borderRadius: 8, padding: "10px 12px" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 4 }}>A/B test návrh</div>
        <div style={{ fontSize: 13, color: "var(--color-text-primary)", lineHeight: 1.5 }}>"{result.ab_test}"</div>
      </div>
    </div>
  );
}

function DetailDrawer({ ad, allAds, onClose }) {
  const sc = STATUS_CFG[ad.status] || STATUS_CFG.PAUSED;
  const visibleMetrics = METRICS.filter(m => !["spend", "impressions", "reach", "clicks"].includes(m.key));

  return (
    <div style={{ borderTop: "0.5px solid var(--color-border-tertiary)", marginTop: 8, paddingTop: 16, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        <span style={{ fontSize: 11, background: sc.bg, color: sc.text, padding: "2px 9px", borderRadius: 20, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: sc.dot }} />{ad.status}
        </span>
        <span style={{ fontSize: 11, background: "var(--color-background-secondary)", color: "var(--color-text-secondary)", padding: "2px 9px", borderRadius: 20 }}>{ad.format}</span>
        <span style={{ fontSize: 11, background: "var(--color-background-secondary)", color: "var(--color-text-secondary)", padding: "2px 9px", borderRadius: 20 }}>{ad.placement}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>Kampaň</div>
        <div style={{ fontSize: 13 }}>{ad.campaign}</div>
        <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 4 }}>Ad set</div>
        <div style={{ fontSize: 13 }}>{ad.adset}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
        {["spend","impressions","reach","clicks"].map(k => (
          <MetricPill key={k} label={METRICS.find(m=>m.key===k).label} value={fmt(k, ad[k])} good={isGood(k,ad[k],allAds)} bad={isBad(k,ad[k],allAds)} />
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
        {visibleMetrics.map(m => (
          <MetricPill key={m.key} label={m.label} value={m.fmt(ad[m.key])} good={isGood(m.key,ad[m.key],allAds)} bad={isBad(m.key,ad[m.key],allAds)} />
        ))}
      </div>

      <div style={{ borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: 14 }}>
        <AIAnalysis ad={ad} allAds={allAds} />
      </div>
    </div>
  );
}

export default function App() {
  const [ads, setAds] = useState(DEMO_ADS);
  const [loading, setLoading] = useState(false);
  const [liveError, setLiveError] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Vše");
  const [filterCampaign, setFilterCampaign] = useState("Vše kampaně");
  const [sortKey, setSortKey] = useState("spend");
  const [sortDir, setSortDir] = useState("desc");
  const [visibleCols, setVisibleCols] = useState(["spend","ctr","roas","cpr","results"]);
  const [showColPicker, setShowColPicker] = useState(false);

  const campaigns = ["Vše kampaně", ...Array.from(new Set(ads.map(a => a.campaign)))];

  const filtered = ads.filter(a => {
    if (filterStatus !== "Vše" && a.status !== filterStatus) return false;
    if (filterCampaign !== "Vše kampaně" && a.campaign !== filterCampaign) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!a.name.toLowerCase().includes(q) && !a.campaign.toLowerCase().includes(q) && !a.adset.toLowerCase().includes(q)) return false;
    }
    return true;
  }).sort((a, b) => {
    const v = sortDir === "asc" ? 1 : -1;
    return ((a[sortKey] || 0) - (b[sortKey] || 0)) * v;
  });

  const totalSpend = ads.reduce((s, a) => s + a.spend, 0);
  const avgRoas = ads.reduce((s, a) => s + a.roas, 0) / ads.length;
  const avgCtr = ads.reduce((s, a) => s + a.ctr, 0) / ads.length;
  const totalResults = ads.reduce((s, a) => s + a.results, 0);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const loadLive = async () => {
    setLoading(true);
    setLiveError(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: `Načti všechny aktivní a pozastavené reklamy z Meta ad účtu ID ${ACCOUNT_ID}. Pro každou reklamu vrať: id, name, status, campaign name, adset name, spend, impressions, reach, clicks, ctr, cpc, cpm, roas, cpr (cost per result), cvr, cost_per_lead, results count, ad format, placement. Vrať pouze JSON pole bez komentářů. Pokud nemáš přístup, vrať {"error":"no_access"}.` }],
          mcp_servers: [{ type: "url", url: "https://mcp.facebook.com/ads", name: "meta" }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      if (text.includes("no_access") || text.includes("not enabled")) throw new Error("not_enabled");
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      if (Array.isArray(parsed) && parsed.length > 0) { setAds(parsed); setIsLive(true); }
      else throw new Error("empty");
    } catch {
      setLiveError("Meta API pro FairShare ještě není aktivní. Zobrazuji demo data.");
    } finally {
      setLoading(false);
    }
  };

  const SortIcon = ({ k }) => sortKey === k
    ? <i className={`ti ti-arrow-${sortDir === "desc" ? "down" : "up"}`} style={{ fontSize: 11, marginLeft: 3 }} />
    : <i className="ti ti-arrows-sort" style={{ fontSize: 11, marginLeft: 3, opacity: 0.3 }} />;

  const colMeta = METRICS.filter(m => visibleCols.includes(m.key));

  return (
    <div style={{ fontFamily: "var(--font-sans)", color: "var(--color-text-primary)" }}>
      <h2 className="sr-only">FairShare Meta Ads – vyhodnocení kreativ</h2>

      <div style={{ padding: "18px 18px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 2, display: "flex", alignItems: "center", gap: 6 }}>
              <i className="ti ti-brand-meta" style={{ fontSize: 13 }} aria-hidden="true" />
              FairShare – Zacíleno · {ACCOUNT_ID}
              <span style={{
                fontSize: 10, padding: "1px 7px", borderRadius: 10, fontWeight: 500,
                background: isLive ? "#EAF3DE" : "#FAEEDA",
                color: isLive ? "#27500A" : "#633806"
              }}>
                {isLive ? "Live" : "Demo"}
              </span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 500 }}>Vyhodnocení kreativ</div>
          </div>
          <button onClick={loadLive} disabled={loading} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", cursor: loading ? "wait" : "pointer", fontSize: 13 }}>
            <i className="ti ti-refresh" style={{ fontSize: 14 }} aria-hidden="true" />
            {loading ? "Načítám..." : "Načíst z Meta ↗"}
          </button>
        </div>

        {liveError && (
          <div style={{ background: "#FAEEDA", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#633806", marginBottom: 12, display: "flex", gap: 8, alignItems: "center" }}>
            <i className="ti ti-info-circle" style={{ fontSize: 14, flexShrink: 0 }} aria-hidden="true" />
            {liveError}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 14 }}>
          {[
            { label: "Celkový spend", value: totalSpend.toLocaleString("cs") + " Kč", sub: ads.length + " kreativ" },
            { label: "Průměrný ROAS", value: avgRoas.toFixed(1) + "×" },
            { label: "Průměrný CTR", value: avgCtr.toFixed(2) + " %" },
            { label: "Celkem výsledků", value: totalResults.toLocaleString("cs") },
          ].map(c => (
            <div key={c.label} style={{ background: "var(--color-background-secondary)", borderRadius: 8, padding: "10px 14px" }}>
              <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 2 }}>{c.label}</div>
              <div style={{ fontSize: 20, fontWeight: 500 }}>{c.value}</div>
              {c.sub && <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{c.sub}</div>}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12, alignItems: "center" }}>
          <input placeholder="Hledat název, kampaň, ad set..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 200, fontSize: 13 }} />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ fontSize: 13 }}>
            <option>Vše</option><option>ACTIVE</option><option>PAUSED</option>
          </select>
          <select value={filterCampaign} onChange={e => setFilterCampaign(e.target.value)} style={{ fontSize: 13, maxWidth: 200 }}>
            {campaigns.map(c => <option key={c}>{c}</option>)}
          </select>
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowColPicker(v => !v)} style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 5 }}>
              <i className="ti ti-columns" style={{ fontSize: 14 }} aria-hidden="true" /> Metriky
            </button>
            {showColPicker && (
              <div style={{
                position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 50,
                background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-secondary)",
                borderRadius: 10, padding: 12, minWidth: 220, display: "flex", flexDirection: "column", gap: 6
              }}>
                <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 4 }}>Viditelné sloupce</div>
                {METRICS.map(m => (
                  <label key={m.key} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
                    <input type="checkbox" checked={visibleCols.includes(m.key)}
                      onChange={e => setVisibleCols(v => e.target.checked ? [...v, m.key] : v.filter(k => k !== m.key))} />
                    <span style={{ fontWeight: 500 }}>{m.label}</span>
                    <span style={{ color: "var(--color-text-secondary)", fontSize: 11 }}>{m.desc}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 10 }}>
          {filtered.length} z {ads.length} kreativ
          {filtered.length < ads.length && <span> · zelená/červená = nad/pod průměrem účtu</span>}
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "auto", minWidth: 600 }}>
          <thead>
            <tr style={{ borderBottom: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)" }}>
              <th style={{ textAlign: "left", padding: "8px 18px", fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", whiteSpace: "nowrap", width: "30%" }}>Kreativa</th>
              <th style={{ textAlign: "left", padding: "8px 8px", fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", whiteSpace: "nowrap" }}>Status</th>
              {colMeta.map(m => (
                <th key={m.key} onClick={() => toggleSort(m.key)}
                  style={{ textAlign: "right", padding: "8px 10px", fontSize: 11, fontWeight: 500, color: sortKey === m.key ? "var(--color-text-primary)" : "var(--color-text-secondary)", whiteSpace: "nowrap", cursor: "pointer" }}>
                  {m.label}<SortIcon k={m.key} />
                </th>
              ))}
              <th style={{ width: 36 }} />
            </tr>
          </thead>
          <tbody>
            {filtered.map(ad => {
              const isOpen = expanded === ad.id;
              const sc = STATUS_CFG[ad.status] || STATUS_CFG.PAUSED;
              return (
                <tr key={ad.id} style={{ borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                  <td colSpan={colMeta.length + 3} style={{ padding: 0 }}>
                    <div style={{ padding: "0 18px" }}>
                      <div
                        onClick={() => setExpanded(isOpen ? null : ad.id)}
                        style={{ display: "grid", gridTemplateColumns: `minmax(0,2fr) 90px ${colMeta.map(() => "minmax(70px,1fr)").join(" ")} 36px`, alignItems: "center", cursor: "pointer", padding: "10px 0", gap: 0 }}
                      >
                        <div style={{ paddingRight: 12, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ad.name}</div>
                          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ad.adset}</div>
                        </div>
                        <div>
                          <span style={{ fontSize: 11, background: sc.bg, color: sc.text, padding: "2px 8px", borderRadius: 20, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 4 }}>
                            <span style={{ width: 5, height: 5, borderRadius: "50%", background: sc.dot }} />{ad.status}
                          </span>
                        </div>
                        {colMeta.map(m => {
                          const good = isGood(m.key, ad[m.key], ads);
                          const bad = isBad(m.key, ad[m.key], ads);
                          return (
                            <div key={m.key} style={{ textAlign: "right", padding: "0 10px", fontSize: 13, color: good ? "#27500A" : bad ? "#A32D2D" : "var(--color-text-primary)", fontWeight: good || bad ? 500 : 400 }}>
                              {m.fmt(ad[m.key])}
                            </div>
                          );
                        })}
                        <div style={{ textAlign: "right" }}>
                          <i className={`ti ti-chevron-${isOpen ? "up" : "down"}`} style={{ fontSize: 14, color: "var(--color-text-secondary)" }} aria-hidden="true" />
                        </div>
                      </div>
                      {isOpen && <DetailDrawer ad={ad} allAds={ads} onClose={() => setExpanded(null)} />}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={colMeta.length + 3} style={{ padding: "32px 18px", textAlign: "center", fontSize: 13, color: "var(--color-text-secondary)" }}>
                  Žádné kreativy neodpovídají filtru.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
