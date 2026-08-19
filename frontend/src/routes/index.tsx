import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Car, Clock, Flag, ScanEye, Users } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { MetricCard } from "@/components/MetricCard";
import { UploadPanel } from "@/components/UploadPanel";
import { MissionVideo } from "@/components/MissionVideo";
import { MissionSummaryPanel } from "@/components/MissionSummaryPanel";
import { TracksTable } from "@/components/TracksTable";
import { FlaggedEvents } from "@/components/FlaggedEvents";
import { TrackReplay } from "@/components/TrackReplay";
import { ExportPanel } from "@/components/ExportPanel";
import { useMission } from "@/hooks/useMission";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AEGIS Mission Dashboard | Battlefield Intelligence" },
      {
        name: "description",
        content:
          "AEGIS mission dashboard for AI-powered battlefield object detection, tracking and mission intelligence.",
      },
      { property: "og:title", content: "AEGIS Mission Dashboard" },
      {
        property: "og:description",
        content: "AI-Powered Battlefield Object Detection & Tracking command dashboard.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { summary } = useMission();
  const data = summary.data?.data;
  const loading = summary.isLoading;
  const isMock = summary.data?.source === "mock";
  const [selected, setSelected] = useState<string | undefined>();

  return (
    <AppLayout title="Mission Dashboard">
      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <UploadPanel />
        <MissionSummaryPanel />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          label="Total Detections"
          value={isMock ? "-" : (data?.total_detections ?? 0).toLocaleString()}
          icon={ScanEye}
          loading={loading}
        />
        <MetricCard
          label="Vehicles"
          value={isMock ? "-" : (data?.vehicles ?? 0).toLocaleString()}
          icon={Car}
          tone="ops"
          loading={loading}
        />
        <MetricCard
          label="Personnel"
          value={isMock ? "-" : (data?.personnel ?? 0).toLocaleString()}
          icon={Users}
          tone="warn"
          loading={loading}
        />
        <MetricCard
          label="Flagged Events"
          value={isMock ? "-" : (data?.flagged_events ?? 0).toLocaleString()}
          icon={Flag}
          tone="critical"
          loading={loading}
        />
        <MetricCard
          label="Mission Duration"
          value={isMock ? "-" : (data?.duration ?? "--:--:--")}
          icon={Clock}
          tone="info"
          loading={loading}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <MissionVideo />
        <FlaggedEvents />
      </div>

      <TracksTable onSelect={setSelected} />

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <TrackReplay selectedId={selected} />
        <ExportPanel />
      </div>
    </AppLayout>
  );
}
