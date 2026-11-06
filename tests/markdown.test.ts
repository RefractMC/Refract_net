import { describe, expect, it } from "vitest";
import { renderReleaseNotes } from "../src/lib/markdown";
describe("upstream release notes", () => {
  it("removes executable HTML and unsafe links", () => {
    const html = renderReleaseNotes('<script>alert(1)</script> <img src=x onerror=alert(1)> <a href="javascript:alert(1)">bad</a>');
    expect(html).not.toMatch(/<script|<img|javascript:|onerror/);
  });
  it("resolves GitHub-relative links and keeps readable markup", () => {
    const html = renderReleaseNotes("# Changes\n\n**Fixed** [issue](/RefractMC/Refract_MC/issues/1)");
    expect(html).toContain("<h2>Changes</h2>"); expect(html).toContain("<strong>Fixed</strong>");
    expect(html).toContain('href="https://github.com/RefractMC/Refract_MC/issues/1"');
  });
  it("does not retain credential-bearing or untrusted data URLs", () => {
    expect(renderReleaseNotes('[x](https://user:pass@example.com/) [y](data:text/html,test)')).not.toMatch(/href=/);
  });
});
