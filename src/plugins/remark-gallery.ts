import { visit } from "unist-util-visit";
import type { Root, Image } from "mdast";

export function remarkGallery() {
  return (tree: Root, file: any) => {
    const filePath: string =
      typeof file.path === "string" ? file.path : (file.history?.[0] ?? "");
    const slugMatch = filePath.match(
      /[/\\]content[/\\]posts[/\\]([^/\\]+)[/\\]/,
    );
    const postSlug = slugMatch?.[1];

    visit(tree, "paragraph", (node, index, parent) => {
      if (!parent || index === undefined) return;

      // Filter out break nodes and whitespace-only text nodes
      const nonBreakChildren = node.children.filter(
        (c) =>
          c.type !== "break" &&
          !(c.type === "text" && (c as any).value.trim() === ""),
      );

      // Need at least 2 images to form a gallery
      if (nonBreakChildren.length < 2) return;

      // Every non-break child must be an image with title="gallery"
      if (
        !nonBreakChildren.every(
          (c): c is Image => c.type === "image" && c.title === "gallery",
        )
      )
        return;

      const images = nonBreakChildren as Image[];

      const resolvedImages = images.map((img) => {
        const isRelative = !/^(https?:\/\/|\/)/.test(img.url);
        const src =
          isRelative && postSlug
            ? `/posts/${postSlug}/${img.url.replace(/^\.\//, "")}`
            : img.url;
        return { src, alt: img.alt ?? "" };
      });

      // Escape double quotes so the JSON is safe inside an HTML attribute
      const imagesJson = JSON.stringify(resolvedImages).replace(/"/g, "&quot;");

      (parent.children as any[]).splice(index, 1, {
        type: "html",
        value: `<image-gallery data-images="${imagesJson}"></image-gallery>`,
      });
    });
  };
}
