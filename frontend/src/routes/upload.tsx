import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { UploadPanel } from "@/components/UploadPanel";
import { MissionVideo } from "@/components/MissionVideo";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload & Process Mission Footage | AEGIS" },
      {
        name: "description",
        content: "Upload UAV or surveillance footage to the AEGIS detection pipeline and track processing status.",
      },
      { property: "og:title", content: "Upload & Process Mission Footage | AEGIS" },
      { property: "og:description", content: "Send battlefield footage for AI detection and tracking." },
    ],
  }),
  component: UploadPage,
});

function UploadPage() {
  return (
    <AppLayout title="Upload & Process" subtitle="Submit mission footage to the detection pipeline">
      <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
        <UploadPanel />
        <MissionVideo />
      </div>
    </AppLayout>
  );
}
