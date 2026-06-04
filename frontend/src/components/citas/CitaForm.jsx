import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { API_URL } from "../../config";
import { useCitas } from "../../hooks/useCitas";
import { useServicios } from "../../hooks/useServicios";
import {
  formatFecha,
  parseFechaLocal,
  crearFechaLocal
} from "../../utils/fecha";

function CitaForm({ clientes, cita, clientePreset, onCrear, onClose }) {
  const { servicios: catalogoServicios } = useServicios();
  const { crearCita, actualizarCita } = useCitas();

  const isEdit = !!cita;

  const [horaSeleccionadaManual, setHoraSeleccionadaManual] = useState(false);

  const [fechaBase, setFechaBase] = useState(new Date());
  const [hora, setHora] = useState("");
  const [duracion, setDuracion] = useState(30);
  const [motivo, setMotivo] = useState("");
  const [detalle, setDetalle] = useState("");
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clienteId, setClienteId] = useState("");

  useEffect(() => {
    if (clientePreset) {
      setClienteId(clientePreset.id);
    }
  }, [clientePreset]);

  // ✅ CARGAR CITAS
  useEffect(() => {
    fetch(`${API_URL}/citas/`)
      .then((res) => res.json())
      .then(setCitas)
      .catch(() => {
        toast.error("Error al cargar citas ❌");
      });
  }, []);

  // ✅ PRECARGAR SI EDITA
  useEffect(() => {
    if (isEdit && cita) {
      setClienteId(cita.cliente_id || "");
      setMotivo(cita.motivo || "");
      setDetalle(cita.detalle || "");
      setDuracion(cita.duracion || 30);

      const fecha = parseFechaLocal(cita.fecha);

      // ✅ fechaBase solo guarda el día
      const base = new Date(
        fecha.getFullYear(),
        fecha.getMonth(),
        fecha.getDate()
      );

      setFechaBase(base);

      // ✅ hora separada
      const hh = String(fecha.getHours()).padStart(2, "0");
      const mm = String(fecha.getMinutes()).padStart(2, "0");

      setHora(`${hh}:${mm}`);
      setHoraSeleccionadaManual(true);
    }
  }, [cita, isEdit]);

  const generarHoras = () => {
    const horas = [];

    for (let h = 8; h <= 18; h++) {
      for (let m = 0; m < 60; m += 15) {
        horas.push(
          `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
        );
      }
    }

    return horas;
  };

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

  // ✅ VALIDAR OCUPADO
  const estaOcupada = (fechaNueva) => {
    const nuevaInicio = new Date(fechaNueva);
    const nuevaFin = new Date(
      nuevaInicio.getTime() + duracion * 60000
    );

    return citas.some((c) => {
      if (isEdit && c.id === cita.id) return false;

      const existenteInicio = parseFechaLocal(c.fecha);
      const existenteFin = new Date(
        existenteInicio.getTime() + (c.duracion || 30) * 60000
      );

      return (
        nuevaInicio < existenteFin &&
        nuevaFin > existenteInicio
      );
    });
  };

  // ✅ VALIDAR DÍA LLENO
  const estaDiaLleno = (fecha) => {
    const horas = generarHoras();
    const ahora = new Date();

    const disponible = horas.some((h) => {
      const fechaTest = crearFechaLocal(fecha, h);

      if (esHoy(fecha) && fechaTest < ahora) return false;

      return !estaOcupada(fechaTest);
    });

    return !disponible;
  };

  // ✅ BUSCAR SIGUIENTE DÍA DISPONIBLE
  const buscarSiguienteDiaDisponible = (fecha) => {
    let nuevaFecha = new Date(fecha);

    for (let i = 0; i < 30; i++) {
      nuevaFecha.setDate(nuevaFecha.getDate() + 1);

      if (!estaDiaLleno(nuevaFecha)) {
        return new Date(nuevaFecha);
      }
    }

    return null;
  };

  // ✅ AUTO HORA
  useEffect(() => {
    if (isEdit) return;
    if (horaSeleccionadaManual) return;

    const ahora = new Date();

    const libre = generarHoras().find((h) => {
      const fechaTest = crearFechaLocal(fechaBase, h);

      if (esHoy(fechaBase) && fechaTest < ahora) return false;

      return !estaOcupada(fechaTest);
    });

    if (libre) {
      setHora(libre);
    }
  }, [fechaBase, duracion, citas, isEdit, horaSeleccionadaManual]);

  // ✅ SCROLL AL CAMBIAR DÍA
  useEffect(() => {
    document.querySelector(".horas-scroll")?.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    if (!isEdit) {
      setHoraSeleccionadaManual(false);
    }
  }, [fechaBase, isEdit]);

  // ✅ SI EL DÍA NO TIENE HORARIOS, SALTAR AL SIGUIENTE
  useEffect(() => {
    if (!fechaBase) return;
    if (isEdit) return;

    const hayDisponible = generarHoras().some((h) => {
      const fechaTest = crearFechaLocal(fechaBase, h);

      if (esHoy(fechaBase) && fechaTest < new Date()) return false;

      return !estaOcupada(fechaTest);
    });

    if (!hayDisponible) {
      const siguiente = buscarSiguienteDiaDisponible(fechaBase);

      if (
        siguiente &&
        siguiente.toDateString() !== fechaBase.toDateString()
      ) {
        setFechaBase(siguiente);
        setHora("");
        setHoraSeleccionadaManual(false);

        toast.success(
          `Día lleno → movido al ${formatFecha(siguiente)} ✅`,
          { id: "dia-lleno" }
        );
      }
    }
  }, [fechaBase, duracion, citas, isEdit]);

  // ✅ VALIDAR BLOQUE DISPONIBLE
  const bloqueDisponible = (fechaInicio, duracionMin) => {
    const inicio = parseFechaLocal(fechaInicio);
    const fin = new Date(inicio.getTime() + duracionMin * 60000);

    return !citas.some((c) => {
      if (isEdit && c.id === cita.id) return false;

      const existenteInicio = parseFechaLocal(c.fecha);
      const existenteFin = new Date(
        existenteInicio.getTime() + (c.duracion || 30) * 60000
      );

      return (
        inicio < existenteFin &&
        fin > existenteInicio
      );
    });
  };

  // ✅ GUARDAR
  const guardar = async () => {
    if (!clienteId || !hora || !motivo) {
      return toast.error("Completa los campos ⚠️");
    }

    const fechaLocal = crearFechaLocal(fechaBase, hora);

    const fechaFinal =
      fechaLocal.getFullYear() + "-" +
      String(fechaLocal.getMonth() + 1).padStart(2, "0") + "-" +
      String(fechaLocal.getDate()).padStart(2, "0") + "T" +
      String(fechaLocal.getHours()).padStart(2, "0") + ":" +
      String(fechaLocal.getMinutes()).padStart(2, "0") + ":00";

    if (!bloqueDisponible(fechaFinal, duracion)) {
      return toast.error("Ese horario no tiene espacio suficiente ⏰");
    }

    if (parseFechaLocal(fechaFinal) < new Date()) {
      return toast.error("Fecha inválida ⏰");
    }

    setLoading(true);

    try {
      if (isEdit) {
        await actualizarCita.mutateAsync({
          id: cita.id,
          data: {
            cliente_id: parseInt(clienteId),
            fecha: fechaFinal,
            motivo,
            detalle,
            duracion
          }
        });

        toast.success("Cita actualizada ✅");
      } else {
        await crearCita.mutateAsync({
          cliente_id: parseInt(clienteId),
          fecha: fechaFinal,
          motivo,
          detalle,
          duracion
        });

        toast.success("Cita creada ✅");
      }

      onCrear();
      onClose();
    } catch {
      toast.error("Error ❌");
    }

    setLoading(false);
  };

  return (
    <div
      className="
        w-full max-w-3xl
        bg-white rounded-2xl
        shadow-lg border border-gray-200
        p-6 space-y-6
      "
    >
      {/* ✅ HEADER */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          {isEdit ? "Editar cita ✏️" : "Nueva cita 📅"}
        </h2>

        <p className="text-gray-500 text-sm">
          {isEdit
            ? "Modifica los datos de la cita"
            : "Selecciona cliente y servicio"}
        </p>
      </div>

      <form className="grid md:grid-cols-2 gap-5">
        {/* ✅ LEFT */}
        <div className="space-y-4">
          {clientePreset && (
            <div
              className="
                bg-blue-50 border border-blue-200
                px-3 py-2 rounded-lg text-sm flex items-center gap-2
              "
            >
              👤 <span className="text-gray-600">Cliente:</span>
              <strong>
                {clientePreset.nombre} {clientePreset.apellido}
              </strong>
            </div>
          )}

          <select
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            disabled={!!clientePreset}
            className="input"
          >
            <option value="">Cliente</option>
            {clientes.map((c) => (
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
            {catalogoServicios.map((serv) => (
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

        {/* ✅ RIGHT */}
        <div className="space-y-3">
          <div
            className="
              border border-gray-200 rounded-xl
              p-3 bg-gray-50
            "
          >
            <Calendar
              value={fechaBase}
              onChange={(date) => {
                if (estaDiaLleno(date)) {
                  const siguiente = buscarSiguienteDiaDisponible(date);

                  if (siguiente) {
                    setFechaBase(siguiente);
                    setHora("");
                    setHoraSeleccionadaManual(false);

                    toast.success(
                      `Día lleno 🚫 → movido al ${formatFecha(siguiente)} ✅`,
                      { id: "dia-lleno" }
                    );
                  } else {
                    toast.error("No hay días disponibles próximos 🚫", {
                      id: "sin-disponibilidad"
                    });
                  }

                  return;
                }

                setFechaBase(date);
                setHora("");
                setHoraSeleccionadaManual(false);
              }}
              minDate={getHoy()}
            />
          </div>

          <p className="text-xs text-gray-400">
            Horarios disponibles
          </p>

          <div
            className="
              grid grid-cols-3 gap-2
              max-h-44 overflow-y-auto pr-1 horas-scroll
            "
          >
            {generarHoras().map((h) => {
              const fechaTest = crearFechaLocal(fechaBase, h);
              const ahora = new Date();

              const esPasado = esHoy(fechaBase) && fechaTest < ahora;
              const ocupada = estaOcupada(fechaTest);

              return (
                <button
                  type="button"
                  key={h}
                  disabled={ocupada || esPasado}
                  onClick={() => {
                    if (!ocupada && !esPasado) {
                      setHora(h);
                      setHoraSeleccionadaManual(true);
                    }
                  }}
                  className={`
                    text-xs py-2 rounded-lg border transition
                    ${ocupada || esPasado
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : hora === h
                        ? "bg-blue-500 text-white shadow-sm ring-2 ring-blue-300"
                        : "hover:bg-blue-50"}
                  `}
                >
                  {h}
                </button>
              );
            })}
          </div>
        </div>
      </form>

      {/* ✅ RESUMEN */}
      <div
        className={`
          border rounded-xl p-4 text-sm
          ${hora && clienteId
            ? "bg-blue-50 border-blue-200"
            : "bg-gray-50 border-gray-200 opacity-70"}
          transition
        `}
      >
        <p className="font-semibold text-gray-700">
          {hora && clienteId ? "✅ Cita seleccionada" : "Selecciona una hora"}
        </p>

        {hora && clienteId && (
          <>
            <p className="text-blue-600">
              {formatFecha(fechaBase)} — {hora}
            </p>

            <p className="text-gray-500">
              {motivo || "Sin servicio"} • {duracion} min
            </p>
          </>
        )}
      </div>

      {/* ✅ BOTONES */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={guardar}
          disabled={loading}
          className={`
            w-full py-2.5 rounded-xl font-medium
            text-white transition
            ${loading
              ? "bg-gray-400"
              : "bg-blue-500 hover:bg-blue-600"}
          `}
        >
          {loading
            ? "Guardando..."
            : isEdit
              ? "Guardar cambios"
              : "Crear cita"}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="
            w-full py-2.5 rounded-xl
            bg-gray-100 hover:bg-gray-200
            text-gray-700 transition
          "
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default CitaForm;