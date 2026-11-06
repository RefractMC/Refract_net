import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

/** Release notes are untrusted upstream Markdown. Never inject their raw HTML. */
export function renderReleaseNotes(markdown: string): string {
  const parsed = marked.parse(markdown, { async: false, gfm: true });
  return sanitizeHtml(parsed, {
    allowedTags: ["p", "br", "hr", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "strong", "em", "del", "blockquote", "pre", "code", "a", "table", "thead", "tbody", "tr", "th", "td"],
    allowedAttributes: { a: ["href", "rel"], code: ["class"] },
    allowedSchemes: ["https", "http"],
    allowProtocolRelative: false,
    transformTags: {
      h1: "h2",
      a: (_tagName, attributes): { tagName: string; attribs: Record<string, string> } => {
        try {
          const url = new URL(attributes.href ?? "", "https://github.com/RefractMC/Refract_MC/");
          if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) return { tagName: "span", attribs: {} };
          return { tagName: "a", attribs: { href: url.href, rel: "noreferrer noopener" } };
        } catch { return { tagName: "span", attribs: {} }; }
      }
    }
  });
}
