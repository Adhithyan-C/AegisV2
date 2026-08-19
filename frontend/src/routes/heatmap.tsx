import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { HeatmapPanel } from "@/components/HeatmapPanel";

export const Route = createFileRoute("/heatmap")({
  head: () => ({
    meta: [
      { title: "Track Activity Heatmap | AEGIS" },
      { name: "description", content: "Video-frame activity heatmap built from track centroid intensity across mission zones." },
      { property: "og:title", content: "Track Activity Heatmap | AEGIS" },
      { property: "og:description", content: "Visualize where battlefield activity concentrates in the analyzed footage." },
    ],
  }),
  component: HeatmapPage,
});

function HeatmapPage() {
  return (
    <AppLayout title="Heatmap" subtitle="Video-frame track activity intensity">
      <HeatmapPanel />
    </AppLayout>
  );
}
