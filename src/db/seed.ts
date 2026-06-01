import { eq } from "drizzle-orm";
import { db } from "./index";
import { services, user } from "./schema";
import { auth } from "../lib/auth";

type SeedService = {
  slug: string;
  name: string;
  category: "Laboratorium" | "Non-Laboratorium";
  group: string;
  price: number;
  preparation?: string;
  description: string;
  homeService: boolean;
};

const SERVICES: SeedService[] = [
  {
    slug: "darah-lengkap",
    name: "Pemeriksaan Darah Lengkap (Hematologi)",
    category: "Laboratorium",
    group: "Hematologi",
    price: 95000,
    description:
      "Evaluasi sel darah merah, sel darah putih, hemoglobin, hematokrit, dan trombosit.",
    homeService: true,
  },
  {
    slug: "gula-darah-puasa",
    name: "Gula Darah Puasa",
    category: "Laboratorium",
    group: "Kimia Klinik",
    price: 45000,
    preparation: "Wajib puasa 8–10 jam sebelum pengambilan sampel.",
    description: "Pengukuran kadar glukosa darah setelah puasa.",
    homeService: true,
  },
  {
    slug: "profil-lipid",
    name: "Profil Lipid (Kolesterol)",
    category: "Laboratorium",
    group: "Kimia Klinik",
    price: 165000,
    preparation: "Wajib puasa 10–12 jam sebelum pengambilan sampel.",
    description:
      "Kolesterol total, HDL, LDL, dan trigliserida untuk skrining risiko jantung.",
    homeService: true,
  },
  {
    slug: "fungsi-ginjal",
    name: "Fungsi Ginjal (Ureum & Kreatinin)",
    category: "Laboratorium",
    group: "Kimia Klinik",
    price: 120000,
    description: "Penilaian fungsi ginjal melalui kadar ureum dan kreatinin.",
    homeService: true,
  },
  {
    slug: "fungsi-hati",
    name: "Fungsi Hati (SGOT & SGPT)",
    category: "Laboratorium",
    group: "Kimia Klinik",
    price: 130000,
    description: "Penilaian enzim hati SGOT dan SGPT.",
    homeService: true,
  },
  {
    slug: "widal",
    name: "Tes Widal (Tifoid)",
    category: "Laboratorium",
    group: "Imunologi / Serologi",
    price: 85000,
    description: "Deteksi infeksi demam tifoid (tipes).",
    homeService: true,
  },
  {
    slug: "urinalisa",
    name: "Urinalisa Lengkap",
    category: "Laboratorium",
    group: "Urinalisa",
    price: 55000,
    description: "Analisis fisik, kimia, dan mikroskopis urin.",
    homeService: true,
  },
  {
    slug: "pap-smear",
    name: "Pap Smear",
    category: "Laboratorium",
    group: "Patologi Anatomi",
    price: 250000,
    preparation:
      "Tidak sedang menstruasi; hindari hubungan & obat vagina 48 jam sebelumnya.",
    description: "Skrining dini kanker serviks.",
    homeService: false,
  },
  {
    slug: "feses-lengkap",
    name: "Pemeriksaan Feses Lengkap",
    category: "Laboratorium",
    group: "Feses / Tinja",
    price: 60000,
    description: "Analisis tinja untuk infeksi saluran cerna dan parasit.",
    homeService: true,
  },
  {
    slug: "radiologi-xray",
    name: "Radiologi / X-Ray Thorax",
    category: "Non-Laboratorium",
    group: "Radiologi",
    price: 180000,
    description: "Pencitraan rontgen dada di klinik pusat Larissa.",
    homeService: false,
  },
  {
    slug: "usg-abdomen",
    name: "USG Abdomen",
    category: "Non-Laboratorium",
    group: "USG",
    price: 275000,
    preparation: "Puasa 6 jam; minum air & tahan buang air kecil sebelum USG.",
    description: "Pemeriksaan ultrasonografi organ perut.",
    homeService: false,
  },
  {
    slug: "ecg",
    name: "ECG / Elektrokardiografi",
    category: "Non-Laboratorium",
    group: "ECG",
    price: 110000,
    description: "Rekam jantung untuk menilai irama dan kelistrikan jantung.",
    homeService: false,
  },
  {
    slug: "audiometry",
    name: "Audiometry",
    category: "Non-Laboratorium",
    group: "Audiometri",
    price: 150000,
    description: "Pemeriksaan fungsi pendengaran.",
    homeService: false,
  },
  {
    slug: "spirometry",
    name: "Spirometry",
    category: "Non-Laboratorium",
    group: "Spirometri",
    price: 140000,
    description: "Pemeriksaan fungsi paru.",
    homeService: false,
  },
];

async function ensureUser(opts: {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  role: "customer" | "staff" | "admin";
}) {
  const existing = await db
    .select()
    .from(user)
    .where(eq(user.email, opts.email))
    .limit(1);

  if (existing.length === 0) {
    await auth.api.signUpEmail({
      body: {
        name: opts.name,
        email: opts.email,
        password: opts.password,
        phone: opts.phone,
        address: opts.address,
      },
    });
  }

  await db
    .update(user)
    .set({ role: opts.role, phone: opts.phone, address: opts.address })
    .where(eq(user.email, opts.email));
}

async function main() {
  console.log("Seeding services...");
  for (const s of SERVICES) {
    const existing = await db
      .select()
      .from(services)
      .where(eq(services.slug, s.slug))
      .limit(1);
    if (existing.length > 0) {
      await db
        .update(services)
        .set({ ...s, active: true })
        .where(eq(services.slug, s.slug));
    } else {
      await db.insert(services).values({ ...s, active: true });
    }
  }
  console.log(`  ${SERVICES.length} layanan siap.`);

  console.log("Seeding demo accounts...");
  await ensureUser({
    name: "Budi Santoso",
    email: "budi@example.com",
    password: "password123",
    phone: "081234567890",
    address: "Jl. Rungkut Asri No. 10, Surabaya",
    role: "customer",
  });
  await ensureUser({
    name: "Petugas Larissa",
    email: "petugas@larissa.id",
    password: "password123",
    phone: "081200000001",
    address: "Klinik Larissa, Rungkut, Surabaya",
    role: "staff",
  });
  await ensureUser({
    name: "Admin Larissa",
    email: "admin@larissa.id",
    password: "password123",
    phone: "081200000002",
    address: "Klinik Larissa, Rungkut, Surabaya",
    role: "admin",
  });
  console.log("  Akun demo siap.");

  console.log("Selesai. Login demo:");
  console.log("  Pelanggan : budi@example.com / password123");
  console.log("  Petugas   : petugas@larissa.id / password123");
  console.log("  Admin     : admin@larissa.id / password123");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
