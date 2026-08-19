import { createFileRoute } from "@tanstack/react-router";
import { Activity, RefreshCw } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Panel, StatusDot } from "@/components/Panel";
import { MissionVideo } from "@/components/MissionVideo";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useJobPolling } from "@/hooks/useJobPolling";
import { useMission } from "@/hooks/useMission";

export const Route = createFileRoute("/live")({
  head: () => ({
    meta: [
      { title: "Live Processing Monitor | AEGIS" },
      { name: "description", content: "Monitor live YOLOv8 + ByteTrack processing progress for the active AEGIS mission job." },
      { property: "og:title", content: "Live Processing Monitor | AEGIS" },
      { property: "og:description", content: "Real-time mission processing status and job telemetry." },
    ],
  }),
  component: LivePage,
});

function LivePage() {
  const { jobId, backendOnline, refetchAll } = useMission();
  const { job } = useJobPolling(jobId, true);

  return (
    <AppLayout title="Live Processing" subtitle="Active job telemetry and pipeline status">
      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <MissionVideo />
        <Panel
          title="Pipeline Status"
          icon={<Activity className="h-4 w-4" />}
          actions={
            <Button size="sm" variant="outline" onClick={refetchAll} className="gap-2">
              <RefreshCw className="h-3.5 w-3.5" aria-hidden />
              Retry
            </Button>
          }
        >
          <dl className="space-y-3 text-xs">
            <Row label="Job ID" value={jobId} />
            <Row label="Status" value={(job?.status ?? "idle").toUpperCase()} />
            <Row label="Backend" value={backendOnline ? "Online" : "-"} />
            <Row label="Model" value="YOLOv8n (Custom)" />
            <Row label="Tracker" value="ByteTrack" />
          </dl>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2">
                <StatusDot tone={job?.status === "failed" ? "critical" : "ops"} />
                Progress
              </span>
              <span className="font-mono">{job?.progress ?? 0}%</span>
            </div>
            <Progress value={job?.progress ?? 0} className="mt-2 h-1.5" />
          </div>
          {job?.status === "failed" && (
            <p className="mt-3 rounded-md border border-critical/40 bg-critical/10 px-3 py-2 text-xs text-critical">
              Mission processing failed.
            </p>
          )}
        </Panel>
      </div>
    </AppLayout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 pb-2">
      <dt className="label-mono">{label}</dt>
      <dd className="font-mono text-xs">{value}</dd>
    </div>
  );
}
