import { useEffect, useMemo, useState } from "react";
import { Pause, Play, Route as RouteIcon, RotateCcw } from "lucide-react";
import { EmptyState, Panel } from "./Panel";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMission } from "@/hooks/useMission";

const VIEW = { w: 960, h: 540 };

export function TrackReplay({ selectedId }: { selectedId?: string | undefined }) {
  const { tracks } = useMission();
  const rows = tracks.data?.data ?? [];
  const [trackId, setTrackId] = useState<string>("");
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (selectedId) setTrackId(selectedId);
  }, [selectedId]);

  useEffect(() => {
    if (!trackId && rows.length) setTrackId(rows[0]!.id);
  }, [rows, trackId]);

  const track = rows.find((t) => t.id === trackId);
  const history = useMemo(() => track?.bbox_history ?? [], [track]);

  useEffect(() => {
    if (!playing || history.length === 0) return;
    const id = setInterval(() => {
      setFrame((f) => (f + 1 >= history.length ? 0 : f + 1));
    }, 120);
    return () => clearInterval(id);
  }, [playing, history.length]);

  const path = history
    .slice(0, frame + 1)
    .map((p) => `${p.x},${p.y}`)
    .join(" ");
  const head = history[Math.min(frame, history.length - 1)];

  const tone =
    track?.class === "Vehicle"
      ? "var(--color-ops)"
      : track?.class === "Personnel"
        ? "var(--color-warn)"
        : "var(--color-critical)";

  return (
    <Panel
      title="Track Replay"
      icon={<RouteIcon className="h-4 w-4" />}
      actions={
        <Select value={trackId} onValueChange={(v) => { setTrackId(v); setFrame(0); }}>
          <SelectTrigger className="h-8 w-40" aria-label="Select track">
            <SelectValue placeholder="Select track" />
          </SelectTrigger>
          <SelectContent>
            {rows.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.id} · {t.class}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    >
      {history.length === 0 ? (
        <EmptyState title="No replay history available." description="Select a track with bbox history returned by the backend." />
      ) : (
        <>
          <div className="rounded-md border border-border bg-black/70">
            <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} className="aspect-video w-full">
              <defs>
                <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="var(--color-border)" strokeWidth="1" opacity="0.4" />
                </pattern>
              </defs>
              <rect width={VIEW.w} height={VIEW.h} fill="url(#grid)" />
              <polyline points={path} fill="none" stroke={tone} strokeWidth="2.5" opacity="0.8" />
              {head && (
                <>
                  <circle cx={head.x} cy={head.y} r="8" fill={tone} opacity="0.25" />
                  <circle cx={head.x} cy={head.y} r="4" fill={tone} />
                  <rect
                    x={head.x - 28}
                    y={head.y - 20}
                    width="56"
                    height="36"
                    fill="none"
                    stroke={tone}
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                  />
                </>
              )}
            </svg>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <Button size="icon" variant="outline" aria-label={playing ? "Pause replay" : "Play replay"} onClick={() => setPlaying((p) => !p)}>
              {playing ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
            </Button>
            <Button size="icon" variant="ghost" aria-label="Restart replay" onClick={() => setFrame(0)}>
              <RotateCcw className="h-4 w-4" aria-hidden />
            </Button>
            <Slider
              value={[frame]}
              max={history.length - 1}
              step={1}
              onValueChange={([v]) => setFrame(v ?? 0)}
              aria-label="Replay timeline"
              className="flex-1"
            />
            <span className="font-mono text-[11px] text-muted-foreground">
              t={history[frame]?.timestamp.toFixed(1) ?? "0.0"}s
            </span>
          </div>
        </>
      )}
    </Panel>
  );
}
