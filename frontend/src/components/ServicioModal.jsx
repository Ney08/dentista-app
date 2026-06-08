import { useState, useEffect } from "react";

import { formatMoney } from "../utils/format";

function ServicioModal({
  servicio,
  onGuardar,
  onClose
}) {

  /*
  ==========================================
  STATES
  ==========================================
  */

  const [nombre, setNombre] =
    useState("");

  const [descripcion, setDescripcion] =
    useState("");

  const [precio, setPrecio] =
    useState("");

  const [costoServicio, setCostoServicio] =
    useState("");

  const isEdit =
    !!servicio;

  /*
  ==========================================
  EFFECT
  ==========================================
  */

  useEffect(() => {

    if (!servicio) {
      return;
    }

    setNombre(
      servicio.nombre || ""
    );

    setDescripcion(
      servicio.descripcion || ""
    );

    setPrecio(
      servicio.precio || ""
    );

    setCostoServicio(
      servicio.costo_servicio || ""
    );

  }, [servicio]);

  /*
  ==========================================
  CALCULOS
  ==========================================
  */

  const ganancia =
    (parseFloat(precio || 0)) -
    (parseFloat(costoServicio || 0));

  /*
  ==========================================
  GUARDAR
  ==========================================
  */

  const guardar = () => {

    if (!nombre || !precio) {
      return;
    }

    onGuardar({

      ...(servicio || {}),

      nombre,

      descripcion,

      precio:
        parseFloat(precio),

      costo_servicio:
        parseFloat(
          costoServicio || 0
        )

    });

  };

  return (

    <div
      onClick={onClose}
      className="
        fixed
        inset-0
        z-50

        flex
        items-end

        justify-center

        bg-black/50
        backdrop-blur-md

        transition-all
        duration-300
      "
    >

      {/* ✅ MODAL */}

      <div
        onClick={(e) =>
          e.stopPropagation()
        }

        className="
          w-full

          md:max-w-3xl

          p-0
          md:p-4

          animate-in
          slide-in-from-bottom

          duration-500
        "
      >

        <div className="
          relative
          overflow-hidden

          w-full
          h-full

          md:h-auto
          md:max-h-[92vh]

          bg-white/95
          backdrop-blur-2xl

          rounded-t-[36px]
          md:rounded-[36px]

          border-0
          md:border

          border-white/40

          shadow-[0_25px_80px_rgba(0,0,0,0.15)]

          p-5
          sm:p-6

          flex
          flex-col

          gap-6

          overflow-y-auto
          overflow-x-hidden

          will-change-transform
        ">

          {/* ✅ GLOW */}

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

          {/* ✅ HEADER */}

          <div className="
            relative
            z-10

            text-center

            space-y-3
          ">

            <h2 className="
              text-3xl
              sm:text-4xl

              font-black

              tracking-tight

              text-slate-800
            ">

              {isEdit
                ? "Editar servicio 🦷"
                : "Nuevo servicio 🦷"}

            </h2>

            <div className="
              w-20
              h-1

              mx-auto

              rounded-full

              bg-gradient-to-r
              from-indigo-500
              to-violet-500
            " />

            <p className="
              text-sm
              sm:text-base

              text-gray-500
            ">
              Configura servicios y costos
            </p>

          </div>

          {/* ✅ FORM */}

          <div className="
            relative
            z-10

            flex
            flex-col

            gap-6
          ">

            {/* ✅ INFO */}

            <div className="
              bg-gradient-to-br
              from-white
              to-slate-50

              border
              border-white

              rounded-[30px]

              p-5

              shadow-sm

              space-y-5
            ">

              {/* HEADER */}

              <div className="
                flex
                items-center

                gap-3
              ">

                <div className="
                  w-12
                  h-12

                  rounded-[18px]

                  bg-gradient-to-br
                  from-indigo-500
                  to-violet-500

                  flex
                  items-center
                  justify-center

                  text-white
                  text-xl
                ">
                  🧾
                </div>

                <div>

                  <h3 className="
                    text-sm

                    font-black

                    uppercase

                    tracking-[0.12em]

                    text-slate-700
                  ">
                    Información
                  </h3>

                  <p className="
                    text-xs
                    text-gray-400
                  ">
                    Datos principales del servicio
                  </p>

                </div>

              </div>

              {/* NOMBRE */}

              <input
                placeholder="Nombre"

                value={nombre}

                onChange={(e) =>
                  setNombre(
                    e.target.value
                  )
                }

                className="
                  w-full

                  h-14

                  px-5

                  rounded-[22px]

                  bg-white

                  border
                  border-slate-200

                  hover:border-indigo-300

                  text-slate-700

                  shadow-sm

                  focus:outline-none

                  focus:ring-4
                  focus:ring-indigo-500/10

                  focus:border-indigo-300

                  transition-all
                  duration-300
                "
              />

              {/* DESCRIPCION */}

              <textarea
                rows={5}

                placeholder="Descripción"

                value={descripcion}

                onChange={(e) =>
                  setDescripcion(
                    e.target.value
                  )
                }

                className="
                  w-full

                  rounded-[24px]

                  bg-white

                  border
                  border-slate-200

                  hover:border-indigo-300

                  px-5
                  py-4

                  text-slate-700

                  resize-none

                  shadow-sm

                  focus:outline-none

                  focus:ring-4
                  focus:ring-indigo-500/10

                  focus:border-indigo-300

                  transition-all
                  duration-300
                "
              />

            </div>

            {/* ✅ PRECIOS */}

            <div className="
              bg-gradient-to-br
              from-white
              to-slate-50

              border
              border-white

              rounded-[30px]

              p-5

              shadow-sm

              space-y-5
            ">

              {/* HEADER */}

              <div className="
                flex
                items-center

                gap-3
              ">

                <div className="
                  w-12
                  h-12

                  rounded-[18px]

                  bg-gradient-to-br
                  from-emerald-500
                  to-green-500

                  flex
                  items-center
                  justify-center

                  text-white
                  text-xl
                ">
                  💰
                </div>

                <div>

                  <h3 className="
                    text-sm

                    font-black

                    uppercase

                    tracking-[0.12em]

                    text-slate-700
                  ">
                    Finanzas
                  </h3>

                  <p className="
                    text-xs
                    text-gray-400
                  ">
                    Precio y rentabilidad
                  </p>

                </div>

              </div>

              {/* INPUTS */}

              <div className="
                grid
                grid-cols-1
                sm:grid-cols-2

                gap-4
              ">

                {/* PRECIO */}

                <input
                  type="number"

                  placeholder="Precio"

                  value={precio}

                  onChange={(e) =>
                    setPrecio(
                      e.target.value
                    )
                  }

                  className="
                    w-full

                    h-14

                    px-5

                    rounded-[22px]

                    bg-white

                    border
                    border-slate-200

                    hover:border-emerald-300

                    text-slate-700

                    shadow-sm

                    focus:outline-none

                    focus:ring-4
                    focus:ring-emerald-500/10

                    focus:border-emerald-300

                    transition-all
                    duration-300
                  "
                />

                {/* COSTO */}

                <input
                  type="number"

                  placeholder="Costo del servicio"

                  value={costoServicio}

                  onChange={(e) =>
                    setCostoServicio(
                      e.target.value
                    )
                  }

                  className="
                    w-full

                    h-14

                    px-5

                    rounded-[22px]

                    bg-white

                    border
                    border-slate-200

                    hover:border-rose-300

                    text-slate-700

                    shadow-sm

                    focus:outline-none

                    focus:ring-4
                    focus:ring-rose-500/10

                    focus:border-rose-300

                    transition-all
                    duration-300
                  "
                />

              </div>

              {/* KPI */}

              <div className="
                grid
                grid-cols-1
                sm:grid-cols-3

                gap-4
              ">

                {/* PRECIO */}

                <div className="
                  bg-gradient-to-r
                  from-emerald-500
                  to-green-500

                  rounded-[24px]

                  px-5
                  py-5

                  text-white

                  shadow-[0_15px_35px_rgba(16,185,129,0.25)]
                ">

                  <p className="
                    text-[11px]

                    uppercase

                    tracking-[0.12em]

                    font-black

                    text-white/70
                  ">
                    Precio
                  </p>

                  <p className="
                    mt-2

                    text-2xl

                    tracking-tight

                    font-black
                  ">
                    RD$
                    {" "}
                    {formatMoney(precio || 0)}
                  </p>

                </div>

                {/* COSTO */}

                <div className="
                  bg-gradient-to-r
                  from-rose-500
                  to-pink-500

                  rounded-[24px]

                  px-5
                  py-5

                  text-white

                  shadow-[0_15px_35px_rgba(244,63,94,0.25)]
                ">

                  <p className="
                    text-[11px]

                    uppercase

                    tracking-[0.12em]

                    font-black

                    text-white/70
                  ">
                    Costo
                  </p>

                  <p className="
                    mt-2

                    text-2xl

                    tracking-tight

                    font-black
                  ">
                    RD$
                    {" "}
                    {formatMoney(
                      costoServicio || 0
                    )}
                  </p>

                </div>

                {/* GANANCIA */}

                <div className="
                  bg-gradient-to-r
                  from-indigo-500
                  to-violet-500

                  rounded-[24px]

                  px-5
                  py-5

                  text-white

                  shadow-[0_15px_35px_rgba(99,102,241,0.25)]
                ">

                  <p className="
                    text-[11px]

                    uppercase

                    tracking-[0.12em]

                    font-black

                    text-white/70
                  ">
                    Ganancia
                  </p>

                  <p className="
                    mt-2

                    text-2xl

                    tracking-tight

                    font-black
                  ">
                    RD$
                    {" "}
                    {formatMoney(
                      ganancia || 0
                    )}
                  </p>

                </div>

              </div>

            </div>

            {/* ✅ ACTIONS */}

            <div className="
              sticky
              bottom-0

              bg-white/90
              backdrop-blur-xl

              pt-2

              flex
              flex-col
              sm:flex-row

              gap-3
            ">
              {/* CANCEL */}

              <button
                onClick={onClose}

                className="
                  flex-1

                  h-14

                  rounded-[24px]

                  bg-slate-100/80
                  backdrop-blur-xl

                  hover:bg-slate-200

                  text-slate-700

                  font-semibold

                  transition-all
                  duration-300

                  active:scale-[0.98]
                "
              >
                Cancelar
              </button>
              
              {/* SAVE */}

              <button
                onClick={guardar}

                className="
                  flex-1

                  h-14

                  rounded-[24px]

                  bg-gradient-to-r
                  from-emerald-500
                  to-green-500

                  text-white

                  text-sm
                  sm:text-base

                  font-black

                  shadow-[0_15px_35px_rgba(16,185,129,0.28)]

                  hover:scale-[1.01]

                  hover:shadow-[0_20px_45px_rgba(16,185,129,0.35)]

                  active:scale-[0.98]

                  transition-all
                  duration-300
                "
              >

                {isEdit
                  ? "Guardar cambios"
                  : "Crear servicio"}

              </button>

              

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default ServicioModal;