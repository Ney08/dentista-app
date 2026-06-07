import { formatFecha } from "../../utils/fecha";
import { formatMoney } from "../../utils/format";

import { useState } from "react";

import ConfirmModal from "../ConfirmModal";

function IngresoList({
  facturas,
  porPagina,
  onVerFactura,
  onEditar,
  onPagar
}) {

  const [ingresoAPagar, setIngresoAPagar] =
    useState(null);

  const coloresAvatar = [
    "from-blue-500 to-cyan-500",
    "from-green-500 to-emerald-500",
    "from-purple-500 to-violet-500",
    "from-pink-500 to-rose-500",
    "from-indigo-500 to-blue-500"
  ];

  return (

    <div className="
      h-full

      space-y-5

      overflow-y-auto
      overflow-x-hidden

      pr-1
      pb-2
    ">

      {facturas.map((i) => {

        /*
        ==========================================
        CALCULOS
        ==========================================
        */

        const subtotal =
          (i.servicios || []).reduce(
            (a, s) => a + s.monto,
            0
          );

        const itbis =
          subtotal * 0.18;

        const descuento =
          i.descuento || 0;

        const descuentoValor =
          subtotal * (descuento / 100);

        const total =
          subtotal +
          itbis -
          descuentoValor;

        const letra =
          i.cliente?.nombre
            ?.charAt(0)
            ?.toUpperCase();

        const colorAvatar =
          coloresAvatar[
          i.id % coloresAvatar.length
          ];

        return (

          <div
            key={i.id}
            className={`
              group
              relative
              overflow-hidden

              bg-white/90
              backdrop-blur-xl

              border
              border-white/40

              rounded-[34px]

              p-5
              sm:p-6

              transition-all
              duration-500

              hover:-translate-y-[4px]

              hover:shadow-[0_25px_60px_rgba(99,102,241,0.12)]

              hover:border-indigo-100
            `}
          >

            {/* TOP LINE */}

            <div
              className={`
                absolute
                top-0
                left-0

                h-1
                w-full

                bg-gradient-to-r

                ${i.pagado
                  ? "from-emerald-400 to-green-500"
                  : "from-yellow-400 to-amber-500"
                }
              `}
            />

            {/* GLOW */}

            <div className={`
              absolute
              -top-16
              -right-16

              w-56
              h-56

              rounded-full

              blur-3xl

              opacity-0

              group-hover:opacity-100

              transition-all
              duration-700

              ${i.pagado
                ? "bg-emerald-500/10"
                : "bg-yellow-500/10"
              }
            `} />

            {/* CONTENT */}

            <div className="
              relative
              z-10

              flex
              flex-col
              xl:flex-row

              xl:items-center
              xl:justify-between

              gap-6
            ">

              {/* LEFT */}

              <div className="
                flex
                items-start
                gap-5

                min-w-0
                flex-1
              ">

                {/* AVATAR */}

                <div
                  className={`
                    bg-gradient-to-br
                    ${colorAvatar}

                    w-16
                    h-16

                    rounded-[24px]

                    text-white

                    flex
                    items-center
                    justify-center

                    text-xl
                    font-black

                    shrink-0

                    shadow-[0_15px_35px_rgba(0,0,0,0.15)]

                    group-hover:scale-105

                    transition-all
                    duration-300
                  `}
                >
                  {letra}
                </div>

                {/* INFO */}

                <div className="
                  min-w-0
                  flex-1

                  space-y-4
                ">

                  {/* HEADER */}

                  <div className="
                    flex
                    flex-wrap

                    items-center

                    gap-3
                  ">

                    <h3 className="
                      text-lg
                      sm:text-xl

                      font-black

                      text-slate-800

                      truncate
                    ">

                      {i.cliente?.nombre}
                      {" "}
                      {i.cliente?.apellido}

                    </h3>

                    <span className={`
                      px-3
                      py-1.5

                      rounded-full

                      text-[11px]
                      font-bold

                      border

                      shadow-sm

                      ${i.pagado
                        ? `
                          bg-emerald-50
                          text-emerald-600
                          border-emerald-200
                        `
                        : `
                          bg-yellow-50
                          text-yellow-700
                          border-yellow-200
                        `
                      }
                    `}>

                      {i.pagado
                        ? "Pagado"
                        : "Pendiente"}

                    </span>

                  </div>

                  {/* INFO GRID */}

                  <div className="
                    grid
                    lg:grid-cols-4
                    md:grid-cols-3

                    gap-3
                  ">

                    {/* FECHA */}

                    <div className="
                      bg-gradient-to-br
                      from-white
                      to-slate-100/90

                      border
                      border-white

                      rounded-[24px]

                      px-5
                      py-4

                      transition-all
                      duration-300

                      group-hover:shadow-sm
                    ">

                      <p className="
                        text-[11px]

                        uppercase

                        tracking-[0.12em]

                        text-gray-400

                        font-black
                      ">
                        Fecha
                      </p>

                      <p className="
                        mt-2

                        text-sm

                        font-bold

                        text-slate-700
                      ">
                        {formatFecha(i.created_at)}
                      </p>

                    </div>

                    {/* SERVICIOS */}

                    <div className="
                      bg-gradient-to-br
                      from-white
                      to-slate-100/90

                      border
                      border-white

                      rounded-[24px]

                      px-5
                      py-4

                      transition-all
                      duration-300

                      group-hover:shadow-sm
                    ">

                      <p className="
                        text-[11px]

                        uppercase

                        tracking-[0.12em]

                        text-gray-400

                        font-black
                      ">
                        Servicios
                      </p>

                      <p className="
                        mt-2

                        text-sm

                        font-bold

                        text-slate-700
                      ">
                        {(i.servicios || []).length}
                      </p>

                    </div>

                    {/* DESCUENTO */}

                    <div className="
                      bg-gradient-to-br
                      from-white
                      to-slate-100/90

                      border
                      border-white

                      rounded-[24px]

                      px-5
                      py-4

                      transition-all
                      duration-300

                      group-hover:shadow-sm
                    ">

                      <p className="
                        text-[11px]

                        uppercase

                        tracking-[0.12em]

                        text-gray-400

                        font-black
                      ">
                        Descuento
                      </p>

                      <p className="
                        mt-2

                        text-sm

                        font-bold

                        text-slate-700
                      ">
                        {descuento}%
                      </p>

                    </div>

                    {/* TOTAL */}

                    <div className="
                      lg:col-span-2

                      bg-gradient-to-r

                      from-emerald-500
                      to-green-500

                      rounded-[28px]

                      px-6
                      py-5

                      text-white

                      shadow-[0_15px_35px_rgba(16,185,129,0.25)]
                    ">

                      <p className="
                        text-[11px]

                        uppercase

                        tracking-[0.14em]

                        font-black

                        text-white/70
                      ">
                        Total factura
                      </p>

                      <p className="
                        mt-2

                        text-3xl

                        font-black
                      ">

                        RD$
                        {" "}
                        {formatMoney(total)}

                      </p>

                    </div>

                  </div>

                </div>

              </div>

              {/* RIGHT PANEL */}

              <div
                onClick={(e) =>
                  e.stopPropagation()
                }
                className="
                  xl:min-w-[180px]

                  flex
                  flex-row
                  xl:flex-col

                  items-stretch

                  gap-3
                "
              >

                {/* PAGADA */}

                {i.pagado && (

                  <button
                    onClick={() =>
                      onVerFactura(i)
                    }
                    className="
                      h-12

                      px-5

                      rounded-[20px]

                      bg-gradient-to-r
                      from-indigo-500
                      via-purple-500
                      to-violet-500

                      text-white

                      text-sm
                      font-black

                      shadow-[0_15px_35px_rgba(99,102,241,0.28)]

                      hover:scale-[1.03]

                      hover:shadow-[0_20px_45px_rgba(99,102,241,0.35)]

                      active:scale-95

                      transition-all
                      duration-300

                      whitespace-nowrap
                    "
                  >
                    📄 Ver factura
                  </button>

                )}

                {/* PENDIENTE */}

                {!i.pagado && (

                  <>

                    {/* PAGAR */}

                    <button
                      onClick={() =>
                        setIngresoAPagar(i)
                      }
                      className="
                        h-12

                        px-5

                        rounded-[20px]

                        bg-gradient-to-r
                        from-emerald-500
                        to-green-500

                        text-white

                        text-sm
                        font-black

                        shadow-[0_15px_35px_rgba(16,185,129,0.25)]

                        hover:scale-[1.03]

                        hover:shadow-[0_20px_45px_rgba(16,185,129,0.35)]

                        active:scale-95

                        transition-all
                        duration-300

                        whitespace-nowrap
                      "
                    >
                      💳 Marcar pagado
                    </button>

                    {/* ACTIONS */}

                    <div className="
                      flex
                      items-center
                      justify-center

                      gap-3
                    ">

                      {/* EDITAR */}

                      <button
                        onClick={() =>
                          onEditar(i)
                        }
                        className="
                          w-12
                          h-12

                          rounded-[20px]

                          bg-gradient-to-br
                          from-yellow-50
                          to-amber-100

                          text-yellow-600

                          border
                          border-white

                          flex
                          items-center
                          justify-center

                          hover:scale-110

                          active:scale-95

                          hover:shadow-lg

                          transition-all
                          duration-300
                        "
                        title="Editar"
                      >
                        ✏️
                      </button>

                    </div>

                  </>

                )}

              </div>

            </div>

          </div>

        );

      })}

      {/* CONFIRM */}

      {ingresoAPagar && (

        <ConfirmModal
          mensaje={`¿Confirmar pago de ${ingresoAPagar.cliente?.nombre}?`}
          onConfirm={() => {

            onPagar(
              ingresoAPagar
            );

            setIngresoAPagar(null);

          }}
          onCancel={() =>
            setIngresoAPagar(null)
          }
        />

      )}

    </div>

  );

}

export default IngresoList;