import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://refractmc.net",
  trailingSlash: "always",
  build: { format: "directory" },
  markdown: { shikiConfig: { theme: "github-dark-default" } }
});
