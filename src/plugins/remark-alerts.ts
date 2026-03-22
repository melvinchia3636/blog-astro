import { visit } from "unist-util-visit";
import type { Root, Paragraph, Text } from "mdast";

const ALERT_TYPES = {
  NOTE: "Note",
  TIP: "Tip",
  IMPORTANT: "Important",
  WARNING: "Warning",
  CAUTION: "Caution",
} as const;

type AlertType = keyof typeof ALERT_TYPES;

const ALERT_RE = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i;

export function remarkAlerts() {
  return (tree: Root) => {
    visit(tree, "blockquote", (node) => {
      const firstPara = node.children[0] as Paragraph | undefined;
      if (!firstPara || firstPara.type !== "paragraph") return;

      const firstText = firstPara.children[0] as Text | undefined;
      if (!firstText || firstText.type !== "text") return;

      const match = firstText.value.match(ALERT_RE);
      if (!match) return;

      const type = match[1].toUpperCase() as AlertType;
      const label = ALERT_TYPES[type];

      // Strip the [!TYPE] prefix and any leading whitespace/newline
      firstText.value = firstText.value
        .slice(match[0].length)
        .replace(/^\s*/, "");

      // If the first text node is now empty, remove it and any leading break
      if (firstText.value === "") {
        firstPara.children.shift();
        if (firstPara.children[0]?.type === "break") {
          firstPara.children.shift();
        }
      }

      // If the first paragraph is now empty, drop it
      if (firstPara.children.length === 0) {
        node.children.shift();
      }

      // Emit a custom element — React hydrates it in PostViewer
      node.data = {
        ...node.data,
        hName: "alert-callout",
        hProperties: {
          "data-type": type.toLowerCase(),
          "data-label": label,
        },
      };
    });
  };
}
