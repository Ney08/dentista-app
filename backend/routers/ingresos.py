from fastapi import Depends, File, UploadFile, Form, HTTPException
from sqlalchemy.orm import Session, joinedload
from datetime import datetime, timezone

import models
from schemas import  IngresoCreate, IngresoUpdateSchema
from fastapi import APIRouter

import uuid
from database import get_db

router = APIRouter(
    prefix="/ingresos",
    tags=["Ingresos"]
)



@router.post("/")
def crear_ingreso(data: IngresoCreate, db: Session = Depends(get_db)):

    try:
        print("DATA RECIBIDA:", data.model_dump())

        ingreso = models.Ingreso(
            cliente_id=data.cliente_id,
            descuento=getattr(data, "descuento", 0) or 0,
            pagado=False,
            cita_id=getattr(data, "cita_id", None)
        )

        db.add(ingreso)
        db.commit()
        db.refresh(ingreso)

        # ✅ PROTEGER SI servicios viene vacío
        servicios_data = getattr(data, "servicios", [])

        if servicios_data:
            for s in servicios_data:
                servicio = models.Servicios(
                    descripcion=s.descripcion,
                    monto=s.monto,
                    costo_servicio=s.costo_servicio,
                    ingreso_id=ingreso.id
                )
                db.add(servicio)

        db.commit()

        return {"ok": True}

    except Exception as e:
        print("ERROR REAL:", e)
        return {"error": str(e)}


@router.get("/")
def listar_ingresos(db: Session = Depends(get_db)):

    try:
        ingresos = db.query(models.Ingreso).options(
            joinedload(models.Ingreso.cliente),
            joinedload(models.Ingreso.servicios),
            joinedload(models.Ingreso.cita)
        ).all()

        data = []

        for i in ingresos:
            data.append({
                "id": i.id,
                "cliente_id": i.cliente_id,

                "cliente": {
                    "nombre": i.cliente.nombre,
                    "apellido": i.cliente.apellido
                } if i.cliente else None,

                "servicios": [
                    {
                        "descripcion": s.descripcion,
                        "monto": s.monto,
                        "costo_servicio": s.costo_servicio
                    }
                    for s in i.servicios
                ],

                "descuento": i.descuento or 0,
                "pagado": i.pagado or False,

                
                "created_at": (i.created_at.replace(tzinfo=timezone.utc).isoformat() if i.created_at else None),

                
                "fecha_pago": (i.fecha_pago.replace(tzinfo=timezone.utc).isoformat()if i.fecha_pago else None),


                "cita_id": i.cita_id
            })

        return data

    except Exception as e:
        print("💥 ERROR REAL:", e)
        return {"error": str(e)}


@router.put("/{id}")
def actualizar_ingreso(id: int, data: IngresoUpdateSchema, db: Session = Depends(get_db)):

    ingreso = db.query(models.Ingreso).filter(models.Ingreso.id == id).first()

    if not ingreso:
        raise HTTPException(status_code=404, detail="Ingreso no encontrado")

    ingreso.cliente_id = data.cliente_id
    ingreso.descuento = data.descuento

    # ✅ borrar servicios
    db.query(models.Servicios).filter(models.Servicios.ingreso_id == id).delete()

    # ✅ agregar servicios nuevos
    for s in data.servicios:
        nuevo = models.Servicios(
            ingreso_id=id,
            descripcion=s.descripcion,
            monto=s.monto,
            costo_servicio=s.costo_servicio
        )
        db.add(nuevo)

    db.commit()
    db.refresh(ingreso)

    # ✅ 🔥 IMPORTANTE: reconstruir respuesta igual que GET
    return {
        "id": ingreso.id,
        "cliente_id": ingreso.cliente_id,
        "cliente": {
            "nombre": ingreso.cliente.nombre,
            "apellido": ingreso.cliente.apellido
        } if ingreso.cliente else None,
        "servicios": [
            {
                "descripcion": s.descripcion,
                "monto": s.monto,
                "costo_servicio": s.costo_servicio
            }
            for s in ingreso.servicios
        ],
        "descuento": ingreso.descuento or 0,
        "pagado": ingreso.pagado or False,
        "created_at": ingreso.created_at.isoformat() if ingreso.created_at else None
    }



@router.put("/{id}/pagar")
def marcar_pagado(id: int, db: Session = Depends(get_db)):

    ingreso = db.query(models.Ingreso).filter(models.Ingreso.id == id).first()

    if not ingreso:
        raise HTTPException(status_code=404, detail="No encontrado")

    # ✅ marcar pagado
    ingreso.pagado = True

    # ✅ guardar fecha_pago
    ingreso.fecha_pago = datetime.now(timezone.utc)

    # ✅ 🔥 NUEVO: completar cita automáticamente
    if ingreso.cita_id:
        cita = db.query(models.Cita).filter(models.Cita.id == ingreso.cita_id).first()
        if cita:
            cita.estado = "completada"

    db.commit()
    db.refresh(ingreso)

    # ✅ devolver formato consistente
    return {
        "id": ingreso.id,
        "cliente_id": ingreso.cliente_id,

        "cliente": {
            "nombre": ingreso.cliente.nombre,
            "apellido": ingreso.cliente.apellido
        } if ingreso.cliente else None,

        "servicios": [
            {
                "descripcion": s.descripcion,
                "monto": s.monto,
                "costo_servicio": s.costo_servicio
            }
            for s in ingreso.servicios
        ],

        "descuento": ingreso.descuento or 0,
        "pagado": ingreso.pagado,
        
        
        "fecha_pago": (ingreso.fecha_pago.replace(tzinfo=timezone.utc).isoformat()if ingreso.fecha_pago else None),



        # ✅ opcional pero recomendado
        "cita_id": ingreso.cita_id,

        
        
        "created_at": (ingreso.created_at.replace(tzinfo=timezone.utc).isoformat()if ingreso.created_at else None),


    }


@router.post("/{ingreso_id}/factura")
async def guardar_factura(
    ingreso_id: int,
    file: UploadFile = File(...)
):

    filename = f"{uuid.uuid4()}_{file.filename}"

    ruta = f"facturas/{filename}"

    with open(ruta, "wb") as f:
        f.write(await file.read())

    return {
        "message": "Factura guardada ✅",
        "archivo": ruta,
        "ingreso_id": ingreso_id
    }