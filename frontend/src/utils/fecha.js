// ✅ parsear fecha local (SIN UTC)
export const parseFechaLocal = (fechaStr) => {
  if (!fechaStr) return null;

  // ✅ si ya es Date, devolverla limpia
  if (fechaStr instanceof Date) return fechaStr;

  // ✅ si no es string, intentar convertir
  if (typeof fechaStr !== "string") {
    return new Date(fechaStr);
  }

  const [date, time] = fechaStr.split("T");

  if (!date || !time) return new Date(fechaStr);

  const [year, month, day] = date.split("-");
  const [hour, minute] = time.split(":");

  return new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    parseInt(hour),
    parseInt(minute),
    0
  );
};

// ✅ FORMATEOS usando fecha parseada

export const formatFecha = (fecha) => {
  const f = parseFechaLocal(fecha);
  if (!f) return "";

  return f.toLocaleDateString("es-DO");
};

export const formatHora = (fecha) => {
  const f = parseFechaLocal(fecha);
  if (!f) return "";

  return f.toLocaleTimeString("es-DO", {
    hour: "2-digit",
    minute: "2-digit"
  });
};

export const formatFechaCompleta = (fecha) => {
  const f = parseFechaLocal(fecha);
  if (!f) return "";

  return f.toLocaleString("es-DO");
};

export const formatFriendly = (fecha) => {
  const f = parseFechaLocal(fecha);
  if (!f) return "";

  return f.toLocaleString("es-DO", {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
};

// ✅ crear fecha local desde base + hora
export const crearFechaLocal = (fechaBase, horaStr) => {
  const [h, m] = horaStr.split(":");

  const fecha = new Date(fechaBase);
  fecha.setHours(parseInt(h));
  fecha.setMinutes(parseInt(m));
  fecha.setSeconds(0);
  fecha.setMilliseconds(0);

  return fecha;
};





// ✅ Parse UTC seguro
export const parseUTC = (fecha) => {

  if (!fecha) return null;

  return new Date(fecha);
};




export const formatUTCFechaHora = (fecha) => {

  const f = parseUTC(fecha);

  if (!f || isNaN(f)) return "";

  return f.toLocaleString("es-DO", {
    dateStyle: "short",
    timeStyle: "short"
  });
};
