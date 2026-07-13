# Refract website

The official static website for [Refract](https://github.com/RefractMC/Refract_MC), built with Astro and Markdown content collections.

## Development

Requirements: Node.js 20+ and pnpm 9+.

```sh
pnpm install
pnpm dev
```

The development server prints its local URL. Primary commands:

```sh
pnpm build          # production build in dist/
pnpm typecheck      # Astro and TypeScript diagnostics
pnpm lint           # component/content diagnostics
pnpm validate:links # validate internal links after a build
pnpm preview        # preview dist/ locally
```

## Content authoring

News posts live in `src/content/news/`. Documentation lives in `src/content/docs/<category>/`. Frontmatter is validated by `src/content.config.ts`; invalid or missing fields fail the build.

News example:

```yaml
---
title: Release title
description: One-sentence summary.
publishedAt: 2026-07-11
tags: [release]
---
```

Documentation example:

```yaml
---
title: Installing Refract
description: Install Refract on supported platforms.
category: getting-started
order: 1
tags: [installation, beginner]
---
```

Navigation, release metadata, platform downloads, and project links are centralized in `src/data/`. The About page fetches contributors from the public Refract application repository during each build and uses the local people data only as a fallback.

## Deployment

Deploy the contents of `dist/` to any static host. The canonical production origin is configured in `astro.config.mjs` as `https://refractmc.net`.

## License

The website source follows the repository license. Refract is not affiliated with Mojang or Microsoft.
