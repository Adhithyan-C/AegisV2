import os
import uuid

from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

jobs = {}

ALLOWED_EXTENSIONS = {".mp4", ".avi", ".mov"}


@app.get("/")
def home():
    return {
        "message": "Aegis backend is running"
    }

def process_video_job(job_id: str):
    jobs[job_id]["status"] = "processing"

    try:
        # P1/P2 processing will be connected here later.
        #
        # Eventually:
        # results = process_video(jobs[job_id]["file_path"])
        # jobs[job_id]["results"] = results
        # jobs[job_id]["status"] = "completed"

        pass

    except Exception as error:
        jobs[job_id]["status"] = "failed"
        jobs[job_id]["error"] = str(error)

@app.post("/upload")
async def upload_video(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    extension = os.path.splitext(file.filename)[1].lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only MP4, AVI and MOV video files are allowed"
        )

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
        "file_path": file_path,
        "results": None
    }

    background_tasks.add_task(process_video_job, job_id)

    return {
        "job_id": job_id,
        "status": "uploaded",
        "filename": file.filename
    }


@app.get("/status/{job_id}")
def get_status(job_id: str):
    if job_id not in jobs:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    response = {
        "job_id": job_id,
        "status": jobs[job_id]["status"]
    }

    if jobs[job_id]["status"] == "failed":
        response["error"] = jobs[job_id].get(
            "error",
            "Unknown processing error"
        )

    return response

@app.get("/results/{job_id}")
def get_results(job_id: str):
    if job_id not in jobs:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    if jobs[job_id]["status"] != "completed":
        raise HTTPException(
            status_code=202,
            detail="Results are not ready yet"
        )

    return {
        "job_id": job_id,
        "status": jobs[job_id]["status"],
        "results": jobs[job_id]["results"]
    }