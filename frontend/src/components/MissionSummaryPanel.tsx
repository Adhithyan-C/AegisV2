import { Compass, MapPin, Radar, Timer } from "lucide-react";
import { Panel } from "./Panel";
import { Skeleton } from "@/components/ui/skeleton";
import { useMission } from "@/hooks/useMission";

export function MissionSummaryPanel() {
  const { summary } = useMission();
  const data = summary.data?.data;
  const isMock = summary.data?.source === "mock";

  return (
    <Panel title="Mission Summary" icon={<Radar className="h-4 w-4" />}>
      {summary.isLoading || !data ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ) : (
        <>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {isMock ? "-" : data.narrative}
          </p>
          <div className="mt-4 grid gap-2">
            <Insight
              icon={<MapPin className="h-3.5 w-3.5" />}
              label="Most Active Zone"
              value={isMock ? "-" : data.most_active_zone}
            />
            <Insight
              icon={<Timer className="h-3.5 w-3.5" />}
              label="Peak Activity"
              value={isMock ? "-" : data.peak_activity}
            />
            <Insight
              icon={<Compass className="h-3.5 w-3.5" />}
              label="Movement Pattern"
              value={isMock ? "-" : data.movement_pattern}
            />
          </div>
        </>
      )}
    </Panel>
  );
}

function Insight({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-surface/70 px-3 py-2">
      <span className="flex items-center gap-2 label-mono">
        <span className="text-primary">{icon}</span>
        {label}
      </span>
      <span className="font-mono text-xs">{value}</span>
    </div>
  );
}
