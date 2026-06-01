// tweaks.jsx — Refract landing page tweak controls (3-color system)
const { useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "lightness": "Airy",
  "violet": "#5316D4",
  "font": "Inter",
  "headline": "gets out of your way"
}/*EDITMODE-END*/;

// lightness → [paper lilac, band lilac]
const LILAC = {
  "Airy":  ["#ece4f7", "#e1d6f1"],
  "Soft":  ["#e3d6f4", "#d6c6ee"],
  "Lilac": ["#d9c8f0", "#cbb6e9"],
};

// the single violet hue (no extra shades — tints are derived by opacity)
const VIOLETS = ["#5316D4", "#6d28d9", "#7c1fc7", "#4a23c9"];

const FONTS = {
  "Inter":   "'Inter', ui-sans-serif, system-ui, sans-serif",
  "Grotesk": "'Space Grotesk', ui-sans-serif, system-ui, sans-serif",
  "Manrope": "'Manrope', ui-sans-serif, system-ui, sans-serif",
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
  r.setProperty("--font-sans", FONTS[t.font] || FONTS["Inter"]);
  const hl = document.getElementById("heroHl");
  if (hl) hl.textContent = t.headline || "gets out of your way";

  // Lightness + violet are light-theme knobs. In dark mode the CSS
  // [data-theme="dark"] block owns the palette, so clear inline overrides.
  if (dark) {
    ["--lilac","--bg","--band","--band-2","--violet","--p","--p-bright","--p-tint","--p-tint-2"]
      .forEach((k) => r.removeProperty(k));
    return;
  }

  const L = LILAC[t.lightness] || LILAC["Airy"];
  r.setProperty("--lilac", L[0]);
  r.setProperty("--bg", L[0]);
  r.setProperty("--band", L[1]);
  r.setProperty("--band-2", L[1]);

  const v = t.violet || "#5316D4";
  const rgb = hexToRgb(v);
  r.setProperty("--violet", v);
  r.setProperty("--p", v);
  r.setProperty("--p-bright", v);
  r.setProperty("--p-tint", rgba(rgb, .09));
  r.setProperty("--p-tint-2", rgba(rgb, .18));
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
        label="Lightness"
        value={t.lightness}
        options={["Airy", "Soft", "Lilac"]}
        onChange={(v) => setTweak("lightness", v)}
      />
      <TweakColor
        label="Violet"
        value={t.violet}
        options={VIOLETS}
        onChange={(v) => setTweak("violet", v)}
      />

      <TweakSection label="Typography" />
      <TweakRadio
        label="Font"
        value={t.font}
        options={["Inter", "Grotesk", "Manrope"]}
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
