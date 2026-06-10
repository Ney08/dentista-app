import {
    Clock3,
    User,
    Stethoscope
} from "lucide-react";

import {
    formatHora
} from "../../utils/fecha";


function CalendarEvent({
    event,
    onEditar,
    onCompletar,
    onCancelar
}) {

    const {
        resource
    } = event;

    return (

  <div

    onContextMenu={(e) => {

      e.preventDefault();

      if (
        event.onContextMenu
      ) {

        event.onContextMenu(
          e,
          event.resource
        );

      }

    }}

    className="
      group
      relative

      overflow-visible
    "
  >


            {/* EVENT */}

            <div className="
        truncate

        font-bold
      ">

                {event.title}

            </div>

            {/* TOOLTIP */}

            <div className="
        absolute

        left-1/2
        top-full

        z-[999]

        mt-3

        w-72

        -translate-x-1/2

        rounded-[24px]

        border
        border-slate-200/70
        dark:border-slate-800

        bg-white/95
        dark:bg-slate-900/95

        backdrop-blur-xl

        p-4

        opacity-0
        invisible

        scale-95

        shadow-[0_20px_50px_rgba(15,23,42,0.18)]

        transition-all
        duration-200

        group-hover:opacity-100
        group-hover:visible
        group-hover:scale-100
      ">

                {/* CLIENTE */}

                <div className="
          flex
          items-center
          gap-3
        ">

                    <User
                        size={16}
                        className="
              text-indigo-500
            "
                    />

                    <p className="
            text-sm

            font-black

            text-slate-800
            dark:text-slate-100
          ">

                        {resource.cliente?.nombre}
                        {" "}
                        {resource.cliente?.apellido}

                    </p>

                </div>

                {/* MOTIVO */}

                <div className="
          mt-3

          flex
          items-center
          gap-3
        ">

                    <Stethoscope
                        size={16}
                        className="
              text-violet-500
            "
                    />

                    <p className="
            text-sm

            text-slate-600
            dark:text-slate-300
          ">

                        {resource.motivo}

                    </p>

                </div>

                {/* HORA */}

                <div className="
          mt-3

          flex
          items-center
          gap-3
        ">

                    <Clock3
                        size={16}
                        className="
              text-emerald-500
            "
                    />

                    <p className="
            text-sm

            text-slate-600
            dark:text-slate-300
          ">

                        {formatHora(event.start)}
                        {" - "}
                        {formatHora(event.end)}

                    </p>

                </div>

                {/* ESTADO */}

                <div className="
          mt-4
        ">

                    <span className="
            inline-flex

            rounded-full

            bg-indigo-500/10

            px-3
            py-1

            text-xs

            font-black

            text-indigo-500
          ">

                        {resource.estado}

                    </span>

                </div>

            </div>

        </div>

    );

}

export default CalendarEvent;