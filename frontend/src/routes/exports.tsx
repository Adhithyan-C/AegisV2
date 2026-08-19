import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { ExportPanel } from "@/components/ExportPanel";
import { MissionSummaryPanel } from "@/components/MissionSummaryPanel";

export const Route = createFileRoute("/exports")({
  head: () => ({
    meta: [
      { title: "Mission Exports | AEGIS" },
      { name: "description", content: "Download mission track CSV data and generated mission intelligence PDF reports." },
      { property: "og:title", content: "Mission Exports | AEGIS" },
      { property: "og:description", content: "Export AEGIS mission tracks and reports for downstream analysis." },
    ],
  }),
  component: ExportsPage,
});

function ExportsPage() {
  return (
    <AppLayout title="Exports" subtitle="Download mission tracks and intelligence reports">
      <div className="grid gap-4 xl:grid-cols-2">
        <ExportPanel />
        <MissionSummaryPanel />
      </div>
    </AppLayout>
  );
}
