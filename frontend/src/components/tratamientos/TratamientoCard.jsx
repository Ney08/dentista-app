
import {

  FileText,

  Pencil,

  Trash2,

  MoreVertical,

  Stethoscope

} from "lucide-react";


import TratamientoStatusBadge
  from "./TratamientoStatusBadge";

import TratamientoPayments
  from "./TratamientoPayments";

import TratamientoSessions
  from "./TratamientoSessions";

import TratamientoTimeline
  from "./TratamientoTimeline";

function TratamientoCard({

  tratamiento

}) {

  /*
  ==========================================
  TIMELINE
  ==========================================
  */

  const timelineEvents = [

    {

      title:
        "Tratamiento creado",

      date:
        new Date(
          tratamiento.created_at
        ).toLocaleDateString(),

      description:
        "Se registró el tratamiento clínico del paciente."

    },

    {

      title:
        "Estado actual",

      date:
        "Actual",

      description:
        `Estado del tratamiento: ${tratamiento.estado}`

    }

  ];

  return (

    <div className="
      group

      relative

      overflow-hidden

      rounded-[36px]

      bg-white/80

      backdrop-blur-2xl

      border
      border-white/60

      shadow-[0_20px_50px_rgba(15,23,42,0.06)]

      p-6

      transition-all
      duration-300

      hover:-translate-y-1

      hover:shadow-[0_25px_60px_rgba(99,102,241,0.12)]
    ">

      {/* GLOW */}

      <div className="
        absolute
        -top-24
        -right-24

        w-72
        h-72

        rounded-full

        bg-indigo-500/10

        blur-3xl

        opacity-0

        group-hover:opacity-100

        transition-all
        duration-500
      " />

      {/* HEADER */}

      <div className="
        relative
        z-10

        flex
        items-start
        justify-between

        gap-4
      ">

        {/* LEFT */}

        <div>

          <div className="
            inline-flex

            items-center
            gap-2

            px-3
            py-1.5

            rounded-full

            bg-indigo-500/10

            text-indigo-600

            text-xs
            font-black

            mb-4
          ">

            <Stethoscope size={13} />

            Tratamiento dental

          </div>

          <h3 className="
            text-3xl

            font-black

            tracking-tight

            text-slate-800
          ">

            {

              tratamiento
                .servicio_nombre

              ||

              "Tratamiento"

            }

          </h3>

          <div className="
            mt-4

            flex
            flex-wrap

            items-center

            gap-3
          ">

            {/* PIEZA */}

            {

              tratamiento.pieza && (

                <div className="
                  inline-flex

                  items-center
                  gap-2

                  px-4
                  py-2.5

                  rounded-2xl

                  bg-slate-100

                  text-slate-600

                  text-sm
                  font-bold
                ">

                  🦷 Pieza

                  {
                    tratamiento.pieza
                  }

                </div>

              )

            }

            {/* STATUS */}

            <TratamientoStatusBadge

              estado={
                tratamiento.estado
              }

            />

          </div>

        </div>

        {/* ACTIONS */}

        <div className="
          flex
          items-center

          gap-2
        ">

          {/* EDIT */}

          <button className="
            w-11
            h-11

            rounded-2xl

            bg-white

            border
            border-slate-200

            flex
            items-center
            justify-center

            text-slate-500

            hover:text-indigo-600

            hover:border-indigo-200

            hover:shadow-md

            transition-all
            duration-300
          ">

            <Pencil size={16} />

          </button>

          {/* DELETE */}

          <button className="
            w-11
            h-11

            rounded-2xl

            bg-white

            border
            border-slate-200

            flex
            items-center
            justify-center

            text-slate-500

            hover:text-rose-500

            hover:border-rose-200

            hover:shadow-md

            transition-all
            duration-300
          ">

            <Trash2 size={16} />

          </button>

        </div>

      </div>

      {/* PAYMENTS */}

      <div className="
        relative
        z-10

        mt-8
      ">

        <TratamientoPayments

          costo={
            tratamiento.costo
          }

          pagado={
            tratamiento.pagado
          }

        />

      </div>

      {/* SESSIONS */}

      <div className="
        relative
        z-10

        mt-5
      ">

        <TratamientoSessions

          total={
            tratamiento
              .sesiones_totales
          }

          completed={
            tratamiento
              .sesiones_completadas
          }

        />

      </div>

      {/* NOTES */}

      {

        tratamiento.notas && (

          <div className="
            relative
            z-10

            mt-5

            rounded-[28px]

            bg-slate-50/80

            border
            border-slate-100

            p-5
          ">

            <div className="
              flex
              items-center
              gap-2

              text-slate-500

              text-xs
              font-black

              uppercase

              tracking-[0.12em]

              mb-4
            ">

              <FileText
                size={14}
              />

              Observaciones clínicas

            </div>

            <p className="
              text-sm

              leading-relaxed

              text-slate-600
            ">

              {
                tratamiento.notas
              }

            </p>

          </div>

        )

      }

      {/* TIMELINE */}

      <div className="
        relative
        z-10

        mt-8
      ">

        <div className="
          flex
          items-center
          gap-2

          mb-5

          text-slate-500

          text-xs
          font-black

          uppercase

          tracking-[0.12em]
        ">

          <MoreVertical
            size={14}
          />

          Timeline clínico

        </div>

        <TratamientoTimeline

          events={
            timelineEvents
          }

        />

      </div>

    </div>

  );

}

export default TratamientoCard;