const asegurarUTC = (fecha) => {
  if (!fecha) return null;

  // ✅ si ya tiene Z no lo toca
  if (typeof fecha === "string" && !fecha.endsWith("Z")) {
    return fecha + "Z"; 
  }

  return fecha;
};

export const formatFecha = (fecha) => {
  const f = asegurarUTC(fecha);
  if (!f) return "";

  return new Date(f).toLocaleDateString("es-DO", {
    timeZone: "America/Santo_Domingo"
  });
};

export const formatHora = (fecha) => {
  const f = asegurarUTC(fecha);
  if (!f) return "";

  return new Date(f).toLocaleTimeString("es-DO", {
    timeZone: "America/Santo_Domingo",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
};

export const formatFechaCompleta = (fecha) => {
  const f = asegurarUTC(fecha);
  if (!f) return "";

  return new Date(f).toLocaleString("es-DO", {
    timeZone: "America/Santo_Domingo"
  });
};

export const formatFriendly = (fecha) => {
  const f = asegurarUTC(fecha);

  return new Date(f).toLocaleString("es-DO", {
    timeZone: "America/Santo_Domingo",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
};

export const parseFechaLocal = (fecha) => {
  const f = asegurarUTC(fecha);
  return new Date(f); 
};



export const crearFechaLocal = (fechaBase, horaStr) => {
  const [h, m] = horaStr.split(":");

  const fecha = new Date(fechaBase);
  fecha.setHours(parseInt(h));
  fecha.setMinutes(parseInt(m));
  fecha.setSeconds(0);
  fecha.setMilliseconds(0);

  return fecha;
};

