import json
import argparse

def generate_summary(tracks_path):
    with open(tracks_path) as f:
        data = json.load(f)
    tracks = data["tracks"]

    counts = {}
    flagged = 0
    for t in tracks:
        counts[t["class"]] = counts.get(t["class"], 0) + 1
        if t["flagged"]:
            flagged += 1

    summary_lines = [f"Total tracks: {len(tracks)}"]
    for cls, count in counts.items():
        summary_lines.append(f"{cls.capitalize()}: {count}")
    summary_lines.append(f"Flagged: {flagged}")

    return "\n".join(summary_lines)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    args = parser.parse_args()
    print(generate_summary(args.input))