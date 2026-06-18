from fastapi import APIRouter

from fastapi import Depends

from sqlalchemy.orm import (
    Session,
    joinedload
)

from datetime import (
    datetime,
    timezone
)

from database import get_db

from models.tratamiento import (
    Tratamiento
)

from schemas.tratamiento import (
    TratamientoCreate
)

router = APIRouter(

    prefix="/tratamientos",

    tags=["Tratamientos"]

)

"""
==========================================
GET BY CLIENTE
==========================================
"""

@router.get("/{cliente_id}")

def get_tratamientos(

    cliente_id: int,

    db: Session = Depends(get_db)

):

    tratamientos = (

        db.query(Tratamiento)

        .options(

            joinedload(
                Tratamiento.servicio
            )

        )

        .filter(
            Tratamiento.cliente_id
            == cliente_id
        )

        .order_by(
            Tratamiento.id.desc()
        )

        .all()

    )

    return [

        {

            "id": t.id,

            "cliente_id":
                t.cliente_id,

            "servicio_id":
                t.servicio_id,

            "servicio_nombre":

                t.servicio.nombre

                if t.servicio

                else None,

            "pieza":
                t.pieza,

            "estado":
                t.estado,

            "costo":
                t.costo,

            "pagado":
                t.pagado,

            "sesiones_totales":
                t.sesiones_totales,

            "sesiones_completadas":
                t.sesiones_completadas,

            "notas":
                t.notas,
            
            "created_at":

                t.created_at.isoformat()

            if t.created_at

            else None,


        }

        for t in tratamientos

    ]

"""
==========================================
CREATE
==========================================
"""

@router.post("/")

def create_tratamiento(

    payload: TratamientoCreate,

    db: Session = Depends(get_db)

):

    tratamiento = Tratamiento(

        cliente_id=
        payload.cliente_id,

        servicio_id=
        payload.servicio_id,

        pieza=
        payload.pieza,

        estado=
        payload.estado,

        costo=
        payload.costo,

        pagado=
        payload.pagado,

        sesiones_totales=
        payload.sesiones_totales,

        sesiones_completadas=
        payload.sesiones_completadas,

        notas=
        payload.notas

    )

    db.add(tratamiento)

    db.commit()

    db.refresh(tratamiento)

    return {

        "id":
            tratamiento.id,

        "cliente_id":
            tratamiento.cliente_id,

        "servicio_id":
            tratamiento.servicio_id,

        "servicio_nombre":

            tratamiento.servicio.nombre

            if tratamiento.servicio

            else None,

        "pieza":
            tratamiento.pieza,

        "estado":
            tratamiento.estado,

        "costo":
            tratamiento.costo,

        "pagado":
            tratamiento.pagado,

        "sesiones_totales":
            tratamiento.sesiones_totales,

        "sesiones_completadas":
            tratamiento.sesiones_completadas,

        "notas":
            tratamiento.notas,
            
        
        "created_at":

            tratamiento.created_at.isoformat()

        if tratamiento.created_at

        else None,


    }

"""
==========================================
UPDATE
==========================================
"""

@router.put("/{tratamiento_id}")

def update_tratamiento(

    tratamiento_id: int,

    payload: TratamientoCreate,

    db: Session = Depends(get_db)

):

    tratamiento = (

        db.query(Tratamiento)

        .options(

            joinedload(
                Tratamiento.servicio
            )

        )

        .filter(
            Tratamiento.id
            == tratamiento_id
        )

        .first()

    )

    if not tratamiento:

        return {
            "error":
            "Tratamiento no encontrado"
        }

    tratamiento.servicio_id = (
        payload.servicio_id
    )

    tratamiento.pieza = (
        payload.pieza
    )

    tratamiento.estado = (
        payload.estado
    )

    tratamiento.costo = (
        payload.costo
    )

    tratamiento.pagado = (
        payload.pagado
    )

    tratamiento.sesiones_totales = (
        payload.sesiones_totales
    )

    tratamiento.sesiones_completadas = (
        payload.sesiones_completadas
    )

    tratamiento.notas = (
        payload.notas
    )

    """
    ==========================================
    AUTO COMPLETE
    ==========================================
    """

    balance = (

        float(tratamiento.costo)

        -

        float(tratamiento.pagado)

    )

    if (

        balance <= 0

        and

        tratamiento
        .sesiones_completadas

        >=

        tratamiento
        .sesiones_totales

    ):

        tratamiento.estado = (
            "Completado"
        )

    elif (

        tratamiento
        .sesiones_completadas > 0

    ):

        tratamiento.estado = (
            "En progreso"
        )

    db.commit()

    db.refresh(tratamiento)

    return {

        "id":
            tratamiento.id,

        "cliente_id":
            tratamiento.cliente_id,

        "servicio_id":
            tratamiento.servicio_id,

        "servicio_nombre":

            tratamiento.servicio.nombre

            if tratamiento.servicio

            else None,

        "pieza":
            tratamiento.pieza,

        "estado":
            tratamiento.estado,

        "costo":
            tratamiento.costo,

        "pagado":
            tratamiento.pagado,

        "sesiones_totales":
            tratamiento.sesiones_totales,

        "sesiones_completadas":
            tratamiento.sesiones_completadas,

        "notas":
            tratamiento.notas

    }

"""
==========================================
DELETE
==========================================
"""

@router.delete("/{tratamiento_id}")

def delete_tratamiento(

    tratamiento_id: int,

    db: Session = Depends(get_db)

):

    tratamiento = (

        db.query(Tratamiento)

        .filter(
            Tratamiento.id
            == tratamiento_id
        )

        .first()

    )

    if not tratamiento:

        return {
            "error":
            "Tratamiento no encontrado"
        }

    db.delete(tratamiento)

    db.commit()

    return {

        "message":
            "Tratamiento eliminado ✅"

    }

"""
==========================================
REGISTRAR PAGO
==========================================
"""

@router.put("/{tratamiento_id}/pago")

def registrar_pago(

    tratamiento_id: int,

    monto: float,

    db: Session = Depends(get_db)

):

    tratamiento = (

        db.query(Tratamiento)

        .options(

            joinedload(
                Tratamiento.servicio
            )

        )

        .filter(
            Tratamiento.id
            == tratamiento_id
        )

        .first()

    )

    if not tratamiento:

        return {
            "error":
            "Tratamiento no encontrado"
        }

    """
    ==========================================
    SUMAR PAGO
    ==========================================
    """

    tratamiento.pagado = (

        float(tratamiento.pagado)

        +

        float(monto)

    )

    """
    ==========================================
    AUTO COMPLETE
    ==========================================
    """

    balance = (

        float(tratamiento.costo)

        -

        float(tratamiento.pagado)

    )

    if (

        balance <= 0

        and

        tratamiento
        .sesiones_completadas

        >=

        tratamiento
        .sesiones_totales

    ):

        tratamiento.estado = (
            "Completado"
        )

    else:

        tratamiento.estado = (
            "En progreso"
        )

    db.commit()

    db.refresh(tratamiento)

    return {

        "id":
            tratamiento.id,

        "cliente_id":
            tratamiento.cliente_id,

        "servicio_id":
            tratamiento.servicio_id,

        "servicio_nombre":

            tratamiento.servicio.nombre

            if tratamiento.servicio

            else None,

        "pieza":
            tratamiento.pieza,

        "estado":
            tratamiento.estado,

        "costo":
            tratamiento.costo,

        "pagado":
            tratamiento.pagado,

        "sesiones_totales":
            tratamiento.sesiones_totales,

        "sesiones_completadas":
            tratamiento.sesiones_completadas,

        "notas":
            tratamiento.notas

    }