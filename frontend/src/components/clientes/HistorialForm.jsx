import { useState } from "react";
import toast from "react-hot-toast";

import { API_URL } from "../../config";

function HistorialForm({
  clienteId,
  onAdd
}) {

  const [texto, setTexto] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  /*
  ==========================================
  GUARDAR
  ==========================================
  */

  const guardar = async () => {

    if (!texto.trim()) {

      toast.error(
        "Escribe una nota clínica ⚠️"
      );

      return;

    }

    setLoading(true);

    const toastId =
      toast.loading(
        "Guardando historial..."
      );

    try {

      const res = await fetch(
        `${API_URL}/historiales/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            cliente_id: clienteId,
            descripcion: texto
          })
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      toast.success(
        "Historial guardado ✅",
        { id: toastId }
      );

      setTexto("");

      onAdd();

    } catch {

      toast.error(
        "Error al guardar ❌",
        { id: toastId }
      );

    }

    setLoading(false);

  };

  return (

    <div className="
      relative
      overflow-hidden

      bg-white/90
      backdrop-blur-xl

      border
      border-white/40

      rounded-[32px]

      p-5
      sm:p-6

      shadow-[0_10px_30px_rgba(0,0,0,0.06)]

      space-y-5
    ">

      {/* GLOW */}

      <div className="
        absolute
        -top-10
        -right-10

        w-44
        h-44

        rounded-full

        bg-indigo-500/10

        blur-3xl
      " />

      {/* HEADER */}

      <div className="
        relative
        z-10

        flex
        items-center
        justify-between

        gap-4
      ">

        <div>

          <h3 className="
            text-xl
            sm:text-2xl

            font-black

            tracking-tight

            text-slate-800
          ">

            Agregar nota clínica

            <span className="ml-2">
              🦷
            </span>

          </h3>

          <p className="
            mt-1

            text-sm

            text-gray-500
          ">
            Registra observaciones y seguimiento del paciente
          </p>

        </div>

        {/* ICON */}

        <div className="
          hidden
          sm:flex

          w-14
          h-14

          rounded-[20px]

          bg-gradient-to-br
          from-indigo-500
          via-purple-500
          to-violet-500

          text-white

          items-center
          justify-center

          text-2xl

          shadow-[0_15px_35px_rgba(99,102,241,0.25)]
        ">
          📝
        </div>

      </div>

      {/* DIVIDER */}

      <div className="
        border-t
        border-gray-100
      " />

      {/* TEXTAREA CARD */}

      <div className="
        relative
        z-10

        bg-gradient-to-br
        from-white
        to-slate-50

        border
        border-white

        rounded-[28px]

        p-4
        sm:p-5

        shadow-sm
      ">

        <label className="
          block

          text-[11px]

          uppercase

          tracking-[0.14em]

          font-black

          text-gray-400
        ">
          Nota clínica
        </label>

        <textarea
          value={texto}
          onChange={(e) =>
            setTexto(e.target.value)
          }
          placeholder="Ej: Paciente presenta dolor en molar 16, sensibilidad al frío y molestias al masticar..."
          rows={5}
          className="
            w-full

            mt-4

            border
            border-slate-200

            bg-white/80

            px-5
            py-4

            rounded-[24px]

            text-sm
            sm:text-base

            text-slate-700

            placeholder:text-gray-400

            focus:outline-none

            focus:ring-4
            focus:ring-indigo-500/10

            focus:border-indigo-400

            resize-none

            transition-all
            duration-300

            min-h-[170px]

            shadow-inner
          "
        />

        {/* FOOTER */}

        <div className="
          mt-4

          flex
          items-center
          justify-between

          gap-3
        ">

          <p className="
            text-xs
            text-gray-400
          ">
            Las notas clínicas se guardan automáticamente en el historial del paciente
          </p>

          <div className="
            hidden
            sm:flex

            items-center
            gap-2

            text-xs
            font-semibold

            text-indigo-500
          ">
            ✨ Historial clínico
          </div>

        </div>

      </div>

      {/* BUTTON */}

      <button
        onClick={guardar}
        disabled={loading}
        className={`
          relative
          overflow-hidden

          w-full

          h-14

          rounded-[24px]

          text-white

          text-sm
          sm:text-base

          font-black

          shadow-[0_15px_35px_rgba(99,102,241,0.25)]

          transition-all
          duration-300

          active:scale-[0.98]

          ${loading
            ? "bg-gray-400 cursor-not-allowed"
            : `
              bg-gradient-to-r
              from-indigo-500
              via-purple-500
              to-violet-500

              hover:scale-[1.01]

              hover:shadow-[0_20px_45px_rgba(99,102,241,0.35)]
            `
          }
        `}
      >

        {/* SHINE */}

        {!loading && (

          <div className="
            absolute
            inset-0

            bg-gradient-to-r
            from-transparent
            via-white/20
            to-transparent

            -translate-x-full

            hover:translate-x-full

            transition-all
            duration-1000
          " />

        )}

        <span className="relative z-10">

          {loading
            ? "Guardando..."
            : "Guardar historial"}

        </span>

      </button>

    </div>

  );

}

export default HistorialForm;