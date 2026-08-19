import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { TracksTable } from "@/components/TracksTable";
import { FlaggedEvents } from "@/components/FlaggedEvents";
import { TrackReplay } from "@/components/TrackReplay";

export const Route = createFileRoute("/tracks")({
  head: () => ({
    meta: [
      { title: "Tracks & Flagged Events | AEGIS" },
      { name: "description", content: "Inspect detected tracks, confidence scores, zones and flagged battlefield events." },
      { property: "og:title", content: "Tracks & Flagged Events | AEGIS" },
      { property: "og:description", content: "Search, filter and replay ByteTrack object tracks from mission footage." },
    ],
  }),
  component: TracksPage,
});

function TracksPage() {
  const [selected, setSelected] = useState<string | undefined>();
  return (
    <AppLayout title="Tracks & Events" subtitle="Detected objects, tracking history and flagged anomalies">
      <TracksTable onSelect={setSelected} />
      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <TrackReplay selectedId={selected} />
        <FlaggedEvents />
      </div>
    </AppLayout>
  );
}
