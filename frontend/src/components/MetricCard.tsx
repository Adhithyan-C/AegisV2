import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function MetricCard({
  label,
  value,
  icon: Icon,
  tone = "ops",
  hint,
  loading,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "ops" | "warn" | "critical" | "info" | "neutral";
  hint?: string;
  loading?: boolean;
}) {
  const tones = {
    ops: "text-ops border-ops/40 bg-gradient-to-br from-ops/20 to-ops/5 backdrop-blur-md",
    warn: "text-warn border-warn/40 bg-gradient-to-br from-warn/20 to-warn/5 backdrop-blur-md",
    critical: "text-critical border-critical/40 bg-gradient-to-br from-critical/20 to-critical/5 backdrop-blur-md",
    info: "text-info border-info/40 bg-gradient-to-br from-info/20 to-info/5 backdrop-blur-md",
    neutral: "text-muted-foreground border-border/40 bg-gradient-to-br from-muted/30 to-muted/10 backdrop-blur-md",
  } as const;

  return (
    <div className="panel-glass rounded-lg p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="label-mono">{label}</p>
        <span className={cn("rounded-md border p-1.5", tones[tone])}>
          <Icon className="h-4 w-4" aria-hidden />
        </span>
      </div>
      {loading ? (
        <Skeleton className="mt-3 h-8 w-24" />
      ) : (
        <p className="mt-2 font-display text-3xl font-semibold tabular-nums">{value}</p>
      )}
      {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}
