import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/Geist.ttf",
  weight: "100 900",
  variable: "--font-geist-sans",
  display: "swap",
});

const handwriting = localFont({
  src: "./fonts/Caveat.ttf",
  weight: "400 700",
  variable: "--font-hand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "для моей маленькой",
  description: "самой юбимой на свете",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${handwriting.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
