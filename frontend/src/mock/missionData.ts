/**
 * DEMO / MOCK DATA ONLY.
 * Used when the AEGIS FastAPI backend is unreachable (mock mode).
 * All values here are fabricated for demonstration purposes.
 */
import type {
  FlaggedEvent,
  HeatmapResponse,
  Job,
  MissionSummary,
  Track,
} from "@/types/mission";

export const MOCK_JOB_ID = "DEMO-MISSION-001";

export const mockJob: Job = {
  job_id: MOCK_JOB_ID,
  status: "completed",
  progress: 100,
  filename: "uav_recon_sector7.mp4",
  size: 148_233_216,
};

export const mockEvents: FlaggedEvent[] = [
  {
    id: "EVT-001",
    timestamp: "00:02:15",
    type: "Unknown Vehicle Detected",
    description: "Low-confidence object detected in restricted zone",
    zone: "Zone 4",
    severity: "critical",
  },
  {
    id: "EVT-002",
    timestamp: "00:05:42",
    type: "Unusual Movement Pattern",
    description: "Rapid movement detected by personnel group",
    zone: "Zone 2",
    severity: "high",
  },
  {
    id: "EVT-003",
    timestamp: "00:09:18",
    type: "Vehicle Without Escort",
    description: "Single vehicle moving in high-threat area",
    zone: "Zone 3",
    severity: "medium",
  },
  {
    id: "EVT-004",
    timestamp: "00:11:03",
    type: "Perimeter Loitering",
    description: "Personnel stationary near sector boundary for 4m 12s",
    zone: "Zone 1",
    severity: "low",
  },
];

function history(seed: number, count = 40) {
  return Array.from({ length: count }, (_, i) => ({
    timestamp: +(i * 0.4).toFixed(2),
    x: Math.round(80 + i * 9 + Math.sin(i / 3 + seed) * 40),
    y: Math.round(120 + i * 6 + Math.cos(i / 4 + seed) * 55),
  }));
}

export const mockTracks: Track[] = [
  {
    id: "TRK-1021",
    class: "Vehicle",
    confidence: 0.92,
    first_seen: "00:00:12",
    last_seen: "00:14:31",
    status: "Active",
    zone: "Zone 3",
    bbox_history: history(1),
  },
  {
    id: "TRK-1022",
    class: "Vehicle",
    confidence: 0.88,
    first_seen: "00:00:15",
    last_seen: "00:14:29",
    status: "Active",
    zone: "Zone 3",
    bbox_history: history(2),
  },
  {
    id: "TRK-2056",
    class: "Personnel",
    confidence: 0.91,
    first_seen: "00:00:18",
    last_seen: "00:14:30",
    status: "Active",
    zone: "Zone 2",
    bbox_history: history(3),
  },
  {
    id: "TRK-2057",
    class: "Personnel",
    confidence: 0.84,
    first_seen: "00:00:20",
    last_seen: "00:14:28",
    status: "Active",
    zone: "Zone 2",
    bbox_history: history(4),
  },
  {
    id: "TRK-3091",
    class: "Unknown",
    confidence: 0.76,
    first_seen: "00:00:45",
    last_seen: "00:13:02",
    status: "Flagged",
    zone: "Zone 4",
    bbox_history: history(5),
  },
  {
    id: "TRK-1023",
    class: "Vehicle",
    confidence: 0.79,
    first_seen: "00:01:02",
    last_seen: "00:08:44",
    status: "Completed",
    zone: "Zone 1",
    bbox_history: history(6),
  },
  {
    id: "TRK-2058",
    class: "Personnel",
    confidence: 0.67,
    first_seen: "00:01:31",
    last_seen: "00:12:10",
    status: "Active",
    zone: "Zone 3",
    bbox_history: history(7),
  },
  {
    id: "TRK-3092",
    class: "Unknown",
    confidence: 0.41,
    first_seen: "00:02:14",
    last_seen: "00:02:58",
    status: "Flagged",
    zone: "Zone 4",
    bbox_history: history(8, 20),
  },
  {
    id: "TRK-1024",
    class: "Vehicle",
    confidence: 0.95,
    first_seen: "00:03:05",
    last_seen: "00:14:32",
    status: "Active",
    zone: "Zone 2",
    bbox_history: history(9),
  },
  {
    id: "TRK-2059",
    class: "Personnel",
    confidence: 0.72,
    first_seen: "00:03:44",
    last_seen: "00:10:19",
    status: "Completed",
    zone: "Zone 1",
    bbox_history: history(10),
  },
  {
    id: "TRK-2060",
    class: "Personnel",
    confidence: 0.88,
    first_seen: "00:04:21",
    last_seen: "00:14:12",
    status: "Active",
    zone: "Zone 2",
    bbox_history: history(11),
  },
  {
    id: "TRK-3093",
    class: "Unknown",
    confidence: 0.23,
    first_seen: "00:06:02",
    last_seen: "00:06:40",
    status: "Flagged",
    zone: "Zone 4",
    bbox_history: history(12, 16),
  },
  {
    id: "TRK-1025",
    class: "Vehicle",
    confidence: 0.86,
    first_seen: "00:07:15",
    last_seen: "00:14:30",
    status: "Active",
    zone: "Zone 3",
    bbox_history: history(13),
  },
  {
    id: "TRK-2061",
    class: "Personnel",
    confidence: 0.59,
    first_seen: "00:08:48",
    last_seen: "00:13:55",
    status: "Active",
    zone: "Zone 1",
    bbox_history: history(14),
  },
];

