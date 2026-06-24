from passlib.context import CryptContext

from fastapi import Depends, HTTPException

from fastapi.security import OAuth2PasswordBearer

from jose import jwt, JWTError

from sqlalchemy.orm import Session

import os

import models

from database import get_db


"""
==========================================
PASSWORD HASHING
==========================================
"""

pwd_context = CryptContext(
    schemes=["pbkdf2_sha256"],
    deprecated="auto"
)


def hash_password(
    password: str
):

    return pwd_context.hash(
        password
    )


def verify_password(
    plain,
    hashed
):

    return pwd_context.verify(
        plain,
        hashed
    )


"""
==========================================
JWT CONFIG
==========================================
"""

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)

AUTH_SECRET_KEY = os.getenv(
    "AUTH_SECRET_KEY",
    "CAMBIA_ESTA_CLAVE_EN_PRODUCCION"
)

ALGORITHM = "HS256"


"""
==========================================
CURRENT USER
==========================================
"""

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):

    try:

        payload = jwt.decode(
            token,
            AUTH_SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get(
            "sub"
        )

        if not user_id:

            raise HTTPException(
                status_code=401,
                detail="Token inválido ❌"
            )

    except JWTError:

        raise HTTPException(
            status_code=401,
            detail="Token inválido o expirado ❌"
        )

    try:

        user_id_int = int(
            user_id
        )

    except ValueError:

        raise HTTPException(
            status_code=401,
            detail="Token inválido ❌"
        )

    user = (

        db.query(models.User)

        .filter(
            models.User.id == user_id_int
        )

        .first()

    )

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Usuario no encontrado ❌"
        )

    return user