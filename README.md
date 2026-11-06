# Refract website

The official Refract website, built with Astro and TypeScript. This redesign keeps the existing news, wiki, tag, feed, and platform routes, adds Features and Community pages, and uses the project's real logo and launcher screenshots.

## Develop

Use Node.js 24 LTS and the pnpm version pinned in package.json.

~~~sh
pnpm install --frozen-lockfile
pnpm dev
~~~

## Build and check

~~~sh
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm validate:links
pnpm exec playwright install chromium
pnpm test:browser
pnpm audit
pnpm preview
~~~

Browser tests use the built site at http://127.0.0.1:4321. They check navigation, downloads, clipboard behavior, documentation search, keyboard interaction, responsive overflow, and axe accessibility rules. Screenshots go to output/playwright/. Test output is ignored by Git.

The production build generates dist/ and a hash-based Content Security Policy. Script hashes are generated from the actual inline scripts; there is no unsafe-inline script allowance. The policy permits local fonts, scripts, styles, and verified GitHub avatar images. Styles allow inline declarations required by Astro/React components.

## Architecture

- **Astro:** static pages, shared layouts, Markdown content collections.
- **Tailwind CSS 4:** shared tokens and utility styling.
- **shadcn/ui:** adapted Button and Tabs components, powered by Radix. One React island implements the download selector; marketing and documentation pages do not hydrate React.
- **Geist:** locally bundled variable fonts.
- **Lucide:** consistent interface icons.
- **Playwright, axe, Vitest, Lighthouse:** browser, accessibility, data, and performance verification.
- **Marked + sanitize-html:** upstream release notes are sanitized before rendering.

Frontend design guidance and Vercel React Best Practices informed the implementation. Context7, Code Reviewer, Security Compliance, and Playwright MCP are not connected in this session; current official documentation, direct source review, and the installed Playwright runner cover the work here. This does not claim those plugins are installed or that compliance has been certified.

## Public data and failure states

Pages receive validated public data at build time. The homepage additionally refreshes GitHub repository/release data and Discord invite counts through anonymous browser requests. No token or API credentials are sent to the browser. The CSP permits these two public API origins.

GitHub sources are limited to RefractMC/Refract_MC repository metadata, published releases, latest release, and contributors. Release assets use validated browser_download_url values. Architectures come from actual filenames; a missing installer has no invented replacement link. A failed latest-release request shows the official releases page and disables unavailable package choices.

The homepage total includes all uploaded assets across public releases, including updater files. The community page retains its separately labeled installer-only count (EXE, MSI, DMG, PKG, AppImage, DEB, and RPM). Both deduplicate asset IDs and require complete pagination. Counts are download events, not users or installations, and exclude package-manager downloads.

Discord uses the supplied public invite and optional public widget. If both APIs fail or the widget is disabled, the official invite remains available and public counts are hidden. No bot or private content is involved.

Build requests are cached within the build. Requests time out after eight seconds and do not retry rate limits. The homepage labels successful live refreshes with their check time; failures retain dated build snapshots for release/repository data and hide stale Discord presence counts. Other routes retain labeled build snapshots.

### Environment

Copy .env.example to .env only if needed.

| Variable | Required | Purpose |
| --- | --- | --- |
| GITHUB_TOKEN | No | Build-only public API requests with a higher authenticated rate limit. Never use a PUBLIC_ prefix. |

The site works without a token. Public APIs can still be unavailable or rate-limited; these states are explicit.

## Content and assets

- Editorial news: src/content/news/
- Documentation: src/content/docs/
- Feature evidence: src/data/features.ts
- GitHub/Discord integration: src/data/
- Download React island: src/components/DownloadSelector.tsx
- Shared tokens: src/styles/global.css
- Source and audit notes: docs/IMPLEMENTATION.md
- Current verification evidence: docs/VALIDATION.md
- Homepage redesign and current validation: docs/REDESIGN-2026-10-28.md

Keep existing content IDs stable to preserve routes. Frontmatter is validated by Astro content schemas.

User-provided screenshots in public/images/screenshots/ show the v1.5.0 interface with a custom theme. WebP derivatives preserve screenshot content. Regenerate them with node scripts/optimize-images.mjs. No AI-generated imagery or AI-powered product functionality is included.

## Deployment

This is a static site. Deploy dist/ with the build command pnpm build.

- **Netlify:** netlify.toml is provided; generated _headers applies response security headers.
- **Cloudflare Pages:** use Node 24, pnpm build, and dist as the output folder. Generated _headers is supported.
- **GitHub Pages:** the existing workflow is preserved and rebuilds every six hours. GitHub Pages cannot apply _headers; the generated meta CSP still applies, while response-only headers require a host or proxy that supports them.

A rebuild refreshes static public data and release-note routes; homepage data also refreshes in the browser. No live server endpoint or external service change is required. The canonical origin remains https://refractmc.net. Update site metadata and Astro's site setting together if previewing under a different production domain.

No production deployment or push is part of this local implementation.

## License and privacy

The launcher is GPL-3.0. Preserve upstream repository and asset licensing. Adapted shadcn components retain the MIT notice in THIRD_PARTY_NOTICES.md.

The website has no analytics SDK, tracking pixel, or AI service integration. Anonymous homepage refresh requests go to the public GitHub and Discord APIs; contributor avatars go to GitHub. Download and community links lead to their named services. The launcher's privacy and security policies remain linked separately, because the launcher's behavior differs from this website.

Refract is independent and is not affiliated with Mojang or Microsoft.
