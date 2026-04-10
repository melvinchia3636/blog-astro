import { visit } from "unist-util-visit";
import type { Root, Image } from "mdast";

export function remarkFigure() {
  return (tree: Root, file: any) => {
    const filePath: string =
      typeof file.path === "string" ? file.path : (file.history?.[0] ?? "");
    const slugMatch = filePath.match(
      /[/\\]content[/\\]posts[/\\]([^/\\]+)[/\\]/,
    );
    const postSlug = slugMatch?.[1];

    const resolveUrl = (url: string): string => {
      const isRelative = !/^(https?:\/\/|\/)/.test(url);
      return isRelative && postSlug
        ? `/posts/${postSlug}/${url.replace(/^\.\//, "")}`
        : url;
    };

    const makeFigure = (img: Image, indent = ""): string => {
      const src = resolveUrl(img.url);
      const alt = img.alt ?? "";
      const caption = alt ? `\n${indent}  <figcaption>${alt}</figcaption>` : "";
      const figStyle = indent ? ` style="flex:1 1 180px;margin:0;"` : "";
      const imgStyle = indent
        ? ` style="width:100%;height:auto;max-height:320px;object-fit:cover;"`
        : "";
      return `${indent}<figure${figStyle}>\n${indent}  <img src="${src}" alt="${alt}" loading="lazy"${imgStyle} />${caption}\n${indent}</figure>`;
    };

    visit(tree, "paragraph", (node, index, parent) => {
      if (!parent || index === undefined) return;

      // Collect non-break, non-whitespace-text children
      const nonBreak = node.children.filter(
        (c) =>
          c.type !== "break" &&
          !(c.type === "text" && (c as any).value.trim() === ""),
      );
      if (nonBreak.length === 0) return;
      if (!nonBreak.every((c) => c.type === "image")) return;

      const images = nonBreak as Image[];

      // If every image carries title="gallery", leave it for remark-gallery
      if (images.length >= 2 && images.every((img) => img.title === "gallery"))
        return;

      if (images.length === 1) {
        // Single image → <figure>
        (parent.children as any[]).splice(index, 1, {
          type: "html",
          value: makeFigure(images[0]),
        });
      } else {
        // Multiple images → flex-wrap row of <figure> elements
        const inner = images.map((img) => makeFigure(img, "  ")).join("\n");
        (parent.children as any[]).splice(index, 1, {
          type: "html",
          value: `<div style="display:flex;flex-wrap:wrap;gap:0.75rem;margin:2rem 0;">\n${inner}\n</div>`,
        });
      }
    });
  };
}
