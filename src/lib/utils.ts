import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

const TZ = "Asia/Jakarta";

export function formatTanggal(date: Date | string | number): string {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "full",
    timeZone: TZ,
  }).format(new Date(date));
}

export function formatTanggalWaktu(date: Date | string | number): string {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: TZ,
  }).format(new Date(date));
}
