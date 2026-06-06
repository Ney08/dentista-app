import { useNavigate } from "react-router-dom";
import { useState } from "react";

function ClienteList({ clientes, onEditarClick, onSeleccionar, onToggleActivo }) {

  const navigate = useNavigate();
  const [seleccionadoId, setSeleccionadoId] = useState(null);

  const colores = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500"];

  return (

    <div className="h-full space-y-2 sm:space-y-3 overflow-y-auto overflow-x-hidden pr-1 pb-2">

      {clientes.map((cliente) => {

        const color = colores[cliente.id % colores.length];
        const isSelected = seleccionadoId === cliente.id;

        return (

          <div
            key={cliente.id}
            onClick={() => {
              setSeleccionadoId(cliente.id);
              onSeleccionar?.(cliente);
            }}
            className={`
              group flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 bg-white border rounded-2xl px-3 sm:px-4 py-3 sm:py-4 transition-all duration-200 ease-out cursor-pointer hover:-translate-y-[1px] hover:shadow-lg
              ${isSelected
                ? "ring-2 ring-blue-400 bg-blue-50 border-blue-300"
                : "border-gray-200 hover:border-blue-100"}
            `}
          >

            {/* LEFT */}
            <div className="flex items-center gap-3 min-w-0 flex-1">

              {/* AVATAR */}
              <div className={`${color} w-10 h-10 sm:w-11 sm:h-11 rounded-full text-white flex items-center justify-center font-semibold text-sm shadow-sm shrink-0`}>
                {cliente.nombre?.charAt(0)?.toUpperCase()}
              </div>

              {/* INFO */}
              <div className="space-y-1 leading-tight min-w-0">

                <div className="flex items-center gap-2 flex-wrap">

                  <p className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                    {cliente.nombre} {cliente.apellido}
                  </p>

                  <span className={`text-[11px] font-medium px-2 py-1 rounded-full ${cliente.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {cliente.activo ? "Activo" : "Inactivo"}
                  </span>

                </div>

                <p className="text-xs text-gray-400">
                  ID: {cliente.cedula}
                </p>

                <p className="text-sm text-gray-600 truncate">
                  📞 {cliente.telefono}
                </p>

                {cliente.direccion && (

                  <p className="text-xs sm:text-sm text-gray-400 truncate">
                    📍 {
                      typeof cliente.direccion === "string"
                        ? cliente.direccion
                        : `${cliente.direccion.municipio_nombre || ""}, ${cliente.direccion.provincia_nombre || ""}`
                    }
                  </p>

                )}

              </div>

            </div>

            {/* RIGHT */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 opacity-100 md:opacity-20 md:group-hover:opacity-100 transition-all duration-300"
            >

              {/* NUEVA CITA */}
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
                className="h-8 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-500 hover:text-blue-600 text-xs font-medium hover:scale-[1.03] active:scale-95 transition-all duration-200 whitespace-nowrap"
              >
                + Cita
              </button>

              {/* EDITAR */}
              <button
                onClick={() => onEditarClick(cliente)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-slate-600 hover:bg-slate-100 hover:scale-110 active:scale-95 transition-all duration-200"
                title="Editar"
              >
                ✏️
              </button>

              {/* TOGGLE */}
              <button
                onClick={() => onToggleActivo(cliente)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 ${cliente.activo
                  ? "text-red-300 hover:text-red-500 hover:bg-red-50"
                  : "text-green-300 hover:text-green-500 hover:bg-green-50"
                }`}
                title={cliente.activo ? "Desactivar" : "Activar"}
              >
                {cliente.activo ? "🚫" : "✅"}
              </button>

            </div>

          </div>

        );

      })}

    </div>

  );

}

export default ClienteList;