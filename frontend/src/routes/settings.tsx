import { createFileRoute } from "@tanstack/react-router";
import { Settings2 } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Panel, StatusDot } from "@/components/Panel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/api/client";
import { useMission } from "@/hooks/useMission";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "System Settings | AEGIS" },
      { name: "description", content: "Configure the AEGIS backend endpoint, active mission job and pipeline preferences." },
      { property: "og:title", content: "System Settings | AEGIS" },
      { property: "og:description", content: "Backend connection and mission job configuration." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { jobId, setJobId, backendOnline, refetchAll } = useMission();

  return (
    <AppLayout title="Settings" subtitle="Backend connection and mission configuration">
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Backend Connection" icon={<Settings2 className="h-4 w-4" />}>
          <div className="space-y-3">
            <div>
              <Label className="label-mono">API Base URL (VITE_API_BASE_URL)</Label>
              <Input readOnly value={API_BASE_URL} className="mt-1 font-mono text-xs" />
              <p className="mt-1 text-[11px] text-muted-foreground">
                Set VITE_API_BASE_URL in the environment to point AEGIS at your FastAPI backend.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <StatusDot tone={backendOnline ? "ops" : "warn"} />
              {backendOnline ? "Connected to backend" : "-"}
            </div>
            <Button size="sm" variant="outline" onClick={refetchAll}>
              Retry connection
            </Button>
          </div>
        </Panel>

        <Panel title="Active Mission Job">
          <Label className="label-mono" htmlFor="job">
            Job ID
          </Label>
          <Input
            id="job"
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            className="mt-1 font-mono text-xs"
          />
          <p className="mt-2 text-[11px] text-muted-foreground">
            Results are fetched from /api/jobs/&#123;job_id&#125; endpoints for this job.
          </p>
        </Panel>
      </div>
    </AppLayout>
  );
}
