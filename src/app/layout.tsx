import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "M A S K",
  applicationName: "M A S K",
  description: "M A S K — generate disposable digital identities",
  keywords: ["mask", "anonymous", "identity", "generator", "privacy", "fake-id"],
  authors: [{ name: "Bogdan" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f5" },
    { media: "(prefers-color-scheme: dark)", color: "#050505" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        <script
          dangerouslySetInnerHTML={{
            __html: `
(() => {
  try {
    const key = 'mask-theme';
    const stored = localStorage.getItem(key);
    const theme =
      stored === 'light' || stored === 'dark'
        ? stored
        : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch {}
})();
            `.trim(),
          }}
        />
        <div className="min-h-screen flex flex-col">
          <div className="flex-1 min-h-0">{children}</div>
        </div>
      </body>
    </html>
  );
}
