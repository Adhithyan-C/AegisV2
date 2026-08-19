// Canonical AEGIS data contract. Single source of truth — do not duplicate.

export type TrackClass = "Vehicle" | "Personnel" | "Unknown";
export type TrackStatus = "Active" | "Flagged" | "Completed";
export type JobStatus = "queued" | "processing" | "completed" | "failed";
export type Severity = "low" | "medium" | "high" | "critical";

export interface BBoxPoint {
  timestamp: number;
  x: number;
  y: number;
  w?: number;
  h?: number;
}

export interface Track {
  id: string;
  class: TrackClass;
  confidence: number;
  first_seen: string;
  last_seen: string;
  status: TrackStatus;
  zone?: string;
  bbox_history?: BBoxPoint[];
}

export interface TracksResponse {
  tracks: Track[];
}

export interface FlaggedEvent {
  id: string;
  timestamp: string;
  type: string;
  description: string;
  zone: string;
  severity: Severity;
}

export interface ConfidenceBucket {
  label: string;
  range: [number, number];
  count: number;
}

export interface ActivityPoint {
  time: string;
  vehicles: number;
  personnel: number;
  unknown: number;
}

export interface MissionSummary {
  job_id: string;
  total_detections: number;
  vehicles: number;
  personnel: number;
  unknown: number;
  flagged_events: number;
  duration: string;
  narrative: string;
  most_active_zone: string;
  peak_activity: string;
  movement_pattern: string;
  confidence_distribution: ConfidenceBucket[];
  activity_over_time: ActivityPoint[];
  events: FlaggedEvent[];
}

export interface HeatmapPoint {
  x: number;
  y: number;
  intensity: number;
}

export interface HeatmapResponse {
  width: number;
  height: number;
  points: HeatmapPoint[];
  zones?: { label: string; x: number; y: number }[];
}

export interface Job {
  job_id: string;
  status: JobStatus;
  progress: number;
  filename?: string;
  size?: number;
  error?: string;
  elapsed?: number;
}

export interface UploadResponse {
  job_id: string;
}
