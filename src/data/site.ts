export const site = {
  name: "Refract",
  tagline: "Your Minecraft library, in focus.",
  description:
    "A fast, open-source Minecraft launcher for organized instances, community content, automatic Java management, worlds, servers, and more.",
  url: "https://refractmc.net",
  repository: "https://github.com/RefractMC/Refract_MC",
  websiteRepository: "https://github.com/RefractMC/Refract_net",
  discord: "https://discord.gg/T7kSaS9eWK",
  issues: "https://github.com/RefractMC/Refract_MC/issues",
  discussions: "https://github.com/RefractMC/Refract_MC/discussions",
  license: "GNU GPL v3.0"
} as const;

export const navigation = [
  { label: "News", href: "/news/" },
  { label: "About", href: "/about/" },
  { label: "Wiki", href: "/wiki/" },
  { label: "Community", href: "/#community" }
] as const;

export const docsCategories = [
  { id: "overview", label: "Overview", description: "What Refract is and where to get help." },
  { id: "getting-started", label: "Getting started", description: "Install Refract and create your first instance." },
  { id: "help", label: "Help & troubleshooting", description: "Fix common runtime, content, and launch issues." },
  { id: "development", label: "Development", description: "Build, translate, and contribute to Refract." }
] as const;
