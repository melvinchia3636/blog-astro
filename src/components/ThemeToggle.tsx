import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    setIsLight(document.documentElement.classList.contains("light"));
  }, []);

  function toggle() {
    const next = !isLight;
    document.documentElement.classList.toggle("light", next);
    localStorage.setItem("theme", next ? "light" : "dark");
    setIsLight(next);
  }

  return (
    <button
      onClick={toggle}
      className="text-text-muted hover:text-text-primary transition-colors p-1 cursor-pointer"
      aria-label="Toggle light/dark theme"
      title="Toggle light/dark theme"
    >
      <Icon
        icon={isLight ? "tabler:moon" : "tabler:sun"}
        className="text-base"
      />
    </button>
  );
}
