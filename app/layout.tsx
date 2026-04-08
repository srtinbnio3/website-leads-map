import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "600", "700"], display: "swap", variable: "--font-noto-sans-jp" });

export const metadata: Metadata = {
  title: "WebsiteLeadsMap",
  description: "Nearby business search and lead management tool",
  icons: {
    icon: "/convex.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      {/* `suppressHydrationWarning` only affects the html tag,
      // and is needed by `ThemeProvider` which sets the theme
      // class attribute on it */}
      <html lang="ja" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${notoSansJP.variable} antialiased`}
          style={{ fontFamily: '"Geist", "Noto Sans JP", "Hiragino Kaku Gothic ProN", "Hiragino Sans", "Meiryo", sans-serif' }}
        >
          <ThemeProvider attribute="class">{children}</ThemeProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
