from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from PIL import Image
import io
import logging
from datetime import datetime

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load YOLOv8 model
try:
    model = YOLO("my_model.pt")
    logger.info("✅ Model loaded successfully")
except Exception as e:
    logger.error(f"❌ Failed to load model: {e}")
    raise

app = FastAPI(
    title="SnapNutrient AI API",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "SnapNutrient AI",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "model": "loaded"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        # Validate file type
        if not file.content_type.startswith("image/"):
            raise HTTPException(400, "File must be an image")
        
        # Read image
        image_bytes = await file.read()
        
        # Max 10MB
        if len(image_bytes) > 10 * 1024 * 1024:
            raise HTTPException(400, "Image too large (max 10MB)")
        
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    
        
        # Run YOLO prediction
        results = model(image, conf=0.25, verbose=False)
        
        predictions = []
        for box in results[0].boxes:
            class_id = int(box.cls[0])
            class_name = model.names[class_id]
            confidence = float(box.conf[0])
            predictions.append({
                "class": class_name,
                "confidence": round(confidence, 3)
            })
    
        return JSONResponse(content={"predictions": predictions})
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error: {e}")
        raise HTTPException(500, f"Prediction failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
