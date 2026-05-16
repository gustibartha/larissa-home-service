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
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-base font-bold text-primary-fg">
        L
      </span>
      <div className="leading-tight">
        <p className="text-base font-bold tracking-tight text-foreground">
          Larissa
        </p>
        {withTagline ? (
          <p className="text-[11px] text-muted">Serve To Be The Best</p>
        ) : null}
      </div>
    </div>
  );
}
