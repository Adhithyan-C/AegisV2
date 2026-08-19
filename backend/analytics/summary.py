import json
import argparse


def generate_summary(tracks_path):
    with open(tracks_path) as f:
        data = json.load(f)

    tracks = data["tracks"]
    events = data.get("events", [])

    # --- Track-level counts ---
    counts = {}
    flagged = 0
    for t in tracks:
        counts[t["class"]] = counts.get(t["class"], 0) + 1
        if t["flagged"]:
            flagged += 1

    # --- Event-level counts ---
    event_counts = {}
    for e in events:
        event_counts[e["type"]] = event_counts.get(e["type"], 0) + 1

    # --- Build summary text ---
    summary_lines = []

    if "job_id" in data:
        summary_lines.append(f"Job ID: {data['job_id']}")
    if "video_duration" in data:
        summary_lines.append(f"Video duration: {data['video_duration']}")

    summary_lines.append("")
    summary_lines.append(f"Total tracks: {len(tracks)}")
    for cls, count in counts.items():
        summary_lines.append(f"  {cls.capitalize()}: {count}")
    summary_lines.append(f"Flagged tracks: {flagged}")

    if event_counts:
        summary_lines.append("")
        summary_lines.append("Event summary:")
        label_map = {
            "TRACK_CREATED": "New objects detected",
            "TRACK_LOST": "Tracks lost",
            "TRACK_REAPPEARED": "Tracks reacquired after loss",
            "FLAGGED": "Low-confidence flags raised",
            "ZONE_ENTRY": "Zone entries",
            "ZONE_EXIT": "Zone exits",
            "RESTRICTED_ZONE_BREACH": "Restricted zone breaches",
        }
        for event_type, count in event_counts.items():
            label = label_map.get(event_type, event_type)
            summary_lines.append(f"  {label}: {count}")

    return "\n".join(summary_lines)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    args = parser.parse_args()
    print(generate_summary(args.input))