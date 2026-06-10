import {
  useState
} from "react";

import {
  CalendarDays,
  Clock3,
  User,
  FileText,
  CheckCircle2,
  XCircle,
  Stethoscope
} from "lucide-react";

import BaseModal from "../BaseModal";

import ConfirmModal from "../ConfirmModal";

import {
  useCitas
} from "../../hooks/useCitas";

import {
  formatFecha,
  formatHora,
  parseFechaLocal
} from "../../utils/fecha";

import {
  showSuccess,
  showError
} from "../ui/ToastStyles";

function CitaDetailsModal({
  cita,
  onClose,
  onEditar,
  onCancelar
}) {

  /*
  ==========================================
  HOOKS
  ==========================================
  */

  const {
    cancelarCita
  } = useCitas();

  /*
  ==========================================
  STATES
  ==========================================
  */

  const [confirmCancel, setConfirmCancel] =
    useState(false);

  /*
  ==========================================
  VALIDATION
  ==========================================
  */

  if (!cita) {
    return null;
  }
  
  /*
  ==========================================
  FECHA SEGURA
  ==========================================
  */

  const fecha =

    cita.fecha instanceof Date
      ? cita.fecha
      : parseFechaLocal(
          cita.fecha
        );

  /*
  ==========================================
  CLIENTE
  ==========================================
  */

  const nombreCliente =

    cita.cliente
      ? `${cita.cliente.nombre || ""}
         ${cita.cliente.apellido || ""}`
          .replace(/\s+/g, " ")
          .trim()

      : cita.title ||

        "Paciente";

  /*
  ==========================================
  ESTADO
  ==========================================
  */

  const estado =
    cita.estado ||
    "pendiente";

  const estadoStyles = {

    pendiente:
      "bg-yellow-500/10 text-yellow-600",

    completada:
      "bg-emerald-500/10 text-emerald-600",

    cancelada:
      "bg-rose-500/10 text-rose-500"

  };

  const estadoLabel = {

    pendiente:
      "Pendiente",

    completada:
      "Completada",

    cancelada:
      "Cancelada"

  };

  /*
  ==========================================
  CANCELAR
  ==========================================
  */

  const handleCancelar =
    async () => {

      try {

        onCancelar?.(cita);

        showSuccess(
          "Cita cancelada"
        );

        setConfirmCancel(false);

        onClose();

      } catch {

        showError(
          "Error al cancelar cita"
        );

      }

    };

  return (

    <>

      <BaseModal
        onClose={onClose}
        maxWidth="max-w-2xl"
      >

        <div className="
          relative
          overflow-hidden

          bg-white
          dark:bg-slate-900

          rounded-[36px]

          border
          border-slate-200/70
          dark:border-slate-800

          p-6

          shadow-[0_20px_60px_rgba(15,23,42,0.16)]
        ">

          {/* GLOW */}

          <div className="
            absolute
            -top-20
            -right-20

            w-72
            h-72

            rounded-full

            bg-indigo-500/10

            blur-3xl
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

            <div>

              <div className="
                w-16
                h-16

                rounded-[24px]

                bg-gradient-to-br
                from-indigo-500
                to-violet-500

                text-white

                flex
                items-center
                justify-center

                shadow-[0_20px_40px_rgba(99,102,241,0.25)]
              ">

                <CalendarDays size={28} />

              </div>

              <h2 className="
                mt-5

                text-3xl

                font-black

                tracking-tight

                text-slate-800
                dark:text-slate-100
              ">

                Detalles de cita

              </h2>

              <p className="
                mt-2

                text-sm

                text-slate-500
                dark:text-slate-400
              ">

                Información completa de la consulta

              </p>

            </div>

          </div>

          {/* CONTENT */}

          <div className="
            relative
            z-10

            mt-8

            grid
            grid-cols-1
            md:grid-cols-2

            gap-4
          ">

            {/* PACIENTE */}

            <div className="
              rounded-[28px]

              border
              border-slate-200/70
              dark:border-slate-800

              bg-slate-50/80
              dark:bg-slate-950/50

              p-5
            ">

              <div className="
                flex
                items-center
                gap-3
              ">

                <User
                  size={18}
                  className="
                    text-indigo-500
                  "
                />

                <p className="
                  text-xs

                  uppercase

                  tracking-[0.14em]

                  font-black

                  text-slate-400
                ">

                  Paciente

                </p>

              </div>

              <p className="
                mt-4

                text-xl

                font-black

                text-slate-800
                dark:text-slate-100
              ">

                {nombreCliente}

              </p>

            </div>

            {/* HORARIO */}

            <div className="
              rounded-[28px]

              border
              border-slate-200/70
              dark:border-slate-800

              bg-slate-50/80
              dark:bg-slate-950/50

              p-5
            ">

              <div className="
                flex
                items-center
                gap-3
              ">

                <Clock3
                  size={18}
                  className="
                    text-emerald-500
                  "
                />

                <p className="
                  text-xs

                  uppercase

                  tracking-[0.14em]

                  font-black

                  text-slate-400
                ">

                  Horario

                </p>

              </div>

              <p className="
                mt-4

                text-lg

                font-black

                text-slate-800
                dark:text-slate-100
              ">

                {fecha
                  ? `${formatFecha(fecha)}
                     •
                     ${formatHora(fecha)}`
                  : "Sin fecha"}

              </p>

            </div>

            {/* ESTADO */}

            <div className="
              rounded-[28px]

              border
              border-slate-200/70
              dark:border-slate-800

              bg-slate-50/80
              dark:bg-slate-950/50

              p-5
            ">

              <div className="
                flex
                items-center
                gap-3
              ">

                <CheckCircle2
                  size={18}
                  className="
                    text-emerald-500
                  "
                />

                <p className="
                  text-xs

                  uppercase

                  tracking-[0.14em]

                  font-black

                  text-slate-400
                ">

                  Estado

                </p>

              </div>

              <span className={`
                inline-flex

                mt-4

                px-4
                py-2

                rounded-full

                text-sm

                font-black

                ${estadoStyles[estado]}
              `}>

                {estadoLabel[estado]}

              </span>

            </div>

            {/* MOTIVO */}

            <div className="
              rounded-[28px]

              border
              border-slate-200/70
              dark:border-slate-800

              bg-slate-50/80
              dark:bg-slate-950/50

              p-5
            ">

              <div className="
                flex
                items-center
                gap-3
              ">

                <Stethoscope
                  size={18}
                  className="
                    text-cyan-500
                  "
                />

                <p className="
                  text-xs

                  uppercase

                  tracking-[0.14em]

                  font-black

                  text-slate-400
                ">

                  Motivo

                </p>

              </div>

              <p className="
                mt-4

                text-sm

                font-bold

                text-slate-700
                dark:text-slate-200

                break-words
              ">

                {cita.motivo ||
                  "Sin motivo"}

              </p>

            </div>

            {/* NOTAS */}

            <div className="
              md:col-span-2

              rounded-[28px]

              border
              border-slate-200/70
              dark:border-slate-800

              bg-slate-50/80
              dark:bg-slate-950/50

              p-5
            ">

              <div className="
                flex
                items-center
                gap-3
              ">

                <FileText
                  size={18}
                  className="
                    text-violet-500
                  "
                />

                <p className="
                  text-xs

                  uppercase

                  tracking-[0.14em]

                  font-black

                  text-slate-400
                ">

                  Notas

                </p>

              </div>

              <p className="
                mt-4

                text-sm

                leading-relaxed

                text-slate-500
                dark:text-slate-400

                whitespace-pre-wrap
              ">

                {cita.detalle ||
                  cita.notas ||
                  "Sin notas adicionales."}

              </p>

            </div>

          </div>

          {/* ACTIONS */}

          <div className="
            relative
            z-10

            mt-8

            flex
            flex-col
            sm:flex-row

            gap-3
          ">
            <button
  onClick={() => {

    onClose();

    onEditar?.(cita);

  }}
  className="
    flex-1

    h-14

    rounded-[24px]

    bg-gradient-to-r
    from-indigo-500
    to-violet-500

    text-white

    font-black

    shadow-[0_15px_35px_rgba(99,102,241,0.25)]

    hover:scale-[1.02]

    active:scale-[0.98]

    transition-all
    duration-300
  "
>

  Editar cita

</button>
            <button
              onClick={onClose}
              className="
                flex-1

                h-14

                rounded-[24px]

                bg-slate-100
                dark:bg-slate-800

                text-slate-700
                dark:text-slate-200

                font-semibold

                hover:bg-slate-200
                dark:hover:bg-slate-700

                active:scale-[0.98]

                transition-all
                duration-300
              "
            >

              Cerrar

            </button>

            {estado !== "cancelada" && (

              <button
                onClick={() =>
                  setConfirmCancel(true)
                }
                disabled={
                  cancelarCita.isPending
                }
                className="
                  flex-1

                  h-14

                  rounded-[24px]

                  bg-gradient-to-r
                  from-rose-500
                  to-pink-500

                  text-white

                  font-black

                  shadow-[0_15px_35px_rgba(244,63,94,0.25)]

                  hover:scale-[1.02]

                  active:scale-[0.98]

                  transition-all
                  duration-300

                  disabled:opacity-60

                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >

                <XCircle size={18} />

                {cancelarCita.isPending
                  ? "Cancelando..."
                  : "Cancelar cita"}

              </button>

            )}

          </div>

        </div>

      </BaseModal>

      {/* CONFIRM */}

      {confirmCancel && (

        <ConfirmModal

          mensaje={`
¿Cancelar la cita de ${nombreCliente}?

📅 ${fecha
  ? formatFecha(fecha)
  : ""}

⏰ ${fecha
  ? formatHora(fecha)
  : ""}
          `}

          onConfirm={
            handleCancelar
          }

          onCancel={() =>
            setConfirmCancel(false)
          }

        />

      )}
    
    </>

  );

}

export default CitaDetailsModal;