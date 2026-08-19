# Aegis Data Contract

## Track object (per tracked entity)
```json
{
  "id": 7,
  "class": "vehicle",
  "confidence": 0.812,
  "first_seen": 42,
  "last_seen": 310,
  "flagged": true,
  "positions": [
    {"frame": 42, "timestamp": "00:00:01.400", "x": 512, "y": 380}
  ]
}
```

## Event object
```json
{"track_id": 7, "type": "FLAGGED", "frame": 42, "timestamp": "00:00:01.400", "reason": "low_confidence"}
```
Event types: `TRACK_CREATED`, `TRACK_LOST`, `TRACK_REAPPEARED`, `FLAGGED` (more to come: `ZONE_ENTRY`, `ZONE_EXIT`, `RESTRICTED_ZONE_BREACH`)

## Notes
- `positions.x/y` = bottom-center of bbox, per frame
- `class`: "vehicle" | "personnel" | "unknown"
- `flagged`: true if confidence < 0.4 at any point (more triggers coming with zone logic)
- Access point: `get_track_results()` returns the full finalized track list after a job completes