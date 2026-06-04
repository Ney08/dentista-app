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
    <div className="space-y-5">

      {/* ✅ FORM */}
      <div className="
        bg-gray-50 border border-gray-200
        rounded-xl p-4 space-y-3
      ">
        <h4 className="text-sm font-semibold text-gray-600">
          📝 Agregar nota clínica
        </h4>

        <HistorialForm
          clienteId={cliente.id}
          onAdd={(data) => crearHistorial.mutate(data)}
        />
      </div>

      {/* ✅ TÍTULO HISTORIAL */}
      <h4 className="text-sm font-semibold text-gray-600">
        📚 Historial
      </h4>

      {/* ✅ LISTA CON SCROLL */}
      <div className="
        max-h-[350px] overflow-y-auto
        pr-2 space-y-3
      ">

        {(!historial || historial.length === 0) ? (
          <p className="text-gray-500 text-sm">
            No hay historial...
          </p>
        ) : (

          (historial || []).map((h) => (
            <div
              key={h.id}
              onClick={() => setNotaSeleccionada(h)}
              className="
                group flex gap-3
                cursor-pointer
              "
            >

              {/* 🔵 DOT (timeline) */}
              <div className="mt-2 w-2 h-2 bg-blue-500 rounded-full" />

              {/* ✅ CARD */}
              <div className="
                flex-1 bg-white border border-gray-200
                rounded-xl p-3 shadow-sm
                hover:shadow-md hover:bg-gray-50
                transition
              ">

                <p className="text-sm leading-relaxed">

                  {cortarTexto(h.descripcion)}

                  {h.descripcion?.length > 80 && (
                    <span className="text-blue-500 text-xs ml-1">
                      ver más
                    </span>
                  )}

                </p>

                <p className="text-xs text-gray-400 mt-1">
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

          <div className="space-y-5">

            {/* ✅ HEADER PRO */}
            <div className="flex justify-between items-start">

              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Nota clínica
                </h3>

                <p className="text-xs text-gray-400">
                  {formatFecha(notaSeleccionada.fecha)}
                </p>
              </div>

              <button
                onClick={() => setNotaSeleccionada(null)}
                className="text-sm text-gray-400 hover:text-gray-600"
              >
                Cerrar
              </button>

            </div>

            {/* ✅ CONTENIDO */}
            <div className="
              max-h-[400px] overflow-y-auto
              bg-gray-50 border border-gray-200
              p-4 rounded-lg text-sm
              leading-relaxed whitespace-pre-wrap
            ">
              {notaSeleccionada.descripcion}
            </div>

          </div>

        </BaseModal>
      )}

    </div>
  );
}

export default ClienteDetalle;