# Q-FORCE Command

Build Q-FORCE — AI Battlefield Object Detection & Tracking Dashboard

Build a production-quality frontend web application called Q-FORCE, an AI-powered battlefield imagery analysis dashboard.

This is the frontend for a FastAPI backend that will perform YOLOv8 object detection + ByteTrack tracking. The frontend must be designed so the backend can be connected later without redesigning the UI.

1. Overall Design

Create a modern military/intelligence operations dashboard inspired by the attached Q-FORCE reference image.

Visual direction:

Dark navy/black command-center interface

Subtle military/defence aesthetic

Professional, not game-like

Green as the primary operational/accent color

Amber/orange for warnings

Red for critical/flagged events

Blue for informational states

Glassy/translucent panels only where appropriate

Thin borders

Minimal shadows

High information density but still clean

Responsive desktop-first design

Use Lucide icons or another clean icon library

Avoid excessive gradients, glowing neon effects, or futuristic gimmicks

The UI should look suitable for a defence-tech hackathon / government operations dashboard.

Use the name:

Q-FORCE
AI Battlefield Intelligence

Subtitle:
"AI-Powered Battlefield Object Detection & Tracking"

2. Application Layout

Create a persistent left sidebar and a main dashboard.

Sidebar

Top:

Q-FORCE logo/emblem

Q-FORCE

"Battlefield Intelligence"

Navigation:

Dashboard

Upload & Process

Live Processing

Tracks & Events

Analytics

Heatmap

Exports

Settings

Bottom section:

SYSTEM STATUS

Model: YOLOv8n (Custom)

Tracker: ByteTrack

API Server: Online

Database: Connected

Each should have a small green operational indicator.

Footer:
"Q-FORCE v1.0.0"
"Secure. Accurate. Swift."

3. Top Header

Main header:

Mission Dashboard

Subtitle:
"AI-Powered Battlefield Object Detection & Tracking"

Right side:

Secure Connection indicator

Notification icon

User/profile menu

Optional dark-mode toggle

4. Mission Upload Section

Create a prominent but compact upload area near the top.

Title:
"Upload Mission Video"

Description:
"Upload battlefield/UAV surveillance footage for AI-powered detection and tracking."

Supported formats:
MP4, AVI, MOV

Controls:

Choose File

Drag & Drop support

Process Mission button

After upload:
Show:

filename

file size

upload progress

processing status

job ID

Processing states:

QUEUED
PROCESSING
COMPLETED
FAILED

Show an appropriate progress indicator.

IMPORTANT:
The frontend must not perform AI inference itself.

It must send the video to the backend and poll the backend for processing status.

5. Backend Integration Architecture

Prepare the frontend for a FastAPI backend.

Use an environment variable:

VITE_API_BASE_URL

Default development value:

http://localhost:8000

Create a clean API service layer.

Expected API:

POST /api/upload

Multipart form field:
file

Expected response:

{
"job_id": "abc123"
}

Then poll:

GET /api/jobs/{job_id}

Example:

{
"job_id": "abc123",
"status": "processing",
"progress": 42
}

When status becomes completed, call:

GET /api/jobs/{job_id}/tracks

GET /api/jobs/{job_id}/summary

GET /api/jobs/{job_id}/heatmap

GET /api/jobs/{job_id}/video

GET /api/jobs/{job_id}/export/csv

GET /api/jobs/{job_id}/export/pdf

Keep ALL API calls inside a dedicated API/service layer so the backend URL and endpoints can easily be changed later.

Add proper loading, error and empty states.

6. KPI Cards

Create five dashboard metric cards:

TOTAL DETECTIONS
Example: 1,248

VEHICLES
Example: 425

PERSONNEL
Example: 689

FLAGGED EVENTS
Example: 37

MISSION DURATION
Example: 00:14:32

These must be dynamically populated from backend summary data.

Do NOT hardcode these once backend data is available.

7. Mission Video Panel

Large central panel:

MISSION VIDEO & DETECTIONS

Display the processed annotated video returned by:

GET /api/jobs/{job_id}/video

Use a proper HTML5 video player.

Controls:

Play/pause

Timeline

Volume

Fullscreen

Playback speed

Show a small status badge:
"PROCESSED"

When the backend is still processing, show:

Processing state

Progress

Job ID

Estimated/elapsed state if available

When no video exists:
Show an attractive empty state telling the user to upload mission footage.

8. Detection Overlay

The backend's processed video may already contain YOLO bounding boxes.

Design the video section so it can later support frontend overlays if required.

Each detection should conceptually support:

id
class
confidence
bbox
timestamp

Classes:

Vehicle
Personnel
Unknown

Use:

Green = Vehicle

Amber = Personnel

Red = Unknown/flagged

Do NOT build fake computer vision logic in the frontend.

9. Mission Summary

Right of the video, create:

MISSION SUMMARY

The backend will provide generated mission intelligence.

Example:

"In the analyzed footage, 425 vehicles and 689 personnel were detected. 37 unusual events were flagged based on confidence thresholds and unusual movement patterns."

Under it show three small insight cards:

MOST ACTIVE ZONE
Zone 3

PEAK ACTIVITY
00:04:20 – 00:09:15

MOVEMENT PATTERN
NW → SE

These values must be backend-driven.

10. Tracks Table

Create a large:

RECENT TRACKS

table.

Columns:

ID
CLASS
CONFIDENCE
FIRST SEEN
LAST SEEN
STATUS
ZONE

Example:

TRK-1021 | Vehicle | 92% | 00:00:12 | 00:14:31 | Active | Zone 3

TRK-1022 | Vehicle | 88% | 00:00:15 | 00:14:29 | Active | Zone 3

TRK-2056 | Personnel | 91% | 00:00:18 | 00:14:30 | Active | Zone 2

TRK-2057 | Personnel | 84% | 00:00:20 | 00:14:28 | Active | Zone 2

TRK-3091 | Unknown | 76% | 00:00:45 | 00:13:02 | Flagged | Zone 4

Features:

Search

Filter by class

Filter by status

Sort columns

Pagination

Responsive table

Empty state

Loading skeleton

Expected backend response:

{
"tracks": [
{
"id": "TRK-1021",
"class": "Vehicle",
"confidence": 0.92,
"first_seen": "00:00:12",
"last_seen": "00:14:31",
"status": "Active",
"zone": "Zone 3"
}
]
}

Do not assume a fixed number of tracks.

11. Flagged Events

Create:

TOP FLAGGED EVENTS

Each event should show:

timestamp

event type

short description

zone

severity

Example events:

00:02:15
Unknown Vehicle Detected
Low-confidence object detected in restricted zone
Zone 4

00:05:42
Unusual Movement Pattern
Rapid movement detected by personnel group
Zone 2

00:09:18
Vehicle Without Escort
Single vehicle moving in high-threat area
Zone 3

Use visually clear severity badges.

12. Analytics

Create a compact analytics section.

Show:

Detection distribution:

Vehicles

Personnel

Unknown

Confidence distribution:

High: 0.75–1.00

Medium: 0.50–0.75

Low: 0.25–0.50

Very Low: 0.00–0.25

Show a clean donut/pie visualization for confidence distribution.

Show activity over time for:

Vehicles

Personnel

Unknown

Use a clean line chart.

Charts must consume backend data when available.

13. Heatmap

Create a dedicated:

TRACK ACTIVITY / HEATMAP

section.

The backend/P4 will eventually provide centroid/track activity data.

Design the frontend to accept a heatmap payload without changing the UI.

Potential payload:

{
"points": [
{
"x": 420,
"y": 180,
"intensity": 0.82
}
]
}

Display activity intensity visually.

Include:

Low → High legend

Zone labels

Zoom/reset controls if practical

Do not invent geographic maps. This is a video-frame activity heatmap.

