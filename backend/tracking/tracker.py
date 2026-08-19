#RUN using: python tracker.py --source <input_video_path> --output <output_video_path>


import argparse
import cv2
import supervision as sv
import numpy as np
from ultralytics import YOLO

class AegisTracker:
    def __init__(self):
        self.tracker = sv.ByteTrack()

        self.box_annotator = sv.BoxAnnotator(
            thickness = 3
        )
        self.label_annotator = sv.LabelAnnotator(
            text_scale = 1.0,
            text_thickness = 2,
            text_padding = 8
        )

        self.tracks = {}
        self.events = []
        self.active_track_ids = set()

        self.lost_track_buffer = 30
        self.lost_tracks = {}

        self.confidence_threshold = 0.4

        self.zone_status = {}

        self.CLASS_NAMES = {
            0: "vehicle",
            1: "personnel",
            2: "unknown"
        }

    def process_detections(self, frame, p1_detections, frame_number, fps, zone):
        current_track_ids = set()

        if p1_detections:
            xyxy = np.array(
                [d["bbox"] for d in p1_detections],
                dtype=np.float32
            )

            confidence = np.array(
                [d["confidence"] for d in p1_detections],
                dtype=np.float32
            )

            class_id = np.array(
                [d["class_id"] for d in p1_detections],
                dtype=int
            )

            detections = sv.Detections(
                xyxy=xyxy,
                confidence=confidence,
                class_id=class_id
            )

        else:
            detections = sv.Detections.empty()

        detections = self.tracker.update_with_detections(
            detections
        )

        # Store information about each active track
        if detections.tracker_id is not None:
            for i, tracker_id in enumerate(detections.tracker_id):

                tracker_id = int(tracker_id)

                current_track_ids.add(tracker_id)

                class_id = int(detections.class_id[i])
                class_name = self.CLASS_NAMES.get(class_id, "unknown")
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
                        "first_seen": format_timestamp(frame_number / fps),
                        "last_seen": format_timestamp(frame_number / fps),
                        "flagged": False,
                        "positions": []
                    }

                    self.events.append({
                        "track_id": tracker_id,
                        "type": "TRACK_CREATED",
                        "timestamp": format_timestamp(frame_number / fps),
                        "reason": None
                    })

                track = self.tracks[tracker_id]

                # Update track information
                track["last_seen"] = format_timestamp(frame_number / fps)
                track["confidence_sum"] += confidence
                track["detection_count"] += 1

                track["positions"].append({
                    "frame": frame_number,
                    "timestamp": format_timestamp(frame_number / fps),
                    "x": x,
                    "y": y
                })

                if confidence < self.confidence_threshold:
                    if not track["flagged"]:
                        track["flagged"] = True
                        self.events.append({
                            "track_id": tracker_id,
                            "type": "FLAGGED",
                            "timestamp": format_timestamp(frame_number / fps),
                            "reason": "low_confidence"
                        })

                # Check whether the track is inside the zone
                inside_zone = (
                    cv2.pointPolygonTest(
                        zone,
                        (x, y),
                        False
                    ) >= 0
                )
                
                previously_inside = self.zone_status.get(
                    tracker_id,
                    False
                )
                
                if inside_zone and not previously_inside:
                    self.events.append({
                        "track_id": tracker_id,
                        "type": "ZONE_ENTER",
                                "timestamp": format_timestamp(frame_number / fps),
                        "reason": "restricted_zone"
                    })
                    if not track["flagged"]:
                        track["flagged"] = True
                
                        self.events.append({
                            "track_id": tracker_id,
                            "type": "FLAGGED",
                            "timestamp": format_timestamp(frame_number / fps),
                            "reason": "restricted_zone"
                        })
                elif not inside_zone and previously_inside:
                    self.events.append({
                        "track_id": tracker_id,
                        "type": "ZONE_EXIT",
                        "timestamp": format_timestamp(frame_number / fps),
                        "reason": "restricted_zone"
                    })
                
                self.zone_status[tracker_id] = inside_zone

        # Detect tracks that disappeared
        for tracker_id in self.active_track_ids:
            if tracker_id not in current_track_ids:
                if tracker_id not in self.lost_tracks:
                    self.lost_tracks[tracker_id] = frame_number

        for tracker_id in list(self.lost_tracks.keys()):
            lost_for = frame_number - self.lost_tracks[tracker_id]
            if tracker_id in current_track_ids:
                self.events.append({
                    "track_id": tracker_id,
                    "type": "TRACK_REAPPEARED",
                    "timestamp": format_timestamp(frame_number / fps),
                    "reason": None
                })
                del self.lost_tracks[tracker_id]
            elif lost_for >= self.lost_track_buffer:
                self.events.append({
                    "track_id": tracker_id,
                    "type": "TRACK_LOST",   
                    "timestamp": format_timestamp(frame_number / fps),
                    "reason": None
                })
                del self.lost_tracks[tracker_id]
                del self.zone_status[tracker_id]

        # Remember this frame's IDs for the next frame
        self.active_track_ids = current_track_ids

        # Create labels
        labels = []

        if detections.tracker_id is not None:
            for class_id, confidence, tracker_id in zip(
                detections.class_id,
                detections.confidence,
                detections.tracker_id,
            ):
                class_name = self.CLASS_NAMES.get(
                    int(class_id),
                    "unknown"
                )

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

    def get_counts(self):
        counts = {
            "vehicle": 0,
            "personnel": 0,
            "unknown": 0
        }
        for track in self.tracks.values():
            class_name = track["class"]
            if class_name in counts:
                counts[class_name] += 1
        return counts

    def get_results(self):
        return {
            "tracks": self.get_track_results(),
            "counts": self.get_counts(),
            "events": self.events
        }

