// tweaks-hub.jsx — Refract Hub landing tweak controls
const { useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#9a6cff",
  "speed": "Normal",
  "headline": "modding"
}/*EDITMODE-END*/;

const ACCENTS = ["#9a6cff", "#7c4dff", "#6ce0ff", "#5be08a", "#ff7ab0"];
const SPEED = { "Calm": 1.7, "Normal": 1, "Fast": 0.55 };

function hexToRgb(h){
  const n = h.replace('#','');
  return [parseInt(n.slice(0,2),16), parseInt(n.slice(2,4),16), parseInt(n.slice(4,6),16)];
}
function lighten(rgb, amt){
  return rgb.map(c => Math.round(c + (255 - c) * amt));
}
function rgbStr(rgb){ return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`; }
function rgba(rgb, a){ return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`; }

function applyTweaks(t){
  const r = document.documentElement.style;
  const rgb = hexToRgb(t.accent || "#9a6cff");
  r.setProperty("--p", t.accent);
  r.setProperty("--p-2", rgbStr(lighten(rgb, .28)));
  r.setProperty("--p-deep", t.accent);
  r.setProperty("--p-tint", rgba(rgb, .14));
  r.setProperty("--p-tint-2", rgba(rgb, .24));
  r.setProperty("--maze", rgbStr(lighten(rgb, .45)));
  r.setProperty("--mq-dur", String(SPEED[t.speed] != null ? SPEED[t.speed] : 1));
  const hl = document.getElementById("heroAccent");
  if (hl) hl.textContent = t.headline || "modding";
}

function App(){
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  useEffect(() => { applyTweaks(t); }, [t]);
  return (
    <TweaksPanel>
      <TweakSection label="Brand" />
      <TweakColor label="Accent" value={t.accent} options={ACCENTS} onChange={(v)=>setTweak("accent", v)} />

      <TweakSection label="Hero" />
      <TweakText label="Headline accent" value={t.headline} onChange={(v)=>setTweak("headline", v)} />
      <TweakRadio label="Marquee speed" value={t.speed} options={["Calm","Normal","Fast"]} onChange={(v)=>setTweak("speed", v)} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById("tweaks-root")).render(<App />);
