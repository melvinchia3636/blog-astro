import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

export default function StatusLine({
  directory = "~/blog",
  showTime = true,
}: {
  directory?: string;
  showTime?: boolean;
}) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour12: true,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center justify-between mb-1">
      {/* Left side segments */}
      <div className="status-left flex items-center rounded-l-full overflow-hidden h-6 opacity-0">
        {/* OS segment */}
        <span className="inline-flex items-center bg-segment-white text-bg-primary pl-3 pr-1 h-6 font-semibold text-sm">
          <Icon icon="tabler:brand-apple" className="text-base" />
        </span>
        {/* Triangle: white -> blue */}
        <div className="h-6 w-0 border-t-12 border-b-12 border-l-10 border-t-segment-blue border-b-segment-blue border-l-segment-white" />

        {/* Directory segment */}
        <span className="inline-flex items-center bg-segment-blue text-bg-primary pl-2 pr-1 h-6 font-semibold text-sm">
          <Icon icon="tabler:folder" className="mr-1.5" />
          {directory}
        </span>
        {/* Triangle: blue -> green */}
        <div className="h-6 w-0 border-t-12 border-b-12 border-l-10 border-t-segment-green border-b-segment-green border-l-segment-blue" />

        {/* Git segment */}
        <span className="inline-flex items-center bg-segment-green text-bg-primary pl-2 pr-1 h-6 font-semibold text-sm">
          <Icon icon="tabler:git-branch" className="mr-1.5" />
          main
        </span>
        {/* Triangle: green -> transparent */}
        <div className="h-6 w-0 border-t-12 border-b-12 border-l-10 border-t-transparent border-b-transparent border-l-segment-green" />
      </div>

      {/* Right side segments */}
      <div className="status-right md:flex items-center hidden rounded-r-full overflow-hidden h-6 opacity-0">
        {/* Triangle: transparent -> green */}
        <div className="h-6 w-0 border-t-12 border-b-12 border-r-10 border-t-transparent border-b-transparent border-r-segment-green" />

        {/* Node.js segment */}
        <span className="inline-flex items-center bg-segment-green text-bg-primary pl-2 pr-2 h-6 text-sm">
          <Icon icon="cib:node-js" className="mr-1.5 size-4" />
          v22.16.0
        </span>

        {/* Time segment */}
        {showTime && time && (
          <>
            {/* Triangle: green -> white */}
            <div className="h-6 w-0 border-t-12 border-b-12 border-r-10 border-t-segment-green border-b-segment-green border-r-segment-white" />
            <span className="inline-flex items-center bg-segment-white text-bg-primary pl-2 pr-2 h-6 text-sm">
              {time}
              <Icon icon="tabler:clock" className="ml-1.5" />
            </span>
          </>
        )}
      </div>
    </div>
  );
}
