/**
 * Mission endpoints. Falls back to the mock layer when the FastAPI backend
 * is unreachable, so the dashboard is always usable (mock mode).
 */
import { apiFetch, apiUrl, ApiError } from "./client";
import {
  mockHeatmap,
  mockJob,
  mockSummary,
  mockTracks,
  MOCK_JOB_ID,
} from "@/mock/missionData";
import type {
  HeatmapResponse,
  Job,
  MissionSummary,
  Track,
  TracksResponse,
  UploadResponse,
} from "@/types/mission";

export type DataSource = "live" | "mock";

export interface Sourced<T> {
  data: T;
  source: DataSource;
}

async function withFallback<T>(fn: () => Promise<T>, fallback: T): Promise<Sourced<T>> {
  try {
    return { data: await fn(), source: "live" };
  } catch (err) {
    if (err instanceof ApiError) return { data: fallback, source: "mock" };
    throw err;
  }
}

export const missionsApi = {
  mockJobId: MOCK_JOB_ID,

  async health(): Promise<boolean> {
    try {
      await apiFetch("/api/health", { timeoutMs: 3000 });
      return true;
    } catch {
      return false;
    }
  },

  /** POST /api/upload (multipart: file) */
  async upload(file: File, onProgress?: (pct: number) => void): Promise<UploadResponse> {
    const form = new FormData();
    form.append("file", file);

    return new Promise<UploadResponse>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", apiUrl("/api/upload"));
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText) as UploadResponse);
          } catch {
            reject(new ApiError("Malformed upload response", xhr.status));
          }
        } else {
          reject(new ApiError(`Upload failed (${xhr.status})`, xhr.status));
        }
      };
      xhr.onerror = () => reject(new ApiError("Unable to connect to AEGIS backend."));
      xhr.ontimeout = () => reject(new ApiError("Upload timed out."));
      xhr.timeout = 120_000;
      xhr.send(form);
    });
  },

  /** GET /api/jobs/{job_id} */
  job(jobId: string) {
    return apiFetch<Job>(`/api/jobs/${jobId}`);
  },

  jobWithFallback(jobId: string) {
    return withFallback(() => this.job(jobId), { ...mockJob, job_id: jobId });
  },

  /** GET /api/jobs/{job_id}/tracks */
  async tracks(jobId: string): Promise<Sourced<Track[]>> {
    return withFallback(async () => {
      const res = await apiFetch<TracksResponse>(`/api/jobs/${jobId}/tracks`);
      return res.tracks ?? [];
    }, mockTracks);
  },

  /** GET /api/jobs/{job_id}/summary */
  summary(jobId: string): Promise<Sourced<MissionSummary>> {
    return withFallback(
      () => apiFetch<MissionSummary>(`/api/jobs/${jobId}/summary`),
      { ...mockSummary, job_id: jobId },
    );
  },

  /** GET /api/jobs/{job_id}/heatmap */
  heatmap(jobId: string): Promise<Sourced<HeatmapResponse>> {
    return withFallback(() => apiFetch<HeatmapResponse>(`/api/jobs/${jobId}/heatmap`), mockHeatmap);
  },

  /** GET /api/jobs/{job_id}/video */
  videoUrl(jobId: string) {
    return apiUrl(`/api/jobs/${jobId}/video`);
  },

  /** GET /api/jobs/{job_id}/export/{csv|pdf} */
  exportUrl(jobId: string, kind: "csv" | "pdf") {
    return apiUrl(`/api/jobs/${jobId}/export/${kind}`);
  },
};
