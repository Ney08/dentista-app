function ClienteList({ clientes, onEliminarClick, onEditarClick }) {
  return (
    <div className="space-y-4">

      {clientes.map(cliente => (

        <div
          key={cliente.id}
          className="
            flex flex-col md:flex-row md:items-center md:justify-between
            gap-4
            bg-white
            border border-gray-200 border-l-4 border-blue-500
            rounded-xl p-4
            shadow-sm hover:shadow-md
            transition
          "
        >

          {/* ✅ IZQUIERDA */}
          <div className="flex items-center gap-4">

            {/* 🔵 AVATAR */}
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow">
              {cliente.nombre?.charAt(0).toUpperCase()}
            </div>

            {/* 🧾 INFO */}
            <div className="space-y-1">

              <p className="text-lg font-bold text-gray-800">
                {cliente.nombre} {cliente.apellido}
              </p>

              <p className="text-sm text-gray-400 flex items-center gap-1">
                🆔 {cliente.cedula}
              </p>

              <p className="text-sm text-gray-400 flex items-center gap-1">
                📞 {cliente.telefono}
              </p>

              {cliente.direccion && (
                <p className="text-xs text-gray-400">
                  📍 {cliente.direccion}
                </p>
              )}

            </div>
          </div>

          {/* ✅ DERECHA */}
          <div className="flex gap-2 justify-end">

            {/* EDITAR */}
            <button
              onClick={() => onEditarClick(cliente)}
              className="
                flex items-center gap-1
                px-3 py-1.5
                bg-yellow-500 hover:bg-yellow-600
                text-white text-sm
                rounded-lg shadow-sm
                transition
              "
            >
              ✏️ Editar
            </button>

            {/* ELIMINAR */}
            <button
              onClick={() => onEliminarClick(cliente.id)}
              className="
                flex items-center gap-1
                px-3 py-1.5
                bg-red-500 hover:bg-red-600
                text-white text-sm
                rounded-lg shadow-sm
                transition
              "
            >
              🗑 Eliminar
            </button>

          </div>

        </div>

      ))}

    </div>
  );
}

export default ClienteList;