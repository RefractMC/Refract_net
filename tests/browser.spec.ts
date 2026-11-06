import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const primaryRoutes = ["/", "/features/", "/download/", "/community/", "/about/", "/wiki/", "/news/"];
const preservedRoutes = [
  "/download/mac/",
  "/download/linux/",
  "/download/steam-deck/",
  "/wiki/getting-started/installing/",
  "/wiki/help/java-and-launching/",
  "/news/refract-1-3-0/",
  "/news/tauri-era/",
  "/tags/",
];
const browserErrors = new WeakMap<Page, string[]>();

// Build snapshots are enhanced by public live data. Mock API outages here so the
// general route checks remain deterministic and exercise the fallback UI.
test.beforeEach(async ({ page, baseURL }) => {
  const errors: string[] = [];
  browserErrors.set(page, errors);
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.route("**/*", async route => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.origin === new URL(baseURL!).origin || !/^https?:$/.test(url.protocol)) {
      await route.continue();
    } else if (["api.github.com", "discord.com"].includes(url.hostname) && ["fetch", "xhr"].includes(request.resourceType())) {
      await route.fulfill({ contentType: "application/json", body: JSON.stringify({ message: "API unavailable in offline browser test" }), headers: { "access-control-allow-origin": "*" } });
    } else if (request.resourceType() === "image") {
      await route.fulfill({
        contentType: "image/svg+xml",
        body: '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="96" height="96" fill="#302a42"/></svg>',
      });
    } else {
      errors.push(`Unexpected external ${request.resourceType()} request: ${url.origin}${url.pathname}`);
      await route.abort();
    }
  });
});

test.afterEach(async ({ page }) => {
  expect(browserErrors.get(page), "No browser exceptions, console errors, or unexpected external requests").toEqual([]);
});

async function visit(page: Page, route: string) {
  const response = await page.goto(route, { waitUntil: "networkidle" });
  expect(response?.status(), `${route} responds successfully`).toBe(200);
  await expect(page.locator("main")).toBeVisible();
  await expect(page.locator("h1")).toHaveCount(1);
}

for (const route of [...primaryRoutes, ...preservedRoutes]) {
  test(`route and metadata: ${route}`, async ({ page }) => {
    await visit(page, route);
    await expect(page).toHaveTitle(/Refract/i);
    await expect(page.locator('head meta[name="description"]')).toHaveAttribute("content", /\S.{15,}/);
    await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute("href", `https://refractmc.net${route}`);
    await expect(page.getByRole("link", { name: "Skip to content", exact: true })).toHaveAttribute("href", "#main-content");
  });
}

for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`responsive layouts have no horizontal overflow at ${width}px`, async ({ page }) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width, height: 1000 });
    for (const route of primaryRoutes) {
      await visit(page, route);
      const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
      }));
      expect(dimensions.document, `${route} document overflow at ${width}px`).toBeLessThanOrEqual(dimensions.viewport + 1);
      expect(dimensions.body, `${route} body overflow at ${width}px`).toBeLessThanOrEqual(dimensions.viewport + 1);
    }
  });
}

