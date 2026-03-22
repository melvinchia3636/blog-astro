import { useState } from "react";
import { Icon } from "@iconify/react";

const btnClass =
  "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-text-secondary bg-bg-tertiary border border-border rounded cursor-pointer no-underline transition-colors hover:text-segment-cyan hover:border-segment-cyan";

export default function PdfAttachment({
  url,
  title,
  filename,
}: {
  url: string;
  title: string;
  filename: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="my-6 border border-border rounded-md overflow-hidden bg-bg-secondary">
      <div
        className={`flex items-center gap-3 px-3.5 py-2.5 border-b transition-colors ${
          open ? "border-border" : "border-transparent"
        }`}
      >
        <span className="text-segment-red flex shrink-0">
          <Icon icon="mdi:file-pdf-box" width={20} height={20} />
        </span>
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <span className="text-text-primary text-sm font-semibold truncate">
            {title}
          </span>
          <span className="text-text-muted text-xs truncate">{filename}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            className={btnClass}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={`flex transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            >
              <Icon icon="mdi:chevron-down" width={14} height={14} />
            </span>
            <span>Preview</span>
          </button>
          <a
            className={btnClass}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon icon="mdi:open-in-new" width={14} height={14} />
            <span>Open</span>
          </a>
        </div>
      </div>
      {open && (
        <div className="h-[600px]">
          <iframe
            src={url}
            title={title}
            loading="lazy"
            className="w-full h-full border-none block"
          />
        </div>
      )}
    </div>
  );
}
