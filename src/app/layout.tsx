import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Larissa Home Service & Booking",
    template: "%s · Larissa",
  },
  description:
    "Laboratorium Medis & Klinik di Surabaya — pesan layanan lab Home Service & kunjungan klinik langsung dari HP Anda. Hasil aman & transparan.",
  applicationName: "Larissa",
  icons: {
    icon: "/larissa-mark.png",
    apple: "/larissa-mark.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d9488",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
