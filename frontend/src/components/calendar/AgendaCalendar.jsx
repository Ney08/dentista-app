import {
  useState,
  useEffect
} from "react";

import {
  showSuccess,
  showError
} from "../ui/ToastStyles";
import {
  TrendingUp,

} from "lucide-react";
import {
  Calendar,
  dateFnsLocalizer
} from "react-big-calendar";

import withDragAndDrop from
  "react-big-calendar/lib/addons/dragAndDrop";

import
  "react-big-calendar/lib/addons/dragAndDrop/styles.css";

import {
  format,
  parse,
  startOfWeek,
  getDay,
  isSameDay
} from "date-fns";

import es from "date-fns/locale/es";
import CalendarEvent from "./CalendarEvent";
import {
  useCitas
} from "../../hooks/useCitas";

import CitaDetailsModal from "./CitaDetailsModal";

import CreateCitaModal from "./CreateCitaModal";

import {
  parseFechaLocal
} from "../../utils/fecha";
import EditCitaModal from "./EditCitaModal"
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

const DnDCalendar =
  withDragAndDrop(Calendar);

function AgendaCalendar() {

  /*
  ==========================================
  CITAS
  ==========================================
  */

  const [contextMenu, setContextMenu] =
    useState(null);
  const {
    citas = [],
    actualizarCita,
    crearCita
  } = useCitas();


  /*
  ==========================================
  EVENTS
  ==========================================
  */

  const [events, setEvents] =
    useState([]);

  useEffect(() => {

    if (!Array.isArray(citas)) {

      setEvents([]);

      return;

    }

    const ahora =
      new Date();

    const mapped =
      citas.map((cita) => {

        const start =
          parseFechaLocal(
            cita.fecha
          );

        const duration =
          cita.duracion || 30;

        const end =
          new Date(
            start.getTime() +
            duration * 60000
          );

        /*
        ==========================================
        ESTADO DINAMICO
        ==========================================
        */


        let estado =
          cita.estado ||
          "pendiente";

        if (
          estado !== "completada" &&
          estado !== "cancelada" &&
          end < ahora
        ) {

          estado =
            "atrasada";

        }

        return {

          id:
            cita.id,

          title:

            `${cita.cliente?.nombre || ""}
 ${cita.cliente?.apellido || ""}
 • ${cita.motivo || "Consulta"}
 • ${cita.telefono || ""}`

              .replace(/\s+/g, " ")
              .trim(),

          start,

          end,

          resource: {

            ...cita,

            estado

          }

        };

      });

    setEvents(mapped);

  }, [citas]);

  /*
  ==========================================
  STATES
  ==========================================
  */

  const [selectedEvent, setSelectedEvent] =
    useState(null);

  const [editingEvent, setEditingEvent] =
    useState(null);

  const [selectedSlot, setSelectedSlot] =
    useState(null);

  const [view, setView] =
    useState("week");
  const [date, setDate] =
    useState(new Date());

  /*
  
==========================================
STATS
==========================================
*/
  useEffect(() => {

    if (

      !selectedEvent &&
      !selectedSlot &&
      !editingEvent

    ) {

      document.body.style.overflow =
        "auto";

      document.body.style.pointerEvents =
        "auto";

    }

    return () => {

      document.body.style.overflow =
        "auto";

      document.body.style.pointerEvents =
        "auto";

    };

  }, [

    selectedEvent,

    selectedSlot,

    editingEvent

  ]);
  const [undoCancel, setUndoCancel] =
    useState(null);

  const citasHoy =
    events.filter((e) =>

      isSameDay(
        e.start,
        new Date()
      )

    );

  const pendientes =
    citasHoy.filter(

      (e) =>

        e.resource.estado ===
        "pendiente"

    ).length;

  const atrasadas =
    citasHoy.filter(

      (e) =>

        e.resource.estado ===
        "atrasada"

    ).length;

  const completadas =
    citasHoy.filter(

      (e) =>

        e.resource.estado ===
        "completada"

    ).length;

  const canceladas =
    citasHoy.filter(

      (e) =>

        e.resource.estado ===
        "cancelada"

    ).length;
  /*
  ==========================================
  HELPERS
  ==========================================
  */

  const ahora =
    new Date();

  const inicioHoy =
    new Date();

  inicioHoy.setHours(
    0,
    0,
    0,
    0
  );

  /*
  ==========================================
  PASADO
  ==========================================
  */

  const esPasado = (
    fecha
  ) => {

    return (
      fecha < ahora
    );

  };

  /*
  ==========================================
  DIA PASADO
  ==========================================
  */

  const esDiaPasado = (
    fecha
  ) => {

    const compare =
      new Date(fecha);

    compare.setHours(
      0,
      0,
      0,
      0
    );

    return (
      compare < inicioHoy
    );

  };

  /*
  ==========================================
  SLOT OCUPADO
  ==========================================
  */

  const estaOcupado = (
    start,
    end
  ) => {

    return events.some((e) => (

      start < e.end &&
      end > e.start

    ));

  };

  /*
  ==========================================
  CREAR NUEVA CITA
  ==========================================
  */

  const handleSelectSlot = (
    slotInfo
  ) => {

    const start =
      new Date(
        slotInfo.start
      );

    const end =
      new Date(
        slotInfo.end
      );

    /*
    ==========================================
    NO CREAR EN PASADO
    ==========================================
    */

    if (
      esPasado(start)
    ) {

      return;

    }

    /*
    ==========================================
    NO CREAR EN SLOT OCUPADO
    ==========================================
    */

    if (
      estaOcupado(
        start,
        end
      )
    ) {

      return;

    }

    setSelectedSlot(
      slotInfo
    );

  };

  /*
  ==========================================
  ABRIR EVENTO
  ==========================================
  */

  const handleSelectEvent = (
    event
  ) => {

    /*
    ==========================================
    COMPLETADA:
    NO ABRIR
    ==========================================
    */

    if (
      event.resource.estado ===
      "completada"
    ) {

      return;

    }

    /*
    ==========================================
    CANCELADA:
    NO ABRIR
    ==========================================
    */

    if (
      event.resource.estado ===
      "cancelada"
    ) {

      return;

    }

    /*
    ==========================================
    PENDIENTE / ATRASADA
    ==========================================
    */

    setSelectedEvent(event);

  };
  /*
==========================================
MOVE EVENT
==========================================
*/

  const moveEvent =
    async ({
      event,
      start,
      end
    }) => {

      /*
      ==========================================
      COMPLETADA/CANCELADA
      ==========================================
      */

      if (
        event.resource.estado ===
        "completada" ||

        event.resource.estado ===
        "cancelada"
      ) {

        return;

      }

      /*
      ==========================================
      PAST
      ==========================================
      */

      if (
        start < new Date()
      ) {

        return showError(
          "No puedes mover una cita al pasado"
        );

      }

      /*
      ==========================================
      OVERLAP
      ==========================================
      */

      const ocupado =
        events.some((e) => {

          if (
            e.id === event.id
          ) {

            return false;

          }

          return (

            start < e.end &&
            end > e.start

          );

        });

      if (ocupado) {

        return showError(
          "Horario ocupado"
        );

      }

      /*
      ==========================================
      SAVE
      ==========================================
      */

      try {

        await actualizarCita
          .mutateAsync({

            id:
              event.resource.id,

            data: {

              ...event.resource,

              fecha:
                new Date(

                  start.getTime() -
                  start.getTimezoneOffset() * 60000

                ).toISOString(),

              duracion:

                Math.round(

                  (
                    end - start
                  ) / 60000

                )

            }

          });

        showSuccess(
          "Cita reagendada"
        );

      } catch {

        showError(
          "Error al mover cita"
        );

      }

    };
  /*
==========================================
RESIZE EVENT
==========================================
*/

  const resizeEvent =
    async ({
      event,
      start,
      end
    }) => {

      /*
      ==========================================
      COMPLETADA/CANCELADA
      ==========================================
      */

      if (

        event.resource.estado ===
        "completada" ||

        event.resource.estado ===
        "cancelada"

      ) {

        return;

      }

      /*
      ==========================================
      DURATION
      ==========================================
      */

      const duracion =

        Math.max(

          15,

          Math.round(

            (
              end - start
            ) / 60000

          )

        );

      /*
      ==========================================
      OVERLAP
      ==========================================
      */

      const ocupado =
        events.some((e) => {

          if (
            e.id === event.id
          ) {

            return false;

          }

          return (

            start < e.end &&
            end > e.start

          );

        });

      if (ocupado) {

        return showError(
          "Horario ocupado"
        );

      }

      /*
      ==========================================
      SAVE
      ==========================================
      */

      try {

        await actualizarCita
          .mutateAsync({

            id:
              event.resource.id,

            data: {

              ...event.resource,

              fecha:
                new Date(

                  start.getTime() -
                  start.getTimezoneOffset() *
                  60000

                ).toISOString(),

              duracion

            }

          });

        showSuccess(
          "Duración actualizada"
        );

      } catch {

        showError(
          "Error al actualizar duración"
        );

      }

    };

  /*
==========================================
DUPLICAR CITA
==========================================
*/

  const duplicateCita =
    async (cita) => {

      try {

        /*
        ==========================================
        DUPLICAR +7 DÍAS
        ==========================================
        */

        const nuevaFecha =
          new Date(cita.fecha);

        nuevaFecha.setDate(
          nuevaFecha.getDate() + 7
        );

        /*
        ==========================================
        CREAR NUEVA CITA
        ==========================================
        */

        await crearCita
          .mutateAsync({

            ...cita,

            id: undefined,

            fecha:
              nuevaFecha.toISOString(),

            estado:
              "pendiente"

          });

        showSuccess(
          "Cita duplicada ✅"
        );

      } catch {

        showError(
          "Error al duplicar cita"
        );

      }

    };
  return (

    <div className="
      bg-white/95
      dark:bg-slate-900/95

      backdrop-blur-md

      border
      border-slate-200/80
      dark:border-slate-800

      rounded-[34px]

      p-6

      shadow-[0_10px_30px_rgba(0,0,0,0.05)]
    ">
      {/* STATS */}

      <div className="
  mb-6

  grid
  grid-cols-2
  md:grid-cols-4

  gap-4
">

        {/* PENDIENTES */}

        <div className="
    rounded-[24px]

    border
    border-indigo-200/60

    bg-indigo-500/5

    p-4
  ">

          <p className="
      text-xs

      uppercase

      font-black

      tracking-[0.14em]

      text-indigo-400
    ">

            Pendientes

          </p>

          <h3 className="
      mt-2

      text-3xl

      font-black

      text-indigo-600
    ">

            {pendientes}

          </h3>

        </div>

        {/* ATRASADAS */}

        <div className="
    rounded-[24px]

    border
    border-rose-200/60

    bg-rose-500/5

    p-4
  ">

          <p className="
      text-xs

      uppercase

      font-black

      tracking-[0.14em]

      text-rose-400
    ">

            Atrasadas

          </p>

          <h3 className="
      mt-2

      text-3xl

      font-black

      text-rose-500
    ">

            {atrasadas}

          </h3>

        </div>

        {/* COMPLETADAS */}

        <div className="
    rounded-[24px]

    border
    border-emerald-200/60

    bg-emerald-500/5

    p-4
  ">

          <p className="
      text-xs

      uppercase

      font-black

      tracking-[0.14em]

      text-emerald-400
    ">

            Completadas

          </p>

          <h3 className="
      mt-2

      text-3xl

      font-black

      text-emerald-500
    ">

            {completadas}

          </h3>

        </div>

        {/* CANCELADAS */}

        <div className="
    rounded-[24px]

    border
    border-slate-200/60

    bg-slate-500/5

    p-4
  ">

          <p className="
      text-xs

      uppercase

      font-black

      tracking-[0.14em]

      text-slate-400
    ">

            Canceladas

          </p>

          <h3 className="
      mt-2

      text-3xl

      font-black

      text-slate-500
    ">

            {canceladas}

          </h3>

        </div>

      </div>
      {/* HEADER */}

      <div className="
        mb-6
      ">

        <div>

          <div className="
                inline-flex

                items-center
                gap-2

                text-indigo-600

                text-sm
                font-bold
              ">

            <TrendingUp size={18} />

            Agenda clínica

          </div>

          <p className="
                mt-2

                text-sm

                text-slate-500
              ">
            Calendario profesional de citas
          </p>

        </div>

      </div>

      {/* CALENDAR */}

      <div className="
        h-[750px]
        agenda-calendar
        overflow-hidden
        relative z-10
        rounded-[28px]

        border
        border-slate-200
        dark:border-slate-800

        bg-white
        dark:bg-slate-950
      ">

        <DnDCalendar

          onEventDrop={moveEvent}

          localizer={localizer}

          draggableAccessor={(event) => {

            return (

              event.resource.estado !==
              "completada" &&

              event.resource.estado !==
              "cancelada"

            );

          }}

          onEventResize={resizeEvent}

          events={events}

          /*
          ==========================================
          FIX AGENDA VIEW
          ==========================================
          */

          components={

            view === "agenda"

              ? {}

              : {

                event: (props) => (

                  <CalendarEvent

                    {...props}

                    event={{
                      ...props.event,

                      onContextMenu: (
                        e,
                        cita
                      ) => {

                        setContextMenu({

                          x: e.clientX,

                          y: e.clientY,

                          cita

                        });

                      }

                    }}

                    onEditar={(cita) => {

                      setEditingEvent(cita);

                    }}

                    onCompletar={(cita) => {

                      console.log(
                        "completar",
                        cita
                      );

                    }}

                    onCancelar={(cita) => {

                      console.log(
                        "cancelar",
                        cita
                      );

                    }}

                  />

                )

              }

          }

          startAccessor="start"

          endAccessor="end"

          scrollToTime={
            new Date(
              1970,
              1,
              1,
              new Date().getHours(),
              new Date().getMinutes()
            )
          }

          selectable

          resizable

          culture="es"

          step={15}

          timeslots={1}

          defaultView="week"

          /*
          ==========================================
          VIEW STATE
          ==========================================
          */

          view={view}

          onView={setView}

          date={date}

          onNavigate={setDate}

          views={[
            "month",
            "week",
            "day",
            "agenda"
          ]}

          min={
            new Date(
              2026,
              0,
              1,
              8,
              0,
              0
            )
          }

          max={
            new Date(
              2026,
              0,
              1,
              19,
              0,
              0
            )
          }

          /*
          ==========================================
          EVENTS
          ==========================================
          */

          onSelectEvent={
            handleSelectEvent
          }

          onSelectSlot={
            handleSelectSlot
          }

          /*
          ==========================================
          DIAS PASADOS
          ==========================================
          */

          dayPropGetter={(date) => {

            if (
              esDiaPasado(date)
            ) {

              return {

                style: {

                  background:
                    "rgba(148,163,184,0.08)"

                }

              };

            }

            return {};

          }}

          /*
          ==========================================
          SLOT STYLE
          ==========================================
          */

          slotPropGetter={(date) => {

            /*
            ==========================================
            AGENDA FIX
            ==========================================
            */

            if (
              view === "agenda"
            ) {

              return {};

            }

            const slotStart =
              new Date(date);

            const slotEnd =
              new Date(
                slotStart.getTime() +
                15 * 60000
              );

            const ocupado =
              estaOcupado(
                slotStart,
                slotEnd
              );

            const pasado =
              esPasado(
                slotStart
              );

            /*
            ==========================================
            PASADO
            ==========================================
            */

            if (
              pasado
            ) {

              return {

                style: {

                  background:
                    "rgba(148,163,184,0.10)",

                  opacity:
                    0.55

                }

              };

            }

            /*
            ==========================================
            OCUPADO
            ==========================================
            */

            if (
              ocupado
            ) {

              return {

                style: {

                  background:
                    "rgba(99,102,241,0.06)",

                  cursor:
                    "not-allowed"

                }

              };

            }

            return {};

          }}

          /*
          ==========================================
          EVENT STYLE
          ==========================================
          */

          eventPropGetter={(event) => {

            /*
            ==========================================
            AGENDA FIX
            ==========================================
            */

            if (
              view === "agenda"
            ) {

              return {};

            }

            const estado =
              event.resource.estado;

            /*
            ==========================================
            COMPLETADA
            ==========================================
            */

            if (
              estado ===
              "completada"
            ) {

              return {

                style: {

                  background:
                    "linear-gradient(135deg,#10b981,#059669)",

                  border:
                    "none",

                  borderRadius:
                    "14px",

                  color:
                    "white",

                  opacity:
                    0.85,

                  cursor:
                    "default",

                  padding:
                    "4px 8px",

                  fontWeight:
                    700

                }

              };

            }

            /*
            ==========================================
            ATRASADA
            ==========================================
            */

            if (
              estado ===
              "atrasada"
            ) {

              return {

                style: {

                  background:
                    "linear-gradient(135deg,#ef4444,#f43f5e)",

                  border:
                    "none",

                  borderRadius:
                    "14px",

                  color:
                    "white",

                  padding:
                    "4px 8px",

                  fontWeight:
                    700

                }

              };

            }

            /*
            ==========================================
            CANCELADA
            ==========================================
            */

            if (
              estado ===
              "cancelada"
            ) {

              return {

                style: {

                  background:
                    "linear-gradient(135deg,#64748b,#475569)",

                  border:
                    "none",

                  borderRadius:
                    "14px",

                  color:
                    "white",

                  opacity:
                    0.55,

                  cursor:
                    "default",

                  padding:
                    "4px 8px",

                  fontWeight:
                    700

                }

              };

            }

            /*
            ==========================================
            NORMAL
            ==========================================
            */

            return {

              style: {

                background:
                  "linear-gradient(135deg,#8b5cf6,#6366f1)",

                border:
                  "none",

                borderRadius:
                  "14px",

                color:
                  "white",

                padding:
                  "4px 8px",

                fontWeight:
                  700,

                boxShadow:
                  "0 10px 30px rgba(99,102,241,0.25)"

              }

            };

          }}

          /*
          ==========================================
          MESSAGES
          ==========================================
          */

          messages={{

            today:
              "Hoy",

            previous:
              "Anterior",

            next:
              "Siguiente",

            month:
              "Mes",

            week:
              "Semana",

            day:
              "Día",

            agenda:
              "Agenda",

            date:
              "Fecha",

            time:
              "Hora",

            event:
              "Cita",

            noEventsInRange:
              "No hay citas en este rango"

          }}

          style={{
            height: "100%"
          }}

        />

      </div>

      {/* DETAILS */}

      {selectedEvent && (

        <CitaDetailsModal
          onCancelar={(cita) => {

            setSelectedEvent(null);

            /*
            ==========================================
            OPTIMISTIC
            ==========================================
            */

            setEvents((prev) =>

              prev.map((e) => {

                if (
                  e.id !== cita.id
                ) {

                  return e;

                }

                return {

                  ...e,

                  resource: {

                    ...e.resource,

                    estado:
                      "cancelada"

                  }

                };

              })

            );

            /*
            ==========================================
            UNDO
            ==========================================
            */

            setUndoCancel(cita);

            setTimeout(async () => {

              setUndoCancel((current) => {

                /*
                ==========================================
                YA DESHIZO
                ==========================================
                */

                if (
                  !current
                ) {

                  return null;

                }

                /*
                ==========================================
                CONFIRM CANCEL
                ==========================================
                */

                actualizarCita
                  .mutateAsync({

                    id: cita.id,

                    data: {

                      ...cita,

                      estado:
                        "cancelada"

                    }

                  });

                return null;

              });

            }, 5000);

          }}
          cita={{

            ...selectedEvent.resource,

            fecha:
              selectedEvent.start,

            cliente:

              selectedEvent.resource
                ?.cliente ||

              {
                nombre:

                  selectedEvent.title
                    ?.split("•")[0]
                    ?.trim(),

                apellido:
                  ""
              }

          }}

          onClose={() =>
            setSelectedEvent(null)
          }

          onEditar={(cita) => {

            setSelectedEvent(null);

            setEditingEvent(cita);

          }}

        />

      )}

      {/* CREATE */}

      {selectedSlot && (

        <CreateCitaModal

          slot={selectedSlot}

          onClose={() =>
            setSelectedSlot(null)
          }

          onCreate={() => {

            setSelectedSlot(null);

          }}

        />

      )}
      {/* EDIT */}
      {editingEvent && (

        <EditCitaModal

          cita={editingEvent}

          onClose={() =>
            setEditingEvent(null)
          }

        />

      )}
      {/* UNDO CANCEL */}

      {undoCancel && (

        <div className="
    fixed

    bottom-6
    right-6

    z-[99999]

    flex
    items-center
    gap-4

    rounded-[24px]

    border
    border-slate-200/70

    bg-white/95
    dark:bg-slate-900/95

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
        dark:text-slate-100
      ">

              Cita cancelada

            </p>

            <p className="
        text-xs

        text-slate-500
      ">

              Puedes deshacer la acción

            </p>

          </div>

          <button
            onClick={() => {

              /*
              ==========================================
              RESTORE
              ==========================================
              */

              setEvents((prev) =>

                prev.map((e) => {

                  if (
                    e.id !==
                    undoCancel.id
                  ) {

                    return e;

                  }

                  return {

                    ...e,

                    resource: {

                      ...e.resource,

                      estado:
                        "pendiente"

                    }

                  };

                })

              );

              setUndoCancel(null);

            }}
            className="
        h-11

        rounded-full

        bg-indigo-500

        px-5

        text-sm

        font-black

        text-white

        shadow-[0_10px_30px_rgba(99,102,241,0.25)]
      "
          >

            Deshacer

          </button>

        </div>

      )}



      {/* CONTEXT MENU */}

      {contextMenu && (

        <div
          style={{

            left:
              `${contextMenu.x + 8}px`,

            top:
              `${contextMenu.y - 8}px`

          }}
          className="
      fixed

      z-[99999]

      w-64

      overflow-hidden

      rounded-[28px]

      border
      border-slate-200/70

      bg-white/95

      backdrop-blur-xl

      shadow-[0_20px_60px_rgba(15,23,42,0.25)]

      animate-modalIn
    "
        >

          {/* EDITAR */}

          <button
            onClick={() => {

              setEditingEvent(
                contextMenu.cita
              );

              setContextMenu(null);

            }}
            className="
        flex
        w-full

        items-center
        gap-3

        px-5
        py-4

        text-sm
        font-bold

        hover:bg-indigo-50
      "
          >

            ✏️ Editar

          </button>

          {/* DUPLICAR */}

          <button
            onClick={() => {

              duplicateCita(
                contextMenu.cita
              );

              setContextMenu(null);

            }}
            className="
        flex
        w-full

        items-center
        gap-3

        px-5
        py-4

        text-sm
        font-bold

        hover:bg-violet-50
      "
          >

            📋 Duplicar

          </button>
          {/* COMPLETAR */}

          <button
            onClick={() => {

              console.log(
                "completar"
              );

              setContextMenu(null);

            }}
            className="
    flex
    w-full

    items-center
    gap-3

    px-5
    py-4

    text-sm
    font-bold

    text-emerald-600

    hover:bg-emerald-50

    transition-all
  "
          >

            ✅ Completar

          </button>

          {/* CANCELAR */}

          <button
            onClick={() => {

              console.log(
                "cancelar"
              );

              setContextMenu(null);

            }}
            className="
    flex
    w-full

    items-center
    gap-3

    px-5
    py-4

    text-sm
    font-bold

    text-rose-500

    hover:bg-rose-50

    transition-all
  "
          >

            ❌ Cancelar

          </button>

        </div>

      )}

    </div>



  );

}

export default AgendaCalendar;