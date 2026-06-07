import toast from "react-hot-toast";

function ClientesInactivosTab({
  clientesInactivos,
  toggleCliente
}) {

  return (

    <div className="
      bg-white/90
      backdrop-blur-xl

      border
      border-white/40

      rounded-[34px]

      shadow-[0_10px_30px_rgba(0,0,0,0.06)]

      p-5
      sm:p-6

      space-y-6

      overflow-hidden
    ">

      {/* ✅ HEADER */}

      <div className="
        flex
        flex-col
        lg:flex-row

        lg:items-center
        lg:justify-between

        gap-4
      ">

        {/* ✅ INFO */}

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
            from-rose-500
            via-pink-500
            to-red-500

            text-white

            flex
            items-center
            justify-center

            text-3xl

            shadow-[0_20px_45px_rgba(244,63,94,0.30)]
          ">
            🚫
          </div>

          <div>

            <h3 className="
              text-2xl
              sm:text-3xl

              font-black

              tracking-tight

              text-slate-800
            ">
              Clientes inactivos
            </h3>

            <p className="
              mt-1

              text-sm
              text-gray-500
            ">
              {clientesInactivos.length}
              {" "}
              cliente(s) desactivados
            </p>

          </div>

        </div>

      </div>

      {/* ✅ LIST */}

      <div className="
        space-y-6

        max-h-[650px]

        overflow-y-auto
        overflow-x-hidden

        pr-1
      ">

        {clientesInactivos.length === 0 ? (

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
                📭
              </div>

              <h3 className="
                mt-6

                text-3xl

                font-black

                text-slate-800
              ">
                No hay clientes inactivos
              </h3>

              <p className="
                mt-3

                text-gray-500

                max-w-sm
              ">
                Todos los clientes están activos actualmente
              </p>

            </div>

          </div>

        ) : (

          clientesInactivos.map((c) => (

            <div
              key={c.id}
              className="
                group

                relative
                overflow-hidden

                bg-white/90
                backdrop-blur-xl

                border
                border-white/40

                rounded-[32px]

                p-6
                sm:p-7

                shadow-[0_10px_30px_rgba(0,0,0,0.05)]

                hover:shadow-[0_20px_45px_rgba(0,0,0,0.08)]

                hover:-translate-y-[3px]

                transition-all
                duration-500
              "
            >

              {/* ✅ TOP BORDER */}

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

              {/* ✅ GLOW */}

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

              {/* ✅ CONTENT */}

              <div className="
                relative
                z-10

                flex
                flex-col
                xl:flex-row

                xl:items-center
                xl:justify-between

                gap-6
              ">

                {/* ✅ LEFT */}

                <div className="
                  flex
                  items-start

                  gap-6

                  flex-1
                  min-w-0
                ">

                  {/* ✅ ICON */}

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
                    👤
                  </div>

                  {/* ✅ INFO */}

                  <div className="
                    flex-1
                    min-w-0

                    space-y-4
                  ">

                    {/* ✅ HEADER */}

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
                        {c.nombre}
                        {" "}
                        {c.apellido}
                      </h4>

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
                        inactivo
                      </span>

                    </div>

                    {/* ✅ GRID */}

                    <div className="
                      grid
                      grid-cols-1
                      md:grid-cols-2

                      gap-3
                    ">

                      {/* ✅ TELEFONO */}

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
                          Teléfono
                        </p>

                        <p className="
                          mt-2

                          text-sm

                          font-bold

                          text-slate-700
                        ">
                          {c.telefono || "No registrado"}
                        </p>

                      </div>

                      {/* ✅ ESTADO */}

                      <div className="
                        bg-gradient-to-r
                        from-rose-500
                        to-pink-500

                        rounded-[24px]

                        px-5
                        py-4

                        text-white

                        shadow-[0_15px_35px_rgba(244,63,94,0.25)]

                        hover:shadow-[0_25px_55px_rgba(236,72,153,0.35)]

                        transition-all
                        duration-300
                      ">

                        <p className="
                          text-[11px]

                          uppercase

                          tracking-[0.12em]

                          font-black

                          text-white/70
                        ">
                          Estado
                        </p>

                        <p className="
                          mt-2

                          text-3xl

                          tracking-tight

                          font-black
                        ">
                          Inactivo
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

                {/* ✅ ACTIONS */}

                <div className="
                  flex
                  flex-row
                  xl:flex-col

                  items-center

                  gap-3
                ">

                  {/* ✅ ACTIVAR */}

                  <button
                    onClick={() => {

                      toggleCliente.mutate(
                        c,
                        {
                          onSuccess: () => {

                            toast.success(
                              "Cliente activado ✅"
                            );

                          }
                        }
                      );

                    }}

                    className="
                      h-12

                      px-5

                      rounded-[20px]

                      bg-gradient-to-r
                      from-emerald-500
                      to-green-500

                      text-white

                      text-sm
                      font-black

                      shadow-[0_15px_35px_rgba(16,185,129,0.28)]

                      hover:scale-[1.04]

                      hover:shadow-[0_20px_45px_rgba(16,185,129,0.35)]

                      active:scale-95

                      transition-all
                      duration-300
                    "
                  >
                    ✅ Activar
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

export default ClientesInactivosTab;