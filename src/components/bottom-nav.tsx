"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  FileText,
  Home,
  LayoutGrid,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Beranda", icon: Home },
  { href: "/katalog", label: "Katalog", icon: LayoutGrid },
  { href: "/pesanan", label: "Pesanan", icon: ClipboardList },
  { href: "/hasil", label: "Hasil", icon: FileText },
  { href: "/profil", label: "Profil", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface">
      <div className="container-app grid grid-cols-5">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                active ? "text-primary" : "text-muted",
              )}
            >
              <Icon
                className="h-5 w-5"
                strokeWidth={active ? 2.4 : 1.8}
                aria-hidden
              />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
