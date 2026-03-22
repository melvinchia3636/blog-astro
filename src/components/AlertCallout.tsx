import { Icon } from "@iconify/react";

type AlertType = "note" | "tip" | "important" | "warning" | "caution";

interface Props {
  type: AlertType;
  label: string;
  html: string;
}

const ICONS: Record<AlertType, string> = {
  note: "mdi:information-outline",
  tip: "mdi:lightbulb-on-outline",
  important: "mdi:message-alert-outline",
  warning: "mdi:alert-outline",
  caution: "mdi:alert-octagon-outline",
};

const COLORS: Record<AlertType, string> = {
  note: "var(--color-segment-blue)",
  tip: "var(--color-segment-green)",
  important: "var(--color-segment-magenta)",
  warning: "var(--color-segment-yellow)",
  caution: "var(--color-segment-red)",
};

export default function AlertCallout({ type, label, html }: Props) {
  const color = COLORS[type] ?? COLORS.note;
  const icon = ICONS[type] ?? ICONS.note;

  return (
    <div
      className="my-6 rounded-r-md bg-bg-secondary pl-4 pr-4 py-3 text-text-secondary"
      style={{ borderLeft: `3px solid ${color}` }}
    >
      <div
        className="flex items-center gap-1.5 font-bold text-[0.8125rem] mb-2 tracking-wide"
        style={{ color }}
      >
        <Icon icon={icon} width={14} height={14} />
        <span>{label}</span>
      </div>
      <div
        className="[&_p]:mb-0 [&_p:not(:last-child)]:mb-2"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
