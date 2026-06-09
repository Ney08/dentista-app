import {
  Calendar,
  dateFnsLocalizer
} from "react-big-calendar";

import {
  format,
  parse,
  startOfWeek,
  getDay
} from "date-fns";

import es from "date-fns/locale/es";

const locales = {
  es
};

const localizer =
  dateFnsLocalizer({

    format,

    parse,

    startOfWeek,

    getDay,

    locales

  });

function AgendaCalendar({
  citas = []
}) {

  const events =
    citas.map((cita) => ({

      title:
        `${cita.paciente}`,

      start:
        new Date(cita.inicio),

      end:
        new Date(cita.fin),

      resource:
        cita

    }));

  return (

    <div className="
      bg-white/95
      backdrop-blur-md

      border
      border-slate-200/80

      rounded-[34px]

      p-6

      shadow-[0_10px_30px_rgba(0,0,0,0.05)]
    ">

      {/* HEADER */}

      <div className="
        mb-6
      ">

        <h3 className="
          text-2xl

          font-black

          text-slate-800
        ">

          Agenda clínica

        </h3>

        <p className="
          text-sm

          text-slate-500
        ">

          Calendario profesional de citas

        </p>

      </div>

      {/* CALENDAR */}

      <div className="
        h-[750px]

        overflow-hidden

        rounded-[28px]

        border
        border-slate-200
      ">

        <Calendar

          localizer={localizer}

          events={events}

          startAccessor="start"

          endAccessor="end"

          culture="es"

          popup

          views={[
            "month",
            "week",
            "day",
            "agenda"
          ]}

          defaultView="week"

          eventPropGetter={() => ({

            style: {

              background:
                "linear-gradient(135deg,#8b5cf6,#6366f1)",

              border:
                "none",

              borderRadius:
                "12px",

              color:
                "white",

              padding:
                "4px 8px",

              fontWeight:
                700

            }

          })}

          style={{
            height: "100%"
          }}

        />

      </div>

    </div>

  );

}

export default AgendaCalendar;