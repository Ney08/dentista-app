import { useNavigate } from "react-router-dom";

function ClienteList({
  clientes,
  onEliminarClick,
  onEditarClick,
  onSeleccionar
}) {

  const navigate = useNavigate();

  // 🎨 colores dinámicos
  const colores = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500"
  ];

  return (
    <div className="space-y-2">

      {clientes.map(cliente => {

        const color = colores[cliente.id % colores.length];

        return (

          <div
            key={cliente.id}
            onClick={() => onSeleccionar?.(cliente)}
            className="
              flex flex-col md:flex-row md:items-center md:justify-between
              gap-4
              bg-white
              border border-gray-200 border-l-4 border-blue-500
              rounded-xl p-4
              cursor-pointer
              shadow-sm hover:shadow-md hover:-translate-y-[2px]
              transition-transform duration-200
            "
          >

            {/* ✅ IZQUIERDA */}
            <div className="flex items-center gap-4">

              {/* 🔵 AVATAR DINÁMICO PRO */}
              <div
                className={`${color}
                w-12 h-12 rounded-full text-white
                flex items-center justify-center
                font-semibold text-lg shadow-md`}
              >
                {cliente.nombre?.charAt(0)?.toUpperCase()}
              </div>

              {/* 🧾 INFO */}
              <div className="space-y-1">

                <p className="text-lg font-semibold text-gray-800">
                  {cliente.nombre} {cliente.apellido}
                </p>

                <p className="text-sm text-gray-400">
                  🆔 {cliente.cedula}
                </p>

                <p className="text-sm text-gray-400">
                  📞 {cliente.telefono}
                </p>

                {cliente.direccion && (
                  <p className="text-xs text-gray-400">
                    📍 {typeof cliente.direccion === "string"
                      ? cliente.direccion
                      : `${cliente.direccion.municipio_nombre || ""}, ${cliente.direccion.provincia_nombre || ""}`
                    }
                  </p>
                )}

              </div>
            </div>

            {/* ✅ DERECHA */}
            <div
              className="flex gap-2 justify-end flex-wrap"
              onClick={(e) => e.stopPropagation()}
            >

              {/* 🔥 CREAR CITA */}
              <button
                onClick={() => {
                  navigate("/citas", {
                    state: {
                      clienteSeleccionado: {
                        id: cliente.id,
                        nombre: cliente.nombre,
                        apellido: cliente.apellido
                      }
                    }
                  });
                }}
                className="
                  flex items-center gap-1 px-3 py-1.5
                  bg-blue-500 hover:bg-blue-600
                  text-white text-sm font-medium
                  rounded-lg
                "
              >
                + Cita
              </button>

              {/* ✏️ EDITAR */}
              <button
                onClick={() => onEditarClick(cliente)}
                className="
                  flex items-center gap-1 px-3 py-1.5
                  bg-yellow-500 hover:bg-yellow-600
                  text-white text-sm font-medium
                  rounded-lg
                "
              >
                ✏️ Editar
              </button>

              {/* 🗑 ELIMINAR */}
              <button
                onClick={() => onEliminarClick(cliente.id)}
                className="
                  flex items-center gap-1 px-3 py-1.5
                  bg-red-500 hover:bg-red-600
                  text-white text-sm font-medium
                  rounded-lg
                  
                "
              >
                🗑 Eliminar
              </button>

            </div>

          </div>

        );
      })}

    </div>
  );
}

export default ClienteList;
