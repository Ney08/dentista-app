import { formatMoney } from "../../utils/format";
import { formatFecha } from "../../utils/fecha";

function EgresoList({
  egresos,
  onEditar,
  onEliminar
}) {

  /*
  ==========================================
  EMPTY
  ==========================================
  */

  if (egresos.length === 0) {

    return (

      <div className="
        h-full

        flex
        items-center
        justify-center
      ">

        <div className="
          text-center
        ">

          <div className="
            w-28
            h-28

            mx-auto

            rounded-[32px]

            bg-gradient-to-br
            from-rose-500
            via-pink-500
            to-red-500

            flex
            items-center
            justify-center

            text-6xl

            text-white

            shadow-[0_20px_50px_rgba(244,63,94,0.35)]
          ">
            💸
          </div>

          <h3 className="
            mt-6

            text-3xl

            font-black

            text-slate-800
          ">
            No hay egresos
          </h3>

          <p className="
            mt-3

            text-gray-500

            max-w-sm
          ">
            Los gastos registrados aparecerán aquí automáticamente
          </p>

        </div>

      </div>

    );

  }

  return (

    <div className="
      space-y-5
    ">

      {egresos.map((e) => (

        <div
          key={e.id}
          className="
            group

            relative
            overflow-hidden

            bg-white/90
            backdrop-blur-xl

            border
            border-white/40

            rounded-[32px]

            p-5
            sm:p-6

            shadow-[0_10px_30px_rgba(0,0,0,0.05)]

            hover:shadow-[0_20px_45px_rgba(0,0,0,0.08)]

            hover:-translate-y-[3px]

            transition-all
            duration-500
          "
        >

          {/* TOP BORDER */}

          <div className="
            absolute
            top-0
            left-0

            w-full
            h-1

            bg-gradient-to-r
            from-rose-500
            via-pink-500
            to-red-500
          " />

          {/* GLOW */}

          <div className="
            absolute
            -top-16
            -right-16

            w-52
            h-52

            rounded-full

            bg-rose-500/10

            blur-3xl

            opacity-0

            group-hover:opacity-100

            transition-all
            duration-700
          " />

          {/* CONTENT */}

          <div className="
            relative
            z-10

            flex
            flex-col
            xl:flex-row

            xl:items-center
            xl:justify-between

            gap-5
          ">

            {/* LEFT */}

            <div className="
              flex
              items-start

              gap-5

              flex-1
              min-w-0
            ">

              {/* ICON */}

              <div className="
                w-16
                h-16

                rounded-[24px]

                bg-gradient-to-br
                from-rose-500
                to-pink-500

                flex
                items-center
                justify-center

                text-2xl

                text-white

                shadow-[0_15px_35px_rgba(244,63,94,0.25)]

                shrink-0
              ">
                💸
              </div>

              {/* INFO */}

              <div className="
                flex-1
                min-w-0

                space-y-4
              ">

                {/* HEADER */}

                <div className="
                  flex
                  flex-wrap

                  items-center

                  gap-3
                ">

                  <h3 className="
                    text-lg
                    sm:text-xl

                    font-black

                    text-slate-800

                    truncate
                  ">
                    {e.descripcion}
                  </h3>

                  <span className="
                    px-3
                    py-1.5

                    rounded-full

                    bg-rose-50

                    border
                    border-rose-100

                    text-rose-500

                    text-[11px]
                    font-black

                    uppercase

                    tracking-[0.08em]
                  ">
                    gasto
                  </span>

                </div>

                {/* GRID */}

                <div className="
                  grid
                  grid-cols-1
                  md:grid-cols-3

                  gap-3
                ">

                  {/* CATEGORIA */}

                  <div className="
                    bg-gradient-to-br
                    from-white
                    to-slate-100/90

                    border
                    border-white

                    rounded-[24px]

                    px-5
                    py-4
                  ">

                    <p className="
                      text-[11px]

                      uppercase

                      tracking-[0.12em]

                      text-gray-400

                      font-black
                    ">
                      Categoría
                    </p>

                    <p className="
                      mt-2

                      text-sm

                      font-bold

                      text-slate-700
                    ">
                      {e.categoria || "General"}
                    </p>

                  </div>

                  {/* FECHA */}

                  <div className="
                    bg-gradient-to-br
                    from-white
                    to-slate-100/90

                    border
                    border-white

                    rounded-[24px]

                    px-5
                    py-4
                  ">

                    <p className="
                      text-[11px]

                      uppercase

                      tracking-[0.12em]

                      text-gray-400

                      font-black
                    ">
                      Fecha
                    </p>

                    <p className="
                      mt-2

                      text-sm

                      font-bold

                      text-slate-700
                    ">
                      {formatFecha(e.created_at)}
                    </p>

                  </div>

                  {/* MONTO */}

                  <div className="
                    bg-gradient-to-r
                    from-rose-500
                    to-pink-500

                    rounded-[24px]

                    px-5
                    py-4

                    text-white

                    shadow-[0_15px_35px_rgba(244,63,94,0.25)]
                  ">

                    <p className="
                      text-[11px]

                      uppercase

                      tracking-[0.12em]

                      font-black

                      text-white/70
                    ">
                      Total
                    </p>

                    <p className="
                      mt-2

                      text-2xl

                      font-black
                    ">
                      RD$
                      {" "}
                      {formatMoney(e.monto)}
                    </p>

                  </div>

                </div>

                {/* OBSERVACION */}

                {e.observacion && (

                  <div className="
                    bg-slate-50

                    border
                    border-slate-100

                    rounded-[24px]

                    px-5
                    py-4
                  ">

                    <p className="
                      text-[11px]

                      uppercase

                      tracking-[0.12em]

                      text-gray-400

                      font-black
                    ">
                      Observación
                    </p>

                    <p className="
                      mt-2

                      text-sm

                      text-slate-600

                      leading-relaxed
                    ">
                      {e.observacion}
                    </p>

                  </div>

                )}

              </div>

            </div>

            {/* ACTIONS */}

            <div className="
              flex
              flex-row
              xl:flex-col

              items-center

              gap-3
            ">

              {/* EDIT */}

              <button
                onClick={() =>
                  onEditar(e)
                }
                className="
                  h-12

                  px-5

                  rounded-[20px]

                  bg-gradient-to-r
                  from-orange-400
                  to-amber-500

                  text-white

                  text-sm
                  font-black

                  shadow-[0_15px_35px_rgba(251,146,60,0.28)]

                  hover:scale-[1.04]

                  active:scale-95

                  transition-all
                  duration-300
                "
              >
                ✏️ Editar
              </button>

              {/* DELETE */}

              <button
                onClick={() =>
                  onEliminar(e)
                }
                className="
                  h-12

                  px-5

                  rounded-[20px]

                  bg-slate-100

                  hover:bg-slate-200

                  text-slate-700

                  text-sm
                  font-bold

                  transition-all
                  duration-300

                  active:scale-95
                "
              >
                🗑️ Eliminar
              </button>

            </div>

          </div>

        </div>

      ))}

    </div>

  );

}

export default EgresoList;