test("mobile navigation opens with keyboard and Escape restores focus", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await visit(page, "/");
  const toggle = page.locator('summary[aria-label="Toggle navigation"]');
  await toggle.focus();
  await page.keyboard.press("Enter");
  const navigation = page.getByRole("navigation", { name: "Mobile navigation", exact: true });
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole("link", { name: "Features", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(navigation).toBeHidden();
  await expect(toggle).toBeFocused();
  await toggle.click();
  await navigation.getByRole("link", { name: "Features", exact: true }).click();
  await expect(page).toHaveURL(/\/features\/$/);
});

test("homepage screenshot tabs support clicks, arrow keys, and the accessible lightbox", async ({ page }) => {
  await visit(page, "/");
  const gallery = page.locator("refract-gallery");
  const library = gallery.getByRole("tab", { name: "Instance library", exact: true });
  const browse = gallery.getByRole("tab", { name: "Browse mods", exact: true });
  const settings = gallery.getByRole("tab", { name: "Make it yours", exact: true });
  await expect(library).toHaveAttribute("aria-selected", "true");
  await browse.click();
  await expect(browse).toHaveAttribute("aria-selected", "true");
  await expect(gallery.getByRole("tabpanel", { name: "Browse mods", exact: true })).toBeVisible();
  await expect(gallery.getByRole("tabpanel")).toHaveCount(1);
  await page.keyboard.press("ArrowRight");
  await expect(settings).toBeFocused();
  await expect(settings).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Home");
  await expect(library).toBeFocused();
  await page.keyboard.press("End");
  await expect(settings).toBeFocused();
  const enlarge = gallery.getByRole("link", { name: "Enlarge launcher screenshot", exact: true });
  await enlarge.click();
  const dialog = page.getByRole("dialog", { name: "Launcher screenshot enlarged", exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("img")).toHaveAttribute("src", /settings\.webp$/);
  await expect(dialog.getByRole("button", { name: "Close screenshot", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(enlarge).toBeFocused();
});

test("download tabs retain explicit package architectures and verified GitHub URLs", async ({ page }) => {
  await visit(page, "/download/");
  const windows = page.getByRole("tab", { name: "Windows", exact: true });
  const macos = page.getByRole("tab", { name: "macOS", exact: true });
  const linux = page.getByRole("tab", { name: "Linux", exact: true });
  for (const tab of [windows, macos, linux]) {
    await tab.click();
    await expect(tab).toHaveAttribute("aria-selected", "true");
    const panel = page.getByRole("tabpanel");
    await expect(panel).toHaveCount(1);
    const downloads = panel.locator('a[href*="/releases/download/"]');
    // A healthy build snapshot must expose official files; unavailable snapshots
    // are covered by the separate data integration unit tests.
    expect(await downloads.count(), `Installers available for ${await tab.innerText()}`).toBeGreaterThan(0);
    for (const link of await downloads.all()) {
      await expect(link).toHaveAttribute("href", /^https:\/\/github\.com\/RefractMC\/Refract_MC\/releases\/download\/[^/]+\/[^/]+$/);
      await expect(link).toHaveAccessibleName(/x64|x86_64|amd64|ARM64|aarch64|Apple silicon|Intel/i);
    }
  }
  await macos.click();
  const panel = page.getByRole("tabpanel");
  await expect(panel.locator('a[href$="Refract-macOS-arm64.dmg"]')).toHaveCount(1);
  await expect(panel.locator('a[href$="Refract-macOS-x64.dmg"]')).toHaveCount(1);
  await windows.focus();
  await page.keyboard.press("ArrowRight");
  await expect(macos).toBeFocused();
});

test("documentation search filters results and reports an empty search", async ({ page }) => {
  await visit(page, "/wiki/");
  const search = page.getByRole("searchbox", { name: "Search documentation", exact: true });
  await expect(search).toBeVisible();
  await search.fill("java");
  const results = page.locator("#docs-search-results");
  await expect(results).toBeVisible();
  await expect(results.getByRole("link", { name: /Java/i }).first()).toBeVisible();
  await search.fill("zzzz-no-document-can-match-72819");
  await expect(results.getByRole("link")).toHaveCount(0);
  await expect(page.getByText("No guides found. Try a shorter phrase, or browse the categories below.", { exact: true })).toBeVisible();
  await search.fill("installing");
  const installing = results.getByRole("link", { name: /Installing Refract/i }).first();
  await expect(installing).toBeVisible();
  await installing.click();
  await expect(page).toHaveURL(/\/wiki\/getting-started\/installing\/$/);
});

test("installation commands copy their actual text and announce success", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await visit(page, "/download/linux/");
  const command = page.locator("copy-command").first();
  const button = command.getByRole("button", { name: /^Copy .* command$/ });
  const expected = await command.locator("code").innerText();
  await button.click();
  await expect(command.getByRole("status")).toHaveText("Copied to clipboard.");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(expected);
});

test("clipboard denial keeps the installation command readable", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: () => Promise.reject(new DOMException("Permission denied", "NotAllowedError")) },
    });
  });
  await visit(page, "/download/linux/");
  const command = page.locator("copy-command").first();
  await command.getByRole("button", { name: /^Copy .* command$/ }).click();
  await expect(command.getByRole("status")).toHaveText("Copy unavailable. Select the command above and copy it manually.");
  await expect(command.locator("code")).toBeVisible();
});

for (const route of ["/", "/download/", "/features/", "/community/", "/wiki/", "/wiki/getting-started/installing/", "/news/"]) {
  test(`axe WCAG 2.2 AA serious and critical violations: ${route}`, async ({ page }) => {
    await visit(page, route);
    const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    const important = result.violations.filter(violation => violation.impact === "serious" || violation.impact === "critical");
    expect(important, JSON.stringify(important.map(({ id, impact, nodes }) => ({ id, impact, elements: nodes.map(node => node.target) })), null, 2)).toEqual([]);
  });
}

test("capture production homepage and downloads at desktop and mobile sizes", async ({ page }) => {
  const directory = resolve("output/playwright");
  await mkdir(directory, { recursive: true });
  for (const [name, width, height] of [["desktop", 1440, 1000], ["mobile", 375, 812]] as const) {
    await page.setViewportSize({ width, height });
    for (const [route, file] of [["/", "home"], ["/download/", "download"]] as const) {
      await visit(page, route);
      if (route === "/download/") await page.getByRole("tab", { name: "Windows", exact: true }).click();
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: resolve(directory, `${file}-${name}.png`), fullPage: true, animations: "disabled" });
    }
  }
});
