class FeaturePreview extends HTMLElement {
  private cleanup?: () => void;

  connectedCallback() {
    if (this.cleanup || !("IntersectionObserver" in window)) return;
    const video = this.querySelector<HTMLVideoElement>("video")!;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const controller = new AbortController();
    const { signal } = controller;
    let visible = false;
    let wantsPlayback = !preference.matches;
    let automaticPause = false;
    video.muted = true;
    const pause = () => {
      if (!video.paused) { automaticPause = true; video.pause(); }
    };
    const sync = () => {
      if (visible && !document.hidden && wantsPlayback) {
        video.play().catch(() => { /* Native controls remain available if autoplay is blocked. */ });
      } else pause();
    };
    video.addEventListener("play", () => {
      wantsPlayback = true;
      if (!visible || document.hidden) pause();
    }, { signal });
    video.addEventListener("pause", () => {
      if (!automaticPause && visible && !document.hidden) wantsPlayback = false;
      automaticPause = false;
    }, { signal });
    preference.addEventListener("change", () => {
      wantsPlayback = !preference.matches;
      sync();
    }, { signal });
    document.addEventListener("visibilitychange", sync, { signal });
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting && entries[0].intersectionRatio >= .25;
      sync();
    }, { threshold: .25 });
    observer.observe(this);
    this.cleanup = () => { controller.abort(); observer.disconnect(); pause(); };
  }

  disconnectedCallback() { this.cleanup?.(); this.cleanup = undefined; }
}

if (!customElements.get("feature-preview")) customElements.define("feature-preview", FeaturePreview);
