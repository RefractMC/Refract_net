---
title: Build from source
description: Set up the Refract monorepo and create an unsigned local build.
category: development
order: 1
tags: [development, build]
---

Install Node.js 20 or newer, pnpm 9 or newer, stable Rust, and the Tauri 2 prerequisites for your platform. Windows packaging also requires WebView2 and Microsoft C++ build tools.

```sh
git clone https://github.com/RefractMC/Refract_MC.git
cd Refract_MC
pnpm install
pnpm dev
```

Create an unsigned local package with `pnpm build`. The React renderer lives in `apps/renderer`, the Tauri shell in `apps/tauri`, shared launcher logic in `packages/core`, and the public plugin API in `packages/plugin-api`.
