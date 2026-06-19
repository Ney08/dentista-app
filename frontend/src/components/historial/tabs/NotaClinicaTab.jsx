import { useState } from "react";
import toast from "react-hot-toast";

import { API_URL } from "../../../config";

import {
  showSuccess,
  showError
} from "../../ui/ToastStyles";

function NotaClinicaTab({
  clienteId,
  onAdd
}) {

  const [texto, setTexto] =
    useState("");

  const [loading, setLoading] =
    useState(false);

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
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            cliente_id:
              clienteId,

            descripcion:
              texto

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

  return (

    <div className="
      rounded-[32px]

      bg-white

      border
      border-slate-200

      p-8

      shadow-sm

      space-y-6
    ">

      <div>

        <h3 className="
          text-3xl
          font-black

          text-slate-800
        ">

          Nota clínica

        </h3>

        <p className="
          mt-2

          text-slate-500
        ">

          Registra observaciones
          y evolución del paciente.

        </p>

      </div>

      <textarea
        value={texto}

        onChange={(e) =>
          setTexto(
            e.target.value
          )
        }

        rows={14}

        placeholder="
Paciente presenta dolor,
inflamación y sensibilidad...
        "

        className="
          w-full

          rounded-[28px]

          border
          border-slate-200

          bg-slate-50

          px-6
          py-6

          text-slate-700

          focus:outline-none

          focus:ring-4
          focus:ring-indigo-500/10

          resize-none
        "
      />

      <div className="
        flex
        justify-end
      ">

        <button
          onClick={guardar}

          disabled={loading}

          className="
            h-14

            px-8

            rounded-[24px]

            bg-gradient-to-r
            from-indigo-500
            to-violet-500

            text-white

            font-black

            shadow-lg
          "
        >

          {

            loading

              ? "Guardando..."

              : "Guardar historial"

          }

        </button>

      </div>

    </div>

  );

}

export default NotaClinicaTab;