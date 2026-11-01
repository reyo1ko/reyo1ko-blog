"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import PixelIcon from "./PixelIcon";
export default function ResponsiveSidebar({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const path = usePathname();
  const query = useSearchParams();
  useEffect(() => {
    setOpen(false);
  }, [path, query]);
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open) {
      el.showModal();
      document.body.style.overflow = "hidden";
    } else if (el.open) {
      el.close();
      trigger.current?.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  useEffect(() => {
    const media = matchMedia("(min-width: 1024px)");
    const close = () => {
      if (media.matches) setOpen(false);
    };
    media.addEventListener("change", close);
    return () => media.removeEventListener("change", close);
  }, []);
  return (
    <>
      <header className="mobile-header">
        <a href="/" className="mobile-brand">
          re<span>.</span> / 仕事を頑張るために
        </a>
        <button
          ref={trigger}
          className="icon-button"
          aria-label="メニューを開く"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(true)}
        >
          <PixelIcon name="menu" />
        </button>
      </header>
      <aside className="desktop-sidebar" aria-label="サイトナビゲーション">
        {children}
      </aside>
      <dialog
        ref={dialog}
        id="mobile-navigation"
        className="navigation-dialog"
        aria-label="サイトメニュー"
        onCancel={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <div
          className="dialog-content"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("a")) setOpen(false);
          }}
        >
          <button
            className="icon-button dialog-close"
            aria-label="メニューを閉じる"
            onClick={() => setOpen(false)}
          >
            <PixelIcon name="close" />
          </button>
          {children}
        </div>
      </dialog>
    </>
  );
}
