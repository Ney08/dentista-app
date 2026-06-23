use std::fs;
use std::path::Path;
use std::process::Command;

use chrono::{
  DateTime,
  Local
};

use serde::Serialize;

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

#[tauri::command]
fn crear_backup_postgres() -> Result<String, String> {
  /*
  ==========================================
  CONFIGURACIÓN
  ==========================================
  */

  let db_name =
    "dentista_db";

  let db_user =
    "postgres";

  let db_password =
    "1212";

  let pg_dump_path =
    "C:\\Program Files\\PostgreSQL\\18\\bin\\pg_dump.exe";

  let backup_dir =
    "C:\\Backups\\DentalApp";

  fs::create_dir_all(
    backup_dir
  )
  .map_err(|e| {
    format!(
      "No se pudo crear la carpeta de backup: {}",
      e
    )
  })?;

  /*
  ==========================================
  NOMBRE DEL ARCHIVO
  ==========================================
  */

  let fecha =
    Local::now()
      .format("%Y-%m-%d_%H-%M-%S")
      .to_string();

  let backup_path =
    format!(
      "{}\\dentalapp_{}.backup",
      backup_dir,
      fecha
    );

  /*
  ==========================================
  EJECUTAR PG_DUMP
  ==========================================
  */

  let output =
    Command::new(pg_dump_path)
      .env(
        "PGPASSWORD",
        db_password
      )
      .args([
        "-U",
        db_user,
        "-d",
        db_name,
        "-F",
        "c",
        "-f",
        &backup_path
      ])
      .output()
      .map_err(|e| {
        format!(
          "Error ejecutando pg_dump: {}",
          e
        )
      })?;

  if !output.status.success() {
    let error =
      String::from_utf8_lossy(
        &output.stderr
      );

    return Err(
      format!(
        "No se pudo crear el backup: {}",
        error
      )
    );
  }

  Ok(backup_path)
}

#[derive(Serialize)]
struct BackupInfo {
  existe: bool,
  ruta: Option<String>,
  nombre: Option<String>,
  fecha: Option<String>,
}

#[tauri::command]
fn obtener_ultimo_backup_postgres() -> Result<BackupInfo, String> {
  let backup_dir =
    "C:\\Backups\\DentalApp";

  let path =
    Path::new(backup_dir);

  if !path.exists() {
    return Ok(BackupInfo {
      existe: false,
      ruta: None,
      nombre: None,
      fecha: None,
    });
  }

  let entries =
    fs::read_dir(path)
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

    if extension != "backup" {
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

    let nombre =
      entry_path
        .file_name()
        .and_then(|n| n.to_str())
        .unwrap_or("")
        .to_string();

    match &ultimo {
      Some((_, _, current_modified)) => {
        if modified > *current_modified {
          ultimo =
            Some((ruta, nombre, modified));
        }
      }

      None => {
        ultimo =
          Some((ruta, nombre, modified));
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

    return Ok(BackupInfo {
      existe: true,
      ruta: Some(ruta),
      nombre: Some(nombre),
      fecha: Some(fecha),
    });
  }

  Ok(BackupInfo {
    existe: false,
    ruta: None,
    nombre: None,
    fecha: None,
  })
}

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

    .invoke_handler(tauri::generate_handler![
      open_pdf,
      crear_backup_postgres,
      obtener_ultimo_backup_postgres
    ])

    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}