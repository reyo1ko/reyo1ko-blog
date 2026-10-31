import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import ResponsiveSidebar from "./components/ResponsiveSidebar";
const themeScript = `(function(){try{var t=localStorage.getItem('site-theme');if(t!=='light'&&t!=='dark')t='system';document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):t;document.documentElement.dataset.colorMode=document.documentElement.style.colorScheme}catch(e){}})()`;
export const metadata: Metadata = {
  title: { default: "仕事を頑張るために", template: "%s | 仕事を頑張るために" },
  description: "ITの学びと、日々の仕事に役立つ小さなツール。reyo1koの技術ノート。",
  icons: { icon: "/re-icon.svg" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          本文へスキップ
        </a>
        <div className="app-shell">
          <Suspense>
            <ResponsiveSidebar>
              <Sidebar />
            </ResponsiveSidebar>
          </Suspense>
          <div className="main-column">
            <div className="workspace-bar">
              <span>
                <span className="status-dot" /> PERSONAL WORKSPACE
              </span>
              <span>小さな学びを、積み重ねる。</span>
            </div>
            <main id="main-content" className="page-content" tabIndex={-1}>
              {children}
            </main>
            <footer className="site-footer">
              <span>仕事を頑張るために</span>
              <span>Made for everyday work · reyo1ko</span>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
