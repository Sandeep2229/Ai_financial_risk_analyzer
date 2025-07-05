from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import numpy as np
import pickle

app = FastAPI()

# Load model and scaler
with open("model.pkl", "rb") as f:
    model = pickle.load(f)

with open("scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

# Define input format
class InputFeatures(BaseModel):
    features: list

# Prediction endpoint
@app.post("/predict")
async def predict(input_data: InputFeatures):
    features = np.array(input_data.features).reshape(1, -1)
    scaled = scaler.transform(features)
    prediction = model.predict(scaled)[0]
    probability = model.predict_proba(scaled)[0][1]
    return JSONResponse(content={
        "prediction": int(prediction),
        "default_probability": round(float(probability), 4)
    })

# Serve frontend
app.mount("/", StaticFiles(directory="frontend/AI_financial_analyst/dist", html=True), name="static")

@app.get("/")
def read_index():
    return FileResponse("frontend/AI_financial_analyst/dist/index.html")
