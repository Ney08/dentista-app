import { formatMoney } from "../../utils/format";

function ServiciosTab({
  servicios,
  setModalServicio,
  setServicioEditar,
  setServicioAEliminar
}) {

  return (

    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 space-y-5">

      {/* ✅ HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

        <div>

          <h3 className="text-xl font-bold tracking-tight">
            Servicios 🧾
          </h3>

          <p className="text-sm text-gray-500">
            {servicios.length} servicio(s) registrados
          </p>

        </div>

        <button
          onClick={() => {
            setServicioEditar(null);
            setModalServicio(true);
          }}
          className="
            h-11 px-5 rounded-2xl
            bg-gradient-to-r from-blue-500 to-indigo-500
            hover:opacity-90
            text-white text-sm font-medium
            shadow-sm
            transition-all duration-200
            active:scale-[0.98]
          "
        >
          + Nuevo
        </button>

      </div>

      {/* ✅ LISTA */}
      <div className="
        space-y-3
        max-h-[420px]
        overflow-y-auto
        pr-1
      ">

        {servicios.length === 0 ? (

          <div className="
            text-center py-16
            border border-dashed border-gray-200
            rounded-3xl
            bg-gray-50
          ">

            <p className="text-5xl mb-3">
              📭
            </p>

            <p className="text-gray-500 font-medium">
              No hay servicios registrados
            </p>

          </div>

        ) : (

          servicios.map(s => (

            <div
              key={s.id}
              className="
                group
                border border-gray-200
                rounded-3xl
                bg-gray-50
                p-4
                hover:bg-white
                hover:shadow-md
                transition-all duration-200
              "
            >

              <div className="flex items-start justify-between gap-4">

                {/* ✅ INFO */}
                <div className="space-y-2 flex-1 min-w-0">

                  <div className="flex flex-wrap items-center gap-2">

                    <h4 className="font-semibold text-gray-800 text-base break-words">
                      {s.nombre}
                    </h4>

                    <span className="
                      bg-blue-100 text-blue-700
                      text-xs font-medium
                      px-2 py-1 rounded-full
                    ">
                      Servicio
                    </span>

                  </div>

                  {s.descripcion && (

                    <p className="text-sm text-gray-500 leading-relaxed break-words">
                      {s.descripcion}
                    </p>

                  )}

                  {/* ✅ PRECIOS */}
                  <div className="flex flex-wrap gap-2 pt-1">

                    <div className="
                      bg-green-100 text-green-700
                      px-3 py-1 rounded-xl
                      text-sm font-semibold
                    ">
                      💰 RD$ {formatMoney(s.precio)}
                    </div>

                    <div className="
                      bg-red-100 text-red-700
                      px-3 py-1 rounded-xl
                      text-sm font-semibold
                    ">
                      📦 RD$ {formatMoney(s.costo_servicio || 0)}
                    </div>

                    <div className="
                      bg-indigo-100 text-indigo-700
                      px-3 py-1 rounded-xl
                      text-sm font-semibold
                    ">
                      📈 RD$ {
                        formatMoney(
                          (s.precio || 0) -
                          (s.costo_servicio || 0)
                        )
                      }
                    </div>

                  </div>

                </div>

                {/* ✅ ACCIONES */}
                <div className="
                  flex items-center gap-2
                  opacity-100 sm:opacity-0
                  sm:group-hover:opacity-100
                  transition
                ">

                  <button
                    onClick={() => {
                      setServicioEditar(s);
                      setModalServicio(true);
                    }}
                    className="
                      h-10 w-10 rounded-xl
                      bg-yellow-100 hover:bg-yellow-200
                      text-yellow-700
                      flex items-center justify-center
                      transition-all duration-200
                      active:scale-95
                    "
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() => setServicioAEliminar(s)}
                    className="
                      h-10 w-10 rounded-xl
                      bg-red-100 hover:bg-red-200
                      text-red-600
                      flex items-center justify-center
                      transition-all duration-200
                      active:scale-95
                    "
                  >
                    ❌
                  </button>

                </div>

              </div>

            </div>

          ))

        )}

      </div>

    </div>

  );

}

export default ServiciosTab;