import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import SiteFooter from "@/app/components/site-footer";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ProjectMatch — Temukan Tim Kolaborasi",
  description: "Temukan rekan lintas kampus untuk kompetisi, riset, startup, dan proyek portofolio.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
