import os
import uuid

from fastapi import FastAPI, UploadFile, File

app = FastAPI()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

jobs = {}


@app.get("/")
def home():
    return {
        "message": "Aegis backend is running"
    }


@app.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    job_id = str(uuid.uuid4())

    file_path = os.path.join(
        UPLOAD_DIR,
        f"{job_id}_{file.filename}"
    )

    contents = await file.read()

    with open(file_path, "wb") as saved_file:
        saved_file.write(contents)

    jobs[job_id] = {
        "status": "uploaded",
        "filename": file.filename,
        "file_path": file_path
    }

    return {
        "job_id": job_id,
        "status": "uploaded",
        "filename": file.filename
    }


@app.get("/status/{job_id}")
def get_status(job_id: str):
    if job_id not in jobs:
        return {
            "error": "Job not found"
        }

    return {
        "job_id": job_id,
        "status": jobs[job_id]["status"]
    }


@app.get("/results/{job_id}")
def get_results(job_id: str):
    if job_id not in jobs:
        return {
            "error": "Job not found"
        }

    return {
        "job_id": job_id,
        "status": jobs[job_id]["status"],
        "tracks": [
            {
                "id": 1,
                "class": "vehicle",
                "confidence": 0.91,
                "first_seen": "00:00:02",
                "last_seen": "00:00:14",
                "flagged": False
            },
            {
                "id": 2,
                "class": "personnel",
                "confidence": 0.87,
                "first_seen": "00:00:05",
                "last_seen": "00:00:20",
                "flagged": True
            },
            {
                "id": 3,
                "class": "unknown",
                "confidence": 0.55,
                "first_seen": "00:00:09",
                "last_seen": "00:00:11",
                "flagged": True
            }
        ]
    }