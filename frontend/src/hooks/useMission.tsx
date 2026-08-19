import { useQuery } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { missionsApi } from "@/api/missions";
import { MOCK_JOB_ID } from "@/mock/missionData";
import type { HeatmapResponse, MissionSummary, Track } from "@/types/mission";

interface MissionContextValue {
  jobId: string;
  setJobId: (id: string) => void;
  isDemoJob: boolean;
  summary: ReturnType<typeof useSummaryQuery>;
  tracks: ReturnType<typeof useTracksQuery>;
  heatmap: ReturnType<typeof useHeatmapQuery>;
  backendOnline: boolean;
  refetchAll: () => void;
}

function useSummaryQuery(jobId: string) {
  return useQuery({
    queryKey: ["summary", jobId],
    queryFn: () => missionsApi.summary(jobId),
    staleTime: 30_000,
  });
}

function useTracksQuery(jobId: string) {
  return useQuery({
    queryKey: ["tracks", jobId],
    queryFn: () => missionsApi.tracks(jobId),
    staleTime: 30_000,
  });
}

function useHeatmapQuery(jobId: string) {
  return useQuery({
    queryKey: ["heatmap", jobId],
    queryFn: () => missionsApi.heatmap(jobId),
    staleTime: 30_000,
  });
}

const MissionContext = createContext<MissionContextValue | null>(null);

const createFallbackQuery = () => ({
  data: undefined,
  error: null,
  isError: false,
  isLoading: false,
  isPending: false,
  isFetching: false,
  refetch: async () => undefined,
}) as any;

const fallbackContext: MissionContextValue = {
  jobId: MOCK_JOB_ID,
  setJobId: () => undefined,
  isDemoJob: true,
  summary: createFallbackQuery(),
  tracks: createFallbackQuery(),
  heatmap: createFallbackQuery(),
  backendOnline: false,
  refetchAll: () => undefined,
};

export function MissionProvider({ children }: { children: ReactNode }) {
  const [jobId, setJobId] = useState<string>(MOCK_JOB_ID);

  const summary = useSummaryQuery(jobId);
  const tracks = useTracksQuery(jobId);
  const heatmap = useHeatmapQuery(jobId);

  const backendOnline =
    summary.data?.source === "live" || tracks.data?.source === "live";

  const refetchAll = useCallback(() => {
    void summary.refetch();
    void tracks.refetch();
    void heatmap.refetch();
  }, [summary, tracks, heatmap]);

  const value = useMemo<MissionContextValue>(
    () => ({
      jobId,
      setJobId,
      isDemoJob: jobId === MOCK_JOB_ID,
      summary,
      tracks,
      heatmap,
      backendOnline,
      refetchAll,
    }),
    [jobId, summary, tracks, heatmap, backendOnline, refetchAll],
  );

  return <MissionContext.Provider value={value}>{children}</MissionContext.Provider>;
}

export function useMission() {
  const ctx = useContext(MissionContext);
  return ctx ?? fallbackContext;
}

export type { MissionSummary, Track, HeatmapResponse };
