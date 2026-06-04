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

    <div
      className="
        space-y-3 pr-2"
        
    >


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
            group flex items-center justify-between gap-4
            bg-white border rounded-xl p-4
            transition-all duration-200 ease-out
            cursor-pointer
              
            ${borderEstado[estado]} border-l-4
            ${estado === "cancelada" ? "opacity-60" : ""}
            hover:shadow-md hover:bg-gray-50
          `}
          >

            {/* ✅ IZQUIERDA */}
            <div className="flex items-center gap-3">

              {/* AVATAR */}
              <div className="
    w-9 h-9 rounded-full bg-blue-500 text-white
    flex items-center justify-center text-xs font-semibold
  ">
                {c.cliente?.nombre?.charAt(0)}
              </div>

              {/* INFO */}
              <div className="leading-tight space-y-1">

                {/* 🔥 NOMBRE + BADGE */}
                <div className="flex items-center gap-2 flex-wrap">

                  <p className="text-sm font-semibold text-gray-800">
                    {c.cliente?.nombre} {c.cliente?.apellido}
                  </p>

                  <span
                    className={`
          text-[10px] font-medium px-2 py-[2px] rounded-full
          ${coloresEstado[estado]}
        `}
                  >
                    {estadoLabel[estado]}
                  </span>

                </div>

                {/* FECHA */}
                <p className="text-xs text-gray-500">
                  {formatFecha(fecha)} — {formatHora(fecha)}
                </p>

                {/* MOTIVO + DURACIÓN */}
                <p className="text-xs text-gray-400">
                  {c.motivo} · {c.duracion} min
                </p>

              </div>

            </div>

            {/* ✅ DERECHA */}
            <div className="flex items-center gap-2">

              {/* ✅ BADGE PRO */}


              {/* ✅ BOTONES (HOVER ONLY) */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="
                flex items-center gap-1
                opacity-0 group-hover:opacity-100
                transition-opacity duration-200
              "
              >

                {estado === "pendiente" && (
                  <>
                    <button
                      onClick={() => onCompletar(c.id)}
                      className="
                      text-green-500 hover:text-green-600
                      hover:bg-green-100
                      p-2 rounded-md transition
                    "
                      title="Completar"
                    >
                      ✅
                    </button>

                    <button
                      onClick={() => onEditar(c)}
                      className="
                      text-blue-500 hover:text-blue-600
                      hover:bg-blue-100
                      p-2 rounded-md transition
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
                      p-2 rounded-md transition
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
                      p-2 rounded-md transition
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
    p-2 rounded-md transition
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