import { formatMoney } from "../../utils/format";
import { formatFecha } from "../../utils/fecha";

import {
  WalletCards,
  CalendarDays,
  Receipt,
  Pencil,
  Trash2,
  BadgeDollarSign,
  FileText
} from "lucide-react";

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
            relative

            w-28
            h-28

            mx-auto

            rounded-[34px]

            
bg-gradient-to-br
from-sky-700
via-sky-800
to-sky-900


            flex
            items-center
            justify-center

            text-white

            shadow-[0_25px_60px_rgba(7,89,133,0.35)]
          ">

            <div className="
              absolute
              inset-0

              rounded-[34px]

              bg-white/10

              blur-xl
            " />

            <WalletCards
              size={42}
              className="relative z-10"
            />

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

            text-slate-500

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
      space-y-4
    ">

      {egresos.map((e) => (

        <div
          key={e.id}
          className="
            group

            relative
            overflow-hidden

            bg-white/95
            backdrop-blur-md

            border
            border-slate-200/80

            rounded-[34px]

            p-5

            shadow-[0_10px_30px_rgba(0,0,0,0.05)]

            
hover:shadow-[0_20px_45px_rgba(7,89,133,0.08)]

hover:border-sky-200


            hover:-translate-y-[2px]

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
            h-[3px]

            bg-gradient-to-r
            from-rose-400
            via-pink-500
            to-rose-500
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

            grid
            grid-cols-1
            2xl:grid-cols-[1fr_auto]

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
                relative

                w-16
                h-16

                rounded-[24px]

               
bg-gradient-to-br
from-sky-700
via-sky-800
to-sky-900


                flex
                items-center
                justify-center

                text-white

                shadow-[0_15px_35px_rgba(7,89,133,0.25)]

                shrink-0
              ">

                <WalletCards size={24} />

                <div className="
                  absolute
                  -bottom-1
                  -right-1

                  w-5
                  h-5

                  rounded-full

                  border-4
                  border-white

                  bg-rose-500
                " />

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
                  flex-col
                  xl:flex-row

                  xl:items-start
                  xl:justify-between

                  gap-4
                ">

                  {/* LEFT */}

                  <div className="min-w-0">

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
                        font-bold
                      ">

                        Gasto operativo

                      </span>

                    </div>

                    {/* MINI TAGS */}

                    <div className="
                      mt-3

                      flex
                      flex-wrap

                      items-center
                      gap-2
                    ">

                      <div className="
                        inline-flex

                        items-center
                        gap-2

                        px-3
                        py-1.5

                        rounded-full

                        
bg-sky-50

text-sky-800


                        text-xs
                        font-semibold
                      ">

                        <Receipt size={12} />

                        Egreso financiero

                      </div>

                      <div className="
                        inline-flex

                        items-center
                        gap-2

                        px-3
                        py-1.5

                        rounded-full

                        bg-slate-100

                        text-slate-600

                        text-xs
                        font-semibold
                      ">

                        <FileText size={12} />

                        Control administrativo

                      </div>

                    </div>

                  </div>

                  {/* STATUS */}

                  <div className="
                    shrink-0

                    rounded-[24px]

                    border
                    border-rose-100

                    bg-rose-50

                    px-5
                    py-4

                    min-w-[220px]
                  ">

                    <div className="
                      flex
                      items-center
                      gap-2

                      text-sm
                      font-bold

                      text-slate-700
                    ">

                      <BadgeDollarSign size={15} />

                      Estado del gasto

                    </div>

                    <p className="
                      mt-3

                      text-base

                      font-black

                      text-slate-800
                    ">

                      Egreso registrado

                    </p>

                    <p className="
                      mt-1

                      text-xs

                      text-slate-500
                    ">

                      Seguimiento financiero

                    </p>

                  </div>

                </div>

                {/* GRID */}

                <div className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  xl:grid-cols-3

                  gap-4
                ">

                  {/* CATEGORIA */}

                  <div className="
                    bg-slate-50/80

                    border
                    border-slate-200/60

                    rounded-[24px]

                    px-5
                    py-4
                  ">

                    <div className="
                      flex
                      items-center
                      gap-2

                      text-slate-400

                      text-[11px]
                      font-black

                      uppercase

                      tracking-[0.12em]
                    ">

                      <Receipt size={12} />

                      Categoría

                    </div>

                    <p className="
                      mt-3

                      text-sm

                      font-bold

                      text-slate-700
                    ">

                      {e.categoria || "General"}

                    </p>

                  </div>

                  {/* FECHA */}

                  <div className="
                    bg-slate-50/80

                    border
                    border-slate-200/60

                    rounded-[24px]

                    px-5
                    py-4
                  ">

                    <div className="
                      flex
                      items-center
                      gap-2

                      text-slate-400

                      text-[11px]
                      font-black

                      uppercase

                      tracking-[0.12em]
                    ">

                      <CalendarDays size={12} />

                      Fecha

                    </div>

                    <p className="
                      mt-3

                      text-sm

                      font-bold

                      text-slate-700
                    ">

                      {formatFecha(e.created_at)}

                    </p>

                  </div>

                  {/* TOTAL */}

                  <div className="
                    
bg-gradient-to-r
from-rose-500
via-pink-500
to-rose-600


                    rounded-[28px]

                    px-6
                    py-4

                    text-white

                    shadow-[0_15px_35px_rgba(244,63,94,0.18)]
                  ">

                    <p className="
                      text-[11px]

                      uppercase

                      tracking-[0.14em]

                      font-black

                      text-white/70
                    ">
                      Total egreso
                    </p>

                    <div className="
                      mt-2

                      flex
                      items-center
                      justify-between

                      gap-3
                    ">

                      <h2 className="
                        text-2xl

                        font-black
                      ">

                        RD$
                        {" "}
                        {formatMoney(e.monto)}

                      </h2>

                      <div className="
                        px-3
                        py-1.5

                        rounded-full

                        bg-white/15

                        text-xs
                        font-bold
                      ">

                        Registrado

                      </div>

                    </div>

                  </div>

                </div>

                {/* OBSERVACION */}

                {e.observacion && (

                  <div className="
                    bg-slate-50/80

                    border
                    border-slate-200/60

                    rounded-[24px]

                    px-5
                    py-4
                  ">

                    <div className="
                      flex
                      items-center
                      gap-2

                      text-slate-400

                      text-[11px]
                      font-black

                      uppercase

                      tracking-[0.12em]
                    ">

                      <FileText size={12} />

                      Observación

                    </div>

                    <p className="
                      mt-3

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
              self-center

              2xl:w-[190px]

              bg-slate-50/80

              border
              border-slate-200/70

              rounded-[28px]

              p-4

              flex
              flex-row
              2xl:flex-col

              items-stretch

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

                  rounded-2xl

                  
bg-gradient-to-r
from-sky-700
via-sky-800
to-sky-900


                  text-white

                  text-sm
                  font-black

                  shadow-[0_12px_30px_rgba(7,89,133,0.25)]

                  hover:shadow-[0_18px_40px_rgba(7,89,133,0.35)]

                  hover:scale-[1.02]

                  transition-all
                  duration-300

                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >

                <Pencil size={15} />

                Editar

              </button>

              {/* DELETE */}

              <button
                onClick={() =>
                  onEliminar(e)
                }
                className="
                  h-12

                  px-5

                  rounded-2xl

                  bg-rose-50

                  border
                  border-rose-100

                  text-rose-500

                  text-sm
                  font-bold

                  hover:bg-rose-100

                  transition-all
                  duration-300

                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >

                <Trash2 size={15} />

                Eliminar

              </button>

            </div>

          </div>

        </div>

      ))}

    </div>

  );

}

export default EgresoList;