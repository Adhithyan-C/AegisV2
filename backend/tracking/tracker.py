#RUN using: python tracker.py --source <input_video_path> --output <output_video_path>


import argparse
import cv2
import supervision as sv
from ultralytics import YOLO

class AegisTracker:
    def __init__(self, model_path="yolov8n.pt"):
        self.model = YOLO(model_path)

        self.tracker = sv.ByteTrack()

        self.box_annotator = sv.BoxAnnotator()
        self.label_annotator = sv.LabelAnnotator()

        self.tracks = {}

    def process_frame(self, frame, frame_number, fps):
        # Run YOLO
        result = self.model(frame, verbose=False)[0]

        # Convert YOLO detections to Supervision format
        detections = sv.Detections.from_ultralytics(result)

        detections = self.tracker.update_with_detections(detections)

        # Store information about each active track
        if detections.tracker_id is not None:
            for i, tracker_id in enumerate(detections.tracker_id):

                tracker_id = int(tracker_id)

                class_id = int(detections.class_id[i])
                class_name = self.model.names[class_id]
                confidence = float(detections.confidence[i])

                # Bounding box
                x1, y1, x2, y2 = detections.xyxy[i]

                # Bottom-center of bounding box
                x = int((x1 + x2) / 2)
                y = int(y2)

                # Create a new track
                if tracker_id not in self.tracks:
                    self.tracks[tracker_id] = {
                        "id": tracker_id,
                        "class": class_name,
                        "confidence_sum": 0.0,
                        "detection_count": 0,
                        "first_seen": frame_number,
                        "last_seen": frame_number,
                        "flagged": False,
                        "positions": []
                    }

                track = self.tracks[tracker_id]

                # Update track information
                track["last_seen"] = frame_number
                track["confidence_sum"] += confidence
                track["detection_count"] += 1

                track["positions"].append({
                    "frame": frame_number,
                    "timestamp": format_timestamp(frame_number / fps),
                    "x": x,
                    "y": y
                })

        # Create labels
        labels = []

        if detections.tracker_id is not None:
            for class_id, confidence, tracker_id in zip(
                detections.class_id,
                detections.confidence,
                detections.tracker_id,
            ):
                class_name = self.model.names[int(class_id)]

                labels.append(
                    f"ID {tracker_id} | "
                    f"{class_name} | "
                    f"{confidence:.2f}"
                )

        # Draw bounding boxes
        annotated = self.box_annotator.annotate(
            scene=frame.copy(),
            detections=detections,
        )

        # Draw labels
        annotated = self.label_annotator.annotate(
            scene=annotated,
            detections=detections,
            labels=labels,
        )

        return annotated

    def get_track_results(self):
        results = []

        for track in self.tracks.values():

            if track["detection_count"] > 0:
                average_confidence = (
                    track["confidence_sum"]
                    / track["detection_count"]
                )
            else:
                average_confidence = 0.0

            results.append({
                "id": track["id"],
                "class": track["class"],
                "confidence": round(average_confidence, 3),
                "first_seen": track["first_seen"],
                "last_seen": track["last_seen"],
                "flagged": track["flagged"],
                "positions": track["positions"]
            })

        return results

def format_timestamp(seconds):
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    seconds = seconds % 60

    return f"{hours:02d}:{minutes:02d}:{seconds:06.3f}"

def main():
    parser = argparse.ArgumentParser()
    source = "test_video.mp4"
    output = "tracked_output.mp4"

    # parser.add_argument(
    #     "--source",
    #     required=True,
    #     help="Path to input video",
    # )

    # parser.add_argument(
    #     "--output",
    #     required=True,
    #     help="Path to output video",
    # )

    parser.add_argument(
        "--model",
        default="yolov8n.pt",
        help="YOLO model path",
    )

    args = parser.parse_args()

    tracker = AegisTracker(args.model)

    cap = cv2.VideoCapture(source)

    if not cap.isOpened():
        raise RuntimeError(
            f"Could not open video: {source}"
        )

    fps = cap.get(cv2.CAP_PROP_FPS)

    if fps <= 0:
        fps = 30

    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    fourcc = cv2.VideoWriter_fourcc(*"mp4v")

    writer = cv2.VideoWriter(
        output,
        fourcc,
        fps,
        (width, height),
    )

    frame_number = 0

    while True:
        success, frame = cap.read()

        if not success:
            break

        frame_number += 1

        annotated = tracker.process_frame(frame, frame_number, fps)

        writer.write(annotated)

        cv2.imshow("Aegis Tracking", annotated)

        # Press Q to stop
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    writer.release()
    cv2.destroyAllWindows()

    tracks = tracker.get_track_results()

    print(f"Tracked objects: {len(tracks)}")

    for track in tracks:
        print(
            f"ID {track['id']} | "
            f"{track['class']} | "
            f"confidence={track['confidence']} | "
            f"positions={len(track['positions'])}"
        )

    print(f"Processed {frame_number} frames.")
    print(f"Output saved to: {output}")


if __name__ == "__main__":
    main()