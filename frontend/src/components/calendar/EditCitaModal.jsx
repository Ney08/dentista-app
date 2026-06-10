import {
  useState
} from "react";

import {
  Save,
  CalendarDays,
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
  showSuccess,
  showError
} from "../ui/ToastStyles";

function EditCitaModal({
  cita,
  onClose
}) {

  /*
  ==========================================
  HOOKS
  ==========================================
  */

  const {
    clientes = []
  } = useClientes();

  const {
    servicios = []
  } = useServicios();

  const {
    actualizarCita
  } = useCitas();

  /*
  ==========================================
  HELPERS
  ==========================================
  */

  const formatDateTimeLocal = (
    fecha
  ) => {

    const d =
      new Date(fecha);

    const year =
      d.getFullYear();

    const month =
      String(
        d.getMonth() + 1
      ).padStart(2, "0");

    const day =
      String(
        d.getDate()
      ).padStart(2, "0");

    const hours =
      String(
        d.getHours()
      ).padStart(2, "0");

    const minutes =
      String(
        d.getMinutes()
      ).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;

  };

  /*
  ==========================================
  STATES
  ==========================================
  */

  const [clienteId, setClienteId] =
    useState(

      cita.cliente_id ||

      cita.cliente?.id ||

      ""

    );

  const [motivo, setMotivo] =
    useState(
      cita.motivo || ""
    );

  const [detalle, setDetalle] =
    useState(
      cita.detalle || ""
    );

  const [duracion, setDuracion] =
    useState(
      cita.duracion || 30
    );

  const [fecha, setFecha] =
    useState(
      formatDateTimeLocal(
        cita.fecha
      )
    );

  const [loading, setLoading] =
    useState(false);

  /*
  ==========================================
  SAVE
  ==========================================
  */

  const handleSave =
    async () => {

      if (
        !clienteId ||
        !motivo ||
        !fecha
      ) {

        return showError(
          "Completa los campos"
        );

      }

      /*
      ==========================================
      NO EDIT COMPLETED
      ==========================================
      */

      if (
        cita.estado ===
        "completada"
      ) {

        return showError(
          "No puedes editar una cita completada"
        );

      }

      setLoading(true);

      try {

        await actualizarCita.mutateAsync({

          id:
            cita.id,

          data: {

            cliente_id:
              parseInt(clienteId),

            fecha,

            motivo,

            detalle,

            duracion

          }

        });

        showSuccess(
          "Cita actualizada"
        );

        onClose?.();

      } catch {

        showError(
          "Error al actualizar"
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

            <CalendarDays
              size={28}
            />

          </div>

          <h2 className="
            mt-5

            text-3xl

            font-black

            tracking-tight

            text-slate-800
            dark:text-slate-100
          ">

            Editar cita

          </h2>

          <p className="
            mt-2

            text-sm

            text-slate-500
            dark:text-slate-400
          ">

            Modifica la información
            de la cita

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

  disabled

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

    bg-slate-100
    dark:bg-slate-950

    border
    border-slate-200
    dark:border-slate-800

    text-slate-400
    dark:text-slate-500

    cursor-not-allowed

    opacity-80
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

          {/* MOTIVO */}

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

          {/* FECHA */}

          <div className="
            relative
          ">

            <Clock3
              size={18}
              className="
                absolute
                left-5
                top-1/2
                -translate-y-1/2

                text-indigo-500
              "
            />

            <input
              type="datetime-local"
              value={fecha}
              onChange={(e) =>
                setFecha(
                  e.target.value
                )
              }
              className="
                w-full

                h-14

                pl-14
                pr-5

                rounded-[22px]

                bg-slate-50
                dark:bg-slate-950

                border
                border-slate-200
                dark:border-slate-800

                text-slate-700
                dark:text-slate-100
              "
            />

          </div>

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

          {/* DETALLE */}

          <textarea
            rows={5}
            value={detalle}
            placeholder="Notas"
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
            "
          />

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
              : "Guardar cambios"}

          </button>

        </div>

      </div>

    </BaseModal>

  );

}

export default EditCitaModal;