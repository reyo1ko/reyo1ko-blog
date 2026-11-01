"use client";
import { useEffect, useState } from "react";
type Theme = "system" | "light" | "dark";
const validTheme = (value: string | null | undefined): Theme =>
  value === "light" || value === "dark" ? value : "system";
function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const resolved =
    theme === "system"
      ? matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;
  root.dataset.theme = theme;
  root.dataset.colorMode = resolved;
  root.style.colorScheme = resolved;
}
export default function ThemeSelect() {
  const [theme, setTheme] = useState<Theme>("system");
  useEffect(() => {
    const refresh = () => setTheme(validTheme(document.documentElement.dataset.theme));
    const onStorage = (event: StorageEvent) => {
      if (event.key !== "site-theme" && event.key !== null) return;
      const next = validTheme(event.newValue);
      applyTheme(next);
      setTheme(next);
    };
    const syncSystem = () =>
      applyTheme(validTheme(document.documentElement.dataset.theme));
    const media = matchMedia("(prefers-color-scheme: dark)");
    refresh();
    syncSystem();
    window.addEventListener("site-theme-change", refresh);
    window.addEventListener("storage", onStorage);
    media.addEventListener("change", syncSystem);
    return () => {
      window.removeEventListener("site-theme-change", refresh);
      window.removeEventListener("storage", onStorage);
      media.removeEventListener("change", syncSystem);
    };
  }, []);
  return (
    <label className="theme-control">
      <span>表示テーマ</span>
      <select
        aria-label="表示テーマ"
        value={theme}
        onChange={(event) => {
          const next = validTheme(event.target.value);
          applyTheme(next);
          setTheme(next);
          try {
            localStorage.setItem("site-theme", next);
          } catch {}
          window.dispatchEvent(new Event("site-theme-change"));
        }}
      >
        <option value="system">OSに従う</option>
        <option value="light">ライト</option>
        <option value="dark">ダーク</option>
      </select>
    </label>
  );
}
