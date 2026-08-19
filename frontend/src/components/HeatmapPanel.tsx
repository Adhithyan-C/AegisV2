import { useEffect, useRef, useState } from "react";
import { Flame, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { EmptyState, Panel } from "./Panel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMission } from "@/hooks/useMission";

export function HeatmapPanel() {
  const { heatmap } = useMission();
  const data = heatmap.data?.data;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = data.width;
    canvas.height = data.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const p of data.points) {
      const r = 26 + p.intensity * 34;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
      const hue = 140 - p.intensity * 140; // green -> red
      g.addColorStop(0, `hsla(${hue}, 85%, 55%, ${0.16 + p.intensity * 0.3})`);
      g.addColorStop(1, "hsla(0,0%,0%,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [data]);

  return (
    <Panel
      title="Track Activity / Heatmap"
      icon={<Flame className="h-4 w-4" />}
      actions={
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost" aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))}>
            <ZoomOut className="h-4 w-4" aria-hidden />
          </Button>
          <Button size="icon" variant="ghost" aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))}>
            <ZoomIn className="h-4 w-4" aria-hidden />
          </Button>
          <Button size="icon" variant="ghost" aria-label="Reset zoom" onClick={() => setZoom(1)}>
            <RotateCcw className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      }
    >
      {heatmap.isLoading ? (
        <Skeleton className="aspect-video w-full" />
      ) : !data || data.points.length === 0 ? (
        <EmptyState title="No activity data available." description="Heatmap intensity is generated from track centroids by the backend." />
      ) : (
        <>
          <div className="relative aspect-video w-full overflow-auto rounded-md border border-border bg-black/70">
            <div
              className="relative origin-top-left"
              style={{ transform: `scale(${zoom})`, width: data.width, height: data.height }}
            >
              <canvas ref={canvasRef} className="block h-full w-full" />
              {data.zones?.map((z) => (
                <span
                  key={z.label}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-sm border border-border bg-background/70 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                  style={{ left: z.x, top: z.y }}
                >
                  {z.label}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <span className="label-mono">Low</span>
            <div
              className="h-2 flex-1 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, hsl(140 85% 45%), hsl(70 85% 50%), hsl(35 90% 55%), hsl(0 85% 55%))",
              }}
            />
            <span className="label-mono">High</span>
          </div>
        </>
      )}
    </Panel>
  );
}
