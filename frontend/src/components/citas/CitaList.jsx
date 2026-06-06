import { formatFecha, formatHora, parseFechaLocal } from "../../utils/fecha";
import { useState } from "react";
import ConfirmModal from "../../components/ConfirmModal";

function CitaList({ citas, getEstado, porPagina, onEditar, onCompletar, onCancelar }) {

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

        return (

          <div
            key={c.id}
            className={`
              group flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 bg-white border rounded-2xl px-3 sm:px-4 py-3 sm:py-4 transition-all duration-200 ease-out hover:-translate-y-[1px] shadow-sm hover:shadow-lg hover:bg-gray-50
              ${borderEstado[estado]} border-l-4
              ${estado === "cancelada" ? "opacity-60" : ""}
            `}
          >

            {/* LEFT */}
            <div className="flex items-center gap-3 min-w-0 flex-1">

              {/* AVATAR */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold shrink-0">
                {c.cliente?.nombre?.charAt(0)}
              </div>

              {/* INFO */}
              <div className="leading-tight space-y-1 min-w-0">

                <div className="flex items-center gap-2 flex-wrap">

                  <p className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                    {c.cliente?.nombre} {c.cliente?.apellido}
                  </p>

                  <span className={`text-[11px] font-medium px-2 py-1 rounded-full ${coloresEstado[estado]}`}>
                    {estadoLabel[estado]}
                  </span>

                </div>

                <p className="text-xs sm:text-sm text-gray-500">
                  {formatFecha(fecha)} — {formatHora(fecha)}
                </p>

                <p className="text-xs sm:text-sm text-gray-400 truncate">
                  {c.motivo} · {c.duracion} min
                </p>

              </div>

            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2 shrink-0">

              {/* ACTIONS */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 opacity-100 md:opacity-20 md:group-hover:opacity-100 transition-all duration-300"
              >

                {/* PENDIENTE */}
                {estado === "pendiente" && (
                  <>

                    {/* FACTURAR */}
                    <button
                      onClick={() => onCompletar(c)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-green-300 hover:text-green-500 hover:bg-green-50 hover:scale-110 active:scale-95 transition-all duration-200"
                      title="Facturar cita"
                    >
                      ✅
                    </button>

                    {/* EDITAR */}
                    <button
                      onClick={() => onEditar(c)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-300 hover:text-blue-500 hover:bg-blue-50 hover:scale-110 active:scale-95 transition-all duration-200"
                      title="Editar"
                    >
                      ✏️
                    </button>

                    {/* CANCELAR */}
                    <button
                      onClick={() => setCitaCancelar(c)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-slate-500 hover:bg-slate-100 hover:scale-110 active:scale-95 transition-all duration-200"
                      title="Cancelar"
                    >
                      ⛔
                    </button>

                  </>
                )}

                {/* ATRASADA */}
                {estado === "atrasada" && (
                  <>

                    {/* EDITAR */}
                    <button
                      onClick={() => onEditar(c)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-300 hover:text-blue-500 hover:bg-blue-50 hover:scale-110 active:scale-95 transition-all duration-200"
                      title="Editar"
                    >
                      ✏️
                    </button>

                    {/* CANCELAR */}
                    <button
                      onClick={() => setCitaCancelar(c)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-red-300 hover:text-red-500 hover:bg-red-50 hover:scale-110 active:scale-95 transition-all duration-200"
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

      {/* CONFIRM MODAL */}
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