export const mockSummary: MissionSummary = {
  job_id: MOCK_JOB_ID,
  total_detections: 1248,
  vehicles: 425,
  personnel: 689,
  unknown: 134,
  flagged_events: 37,
  duration: "00:14:32",
  narrative:
    "In the analyzed footage, 425 vehicles and 689 personnel were detected. 37 unusual events were flagged based on confidence thresholds and unusual movement patterns.",
  most_active_zone: "Zone 3",
  peak_activity: "00:04:20 – 00:09:15",
  movement_pattern: "NW → SE",
  confidence_distribution: [
    { label: "High", range: [0.75, 1], count: 742 },
    { label: "Medium", range: [0.5, 0.75], count: 361 },
    { label: "Low", range: [0.25, 0.5], count: 108 },
    { label: "Very Low", range: [0, 0.25], count: 37 },
  ],
  activity_over_time: Array.from({ length: 15 }, (_, i) => ({
    time: `00:${String(i).padStart(2, "0")}`,
    vehicles: Math.round(18 + Math.sin(i / 2) * 10 + i * 0.9),
    personnel: Math.round(30 + Math.cos(i / 3) * 14 + i * 1.2),
    unknown: Math.round(4 + Math.abs(Math.sin(i / 1.7)) * 6),
  })),
  events: mockEvents,
};

export const mockHeatmap: HeatmapResponse = {
  width: 960,
  height: 540,
  points: Array.from({ length: 420 }, (_, i) => {
    const cluster = i % 4;
    const centers = [
      [250, 160],
      [640, 200],
      [430, 380],
      [780, 420],
    ][cluster] as [number, number];
    const spread = 70 + cluster * 25;
    return {
      x: Math.round(centers[0] + (Math.sin(i * 12.9898) * 43758.5453) % spread),
      y: Math.round(centers[1] + (Math.cos(i * 78.233) * 12345.6789) % spread),
      intensity: Math.min(1, 0.25 + Math.abs(Math.sin(i * 3.1)) * 0.75),
    };
  }),
  zones: [
    { label: "Zone 1", x: 250, y: 160 },
    { label: "Zone 2", x: 640, y: 200 },
    { label: "Zone 3", x: 430, y: 380 },
    { label: "Zone 4", x: 780, y: 420 },
  ],
};
