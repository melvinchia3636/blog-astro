import type { IconifyJSON } from "@iconify-json/cib/index.js";
import { getIconData, iconToSVG, replaceIDs } from "@iconify/utils";

export default function buildSvg(
  iconSet: IconifyJSON,
  iconName: string,
  size = 16,
): string {
  const data = getIconData(iconSet, iconName);
  if (!data) return "";
  const { attributes, body } = iconToSVG(data, { width: size, height: size });
  const attrs = Object.entries({
    ...attributes,
    "aria-hidden": "true",
    fill: "currentColor",
  })
    .map(([k, v]) => `${k}="${v}"`)
    .join(" ");
  return `<svg ${attrs}>${replaceIDs(body)}</svg>`;
}
