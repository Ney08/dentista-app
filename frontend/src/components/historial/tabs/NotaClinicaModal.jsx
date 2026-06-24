import { useState } from "react";

import toast from "react-hot-toast";
import {
  Save,

  Loader2

} from "lucide-react";

import BaseModal
  from "../../BaseModal";

import {
  API_URL
} from "../../../config";

import {

  showSuccess,
  showError

} from "../../ui/ToastStyles";

import HistorialCliente
  from "../../clientes/HistorialCliente";

function NotaClinicaModal({

  historial = [],

  cliente,

  clienteId,

  onAdd,


  eliminarHistorial,
  actualizarHistorial,

  crearHistorial


}) {

  /*
  ==========================================
  STATES
  ==========================================
  */

  const [texto, setTexto] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [

    abierto,

    setAbierto

  ] = useState(false);

  /*
  ==========================================
  GUARDAR
  ==========================================
  */

  const guardar = async () => {

    if (!texto.trim()) {
      showError("Escribe una nota clínica ⚠️");
      return;
    }

    setLoading(true);

    const toastId = toast.loading("Guardando historial...");

    try {

      await crearHistorial.mutateAsync({
        cliente_id: clienteId,
        descripcion: texto
      });

      showSuccess("Historial guardado ✅", { id: toastId });

      setTexto("");
      setAbierto(false);

    } catch {

      showError("Error al guardar ❌", { id: toastId });

    }

    setLoading(false);
  };
  const [setHistorial] = useState([]);
  return (

    <>

      {/* HEADER ACTION */}

      <div className="
        flex
        justify-end

        mb-6
      ">

        <button
          onClick={() =>
            setAbierto(true)
          }

          className="
            h-12

            px-6

            rounded-[20px]

            
bg-gradient-to-r
from-sky-700
to-sky-900


shadow-[0_15px_35px_rgba(7,89,133,0.25)]
hover:shadow-[0_20px_45px_rgba(7,89,133,0.35)]

            text-white

            font-bold



            hover:scale-[1.02]

            transition-all
            duration-300
          "
        >

          + Nueva nota

        </button>

      </div>

      {/* TIMELINE */}

      <HistorialCliente

        historial={historial}

        cliente={cliente}


        eliminarHistorial={eliminarHistorial}
        actualizarHistorial={actualizarHistorial}


      />

      {/* MODAL */}

      {

        abierto && (

          <BaseModal
            onClose={() =>
              setAbierto(false)
            }
            maxWidth="max-w-3xl"
          >

            <div className="
              space-y-6
            ">

              {/* HEADER */}

              <div>

                <h3 className="
                  text-3xl

                  font-black

                  text-slate-800
                ">

                  Nueva nota clínica

                </h3>

                <p className="
                  mt-2

                  text-slate-500
                ">

                  Registra observaciones
                  y evolución del paciente.

                </p>

              </div>

              {/* TEXTAREA */}

              <textarea
                value={texto}

                onChange={(e) =>
                  setTexto(
                    e.target.value
                  )
                }

                rows={10}

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
                  focus:ring-sky-500/10
                  focus:border-sky-300
                  resize-none
                "
              />

              {/* ACTIONS */}

              <div className="
                flex
                items-center
                justify-end

                gap-3
              ">

                <button
                  onClick={() =>
                    setAbierto(false)
                  }

                  className="
                    h-12

                    px-5

                    rounded-[20px]

                    bg-slate-100

                    border
                    border-slate-200

                    text-slate-600

                    font-semibold

                    hover:bg-slate-200

                    transition-all
                    duration-300
                  "
                >

                  Cancelar

                </button>

                <button
                  onClick={guardar}

                  disabled={loading}

                  className={`
              h-12

              px-6

              rounded-2xl

              text-white

              text-sm
              font-black

              flex
              items-center
              gap-2

              
              shadow-[0_15px_35px_rgba(7,89,133,0.25)]     
              transition-all
              duration-300

              ${loading

                      ? `
                    bg-slate-400
                    cursor-not-allowed
                  `

                      : `
                    
bg-gradient-to-r
from-sky-700
via-sky-800
to-sky-900


                    hover:scale-[1.02]

                    hover:shadow-[0_20px_45px_rgba(7,89,133,0.35)]
                  `
                    }
            `}
                >

                  {
                    loading

                      ? (

                        <Loader2
                          size={16}
                          className="
                      animate-spin
                    "
                        />

                      )

                      : (

                        <Save size={16} />

                      )
                  }

                  {
                    loading

                      ? "Guardando..."

                      : "Guardar historial"
                  }

                </button>

              </div>

            </div>

          </BaseModal>

        )

      }

    </>

  );

}

export default NotaClinicaModal;