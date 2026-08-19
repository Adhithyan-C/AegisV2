import { useCallback, useRef, useState } from "react";
import { AlertTriangle, FileVideo, Play, RotateCw, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { Panel, StatusDot } from "./Panel";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { missionsApi } from "@/api/missions";
import { useJobPolling } from "@/hooks/useJobPolling";
import { useMission } from "@/hooks/useMission";
import { cn } from "@/lib/utils";
import type { JobStatus } from "@/types/mission";

const ACCEPTED = [".mp4", ".avi", ".mov"];
const MAX_BYTES = 2 * 1024 * 1024 * 1024;

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const statusTone: Record<JobStatus, "ops" | "warn" | "critical" | "info"> = {
  queued: "info",
  processing: "warn",
  completed: "ops",
  failed: "critical",
};

export function UploadPanel() {
  const { setJobId, refetchAll } = useMission();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { job } = useJobPolling(activeJobId, Boolean(activeJobId));
  const done = job?.status === "completed";

  const validate = useCallback((f: File) => {
    const ok = ACCEPTED.some((ext) => f.name.toLowerCase().endsWith(ext));
    if (!ok) {
      toast.error("Unsupported format", { description: "Use MP4, AVI or MOV footage." });
      return false;
    }
    if (f.size > MAX_BYTES) {
      toast.error("File too large", { description: "Maximum mission footage size is 2 GB." });
      return false;
    }
    return true;
  }, []);

  const pick = (f: File | undefined) => {
    if (!f || !validate(f)) return;
    setFile(f);
    setError(null);
    setActiveJobId(null);
    setUploadPct(0);
  };

  const process = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const res = await missionsApi.upload(file, setUploadPct);
      setActiveJobId(res.job_id);
      setJobId(res.job_id);
      toast.success("Mission queued", { description: `Job ${res.job_id}` });
    } catch {
      const demoId = `MOCK-${Date.now().toString().slice(-6)}`;
      setActiveJobId(demoId);
      setJobId(demoId);
      setError("-");
      toast.warning("Backend unreachable", {
        description: "-",
      });
    } finally {
      setUploading(false);
      setUploadPct(100);
    }
  };

  if (done && activeJobId) {
    // Refresh results once the job completes.
    queueMicrotask(refetchAll);
  }

  return (
    <Panel
      title="Upload Mission Video"
      icon={<UploadCloud className="h-4 w-4" />}
      actions={<span className="label-mono">MP4 · AVI · MOV</span>}
    >
      <p className="text-xs text-muted-foreground">
        Upload battlefield/UAV surveillance footage for AI-powered detection and tracking.
      </p>

      <div
        role="button"
        tabIndex={0}
        aria-label="Drag and drop mission footage or choose a file"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          pick(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed px-4 py-7 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          dragging ? "border-primary bg-primary/5" : "border-border bg-surface/60 hover:border-primary/50",
        )}
      >
        <UploadCloud className="h-6 w-6 text-primary" aria-hidden />
        <p className="text-sm font-medium">Drag &amp; drop footage here</p>
        <p className="text-xs text-muted-foreground">or</p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          Choose File
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(",")}
          className="sr-only"
          onChange={(e) => pick(e.target.files?.[0])}
        />
      </div>

      {file && (
        <div className="mt-3 rounded-md border border-border bg-panel/60 p-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <FileVideo className="h-4 w-4 text-info" aria-hidden />
              <div>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="font-mono text-[11px] text-muted-foreground">{formatSize(file.size)}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Remove selected file"
              onClick={() => {
                setFile(null);
                setActiveJobId(null);
              }}
            >
              <X className="h-4 w-4" aria-hidden />
            </Button>
          </div>

          {(uploading || uploadPct > 0) && !activeJobId && (
            <div className="mt-3">
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>Uploading</span>
                <span className="font-mono">{uploadPct}%</span>
              </div>
              <Progress value={uploadPct} className="mt-1 h-1.5" />
            </div>
          )}

          {activeJobId && job && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <StatusDot tone={statusTone[job.status]} />
                  <span className="font-mono uppercase tracking-widest">{job.status}</span>
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  JOB {job.job_id}
                </span>
              </div>
              <Progress value={job.progress} className="h-1.5" />
              <p className="text-right font-mono text-[11px] text-muted-foreground">
                {job.progress}%
              </p>
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" onClick={() => void process()} disabled={uploading} className="gap-2">
              <Play className="h-3.5 w-3.5" aria-hidden />
              {uploading ? "Uploading…" : "Process Mission"}
            </Button>
            {(job?.status === "failed" || error) && (
              <Button size="sm" variant="outline" onClick={() => void process()} className="gap-2">
                <RotateCw className="h-3.5 w-3.5" aria-hidden />
                Retry
              </Button>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="mt-3 flex items-center gap-2 rounded-md border border-warn/30 bg-warn/10 px-3 py-2 text-xs text-warn">
          <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
          {error}
        </p>
      )}
    </Panel>
  );
}
