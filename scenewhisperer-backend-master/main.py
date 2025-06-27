from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from ocr import extract_text
from report_generator import generate_report
from tts import text_to_speech

app = FastAPI()

# Allow frontend access (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Optional: Serve static files if needed (e.g., for logs or frontend testing)
app.mount("/static", StaticFiles(directory=".", html=True), name="static")

# Global variable to store last audio path
latest_audio_filename = "report_audio.mp3"  # default name


@app.post("/upload/")
async def upload(file: UploadFile = File(...)):
    global latest_audio_filename

    # Save image temporarily
    contents = await file.read()
    with open("temp.jpg", "wb") as f:
        f.write(contents)

    # OCR step
    extracted_text = extract_text("temp.jpg")

    # NLP report generation
    report = generate_report(extracted_text)

    # TTS audio generation
    latest_audio_filename = text_to_speech(report)

    return JSONResponse({
        "extracted_text": extracted_text,
        "report": report,
        "audio_path": "/audio"  # The frontend will use this URL
    })


@app.get("/audio")
def get_audio():
    return FileResponse(latest_audio_filename, media_type="audio/mpeg", filename=latest_audio_filename)
