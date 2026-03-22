import { useEffect, useRef, useState, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { Icon } from "@iconify/react";
import StatusLine from "./StatusLine";
import PdfAttachment from "./PdfAttachment";
import AlertCallout from "./AlertCallout";

function mountComponents<El extends HTMLElement>(
  selector: string,
  renderFn: (el: El) => ReactNode,
) {
  document
    .querySelectorAll<El>(`${selector}:not([data-hydrated])`)
    .forEach((el) => {
      el.setAttribute("data-hydrated", "true");
      createRoot(el).render(renderFn(el));
    });
}

export default function PostViewer({
  slug,
  title,
  excerpt,
  date,
  lineCount,
  charCount,
  readTime,
  children,
}: {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  lineCount: number;
  charCount: number;
  readTime: string;
  children?: ReactNode;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [gutterLines, setGutterLines] = useState(0);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const LINE_H = 16 * 1.8; // 1.8rem in px (base 16px)
    const obs = new ResizeObserver(([entry]) => {
      setGutterLines(Math.ceil(entry.contentRect.height / LINE_H));
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const { staggerFadeIn, fadeIn, slideInLeft, slideInRight } = (window as any)
      .__animations;

    slideInLeft(".post-nav .status-left", 100);
    slideInRight(".post-nav .status-right", 100);
    slideInLeft(".post-nav-link", 200);

    slideInLeft(".post-command .status-left", 250);
    slideInRight(".post-command .status-right", 250);
    slideInLeft(".post-command-text", 350);

    fadeIn(".post-editor", 400);
    staggerFadeIn(".post-meta-line", 600);
    fadeIn(".post-content", 800);

    slideInLeft(".post-bottom-prompt .status-left", 1000);
    slideInRight(".post-bottom-prompt .status-right", 1000);
    slideInLeft(".post-bottom-cursor", 1100);

    mountComponents("pdf-attachment", (el) => (
      <PdfAttachment
        url={el.dataset.url ?? ""}
        title={el.dataset.title ?? ""}
        filename={el.dataset.filename ?? ""}
      />
    ));

    mountComponents("alert-callout", (el) => (
      <AlertCallout
        type={(el.dataset.type ?? "note") as any}
        label={el.dataset.label ?? "Note"}
        html={el.innerHTML}
      />
    ));
  }, []);

  return (
    <main className="px-6 py-4">
      {/* Command: cd back */}
      <div className="post-nav mb-4">
        <StatusLine directory="~/blog" />
        <a
          href="/"
          className="post-nav-link inline-flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors opacity-0"
        >
          <span className="text-segment-magenta font-bold">❯</span>
          <span>cd posts</span>
        </a>
      </div>

      {/* Command: nvim file */}
      <div className="post-command mb-4">
        <StatusLine directory="~/blog/posts" />
        <div className="post-command-text flex items-center gap-2 opacity-0">
          <span className="text-segment-magenta font-bold">❯</span>
          <span className="text-text-primary">nvim {slug}.md</span>
        </div>
      </div>

      <article className="post-editor opacity-0">
        {/* Neovim Window */}
        <div className="border border-border rounded overflow-hidden bg-bg-secondary">
          {/* Tab bar */}
          <div className="bg-bg-tertiary flex items-center text-xs border-b border-border">
            <div className="flex min-w-0 items-center gap-1.5 px-3 py-1.5 bg-bg-secondary border-r border-border text-text-primary">
              <Icon
                icon="mdi:file-document-outline"
                className="text-segment-cyan shrink-0"
              />
              <span className="truncate min-w-0">{slug}.md</span>
              <span className="text-text-muted ml-1">×</span>
            </div>
            <div className="flex-1" />
          </div>

          {/* Editor content with line numbers */}
          <div className="flex items-start">
            {/* Line numbers gutter */}
            <div className="bg-bg-primary sm:block hidden text-text-muted text-right px-2 py-4 text-sm select-none border-r border-border/50 self-stretch">
              {Array.from({ length: gutterLines }, (_, i) => (
                <div key={i} className="leading-relaxed h-[1.8rem]">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Content */}
            <div ref={contentRef} className="flex-1 p-4 overflow-x-auto">
              {/* Post metadata header */}
              <div className="mb-6 text-sm font-mono">
                <div className="text-text-muted mb-2 flex items-center gap-2">
                  <span>#</span>
                  <span className="flex-1 border-t border-text-muted/30"></span>
                </div>
                <div className="flex gap-2">
                  <span className="text-segment-magenta">title:</span>
                  <span className="text-segment-green">"{title}"</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-segment-magenta">excerpt:</span>
                  <span className="text-segment-green">"{excerpt}"</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-segment-magenta">date:</span>
                  <span className="text-segment-yellow">{date}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-segment-magenta">readTime:</span>
                  <span className="text-segment-cyan">{readTime}</span>
                </div>
                <div className="text-text-muted mt-2 flex items-center gap-2">
                  <span>#</span>
                  <span className="flex-1 border-t border-text-muted/30"></span>
                </div>
              </div>

              <div className="prose">{children}</div>
            </div>
          </div>

          {/* Neovim Status Line with powerline triangles */}
          <div className="flex items-center text-xs border-t border-border h-6">
            {/* Left side */}
            <div className="flex items-center h-full min-w-0">
              {/* Mode indicator */}
              <span className="bg-segment-green text-bg-primary px-2 h-full flex items-center font-bold">
                NORMAL
              </span>
              <div className="h-full w-0 border-t-12 border-b-12 border-l-10 border-t-bg-tertiary border-b-bg-tertiary border-l-segment-green" />

              {/* Git branch */}
              <span className="bg-bg-tertiary text-text-secondary px-2 h-full flex items-center gap-1.5">
                <Icon
                  icon="mdi:source-branch"
                  className="text-segment-magenta"
                />
                main
              </span>
              <div className="h-full w-0 border-t-12 border-b-12 border-l-10 border-t-bg-secondary border-b-bg-secondary border-l-bg-tertiary" />

              {/* Filename */}
              <span className="bg-bg-secondary min-w-0 text-text-primary px-2 h-full flex items-center gap-1.5">
                <Icon icon="mdi:file-document-outline" className="shrink-0" />
                <span className="truncate min-w-0">{slug}.md</span>
                <span className="text-segment-green">[+]</span>
              </span>
              <div className="h-full w-0 border-t-12 border-b-12 border-l-10 border-t-transparent border-b-transparent border-l-bg-secondary" />
            </div>

            {/* Spacer */}
            <div className="flex-1 bg-bg-primary" />

            {/* Right side */}
            <div className="hidden lg:flex items-center h-full">
              {/* File type */}
              <div className="h-full w-0 border-t-12 border-b-12 border-r-10 border-t-transparent border-b-transparent border-r-bg-secondary" />
              <span className="bg-bg-secondary text-text-muted px-2 h-full flex items-center">
                markdown
              </span>

              {/* Encoding */}
              <div className="h-full w-0 border-t-12 border-b-12 border-r-10 border-t-bg-secondary border-b-bg-secondary border-r-bg-tertiary" />
              <span className="bg-bg-tertiary text-text-secondary px-2 h-full flex items-center">
                utf-8
              </span>

              {/* Position */}
              <div className="h-full w-0 border-t-12 border-b-12 border-r-10 border-t-bg-tertiary border-b-bg-tertiary border-r-segment-blue" />
              <span className="bg-segment-blue text-bg-primary px-2 h-full flex items-center font-semibold">
                {lineCount}:{charCount % 80}
              </span>

              {/* Percentage */}
              <div className="h-full w-0 border-t-12 border-b-12 border-r-10 border-t-segment-blue border-b-segment-blue border-r-segment-cyan" />
              <span className="bg-segment-cyan text-bg-primary px-2 h-full flex items-center font-semibold">
                100%
              </span>
            </div>
          </div>

          {/* Command line */}
          <div className="bg-bg-primary text-text-muted px-2 py-1 text-xs border-t border-border">
            <span className="text-segment-yellow">"{slug}.md"</span>
            <span className="ml-2">
              {lineCount}L, {charCount}B
            </span>
            <span className="ml-4 text-text-muted">-- READ ONLY --</span>
          </div>
        </div>

        {/* Return prompt */}
        <div className="post-bottom-prompt mt-6">
          <StatusLine directory="~/blog/posts" />
          <div className="post-bottom-cursor flex items-center gap-2 opacity-0">
            <span className="text-segment-magenta font-bold">❯</span>
            <span className="cursor"></span>
          </div>
        </div>
      </article>
    </main>
  );
}
