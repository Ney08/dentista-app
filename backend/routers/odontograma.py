from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi import HTTPException
from database import get_db

from models.odontograma import Odontograma

from schemas.odontograma import (
    OdontogramaPayload
)

router = APIRouter(
    prefix="/odontograma",
    tags=["Odontograma"]
)


@router.get("/{cliente_id}")
def get_odontograma(
    cliente_id: int,
    db: Session = Depends(get_db)
):

    odontograma = (
        db.query(Odontograma)
        .filter(
            Odontograma.cliente_id
            == cliente_id
        )
        .first()
    )

    if not odontograma:

        return {}

    return odontograma.odontograma


@router.put("/{cliente_id}")
def save_odontograma(

    cliente_id: int,

    payload: OdontogramaPayload,

    db: Session = Depends(get_db)

):

    try:

        odontograma = (

            db.query(Odontograma)

            .filter(
                Odontograma.cliente_id
                == cliente_id
            )

            .first()

        )

 

        data = {

            tooth: {

                "top": face.top,

                "left": face.left,

                "center": face.center,

                "right": face.right,

                "bottom": face.bottom

            }

            for tooth, face

            in payload.odontograma.items()

        }

   

        if odontograma:

            odontograma.odontograma = data

  

        else:

            odontograma = Odontograma(

                cliente_id=cliente_id,

                odontograma=data

            )

            db.add(odontograma)

        db.commit()

        db.refresh(odontograma)

        return {

            "success": True,

            "odontograma":
                odontograma.odontograma

        }

    except Exception as e:

        print(e)

        raise e
    
    
    
    
    
    


"""
==========================================
DELETE
==========================================
"""

@router.delete("/{cliente_id}")
def delete_odontograma(

    cliente_id: int,

    db: Session = Depends(get_db)

):

    odontograma = (

        db.query(Odontograma)

        .filter(
            Odontograma.cliente_id
            == cliente_id
        )

        .first()

    )

    if not odontograma:

        raise HTTPException(

            status_code=404,

            detail="Odontograma no encontrado"

        )

    db.delete(odontograma)

    db.commit()

    return {

        "success": True,

        "message":
            "Odontograma eliminado"

    }