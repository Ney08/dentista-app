import { useState } from "react";
import toast from "react-hot-toast";

import BaseModal
  from "../BaseModal";

import { API_URL } from "../../config";
import {
  showSuccess,
  showError,
  showWarning,
  showInfo
} from "../ui/ToastStyles";

import Odontograma
  from "../odontograma/Odontograma";

function HistorialForm({
  clienteId,
  onAdd
}) {

  const [texto, setTexto] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [

    odontogramaOpen,

    setOdontogramaOpen

  ] = useState(false);

  /*
  ==========================================
  GUARDAR
  ==========================================
  */

  const guardar = async () => {

    if (!texto.trim()) {

      showError(
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

      showSuccess(
        "Historial guardado ✅",
        { id: toastId }
      );

      setTexto("");

      onAdd();

    } catch {

      showError(
        "Error al guardar ❌",
        { id: toastId }
      );

    }

    setLoading(false);

  };

  // const mejorarConAI =
  // async () => {

  //   if (!texto.trim()) {

  //     showWarning(
  //       "Escribe una nota primero ⚠️"
  //     );

  //     return;

  //   }

  //   try {

  //     const res = await fetch(

  //       `${API_URL}/ai/clinical-note`,

  //       {

  //         method: "POST",

  //         headers: {

  //           "Content-Type":
  //             "application/json"

  //         },

  //         body: JSON.stringify({

  //           text: texto

  //         })

  //       }

  //     );

  //     if (!res.ok) {

  //       throw new Error();

  //     }

  //     const data =
  //       await res.json();

  //     setTexto(
  //       data.result
  //     );

  //     showSuccess(
  //       "Nota mejorada con AI ✨"
  //     );

  //   } catch {

  //     showError(
  //       "Error usando AI ❌"
  //     );

  //   }

  // };
  return (

    <div className="
    relative
    overflow-hidden

    bg-white/75
    backdrop-blur-2xl

    border
    border-white/50

    rounded-[32px]

    p-6

    shadow-[0_20px_50px_rgba(0,0,0,0.10)]

    space-y-6
  ">

      {/* AMBIENT GLOW */}

      <div className="
      absolute
      -top-16
      -right-16

      w-56
      h-56

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

          <h3 className="
          text-2xl

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

          text-slate-500
        ">
            Registra observaciones y seguimiento del paciente
          </p>

        </div>

        {/* ICON */}

        <div className="
        hidden
        sm:flex

        relative
        overflow-hidden

        w-14
        h-14

        rounded-[22px]

        bg-gradient-to-br
        from-indigo-500
        via-purple-500
        to-violet-500

        shadow-[0_12px_30px_rgba(99,102,241,0.22)]

        items-center
        justify-center
      ">

          <div className="
          absolute
          inset-0

          bg-white/10
        " />

          <span className="
          relative
          z-10

          text-xl
          text-white
        ">
            📝
          </span>

        </div>

      </div>

      {/* TEXTAREA SECTION */}

      <div className="
      relative
      z-10

      space-y-3
    ">

        <label className="
        block

        text-[11px]

        uppercase

        tracking-[0.14em]

        font-black

        text-slate-400
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

          min-h-[180px]

          rounded-[28px]

          bg-white/60
          backdrop-blur-xl

          border
          border-white/50

          px-5
          py-5

          text-sm
          sm:text-base

          text-slate-700

          placeholder:text-slate-400

          shadow-[0_10px_30px_rgba(0,0,0,0.04)]

          focus:outline-none

          focus:ring-4
          focus:ring-indigo-500/10

          focus:border-indigo-300

          transition-all
          duration-300

          resize-none
        "
        />
        {/* <div className="
          hidden
          sm:flex

          items-center
          gap-2

          text-xs
          font-semibold

          text-indigo-500
        ">
          ✨ Odontograma
        </div> */}

        {/* ODONTOGRAMA BUTTON */}

        <div className="
  flex
  justify-end
">
          {/* <button

  onClick={mejorarConAI}

  className="
    h-11

    px-5

    rounded-2xl

    bg-gradient-to-r
    from-indigo-500
    to-violet-500

    text-white

    text-sm
    font-bold

    hover:scale-[1.02]

    transition-all
    duration-300
  "
>

  ✨ Mejorar con AI

</button> */}
          <button

            onClick={() =>
              setOdontogramaOpen(true)
            }

            className="
      group

      inline-flex

      items-center
      gap-3

      h-12

      px-5

      rounded-2xl

      bg-white

      border
      border-slate-200

      text-slate-700

      text-sm
      font-bold

      shadow-sm

      hover:border-indigo-200

      hover:text-indigo-600

      hover:shadow-lg

      transition-all
      duration-300
    "
          >

            <span className="
      text-lg
    ">
              🦷
            </span>

            Abrir odontograma

          </button>

        </div>

        {/* FOOTER INFO */}

        <div className="
        flex
        items-center
        justify-between

        gap-3
      ">

          <p className="
          text-xs

          text-slate-400
        ">
            Las notas clínicas se guardan en el historial del paciente
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

      <div className="
      relative
      z-10

      flex
      justify-center
    ">

        <button
          onClick={guardar}
          disabled={loading}
          className={`
          group

          relative
          overflow-hidden

          h-14

          min-w-[240px]

          px-8

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
              ? `
              bg-slate-400
              cursor-not-allowed
            `
              : `
              bg-gradient-to-r
              from-indigo-500
              via-purple-500
              to-violet-500

              hover:scale-[1.02]

              hover:shadow-[0_20px_45px_rgba(99,102,241,0.32)]
            `
            }
        `}
        >

          {!loading && (

            <div className="
            absolute
            inset-0

            opacity-0

            bg-white/10

            group-hover:opacity-100

            transition-all
            duration-300
          " />

          )}

          <span className="relative z-10">

            {loading
              ? "Guardando..."
              : "Guardar historial"
            }

          </span>

        </button>

      </div>
      {
        odontogramaOpen && (

          <BaseModal

            onClose={() =>
              setOdontogramaOpen(false)
            }

            maxWidth="max-w-7xl"
          >

            <Odontograma
              clienteId={clienteId}
            />

          </BaseModal>

        )
      }
    </div>

  );


}

export default HistorialForm;