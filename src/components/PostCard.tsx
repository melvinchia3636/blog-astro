import dayjs from "dayjs";

export default function PostCard({
  slug,
  excerpt,
  date,
  contentLength,
}: {
  slug: string;
  excerpt: string;
  date: string;
  contentLength: number;
}) {
  const fileSize = `${(contentLength / 100).toFixed(1)}K`.padStart(6, " ");
  const dateParts = date.split(" ");

  return (
    <a
      href={`/post/${slug}`}
      className="post-card block group opacity-0 hover:bg-bg-tertiary/30 transition-colors rounded"
    >
      {/* File line like ls -la */}
      <div className="py-0.5 text-sm whitespace-wrap">
        <span className="text-text-muted">-rwxr--r--</span>
        {"  "}
        <span className="text-segment-yellow">melvin</span>
        {"  "}
        <span className="text-segment-green">{fileSize}</span>
        {"  "}
        <span className="text-segment-blue">
          {dayjs(date).format("MMM DD, YYYY")}
        </span>
        {"  "}
        <span className="text-segment-cyan group-hover:text-segment-magenta transition-colors">
          {slug}.md
        </span>
      </div>
      {/* Excerpt as a comment */}
      <div className="text-sm text-text-muted pl-4 pb-1">
        <span className="text-segment-green">#</span>
        <span className="ml-2 italic">{excerpt}</span>
      </div>
    </a>
  );
}
