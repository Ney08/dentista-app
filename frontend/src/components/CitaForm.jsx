import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import serviciosCatalogo from "../data/servicios.json";

function CitaForm({ clientes, onCrear }) {

  const [clienteId, setClienteId] = useState("");
  const [fechaBase, setFechaBase] = useState(new Date());
  const [hora, setHora] = useState("");
  const [duracion, setDuracion] = useState(30);
  const [motivo, setMotivo] = useState("");
  const [detalle, setDetalle] = useState("");
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("https://dentista-backend-uspt.onrender.com/citas/")
      .then(res => res.json())
      .then(setCitas);
  }, []);

  const estaOcupada = (fechaNueva) => {
    const nueva = new Date(fechaNueva);

    return citas.some((c) => {
      const existente = new Date(c.fecha);
      const diff = Math.abs(nueva - existente) / (1000 * 60);
      return diff < duracion;
    });
  };

  const generarHoras = () => {
    const horas = [];
    for (let h = 8; h <= 18; h++) {
      for (let m = 0; m < 60; m += duracion) {
        horas.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
      }
    }
    return horas;
  };

  // ✅ NORMALIZAR HOY (SIN HORA)
  const getHoy = () => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return hoy;
  };

  const esHoy = (fecha) => {
    const hoy = getHoy();
    const test = new Date(fecha);
    test.setHours(0, 0, 0, 0);
    return test.getTime() === hoy.getTime();
  };

  // ✅ AUTO SELECCIÓN HORA
  useEffect(() => {
    const ahora = new Date();

    const libre = generarHoras().find(h => {
      const fechaTest = new Date(`${fechaBase.toISOString().split("T")[0]}T${h}`);

      if (esHoy(fechaBase) && fechaTest < ahora) return false;

      return !estaOcupada(fechaTest);
    });

    if (libre) setHora(libre);

  }, [fechaBase, duracion]);

  // ✅ SCROLL
  useEffect(() => {
    document.querySelector(".horas-scroll")?.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [fechaBase]);

  const crear = async () => {
    if (!clienteId || !hora || !motivo)
      return toast.error("Completa los campos ⚠️");

    const fechaFinal = `${fechaBase.toISOString().split("T")[0]}T${hora}`;

    if (estaOcupada(fechaFinal))
      return toast.error("Horario ocupado ⏰");

    if (new Date(fechaFinal) < new Date())
      return toast.error("Fecha inválida ⏰");

    setLoading(true);

    try {
      await fetch("https://dentista-backend-uspt.onrender.com/citas/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente_id: parseInt(clienteId),
          fecha: fechaFinal,
          motivo,
          detalle
        })
      });

      toast.success("Cita creada ✅");

      setClienteId("");
      setHora("");
      setMotivo("");
      setDetalle("");

      onCrear();

    } catch {
      toast.error("Error ❌");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md border p-6 space-y-6">

      <div className="text-center">
        <h2 className="text-xl font-bold">Nueva cita 📅</h2>
        <p className="text-sm text-gray-500">
          Selecciona cliente y servicio
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {/* LEFT */}
        <div className="space-y-4">

          <select
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            className="input"
          >
            <option value="">Cliente</option>
            {clientes.map(c => (
              <option key={c.id} value={c.id}>
                {c.nombre} {c.apellido}
              </option>
            ))}
          </select>

          <select
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className="input"
          >
            <option value="">Servicio / Motivo</option>
            {serviciosCatalogo.map(serv => (
              <option key={serv.id} value={serv.nombre}>
                {serv.nombre}
              </option>
            ))}
          </select>

          <input
            placeholder="Detalle adicional (opcional)"
            value={detalle}
            onChange={(e) => setDetalle(e.target.value)}
            className="input"
          />

          <select
            value={duracion}
            onChange={(e) => setDuracion(parseInt(e.target.value))}
            className="input"
          >
            <option value={30}>30 min</option>
            <option value={45}>45 min</option>
            <option value={60}>1 hora</option>
          </select>

        </div>

        {/* RIGHT */}
        <div className="space-y-3">

          <div className="border rounded-lg p-2">
            <Calendar
              value={fechaBase}
              onChange={setFechaBase}
              minDate={getHoy()} // ✅ BLOQUEA FECHAS PASADAS
            />
          </div>

          <p className="text-xs text-gray-400">
            Horarios disponibles
          </p>

          <div className="grid grid-cols-3 gap-2 max-h-44 overflow-y-auto pr-1 horas-scroll">

            {generarHoras().map((h) => {

              const fechaTest = new Date(`${fechaBase.toISOString().split("T")[0]}T${h}`);
              const ahora = new Date();

              if (esHoy(fechaBase) && fechaTest < ahora) return null;
              if (estaOcupada(fechaTest)) return null;

              return (
                <button
                  key={h}
                  onClick={() => setHora(h)}
                  className={`
                    text-sm px-2 py-2 rounded-lg border transition-all
                    ${hora === h
                      ? "bg-blue-500 text-white shadow-md scale-105 ring-2 ring-blue-300"
                      : "hover:bg-blue-50"}
                  `}
                >
                  {h}
                </button>
              );
            })}

          </div>

        </div>

      </div>

      {hora && clienteId && (
        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm">

          <p className="font-semibold text-blue-700">
            ✅ Cita seleccionada
          </p>

          <p className="text-blue-600">
            {new Date(fechaBase).toLocaleDateString()} — {hora}
          </p>

          <p className="text-gray-600">
            {motivo || "Sin servicio"} • {duracion} min
          </p>

        </div>
      )}

      <button
        onClick={crear}
        disabled={loading}
        className="
          w-full py-3 rounded-xl text-white font-semibold
          bg-gradient-to-r from-green-500 to-green-600
          shadow-md hover:shadow-lg
          hover:scale-[1.02] active:scale-95
          transition
        "
      >
        {loading ? "Creando..." : "✅ Crear cita"}
      </button>

    </div>
  );
}

export default CitaForm;