def temp_P1_sim(detector, frame):
    # Temporary P1 simulation
    result = detector(frame, verbose=False)[0]

    p1_detections = []

    vehicle_classes = {2, 3, 5, 7}  # car, motorcycle, bus, truck
    personnel_classes = {0}        # person

    for box in result.boxes:
        x1, y1, x2, y2 = box.xyxy[0].tolist()

        coco_class_id = int(box.cls[0])
        confidence = float(box.conf[0])

        if coco_class_id in vehicle_classes:
            class_id = 0
            class_name = "vehicle"
        elif coco_class_id in personnel_classes:
            class_id = 1
            class_name = "personnel"
        else:
            class_id = 2
            class_name = "unknown"

        p1_detections.append({
            "bbox": [x1, y1, x2, y2],
            "class_id": class_id,
            "class_name": class_name,
            "confidence": confidence
        })

    return p1_detections

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

    # parser.add_argument(
    #     "--model",
    #     default="yolov8n.pt",
    #     help="YOLO model path",
    # )

    args = parser.parse_args()

    detector = YOLO("yolov8n.pt")
    tracker = AegisTracker()

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

    zone = np.array([
        [1530, 570],   # top-left
        [1645, 575],   # top-right
        [1645, 925],   # bottom-right
        [1500, 925]    # bottom-left
    ], dtype=np.int32)

    while True:
        success, frame = cap.read()

        if not success:
            break

        frame_number += 1

        p1_detections = temp_P1_sim(detector, frame)

        annotated = tracker.process_detections(frame, p1_detections, frame_number, fps, zone)
        cv2.polylines(
            annotated,
            [zone],
            isClosed=True,
            color=(0, 0, 255),
            thickness=3
        )

        writer.write(annotated)

        cv2.imshow("Aegis Tracking", annotated)

        # Press Q to stop
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    writer.release()
    cv2.destroyAllWindows()

    tracks = tracker.get_track_results()

    print(f"Events: {len(tracker.events)}")

    for event in tracker.events:
        print(
            f"{event['timestamp']} | "
            f"{event['type']} | "
            f"ID {event['track_id']}"
        )

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