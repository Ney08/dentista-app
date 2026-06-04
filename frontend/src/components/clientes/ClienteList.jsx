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
    <div className="space-y-3">

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
              group flex items-center justify-between
              bg-white border rounded-xl p-4
              transition-all duration-200 ease-out cursor-pointer

              ${isSelected
                ? "ring-2 ring-blue-400 bg-blue-50 border-blue-300"
                : "border-gray-200 hover:shadow-md hover:bg-gray-50"}
            `}
          >

            {/* ✅ IZQUIERDA */}
            <div className="flex items-center gap-4">

              {/* 🔵 AVATAR */}
              <div
                className={`${color}
                  w-10 h-10 rounded-full text-white
                  flex items-center justify-center
                  font-semibold text-sm shadow-sm`}
              >
                {cliente.nombre?.charAt(0)?.toUpperCase()}
              </div>

              {/* 🧾 INFO */}
              <div className="space-y-1 leading-tight">

                <div className="flex items-center gap-2 flex-wrap">

                  <p className="text-sm font-semibold text-gray-800">
                    {cliente.nombre} {cliente.apellido}
                  </p>

                  {/* ✅ BADGE ESTADO PRO */}
                  <span
                    className={`
                      text-[11px] font-medium px-2 py-[2px] rounded-full
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

                <p className="text-sm text-gray-600">
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

            {/* ✅ DERECHA (acciones hover PRO) */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="
                flex items-center gap-2
                opacity-0 group-hover:opacity-100
                transition-opacity duration-200
              "
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
                className="
                  bg-blue-500 hover:bg-blue-600
                  text-white text-xs font-medium
                  px-3 py-1.5 rounded-md shadow-sm
                  transition
                "
              >
                + Cita
              </button>

              {/* ✏️ EDITAR */}
              <button
                onClick={() => onEditarClick(cliente)}
                className="
                  text-gray-500 hover:text-gray-700
                  hover:bg-gray-200
                  p-2 rounded-md transition
                "
                title="Editar"
              >
                ✏️
              </button>

              {/* 🚫 TOGGLE */}
              <button
                onClick={() => onToggleActivo(cliente)}
                className={`
                  p-2 rounded-md transition
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

        );
      })}

    </div>
  );
}

export default ClienteList;