import {
  useState
} from "react";

import {
  CalendarPlus,
  Save,
  Clock3
} from "lucide-react";

import BaseModal from "../BaseModal";

import {
  useClientes
} from "../../hooks/useClientes";

import {
  useServicios
} from "../../hooks/useServicios";

import {
  useCitas
} from "../../hooks/useCitas";

import {
  formatFechaCompleta
} from "../../utils/fecha";

import {
  showSuccess,
  showError
} from "../ui/ToastStyles";

function CreateCitaModal({
  slot,
  onClose,
  onCreate
}) {

  /*
  ==========================================
  DATA
  ==========================================
  */

  const {
    clientes = []
  } = useClientes();

  const {
    servicios = []
  } = useServicios();

  const {
    crearCita
  } = useCitas();

  /*
  ==========================================
  STATES
  ==========================================
  */

  const [clienteId, setClienteId] =
    useState("");

  const [motivo, setMotivo] =
    useState("");

  const [detalle, setDetalle] =
    useState("");

  const [duracion, setDuracion] =
    useState(30);

  const [loading, setLoading] =
    useState(false);

  /*
  ==========================================
  SAVE
  ==========================================
  */

  const handleSave = async () => {

    if (
      !clienteId ||
      !motivo
    ) {

      return showError(
        "Completa los campos"
      );

    }

    setLoading(true);

    try {

      const fecha =
        new Date(slot.start);

      const fechaFinal =

        fecha.getFullYear() + "-" +

        String(
          fecha.getMonth() + 1
        ).padStart(2, "0") + "-" +

        String(
          fecha.getDate()
        ).padStart(2, "0") + "T" +

        String(
          fecha.getHours()
        ).padStart(2, "0") + ":" +

        String(
          fecha.getMinutes()
        ).padStart(2, "0") + ":00";

      await crearCita.mutateAsync({

        cliente_id:
          parseInt(clienteId),

        fecha:
          fechaFinal,

        motivo,

        detalle,

        duracion

      });

      showSuccess(
        "Cita creada correctamente"
      );

      onCreate?.();

      onClose();

    } catch {

      showError(
        "Error al crear cita"
      );

    }

    setLoading(false);

  };

  return (

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
        ">

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

            <CalendarPlus size={28} />

          </div>

          <h2 className="
            mt-5

            text-3xl

            font-black

            tracking-tight

            text-slate-800
            dark:text-slate-100
          ">

            Nueva cita

          </h2>

          <p className="
            mt-2

            text-sm

            text-slate-500
            dark:text-slate-400
          ">

            Agenda una nueva consulta

          </p>

        </div>

        {/* FORM */}

        <div className="
          relative
          z-10

          mt-8

          space-y-5
        ">

          {/* CLIENTE */}

          <select
            value={clienteId}
            onChange={(e) =>
              setClienteId(
                e.target.value
              )
            }
            className="
              w-full

              h-14

              px-5

              rounded-[22px]

              bg-slate-50
              dark:bg-slate-950

              border
              border-slate-200
              dark:border-slate-800

              text-slate-700
              dark:text-slate-100

              focus:outline-none

              focus:ring-4
              focus:ring-indigo-500/10

              transition-all
              duration-300
            "
          >

            <option value="">
              Cliente
            </option>

            {clientes.map((c) => (

              <option
                key={c.id}
                value={c.id}
              >

                {c.nombre}
                {" "}
                {c.apellido}

              </option>

            ))}

          </select>

          {/* SERVICIO */}

          <select
            value={motivo}
            onChange={(e) =>
              setMotivo(
                e.target.value
              )
            }
            className="
              w-full

              h-14

              px-5

              rounded-[22px]

              bg-slate-50
              dark:bg-slate-950

              border
              border-slate-200
              dark:border-slate-800

              text-slate-700
              dark:text-slate-100

              focus:outline-none

              focus:ring-4
              focus:ring-indigo-500/10

              transition-all
              duration-300
            "
          >

            <option value="">
              Servicio / Motivo
            </option>

            {servicios.map((serv) => (

              <option
                key={serv.id}
                value={serv.nombre}
              >

                {serv.nombre}

              </option>

            ))}

          </select>

          {/* DETALLE */}

          <textarea
            rows={4}
            placeholder="Detalle adicional"
            value={detalle}
            onChange={(e) =>
              setDetalle(
                e.target.value
              )
            }
            className="
              w-full

              rounded-[24px]

              px-5
              py-4

              resize-none

              bg-slate-50
              dark:bg-slate-950

              border
              border-slate-200
              dark:border-slate-800

              text-slate-700
              dark:text-slate-100

              focus:outline-none

              focus:ring-4
              focus:ring-indigo-500/10

              transition-all
              duration-300
            "
          />

          {/* DURACION */}

          <select
            value={duracion}
            onChange={(e) =>
              setDuracion(
                parseInt(
                  e.target.value
                )
              )
            }
            className="
              w-full

              h-14

              px-5

              rounded-[22px]

              bg-slate-50
              dark:bg-slate-950

              border
              border-slate-200
              dark:border-slate-800

              text-slate-700
              dark:text-slate-100
            "
          >

            <option value={30}>
              30 min
            </option>

            <option value={45}>
              45 min
            </option>

            <option value={60}>
              1 hora
            </option>

          </select>

          {/* HOURS */}

          <div className="
            rounded-[24px]

            bg-indigo-500/5

            border
            border-indigo-500/10

            p-5
          ">

            <p className="
              text-xs

              uppercase

              tracking-[0.14em]

              font-black

              text-indigo-500
            ">

              Horario seleccionado

            </p>

            <div className="
              mt-3

              flex
              items-center
              gap-2

              text-sm

              font-semibold

              text-slate-700
              dark:text-slate-200
            ">

              <Clock3
                size={16}
                className="
                  text-indigo-500
                "
              />

              <span>

                {formatFechaCompleta(
                  slot.start
                )}

              </span>

            </div>

          </div>

        </div>

        {/* ACTIONS */}

        <div className="
          relative
          z-10

          mt-8

          flex
          gap-3
        ">

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

              active:scale-[0.98]

              transition-all
              duration-300
            "
          >

            Cancelar

          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="
              flex-1

              h-14

              rounded-[24px]

              bg-gradient-to-r
              from-indigo-500
              to-violet-500

              text-white

              font-black

              shadow-[0_20px_40px_rgba(99,102,241,0.25)]

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

            <Save size={18} />

            {loading
              ? "Guardando..."
              : "Crear cita"}

          </button>

        </div>

      </div>

    </BaseModal>

  );

}

export default CreateCitaModal;