import { useState } from "react";

// import toast from "react-hot-toast";
import TratamientosList
  from "../tratamientos/TratamientosList";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  CalendarDays,
  Sparkles,
  ClipboardList,
  Clock3,
  Activity,
  AlertCircle
} from "lucide-react";


import {
  showSuccess,
  showError,
  showWarning,
  showInfo
} from "../ui/ToastStyles";

import HistorialForm from "../historial/HistorialForm";

import BaseModal from "../BaseModal";

import {
  useHistorial
} from "../../hooks/useHistorial";

import {
  formatFecha
} from "../../utils/fecha";

import { API_URL } from "../../config";

function ClienteDetalle({ cliente }) {

  const {
    historial = [],
    isLoading,
    crearHistorial
  } = useHistorial(cliente?.id);

  const [notaSeleccionada, setNotaSeleccionada] =
    useState(null);

  const [menuAbierto, setMenuAbierto] =
    useState(null);

  const [editando, setEditando] =
    useState(null);

  const [textoEditado, setTextoEditado] =
    useState("");
  /*
==========================================
SORT HISTORIAL
==========================================
*/

  const historialOrdenado =
    [...(historial || [])]

      .sort((a, b) => {

        return (

          new Date(b.fecha) -

          new Date(a.fecha)

        );

      });

  /*
  ==========================================
  HELPERS
  ==========================================
  */

  const cortarTexto = (
    texto,
    limite = 120
  ) => {

    if (!texto) return "";

    return texto.length > limite
      ? texto.slice(0, limite) + "..."
      : texto;

  };

  /*
  ==========================================
  ELIMINAR
  ==========================================
  */

  const eliminarNota = async (id) => {

    const confirmar =
      window.confirm(
        "¿Eliminar esta nota clínica?"
      );

    if (!confirmar) return;

    try {

      const res = await fetch(
        `${API_URL}/historiales/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!res.ok) {

        throw new Error();

      }

      showSuccess(
        "Nota eliminada ✅"
      );

      window.location.reload();

    } catch {

      showError(
        "Error al eliminar ❌"
      );

    }

  };

  /*
  ==========================================
  GUARDAR EDICION
  ==========================================
  */

  const guardarEdicion = async () => {

    if (!textoEditado.trim()) {

      showError(
        "La nota no puede estar vacía ⚠️"
      );

      return;

    }

    try {

      const res = await fetch(
        `${API_URL}/historiales/${editando.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            cliente_id: cliente.id,
            descripcion: textoEditado
          })
        }
      );

      if (!res.ok) {

        throw new Error();

      }

      showSuccess(
        "Nota actualizada ✅"
      );

      setEditando(null);

      setTextoEditado("");

      window.location.reload();

    } catch {

      showError(
        "Error al actualizar ❌"
      );

    }

  };

  /*
  ==========================================
  STATES
  ==========================================
  */

  if (!cliente?.id) {

    return (
      <p>
        Selecciona un cliente...
      </p>
    );

  }

  if (isLoading) {

    return (

      <div className="
        flex
        items-center
        justify-center

        py-20
      ">

        <div className="
          flex
          items-center
          gap-3

          text-slate-500
        ">

          <div className="
            w-5
            h-5

            border-2
           border-sky-700
            border-t-transparent

            rounded-full

            animate-spin
          " />

          Cargando historial...

        </div>

      </div>

    );

  }

  return (

    <div className="
      space-y-6
    ">

      {/* STATS */}

      <div className="
        grid
        grid-cols-1
        sm:grid-cols-3

        gap-4
      ">

        {/* TOTAL */}

        <div className="
          rounded-[28px]

          
bg-gradient-to-br
from-sky-50
to-cyan-50

border
border-sky-100


          p-5
        ">

          <div className="
            flex
            items-center
            justify-between
          ">

            <div>

              <p className="
                text-xs

                uppercase

                tracking-[0.12em]

                text-sky-700

                font-black
              ">
                Notas clínicas
              </p>

              <h3 className="
                mt-2

                text-3xl

                font-black

                text-slate-800
              ">
                {historial.length}
              </h3>

            </div>

            <div className="
              w-12
              h-12

              rounded-[18px]

              
bg-sky-500/10

text-sky-800


              flex
              items-center
              justify-center
            ">

              <ClipboardList size={20} />

            </div>

          </div>

        </div>

        {/* ESTADO */}

        <div className="
          rounded-[28px]

          bg-gradient-to-br
          from-emerald-50
          to-green-50

          border
          border-emerald-100

          p-5
        ">

          <div className="
            flex
            items-center
            justify-between
          ">

            <div>

              <p className="
                text-xs

                uppercase

                tracking-[0.12em]

                text-emerald-500

                font-black
              ">
                Seguimiento
              </p>

              <h3 className="
                mt-2

                text-lg

                font-black

                text-slate-800
              ">
                Activo
              </h3>

            </div>

            <div className="
              w-12
              h-12

              rounded-[18px]

              bg-emerald-500/10

              text-emerald-600

              flex
              items-center
              justify-center
            ">

              <Activity size={20} />

            </div>

          </div>

        </div>

        {/* ULTIMA */}

        <div className="
          rounded-[28px]

          bg-gradient-to-br
          from-slate-50
          to-slate-100/70

          border
          border-slate-200

          p-5
        ">

          <div className="
            flex
            items-center
            justify-between
          ">

            <div>

              <p className="
                text-xs

                uppercase

                tracking-[0.12em]

                text-slate-400

                font-black
              ">
                Última nota
              </p>

              <h3 className="
                mt-2

                text-sm

                font-black

                text-slate-700
              ">
                {historialOrdenado[0]
                  ? formatFecha(
                    historialOrdenado[0].fecha
                  )
                  : "Sin registros"}
              </h3>

            </div>

            <div className="
              w-12
              h-12

              rounded-[18px]

              bg-slate-200/70

              text-slate-600

              flex
              items-center
              justify-center
            ">

              <Clock3 size={20} />

            </div>

          </div>

        </div>

      </div>

      {/* FORM */}



      <HistorialForm

        cliente={cliente}

        historial={historialOrdenado}

        clienteId={cliente.id}

        onAdd={(data) =>
          crearHistorial.mutate(data)
        }



      />




      {/* DETAIL MODAL */}

      {notaSeleccionada && (

        <BaseModal
          onClose={() =>
            setNotaSeleccionada(null)
          }
          maxWidth="max-w-3xl"
        >

          <div className="
            flex
            flex-col

            gap-6
          ">

            {/* HEADER */}

            <div className="
              flex
              items-start
              justify-between

              gap-4
            ">

              <div>

                <div className="
                  inline-flex

                  items-center
                  gap-2

                  px-3
                  py-1.5

                  rounded-full

                  
bg-sky-500/10

text-sky-800


                  text-xs
                  font-black

                  mb-4
                ">
                  <ClipboardList size={20} />
                   Nota clínica

                </div>

                <h3 className="
                  text-2xl

                  font-black

                  tracking-tight

                  text-slate-800
                ">
                  Detalle clínico
                </h3>

                <p className="
                  mt-2

                  text-sm

                  text-slate-400
                ">
                  {formatFecha(
                    notaSeleccionada.fecha
                  )}
                </p>

              </div>

              <button
                onClick={() =>
                  setNotaSeleccionada(null)
                }
                className="
                  w-11
                  h-11

                  rounded-[18px]

                  bg-slate-100

                  border
                  border-slate-200

                  text-slate-500

                  hover:bg-slate-200

                  hover:text-slate-700

                  transition-all
                  duration-300

                  flex
                  items-center
                  justify-center
                "
              >

                <X size={18} />

              </button>

            </div>

            {/* CONTENT */}

            <div className="
              bg-slate-50/80

              border
              border-slate-200/80

              rounded-[30px]

              p-6

              text-sm
              sm:text-base

              leading-relaxed

              text-slate-700

              whitespace-pre-wrap
              break-words

              shadow-inner
            ">

              {notaSeleccionada.descripcion}

            </div>

          </div>

        </BaseModal>

      )}

      {/* EDIT MODAL */}



    </div>

  );

}

export default ClienteDetalle;