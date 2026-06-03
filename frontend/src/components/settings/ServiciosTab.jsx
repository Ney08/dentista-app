import toast from "react-hot-toast";

function ServiciosTab({
  servicios,
  setModalServicio,
  setServicioEditar,
  setServicioAEliminar
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow border space-y-4">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Servicios ({servicios.length})
        </h3>

        <button
          onClick={() => {
            setServicioEditar(null);
            setModalServicio(true);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
        >
          + Nuevo
        </button>
      </div>

      {/* LISTA */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto">

        {servicios.length === 0 ? (
          <p className="text-gray-500 text-sm text-center">
            No hay servicios
          </p>
        ) : (

          servicios.map(s => (
            <div
              key={s.id}
              className="flex justify-between items-center border p-3 rounded-xl bg-gray-50 hover:shadow-sm transition"
            >

              {/* INFO */}
              <div className="space-y-1">
                <p className="font-medium">
                  {s.nombre}
                </p>

                {s.descripcion && (
                  <p className="text-xs text-gray-400">
                    {s.descripcion}
                  </p>
                )}

                <span className="text-sm text-blue-600 font-medium">
                  RD$ {s.precio}
                </span>
              </div>

              {/* ACCIONES */}
              <div className="flex gap-2">

                <button
                  onClick={() => {
                    setServicioEditar(s);
                    setModalServicio(true);
                  }}
                  className="text-yellow-600 hover:scale-110 transition"
                >
                  ✏️
                </button>

                <button
                  onClick={() => setServicioAEliminar(s)}
                  className="text-red-500 hover:scale-110 transition"
                >
                  ❌
                </button>

              </div>

            </div>
          ))

        )}

      </div>

    </div>
  );
}

export default ServiciosTab;