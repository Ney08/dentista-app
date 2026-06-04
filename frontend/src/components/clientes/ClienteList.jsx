import { useNavigate } from "react-router-dom";
import { useState } from "react";

function ClienteList({
  clientes,
  onEditarClick,
  onSeleccionar,
  onToggleActivo
}) {

  const navigate = useNavigate();
  const [seleccionadoId, setSeleccionadoId] = useState(null);

  const colores = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500"
  ];

  return (
    <div className="h-full space-y-2 sm:space-y-3 overflow-y-auto overflow-x-hidden pr-1 pb-2">

      {clientes.map(cliente => {

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
  cursor-pointer

  ${isSelected
                ? "ring-2 ring-blue-400 bg-blue-50 border-blue-300"
                : "border-gray-200 hover:shadow-sm hover:bg-gray-50"}
`}
          >

            {/* ✅ IZQUIERDA */}
            <div className="flex items-center gap-3 min-w-0 flex-1">

              {/* 🔵 AVATAR */}
              <div
                className={`${color}
                  w-10 h-10 sm:w-11 sm:h-11 rounded-full text-white
                  flex items-center justify-center
                  font-semibold text-sm shadow-sm shrink-0`}
              >
                {cliente.nombre?.charAt(0)?.toUpperCase()}
              </div>

              {/* 🧾 INFO */}
              <div className="space-y-1 leading-tight min-w-0">

                <div className="flex items-center gap-2 flex-wrap">

                  <p className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                    {cliente.nombre} {cliente.apellido}
                  </p>

                  {/* ✅ BADGE ESTADO PRO */}
                  <span
                    className={`
                      text-[11px] font-medium px-2 py-1 rounded-full
                      ${cliente.activo
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"}
                    `}
                  >
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
                    📍 {typeof cliente.direccion === "string"
                      ? cliente.direccion
                      : `${cliente.direccion.municipio_nombre || ""}, ${cliente.direccion.provincia_nombre || ""}`
                    }
                  </p>
                )}

              </div>
            </div>

            
              
<div
  
className="
  flex items-center gap-1

  opacity-100
  lg:opacity-40
  lg:group-hover:opacity-100

  transition-all duration-200
"

>
                {/* ✅ DERECHA (acciones hover PRO) */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-end gap-2 w-full lg:w-auto"
            >

              {/* 🔥 ACCIÓN PRINCIPAL */}
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
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs font-medium px-3 h-9 sm:h-10 rounded-xl transition active:scale-[0.98] whitespace-nowrap"
              >
                + Cita
              </button>
              
              {/* ✏️ EDITAR */}
              <button
                onClick={() => onEditarClick(cliente)}
                className="
                  text-gray-500 hover:text-gray-700
                  hover:bg-gray-200
                  p-2.5 sm:p-2 rounded-xl transition
                "
                title="Editar"
              >
                ✏️
              </button>

              {/* 🚫 TOGGLE */}
              <button
                onClick={() => onToggleActivo(cliente)}
                className={`
                  p-2.5 sm:p-2 rounded-xl transition
                  ${cliente.activo
                    ? "text-red-500 hover:bg-red-100"
                    : "text-green-600 hover:bg-green-100"}
                `}
                title={cliente.activo ? "Desactivar" : "Activar"}
              >
                {cliente.activo ? "🚫" : "✅"}
              </button>
            </div>
            </div>

          </div>

        );
      })}

    </div>
  );
}

export default ClienteList;