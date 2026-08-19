import argparse
import cv2
from ultralytics import YOLO


def detect_video(source, output):
    model = YOLO("../models/best.pt")

    cap = cv2.VideoCapture(source)

    if not cap.isOpened():
        raise RuntimeError(f"Could not open video: {source}")

    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)

    if fps <= 0:
        fps = 30

    writer = cv2.VideoWriter(
        output,
        cv2.VideoWriter_fourcc(*"mp4v"),
        fps,
        (width, height)
    )

    while True:
        ret, frame = cap.read()

        if not ret:
            break

        results = model(frame, verbose=False)

        for result in results:
            for box in result.boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                confidence = float(box.conf[0])
                class_id = int(box.cls[0])
                class_name = model.names[class_id]

                if class_name == "soldier":
                    category = "personnel"
                else:
                    category = "vehicle"

                print(
                    f"class={class_name} "
                    f"category={category} "
                    f"confidence={confidence:.2f} "
                    f"bbox=({x1},{y1},{x2},{y2})"
                )

        annotated = results[0].plot()
        writer.write(annotated)

    cap.release()
    writer.release()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--source",
        required=True
    )

    parser.add_argument(
        "--output",
        required=True
    )

    args = parser.parse_args()

    detect_video(args.source, args.output)