14. Track Replay

Include a section or control for:

TRACK REPLAY

The backend will provide bbox history for each track.

Expected conceptual payload:

{
"track_id": "TRK-1021",
"class": "Vehicle",
"history": [
{"timestamp": 1.2, "x": 120, "y": 180},
{"timestamp": 1.5, "x": 130, "y": 184}
]
}

Allow the user to:

Select track ID

Play track movement

Scrub timeline

Highlight selected track

Display direction/path

Build the UI/API contract now even if the actual replay implementation initially uses mock data.

15. Export Section

Create:

MISSION EXPORTS

Buttons:

Download Track CSV
Download Mission PDF

Use:

GET /api/jobs/{job_id}/export/csv

GET /api/jobs/{job_id}/export/pdf

The frontend should simply trigger the backend download.

16. Mock Mode

VERY IMPORTANT.

Until the FastAPI backend is available, the dashboard must still be usable.

Create a clearly separated mock-data layer.

Use mock data for:

KPI cards

tracks

mission summary

flagged events

analytics

heatmap

When the backend becomes available, switch automatically to real API data.

Do NOT mix mock data throughout UI components.

Create something like:

src/
api/
components/
pages/
hooks/
mock/
types/

17. Data Contract

Use this track structure throughout the frontend:

{
id: string,
class: "Vehicle" | "Personnel" | "Unknown",
confidence: number,
first_seen: string,
last_seen: string,
status: "Active" | "Flagged" | "Completed",
zone?: string,
bbox_history?: array
}

Use TypeScript interfaces/types if TypeScript is used.

Do not duplicate different versions of the same track object.

18. UX Requirements

Make it feel like a real operational application.

Include:

Skeleton loaders

Toast notifications

Error states

Empty states

Upload validation

Processing state

API failure handling

Retry processing/status button

Responsive layout

Accessible buttons

Keyboard-friendly controls

Never leave a blank screen when an API request fails.

Show useful messages such as:

"Unable to connect to Q-FORCE backend."

"Mission processing failed."

"No tracks detected."

"No flagged events found."

19. Important Technical Constraints

Frontend only.

Do NOT implement:

YOLO

ByteTrack

computer vision inference

model training

backend processing

SQLite

Those belong to the backend team.

The frontend's responsibility is:

UPLOAD
→ API REQUEST
→ JOB STATUS
→ DISPLAY RESULTS
→ VISUALIZE TRACKS
→ DISPLAY EVENTS
→ EXPORT RESULTS

20. Code Quality

Use reusable components.

Suggested structure:

src/
components/
Sidebar
Header
MetricCard
UploadPanel
MissionVideo
MissionSummary
TracksTable
FlaggedEvents
Analytics
Heatmap
TrackReplay
ExportPanel

pages/
Dashboard

api/
client
missions

mock/
missionData

hooks/
useMission
useJobPolling

types/
mission

Keep components modular and easy for another developer to modify.

21. Demo Data

Initially populate the dashboard with realistic demo data:

Total detections: 1248
Vehicles: 425
Personnel: 689
Flagged events: 37
Mission duration: 00:14:32

Use the sample tracks and events described above.

Make it obvious in the code that this is DEMO/MOCK data.

22. Final Goal

The finished application should look like a polished defence-tech command dashboard, not a generic admin dashboard.

The most important user journey is:

User opens Q-FORCE.

User uploads a UAV/surveillance video.

User clicks Process Mission.

Frontend receives job_id.

Frontend displays processing progress.

Frontend polls the FastAPI backend.

Processing completes.

Annotated video appears.

Detection KPIs populate.

Track table populates.

Flagged events appear.

Mission summary appears.

Heatmap appears.

User can inspect tracks.

User can download CSV/PDF reports.

Build the complete frontend now with mock data + clean API integration points.

Do NOT create a static screenshot. Build a real interactive web application.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/806978fb-976a-4745-b596-10babeff2dc4).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
