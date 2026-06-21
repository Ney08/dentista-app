import {
  formatFecha,
  formatHora,
  parseFechaLocal
} from "../../utils/fecha";

import { useState, useRef } from "react";

import {
  CalendarDays,
  Clock3,
  TimerReset,
  CheckCircle2,
  Pencil,
  XCircle,
  AlertTriangle
} from "lucide-react";

import ConfirmModal from "../../components/ConfirmModal";

function CitaList({
  citas,
  getEstado,
  porPagina,
  onEditar,
  onCompletar,
  onCancelar
}) {
  const timeoutRef = useRef(null);
  const [citaCancelar, setCitaCancelar] =
    useState(null);
  const [undoCancel, setUndoCancel] =
    useState(null);

  const [pendingCancelId, setPendingCancelId] =
    useState(null);


const coloresAvatar = [
  "from-sky-700 to-sky-900",
  "from-cyan-500 to-sky-700",
  "from-teal-500 to-cyan-600",
  "from-emerald-500 to-teal-600",
  "from-blue-600 to-sky-800"
];


  return (

    <div className="
      h-full

      space-y-4

      overflow-y-auto
      overflow-x-hidden

      pr-2
      pb-2

      scrollbar-thin
      scrollbar-thumb-sky-200/70
      scrollbar-track-transparent
    ">

      {citas.map((c) => {


        const estadoReal =
          getEstado(c);

        const estado =
          pendingCancelId === c.id
            ? "cancelada"
            : estadoReal;


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

              bg-white/95
              backdrop-blur-md

              border
              border-slate-200/80

              rounded-[34px]

              p-5
              sm:p-6

              transition-all
              duration-500

              hover:-translate-y-[2px]

              
hover:shadow-[0_20px_45px_rgba(7,89,133,0.08)]

hover:border-sky-200


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

                h-[3px]
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

  grid
  grid-cols-1
  2xl:grid-cols-[minmax(0,1fr)_210px]

  gap-6
">


              {/* LEFT */}

              <div className="
                flex
                items-start

                gap-5

                min-w-0
              ">

                {/* AVATAR */}

                <div
                  className={`
                    relative

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

                    ring-4
                    ring-white

                    shadow-[0_15px_35px_rgba(0,0,0,0.15)]

                    group-hover:scale-105

                    transition-all
                    duration-300
                  `}
                >

                  {c.cliente?.nombre
                    ?.charAt(0)
                    ?.toUpperCase()}

                  <div className={`
                    absolute
                    -bottom-1
                    -right-1

                    w-5
                    h-5

                    rounded-full

                    border-4
                    border-white

                    ${estado === "pendiente"
                      ? "bg-yellow-400"
                      : estado === "atrasada"
                        ? "bg-rose-500"
                        : estado === "completada"
                          ? "bg-emerald-500"
                          : "bg-slate-400"
                    }
                  `} />

                </div>

                {/* INFO */}

                <div className="
                  min-w-0
                  flex-1

                  space-y-5
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

                          {c.cliente?.nombre}{" "}
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

                      {/* MINI INFO */}

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

                          <CalendarDays size={12} />

                          Agenda clínica

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

                          <Clock3 size={12} />

                          Seguimiento activo

                        </div>

                      </div>

                    </div>

                    {/* STATUS CARD */}

                    {/* <div className={`
                      shrink-0

                      rounded-[24px]

                      border

                      px-5
                      py-4

                      min-w-[230px]

                      ${estado === "pendiente"
                        ? "bg-yellow-50 border-yellow-100"
                        : estado === "atrasada"
                          ? "bg-rose-50 border-rose-100"
                          : estado === "completada"
                            ? "bg-emerald-50 border-emerald-100"
                            : "bg-slate-50 border-slate-200"
                      }
                    `}>

                      <div className="
                        flex
                        items-center
                        gap-2

                        text-sm
                        font-bold
                      ">

                        <AlertTriangle size={15} />

                        Estado de la cita

                      </div>

                      <p className="
                        mt-3

                        text-base

                        font-black

                        text-slate-800
                      ">

                        {estadoLabel[estado]}

                      </p>

                      <p className="
                        mt-1

                        text-xs

                        text-slate-500
                      ">

                        Control clínico y agenda médica

                      </p>

                    </div> */}

                  </div>

                  {/* GRID */}


                  <div className="
  grid
  grid-cols-1
  sm:grid-cols-2
  xl:grid-cols-3

  gap-4
">


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

                        {formatFecha(fecha)}

                      </p>

                    </div>

                    {/* HORA */}

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

                        <Clock3 size={12} />

                        Hora

                      </div>

                      <p className="
                        mt-3

                        text-sm

                        font-bold

                        text-slate-700
                      ">

                        {formatHora(fecha)}

                      </p>

                    </div>

                    {/* DURACION */}

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

                        <TimerReset size={12} />

                        Duración

                      </div>

                      <p className="
                        mt-3

                        text-sm

                        font-bold

                        text-slate-700
                      ">

                        {c.duracion} min

                      </p>

                    </div>

                    {/* TIPO */}

                    {/* <div className="
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

                        <CheckCircle2 size={12} />

                        Tipo

                      </div>

                      <p className="
                        mt-3

                        text-sm

                        font-bold

                        text-slate-700
                      ">

                        Consulta clínica

                      </p>

                    </div> */}

                    {/* MOTIVO + TRATAMIENTO */}

                    <div className="
  grid
  grid-cols-1
  xl:grid-cols-2

  gap-4
">

                      {/* MOTIVO */}

                      <div className="
                      md:col-span-2
                      xl:col-span-4

                      bg-slate-50/80

                      border
                      border-slate-200/60

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
                          Motivo de la cita
                        </p>

                        <p className="
                        mt-3

                        text-sm

                        font-bold

                        text-slate-700

                        break-words
                      ">

                          {c.motivo || "Sin motivo"}

                        </p>

                      </div>

                    </div>
                    {/* TRATAMIENTO */}

                    {c.tratamiento && (

                      <div className="
    w-full

 
bg-sky-50/70

border
border-sky-100


    rounded-[24px]

    px-5
    py-4

    overflow-hidden
  ">

                        <p className="
      text-[11px]

      uppercase

      tracking-[0.12em]

      text-sky-600

      font-black
    ">
                          Tratamiento vinculado
                        </p>

                        <div className="
      mt-3

      flex
      flex-wrap

      items-center

      gap-2
    ">

                          <div className="
        max-w-full

        px-3
        py-1.5

        rounded-full

        bg-white

        border
        border-sky-100

        text-xs
        font-bold

        text-sky-800

        break-words
      ">

                            {c.tratamiento.servicio}

                            {c.tratamiento.pieza
                              ? ` • Pieza ${c.tratamiento.pieza}`
                              : ""}

                          </div>

                          <div className="
        px-3
        py-1.5

        rounded-full

        bg-emerald-50

        border
        border-emerald-100

        text-xs
        font-bold

        text-emerald-600

        whitespace-nowrap
      ">

                            {c.tratamiento.sesiones_completadas}
                            /
                            {c.tratamiento.sesiones_totales}
                            {" "}sesiones

                          </div>

                          <div className="
        px-3
        py-1.5

        rounded-full

        bg-slate-100

        border
        border-slate-200

        text-xs
        font-bold

        text-slate-600

        whitespace-nowrap
      ">

                            {c.tratamiento.estado}

                          </div>

                        </div>

                      </div>

                    )}
                  </div>

                </div>

              </div>
              {/* RIGHT PANEL */}

              <div
                onClick={(e) =>
                  e.stopPropagation()
                }
                className="
    self-center

    2xl:w-[210px]

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
          h-12

          px-5

          rounded-2xl

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

          transition-all
          duration-300

          flex
          items-center
          justify-center
          gap-2
        "
                    >

                      <CheckCircle2 size={15} />

                      Completar

                    </button>

                    {/* EDIT */}

                    <button
                      onClick={() =>
                        onEditar(c)
                      }
                      className="
          h-12

          px-5

          rounded-2xl

          bg-slate-100

          border
          border-slate-200

          text-slate-700

          text-sm
          font-bold

          hover:bg-slate-200

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

                    {/* CANCEL */}

                    <button
                      onClick={() =>
                        setCitaCancelar(c)
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

                      <XCircle size={15} />

                      Cancelar

                    </button>

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

                      Reagendar

                    </button>

                    {/* CANCELAR */}

                    <button
                      onClick={() =>
                        setCitaCancelar(c)
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

                      <XCircle size={15} />

                      Cancelar

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

            const id = citaCancelar.id;

            /*
            ==========================================
            CANCELACIÓN VISUAL LOCAL
            ==========================================
            */

            setPendingCancelId(id);

            /*
            ==========================================
            MOSTRAR DESHACER
            ==========================================
            */

            setUndoCancel(id);

            /*
            ==========================================
            LIMPIAR TIMER ANTERIOR
            ==========================================
            */

            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }

            /*
            ==========================================
            BACKEND DESPUÉS DE 5 SEGUNDOS
            ==========================================
            */

            timeoutRef.current = setTimeout(async () => {

              try {

                await onCancelar(id, false);

              } catch (error) {

                console.error(
                  "Error cancelando cita:",
                  error
                );

                setPendingCancelId(null);

              } finally {

                setUndoCancel(null);
                setPendingCancelId(null);
                timeoutRef.current = null;

              }

            }, 5000);

            setCitaCancelar(null);

          }}

          onCancel={() =>
            setCitaCancelar(null)
          }
        />

      )}


      {/* UNDO CANCEL */}

      {undoCancel !== null && (

        <div className="
    fixed

    bottom-6
    right-6

    z-[99999]

    flex
    items-center
    gap-4

    rounded-[28px]

    border
    border-slate-200/70

    bg-white/95

    backdrop-blur-xl

    px-5
    py-4

    shadow-[0_20px_50px_rgba(15,23,42,0.18)]

    animate-modalUp
  ">

          <div>

            <p className="
        text-sm

        font-black

        text-slate-800
      ">

              Cita cancelada

            </p>

            <p className="
        text-xs

        text-slate-500
      ">

              Puedes deshacer esta acción

            </p>

          </div>

          <button
            onClick={() => {

              /*
              ==========================================
              CANCELAR TIMER
              ==========================================
              */

              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
              }

              /*
              ==========================================
              RESTAURAR VISUALMENTE
              ==========================================
              */

              setPendingCancelId(null);

              setUndoCancel(null);

            }}
            className="
        h-11

        rounded-full

       
bg-sky-800
hover:bg-sky-900

transition-all
duration-300


        px-5

        text-sm

        font-black

        text-white

        shadow-[0_10px_30px_rgba(7,89,133,0.25)]
      "
          >

            Deshacer

          </button>

        </div>

      )}
    </div>

  );

}

export default CitaList;