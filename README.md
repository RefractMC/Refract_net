# Refract — Landing Page

The marketing/landing site for **Refract**, a fast, modern Minecraft launcher.
Static HTML — no build step, no server. Drop it on GitHub Pages and you're live.

🟣 Light **and** dark themes · 🐧 Windows / macOS / Linux downloads · ⚙️ live "latest release" links

---

## What's in this folder

```
index.html          ← the whole page (HTML + CSS + JS)
tweaks-panel.jsx     ← in-page Tweaks panel framework
tweaks.jsx           ← the Tweaks controls (theme, accent, font, headline)
logo/
  refract-iris-64.png   ← favicon
  screenshot.png        ← hero screenshot (Browse Mods)
  content-browser.png   ← spotlight screenshot (Content Browser)
```

Keep this exact structure — the page loads the assets with relative paths.

---

## Deploy to GitHub Pages

### Option A — dedicated site repo (cleanest URL)
1. Create a repo named **`refractmc.github.io`**.
2. Upload **everything in this folder** to the repo root.
3. Done. Your site is live at **https://refractmc.github.io/**
   (Pages turns on automatically for this repo name.)

### Option B — inside the existing repo
1. Copy this folder into your repo as **`docs/`**.
2. Go to **Settings → Pages**.
3. Set **Source: Deploy from a branch**, **Branch: `main`**, **Folder: `/docs`**, then **Save**.
4. Live at **https://refractmc.github.io/Refract_MC/** in a minute or two.

> Tip: drag-and-drop works — on GitHub click **Add file → Upload files**, drop the
> contents in, and commit. No git knowledge required.

---

## How it works

- **Downloads stay current automatically.** On load, the page asks the GitHub
  API for your *latest* release and points every button straight at the real
  asset (`.exe`, `.dmg`, `.AppImage`, `.deb`) — so you never edit links when you
  ship a new version. If the API is unreachable, it falls back to
  `releases/latest/download/…`.
- **OS detection.** The visitor's platform card is highlighted ("Your OS") and
  moved to the front.
- **Theme toggle** (🌙 / ☀️ in the nav) is remembered between visits.
- **Tweaks panel** lets you experiment with accent color, lightness, font and the
  headline live in the browser.

Everything runs client-side. React + Babel load from a CDN, so the only
requirement is that visitors have an internet connection (they do — they're
downloading a launcher).

---

## Editing

- **Text & layout:** edit `index.html`.
- **Theme / accent / fonts:** the defaults live near the top of `index.html`
  (the `:root` and `html[data-theme="dark"]` CSS blocks) and in `tweaks.jsx`.
- **Screenshots:** replace the files in `logo/` with the same names.
- **Repo links** point to `github.com/RefractMC/Refract_MC` — update if your repo
  moves.

---

## Custom domain (optional)

In **Settings → Pages → Custom domain**, add e.g. `refract.gg`, then create a
`CNAME` record at your DNS provider pointing to `refractmc.github.io`. GitHub
issues an HTTPS certificate for you.

---

Refract is free & open source (code: GPL-3.0-only).
Not affiliated with Mojang or Microsoft.
