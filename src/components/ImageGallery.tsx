import { useState, useMemo } from "react";
import ReactImageGallery from "react-image-gallery";
import "react-image-gallery/styles/image-gallery.css";
import { Icon } from "@iconify/react";

interface GalleryImage {
  src: string;
  alt: string;
}

const navBtn = (
  icon: string,
  side: "left" | "right",
  onClick: React.MouseEventHandler<HTMLButtonElement>,
  disabled: boolean,
) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={side === "left" ? "Previous" : "Next"}
    className={`image-gallery-icon image-gallery-${side}-nav absolute top-1/2 -translate-y-1/2 ${side === "left" ? "left-2" : "right-2"} z-10 flex items-center justify-center rounded bg-[var(--color-bg-tertiary)]/80 border border-[var(--color-border)] text-[var(--color-text-primary)] hover:text-[var(--color-segment-cyan)] hover:bg-[var(--color-bg-tertiary)] transition-colors disabled:opacity-25 disabled:cursor-default`}
  >
    <Icon icon={icon} className="size-8!" />
  </button>
);

export default function ImageGallery({ images }: { images: GalleryImage[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const items = useMemo(
    () =>
      images.map((img) => ({
        original: img.src,
        thumbnail: img.src,
        originalAlt: img.alt,
        thumbnailAlt: img.alt,
      })),
    [images],
  );

  const caption = images[currentIndex]?.alt;

  return (
    <div>
      <ReactImageGallery
        items={items}
        lazyLoad
        showIndex
        onSlide={setCurrentIndex}
        renderPlayPauseButton={() => <></>}
        renderFullscreenButton={() => <></>}
        renderLeftNav={(onClick, disabled) =>
          navBtn("tabler:chevron-left", "left", onClick, disabled)
        }
        renderRightNav={(onClick, disabled) =>
          navBtn("tabler:chevron-right", "right", onClick, disabled)
        }
      />
      {caption && (
        <p className="mt-2 text-[0.8125rem] font-mono italic text-center text-text-muted before:content-['#_'] before:not-italic">
          {caption}
        </p>
      )}
    </div>
  );
}
