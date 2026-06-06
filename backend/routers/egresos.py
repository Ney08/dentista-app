from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

import models

from database import get_db

from schemas import ( EgresoCreate, Egreso)

router = APIRouter(
    prefix="/egresos",
    tags=["Egresos"]
)



@router.post("/", response_model=Egreso)
def crear_egreso(
    data: EgresoCreate,
    db: Session = Depends(get_db)
):

    egreso = models.Egreso(
        descripcion=data.descripcion,
        categoria=data.categoria,
        monto=data.monto,
        metodo_pago=data.metodo_pago,
        observacion=data.observacion
    )

    db.add(egreso)

    db.commit()

    db.refresh(egreso)

    return egreso



@router.get("/", response_model=list[Egreso])
def listar_egresos(
    db: Session = Depends(get_db)
):

    return db.query(
        models.Egreso
    ).order_by(
        models.Egreso.created_at.desc()
    ).all()
    
    
    

@router.delete("/{id}")
def eliminar_egreso(
    id: int,
    db: Session = Depends(get_db)
):

    egreso = db.query(
        models.Egreso
    ).filter(
        models.Egreso.id == id
    ).first()

    if not egreso:

        raise HTTPException(
            404,
            "Egreso no encontrado ❌"
        )

    db.delete(egreso)

    db.commit()

    return {
        "message": "Egreso eliminado ✅"
    }

    
@router.put("/{id}", response_model=Egreso)
def actualizar_egreso(
    id: int,
    data: EgresoCreate,
    db: Session = Depends(get_db)
):

    egreso = db.query(
        models.Egreso
    ).filter(
        models.Egreso.id == id
    ).first()

    if not egreso:

        raise HTTPException(
            404,
            "Egreso no encontrado ❌"
        )

    egreso.descripcion = data.descripcion
    egreso.categoria = data.categoria
    egreso.monto = data.monto
    egreso.metodo_pago = data.metodo_pago
    egreso.observacion = data.observacion

    db.commit()

    db.refresh(egreso)

    return egreso
