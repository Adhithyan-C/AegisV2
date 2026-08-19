import { AlertTriangle } from "lucide-react";
import { EmptyState, Panel } from "./Panel";
import { Skeleton } from "@/components/ui/skeleton";
import { useMission } from "@/hooks/useMission";
import { cn } from "@/lib/utils";
import type { Severity } from "@/types/mission";

const severityTone: Record<Severity, string> = {
  critical: "border-critical/40 bg-critical/10 text-critical",
  high: "border-warn/40 bg-warn/10 text-warn",
  medium: "border-info/40 bg-info/10 text-info",
  low: "border-border bg-muted/50 text-muted-foreground",
};

export function FlaggedEvents() {
  const { summary } = useMission();
  const events = summary.data?.data.events ?? [];
  const isMock = summary.data?.source === "mock";

  return (
    <Panel title="Top Flagged Events" icon={<AlertTriangle className="h-4 w-4" />}>
      {summary.isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <EmptyState title={isMock ? "-" : "No flagged events found."} description={isMock ? "-" : "The mission analysis produced no anomalies."} />
      ) : (
        <ul className="space-y-2">
          {events.map((e) => (
            <li
              key={e.id}
              className="rounded-md border border-border bg-surface/70 p-3 transition-colors hover:border-primary/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <span className="font-mono text-xs text-primary">{e.timestamp}</span>
                    {e.type}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{e.description}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span
                    className={cn(
                      "rounded-sm border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest",
                      severityTone[e.severity],
                    )}
                  >
                    {e.severity}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">{e.zone}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
