from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
import random
import httpx
import os

app = FastAPI(title="Service IA - Comparaison Signatures (SIMULE)")

SPRING_CALLBACK_URL = "http://localhost:8081/api/ia/resultat"
API_KEY = os.getenv("IA_CALLBACK_KEY", "cle123456")             # doit matcher Spring
class AnalyseRequest(BaseModel):
    numero_infoval_bcm: int

def generer_resultat_simule():
    u = random.random()
    if u < 0.05:
        return None, None
    elif u < 0.27:
        verdict = "O" if random.random() < 0.62 else "N"
        score = round(0.55 + random.random() * 0.29, 4)
    else:
        verdict = "O" if u < 0.89 else "N"
        score = round(0.90 + random.random() * 0.095, 4)
    return verdict, score

@app.post("/analyser")
async def analyser_signature(req: AnalyseRequest):
    verdict, score = generer_resultat_simule()

    payload = {
        "numeroInfovalBcm": req.numero_infoval_bcm,
        "verdict": verdict,
        "score": score
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            SPRING_CALLBACK_URL,
            json=payload,
            headers={"X-API-Key": API_KEY}
        )
        response.raise_for_status()

    return {"status": "envoye_a_spring", "resultat": payload}

@app.get("/health")
def health():
    return {"status": "ok"}