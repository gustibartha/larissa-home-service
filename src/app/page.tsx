import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  FlaskConical,
  HeartPulse,
  MapPin,
  Microscope,
  Scan,
  Sparkles,
  Stethoscope,
  TestTube,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/dal";
import { getServices } from "@/lib/queries";
import { formatRupiah } from "@/lib/utils";
import type { Service } from "@/db/schema";

const PROMOS = [
  {
    slug: "gula-darah-puasa",
    badge: "HEMAT",
    tagline: "Skrining cepat untuk deteksi diabetes",
    originalPrice: 65000,
  },
  {
    slug: "darah-lengkap",
    badge: "TERLARIS",
    tagline: "Evaluasi menyeluruh sel darah Anda",
    originalPrice: 130000,
  },
  {
    slug: "profil-lipid",
    badge: "SKRINING JANTUNG",
    tagline: "Cek kolesterol & risiko penyakit jantung",
    originalPrice: 225000,
  },
];

const CATEGORIES = [
  {
    icon: TestTube,
    title: "Pemeriksaan Darah",
    desc: "Hematologi & Kimia Klinik",
    href: "/katalog?kategori=Laboratorium",
  },
  {
    icon: Microscope,
    title: "Patologi & Imuno",
    desc: "Pap smear, serologi, urinalisa",
    href: "/katalog?kategori=Laboratorium",
  },
  {
    icon: Scan,
    title: "Radiologi & X-Ray",
    desc: "Pencitraan diagnostik di klinik",
    href: "/katalog?kategori=Non-Laboratorium",
  },
  {
    icon: Activity,
    title: "USG",
    desc: "Ultrasonografi organ dalam",
    href: "/katalog?kategori=Non-Laboratorium",
  },
  {
    icon: HeartPulse,
    title: "ECG & Spirometri",
    desc: "Cek jantung & fungsi paru",
    href: "/katalog?kategori=Non-Laboratorium",
  },
  {
    icon: MapPin,
    title: "Home Service",
    desc: "Pengambilan sampel ke rumah",
    href: "/katalog",
  },
];

const TRUST = [
  { icon: BadgeCheck, title: "Akreditasi Paripurna", desc: "Kemenkes RI" },
  { icon: Stethoscope, title: "Sejak 1987", desc: "Pengalaman 38+ tahun" },
  { icon: MapPin, title: "Home Service", desc: "Nakes datang ke rumah" },
  { icon: Sparkles, title: "Hasil Digital", desc: "Akses kapan saja di HP" },
];

