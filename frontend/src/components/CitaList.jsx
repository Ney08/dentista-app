import { formatFecha, formatHora, parseFechaLocal } from "../utils/fecha";

function CitaList({
  citas,
  getEstado,
  onEditar,
  onCompletar,
  onCancelar
}) {

  return (
    <div className="space-y-3">

      {citas.map(c => {

        const estado = getEstado(c);
        const fecha = parseFechaLocal(c.fecha);

        const estadoStyle = {
          pendiente: "bg-yellow-100 text-yellow-800 border-yellow-300",
          atrasada: "bg-red-100 text-red-800 border-red-300",
          completada: "bg-green-100 text-green-800 border-green-300",
          cancelada: "bg-gray-200 text-gray-700 border-gray-300"
        };

        const bordeLateral = {
          pendiente: "border-l-yellow-400",
          atrasada: "border-l-red-400",
          completada: "border-l-green-400",
          cancelada: "border-l-gray-400"
        };

        const estadoText = {
          pendiente: "🟡 Pendiente",
          atrasada: "🔴 Atrasada",
          completada: "✅ Completada",
          cancelada: "⛔ Cancelada"
        };

        return (
          <div
            key={c.id}
            className={`
              p-6 rounded-xl flex justify-between items-center border-l-4 border-blue-500
              ${bordeLateral[estado]}
              ${estado === "cancelada" ? "opacity-60" : ""}
              ${estado === "pendiente" ? "bg-yellow-50" : ""}
              transition hover:shadow-md hover:-translate-y-0.5 
            `}
          >

            {/* INFO */}
            <div className="space-y-1">
              <p className="font-semibold text-gray-800">
                {c.cliente?.nombre} {c.cliente?.apellido}
              </p>

              <p className="text-sm text-gray-700">
                {formatFecha(fecha)} — {formatHora(fecha)}
              </p>

              <p className="text-sm text-gray-400">
                {c.motivo}
              </p>
            </div>

            {/* DERECHA */}
            <div className="flex items-center gap-2">

              <span className={`px-3 py-1 text-xs rounded-full border ${estadoStyle[estado]}`}>
                {estadoText[estado]}
              </span>

              {estado === "pendiente" && (
                <>
                  <button
                    onClick={() => onCompletar(c.id)}
                    className="bg-green-500 text-white w-8 h-8 rounded-lg"
                  >
                    ✅
                  </button>

                  <button
                    onClick={() => onEditar(c)}
                    className="bg-blue-500 text-white w-8 h-8 rounded-lg"
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() => onCancelar(c.id)}
                    className="bg-gray-500 text-white w-8 h-8 rounded-lg"
                  >
                    ⛔
                  </button>
                </>
              )}

              {estado === "atrasada" && (
                <>
                  <button
                    onClick={() => onEditar(c)}
                    className="bg-blue-500 text-white w-8 h-8 rounded-lg"
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() => onCancelar(c.id)}
                    className="bg-gray-500 text-white w-8 h-8 rounded-lg"
                  >
                    ⛔
                  </button>
                </>
              )}

            </div>

          </div>
        );
      })}

    </div>
  );
}

export default CitaList;