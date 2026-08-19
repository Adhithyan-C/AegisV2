import { useEffect, useRef, useState } from "react";
import { missionsApi } from "@/api/missions";
import type { Job } from "@/types/mission";

/**
 * Polls GET /api/jobs/{job_id} until the job completes or fails.
 * In mock mode (backend unreachable) it simulates progress so the
 * demo journey still works end to end.
 */
export function useJobPolling(jobId: string | null, enabled: boolean) {
  const [job, setJob] = useState<Job | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mockProgress = useRef(0);

  useEffect(() => {
    if (!jobId || !enabled) return;
    let cancelled = false;
    mockProgress.current = 0;

    const tick = async () => {
      try {
        const next = await missionsApi.job(jobId);
        if (cancelled) return;
        setJob(next);
        setError(next.status === "failed" ? "Mission processing failed." : null);
      } catch {
        // Backend unavailable -> simulated mock progression.
        if (cancelled) return;
        mockProgress.current = Math.min(100, mockProgress.current + 12);
        const pct = mockProgress.current;
        setJob({
          job_id: jobId,
          status: pct >= 100 ? "completed" : pct === 0 ? "queued" : "processing",
          progress: pct,
        });
      }
    };

    void tick();
    const id = setInterval(() => {
      void tick();
    }, 1500);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [jobId, enabled]);

  useEffect(() => {
    if (job?.status === "completed" || job?.status === "failed") {
      // polling stops naturally via `enabled` toggled by the consumer
    }
  }, [job?.status]);

  return { job, error, setJob };
}
