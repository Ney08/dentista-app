use std::fs;
use std::net::TcpStream;
use std::path::{
    Path,
    PathBuf
};
use std::sync::Mutex;
use std::thread;
use std::time::Duration;

use chrono::{
    DateTime,
    Local
};

use rusqlite::Connection;

use serde::Serialize;

use tauri::Manager;

use tauri_plugin_shell::process::CommandChild;
use tauri_plugin_shell::ShellExt;


/*
==========================================
OPEN PDF
==========================================
*/

#[tauri::command]
fn open_pdf(path: String) -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        std::process::Command::new("cmd")
            .args(["/C", "start", "", path.as_str()])
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    #[cfg(target_os = "macos")]
    {
        std::process::Command::new("open")
            .arg(path)
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    #[cfg(target_os = "linux")]
    {
        std::process::Command::new("xdg-open")
            .arg(path)
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    Ok(())
}


/*
==========================================
BACKUP INFO
==========================================
*/

#[derive(Serialize)]
struct BackupInfo {
    existe: bool,
    ruta: Option<String>,
    nombre: Option<String>,
    fecha: Option<String>,
}


/*
==========================================
LOCALIZAR BASE SQLITE
==========================================
*/


fn buscar_base_sqlite() -> Result<PathBuf, String> {
    if let Ok(appdata) = std::env::var("APPDATA") {
        let appdata_db =
            PathBuf::from(appdata)
                .join("DentistaApp")
                .join("dentista.db");

        if appdata_db.exists() {
            return Ok(appdata_db);
        }
    }

    let mut bases_inicio: Vec<PathBuf> =
        Vec::new();

    if let Ok(current_dir) = std::env::current_dir() {
        bases_inicio.push(
            current_dir
        );
    }

    if let Ok(exe_path) = std::env::current_exe() {
        if let Some(exe_dir) = exe_path.parent() {
            bases_inicio.push(
                exe_dir.to_path_buf()
            );
        }
    }

    let manifest_dir =
        PathBuf::from(
            env!("CARGO_MANIFEST_DIR")
        );

    bases_inicio.push(
        manifest_dir
    );

    let nombres_db = [
        "dentista.db",
        "database.db"
    ];

    let mut rutas_probadas: Vec<String> =
        Vec::new();

    for base in bases_inicio {
        let mut actual =
            Some(
                base.as_path()
            );

        while let Some(dir) = actual {
            for nombre_db in nombres_db {
                let candidato =
                    dir
                        .join("backend")
                        .join(nombre_db);

                rutas_probadas.push(
                    candidato
                        .to_string_lossy()
                        .to_string()
                );

                if candidato.exists() {
                    return Ok(
                        candidato
                    );
                }

                let candidato_directo =
                    dir.join(
                        nombre_db
                    );

                rutas_probadas.push(
                    candidato_directo
                        .to_string_lossy()
                        .to_string()
                );

                if candidato_directo.exists() {
                    return Ok(
                        candidato_directo
                    );
                }
            }

            actual =
                dir.parent();
        }
    }

    Err(
        format!(
            "No se encontró la base SQLite. Rutas probadas:\n{}",
            rutas_probadas.join("\n")
        )
    )
}


/*
==========================================
CREAR BACKUP SQLITE
==========================================
*/

#[tauri::command]
fn crear_backup_sqlite() -> Result<String, String> {
    let db_path =
        buscar_base_sqlite()?;

    let backup_dir =
        PathBuf::from(
            "C:\\Backups\\DentalApp"
        );

    fs::create_dir_all(
        &backup_dir
    )
    .map_err(|e| {
        format!(
            "No se pudo crear la carpeta de backup: {}",
            e
        )
    })?;

    let fecha =
        Local::now()
            .format("%Y-%m-%d_%H-%M-%S")
            .to_string();

    let backup_path =
        backup_dir.join(
            format!(
                "dentista_backup_{}.db",
                fecha
            )
        );

    let backup_path_str =
        backup_path
            .to_string_lossy()
            .replace("'", "''");

    let conn =
        Connection::open(
            &db_path
        )
        .map_err(|e| {
            format!(
                "No se pudo abrir la base SQLite: {}",
                e
            )
        })?;

    let sql =
        format!(
            "VACUUM INTO '{}'",
            backup_path_str
        );

    conn.execute(
        &sql,
        []
    )
    .map_err(|e| {
        format!(
            "No se pudo crear el backup SQLite: {}",
            e
        )
    })?;

    Ok(
        backup_path
            .to_string_lossy()
            .to_string()
    )
}


/*
==========================================
OBTENER ÚLTIMO BACKUP SQLITE
==========================================
*/

#[tauri::command]
fn obtener_ultimo_backup_sqlite() -> Result<BackupInfo, String> {
    let backup_dir =
        "C:\\Backups\\DentalApp";

    let path =
        Path::new(
            backup_dir
        );

    if !path.exists() {
        return Ok(
            BackupInfo {
                existe: false,
                ruta: None,
                nombre: None,
                fecha: None,
            }
        );
    }

    let entries =
        fs::read_dir(
            path
        )
        .map_err(|e| {
            format!(
                "No se pudo leer la carpeta de backup: {}",
                e
            )
        })?;

    let mut ultimo: Option<(String, String, std::time::SystemTime)> =
        None;

    for entry in entries {
        let entry =
            entry.map_err(|e| e.to_string())?;

        let entry_path =
            entry.path();

        if !entry_path.is_file() {
            continue;
        }

        let extension =
            entry_path
                .extension()
                .and_then(|e| e.to_str())
                .unwrap_or("");

        if extension != "db" {
            continue;
        }

        let nombre =
            entry_path
                .file_name()
                .and_then(|n| n.to_str())
                .unwrap_or("")
                .to_string();

        if !nombre.starts_with("dentista_backup_") {
            continue;
        }

        let metadata =
            entry
                .metadata()
                .map_err(|e| e.to_string())?;

        let modified =
            metadata
                .modified()
                .map_err(|e| e.to_string())?;

        let ruta =
            entry_path
                .to_string_lossy()
                .to_string();

        match &ultimo {
            Some((_, _, current_modified)) => {
                if modified > *current_modified {
                    ultimo =
                        Some(
                            (
                                ruta,
                                nombre,
                                modified
                            )
                        );
                }
            }

            None => {
                ultimo =
                    Some(
                        (
                            ruta,
                            nombre,
                            modified
                        )
                    );
            }
        }
    }

    if let Some((ruta, nombre, modified)) = ultimo {
        let fecha_local: DateTime<Local> =
            modified.into();

        let fecha =
            fecha_local
                .format("%d/%m/%Y %I:%M %p")
                .to_string();

        return Ok(
            BackupInfo {
                existe: true,
                ruta: Some(ruta),
                nombre: Some(nombre),
                fecha: Some(fecha),
            }
        );
    }

    Ok(
        BackupInfo {
            existe: false,
            ruta: None,
            nombre: None,
            fecha: None,
        }
    )
}


/*
==========================================
ALIAS TEMPORALES
==========================================
Estos alias evitan romper el frontend si todavía llama:
crear_backup_postgres
obtener_ultimo_backup_postgres
==========================================
*/

#[tauri::command]
fn crear_backup_postgres() -> Result<String, String> {
    crear_backup_sqlite()
}

#[tauri::command]
fn obtener_ultimo_backup_postgres() -> Result<BackupInfo, String> {
    obtener_ultimo_backup_sqlite()
}


/*
==========================================
BACKEND SIDECAR STATE
==========================================
*/

struct BackendProcess(
    Mutex<Option<CommandChild>>
);


/*
==========================================
BACKEND HELPERS
==========================================
*/

fn backend_running() -> bool {
    TcpStream::connect(
        "127.0.0.1:8000"
    )
    .is_ok()
}

fn wait_for_backend() -> bool {
    for _ in 0..20 {
        if backend_running() {
            return true;
        }

        thread::sleep(
            Duration::from_millis(500)
        );
    }

    false
}

fn buscar_backend_dir() -> PathBuf {
    let mut candidates: Vec<PathBuf> =
        Vec::new();

    if let Ok(current_dir) = std::env::current_dir() {
        candidates.push(
            current_dir.join("backend")
        );

        candidates.push(
            current_dir
                .join("..")
                .join("backend")
        );

        candidates.push(
            current_dir
                .join("..")
                .join("..")
                .join("backend")
        );
    }

    if let Ok(exe_path) = std::env::current_exe() {
        if let Some(exe_dir) = exe_path.parent() {
            candidates.push(
                exe_dir.join("backend")
            );

            candidates.push(
                exe_dir
                    .join("..")
                    .join("backend")
            );
        }
    }

    for candidate in candidates {
        if candidate.exists() {
            return candidate;
        }
    }

    std::env::current_dir()
        .unwrap_or_else(|_| PathBuf::from("."))
}


/*
==========================================
KILL BACKEND
==========================================
*/

fn kill_backend_process<R: tauri::Runtime>(
    app_handle: &tauri::AppHandle<R>
) {
    let state =
        app_handle.state::<BackendProcess>();

    let child_to_kill = {

        let mut backend =
            match state.0.lock() {
                Ok(guard) => guard,
                Err(_) => return
            };

        backend.take()

    };

    if let Some(child) = child_to_kill {

        let _ =
            child.kill();

    }
}


/*
==========================================
TAURI RUN
==========================================
*/

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()

        .plugin(
            tauri_plugin_log::Builder::default()
                .level(log::LevelFilter::Info)
                .build(),
        )

        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init())

        .setup(|app| {

            app.manage(
                BackendProcess(
                    Mutex::new(None)
                )
            );

            if !backend_running() {

                let backend_dir =
                    buscar_backend_dir();

                let sidecar =
                    app
                        .shell()
                        .sidecar("dental_backend")
                        .map_err(|e| {
                            Box::<dyn std::error::Error>::from(e)
                        })?;

                let (_rx, child) =
                    sidecar
                        .current_dir(
                            backend_dir
                        )
                        .spawn()
                        .map_err(|e| {
                            Box::<dyn std::error::Error>::from(e)
                        })?;

                let state =
                    app.state::<BackendProcess>();

                *state.0.lock().unwrap() =
                    Some(child);

                wait_for_backend();

            }

            Ok(())

        })

        .on_window_event(|window, event| {

            if let tauri::WindowEvent::CloseRequested { .. } = event {

                kill_backend_process(
                    &window.app_handle()
                );

            }

        })

        .invoke_handler(
            tauri::generate_handler![
                open_pdf,
                crear_backup_sqlite,
                obtener_ultimo_backup_sqlite,
                crear_backup_postgres,
                obtener_ultimo_backup_postgres
            ]
        )

        .run(
            tauri::generate_context!()
        )
        .expect(
            "error while running tauri application"
        );
}