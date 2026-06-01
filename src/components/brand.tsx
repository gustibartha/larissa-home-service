import Image from "next/image";
import { cn } from "@/lib/utils";

export function Brand({
  className,
  withTagline = false,
}: {
  className?: string;
  withTagline?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Image
        src="/larissa-mark.png"
        alt="Logo Larissa"
        width={40}
        height={40}
        priority
        className="h-9 w-9 object-contain"
      />
      <div className="leading-tight">
        <Image
          src="/larissa-wordmark.png"
          alt="Larissa"
          width={120}
          height={33}
          priority
          className="h-5 w-auto"
        />
        {withTagline ? (
          <p className="mt-0.5 text-[11px] text-muted">
            Serve To Be The Best
          </p>
        ) : null}
      </div>
    </div>
  );
}
