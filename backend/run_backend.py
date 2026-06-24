import os
import sys
import shutil
import socket
import traceback

import uvicorn

from dotenv import load_dotenv


def backend_ya_corriendo(host="127.0.0.1", port=8000):
    with socket.socket(
        socket.AF_INET,
        socket.SOCK_STREAM
    ) as sock:
        sock.settimeout(1)

        return sock.connect_ex(
            (
                host,
                port
            )
        ) == 0


def get_appdata_dir():
    appdata = os.getenv("APPDATA")

    if not appdata:
        appdata = os.path.expanduser("~")

    app_dir = os.path.join(
        appdata,
        "DentistaApp"
    )

    os.makedirs(
        app_dir,
        exist_ok=True
    )

    return app_dir


def get_exe_dir():
    if getattr(sys, "frozen", False):
        return os.path.dirname(sys.executable)

    return os.path.dirname(os.path.abspath(__file__))


def get_meipass_dir():
    return getattr(
        sys,
        "_MEIPASS",
        None
    )


def buscar_archivo_semilla(nombre):
    cwd = os.getcwd()
    exe_dir = get_exe_dir()
    meipass_dir = get_meipass_dir()

    candidatos = [
        os.path.join(cwd, nombre),
        os.path.join(cwd, "backend", nombre),

        os.path.join(exe_dir, nombre),
        os.path.join(exe_dir, "backend", nombre),
    ]

    if meipass_dir:
        candidatos.extend([
            os.path.join(meipass_dir, nombre),
            os.path.join(meipass_dir, "backend", nombre),
        ])

    for ruta in candidatos:
        if os.path.exists(ruta):
            return ruta

    return None


def preparar_env_y_db():
    appdata_dir = get_appdata_dir()

    appdata_env = os.path.join(
        appdata_dir,
        ".env"
    )

    appdata_db = os.path.join(
        appdata_dir,
        "dentista.db"
    )

    seed_env = buscar_archivo_semilla(
        ".env"
    )

    seed_db = buscar_archivo_semilla(
        "dentista.db"
    )

    if (
        not os.path.exists(appdata_env)
        and
        seed_env
    ):
        shutil.copy2(
            seed_env,
            appdata_env
        )

        print(
            "ENV copiado a AppData:",
            appdata_env
        )

    if (
        not os.path.exists(appdata_db)
        and
        seed_db
    ):
        shutil.copy2(
            seed_db,
            appdata_db
        )

        print(
            "Base copiada a AppData:",
            appdata_db
        )

    if os.path.exists(appdata_env):
        load_dotenv(appdata_env)

    elif seed_env:
        load_dotenv(seed_env)

    sqlite_path = appdata_db.replace(
        "\\",
        "/"
    )

    os.environ["DATABASE_URL"] = (
        f"sqlite:///{sqlite_path}"
    )

    if not os.getenv("AUTH_SECRET_KEY"):
        os.environ["AUTH_SECRET_KEY"] = (
            "DentalApp_Local_Auth_Key_ChangeMe"
        )

    if not os.getenv("RESET_MASTER_KEY"):
        os.environ["RESET_MASTER_KEY"] = (
            "DentalApp_Local_Reset_Key_ChangeMe"
        )

    os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"] = os.getenv(
        "ACCESS_TOKEN_EXPIRE_MINUTES",
        "480"
    )

    return {
        "appdata_dir": appdata_dir,
        "env_path": appdata_env,
        "db_path": appdata_db,
        "seed_env": seed_env,
        "seed_db": seed_db
    }


def main():
    try:
        if backend_ya_corriendo():

            print(
                "Backend ya está corriendo en 127.0.0.1:8000. Cerrando esta instancia."
            )

            return

        info = preparar_env_y_db()

        print("========================================")
        print("Dental Backend iniciado")
        print("AppData dir:", info["appdata_dir"])
        print("ENV:", info["env_path"])
        print("SQLite:", info["db_path"])
        print("Seed ENV:", info["seed_env"])
        print("Seed DB:", info["seed_db"])
        print("DATABASE_URL:", os.getenv("DATABASE_URL"))
        print("URL: http://127.0.0.1:8000/docs")
        print("========================================")

        from main import app

        uvicorn.run(
            app,
            host="127.0.0.1",
            port=8000,
            reload=False,
            access_log=True
        )

    except Exception:
        print("ERROR INICIANDO BACKEND:")
        traceback.print_exc()
        input("Presiona ENTER para cerrar...")


if __name__ == "__main__":
    main()