from fastapi import FastAPI, Depends, File, UploadFile, Form, HTTPException
from sqlalchemy.orm import Session, joinedload
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone

import models
from schemas import CitaCreate
from fastapi import APIRouter
from fastapi import HTTPException, Depends

from database import get_db

router = APIRouter(
    prefix="/citas",
    tags=["Citas"]
)



@router.post("/")
def crear_cita(data: CitaCreate, db: Session = Depends(get_db)):

    # ✅ VALIDAR DUPLICADO (MISMA FECHA EXACTA)
    existe = db.query(models.Cita).filter(
        models.Cita.fecha == data.fecha
    ).first()

    if existe:
        raise HTTPException(
            status_code=400,
            detail="Ya hay una cita en ese horario ❌"
        )

    # ✅ VALIDAR MOTIVO
    if not data.motivo:
        raise HTTPException(
            status_code=400,
            detail="El motivo es obligatorio ⚠️"
        )

    # ✅ CREAR CITA
    cita = models.Cita(
        cliente_id=data.cliente_id,
        fecha=data.fecha,
        motivo=data.motivo,         # ✅ NUEVO
        detalle=data.detalle or None,  # ✅ NUEVO
        duracion=data.duracion or 30   # ✅ NUEVO
    )

    db.add(cita)
    db.commit()
    db.refresh(cita)

    return cita



@router.get("/")
def listar_citas(db: Session = Depends(get_db)):

    citas = db.query(models.Cita).options(
        joinedload(models.Cita.cliente)
    ).all()

    data = []

    for c in citas:
        data.append({
            "id": c.id,
            "cliente_id": c.cliente_id,

            # ✅ ESTO ES LO QUE TE FALTABA
            "cliente": {
                "nombre": c.cliente.nombre,
                "apellido": c.cliente.apellido
            } if c.cliente else None,

            "fecha": c.fecha.isoformat() if c.fecha else None,
            "estado": c.estado,
            "motivo": c.motivo,
            "detalle": c.detalle,
            "duracion": c.duracion
        })

    return data





@router.put("/{id}/completar")
def completar_cita(id: int, db: Session = Depends(get_db)):

    cita = db.query(models.Cita).filter(models.Cita.id == id).first()

    if not cita:
        raise HTTPException(404, "No encontrada")

    cita.estado = "completada"
    db.commit()

    return cita

    

@router.get("/debug/citas")
def debug_citas(db: Session = Depends(get_db)):
    return db.query(models.Cita).all()




@router.put("/{id}/cancelar")
def cancelar_cita(id: int, db: Session = Depends(get_db)):

    cita = db.query(models.Cita).filter(models.Cita.id == id).first()

    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")

    cita.estado = "cancelada"
    db.commit()

    return cita

@router.put("/{id}")
def actualizar_cita(id: int, data: CitaCreate, db: Session = Depends(get_db)):

    cita = db.query(models.Cita).filter(models.Cita.id == id).first()

    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")

    cita.cliente_id = data.cliente_id
    cita.fecha = data.fecha
    cita.motivo = data.motivo
    cita.detalle = data.detalle
    cita.duracion = data.duracion

    db.commit()
    db.refresh(cita)

    return cita