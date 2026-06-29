// tweaks.jsx — Refract landing page tweak controls (green/cream system)
const { useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "warmth": "Cream",
  "accent": "#00754A",
  "font": "Manrope",
  "headline": "Mod Launcher"
}/*EDITMODE-END*/;

// warmth → [page canvas, ceramic band]
const CREAMS = {
  "Cream": ["#f2f0eb", "#edebe9"],
  "Linen": ["#efece5", "#e6e2d9"],
  "Sand":  ["#ece7dd", "#e1dccf"],
};

// four-tier green family — tints derived by opacity off whichever is picked
const GREENS = ["#00754A", "#006241", "#1E8A5B", "#2b7a52"];

const FONTS = {
  "Manrope": "'Manrope', ui-sans-serif, system-ui, sans-serif",
  "Inter":   "'Inter', ui-sans-serif, system-ui, sans-serif",
};

function hexToRgb(h){
  const n = h.replace('#','');
  return [parseInt(n.slice(0,2),16), parseInt(n.slice(2,4),16), parseInt(n.slice(4,6),16)];
}
function rgba(rgb, a){ return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`; }

function applyTweaks(t) {
  const r = document.documentElement.style;
  const dark = (typeof window.getRefractTheme === "function") && window.getRefractTheme() === "dark";

  // font + headline apply in both themes
  r.setProperty("--font-sans", FONTS[t.font] || FONTS["Manrope"]);
  const hl = document.querySelector(".hero h1 .hl");
  if (hl) hl.textContent = t.headline || "Mod Launcher";

  // Warmth + accent are light-theme knobs. In dark mode the CSS
  // [data-theme="dark"] block owns the palette, so clear inline overrides.
  if (dark) {
    ["--cream","--bg","--band","--band-2","--green","--p","--p-bright","--p-tint","--p-tint-2"]
      .forEach((k) => r.removeProperty(k));
    return;
  }

  const C = CREAMS[t.warmth] || CREAMS["Cream"];
  r.setProperty("--cream", C[0]);
  r.setProperty("--bg", C[0]);
  r.setProperty("--band", C[1]);
  r.setProperty("--band-2", C[1]);

  const v = t.accent || "#00754A";
  const rgb = hexToRgb(v);
  r.setProperty("--green", v);
  r.setProperty("--p", v);
  r.setProperty("--p-bright", v);
  r.setProperty("--p-tint", rgba(rgb, .08));
  r.setProperty("--p-tint-2", rgba(rgb, .17));
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [theme, setThemeState] = React.useState(
    (typeof window.getRefractTheme === "function" && window.getRefractTheme() === "dark") ? "Dark" : "Light"
  );

  // re-apply palette knobs whenever a tweak OR the theme changes
  useEffect(() => { applyTweaks(t); }, [t, theme]);

  // stay in sync with the nav toggle (single source of truth)
  useEffect(() => {
    const onChange = (e) => setThemeState(e.detail === "dark" ? "Dark" : "Light");
    window.addEventListener("refractthemechange", onChange);
    return () => window.removeEventListener("refractthemechange", onChange);
  }, []);

  const setTheme = (v) => {
    if (window.setRefractTheme) window.setRefractTheme(v === "Dark" ? "dark" : "light");
    setThemeState(v);
  };

  return (
    <TweaksPanel>
      <TweakSection label="Theme" />
      <TweakRadio
        label="Mode"
        value={theme}
        options={["Light", "Dark"]}
        onChange={(v) => setTheme(v)}
      />
      <TweakRadio
        label="Warmth"
        value={t.warmth}
        options={["Cream", "Linen", "Sand"]}
        onChange={(v) => setTweak("warmth", v)}
      />
      <TweakColor
        label="Accent green"
        value={t.accent}
        options={GREENS}
        onChange={(v) => setTweak("accent", v)}
      />

      <TweakSection label="Typography" />
      <TweakRadio
        label="Font"
        value={t.font}
        options={["Manrope", "Inter"]}
        onChange={(v) => setTweak("font", v)}
      />

      <TweakSection label="Copy" />
      <TweakText
        label="Headline accent"
        value={t.headline}
        onChange={(v) => setTweak("headline", v)}
      />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById("tweaks-root")).render(<App />);
