import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  FlaskConical,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/dal";

const features = [
  {
    icon: FlaskConical,
    title: "Home Service",
    desc: "Pengambilan sampel lab langsung di rumah Anda.",
  },
  {
    icon: CalendarClock,
    title: "Pilih Jadwal",
    desc: "Tentukan tanggal, jam, dan alamat kunjungan nakes.",
  },
  {
    icon: Wallet,
    title: "Bayar dari HP",
    desc: "e-Wallet, Virtual Account, atau QRIS — praktis.",
  },
  {
    icon: ShieldCheck,
    title: "Hasil Aman",
    desc: "Pantau hasil & rekam medis digital secara privat.",
  },
];

export default async function LandingPage() {
  const user = await getCurrentUser();

  return (
    <div className="container-app flex min-h-dvh flex-col px-5 pb-10">
      <header className="flex items-center justify-between py-5">
        <Brand withTagline />
        <Link
          href={user ? "/dashboard" : "/masuk"}
          className="text-sm font-medium text-primary"
        >
          {user ? "Dashboard" : "Masuk"}
        </Link>
      </header>

      <section className="mt-6">
        <span className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
          Terakreditasi Paripurna · Sejak 1987
        </span>
        <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-foreground">
          Cek kesehatan rutin tanpa antre &amp; tanpa macet.
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          Laboratorium Medis &amp; Klinik Utama PT Larissa Prima Sejahtera
          menghadirkan layanan lab Home Service dan pemesanan kunjungan klinik
          langsung dari HP Anda.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <Button asChild size="lg">
            <Link href={user ? "/katalog" : "/daftar"}>
              {user ? "Pesan Layanan" : "Mulai Sekarang"}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/katalog">Lihat Katalog Layanan</Link>
          </Button>
        </div>
      </section>

      <section className="mt-9 grid grid-cols-2 gap-3">
        {features.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="rounded-2xl border border-border bg-surface p-4"
          >
            <Icon className="h-6 w-6 text-primary" aria-hidden />
            <p className="mt-2.5 text-sm font-semibold text-foreground">
              {title}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted">{desc}</p>
          </div>
        ))}
      </section>

      <section className="mt-9 rounded-2xl bg-foreground p-5 text-white">
        <p className="text-sm font-semibold">Tata Nilai LARIS</p>
        <p className="mt-1.5 text-xs leading-relaxed text-white/70">
          Loyal · Akurat · Ramah · Inovatif · Semangat — komitmen kami untuk
          pelayanan kesehatan yang prima dan terpercaya.
        </p>
      </section>

      <footer className="mt-auto pt-10 text-center text-xs text-muted">
        PT Larissa Prima Sejahtera · Surabaya Timur
      </footer>
    </div>
  );
}
