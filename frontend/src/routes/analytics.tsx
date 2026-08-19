import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Analytics } from "@/components/Analytics";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Mission Analytics | AEGIS" },
      { name: "description", content: "Detection distribution, confidence buckets and activity-over-time analytics for the mission." },
      { property: "og:title", content: "Mission Analytics | AEGIS" },
      { property: "og:description", content: "Analyze detection classes, confidence and temporal activity trends." },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  return (
    <AppLayout title="Analytics" subtitle="Detection distribution, confidence and temporal trends">
      <Analytics />
    </AppLayout>
  );
}
