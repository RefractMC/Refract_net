# Publishing this website

Use `refract-website-source.zip` for your Git repository. Extract its contents into the repository root (the folder containing package.json), review the changes, then commit and push to `main`.

The included `.github/workflows/static.yml` installs dependencies, checks types, runs tests, builds, validates links, and deploys to GitHub Pages. In GitHub Settings → Pages, choose GitHub Actions as the build source. Keep the custom domain set to `refractmc.net` and configure its DNS with your hosting provider.

Local requirements: Node.js 24 and pnpm 11.7.0.

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm build
pnpm validate:links
```

For a static host, use `refract-website-static.zip`: upload the contents directly to its publish directory. This archive contains the complete built site; it does not need Node.js on the server.

Google Analytics measurement ID: `G-MX248BTV0T` (stream `refract`, stream ID `15070286973`). The tag runs on `refractmc.net` and `www.refractmc.net` only, so local previews do not pollute analytics. Page views use the GA4 Google tag. Google Signals and advertising personalization signals are disabled. After deployment, visit the live website and check GA4 Realtime to confirm incoming events. The measurement ID is public; no Analytics API secret is needed.

The source archive excludes dependencies, build output, Git history, local environment files, temporary files, and screenshots used only for verification. Original website assets, local Minecraft textures, generated texture data, fonts/dependency declarations, lockfile, and deployment workflow are included.
