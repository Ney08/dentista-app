
import { useState, useEffect } from "react";
import ConfirmModal from "../ConfirmModal";
import {
  Paperclip, 
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  CalendarDays,
  ClockPlus,
  Sparkles,
  ClipboardList,
  AlertCircle,
  Save,
  Loader2

} from "lucide-react";

import BaseModal
  from "../BaseModal";

import {

  showSuccess,
  showError

} from "../ui/ToastStyles";

import {
  formatFecha
} from "../../utils/fecha";

import { API_URL }
  from "../../config";

function HistorialCliente({

  historial = [],

  cliente,


  eliminarHistorial,
  actualizarHistorial


}) {

  /*
  ==========================================
  STATES
  ==========================================
  */
  /*


==========================================
SORT HISTORIAL
==========================================
*/


  //const [lista, setLista] = useState(historial);
  const [loading, setLoading] =
    useState(false);
  const historialOrdenado =
    [...(historial || [])]

      .sort((a, b) => {

        return (

          new Date(b.fecha) -

          new Date(a.fecha)

        );

      });

  const [

    notaSeleccionada,

    setNotaSeleccionada

  ] = useState(null);

  const [

    menuAbierto,

    setMenuAbierto

  ] = useState(null);

  const [

    editando,

    setEditando

  ] = useState(null);

  const [

    textoEditado,

    setTextoEditado

  ] = useState("");


  const [confirmOpen, setConfirmOpen] = useState(false);
  const [notaAEliminar, setNotaAEliminar] = useState(null);


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


  const eliminarNota = (id) => {

    setNotaAEliminar(id);
    setConfirmOpen(true);

  };


  /*
  ==========================================
  EDITAR
  ==========================================
  */

  const guardarEdicion = async () => {

    if (!textoEditado.trim()) {
      return showError("La nota no puede estar vacía ⚠️");
    }

    try {

      await actualizarHistorial.mutateAsync({
        id: editando.id,
        cliente_id: cliente.id,
        descripcion: textoEditado
      });

      showSuccess("Nota actualizada ✅");

      setEditando(null);
      setTextoEditado("");

    } catch {

      showError("Error al actualizar ❌");

    }

  };





  // useEffect(() => {

  //   if (historial.length !== lista.length) {
  //     setLista(historial);
  //   }

  // }, [historial]);





return (

  <div className="
    w-full

    h-[calc(100vh-260px)]
    min-h-[560px]
    max-h-[950px]

    flex
    flex-col

    space-y-6
  ">




      {/* HEADER */}

     
<div className="
  flex
  items-center
  justify-between

  gap-4

  shrink-0
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

            mb-3
          ">

            <Paperclip size={20} />

            Nota clínica

          </div>

          <h4 className="
            text-xl

            font-black

            tracking-tight

            text-slate-800
          ">
            Seguimiento del paciente
          </h4>

          <p className="
            mt-1

            text-sm

            text-slate-400
          ">
            Observaciones, evolución y notas clínicas
          </p>

        </div>

        <div className="
          px-4
          py-2

          rounded-full

          
bg-sky-500/10

text-sky-800


          text-xs
          font-black
        ">

          {historial.length} registros

        </div>

      </div>

      {/* LIST */}


      <div className="
  w-full

  flex-1
  min-h-0

  h-full

  overflow-y-auto
  overflow-x-hidden

  pr-2

  space-y-4

  scrollbar-thin
  scrollbar-thumb-sky-200/70
  scrollbar-track-transparent
">

        {(!historial || historial.length === 0) ? (

          <div className="
            relative
            overflow-hidden

            bg-white

            border
            border-slate-200

            rounded-[30px]

            p-10

            text-center
          ">

            <div className="
              w-20
              h-20

              mx-auto

              rounded-[26px]

              
bg-gradient-to-br
from-sky-700
to-sky-900


              text-white

              flex
              items-center
              justify-center

              shadow-[0_20px_50px_rgba(7,89,133,0.25)]
            ">

              <ClipboardList size={36} />

            </div>

            <h3 className="
              mt-6

              text-2xl

              font-black

              text-slate-800
            ">
              Sin historial clínico
            </h3>

            <p className="
              mt-2

              text-slate-500
            ">
              Comienza agregando observaciones del paciente
            </p>

          </div>

        ) : (

          historialOrdenado.map((h, index) => (

            <div
              key={h.id}
              className="
     
group

  relative

  grid
  grid-cols-[28px_minmax(0,1fr)]

  gap-4

  w-full
  max-w-full

    "
            >

              {/* TIMELINE */}

              <div className="
      relative

      flex
      flex-col

      items-center

      pt-2
    ">

                <div className={`
        w-4
        h-4

        rounded-full

        border-4
        border-white

        shadow-md

        z-10

        ${index === 0
                    ? "bg-sky-700"
                    : "bg-slate-300"}
      `} />

                {index !== historialOrdenado.length - 1 && (

                  <div className="
          w-[3px]

          flex-1

          bg-slate-200

          min-h-[96px]
        " />

                )}

              </div>

              {/* CARD */}

              <div
                onClick={() =>
                  setNotaSeleccionada(h)
                }

                className={`
  relative

  w-full
  max-w-full
  min-w-0

  cursor-pointer

        border

        rounded-[30px]

        p-5
        sm:p-6

        transition-all
        duration-300

        ${index === 0
                    ? `
            bg-sky-50/50

            border-sky-200

            shadow-[0_18px_40px_rgba(7,89,133,0.12)]
          `
                    : `
            bg-white

            border-slate-200/80

            shadow-[0_10px_30px_rgba(0,0,0,0.04)]

            hover:-translate-y-[2px]

            hover:border-sky-200

            hover:shadow-[0_18px_40px_rgba(7,89,133,0.08)]
          `
                  }
      `}
              >

                {/* ACTIONS */}

                <div className="
        absolute
        top-4
        right-4
        z-20
      ">

                  <button
                    onClick={(e) => {

                      e.stopPropagation();

                      setMenuAbierto(
                        menuAbierto === h.id
                          ? null
                          : h.id
                      );

                    }}
                    className="
            opacity-0

            group-hover:opacity-100

            w-9
            h-9

            rounded-[14px]

            bg-white

            border
            border-slate-200

            text-slate-500

            hover:text-sky-800
            hover:border-sky-200

            transition-all
            duration-300

            flex
            items-center
            justify-center
          "
                  >

                    <MoreHorizontal size={16} />

                  </button>

                  {/* MENU */}

                  {menuAbierto === h.id && (

                    <div className="
            absolute
            top-11
            right-0

            z-30

            w-44

            bg-white

            border
            border-slate-200

            rounded-[22px]

            overflow-hidden

            shadow-[0_20px_50px_rgba(0,0,0,0.12)]
          ">

                      <button
                        onClick={(e) => {

                          e.stopPropagation();

                          setEditando(h);

                          setTextoEditado(
                            h.descripcion
                          );

                          setMenuAbierto(null);

                        }}
                        className="
                w-full

                px-4
                py-3

                flex
                items-center
                gap-3

                text-sm
                font-medium

                text-slate-700

                hover:bg-sky-50

                transition-all
                duration-200
              "
                      >

                        <Pencil size={16} />

                        Editar nota

                      </button>

                      <button
                        onClick={(e) => {

                          e.stopPropagation();

                          eliminarNota(h.id);

                          setMenuAbierto(null);

                        }}
                        className="
                w-full

                px-4
                py-3

                flex
                items-center
                gap-3

                text-sm
                font-medium

                text-rose-500

                hover:bg-rose-50

                transition-all
                duration-200
              "
                      >

                        <Trash2 size={16} />

                        Eliminar nota

                      </button>

                    </div>

                  )}

                </div>

                {/* RECENT */}

                {index === 0 && (

                  <div className="
          inline-flex

          items-center
          gap-2

          px-3
          py-1.5

          rounded-full

          bg-gradient-to-r
          from-sky-500/10
          to-cyan-500/10

          text-sky-800

          text-[11px]
          font-black

          mb-4
        ">
                    <ClockPlus size={13} />
                    Nota reciente

                  </div>

                )}

                {/* CONTENT */}

                <p className="
        text-sm
        sm:text-base

        leading-relaxed

        text-slate-700

        break-words

        pr-12
      ">

                  {cortarTexto(h.descripcion)}

                  {h.descripcion?.length > 120 && (

                    <span className="
            ml-2

            text-sky-700

            text-sm
            font-semibold
          ">

                      ver más

                    </span>

                  )}

                </p>

                {/* FOOTER */}

                <div className="
        mt-5

        flex
        flex-col
        sm:flex-row

        sm:items-center
        sm:justify-between

        gap-3
      ">

                  <div className="
          inline-flex

          items-center
          gap-2

          text-sm

          text-slate-400

          font-medium
        ">

                    <CalendarDays size={14} />

                    {formatFecha(h.fecha)}

                  </div>

                  <div className="
          inline-flex

          items-center
          gap-2

          w-fit

          px-3
          py-1.5

          rounded-full

          bg-emerald-50

          text-emerald-600

          text-[11px]
          font-bold
        ">

                    <AlertCircle size={12} />

                    Seguimiento

                  </div>

                </div>

              </div>

            </div>

          ))

        )}

      </div>

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
  items-center
  justify-between

  gap-4

  shrink-0
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
                  <ClipboardList size={16} />
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

      {editando && (

        <BaseModal
          onClose={() =>
            setEditando(null)
          }
          maxWidth="max-w-4xl"
        >

          <div className="
            space-y-6
          ">

            {/* HEADER */}

              <div className="
  flex
  flex-col
  items-center

  text-center
">

  <div className="
    flex
    items-center
    justify-center

    w-20
    h-20

    rounded-[28px]

    bg-gradient-to-br
    from-sky-500
    via-sky-600
    to-sky-700

    text-white

    shadow-[0_20px_50px_rgba(14,116,144,0.25)]
  ">

    <Pencil
      size={34}
      strokeWidth={2.8}
    />

  </div>

  <h3 className="
    mt-5

    text-3xl

    font-black

    tracking-tight

    text-slate-800
  ">

    Editar nota clínica

  </h3>

  <div className="
    mt-3

    w-20
    h-1.5

    rounded-full

    bg-gradient-to-r
    from-sky-500
    to-sky-700
  " />

  <p className="
    mt-4

    max-w-sm

    text-sm
    md:text-base

    leading-relaxed

    text-slate-500
  ">

    Actualiza la observación clínica del paciente

  </p>

</div>

            {/* TEXTAREA */}

            <textarea
              value={textoEditado}
              onChange={(e) =>
                setTextoEditado(
                  e.target.value
                )
              }
              className="
                w-full

                min-h-[220px]

                rounded-[28px]

                bg-slate-50/80

                border
                border-slate-200

                px-5
                py-5

                text-slate-700

                placeholder:text-slate-400

                focus:outline-none

                focus:ring-4
               
focus:ring-sky-500/10

focus:border-sky-300


                resize-none

                transition-all
                duration-300
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
                  setEditando(null)
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
                onClick={guardarEdicion}

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

                    hover:shadow-[0_20px_45px_rgba(99,102,241,0.35)]
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

      )}



      {confirmOpen && (
        <ConfirmModal
          mensaje="¿Eliminar esta nota clínica?"

          onCancel={() => {
            setConfirmOpen(false);
            setNotaAEliminar(null);
          }}

          onConfirm={async () => {

            try {

              await eliminarHistorial.mutateAsync(notaAEliminar);

              showSuccess("Nota eliminada ✅");

            } catch {

              showError("Error al eliminar ❌");

            }

            setConfirmOpen(false);
            setNotaAEliminar(null);

          }}

        />
      )}
    </div>

  );

}
export default HistorialCliente;