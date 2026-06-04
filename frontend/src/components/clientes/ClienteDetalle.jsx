import { useState } from "react";
import HistorialForm from "./HistorialForm";
import BaseModal from "../BaseModal";
import { useHistorial } from "../../hooks/useHistorial";
import { formatFecha } from "../../utils/fecha";

function ClienteDetalle({ cliente }) {

  const { historial = [], isLoading, crearHistorial } = useHistorial(cliente?.id);
  const [notaSeleccionada, setNotaSeleccionada] = useState(null);

  //  helper texto

  const cortarTexto = (texto, limite = 30) => {
    if (!texto) return "";
    return texto.length > limite
      ? texto.slice(0, limite) + "..."
      : texto;
  };


  if (!cliente?.id) return <p>Selecciona un cliente...</p>;
  if (isLoading) return <p>Cargando historial...</p>;

  return (
    <div className="space-y-4 sm:space-y-5">

      {/* ✅ FORM */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3 shrink-0">
        <h4 className="text-sm sm:text-base font-semibold text-gray-600">
          📝 Agregar nota clínica
        </h4>

        <HistorialForm
          clienteId={cliente.id}
          onAdd={(data) => crearHistorial.mutate(data)}
        />
      </div>

      {/* ✅ TÍTULO HISTORIAL */}
      <h4 className="text-sm sm:text-base font-semibold text-gray-600">
        📚 Historial
      </h4>

      {/* ✅ LISTA CON SCROLL */}
      <div className="flex-1 min-h-0 max-h-[320px] sm:max-h-[360px] overflow-y-auto overflow-x-hidden pr-1 space-y-3">

        {(!historial || historial.length === 0) ? (
          <p className="text-gray-500 text-sm">
            No hay historial...
          </p>
        ) : (

          (historial || []).map((h) => (
            <div
              key={h.id}
              onClick={() => setNotaSeleccionada(h)}
              className="group flex gap-3 cursor-pointer items-start"
            >

              {/* 🔵 DOT (timeline) */}
              <div className="mt-2.5 w-2.5 h-2.5 bg-blue-500 rounded-full shrink-0" />

              {/* ✅ CARD */}
              <div
                className="
  flex-1 bg-white border border-gray-200
  rounded-2xl p-3 sm:p-4 shadow-sm
  hover:shadow-sm hover:bg-gray-50 hover:border-gray-300
  transition-all duration-200
"
              >

                <p className="text-sm sm:text-base leading-relaxed break-words">


                  {cortarTexto(h.descripcion)}

                  {h.descripcion?.length > 80 && (
                    <span className="text-blue-500 text-xs ml-1">
                      ver más
                    </span>
                  )}

                </p>

                <p className="text-xs sm:text-sm text-gray-400 mt-2">
                  {formatFecha(h.fecha)}
                </p>

              </div>

            </div>
          ))

        )}

      </div>

      {/* ✅ MODAL DETALLE PRO */}
      {notaSeleccionada && (
        <BaseModal onClose={() => setNotaSeleccionada(null)}>

          <div className="flex flex-col gap-4 sm:gap-5 min-h-0 h-full overflow-hidden">

            {/* ✅ HEADER PRO */}
            <div className="sticky top-0 z-10 bg-white pb-3 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Nota clínica
                </h3>

                <p className="text-xs text-gray-400">
                  {formatFecha(notaSeleccionada.fecha)}
                </p>
              </div>

              <button
                onClick={() => setNotaSeleccionada(null)}
                className="text-sm text-gray-400 hover:text-gray-600 transition"
              >
                Cerrar
              </button>

            </div>

            {/* ✅ CONTENIDO */}
            <div
              className="
  max-h-[55vh] overflow-y-auto overflow-x-hidden
  bg-gray-50 border border-gray-200
  p-4 rounded-2xl text-sm sm:text-base
  leading-relaxed whitespace-pre-wrap break-words
"
            >
              {notaSeleccionada.descripcion}
            </div>

          </div>

        </BaseModal>
      )}

    </div>
  );
}

export default ClienteDetalle;