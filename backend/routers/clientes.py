from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from utils.actividad import registrar_actividad
from database import get_db
from security import get_current_user
import models
from sqlalchemy.exc import IntegrityError
from schemas import ClienteCreate, Cliente

from typing import Optional
import re


router = APIRouter(
    prefix="/clientes",
    tags=["Clientes"],
    
    # dependencies=[
    #         Depends(get_current_user)
    #     ]

)


@router.post("/", response_model=Cliente)
def crear_cliente(data: ClienteCreate, db: Session = Depends(get_db)):

    # ✅ limpiar cédula
    cedula = re.sub(r"\D", "", data.cedula.strip())

    # ✅ VALIDAR SI YA EXISTE
    
    existe = db.query(models.Cliente).filter(
        models.Cliente.cedula == cedula
    ).first()


    
    if existe:
        raise HTTPException(400, "La cédula ya está registrada ❌")


    # ✅ crear cliente
    nuevo_cliente = models.Cliente(
        nombre=data.nombre,
        apellido=data.apellido,
        cedula=cedula,
        telefono=data.telefono,
        activo=True
    )

    db.add(nuevo_cliente)

    db.flush()

    # ✅ crear dirección
    direccion = models.Direccion(
        provincia_nombre=data.direccion.provincia_nombre,
        municipio_nombre=data.direccion.municipio_nombre,
        distrito_nombre=data.direccion.distrito_nombre,
        seccion_nombre=data.direccion.seccion_nombre,
        barrio_nombre=data.direccion.barrio_nombre,
        calle=data.direccion.calle,
        cliente_id=nuevo_cliente.id
    )

    db.add(direccion)

    registrar_actividad(
        db=db,
        tipo="cliente",
        accion="crear",
        titulo="Paciente registrado",
        descripcion=(
            f"{nuevo_cliente.nombre} "
            f"{nuevo_cliente.apellido}"
        ),
        referencia_id=nuevo_cliente.id,
        usuario="Sistema"
    )

    db.commit()

    db.refresh(nuevo_cliente)

    return nuevo_cliente











@router.get("/", response_model=list[Cliente])
def listar_clientes(
    activos: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
    # current_user = Depends(get_current_user)
):
    
    query = db.query(models.Cliente).options(
        joinedload(models.Cliente.direccion)
    )

    
    if activos is not None:
        query = query.filter(models.Cliente.activo == activos)

    return query.all()




@router.put("/{cliente_id}", response_model=Cliente)
def actualizar_cliente(
    cliente_id: int,
    data: ClienteCreate,
    db: Session = Depends(get_db)
):

    cliente = (
        db.query(models.Cliente)
        .options(
            joinedload(models.Cliente.direccion)
        )
        .filter(
            models.Cliente.id == cliente_id
        )
        .first()
    )

    if not cliente:

        raise HTTPException(
            status_code=404,
            detail="Cliente no encontrado ❌"
        )

    try:

        # ===============================
        # LIMPIAR Y VALIDAR CÉDULA
        # ===============================

        cedula = ""

        if data.cedula:

            cedula = re.sub(
                r"\D",
                "",
                data.cedula.strip()
            )

        if cedula:

            existe = (
                db.query(models.Cliente)
                .filter(
                    models.Cliente.cedula == cedula,
                    models.Cliente.id != cliente_id
                )
                .first()
            )

            if existe:

                raise HTTPException(
                    status_code=400,
                    detail="La cédula ya está registrada en otro paciente ❌"
                )

        # ===============================
        # ACTUALIZAR CLIENTE
        # ===============================

        cliente.nombre = data.nombre
        cliente.apellido = data.apellido
        cliente.cedula = cedula
        cliente.telefono = data.telefono
        cliente.activo = True

        # ===============================
        # ACTUALIZAR / CREAR DIRECCIÓN
        # ===============================

        direccion = (
            db.query(models.Direccion)
            .filter(
                models.Direccion.cliente_id == cliente_id
            )
            .first()
        )

        if not direccion:

            direccion = models.Direccion(
                cliente_id=cliente_id
            )

            db.add(
                direccion
            )

            db.flush()

        direccion.provincia_nombre = (
            data.direccion.provincia_nombre
            if data.direccion
            else None
        )

        direccion.municipio_nombre = (
            data.direccion.municipio_nombre
            if data.direccion
            else None
        )

        direccion.distrito_nombre = (
            data.direccion.distrito_nombre
            if data.direccion
            else None
        )

        direccion.seccion_nombre = (
            data.direccion.seccion_nombre
            if data.direccion
            else None
        )

        direccion.barrio_nombre = (
            data.direccion.barrio_nombre
            if data.direccion
            else None
        )

        direccion.calle = (
            data.direccion.calle
            if data.direccion
            else ""
        )

        # ===============================
        # ACTIVIDAD
        # ===============================

        registrar_actividad(
            db=db,
            tipo="cliente",
            accion="actualizar",
            titulo="Paciente actualizado",
            descripcion=(
                f"{cliente.nombre} "
                f"{cliente.apellido}"
            ),
            referencia_id=cliente.id,
            usuario="Sistema"
        )

        db.commit()

    except HTTPException:

        db.rollback()

        raise

    except IntegrityError:

        db.rollback()

        raise HTTPException(
            status_code=400,
            detail="No se pudo actualizar: cédula duplicada o dato inválido ❌"
        )

    except Exception as e:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Error actualizando cliente: {str(e)}"
        )

    cliente_actualizado = (
        db.query(models.Cliente)
        .options(
            joinedload(models.Cliente.direccion)
        )
        .filter(
            models.Cliente.id == cliente_id
        )
        .first()
    )

    return cliente_actualizado


@router.put("/{cliente_id}/desactivar")
def desactivar_cliente(cliente_id: int, db: Session = Depends(get_db)):

    cliente = db.query(models.Cliente).filter(
        models.Cliente.id == cliente_id
    ).first()

    if not cliente:
        raise HTTPException(404, "Cliente no encontrado")

    cliente.activo = False
    
    registrar_actividad(
        db=db,
        tipo="cliente",
        accion="desactivar",
        titulo="Paciente desactivado",
        descripcion=(
            f"{cliente.nombre} "
            f"{cliente.apellido}"
        ),
        referencia_id=cliente.id,
        usuario="Sistema"
    )

    db.commit()
    db.refresh(cliente)

    return {"message": "Cliente desactivado ✅"}



@router.put("/{cliente_id}/activar")
def activar_cliente(cliente_id: int, db: Session = Depends(get_db)):

    cliente = db.query(models.Cliente).filter(
        models.Cliente.id == cliente_id
    ).first()
    
    if not cliente:
        raise HTTPException(404, "Cliente no encontrado")
    
    cliente.activo = True
    
    registrar_actividad(
        db=db,
        tipo="cliente",
        accion="activar",
        titulo="Paciente reactivado",
        descripcion=(
            f"{cliente.nombre} "
            f"{cliente.apellido}"
        ),
        referencia_id=cliente.id,
        usuario="Sistema"
    )

    db.commit()
    db.refresh(cliente)
    
    

    return {"message": "Cliente activado ✅"}