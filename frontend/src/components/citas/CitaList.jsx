import { formatFecha, formatHora, parseFechaLocal } from "../../utils/fecha";
import { useState } from "react";
import ConfirmModal from "../../components/ConfirmModal";
function CitaList({
  citas,
  getEstado,
  porPagina,
  onEditar,
  onCompletar,
  onCancelar
}) {
  const [citaCancelar, setCitaCancelar] = useState(null);
  return (

    <div className="h-full space-y-2 sm:space-y-3 overflow-y-auto overflow-x-hidden pr-1 pb-2">


      {citas.map((c) => {

        const estado = getEstado(c);
        const fecha = parseFechaLocal(c.fecha);

        const coloresEstado = {
          pendiente: "bg-yellow-100 text-yellow-700",
          atrasada: "bg-red-100 text-red-600",
          completada: "bg-green-100 text-green-700",
          cancelada: "bg-gray-200 text-gray-600"
        };

        const borderEstado = {
          pendiente: "border-l-yellow-400",
          atrasada: "border-l-red-400",
          completada: "border-l-green-400",
          cancelada: "border-l-gray-400"
        };

        const estadoLabel = {
          pendiente: "Pendiente",
          atrasada: "Atrasada",
          completada: "Completada",
          cancelada: "Cancelada"
        };

        const letra = c.cliente?.nombre?.charAt(0)?.toUpperCase();

        return (

          <div
            key={c.id}
            className={`
  group
  flex flex-col lg:flex-row
  lg:items-center
  lg:justify-between
  gap-3

  bg-white
  border
  rounded-2xl

  px-3 sm:px-4
  py-3 sm:py-4

  transition-all duration-200 ease-out

  ${borderEstado[estado]} border-l-4
  ${estado === "cancelada" ? "opacity-60" : ""}

  hover:shadow-sm
  hover:bg-gray-50
`}
          >

            {/* ✅ IZQUIERDA */}
            <div className="flex items-center gap-3 min-w-0 flex-1">

              {/* AVATAR */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold shrink-0">
                {c.cliente?.nombre?.charAt(0)}
              </div>

              {/* INFO */}
              <div className="leading-tight space-y-1 min-w-0">

                {/* 🔥 NOMBRE + BADGE */}
                <div className="flex items-center gap-2 flex-wrap">

                  <p className="text-sm sm:text-base font-semibold text-gray-800 truncate">

                    {c.cliente?.nombre} {c.cliente?.apellido}
                  </p>

                  <span
                    className={`
          text-[11px] font-medium px-2 py-1 rounded-full
          ${coloresEstado[estado]}
        `}
                  >
                    {estadoLabel[estado]}
                  </span>

                </div>

                {/* FECHA */}
                <p className="text-xs sm:text-sm text-gray-500">
                  {formatFecha(fecha)} — {formatHora(fecha)}
                </p>

                {/* MOTIVO + DURACIÓN */}
                <p className="text-xs sm:text-sm text-gray-400 truncate">
                  {c.motivo} · {c.duracion} min
                </p>

              </div>

            </div>

            {/* ✅ DERECHA */}
            <div className="flex items-center justify-between lg:justify-end gap-2 w-full lg:w-auto pt-1 lg:pt-0">

              {/* ✅ BADGE PRO */}


              {/* ✅ BOTONES (HOVER ONLY) */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="
  flex items-center gap-1.5

  opacity-100
  lg:opacity-30
  lg:group-hover:opacity-100

  transition-all duration-200
"

              >

                {estado === "pendiente" && (
                  <>
                    <button
                      onClick={() => onCompletar(c)}
                      className="
        text-green-500 hover:text-green-600
        hover:bg-green-100
        p-2 rounded-xl transition
      "
                      title="Facturar cita"
                    >
                      ✅
                    </button>

                    <button
                      onClick={() => onEditar(c)}
                      className="
        text-blue-500 hover:text-blue-600
        hover:bg-blue-100
        p-2 rounded-xl transition
      "
                      title="Editar"
                    >
                      ✏️
                    </button>

                    <button
                      onClick={() => setCitaCancelar(c)}
                      className="
        text-gray-500 hover:text-gray-600
        hover:bg-gray-200
        p-2 rounded-xl transition
      "
                      title="Cancelar"
                    >
                      ⛔
                    </button>
                  </>
                )}

                {estado === "atrasada" && (
                  <>
                    <button
                      onClick={() => onEditar(c)}
                      className="
        text-blue-500 hover:text-blue-600
        hover:bg-blue-100
        p-2 rounded-xl transition
      "
                      title="Editar"
                    >
                      ✏️
                    </button>

                    <button
                      onClick={() => setCitaCancelar(c)}
                      className="
        text-red-500 hover:text-red-600
        hover:bg-red-100
        p-2 rounded-xl transition
      "
                      title="Cancelar"
                    >
                      ⛔
                    </button>
                  </>
                )}

              </div>

            </div>

          </div>

        );
      })}




      {citaCancelar && (
        <ConfirmModal

          mensaje={`
¿Cancelar la cita de ${citaCancelar.cliente?.nombre}?
📅 ${formatFecha(parseFechaLocal(citaCancelar.fecha))}
⏰ ${formatHora(parseFechaLocal(citaCancelar.fecha))}
`}

          onConfirm={() => {
            onCancelar(citaCancelar.id);
            setCitaCancelar(null);
          }}
          onCancel={() => setCitaCancelar(null)}
        />
      )}



    </div>
  );

}

export default CitaList;