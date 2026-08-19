import json
import argparse
import numpy as np
import cv2

def generate_heatmap(tracks_path, output_path, frame_width=1280, frame_height=720):
    with open(tracks_path) as f:
        data = json.load(f)

    heat = np.zeros((frame_height, frame_width), dtype=np.float32)
    for track in data["tracks"]:
        for pos in track["positions"]:
            x, y = int(pos["x"]), int(pos["y"])
            if 0 <= x < frame_width and 0 <= y < frame_height:
                cv2.circle(heat, (x, y), 15, 1, -1)

    heat = cv2.GaussianBlur(heat, (0, 0), sigmaX=20, sigmaY=20)
    heat_norm = cv2.normalize(heat, None, 0, 255, cv2.NORM_MINMAX).astype("uint8")
    heat_color = cv2.applyColorMap(heat_norm, cv2.COLORMAP_JET)
    cv2.imwrite(output_path, heat_color)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    generate_heatmap(args.input, args.output)