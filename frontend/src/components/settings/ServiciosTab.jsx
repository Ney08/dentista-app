import {
  FolderCog,
  Plus,
  Pencil,
  Trash2,
  Receipt,
  BadgeDollarSign,
  Sparkles,
  PackageOpen
} from "lucide-react";

import { formatMoney } from "../../utils/format";

function ServiciosTab({
  servicios,
  setModalServicio,
  setServicioEditar,
  setServicioAEliminar
}) {

  return (

    <div className="
      bg-white/95
      backdrop-blur-md

      border
      border-slate-200/80

      rounded-[34px]

      shadow-[0_10px_30px_rgba(0,0,0,0.05)]

      p-5
      sm:p-6

      space-y-6

      overflow-hidden
    ">

      {/* HEADER */}

      <div className="
        flex
        flex-col
        lg:flex-row

        lg:items-center
        lg:justify-between

        gap-4
      ">

        {/* INFO */}

        <div className="
          flex
          items-center

          gap-4
        ">

          <div className="
            w-16
            h-16

            rounded-[24px]

            bg-gradient-to-br
            from-indigo-500
            via-purple-500
            to-violet-500

            text-white

            flex
            items-center
            justify-center

            shadow-[0_20px_45px_rgba(99,102,241,0.30)]
          ">

            <FolderCog size={30} />

          </div>

          <div>

            <h3 className="
              text-2xl
              sm:text-3xl

              font-black

              tracking-tight

              text-slate-800
            ">

              Servicios

            </h3>

            <p className="
              mt-1

              text-sm
              text-slate-500
            ">

              {servicios.length}
              {" "}
              servicio(s) registrados

            </p>

          </div>

        </div>

        {/* BUTTON */}

        <button
          onClick={() => {

            setServicioEditar(null);

            setModalServicio(true);

          }}
          className="
            h-12

            px-6

            rounded-[22px]

            bg-gradient-to-r
            from-indigo-500
            via-purple-500
            to-violet-500

            text-white

            text-sm
            font-black

            shadow-[0_15px_35px_rgba(99,102,241,0.28)]

            hover:scale-[1.02]

            hover:shadow-[0_20px_45px_rgba(99,102,241,0.35)]

            active:scale-[0.98]

            transition-all
            duration-300

            flex
            items-center
            justify-center
            gap-2
          "
        >

          <Plus size={18} />

          Nuevo servicio

        </button>

      </div>

      {/* LIST */}

      <div className="
        space-y-5

        max-h-[650px]

        overflow-y-auto
        overflow-x-hidden

        pr-1
      ">

        {servicios.length === 0 ? (

          <div className="
            h-[350px]

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
                from-indigo-500
                via-purple-500
                to-violet-500

                flex
                items-center
                justify-center

                text-white

                shadow-[0_20px_50px_rgba(99,102,241,0.35)]
              ">

                <PackageOpen size={52} />

              </div>

              <h3 className="
                mt-6

                text-3xl

                font-black

                text-slate-800
              ">

                No hay servicios

              </h3>

              <p className="
                mt-3

                text-slate-500

                max-w-sm
              ">

                Los servicios registrados aparecerán aquí automáticamente

              </p>

            </div>

          </div>

        ) : (

          servicios.map((s) => (

            <div
              key={s.id}
              className="
                group

                relative
                overflow-hidden

                bg-white/95
                backdrop-blur-md

                border
                border-slate-200/70

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
                from-indigo-500
                via-purple-500
                to-violet-500
              " />

              {/* GLOW */}

              <div className="
                absolute
                -top-16
                -right-16

                w-52
                h-52

                rounded-full

                bg-indigo-500/10

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
                    from-indigo-500
                    to-violet-500

                    flex
                    items-center
                    justify-center

                    text-white

                    shadow-[0_15px_35px_rgba(99,102,241,0.25)]

                    shrink-0
                  ">

                    <Sparkles size={28} />

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

                      <h4 className="
                        text-lg
                        sm:text-xl

                        font-black

                        text-slate-800

                        break-words
                      ">

                        {s.nombre}

                      </h4>

                      <span className="
                        px-3
                        py-1.5

                        rounded-full

                        bg-indigo-50

                        border
                        border-indigo-100

                        text-indigo-500

                        text-[11px]
                        font-black

                        uppercase

                        tracking-[0.08em]

                        flex
                        items-center
                        gap-1
                      ">

                        <Receipt size={10} />

                        servicio

                      </span>

                    </div>

                    {/* DESCRIPCION */}

                    {s.descripcion && (

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

                          text-slate-400

                          font-black
                        ">

                          Descripción

                        </p>

                        <p className="
                          mt-2

                          text-sm

                          text-slate-600

                          leading-relaxed
                        ">

                          {s.descripcion}

                        </p>

                      </div>

                    )}

                    {/* GRID */}

                    <div className="
                      grid
                      grid-cols-1
                      md:grid-cols-3

                      gap-3
                    ">

                      {/* PRECIO */}

                      <div className="
                        bg-gradient-to-r
                        from-emerald-500
                        to-green-500

                        rounded-[24px]

                        px-5
                        py-4

                        text-white

                        shadow-[0_15px_35px_rgba(16,185,129,0.25)]
                      ">

                        <div className="
                          flex
                          items-center
                          gap-2
                        ">

                          <BadgeDollarSign
                            size={14}
                            className="text-white/70"
                          />

                          <p className="
                            text-[11px]

                            uppercase

                            tracking-[0.12em]

                            font-black

                            text-white/70
                          ">

                            Precio

                          </p>

                        </div>

                        <p className="
                          mt-2

                          text-2xl

                          tracking-tight

                          font-black
                        ">

                          RD$
                          {" "}
                          {formatMoney(s.precio)}

                        </p>

                      </div>

                      {/* COSTO */}

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

                        <div className="
                          flex
                          items-center
                          gap-2
                        ">

                          <Receipt
                            size={14}
                            className="text-white/70"
                          />

                          <p className="
                            text-[11px]

                            uppercase

                            tracking-[0.12em]

                            font-black

                            text-white/70
                          ">

                            Costo

                          </p>

                        </div>

                        <p className="
                          mt-2

                          text-2xl

                          tracking-tight

                          font-black
                        ">

                          RD$
                          {" "}
                          {formatMoney(
                            s.costo_servicio || 0
                          )}

                        </p>

                      </div>

                      {/* GANANCIA */}

                      <div className="
                        bg-gradient-to-r
                        from-indigo-500
                        to-violet-500

                        rounded-[24px]

                        px-5
                        py-4

                        text-white

                        shadow-[0_15px_35px_rgba(99,102,241,0.25)]
                      ">

                        <div className="
                          flex
                          items-center
                          gap-2
                        ">

                          <Sparkles
                            size={14}
                            className="text-white/70"
                          />

                          <p className="
                            text-[11px]

                            uppercase

                            tracking-[0.12em]

                            font-black

                            text-white/70
                          ">

                            Ganancia

                          </p>

                        </div>

                        <p className="
                          mt-2

                          text-2xl

                          tracking-tight

                          font-black
                        ">

                          RD$
                          {" "}
                          {formatMoney(
                            (s.precio || 0) -
                            (s.costo_servicio || 0)
                          )}

                        </p>

                      </div>

                    </div>

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
                    onClick={() => {

                      setServicioEditar(s);

                      setModalServicio(true);

                    }}
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
                      setServicioAEliminar(s)
                    }
                    className="
                      h-12

                      px-5

                      rounded-[20px]

                      bg-red-50

                      hover:bg-red-100

                      text-red-500

                      text-sm
                      font-bold

                      transition-all
                      duration-300

                      active:scale-95

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

          ))

        )}

      </div>

    </div>

  );

}

export default ServiciosTab;