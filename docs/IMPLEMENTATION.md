# Website implementation and source record

Discovery reviewed on October 8, 2026. This record describes the website work and the public sources used to ground it. The desktop application is a separate project and was inspected without changing its source.

## Authoritative sources

| Source | Purpose |
| --- | --- |
| [Production website](https://refractmc.net/) | Existing public navigation, content, download flow, images, and visual identity |
| [Website repository](https://github.com/RefractMC/Refract_net) | Existing Astro architecture, Markdown collections, integration code, Pages workflow, and reusable assets |
| [Application repository](https://github.com/RefractMC/Refract_MC) | Product functionality, platform support, package-manager status, screenshots, license, and reporting guidance |
| [Latest published GitHub release](https://api.github.com/repos/RefractMC/Refract_MC/releases/latest) | Version, publication time, asset names, byte sizes, and canonical download URLs |
| [Application security policy](https://github.com/RefractMC/Refract_MC/security/policy) | Private vulnerability reporting and the application's separately documented dependency exceptions |
| [Official Discord invite](https://discord.gg/tE8s5VaWmS) | Community destination supplied in the project brief |

The initial website checkout was `f7ab981211fa7b4da3d455b6f0f5415b62b99ac0`. The application main branch was inspected at `bcd7deeb890722a2ebb13f9754ef1f8a58fb4cc1`. Repository main branches and releases can change independently.

The application README confirms instance grouping/import/export, Modrinth and CurseForge content, worlds and backups, server status, Java management, Microsoft/offline/Yggdrasil accounts, customization, Discord Rich Presence, and automatic updates. Advertising a feature requires confirmation in the application documentation or relevant implementation, not inference from a screenshot. A main-branch feature should not be represented as part of an older release without checking that release.

## Architecture and tooling choices

The existing site is content-first Astro with TypeScript, static output, and Markdown content collections. Preserve that architecture, its wiki and news URLs, feeds, and static deployment portability. Native HTML and Astro components are suitable for navigation, screenshot dialogs, copy controls, and document search; React should only be introduced for a component that needs it. React-specific optimization guidance does not apply to pages with no React runtime.

The design review uses the installed `design-taste-frontend` skill together with the project brief. The project's real purple branding and dark software interface take priority over generic skill defaults. Do not fabricate screenshots, metrics, testimonials, or AI features.

Official repository/API inspection uses GitHub CLI and public web sources. Tool availability and use are distinct: a requested MCP, plugin, library, or skill is not installed or used merely because it is named in the brief. Only document a tool as used when it was actually called. Quality claims require completed checks; an audit or source review alone is not security certification.

## First-party image provenance

| Asset | Source and observed content |
| --- | --- |
| `public/icons/refract-iris.svg` | Existing official website logo; same iris identity is present in the application repository's `logo/` directory |
| `public/images/screenshots/library.png` | Existing website screenshot, 1919 by 1033; visible application version is 1.0.8 |
| `public/images/screenshots/browse.png` | Existing website screenshot of content browsing |
| `public/images/screenshots/settings.png` | Existing website screenshot of application settings |
| Application `logo/screenshot.png` | Downloaded for comparison, inspected, and not adopted: visible application version is 1.0.1, older than the existing website library image |

The application's candidate screenshot is [at this immutable source revision](https://github.com/RefractMC/Refract_MC/blob/bcd7deeb890722a2ebb13f9754ef1f8a58fb4cc1/logo/screenshot.png). Its Git blob SHA is `1464f071d2c732f95fa787ad6b1ced3054ca2fe1`; its most recent change was May 24, 2026 (`1e1a92a4136955848b34173e84c47be600f43068`). It is not a newer v1.4.0 screenshot. No replacement named `current.png` was created. Existing screenshots are real historical interface previews; they must not be described as captures of the latest release.

The existing voxel background is unrelated to demonstrating the current application. The redesign should emphasize authentic launcher imagery and avoid downloading that full-page background on every documentation page.

## Verified release and installation facts

At discovery, GitHub returned **v1.4.0**, published **August 22, 2026 at 16:52:01 UTC**. Exact installer assets returned by the API:

| Platform | Asset | Bytes |
| --- | --- | ---: |
| Windows x64 | `Refract-Windows-x64.exe` | 4,278,716 |
| macOS Apple Silicon | `Refract-macOS-arm64.dmg` | 5,379,299 |
| macOS Intel | `Refract-macOS-x64.dmg` | 5,922,742 |
| Linux x86_64 | `Refract-Linux-x86_64.AppImage` | 83,888,632 |
| Debian/Ubuntu amd64 | `Refract-Linux-amd64.deb` | 6,549,606 |
| Fedora x86_64 | `Refract-Linux-x86_64.rpm` | 6,550,305 |

The release also contains `latest.json` and macOS `.app.tar.gz` updater archives. These should not silently replace ordinary installer choices. The release has no MSI installer or separate `.sig` download. Updater signing, operating-system code signing, and notarization are different mechanisms; do not describe the Windows installer as signed without evidence, and do not infer macOS notarization from the presence of an updater signature. The current application README explicitly describes macOS builds as unsigned.

The application README lists `yay -S refract-launcher-bin` for Arch/AUR and `nix run github:RefractMC/Refract_MC` for its repository flake. It describes Homebrew, Scoop, Chocolatey, and nixpkgs metadata as pending upstream acceptance. Do not present those packages as generally available. Direct Debian/RPM assets are not evidence of official distribution repository packages.

Operating-system detection is a convenience, not reliable CPU architecture detection. Users must retain manual platform and architecture choices. Missing installers must produce a specific unavailable state with a link to the official release, never a constructed substitute URL.

## Initial audit findings

- The initial homepage repeated image/text split sections and used a green accent despite the real launcher/logo's purple identity.
- A dedicated features page and community page were absent; the navigation's Community link went to a homepage anchor.
- Existing wiki and news collections, RSS/JSON feeds, canonical metadata, skip navigation, contributor fetching, and scheduled deployment are useful functionality to preserve.
- The initial download fallback referenced v1.3.1; current release discovery returned v1.4.0. Failure states need an explicit timestamp/source instead of presenting old fallback data as current.
- Initial download mapping labelled every Linux asset x86_64 and selected the first AppImage for Steam Deck without checking its architecture. An ARM release could make those defaults incorrect.
- Initial download layout dereferenced the first asset unconditionally, so permitting an empty platform list requires a matching layout fallback.
- Initial Windows and macOS copy overclaimed signing/installer availability compared with the current release and README.
- Initial `site.ts` used Discord invite `T7kSaS9eWK`; the supplied official invite is `tE8s5VaWmS`. Community counts must be omitted when the public API cannot confirm them.
- Initial layout loaded a hardcoded Google Analytics tag. Any analytics must be an explicit, documented choice; no tracking is needed to implement the requested site.
- Initial JSON-LD used raw `JSON.stringify` in a script element. Escape `<` as `\u003c` before insertion so data cannot terminate the script element.
- Initial release and contributor integrations relied on TypeScript casts rather than runtime response validation. GitHub and Discord data require shape, URL, and count validation before rendering.
- HTTP security headers depend on the chosen static host. Header configuration must actually be supported by the deployed host; putting a `_headers` file on GitHub Pages does not apply those headers.

## Data freshness and truthful metrics

GitHub and Discord requests belong in the build process or a narrowly scoped server endpoint. Private GitHub credentials must remain in build environment variables and never enter generated JavaScript, logs, or public JSON.

The existing Pages workflow runs on main pushes, manual dispatch, and a schedule every six hours. Build-time data is a snapshot from that build, not continuously live data. The UI should identify this and degrade gracefully during API failures, invalid responses, rate limits, or disabled Discord widgets. API failure must not break the public Discord invite or GitHub links.

GitHub stars and forks are repository counters. GitHub release asset download counts are download events, not users or installations. If summed, the exact asset types and release coverage must be stated. Updater archives and platform packages can represent the same person's activity, so do not claim uniqueness. Discord member/presence values are approximate public counts, not exact attendance.

## Deployment and verification

Production currently uses GitHub Pages, configured by `.github/workflows/static.yml`. Astro's canonical site origin is `https://refractmc.net`. `dist/` is portable to Netlify, Cloudflare Pages, or Vercel; changing hosting requires an actual project/account connection and domain configuration. Local build success does not prove public deployment.

Required verification includes dependency installation/audit, Astro diagnostics, production build, internal links, actual browser checks at mobile/tablet/desktop widths, keyboard navigation, dialogs, search and copy interactions, download targets, unavailable API states, browser console errors, and production metadata. Existing `lint` and `typecheck` both invoke Astro diagnostics, so they are not two different analysis engines. Lighthouse and axe results must be reported only after running them, with measured conditions and any limitations.

The linked launcher dependency audit is separate from this website's dependency graph. The website must run its own audit and record its own result. Application security policy exceptions remain governed by the application repository and are not transferred to this site.
