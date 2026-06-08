import { useState } from "react";

import toast from "react-hot-toast";

import {
  MoreHorizontal,
  Pencil,
  Trash2,
  X
} from "lucide-react";

import HistorialForm from "./HistorialForm";

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
  HELPERS
  ==========================================
  */

  const cortarTexto = (
    texto,
    limite = 90
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

      toast.success(
        "Nota eliminada ✅"
      );

      window.location.reload();

    } catch {

      toast.error(
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

      toast.error(
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

      toast.success(
        "Nota actualizada ✅"
      );

      setEditando(null);

      setTextoEditado("");

      window.location.reload();

    } catch {

      toast.error(
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
      <p>
        Cargando historial...
      </p>
    );

  }

  return (

    <div className="
      space-y-6
    ">

      {/* FORM */}

      <HistorialForm
        clienteId={cliente.id}
        onAdd={(data) =>
          crearHistorial.mutate(data)
        }
      />

      {/* HEADER */}

      <div className="
        flex
        items-center
        justify-between

        gap-3
      ">

        <div>

          <h4 className="
            text-lg

            font-black

            tracking-tight

            text-slate-800
          ">
            📚 Historial clínico
          </h4>

          <p className="
            text-sm

            text-slate-400
          ">
            Observaciones y seguimiento del paciente
          </p>

        </div>

        <div className="
          px-3
          py-1.5

          rounded-full

          bg-indigo-500/10

          text-indigo-600

          text-xs
          font-bold
        ">
          {historial.length} notas
        </div>

      </div>

      {/* LIST */}

      <div className="
        flex-1

        min-h-0

        max-h-[420px]

        overflow-y-auto
        overflow-x-hidden

        pr-1

        space-y-3
      ">

        {(!historial || historial.length === 0) ? (

          <div className="
            bg-white

            border
            border-slate-200

            rounded-[28px]

            p-8

            text-center
          ">

            <p className="
              text-slate-500
            ">
              No hay historial clínico registrado
            </p>

          </div>

        ) : (

          (historial || []).map((h, index) => (

            <div
              key={h.id}
              className="
                group

                relative

                flex
                gap-4
              "
            >

              {/* LEFT BORDER */}

              <div className={`
                w-[4px]

                rounded-full

                shrink-0

                ${index === 0
                  ? `
                    bg-gradient-to-b
                    from-indigo-500
                    to-purple-500
                  `
                  : `
                    bg-slate-200
                  `
                }
              `} />

              {/* CARD */}

              <div
                onClick={() =>
                  setNotaSeleccionada(h)
                }
                className="
                  relative

                  flex-1

                  cursor-pointer

                  bg-white

                  border
                  border-slate-200/80

                  rounded-[28px]

                  p-5

                  shadow-[0_10px_30px_rgba(0,0,0,0.04)]

                  hover:-translate-y-[2px]

                  hover:shadow-[0_18px_40px_rgba(0,0,0,0.06)]

                  hover:border-indigo-200

                  transition-all
                  duration-300
                "
              >

                {/* TOP ACTIONS */}

                <div className="
                  absolute
                  top-4
                  right-4
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

                      bg-white/90

                      border
                      border-slate-200

                      text-slate-500

                      hover:text-indigo-600

                      hover:border-indigo-200

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
                      z-20

                      w-44

                      bg-white

                      border
                      border-slate-200

                      rounded-[20px]

                      shadow-[0_15px_40px_rgba(0,0,0,0.10)]

                      overflow-hidden
                    ">

                      {/* EDIT */}

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

                          hover:bg-indigo-50

                          transition-all
                          duration-200
                        "
                      >

                        <Pencil size={16} />

                        Editar nota

                      </button>

                      {/* DELETE */}

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

                {/* RECENT BADGE */}

                {index === 0 && (

                  <div className="
                    inline-flex

                    items-center
                    gap-2

                    px-3
                    py-1.5

                    rounded-full

                    bg-gradient-to-r
                    from-indigo-500/10
                    to-purple-500/10

                    text-indigo-600

                    text-[11px]
                    font-black

                    mb-4
                  ">

                    ✨ Nota reciente

                  </div>

                )}

                {/* TEXT */}

                <p className="
                  text-sm
                  sm:text-base

                  leading-relaxed

                  text-slate-700

                  break-words

                  pr-10
                ">

                  {cortarTexto(h.descripcion)}

                  {h.descripcion?.length > 90 && (

                    <span className="
                      ml-2

                      text-indigo-500

                      text-sm
                      font-semibold

                      hover:text-indigo-600
                    ">
                      ver más
                    </span>

                  )}

                </p>

                {/* FOOTER */}

                <div className="
                  mt-4

                  flex
                  items-center
                  justify-between

                  gap-3
                ">

                  <p className="
                    text-sm

                    text-slate-400

                    font-medium
                  ">
                    {formatFecha(h.fecha)}
                  </p>

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

                  bg-indigo-500/10

                  text-indigo-600

                  text-xs
                  font-black

                  mb-4
                ">

                  📋 Nota clínica

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

              {/* CLOSE */}

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
          maxWidth="max-w-2xl"
        >

          <div className="
            space-y-6
          ">

            {/* HEADER */}

            <div>

              <h3 className="
                text-2xl

                font-black

                tracking-tight

                text-slate-800
              ">
                ✏️ Editar nota clínica
              </h3>

              <p className="
                mt-1

                text-sm

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
                focus:ring-indigo-500/10

                focus:border-indigo-300

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
                className="
                  h-12

                  px-6

                  rounded-[20px]

                  bg-gradient-to-r
                  from-indigo-500
                  to-purple-500

                  text-white

                  font-bold

                  shadow-[0_12px_30px_rgba(99,102,241,0.25)]

                  hover:scale-[1.02]

                  transition-all
                  duration-300
                "
              >
                Guardar cambios
              </button>

            </div>

          </div>

        </BaseModal>

      )}

    </div>

  );

}

export default ClienteDetalle;