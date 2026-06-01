<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Refract — A fast, modern Minecraft launcher</title>
<meta name="viewport" content="width=device-width,initial-scale=1" />
<link rel="icon" href="logo/refract-iris-64.png" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=VT323&display=swap" rel="stylesheet" />
<style>
  :root{
    /* ─── THREE COLORS ───────────────────────────────
       1 · lilac paper   2 · violet   3 · deep ink.
       White is a neutral surface; every other value is
       one of these three at reduced opacity — no new
       hues, no gradients. */
    --lilac:  #ece4f7;
    --violet: #5316D4;
    --ink:    #1d0b40;

    /* surfaces */
    --bg:     var(--lilac);
    --band:   #e1d6f1;
    --band-2: #e1d6f1;
    --card:   #ffffff;

    /* violet, kept tweakable as one knob */
    --p:        var(--violet);
    --p-hover:  var(--ink);    /* darken-on-press = ink, not a new purple */
    --p-bright: var(--violet);
    --p-deep:   var(--ink);    /* emphasis text = ink */
    --p-tint:   rgba(83,22,212,.09);
    --p-tint-2: rgba(83,22,212,.18);

    /* always-dark blocks (screenshot chrome, open-source band) */
    --panel: #1d0b40;
    --logo-op: .07;

    /* text + lines = ink at opacity */
    --ink-2: rgba(29,11,64,.66);
    --ink-3: rgba(29,11,64,.46);
    --ink-4: rgba(29,11,64,.36);
    --border:   rgba(29,11,64,.11);
    --border-2: rgba(29,11,64,.20);

    --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
    --mono: 'JetBrains Mono', ui-monospace, monospace;

    --radius: 14px;
    --shadow-sm: 0 1px 2px rgba(29,11,64,.05);
    --shadow:    0 10px 24px -14px rgba(29,11,64,.20);
    --shadow-lg: 0 30px 60px -34px rgba(29,11,64,.30);
    --maxw: 1160px;
  }

  /* ─── DARK THEME (flat, no gradients) ───────────────
     Same three hues, flipped: ink becomes the page,
     lilac/white becomes the text, violet brightens so
     it carries on a dark ground. */
  html[data-theme="dark"]{
    --bg:     #120726 !important;
    --band:   #190d33 !important;
    --band-2: #190d33 !important;
    --card:   #1d1140 !important;

    --ink:   #efe9fb !important;
    --ink-2: rgba(239,233,251,.70) !important;
    --ink-3: rgba(239,233,251,.50) !important;
    --ink-4: rgba(239,233,251,.40) !important;
    --border:   rgba(239,233,251,.13) !important;
    --border-2: rgba(239,233,251,.24) !important;

    --p:        #9a6cff !important;
    --p-hover:  #b48aff !important;
    --p-bright: #9a6cff !important;
    --p-deep:   #efe9fb !important;
    --p-tint:   rgba(154,108,255,.15) !important;
    --p-tint-2: rgba(154,108,255,.26) !important;

    --panel: #0c0420 !important;
    --logo-op: .13 !important;

    --shadow-sm: 0 1px 2px rgba(0,0,0,.4) !important;
    --shadow:    0 12px 28px -16px rgba(0,0,0,.6) !important;
    --shadow-lg: 0 36px 70px -34px rgba(0,0,0,.7) !important;
  }

  /* ─── fixed background layers ─────────────────────
     base color + watermark logo, both pinned so the
     page scrolls over them. */
  .bg-base{
    position:fixed; inset:0; z-index:0; background:var(--bg);
  }
  .bg-logo{
    position:fixed; inset:0; z-index:0;
    display:grid; place-items:center; pointer-events:none;
  }
  header.nav, main, footer.foot{ position:relative; z-index:1; }
  .bg-logo svg{
    width:min(86vw,820px); height:min(86vw,820px);
    opacity:var(--logo-op);
  }

  *{box-sizing:border-box;}
  html{scroll-behavior:auto;background:var(--bg);}
  html,body{margin:0;padding:0;}
  body{
    font-family:var(--font-sans);
    background:transparent;
    color:var(--ink);
    -webkit-font-smoothing:antialiased;
    text-rendering:optimizeLegibility;
    line-height:1.5;
  }
  a{color:inherit;text-decoration:none;}
  img{max-width:100%;display:block;}
  .wrap{max-width:var(--maxw);margin:0 auto;padding:0 28px;}

  /* ── kicker / mono labels ───────────────────────── */
  .kicker{
    font-family:var(--mono);font-size:12px;font-weight:500;
    letter-spacing:.18em;text-transform:uppercase;color:var(--p);
    display:inline-flex;align-items:center;gap:9px;
  }
  .kicker::before{content:"";width:20px;height:1.5px;background:var(--p);opacity:.5;}

  /* ── buttons ────────────────────────────────────── */
  .btn{
    display:inline-flex;align-items:center;gap:9px;
    font-family:var(--font-sans);font-weight:600;font-size:15px;
    padding:12px 20px;border-radius:11px;border:1px solid transparent;
    cursor:pointer;transition:transform .12s ease;
    white-space:nowrap;
  }
  .btn svg{width:17px;height:17px;}
  .btn-primary{background:var(--p);color:#fff;}
  .btn-primary:hover{background:var(--ink);}
  .btn-ghost{background:var(--card);color:var(--ink);border-color:var(--border-2);}
  .btn-ghost:hover{border-color:var(--p);color:var(--p);}
  .btn-soft{background:var(--p-tint);color:var(--p);}
  .btn-soft:hover{background:var(--p-tint-2);}

  /* ── top nav ────────────────────────────────────── */
  header.nav{
    position:sticky;top:0;z-index:50;
    background:color-mix(in srgb, var(--bg) 88%, transparent);
    backdrop-filter:blur(10px);
    border-bottom:1px solid var(--border);
  }
  .nav-in{display:flex;align-items:center;justify-content:space-between;height:66px;}
  .brand{display:flex;align-items:center;gap:11px;}
  .brand .mark{width:30px;height:30px;flex:none;}
  .brand .name{font-weight:800;font-size:18px;letter-spacing:-.01em;color:var(--ink);}
  .nav-links{display:flex;align-items:center;gap:30px;}
  .nav-links a{font-size:14.5px;font-weight:500;color:var(--ink-2);}
  .nav-links a:hover{color:var(--p);}
  .nav-cta{display:flex;align-items:center;gap:12px;}
  .icon-btn{
    width:42px;height:42px;flex:none;display:grid;place-items:center;border-radius:11px;
    background:var(--card);border:1px solid var(--border-2);color:var(--ink);cursor:pointer;
  }
  .icon-btn:hover{border-color:var(--p);color:var(--p);}
  .icon-btn svg{width:18px;height:18px;}
  html[data-theme="dark"] .icon-btn .i-moon{display:none;}
  html:not([data-theme="dark"]) .icon-btn .i-sun{display:none;}
  @media (max-width:860px){ .nav-links{display:none;} }

  /* ── hero ───────────────────────────────────────── */
  .hero{position:relative;}
  .hero-in{position:relative;padding:64px 0 0;text-align:center;}
  .ver-badge{
    display:inline-flex;align-items:center;gap:10px;
    font-family:var(--mono);font-size:12px;color:var(--ink-2);
    background:var(--card);border:1px solid var(--border-2);border-radius:999px;
    padding:6px 14px 6px 7px;box-shadow:var(--shadow-sm);margin-bottom:26px;
  }
  .ver-badge .dot{position:relative;width:7px;height:7px;border-radius:50%;background:var(--violet);}
  .ver-badge .dot::after{
    content:"";position:absolute;inset:0;border-radius:50%;
    background:var(--violet);
    animation:dotPing 2s ease-out infinite;
  }
  @keyframes dotPing{
    0%   {transform:scale(1);   opacity:.55;}
    70%  {transform:scale(3.2); opacity:0;}
    100% {transform:scale(3.2); opacity:0;}
  }
  @media (prefers-reduced-motion:reduce){
    .ver-badge .dot::after{animation:none;}
  }
  .ver-badge b{color:var(--p);font-weight:600;}
  .ver-badge .sep{width:1px;height:13px;background:var(--border-2);}

  .hero h1{
    margin:0 auto;max-width:14ch;
    font-size:clamp(40px,6.4vw,72px);font-weight:800;line-height:1.02;
    letter-spacing:-.03em;color:var(--ink);text-wrap:balance;
  }
  .hero h1 .hl{color:var(--p);position:relative;white-space:nowrap;}
  .hero p.sub{
    margin:22px auto 0;max-width:52ch;
    font-size:clamp(16px,1.7vw,19px);color:var(--ink-2);line-height:1.6;text-wrap:pretty;
  }
  .hero-cta{display:flex;align-items:center;justify-content:center;gap:13px;margin-top:32px;flex-wrap:wrap;}
  .hero-note{margin-top:15px;font-family:var(--mono);font-size:12px;color:var(--ink-3);letter-spacing:.02em;}

  /* loader chips */
  .loaders{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;margin-top:30px;}
  .loaders .lbl{font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-4);}
  .chip{
    font-family:var(--mono);font-size:12.5px;color:var(--ink-2);
    background:var(--card);border:1px solid var(--border);border-radius:8px;padding:5px 11px;
  }

  /* screenshot window */
  .shot-wrap{position:relative;margin:56px auto 0;max-width:1000px;}
  .window{
    border-radius:16px;overflow:hidden;background:var(--panel);
    border:1px solid var(--border-2);box-shadow:var(--shadow-lg);
  }
  .win-bar{display:flex;align-items:center;gap:8px;padding:11px 16px;background:var(--panel);border-bottom:1px solid rgba(255,255,255,.08);}
  .win-bar .dots{display:flex;gap:7px;}
  .win-bar .dots i{width:11px;height:11px;border-radius:50%;display:block;background:rgba(255,255,255,.22);}
  .win-bar .title{margin-left:8px;display:flex;align-items:center;gap:8px;font-family:var(--mono);font-size:12px;color:rgba(255,255,255,.62);letter-spacing:.04em;}
  .win-bar .title svg{width:15px;height:15px;}
  .window img{width:100%;display:block;}

  /* ── stats strip ────────────────────────────────── */
  .stats{border-top:1px solid var(--border);border-bottom:1px solid var(--border);margin-top:90px;background:var(--card);}
  .stats-in{display:grid;grid-template-columns:repeat(4,1fr);}
  .stat{padding:30px 24px;text-align:center;border-right:1px solid var(--border);}
  .stat:last-child{border-right:0;}
  .stat .num{font-size:30px;font-weight:800;letter-spacing:-.02em;color:var(--p);font-feature-settings:"tnum";}
  .stat .cap{margin-top:5px;font-family:var(--mono);font-size:11.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-3);}
  @media (max-width:760px){ .stats-in{grid-template-columns:repeat(2,1fr);} .stat:nth-child(2){border-right:0;} .stat:nth-child(1),.stat:nth-child(2){border-bottom:1px solid var(--border);} }

  /* ── section scaffolding ────────────────────────── */
  section.block{padding:92px 0;}
  .sec-head{max-width:660px;margin-bottom:46px;}
  .sec-head.center{margin-left:auto;margin-right:auto;text-align:center;}
  .sec-head h2{margin:16px 0 0;font-size:clamp(28px,3.6vw,40px);font-weight:800;letter-spacing:-.025em;line-height:1.08;color:var(--ink);text-wrap:balance;}
  .sec-head p{margin:14px 0 0;font-size:16.5px;color:var(--ink-2);line-height:1.6;text-wrap:pretty;}
  .sec-head.center .kicker::after{content:"";width:20px;height:1.5px;background:var(--p);opacity:.5;}

  /* ── features grid ──────────────────────────────── */
  .feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
  @media (max-width:920px){.feat-grid{grid-template-columns:repeat(2,1fr);}}
  @media (max-width:600px){.feat-grid{grid-template-columns:1fr;}}
  .feat{
    background:var(--card);border:1px solid var(--border);border-radius:var(--radius);
    padding:26px 24px 24px;box-shadow:var(--shadow-sm);
  }
  .feat:hover{border-color:var(--p);}
  .feat .ic{
    width:46px;height:46px;border-radius:12px;display:grid;place-items:center;
    background:var(--p-tint);color:var(--p);margin-bottom:18px;border:1px solid var(--p-tint-2);
  }
  .feat .ic svg{width:23px;height:23px;}
  .feat h3{margin:0;font-size:17px;font-weight:700;letter-spacing:-.01em;color:var(--ink);}
  .feat p{margin:8px 0 0;font-size:14.5px;color:var(--ink-2);line-height:1.55;}

  /* ── spotlight (band) ───────────────────────────── */
  .band{background:var(--band);border-top:1px solid var(--border);border-bottom:1px solid var(--border);}
  .spot{display:grid;grid-template-columns:1fr 1fr;gap:54px;align-items:center;}
  @media (max-width:880px){.spot{grid-template-columns:1fr;gap:36px;}}
  .spot .list{display:flex;flex-direction:column;gap:18px;margin-top:26px;}
  .spot .row{display:flex;gap:14px;align-items:flex-start;}
  .spot .row .tick{flex:none;width:24px;height:24px;border-radius:7px;background:var(--p);color:#fff;display:grid;place-items:center;margin-top:1px;}
  .spot .row .tick svg{width:13px;height:13px;}
  .spot .row h4{margin:0;font-size:15.5px;font-weight:700;color:var(--ink);}
  .spot .row p{margin:3px 0 0;font-size:14px;color:var(--ink-2);line-height:1.5;}
  .spot .visual{
    background:var(--card);border:1px solid var(--border-2);border-radius:16px;padding:14px;
    box-shadow:var(--shadow);
  }
  .spot .visual .frame{border-radius:10px;overflow:hidden;border:1px solid var(--border);background:var(--panel);}
  .spot .visual .cap{display:flex;align-items:center;justify-content:space-between;padding:11px 6px 4px;font-family:var(--mono);font-size:11px;color:var(--ink-3);letter-spacing:.04em;}

  /* ── download ───────────────────────────────────── */
  .dl-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
  @media (max-width:820px){.dl-grid{grid-template-columns:1fr;}}
  .dl-card{
    background:var(--card);border:1px solid var(--border);border-radius:var(--radius);
    padding:28px 26px;box-shadow:var(--shadow-sm);display:flex;flex-direction:column;gap:18px;
  }
  .dl-card:hover{border-color:var(--p);}
  .dl-card.primary{border-color:var(--p);}
  .dl-top{display:flex;align-items:center;gap:14px;}
  .dl-os{width:44px;height:44px;border-radius:11px;background:var(--p-tint);border:1px solid var(--p-tint-2);display:grid;place-items:center;color:var(--p);}
  .dl-os svg{width:24px;height:24px;}
  .dl-os .os-mask{
    width:24px;height:24px;display:block;background:currentColor;
    -webkit-mask:var(--m) center/contain no-repeat; mask:var(--m) center/contain no-repeat;
  }
  .dl-card h3{margin:0;font-size:18px;font-weight:700;color:var(--ink);}
  .dl-card .req{margin:2px 0 0;font-family:var(--mono);font-size:11.5px;color:var(--ink-3);letter-spacing:.02em;}
  .dl-files{display:flex;flex-direction:column;gap:9px;margin-top:2px;}
  .dl-file{
    display:flex;align-items:center;justify-content:space-between;gap:10px;
    font-family:var(--mono);font-size:12.5px;color:var(--ink-2);
    background:var(--bg);border:1px solid var(--border);border-radius:9px;padding:9px 12px;
  }
  .dl-file:hover{border-color:var(--p);color:var(--p);}
  .dl-file .arr{color:var(--p);}
  .dl-file .arr svg{width:15px;height:15px;display:block;}
  .dl-file .fn{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
  .dl-file .tag{
    flex:none;font-family:var(--mono);font-size:9.5px;letter-spacing:.08em;text-transform:uppercase;
    color:var(--p);background:var(--p-tint);border:1px solid var(--p-tint-2);border-radius:5px;padding:2px 6px;
  }
  .your-os{
    display:inline-block;vertical-align:middle;margin-left:8px;font-family:var(--mono);
    font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;
    color:#fff;background:var(--p);border-radius:5px;padding:3px 7px;
  }
  .your-os[hidden]{display:none;}
  .dl-foot{
    text-align:center;margin:30px 0 0;font-family:var(--mono);font-size:12px;
    color:var(--ink-3);letter-spacing:.02em;
  }
  .dl-foot a{color:var(--p);border-bottom:1px solid var(--p-tint-2);padding-bottom:1px;}
  .dl-foot a:hover{border-bottom-color:var(--p);}
  .dl-card.is-loading .dl-file{opacity:.5;pointer-events:none;}

  /* ── open source band ───────────────────────────── */
  .oss{
    background:var(--panel);color:#fff;border-radius:22px;padding:54px 56px;
    display:grid;grid-template-columns:1.3fr 1fr;gap:40px;align-items:center;
  }
  @media (max-width:820px){.oss{grid-template-columns:1fr;padding:40px 30px;gap:28px;}}
  .oss .kicker{color:var(--lilac);}
  .oss .kicker::before{background:var(--lilac);opacity:.6;}
  .oss h2{margin:16px 0 0;font-size:clamp(26px,3.2vw,36px);font-weight:800;letter-spacing:-.02em;line-height:1.1;color:#fff;}
  .oss p{margin:14px 0 0;font-size:16px;color:rgba(255,255,255,.72);line-height:1.6;max-width:46ch;}
  .oss .actions{display:flex;flex-direction:column;gap:12px;}
  .oss .btn-primary{background:#fff;color:#1d0b40;}
  .oss .btn-primary:hover{background:#ece4f7;}
  .oss .btn-line{background:transparent;border-color:rgba(255,255,255,.3);color:#fff;}
  .oss .btn-line:hover{border-color:#fff;background:rgba(255,255,255,.08);}
  .oss .lic{font-family:var(--mono);font-size:11.5px;color:rgba(255,255,255,.5);letter-spacing:.04em;display:flex;align-items:center;gap:8px;}

  /* ── FAQ ────────────────────────────────────────── */
  .faq{max-width:780px;margin:0 auto;display:flex;flex-direction:column;gap:0;}
  .qa{border-bottom:1px solid var(--border);}
  .qa summary{
    list-style:none;cursor:pointer;padding:22px 4px;display:flex;align-items:center;justify-content:space-between;gap:20px;
    font-size:17px;font-weight:600;color:var(--ink);
  }
  .qa summary::-webkit-details-marker{display:none;}
  .qa .plus{flex:none;width:22px;height:22px;position:relative;color:var(--p);transition:transform .2s;}
  .qa .plus::before,.qa .plus::after{content:"";position:absolute;background:currentColor;border-radius:2px;}
  .qa .plus::before{left:0;right:0;top:10px;height:2px;}
  .qa .plus::after{top:0;bottom:0;left:10px;width:2px;transition:opacity .2s;}
  .qa[open] .plus::after{opacity:0;}
  .qa[open] .plus{color:var(--p);}
  .qa .ans{padding:0 4px 24px;font-size:15.5px;color:var(--ink-2);line-height:1.62;max-width:64ch;}
  .qa .ans a{color:var(--p);font-weight:500;}

  /* ── footer ─────────────────────────────────────── */
  footer.foot{background:var(--card);border-top:1px solid var(--border);padding:54px 0 40px;}
  .foot-in{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:32px;}
  @media (max-width:760px){.foot-in{grid-template-columns:1fr 1fr;gap:28px;}}
  .foot .brand{margin-bottom:14px;}
  .foot .blurb{font-size:14px;color:var(--ink-2);line-height:1.6;max-width:34ch;}
  .foot h5{margin:0 0 14px;font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-4);}
  .foot ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px;}
  .foot ul a{font-size:14px;color:var(--ink-2);}
  .foot ul a:hover{color:var(--p);}
  .foot-bot{margin-top:42px;padding-top:22px;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap;}
  .foot-bot .lic{font-family:var(--mono);font-size:12px;color:var(--ink-3);}
  .foot-bot .made{font-family:var(--mono);font-size:12px;color:var(--ink-4);}
</style>
</head>
<body>

<!-- fixed background layers: base color + watermark logo -->
<div class="bg-base" aria-hidden="true"></div>
<div class="bg-logo" id="bgLogo" aria-hidden="true"></div>

<!-- ════ NAV ════ -->
<header class="nav">
  <div class="wrap nav-in">
    <a class="brand" href="#top" aria-label="Refract home">
      <span class="mark" id="brandMark"></span>
      <span class="name">Refract</span>
    </a>
    <nav class="nav-links">
      <a href="#features">Features</a>
      <a href="#screenshot">Screenshots</a>
      <a href="#download">Download</a>
      <a href="#faq">FAQ</a>
    </nav>
    <div class="nav-cta">
      <button class="icon-btn" id="themeBtn" type="button" aria-label="Toggle dark theme" title="Toggle theme">
        <svg class="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8z"/></svg>
        <svg class="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
      </button>
      <a class="btn btn-ghost" href="https://github.com/RefractMC/Refract_MC" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.34 9.34 0 0 1 12 6.84c.85 0 1.71.12 2.51.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/></svg>
        <span>GitHub</span>
      </a>
      <a class="btn btn-primary" href="#download">Download</a>
    </div>
  </div>
</header>

<!-- ════ HERO ════ -->
<main id="top">
<section class="hero">
  <div class="wrap hero-in">
    <div class="ver-badge">
      <span class="dot"></span>
      <span><b id="heroVer">v1.0.4</b></span><span class="sep"></span>
      <span>Minecraft Java Edition</span>
    </div>
    <h1>The Minecraft launcher that <span class="hl" id="heroHl">gets out of your way</span>.</h1>
    <p class="sub" id="heroSub">Refract is a fast, modern launcher built with Electron and React — manage every instance, install mods from Modrinth and CurseForge, and jump straight into the game. Java handled for you.</p>

    <div class="hero-cta">
      <a class="btn btn-primary" href="#download">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 11 5 5 5-5"/><path d="M5 21h14"/></svg>
        Download for free
      </a>
      <a class="btn btn-ghost" href="#features">See what's inside</a>
    </div>
    <div class="hero-note">Free &amp; open source · Windows · macOS · Linux · No account required to browse</div>

    <div class="loaders">
      <span class="lbl">Works with</span>
      <span class="chip">Fabric</span>
      <span class="chip">Forge</span>
      <span class="chip">Quilt</span>
      <span class="chip">NeoForge</span>
      <span class="chip">Modrinth</span>
      <span class="chip">CurseForge</span>
    </div>
  </div>

  <!-- screenshot -->
  <div class="wrap" id="screenshot">
    <div class="shot-wrap reveal">
      <div class="window">
        <img src="logo/refract-app.png" alt="The Refract launcher browsing mods from Modrinth" />
      </div>
    </div>
  </div>
</section>

<!-- ════ STATS ════ -->
<div class="stats">
  <div class="wrap stats-in">
    <div class="stat"><div class="num">61,868+</div><div class="cap">Mods to browse</div></div>
    <div class="stat"><div class="num">2</div><div class="cap">Mod platforms</div></div>
    <div class="stat"><div class="num">8·17·21</div><div class="cap">Java auto-installed</div></div>
    <div class="stat"><div class="num">3</div><div class="cap">Desktop platforms</div></div>
  </div>
</div>

<!-- ════ FEATURES ════ -->
<section class="block" id="features">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="kicker">Everything in one place</span>
      <h2>A complete launcher, not a download button.</h2>
      <p>Refract handles the whole loop — instances, accounts, mods, Java and updates — so you spend your time playing, not configuring.</p>
    </div>

    <div class="feat-grid">
      <div class="feat reveal">
        <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="3.5" width="6" height="17" rx="1.6"/><rect x="13.5" y="3.5" width="6" height="17" rx="1.6"/><line x1="6" y1="8" x2="9" y2="8"/><line x1="15" y1="8" x2="18" y2="8"/></svg></div>
        <h3>Instance management</h3>
        <p>Create, group, duplicate, export and delete instances. Drag cards between groups and set custom JVM args per instance.</p>
      </div>
      <div class="feat reveal">
        <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9.2 3.5h2.1a1.7 1.7 0 0 1 1.7 2.4 1.4 1.4 0 0 0 1.3 2h.6a1.7 1.7 0 0 1 1.7 1.7v2.1a1.7 1.7 0 0 0 2.4 1.3 1.4 1.4 0 0 1 2 1.3v2.5a1.4 1.4 0 0 1-1.4 1.4h-3.6a1.7 1.7 0 0 1-1.7-2.4 1.4 1.4 0 0 0-1.3-2 1.4 1.4 0 0 0-1.4 1.4 1.7 1.7 0 0 1-1.7 1.7H6.1a1.4 1.4 0 0 1-1.4-1.4v-3.6a1.7 1.7 0 0 1 2.4-1.7 1.4 1.4 0 0 0 2-1.3 1.4 1.4 0 0 0-1.4-1.4A1.7 1.7 0 0 1 5.9 5.2V4.9a1.4 1.4 0 0 1 1.4-1.4z"/></svg></div>
        <h3>Modrinth &amp; CurseForge</h3>
        <p>Browse and install mods, resource packs, shaders, datapacks and modpacks from both platforms without leaving the app.</p>
      </div>
      <div class="feat reveal">
        <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.2l8 4-8 4-8-4z"/><path d="M4 12l8 4 8-4"/><path d="M4 16.5l8 4 8-4"/></svg></div>
        <h3>Java, handled</h3>
        <p>The right JRE — 8, 17 or 21 — is downloaded automatically for every Minecraft version. No PATH wrangling, ever.</p>
      </div>
      <div class="feat reveal">
        <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8.2" r="3.6"/><path d="M5 20.2a7 7 0 0 1 14 0"/></svg></div>
        <h3>Microsoft &amp; offline</h3>
        <p>Full Microsoft device-code login, offline profiles, or any third-party Yggdrasil server — with live skin faces on the account page.</p>
      </div>
      <div class="feat reveal">
        <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 12a8.5 8.5 0 0 1 14.5-6l2 2"/><path d="M20.5 12a8.5 8.5 0 0 1-14.5 6l-2-2"/><path d="M20 4v4h-4"/><path d="M4 20v-4h4"/></svg></div>
        <h3>Mod update checker</h3>
        <p>Instances badge when mods fall behind. Review what's new on the Updates tab and update one mod — or all of them — in a click.</p>
      </div>
      <div class="feat reveal">
        <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 11 5 5 5-5"/><path d="M5 21h14"/></svg></div>
        <h3>Import from MultiMC / Prism</h3>
        <p>Bring your existing setup across in one step — mods, configs and resource packs included. Nothing left behind.</p>
      </div>
      <div class="feat reveal">
        <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M8.5 10.5c.6-.7 1.6-.7 2.2 0M13.3 10.5c.6-.7 1.6-.7 2.2 0"/><path d="M8 16c1 .8 2.5 1.2 4 1.2s3-.4 4-1.2"/></svg></div>
        <h3>Discord Rich Presence</h3>
        <p>Show the instance, version and elapsed playtime in Discord. Refract also tracks total time played in every instance.</p>
      </div>
      <div class="feat reveal">
        <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="3.4"/><path d="M19 8v6M22 11h-6"/></svg></div>
        <h3>Friends panel</h3>
        <p>NameMC links, copy-UUID, a whitelist helper and inline notes — a tidy roster for the people you actually play with.</p>
      </div>
      <div class="feat reveal">
        <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v3M12 18v3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M3 12h3M18 12h3M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></svg></div>
        <h3>Silent auto-updates</h3>
        <p>Refract updates itself in the background and surfaces a tidy "What's New" panel — with a Restart button right in the title bar.</p>
      </div>
    </div>
  </div>
</section>

<!-- ════ SPOTLIGHT BAND ════ -->
<section class="band">
  <div class="wrap block">
    <div class="spot">
      <div class="reveal">
        <span class="kicker">Mod browser</span>
        <h2 style="margin:16px 0 0;font-size:clamp(26px,3.2vw,36px);font-weight:800;letter-spacing:-.02em;line-height:1.1;">Find a mod, hit install, play.</h2>
        <p style="margin:14px 0 0;font-size:16px;color:var(--ink-2);line-height:1.6;max-width:46ch;">Search 60,000+ projects across Modrinth and CurseForge, filter by loader and version, and install straight into the right instance — dependencies resolved for you.</p>
        <div class="list">
          <div class="row">
            <span class="tick"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-11"/></svg></span>
            <div><h4>Filter the way you think</h4><p>By category, loader (Fabric / Forge / Quilt / NeoForge) and Minecraft version, all at once.</p></div>
          </div>
          <div class="row">
            <span class="tick"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-11"/></svg></span>
            <div><h4>Mod profiles per instance</h4><p>Save named sets like "Survival" or "Performance" and batch-toggle mods on apply.</p></div>
          </div>
          <div class="row">
            <span class="tick"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-11"/></svg></span>
            <div><h4>Add local jars too</h4><p>Drop in a <span style="font-family:var(--mono);font-size:.9em">.jar</span> straight from disk when a mod isn't on either platform.</p></div>
          </div>
        </div>
      </div>
      <div class="visual reveal">
        <div class="frame"><img src="logo/screenshot.png" alt="Refract mod browser" /></div>
        <div class="cap"><span>refract · browse mods</span><span>Modrinth · 61,868 results</span></div>
      </div>
    </div>
  </div>
</section>

<!-- ════ DOWNLOAD ════ -->
<section class="block" id="download">
  <div class="wrap">
    <div class="sec-head center reveal">
      <span class="kicker">Get Refract</span>
      <h2>Download for your platform.</h2>
      <p>Free, open source and self-updating. Grab the latest release — version <span id="dlVer">1.0.4</span> — below.</p>
    </div>

    <div class="dl-grid">
      <div class="dl-card primary reveal" data-os="win">
        <div class="dl-top">
          <div class="dl-os"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 5.4 10.4 4.4v7.1H3zM11.4 4.3 21 3v8.5h-9.6zM3 12.5h7.4v7.1L3 18.6zM11.4 12.5H21V21l-9.6-1.3z"/></svg></div>
          <div><h3>Windows <span class="your-os" hidden>Your OS</span></h3><p class="req">Windows 10 / 11 · 64-bit</p></div>
        </div>
        <div class="dl-files">
          <a class="dl-file" data-asset="win-exe" href="https://github.com/RefractMC/Refract_MC/releases/latest" target="_blank" rel="noopener"><span class="fn">Refract-setup.exe</span><span class="arr"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 11 5 5 5-5"/><path d="M5 21h14"/></svg></span></a>
        </div>
        <a class="btn btn-primary" data-cta="win-exe" style="justify-content:center" href="https://github.com/RefractMC/Refract_MC/releases/latest" target="_blank" rel="noopener">Download installer</a>
      </div>

      <div class="dl-card reveal" data-os="mac">
        <div class="dl-top">
          <div class="dl-os"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.4 12.7c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.8-.8-3-.8c-1.5 0-2.9.9-3.7 2.3-1.6 2.7-.4 6.8 1.1 9 .7 1.1 1.6 2.3 2.7 2.3 1.1 0 1.5-.7 2.8-.7s1.6.7 2.8.7 1.9-1.1 2.6-2.1c.8-1.2 1.2-2.3 1.2-2.4-.1 0-2.3-.9-2.3-3.6zM14.2 5.3c.6-.8 1-1.8.9-2.9-.9 0-2 .6-2.6 1.3-.6.7-1.1 1.7-1 2.7 1 .1 2-.5 2.7-1.1z"/></svg></div>
          <div><h3>macOS <span class="your-os" hidden>Your OS</span></h3><p class="req">Intel &amp; Apple Silicon</p></div>
        </div>
        <div class="dl-files">
          <a class="dl-file" data-asset="mac-arm" href="https://github.com/RefractMC/Refract_MC/releases/latest" target="_blank" rel="noopener"><span class="fn">Refract-arm64.dmg</span><span class="tag">Apple Silicon</span><span class="arr"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 11 5 5 5-5"/><path d="M5 21h14"/></svg></span></a>
          <a class="dl-file" data-asset="mac-x64" href="https://github.com/RefractMC/Refract_MC/releases/latest" target="_blank" rel="noopener"><span class="fn">Refract-x64.dmg</span><span class="tag">Intel</span><span class="arr"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 11 5 5 5-5"/><path d="M5 21h14"/></svg></span></a>
        </div>
        <a class="btn btn-soft" data-cta="mac-arm" style="justify-content:center" href="https://github.com/RefractMC/Refract_MC/releases/latest" target="_blank" rel="noopener">Download for Apple Silicon</a>
      </div>

      <div class="dl-card reveal" data-os="linux">
        <div class="dl-top">
          <div class="dl-os"><svg width="24" height="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M220.8 123.3c1 .5 1.8 1.7 3 1.7 1.1 0 2.8-.4 2.9-1.5.2-1.4-1.9-2.3-3.2-2.9-1.7-.7-3.9-1-5.5-.1-.4.2-.8.7-.6 1.1.3 1.3 2.3 1.1 3.4 1.7zm-21.9 1.7c1.2 0 2-1.2 3-1.7 1.1-.6 3.1-.4 3.5-1.6.2-.4-.2-.9-.6-1.1-1.6-.9-3.8-.6-5.5.1-1.3.6-3.4 1.5-3.2 2.9.1 1 1.8 1.5 2.8 1.4zM420 403.8c-3.6-4-5.3-11.6-7.2-19.7-1.8-8.1-3.9-16.8-10.5-22.4-1.3-1.1-2.6-2.1-4-2.9-1.3-.8-2.7-1.5-4.1-2 9.2-27.3 5.6-54.5-3.7-79.1-11.4-30.1-31.3-56.4-46.5-74.4-17.1-21.5-33.7-41.9-33.4-72C311.1 85.4 315.7.1 234.8 0 132.4-.2 158 103.4 156.9 135.2c-1.7 23.4-6.4 41.8-22.5 64.7-18.9 22.5-45.5 58.8-58.1 96.7-6 17.9-8.8 36.1-6.2 53.3-6.5 5.8-11.4 14.7-16.6 20.2-4.2 4.3-10.3 5.9-17 8.3s-14 6-18.5 14.5c-2.1 3.9-2.8 8.1-2.8 12.4 0 3.9.6 7.9 1.2 11.8 1.2 8.1 2.5 15.7.8 20.8-5.2 14.4-5.9 24.4-2.2 31.7 3.8 7.3 11.4 10.5 20.1 12.3 17.3 3.6 40.8 2.7 59.3 12.5 19.8 10.4 39.9 14.1 55.9 10.4 11.6-2.6 21.1-9.6 25.9-20.2 12.5-.1 26.3-5.4 48.3-6.6 14.9-1.2 33.6 5.3 55.1 4.1.6 2.3 1.4 4.6 2.5 6.7v.1c8.3 16.7 23.8 24.3 40.3 23 16.6-1.3 34.1-11 48.3-27.9 13.6-16.4 36-23.2 50.9-32.2 7.4-4.5 13.4-10.1 13.9-18.3.4-8.2-4.4-17.3-15.5-29.7zM223.7 87.3c9.8-22.2 34.2-21.8 44-.4 6.5 14.2 3.6 30.9-4.3 40.4-1.6-.8-5.9-2.6-12.6-4.9 1.1-1.2 3.1-2.7 3.9-4.6 4.8-11.8-.2-27-9.1-27.3-7.3-.5-13.9 10.8-11.8 23-4.1-2-9.4-3.5-13-4.4-1-6.9-.3-14.6 2.9-21.8zM183 75.8c10.1 0 20.8 14.2 19.1 33.5-3.5 1-7.1 2.5-10.2 4.6 1.2-8.9-3.3-20.1-9.6-19.6-8.4.7-9.8 21.2-1.8 28.1 1 .8 1.9-.2-5.9 5.5-15.6-14.6-10.5-52.1 8.4-52.1zm-13.6 60.7c6.2-4.6 13.6-10 14.1-10.5 4.7-4.4 13.5-14.2 27.9-14.2 7.1 0 15.6 2.3 25.9 8.9 6.3 4.1 11.3 4.4 22.6 9.3 8.4 3.5 13.7 9.7 10.5 18.2-2.6 7.1-11 14.4-22.7 18.1-11.1 3.6-19.8 16-38.2 14.9-3.9-.2-7-1-9.6-2.1-8-3.5-12.2-10.4-20-15-8.6-4.8-13.2-10.4-14.7-15.3-1.4-4.9 0-9 4.2-12.3zm3.3 334c-2.7 35.1-43.9 34.4-75.3 18-29.9-15.8-68.6-6.5-76.5-21.9-2.4-4.7-2.4-12.7 2.6-26.4v-.2c2.4-7.6.6-16-.6-23.9-1.2-7.8-1.8-15 .9-20 3.5-6.7 8.5-9.1 14.8-11.3 10.3-3.7 11.8-3.4 19.6-9.9 5.5-5.7 9.5-12.9 14.3-18 5.1-5.5 10-8.1 17.7-6.9 8.1 1.2 15.1 6.8 21.9 16l19.6 35.6c9.5 19.9 43.1 48.4 41 68.9zm-1.4-25.9c-4.1-6.6-9.6-13.6-14.4-19.6 7.1 0 14.2-2.2 16.7-8.9 2.3-6.2 0-14.9-7.4-24.9-13.5-18.2-38.3-32.5-38.3-32.5-13.5-8.4-21.1-18.7-24.6-29.9s-3-23.3-.3-35.2c5.2-22.9 18.6-45.2 27.2-59.2 2.3-1.7.8 3.2-8.7 20.8-8.5 16.1-24.4 53.3-2.6 82.4.6-20.7 5.5-41.8 13.8-61.5 12-27.4 37.3-74.9 39.3-112.7 1.1.8 4.6 3.2 6.2 4.1 4.6 2.7 8.1 6.7 12.6 10.3 12.4 10 28.5 9.2 42.4 1.2 6.2-3.5 11.2-7.5 15.9-9 9.9-3.1 17.8-8.6 22.3-15 7.7 30.4 25.7 74.3 37.2 95.7 6.1 11.4 18.3 35.5 23.6 64.6 3.3-.1 7 .4 10.9 1.4 13.8-35.7-11.7-74.2-23.3-84.9-4.7-4.6-4.9-6.6-2.6-6.5 12.6 11.2 29.2 33.7 35.2 59 2.8 11.6 3.3 23.7.4 35.7 16.4 6.8 35.9 17.9 30.7 34.8-2.2-.1-3.2 0-4.2 0 3.2-10.1-3.9-17.6-22.8-26.1-19.6-8.6-36-8.6-38.3 12.5-12.1 4.2-18.3 14.7-21.4 27.3-2.8 11.2-3.6 24.7-4.4 39.9-.5 7.7-3.6 18-6.8 29-32.1 22.9-76.7 32.9-114.3 7.2zm257.4-11.5c-.9 16.8-41.2 19.9-63.2 46.5-13.2 15.7-29.4 24.4-43.6 25.5s-26.5-4.8-33.7-19.3c-4.7-11.1-2.4-23.1 1.1-36.3 3.7-14.2 9.2-28.8 9.9-40.6.8-15.2 1.7-28.5 4.2-38.7 2.6-10.3 6.6-17.2 13.7-21.1.3-.2.7-.3 1-.5.8 13.2 7.3 26.6 18.8 29.5 12.6 3.3 30.7-7.5 38.4-16.3 9-.3 15.7-.9 22.6 5.1 9.9 8.5 7.1 30.3 17.1 41.6 10.6 11.6 14 19.5 13.7 24.6zM173.3 148.7c2 1.9 4.7 4.5 8 7.1 6.6 5.2 15.8 10.6 27.3 10.6 11.6 0 22.5-5.9 31.8-10.8 4.9-2.6 10.9-7 14.8-10.4s5.9-6.3 3.1-6.6-2.6 2.6-6 5.1c-4.4 3.2-9.7 7.4-13.9 9.8-7.4 4.2-19.5 10.2-29.9 10.2s-18.7-4.8-24.9-9.7c-3.1-2.5-5.7-5-7.7-6.9-1.5-1.4-1.9-4.6-4.3-4.9-1.4-.1-1.8 3.7 1.7 6.5z"></path></svg></div>
          <div><h3>Linux <span class="your-os" hidden>Your OS</span></h3><p class="req">AppImage · Debian / Ubuntu</p></div>
        </div>
        <div class="dl-files">
          <a class="dl-file" data-asset="linux-appimage" href="https://github.com/RefractMC/Refract_MC/releases/latest" target="_blank" rel="noopener"><span class="fn">Refract.AppImage</span><span class="arr"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 11 5 5 5-5"/><path d="M5 21h14"/></svg></span></a>
          <a class="dl-file" data-asset="linux-deb" href="https://github.com/RefractMC/Refract_MC/releases/latest" target="_blank" rel="noopener"><span class="fn">Refract.deb</span><span class="arr"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 11 5 5 5-5"/><path d="M5 21h14"/></svg></span></a>
        </div>
        <a class="btn btn-soft" data-cta="linux-appimage" style="justify-content:center" href="https://github.com/RefractMC/Refract_MC/releases/latest" target="_blank" rel="noopener">Download AppImage</a>
      </div>
    </div>
    <p class="dl-foot" id="dlFoot">Direct download · <a href="https://github.com/RefractMC/Refract_MC/releases" target="_blank" rel="noopener">all versions &amp; checksums</a></p>
  </div>
</section>

<!-- ════ OPEN SOURCE ════ -->
<section class="block" style="padding-top:0">
  <div class="wrap">
    <div class="oss reveal">
      <div>
        <span class="kicker">Free &amp; open source</span>
        <h2>Built in the open, licensed for everyone.</h2>
        <p>Refract is GPL-3.0 and developed in public. Read the code, file an issue, translate the UI, or open a pull request — the whole launcher is yours to inspect and improve.</p>
      </div>
      <div class="actions">
        <a class="btn btn-primary" style="justify-content:center" href="https://github.com/RefractMC/Refract_MC" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.34 9.34 0 0 1 12 6.84c.85 0 1.71.12 2.51.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/></svg>
          Star on GitHub
        </a>
        <a class="btn btn-line" style="justify-content:center" href="https://github.com/RefractMC/Refract_MC/blob/main/locales" target="_blank" rel="noopener">Help translate</a>
        <div class="lic"><span>License:</span> GPL-3.0-only · assets CC BY-SA 4.0</div>
      </div>
    </div>
  </div>
</section>

<!-- ════ FAQ ════ -->
<section class="block band" id="faq" style="border-bottom:1px solid var(--border)">
  <div class="wrap">
    <div class="sec-head center reveal">
      <span class="kicker">Good to know</span>
      <h2>Questions, answered.</h2>
    </div>
    <div class="faq">
      <details class="qa reveal" open>
        <summary>Is Refract really free?<span class="plus"></span></summary>
        <div class="ans">Yes. Refract is completely free and open source under the GPL-3.0 license. There's no paid tier, no account wall and no telemetry-for-profit — download a build and play.</div>
      </details>
      <details class="qa reveal">
        <summary>Which version of Minecraft does it support?<span class="plus"></span></summary>
        <div class="ans">Minecraft: Java Edition. You pick any Minecraft version from a live version picker when you create an instance, and Refract sets everything up — including the matching Java runtime.</div>
      </details>
      <details class="qa reveal">
        <summary>Do I need to install Java myself?<span class="plus"></span></summary>
        <div class="ans">No. Refract auto-downloads the correct JRE — Java 8, 17 or 21 — for each Minecraft version, so you never have to manage installations or environment variables.</div>
      </details>
      <details class="qa reveal">
        <summary>Do I need a Microsoft account?<span class="plus"></span></summary>
        <div class="ans">You can sign in with a Microsoft account via the official device-code flow, use an offline profile, or connect any third-party Yggdrasil authentication server. Browsing mods needs no account at all.</div>
      </details>
      <details class="qa reveal">
        <summary>Can I bring my instances from MultiMC or Prism?<span class="plus"></span></summary>
        <div class="ans">Yes — Refract imports MultiMC and Prism instances directly, including their mods, configs and resource packs, in a single step.</div>
      </details>
      <details class="qa reveal">
        <summary>Which platforms can I run it on?<span class="plus"></span></summary>
        <div class="ans">Windows (installer), macOS (universal DMG for Intel and Apple Silicon) and Linux (AppImage and .deb). The app keeps itself up to date silently in the background.</div>
      </details>
    </div>
  </div>
</section>
</main>

<!-- ════ FOOTER ════ -->
<footer class="foot">
  <div class="wrap">
    <div class="foot-in">
      <div>
        <a class="brand" href="#top">
          <span class="mark" id="footMark" style="width:28px;height:28px"></span>
          <span class="name" style="font-size:17px">Refract</span>
        </a>
        <p class="blurb">A fast, modern Minecraft launcher built with Electron and React. Free, open source, and yours.</p>
      </div>
      <div>
        <h5>Product</h5>
        <ul>
          <li><a href="#features">Features</a></li>
          <li><a href="#screenshot">Screenshots</a></li>
          <li><a href="#download">Download</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>
      </div>
      <div>
        <h5>Project</h5>
        <ul>
          <li><a href="https://github.com/RefractMC/Refract_MC" target="_blank" rel="noopener">GitHub</a></li>
          <li><a href="https://github.com/RefractMC/Refract_MC/releases" target="_blank" rel="noopener">Releases</a></li>
          <li><a href="https://github.com/RefractMC/Refract_MC/blob/main/CHANGELOG.md" target="_blank" rel="noopener">Changelog</a></li>
          <li><a href="https://github.com/RefractMC/Refract_MC/issues" target="_blank" rel="noopener">Report an issue</a></li>
        </ul>
      </div>
      <div>
        <h5>Community</h5>
        <ul>
          <li><a href="https://discord.gg/DQQCwuDjRs" target="_blank" rel="noopener">Discord</a></li>
          <li><a href="https://github.com/RefractMC/Refract_MC/blob/main/locales" target="_blank" rel="noopener">Translate</a></li>
          <li><a href="https://modrinth.com" target="_blank" rel="noopener">Modrinth</a></li>
          <li><a href="https://www.curseforge.com" target="_blank" rel="noopener">CurseForge</a></li>
        </ul>
      </div>
    </div>
    <div class="foot-bot">
      <span class="lic">Code: GPL-3.0-only · Logo &amp; assets: CC BY-SA 4.0</span>
      <span class="made">Refract is not affiliated with Mojang or Microsoft.</span>
    </div>
  </div>
</footer>

<!-- iris logo template (cloned into .mark slots) -->
<template id="irisTpl">
  <svg viewBox="-110 -110 220 220" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
    <g>
      <polygon points="0,-92 14,0 0,92 -14,0" fill="#5316D4"/>
      <polygon points="0,-92 14,0 0,92 -14,0" fill="#3D0FA3" transform="rotate(30)"/>
      <polygon points="0,-92 14,0 0,92 -14,0" fill="#8A52FF" transform="rotate(60)"/>
      <polygon points="0,-92 14,0 0,92 -14,0" fill="#3D0FA3" transform="rotate(90)"/>
      <polygon points="0,-92 14,0 0,92 -14,0" fill="#5316D4" transform="rotate(120)"/>
      <polygon points="0,-92 14,0 0,92 -14,0" fill="#8A52FF" transform="rotate(150)"/>
    </g>
    <circle r="24" fill="#1B044F"/>
    <circle r="6" fill="#ECE4FF"/>
  </svg>
</template>

<script>
  // clone iris logo into mark slots + background watermark
  (function(){
    const tpl = document.getElementById('irisTpl');
    document.querySelectorAll('.mark').forEach(slot=>{
      slot.appendChild(tpl.content.cloneNode(true));
    });
    const bg = document.getElementById('bgLogo');
    if (bg) bg.appendChild(tpl.content.cloneNode(true));
  })();

  // theme toggle (persisted) — exposed for the Tweaks panel too
  (function(){
    const root = document.documentElement;
    const KEY = 'refract-theme';
    function setTheme(mode){
      const cur = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      if (mode === 'dark') root.setAttribute('data-theme','dark');
      else root.removeAttribute('data-theme');
      try { localStorage.setItem(KEY, mode); } catch(e){}
      if (mode !== cur) window.dispatchEvent(new CustomEvent('refractthemechange',{detail:mode}));
    }
    window.setRefractTheme = setTheme;
    window.getRefractTheme = () => root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    let saved = 'light';
    try { saved = localStorage.getItem(KEY) || 'light'; } catch(e){}
    setTheme(saved);
    const btn = document.getElementById('themeBtn');
    if (btn) btn.addEventListener('click', ()=> setTheme(window.getRefractTheme() === 'dark' ? 'light' : 'dark'));
  })();

  // ── live download links from the GitHub release ──────────────
  (function(){
    const REPO = 'RefractMC/Refract_MC';
    const RELEASES = 'https://github.com/' + REPO + '/releases';

    // detect the visitor's OS to flag "Your OS"
    function detectOS(){
      const p = (navigator.userAgentData && navigator.userAgentData.platform || navigator.platform || '').toLowerCase();
      const ua = navigator.userAgent.toLowerCase();
      if (p.includes('win') || ua.includes('windows')) return 'win';
      if (p.includes('mac') || ua.includes('mac os')) return 'mac';
      if (p.includes('linux') || ua.includes('linux') || ua.includes('x11')) return 'linux';
      return null;
    }
    function flagOS(){
      const os = detectOS();
      if (!os) return;
      const card = document.querySelector('.dl-card[data-os="'+os+'"]');
      if (!card) return;
      document.querySelectorAll('.dl-card').forEach(c=>c.classList.remove('primary'));
      card.classList.add('primary');
      const badge = card.querySelector('.your-os');
      if (badge) badge.hidden = false;
    }

    // pick the best asset for each slot from the release's asset list
    function matchAsset(assets, test){
      return assets.find(a => test(a.name.toLowerCase()));
    }
    function setSlot(key, asset){
      const file = document.querySelector('.dl-file[data-asset="'+key+'"]');
      const cta  = document.querySelector('[data-cta="'+key+'"]');
      if (asset){
        if (file){ file.href = asset.browser_download_url; const fn = file.querySelector('.fn'); if (fn) fn.textContent = asset.name; }
        if (cta) cta.href = asset.browser_download_url;
      } else if (file){
        file.href = RELEASES + '/latest'; // graceful fallback
      }
    }

    flagOS();

    fetch('https://api.github.com/repos/' + REPO + '/releases/latest', {
      headers: { 'Accept': 'application/vnd.github+json' }
    })
    .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(rel => {
      const tag = (rel.tag_name || '').replace(/^v/i, '');
      if (tag){
        const dlVer = document.getElementById('dlVer'); if (dlVer) dlVer.textContent = tag;
        const heroVer = document.getElementById('heroVer'); if (heroVer) heroVer.textContent = 'v' + tag;
      }
      const assets = Array.isArray(rel.assets) ? rel.assets : [];
      setSlot('win-exe',        matchAsset(assets, n => n.endsWith('.exe')));
      setSlot('mac-arm',        matchAsset(assets, n => n.endsWith('.dmg') && (n.includes('arm64') || n.includes('aarch64'))));
      setSlot('mac-x64',        matchAsset(assets, n => n.endsWith('.dmg') && (n.includes('x64') || n.includes('x86_64') || n.includes('intel')))
                                 || matchAsset(assets, n => n.endsWith('.dmg') && !n.includes('arm64')));
      setSlot('linux-appimage', matchAsset(assets, n => n.endsWith('.appimage')));
      setSlot('linux-deb',      matchAsset(assets, n => n.endsWith('.deb')));

      // footer line: "Direct download · Refract X.Y.Z · all versions & checksums"
      const foot = document.getElementById('dlFoot');
      if (foot && tag) foot.innerHTML = 'Direct download · Refract ' + tag +
        ' · <a href="' + RELEASES + '" target="_blank" rel="noopener">all versions &amp; checksums</a>';
    })
    .catch(() => {
      // offline / rate-limited: links already point at /releases/latest, leave as-is
    });
  })();
</script>

<!-- tweaks panel -->
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js" integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm" crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>
<script type="text/babel" src="tweaks-panel.jsx"></script>
<div id="tweaks-root"></div>
<script type="text/babel" src="tweaks.jsx"></script>

</body>
</html>
