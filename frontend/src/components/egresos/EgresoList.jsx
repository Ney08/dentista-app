import { formatMoney } from "../../utils/format";

import { formatFecha } from "../../utils/fecha";

function EgresoList({
  egresos,
  onEditar,
  onEliminar
}) {

  // ✅ EMPTY
  if (egresos.length === 0) {

    return (
      <div className="
        h-full

        flex items-center
        justify-center

        border border-dashed
        border-gray-200

        rounded-3xl

        bg-gray-50
      ">

        <div className="text-center space-y-2">

          <p className="text-5xl">
            💸
          </p>

          <p className="
            text-gray-500
            font-medium
          ">
            No hay egresos registrados
          </p>

        </div>

      </div>
    );

  }

  return (
    <div className="space-y-3">

      {egresos.map((e) => (

        <div
          key={e.id}
          className="
    group

    bg-white

    border border-gray-200
    hover:border-red-100

    rounded-2xl

    p-4

    shadow-sm
    hover:shadow-lg

    hover:-translate-y-[1px]

    transition-all duration-200
  "
        >

          <div className="
            flex items-start
            justify-between
            gap-3
          ">

            {/* ✅ LEFT */}
            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="
                font-semibold
                text-gray-800
                truncate
              ">
                  {e.descripcion}
                </h3>
                <span className="
                      bg-red-100 text-red-700
                      text-xs font-medium
                      px-2 py-1 rounded-full
                    ">
                  gasto
                </span>
              </div>
              <p className="
                text-sm text-gray-500
              ">
                {e.categoria}
              </p>

              <p className="
                text-xs text-gray-400
              ">
                {formatFecha(e.created_at)}
              </p>

              {e.observacion && (

                <p className="
                  text-sm text-gray-400
                  line-clamp-2
                ">
                  {e.observacion}
                </p>

              )}

            </div>

            {/* ✅ RIGHT */}
            <div className="
  flex items-center
  gap-3
  shrink-0
">

              {/* ✅ PRECIO */}
              <p className="
    text-lg font-bold
    text-green-600
    whitespace-nowrap

    transition-all duration-200

    group-hover:scale-[1.02]
  ">
                RD$ {formatMoney(e.monto)}
              </p>

              {/* ✅ ACTIONS */}
              <div className="
    flex items-center gap-1

    opacity-100
    md:opacity-20

    md:group-hover:opacity-100

    transition-all duration-300
  ">

                {/* ✅ EDIT */}
                <button
                  onClick={() =>
                    onEditar(e)
                  }
                  className="
        w-8 h-8 rounded-lg

        flex items-center
        justify-center

        text-red-300
        hover:text-red-500

        hover:bg-red-50

        hover:scale-110

        active:scale-95

        transition-all duration-200
      "
                >
                  ✏️
                </button>

                {/* ✅ DELETE */}
                <button
                  onClick={() =>
                    onEliminar(e)
                  }
                  className="
        w-8 h-8 rounded-lg

        flex items-center
        justify-center

        text-slate-300
        hover:text-slate-500

        hover:bg-slate-100

        hover:scale-110

        active:scale-95

        transition-all duration-200
      "
                >
                  🗑️
                </button>

              </div>

            </div>


          </div>

        </div>

      ))}

    </div>
  );
}

export default EgresoList;