export default async function LandingPage() {
  const [user, allServices] = await Promise.all([
    getCurrentUser(),
    getServices(),
  ]);

  const byslug = new Map(allServices.map((s) => [s.slug, s] as const));
  const promos = PROMOS.map((p) => ({ ...p, service: byslug.get(p.slug) })).filter(
    (p): p is typeof p & { service: Service } => Boolean(p.service),
  );
  const featuredSlugs = [
    "darah-lengkap",
    "fungsi-ginjal",
    "usg-abdomen",
    "ecg",
    "urinalisa",
    "audiometry",
  ];
  const featured = featuredSlugs
    .map((s) => byslug.get(s))
    .filter((s): s is Service => Boolean(s));

  return (
    <div className="min-h-dvh">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
          <Link href="/" aria-label="Beranda Larissa">
            <Brand />
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-medium text-foreground md:flex">
            <Link href="/katalog" className="hover:text-primary">
              Layanan
            </Link>
            <a href="#promo" className="hover:text-primary">
              Promo
            </a>
            <a href="#kontak" className="hover:text-primary">
              Kontak
            </a>
          </nav>
          <Button asChild size="sm" variant={user ? "primary" : "outline"}>
            <Link href={user ? "/dashboard" : "/masuk"}>
              {user ? "Dashboard" : "Masuk"}
            </Link>
          </Button>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="border-b border-border bg-surface">
          <div className="mx-auto grid max-w-5xl items-center gap-10 px-5 py-12 md:grid-cols-2 md:gap-14 md:py-20">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                Akreditasi Paripurna Kemenkes
              </span>
              <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-foreground md:text-5xl md:leading-[1.05]">
                Cek kesehatan rutin,{" "}
                <span className="text-primary">tanpa antre.</span>
              </h1>
              <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
                Pesan layanan laboratorium Home Service dan kunjungan klinik
                langsung dari HP Anda. Hasil aman, transparan, dan bisa diakses
                kapan saja.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href={user ? "/katalog" : "/daftar"}>
                    {user ? "Pesan Layanan" : "Mulai Sekarang"}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/katalog">Lihat Layanan</Link>
                </Button>
              </div>
              <p className="mt-4 text-xs text-muted">
                Pemeriksaan oleh tenaga medis berpengalaman di Surabaya Timur.
              </p>
            </div>

            <div className="relative mx-auto aspect-square w-full max-w-sm md:order-last">
              <div className="absolute inset-0 rounded-full bg-primary-soft" />
              <div className="absolute inset-6 rounded-full bg-primary/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/larissa-mark.png"
                  alt="Logo Larissa"
                  width={320}
                  height={320}
                  priority
                  className="h-44 w-44 object-contain drop-shadow-md md:h-56 md:w-56"
                />
              </div>
              <span className="absolute right-4 top-6 inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-primary shadow-sm">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                Promo Hari Ini
              </span>
              <span className="absolute bottom-8 left-2 inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm">
                <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden />
                Home Service
              </span>
            </div>
          </div>
        </section>

        {/* PROMOS */}
        <section id="promo" className="py-12 md:py-16">
          <div className="mx-auto max-w-5xl px-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-accent">
                  Promo
                </p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  Pemeriksaan pilihan, harga hemat
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Paket favorit untuk skrining rutin dan deteksi dini.
                </p>
              </div>
              <Link
                href="/katalog"
                className="hidden whitespace-nowrap text-sm font-medium text-primary md:inline"
              >
                Lihat semua &rarr;
              </Link>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {promos.map(({ service, badge, tagline, originalPrice }) => (
                <Link
                  key={service.slug}
                  href={`/katalog/${service.slug}`}
                  className="group flex flex-col rounded-2xl border border-border bg-surface p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="inline-flex w-fit rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent">
                    {badge}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-foreground">
                    {service.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{tagline}</p>
                  <div className="mt-5 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-muted line-through">
                        {formatRupiah(originalPrice)}
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        {formatRupiah(service.price)}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Pesan
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="border-y border-border bg-surface py-12 md:py-16">
          <div className="mx-auto max-w-5xl px-5">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                Jenis Layanan
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                Pilih sesuai kebutuhan Anda
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-muted">
                Layanan laboratorium dan non-laboratorium yang lengkap untuk
                deteksi dini, kontrol rutin, dan medical check-up.
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {CATEGORIES.map(({ icon: Icon, title, desc, href }) => (
                <Link
                  key={title}
                  href={href}
                  className="group flex items-start gap-4 rounded-2xl border border-border bg-bg p-5 transition-colors hover:border-primary/50 hover:bg-primary-soft/40"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">{desc}</p>
                  </div>
                  <ChevronRight
                    className="h-5 w-5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                    aria-hidden
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED SERVICES */}
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-5xl px-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-primary">
                  Layanan Populer
                </p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  Pemeriksaan yang sering dipesan
                </h2>
              </div>
              <Link
                href="/katalog"
                className="hidden whitespace-nowrap text-sm font-medium text-primary md:inline"
              >
                Lihat semua &rarr;
              </Link>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((s) => (
                <Link
                  key={s.id}
                  href={`/katalog/${s.slug}`}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-primary/40"
                >
                  <div className="min-w-0">
                    <span className="inline-flex rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-semibold text-primary">
                      {s.group ?? s.category}
                    </span>
                    <p className="mt-2 truncate text-sm font-semibold text-foreground">
                      {s.name}
                    </p>
                    <p className="mt-1 text-base font-bold text-primary">
                      {formatRupiah(s.price)}
                    </p>
                  </div>
                  <FlaskConical
                    className="h-7 w-7 shrink-0 text-primary/60 transition-colors group-hover:text-primary"
                    aria-hidden
                  />
                </Link>
              ))}
            </div>
            <div className="mt-6 text-center md:hidden">
              <Button asChild variant="outline" size="md">
                <Link href="/katalog">Lihat Semua Layanan</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="border-y border-border bg-surface py-10">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-5 sm:grid-cols-4">
            {TRUST.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex flex-col items-center gap-2 text-center"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="-mt-1 text-xs text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary py-14 text-primary-fg">
          <div className="mx-auto max-w-3xl px-5 text-center">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Mulai cek kesehatan rutin Anda hari ini
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-primary-fg/85 md:text-base">
              Daftar gratis, pilih layanan, atur jadwal kunjungan, dan
              selesaikan pembayaran &mdash; semua dari HP.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="bg-surface text-primary hover:bg-surface/90"
              >
                <Link href={user ? "/katalog" : "/daftar"}>
                  {user ? "Pesan Sekarang" : "Daftar Gratis"}
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent text-primary-fg hover:bg-white/10"
              >
                <Link href="/katalog">Lihat Katalog</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer id="kontak" className="bg-surface py-10">
        <div className="mx-auto max-w-5xl px-5">
          <div className="flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
            <Brand withTagline />
            <div className="text-xs text-muted">
              <p>Laboratorium Medis &amp; Klinik Utama</p>
              <p className="mt-0.5">Surabaya Timur</p>
            </div>
            <div className="flex gap-5 text-xs font-medium text-muted">
              <Link href="/katalog" className="hover:text-primary">
                Layanan
              </Link>
              <a href="#promo" className="hover:text-primary">
                Promo
              </a>
              <Link
                href={user ? "/dashboard" : "/masuk"}
                className="hover:text-primary"
              >
                {user ? "Dashboard" : "Masuk"}
              </Link>
            </div>
          </div>
          <p className="mt-8 text-center text-[11px] text-muted">
            &copy; Larissa &middot; Serve To Be The Best
          </p>
        </div>
      </footer>
    </div>
  );
}
