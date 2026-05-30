// tweaks.jsx — Refract landing page tweak controls
const { useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "mode": "light",
  "lightness": "Airy",
  "accent": ["#5316D4", "#6b2cf0", "#8a52ff"],
  "font": "Inter",
  "headline": "gets out of your way"
}/*EDITMODE-END*/;

// lightness presets (light theme only) → [bg, band, band-2, border, border-2]
const LIGHTNESS = {
  "Airy":  ["#faf8ff", "#efe9fc", "#e7defb", "#e7ddf6", "#d9caf0"],
  "Soft":  ["#f3ecff", "#e7daff", "#ddccff", "#ddccfa", "#cdb6f3"],
  "Lilac": ["#ece1ff", "#ddccff", "#d0bbff", "#d2bdf5", "#c0a4ee"],
};

// accent palettes → [p, p-hover, p-bright]  (tints derive in CSS per theme)
const ACCENTS = [
  ["#5316D4", "#6b2cf0", "#8a52ff"], // violet (brand)
  ["#6d28d9", "#8b3ff0", "#a571ff"], // iris
  ["#6232e0", "#7b4cf0", "#9a6cff"], // royal
  ["#7c1fc7", "#9333d6", "#b35cf0"], // magenta-violet
];

const FONTS = {
  "Inter":   "'Inter', ui-sans-serif, system-ui, sans-serif",
  "Grotesk": "'Space Grotesk', ui-sans-serif, system-ui, sans-serif",
  "Manrope": "'Manrope', ui-sans-serif, system-ui, sans-serif",
};

function applyVisual(t) {
  const r = document.documentElement.style;
  const dark = (window.getTheme && window.getTheme() === "dark");

  // accent hue — applies in both themes; tints recompute via CSS color-mix
  const A = Array.isArray(t.accent) ? t.accent : ACCENTS[0];
  r.setProperty("--p", A[0]);
  r.setProperty("--p-hover", A[1]);
  r.setProperty("--p-bright", A[2]);

  // lightness only meaningful in light theme; in dark, let the dark
  // stylesheet win by clearing any inline surface overrides
  const surfaceVars = ["--bg", "--band", "--band-2", "--border", "--border-2"];
  if (dark) {
    surfaceVars.forEach((k) => r.removeProperty(k));
  } else {
    const L = LIGHTNESS[t.lightness] || LIGHTNESS["Airy"];
    surfaceVars.forEach((k, i) => r.setProperty(k, L[i]));
  }

  r.setProperty("--font-sans", FONTS[t.font] || FONTS["Inter"]);

  const hl = document.getElementById("heroHl");
  if (hl) hl.textContent = t.headline || "gets out of your way";
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // keep the Mode control in sync with the current DOM theme on mount,
  // and whenever the nav toggle fires
  useEffect(() => {
    const cur = window.getTheme ? window.getTheme() : "light";
    if (t.mode !== cur) setTweak("mode", cur);
    const onTheme = (e) => setTweak("mode", e.detail.mode);
    document.addEventListener("refract-theme", onTheme);
    return () => document.removeEventListener("refract-theme", onTheme);
  }, []);

  // drive the actual theme when the Mode control changes
  useEffect(() => {
    if (window.applyTheme && window.getTheme && t.mode !== window.getTheme()) {
      window.applyTheme(t.mode);
    }
    applyVisual(t);
  }, [t]);

  return (
    <TweaksPanel>
      <TweakSection label="Appearance" />
      <TweakRadio
        label="Mode"
        value={t.mode}
        options={["light", "dark"]}
        onChange={(v) => setTweak("mode", v)}
      />
      <TweakRadio
        label="Lightness"
        value={t.lightness}
        options={["Airy", "Soft", "Lilac"]}
        onChange={(v) => setTweak("lightness", v)}
      />
      <TweakColor
        label="Accent"
        value={t.accent}
        options={ACCENTS}
        onChange={(v) => setTweak("accent", v)}
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
