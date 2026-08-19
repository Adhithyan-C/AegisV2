import json
import csv
import argparse

def export_to_csv(tracks_path, output_path):
    with open(tracks_path) as f:
        data = json.load(f)
    tracks = data["tracks"]

    with open(output_path, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["id", "class", "confidence", "first_seen", "last_seen", "flagged"])
        writer.writeheader()
        for t in tracks:
            writer.writerow(t)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    export_to_csv(args.input, args.output)
    print(f"Exported to {args.output}")