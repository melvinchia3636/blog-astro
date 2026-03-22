import { visit } from "unist-util-visit";
import type { Root, Link, Text } from "mdast";

export function remarkPdf() {
  return (tree: Root, file: any) => {
    // Derive the post slug from the source file path so relative asset
    // links can be rewritten to their public URL (/posts/<slug>/...).
    // Astro exposes the path via file.path (VFile standard property).
    const filePath: string =
      typeof file.path === "string" ? file.path : (file.history?.[0] ?? "");
    const slugMatch = filePath.match(
      /[/\\]content[/\\]posts[/\\]([^/\\]+)[/\\]/,
    );
    const postSlug = slugMatch?.[1];

    visit(tree, "paragraph", (node, index, parent) => {
      if (!parent || index === undefined) return;
      // Only convert standalone paragraphs that contain exactly one PDF link
      if (node.children.length !== 1) return;

      const child = node.children[0];
      if (child.type !== "link") return;

      const link = child as Link;
      if (!link.url.toLowerCase().endsWith(".pdf")) return;

      // Resolve relative URLs to their public path: /posts/<slug>/<original>
      const isRelative = !/^(https?:\/\/|\/)/.test(link.url);
      const resolvedUrl =
        isRelative && postSlug ? `/posts/${postSlug}/${link.url}` : link.url;

      const title = link.children
        .filter((c): c is Text => c.type === "text")
        .map((c) => c.value)
        .join("");
      const filename = link.url.split("/").pop() ?? link.url;
      const displayName = title || filename;

      // Emit a custom element; PostViewer mounts a React PdfAttachment on it.
      (parent.children as any[]).splice(index, 1, {
        type: "html",
        value: `<pdf-attachment data-url="${resolvedUrl}" data-title="${displayName}" data-filename="${filename}"></pdf-attachment>`,
      });
    });
  };
}
