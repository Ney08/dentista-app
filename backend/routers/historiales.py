from sqlalchemy.orm import Session, joinedload
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone
import os

import models
from schemas import HistorialCreate
from fastapi import APIRouter
from fastapi import HTTPException, Depends
from fastapi import Query
from typing import Optional
from database import get_db

router = APIRouter(
    prefix="/historiales",
    tags=["Historiales"]
)



@router.post("/")
def crear_historial(data: HistorialCreate, db: Session = Depends(get_db)):
    historial = models.Historial(
        cliente_id=data.cliente_id,
        descripcion=data.descripcion
    )

    db.add(historial)
    db.commit()
    db.refresh(historial)

    return historial


@router.get("/clientes/{cliente_id}/historial")
def ver_historial(cliente_id: int, db: Session = Depends(get_db)):
    return db.query(models.Historial).filter(
        models.Historial.cliente_id == cliente_id
    ).all()