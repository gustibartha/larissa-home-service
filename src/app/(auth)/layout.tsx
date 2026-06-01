import Link from "next/link";
import { Brand } from "@/components/brand";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container-app flex min-h-dvh flex-col px-5 py-8">
      <Link href="/" className="mb-8">
        <Brand withTagline />
      </Link>
      <div className="flex flex-1 flex-col justify-center">{children}</div>
    </div>
  );
}
