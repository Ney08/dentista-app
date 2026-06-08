import {
  formatFecha,
  formatHora,
  parseFechaLocal
} from "../../utils/fecha";

import { useState } from "react";

import ConfirmModal from "../../components/ConfirmModal";

function CitaList({
  citas,
  getEstado,
  porPagina,
  onEditar,
  onCompletar,
  onCancelar
}) {

  const [citaCancelar, setCitaCancelar] =
    useState(null);

  const coloresAvatar = [
    "from-blue-500 to-cyan-500",
    "from-green-500 to-emerald-500",
    "from-purple-500 to-violet-500",
    "from-pink-500 to-rose-500",
    "from-indigo-500 to-blue-500"
  ];

  return (

    <div className="
      h-full
      space-y-6
      overflow-y-auto
      overflow-x-hidden
      pr-2
      pb-2
    ">

      {citas.map((c) => {

        const estado =
          getEstado(c);

        const fecha =
          parseFechaLocal(c.fecha);

        const colorAvatar =
          coloresAvatar[
          c.id % coloresAvatar.length
          ];

        /*
        ==========================================
        ESTILOS
        ==========================================
        */

        const coloresEstado = {

          pendiente:
            "bg-yellow-50 text-yellow-700 border-yellow-200",

          atrasada:
            "bg-rose-50 text-rose-600 border-rose-200",

          completada:
            "bg-emerald-50 text-emerald-600 border-emerald-200",

          cancelada:
            "bg-slate-100 text-slate-500 border-slate-200"

        };

        const glowEstado = {

          pendiente:
            "from-yellow-500/10 to-amber-500/10",

          atrasada:
            "from-rose-500/10 to-red-500/10",

          completada:
            "from-emerald-500/10 to-green-500/10",

          cancelada:
            "from-slate-500/10 to-gray-500/10"

        };

        const borderEstado = {

          pendiente:
            "from-yellow-400 to-amber-500",

          atrasada:
            "from-rose-400 to-red-500",

          completada:
            "from-emerald-400 to-green-500",

          cancelada:
            "from-slate-400 to-gray-500"

        };

        const estadoLabel = {

          pendiente:
            "Pendiente",

          atrasada:
            "Atrasada",

          completada:
            "Completada",

          cancelada:
            "Cancelada"

        };

        return (

          <div
            key={c.id}
            className={`
              group
              relative
              overflow-hidden

              bg-white/90
              backdrop-blur-xl

              border
              border-white/40

              rounded-[34px]

              p-5
              sm:p-6

              transition-all
              duration-500

              hover:-translate-y-[4px]

              hover:shadow-[0_25px_60px_rgba(99,102,241,0.12)]

              hover:border-indigo-100

              ${estado === "cancelada"
                ? "opacity-60"
                : ""
              }
            `}
          >

            {/* TOP LINE */}

            <div
              className={`
                absolute
                top-0
                left-0

                h-1
                w-full

                bg-gradient-to-r

                ${borderEstado[estado]}
              `}
            />

            {/* GLOW */}

            <div
              className={`
                absolute
                -top-16
                -right-16

                w-56
                h-56

                rounded-full

                bg-gradient-to-br

                ${glowEstado[estado]}

                blur-3xl

                opacity-0

                group-hover:opacity-100

                transition-all
                duration-700
              `}
            />

            {/* CONTENT */}

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

              {/* LEFT */}

              <div className="
                flex
                items-start
                gap-5

                min-w-0
                flex-1
              ">

                {/* AVATAR */}

                <div
                  className={`
                    bg-gradient-to-br
                    ${colorAvatar}

                    w-16
                    h-16

                    rounded-[24px]

                    text-white

                    flex
                    items-center
                    justify-center

                    text-xl
                    font-black

                    shrink-0

                    shadow-[0_15px_35px_rgba(0,0,0,0.15)]

                    group-hover:scale-105

                    transition-all
                    duration-300
                  `}
                >
                  {c.cliente?.nombre
                    ?.charAt(0)
                    ?.toUpperCase()}
                </div>

                {/* INFO */}

                <div className="
                  min-w-0
                  flex-1
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

                      {c.cliente?.nombre}
                      {" "}
                      {c.cliente?.apellido}

                    </h3>

                    <span
                      className={`
                        px-3
                        py-1.5

                        rounded-full

                        text-[11px]
                        font-bold

                        border

                        shadow-sm

                        ${coloresEstado[estado]}
                      `}
                    >
                      {estadoLabel[estado]}
                    </span>

                  </div>

                  {/* INFO GRID */}

                  <div className="
                    grid
                    grid-cols-1
                    lg:grid-cols-4

                    gap-3
                  ">

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

                      transition-all
                      duration-300

                      group-hover:shadow-sm
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
                        {formatFecha(fecha)}
                      </p>

                    </div>

                    {/* HORA */}

                    <div className="
                      bg-gradient-to-br
                      from-white
                      to-slate-100/90

                      border
                      border-white

                      rounded-[24px]

                      px-5
                      py-4

                      transition-all
                      duration-300

                      group-hover:shadow-sm
                    ">

                      <p className="
                        text-[11px]
                        uppercase
                        tracking-[0.12em]
                        text-gray-400
                        font-black
                      ">
                        Hora
                      </p>

                      <p className="
                        mt-2
                        text-sm
                        font-bold
                        text-slate-700
                      ">
                        {formatHora(fecha)}
                      </p>

                    </div>

                    {/* DURACION */}

                    <div className="
                      bg-gradient-to-br
                      from-white
                      to-slate-100/90

                      border
                      border-white

                      rounded-[24px]

                      px-5
                      py-4

                      transition-all
                      duration-300

                      group-hover:shadow-sm
                    ">

                      <p className="
                        text-[11px]
                        uppercase
                        tracking-[0.12em]
                        text-gray-400
                        font-black
                      ">
                        Duración
                      </p>

                      <p className="
                        mt-2
                        text-sm
                        font-bold
                        text-slate-700
                      ">
                        {c.duracion} min
                      </p>

                    </div>

                    {/* ESTADO */}

                    {/* <div className="
                      bg-gradient-to-br
                      from-white
                      to-slate-100/90

                      border
                      border-white

                      rounded-[24px]

                      px-5
                      py-4

                      transition-all
                      duration-300

                      group-hover:shadow-sm
                    ">

                      <p className="
                        text-[11px]
                        uppercase
                        tracking-[0.12em]
                        text-gray-400
                        font-black
                      ">
                        Estado
                      </p>

                      <p className="
                        mt-2
                        text-sm
                        font-bold
                        text-slate-700
                      ">
                        {estadoLabel[estado]}
                      </p>

                    </div> */}

                    {/* MOTIVO */}

                    <div className="
                      lg:col-span-4

                      bg-gradient-to-br
                      from-white
                      to-slate-100/90

                      border
                      border-white

                      rounded-[24px]

                      px-5
                      py-4

                      transition-all
                      duration-300

                      group-hover:shadow-sm
                    ">

                      <p className="
                        text-[11px]
                        uppercase
                        tracking-[0.12em]
                        text-gray-400
                        font-black
                      ">
                        Motivo de la cita
                      </p>

                      <p className="
                        mt-2
                        text-sm
                        font-bold
                        text-slate-700

                        break-words
                      ">
                        {c.motivo || "Sin motivo"}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              {/* RIGHT PANEL */}

              <div
                onClick={(e) =>
                  e.stopPropagation()
                }
                className="
                  xl:min-w-[180px]

                  flex
                  flex-row
                  xl:flex-col

                  items-stretch

                  gap-3
                "
              >

                {/* PENDIENTE */}

                {estado === "pendiente" && (

                  <>

                    {/* COMPLETAR */}

                    <button
                      onClick={() =>
                        onCompletar(c)
                      }
                      className="
    group

    relative
    overflow-hidden

    h-11

    px-5

    rounded-[22px]

    bg-gradient-to-r
    from-emerald-500
    via-green-500
    to-emerald-600

    text-white

    text-sm
    font-black

    shadow-[0_12px_30px_rgba(16,185,129,0.22)]

    hover:shadow-[0_18px_40px_rgba(16,185,129,0.30)]

    hover:scale-[1.02]

    active:scale-[0.97]

    transition-all
    duration-300

    whitespace-nowrap

    flex
    items-center
    justify-center
    gap-2.5
  "
                    >

                      {/* GLOW */}

                      <div className="
    absolute
    inset-0

    opacity-0

    bg-white/10

    group-hover:opacity-100

    transition-all
    duration-300
  " />

                      {/* ICON */}

                      <span className="
    relative
    z-10

    text-sm
  ">
                        ✓
                      </span>

                      {/* TEXT */}

                      <span className="relative z-10">
                        Completar
                      </span>

                    </button>

                    {/* ACTIONS */}

                    <div className="
                      flex
                      items-center
                      justify-center
                      gap-3
                    ">

                      {/* EDITAR */}

                      <button
                        onClick={() =>
                          onEditar(c)
                        }
                        className="
                      w-12
                      h-12

                      rounded-[20px]

                      bg-gradient-to-br
                      from-slate-100
                      to-slate-200/70

                      text-slate-500

                      hover:text-slate-700

                      border
                      border-white

                      flex
                      items-center
                      justify-center

                      hover:scale-110

                      active:scale-95

                      hover:shadow-lg

                      transition-all
                      duration-300
                    "
                        title="Editar"
                      >
                        ✏️
                      </button>

                      {/* CANCELAR */}

                      <button
                        onClick={() =>
                          setCitaCancelar(c)
                        }
                        className="
                          w-12
                          h-12

                          rounded-[20px]

                          bg-gradient-to-br
                          from-slate-100
                          to-slate-200/70

                          text-slate-500

                          border
                          border-white

                          flex
                          items-center
                          justify-center

                          hover:scale-110

                          active:scale-95

                          hover:shadow-lg

                          transition-all
                          duration-300
                        "
                        title="Cancelar"
                      >
                        ⛔
                      </button>

                    </div>

                  </>

                )}

                {/* ATRASADA */}

                {estado === "atrasada" && (

                  <>

                    {/* REAGENDAR */}

                    <button
                      onClick={() =>
                        onEditar(c)
                      }
                      className="
                        h-12

                        px-5

                        rounded-[20px]

                        bg-gradient-to-r
                        from-blue-500
                        to-cyan-500

                        text-white

                        text-sm
                        font-black

                        shadow-[0_15px_35px_rgba(59,130,246,0.25)]

                        hover:scale-[1.03]

                        hover:shadow-[0_20px_45px_rgba(59,130,246,0.35)]

                        active:scale-95

                        transition-all
                        duration-300

                        whitespace-nowrap
                      "
                    >
                      ✏️ Reagendar
                    </button>

                    {/* CANCELAR */}

                    <button
                      onClick={() =>
                        setCitaCancelar(c)
                      }
                      className="
                        h-12

                        px-5

                        rounded-[20px]

                        bg-gradient-to-r
                        from-rose-500
                        to-red-500

                        text-white

                        text-sm
                        font-black

                        shadow-[0_15px_35px_rgba(239,68,68,0.25)]

                        hover:scale-[1.03]

                        hover:shadow-[0_20px_45px_rgba(239,68,68,0.35)]

                        active:scale-95

                        transition-all
                        duration-300

                        whitespace-nowrap
                      "
                    >
                      ⛔ Cancelar
                    </button>

                  </>

                )}

              </div>

            </div>

          </div>

        );

      })}

      {/* CONFIRM */}

      {citaCancelar && (

        <ConfirmModal
          mensaje={`
¿Cancelar la cita de ${citaCancelar.cliente?.nombre}?

📅 ${formatFecha(parseFechaLocal(citaCancelar.fecha))}
⏰ ${formatHora(parseFechaLocal(citaCancelar.fecha))}
`}
          onConfirm={() => {

            onCancelar(
              citaCancelar.id
            );

            setCitaCancelar(null);

          }}
          onCancel={() =>
            setCitaCancelar(null)
          }
        />

      )}

    </div>

  );

}

export default CitaList;