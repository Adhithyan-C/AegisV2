import { useRef, useState } from "react";
import { Film, Video } from "lucide-react";
import { EmptyState, Panel } from "./Panel";
import { Button } from "@/components/ui/button";
import { missionsApi } from "@/api/missions";
import { useMission } from "@/hooks/useMission";

const SPEEDS = [0.5, 1, 1.5, 2];

export function MissionVideo() {
  const { jobId, backendOnline } = useMission();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [speed, setSpeed] = useState(1);
  const [failed, setFailed] = useState(false);

  const setRate = (r: number) => {
    setSpeed(r);
    if (videoRef.current) videoRef.current.playbackRate = r;
  };

  const showPlayer = backendOnline && !failed;

  return (
    <Panel
      title="Mission Video & Detections"
      icon={<Film className="h-4 w-4" />}
      actions={
        <span className="rounded-sm border border-ops/40 bg-ops/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ops">
          Processed
        </span>
      }
    >
      {showPlayer ? (
        <div className="space-y-3">
          <video
            ref={videoRef}
            src={missionsApi.videoUrl(jobId)}
            controls
            onError={() => setFailed(true)}
            className="aspect-video w-full rounded-md border border-border bg-black"
          />
          <div className="flex items-center gap-2">
            <span className="label-mono">Playback</span>
            {SPEEDS.map((s) => (
              <Button
                key={s}
                size="sm"
                variant={speed === s ? "default" : "outline"}
                onClick={() => setRate(s)}
                className="h-7 px-2 font-mono text-[11px]"
              >
                {s}x
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative aspect-video w-full overflow-hidden rounded-md border border-border bg-black/60">
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
            <EmptyState
              icon={<Video className="h-8 w-8" />}
              title="-"
              description={backendOnline ? "-" : "-"}
            />
          </div>
          {/* Illustrative detection overlay frame — bounding boxes come from the backend. */}
          <div className="pointer-events-none absolute inset-0 opacity-60">
            <Box left="12%" top="22%" w="18%" h="24%" tone="ops" label="-" />
            <Box left="48%" top="54%" w="12%" h="22%" tone="warn" label="-" />
            <Box left="72%" top="18%" w="14%" h="20%" tone="critical" label="-" />
          </div>
        </div>
      )}
    </Panel>
  );
}

function Box({
  left,
  top,
  w,
  h,
  tone,
  label,
}: {
  left: string;
  top: string;
  w: string;
  h: string;
  tone: "ops" | "warn" | "critical";
  label: string;
}) {
  const border = { ops: "border-ops", warn: "border-warn", critical: "border-critical" }[tone];
  const text = { ops: "bg-ops/20 text-ops", warn: "bg-warn/20 text-warn", critical: "bg-critical/20 text-critical" }[tone];
  return (
    <div className={`absolute border ${border}`} style={{ left, top, width: w, height: h }}>
      <span className={`absolute -top-5 left-0 rounded-sm px-1 font-mono text-[10px] ${text}`}>
        {label}
      </span>
    </div>
  );
}
