from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session

from datetime import datetime, timedelta, timezone

from jose import jwt, JWTError

import os

import models

from database import get_db

from schemas import (
    UserCreate,
    UserLogin,
    UserUpdate,
    UserReset
)

from security import (
    hash_password,
    verify_password
)

from utils.actividad import registrar_actividad


router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


"""
==========================================
CONFIG
==========================================
"""

AUTH_SECRET_KEY = os.getenv(
    "AUTH_SECRET_KEY",
    "CAMBIA_ESTA_CLAVE_EN_PRODUCCION"
)

RESET_MASTER_KEY = os.getenv(
    "RESET_MASTER_KEY",
    ""
)

ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv(
        "ACCESS_TOKEN_EXPIRE_MINUTES",
        "480"
    )
)

ALGORITHM = "HS256"


"""
==========================================
RATE LIMIT SIMPLE
==========================================
"""

login_attempts = {}


def verificar_rate_limit(
    username: str
):

    ahora = datetime.now(
        timezone.utc
    )

    key = username.lower().strip()

    data = login_attempts.get(
        key,
        {
            "count": 0,
            "blocked_until": None
        }
    )

    blocked_until = data.get(
        "blocked_until"
    )

    if (
        blocked_until
        and
        ahora < blocked_until
    ):

        raise HTTPException(
            status_code=429,
            detail="Demasiados intentos. Intenta más tarde ⏳"
        )


def registrar_intento_fallido(
    username: str
):

    ahora = datetime.now(
        timezone.utc
    )

    key = username.lower().strip()

    data = login_attempts.get(
        key,
        {
            "count": 0,
            "blocked_until": None
        }
    )

    data["count"] += 1

    if data["count"] >= 5:

        data["blocked_until"] = (
            ahora +
            timedelta(minutes=10)
        )

        data["count"] = 0

    login_attempts[key] = data


def limpiar_intentos(
    username: str
):

    key = username.lower().strip()

    if key in login_attempts:

        del login_attempts[key]


"""
==========================================
JWT
==========================================
"""

def crear_token_acceso(
    user_id: int,
    username: str
):

    expira = (
        datetime.now(timezone.utc)
        +
        timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    payload = {
        "sub": str(user_id),
        "username": username,
        "exp": expira
    }

    token = jwt.encode(
        payload,
        AUTH_SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token


"""
==========================================
VALIDACIONES
==========================================
"""

def validar_password_segura(
    password: str
):

    if not password:

        raise HTTPException(
            status_code=400,
            detail="Contraseña requerida ❌"
        )

    if len(password.strip()) < 8:

        raise HTTPException(
            status_code=400,
            detail="La contraseña debe tener mínimo 8 caracteres ⚠️"
        )


"""
==========================================
REGISTER
==========================================
"""

@router.post("/register")
def register(
    data: UserCreate,
    db: Session = Depends(get_db)
):

    username = data.username.strip()

    password = data.password.strip()

    if not username:

        raise HTTPException(
            status_code=400,
            detail="Usuario requerido ❌"
        )

    validar_password_segura(
        password
    )

    existe = (
        db.query(models.User)
        .filter_by(username=username)
        .first()
    )

    if existe:

        raise HTTPException(
            status_code=400,
            detail="Usuario ya existe ❌"
        )

    nuevo = models.User(
        username=username,
        password=hash_password(password)
    )

    db.add(nuevo)

    db.flush()

    registrar_actividad(
        db=db,
        tipo="usuario",
        accion="crear",
        titulo="Usuario creado",
        descripcion=f"Usuario: {nuevo.username}",
        referencia_id=nuevo.id,
        usuario="Sistema"
    )

    db.commit()

    return {
        "msg": "Usuario creado ✅"
    }


"""
==========================================
LOGIN
==========================================
"""

@router.post("/login")
def login(
    data: UserLogin,
    db: Session = Depends(get_db)
):

    username = data.username.strip()

    password = data.password.strip()

    if not username or not password:

        raise HTTPException(
            status_code=400,
            detail="Usuario o contraseña incorrectos ❌"
        )

    verificar_rate_limit(
        username
    )

    user = (
        db.query(models.User)
        .filter_by(username=username)
        .first()
    )

    if not user:

        registrar_intento_fallido(
            username
        )

        raise HTTPException(
            status_code=400,
            detail="Usuario o contraseña incorrectos ❌"
        )

    if not verify_password(
        password,
        user.password
    ):

        registrar_intento_fallido(
            username
        )

        raise HTTPException(
            status_code=400,
            detail="Usuario o contraseña incorrectos ❌"
        )

    limpiar_intentos(
        username
    )

    token = crear_token_acceso(
        user_id=user.id,
        username=user.username
    )

    registrar_actividad(
        db=db,
        tipo="usuario",
        accion="login",
        titulo="Inicio de sesión",
        descripcion=f"Usuario: {user.username}",
        referencia_id=user.id,
        usuario=user.username
    )

    db.commit()

    return {
        "token": token,
        "user": user.username
    }


"""
==========================================
RESET PASSWORD
==========================================
"""

@router.put("/users/reset")
def reset_password(
    data: UserReset,
    db: Session = Depends(get_db)
):

    if not RESET_MASTER_KEY:

        raise HTTPException(
            status_code=500,
            detail="RESET_MASTER_KEY no configurada ❌"
        )

    if data.reset_key != RESET_MASTER_KEY:

        raise HTTPException(
            status_code=403,
            detail="Clave de seguridad inválida ❌"
        )

    username = data.username.strip()

    password = data.password.strip()

    validar_password_segura(
        password
    )

    user = (
        db.query(models.User)
        .filter(models.User.username == username)
        .first()
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado ❌"
        )

    user.password = hash_password(
        password
    )

    registrar_actividad(
        db=db,
        tipo="usuario",
        accion="reset_password",
        titulo="Contraseña restablecida",
        descripcion=f"Usuario: {user.username}",
        referencia_id=user.id,
        usuario="Sistema"
    )

    db.commit()

    return {
        "msg": "Contraseña actualizada ✅"
    }


"""
==========================================
UPDATE USER
==========================================
"""

@router.put("/users/{user_id}")
def actualizar_usuario(
    user_id: int,
    data: UserUpdate,
    db: Session = Depends(get_db)
):

    user = (
        db.query(models.User)
        .filter(models.User.id == user_id)
        .first()
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado ❌"
        )

    acciones = []

    if data.username:

        username = data.username.strip()

        if not username:

            raise HTTPException(
                status_code=400,
                detail="Usuario inválido ❌"
            )

        user.username = username

        acciones.append(
            "nombre de usuario"
        )

    if data.password:

        password = data.password.strip()

        validar_password_segura(
            password
        )

        user.password = hash_password(
            password
        )

        acciones.append(
            "contraseña"
        )

    detalle = (
        ", ".join(acciones)
        if acciones
        else "sin cambios relevantes"
    )

    registrar_actividad(
        db=db,
        tipo="usuario",
        accion="actualizar",
        titulo="Usuario actualizado",
        descripcion=f"Se actualizó: {detalle}",
        referencia_id=user.id,
        usuario=user.username
    )

    db.commit()

    return {
        "msg": "Usuario actualizado ✅"
    }