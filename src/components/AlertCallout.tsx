import { Icon } from "@iconify/react";

type AlertType = "note" | "tip" | "important" | "warning" | "caution";

interface Props {
  type: AlertType;
  label: string;
  html: string;
}

const ICONS: Record<AlertType, string> = {
  note: "tabler:info-circle",
  tip: "tabler:bulb",
  important: "tabler:message-exclamation",
  warning: "tabler:alert-triangle",
  caution: "tabler:alert-octagon",
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
        className="[&_p]:mb-0! [&_p:not(:last-child)]:mb-2"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
