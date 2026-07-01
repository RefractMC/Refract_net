// tweaks-indigo.jsx — Refract landing page tweak controls (indigo/SaaS system)
const { useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#5754e0",
  "radius": 10,
  "headline": "Mod Launcher"
}/*EDITMODE-END*/;

// one restrained cool family — same lightness/chroma, hue varies
const ACCENTS = ["#5754e0", "#3d6fe0", "#7b53d6"];

function hexToRgb(h){
  const n = h.replace('#','');
  return [parseInt(n.slice(0,2),16), parseInt(n.slice(2,4),16), parseInt(n.slice(4,6),16)];
}
function rgba(rgb, a){ return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`; }

function applyTweaks(t) {
  const r = document.documentElement.style;
  const dark = (typeof window.getRefractTheme === "function") && window.getRefractTheme() === "dark";

  const hl = document.querySelector(".hero h1 .hl");
  if (hl) hl.textContent = t.headline || "Mod Launcher";
  r.setProperty("--radius", (t.radius != null ? t.radius : 10) + "px");

  // accent is a light-theme knob; dark mode owns its own brighter shade
  if (dark) {
    ["--green","--p","--p-bright","--p-tint","--p-tint-2"].forEach((k) => r.removeProperty(k));
    return;
  }

  const v = t.accent || "#5754e0";
  const rgb = hexToRgb(v);
  r.setProperty("--green", v);
  r.setProperty("--p", v);
  r.setProperty("--p-bright", v);
  r.setProperty("--p-tint", rgba(rgb, .08));
  r.setProperty("--p-tint-2", rgba(rgb, .16));
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [theme, setThemeState] = React.useState(
    (typeof window.getRefractTheme === "function" && window.getRefractTheme() === "dark") ? "Dark" : "Light"
  );

  useEffect(() => { applyTweaks(t); }, [t, theme]);

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
      <TweakColor
        label="Accent"
        value={t.accent}
        options={ACCENTS}
        onChange={(v) => setTweak("accent", v)}
      />

      <TweakSection label="Shape" />
      <TweakSlider
        label="Corner radius"
        value={t.radius}
        min={2}
        max={20}
        unit="px"
        onChange={(v) => setTweak("radius", v)}
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
