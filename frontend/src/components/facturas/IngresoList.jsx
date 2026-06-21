import { formatFecha } from "../../utils/fecha";
import { formatMoney } from "../../utils/format";

import { useState } from "react";

import {
  CalendarDays,
  Receipt,
  BadgePercent,
  Wallet,
  CheckCircle2,
  Pencil,
  Eye,
  Clock3
} from "lucide-react";

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
  "from-sky-700 to-sky-900",
  "from-cyan-500 to-sky-700",
  "from-teal-500 to-cyan-600",
  "from-emerald-500 to-teal-600",
  "from-blue-600 to-sky-800"
];


  return (

    <div className="
      h-full

      space-y-4

      overflow-y-auto
      overflow-x-hidden

      pr-2
      pb-2

      scrollbar-thin
      scrollbar-thumb-sky-200/70
      scrollbar-track-transparent
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

              bg-white/95
              backdrop-blur-md

              border
              border-slate-200/80

              rounded-[34px]

              p-5
              sm:p-6

              transition-all
              duration-500

              hover:-translate-y-[2px]

             
hover:shadow-[0_20px_45px_rgba(7,89,133,0.08)]

hover:border-sky-200

            `}
          >

            {/* TOP LINE */}

            <div
              className={`
                absolute
                top-0
                left-0

                h-[3px]
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

              grid
              grid-cols-1
              2xl:grid-cols-[1fr_auto]

              gap-6
            ">

              {/* LEFT */}

              <div className="
                flex
                items-start

                gap-5

                min-w-0
              ">

                {/* AVATAR */}

                <div
                  className={`
                    relative

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

                    ring-4
                    ring-white

                    shadow-[0_15px_35px_rgba(0,0,0,0.15)]

                    group-hover:scale-105

                    transition-all
                    duration-300
                  `}
                >

                  {letra}

                  <div className={`
                    absolute
                    -bottom-1
                    -right-1

                    w-5
                    h-5

                    rounded-full

                    border-4
                    border-white

                    ${i.pagado
                      ? "bg-emerald-500"
                      : "bg-yellow-400"
                    }
                  `} />

                </div>

                {/* INFO */}

                <div className="
                  min-w-0
                  flex-1

                  space-y-5
                ">

                  {/* HEADER */}

                  <div className="
                    flex
                    flex-col
                    xl:flex-row

                    xl:items-start
                    xl:justify-between

                    gap-4
                  ">

                    {/* LEFT */}

                    <div className="min-w-0">

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

                          {i.cliente?.nombre}{" "}
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

                      {/* MINI TAGS */}

                      <div className="
                        mt-3

                        flex
                        flex-wrap

                        items-center
                        gap-2
                      ">

                        <div className="
                          inline-flex

                          items-center
                          gap-2

                          px-3
                          py-1.5

                          rounded-full

                          
bg-sky-50

text-sky-800


                          text-xs
                          font-semibold
                        ">

                          <Receipt size={12} />

                          Facturación clínica

                        </div>

                        <div className="
                          inline-flex

                          items-center
                          gap-2

                          px-3
                          py-1.5

                          rounded-full

                          bg-slate-100

                          text-slate-600

                          text-xs
                          font-semibold
                        ">

                          <Clock3 size={12} />

                          Control financiero

                        </div>

                      </div>

                    </div>

                    {/* STATUS CARD */}

                    <div className={`
                      shrink-0

                      rounded-[24px]

                      border

                      px-5
                      py-4

                      min-w-[230px]

                      ${i.pagado
                        ? "bg-emerald-50 border-emerald-100"
                        : "bg-yellow-50 border-yellow-100"
                      }
                    `}>

                      <div className="
                        flex
                        items-center
                        gap-2

                        text-sm
                        font-bold

                        text-slate-700
                      ">

                        <Wallet size={15} />

                        Estado financiero

                      </div>

                      <p className="
                        mt-3

                        text-base

                        font-black

                        text-slate-800
                      ">

                        {i.pagado
                          ? "Factura pagada"
                          : "Pago pendiente"}

                      </p>

                      <p className="
                        mt-1

                        text-xs

                        text-slate-500
                      ">

                        Seguimiento administrativo

                      </p>

                    </div>

                  </div>

                  {/* GRID */}

                  <div className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    xl:grid-cols-4

                    gap-4
                  ">

                    {/* FECHA */}

                    <div className="
                      bg-slate-50/80

                      border
                      border-slate-200/60

                      rounded-[24px]

                      px-5
                      py-4
                    ">

                      <div className="
                        flex
                        items-center
                        gap-2

                        text-slate-400

                        text-[11px]
                        font-black

                        uppercase

                        tracking-[0.12em]
                      ">

                        <CalendarDays size={12} />

                        Fecha

                      </div>

                      <p className="
                        mt-3

                        text-sm

                        font-bold

                        text-slate-700
                      ">

                        {formatFecha(i.created_at)}

                      </p>

                    </div>

                    {/* SERVICIOS */}

                    <div className="
                      bg-slate-50/80

                      border
                      border-slate-200/60

                      rounded-[24px]

                      px-5
                      py-4
                    ">

                      <div className="
                        flex
                        items-center
                        gap-2

                        text-slate-400

                        text-[11px]
                        font-black

                        uppercase

                        tracking-[0.12em]
                      ">

                        <Receipt size={12} />

                        Tratamientos

                      </div>

                      <p className="
                        mt-3

                        text-sm

                        font-bold

                        text-slate-700
                      ">

                        {(i.servicios || []).length}

                      </p>

                    </div>

                    {/* DESCUENTO */}

                    <div className="
                      bg-slate-50/80

                      border
                      border-slate-200/60

                      rounded-[24px]

                      px-5
                      py-4
                    ">

                      <div className="
                        flex
                        items-center
                        gap-2

                        text-slate-400

                        text-[11px]
                        font-black

                        uppercase

                        tracking-[0.12em]
                      ">

                        <BadgePercent size={12} />

                        Descuento

                      </div>

                      <p className="
                        mt-3

                        text-sm

                        font-bold

                        text-slate-700
                      ">

                        {descuento}%

                      </p>

                    </div>

                    {/* SUBTOTAL */}

                    <div className="
                      bg-slate-50/80

                      border
                      border-slate-200/60

                      rounded-[24px]

                      px-5
                      py-4
                    ">

                      <div className="
                        flex
                        items-center
                        gap-2

                        text-slate-400

                        text-[11px]
                        font-black

                        uppercase

                        tracking-[0.12em]
                      ">

                        <Wallet size={12} />

                        Subtotal

                      </div>

                      <p className="
                        mt-3

                        text-sm

                        font-bold

                        text-slate-700
                      ">

                        RD$
                        {" "}
                        {formatMoney(subtotal)}

                      </p>

                    </div>

                    {/* TOTAL */}

                    <div className={`
                      md:col-span-2
                      xl:col-span-4

                      rounded-[28px]

                      px-6
                      py-4

                      text-white

                      shadow-[0_15px_35px_rgba(7,89,133,0.18)]

                      ${i.pagado
                        ? `
                          bg-gradient-to-r
                          from-emerald-500
                          to-green-500
                        `
                        : `
                          
bg-gradient-to-r
from-sky-700
via-sky-800
to-sky-900

                        `
                      }
                    `}>

                      <p className="
                        text-[11px]

                        uppercase

                        tracking-[0.14em]

                        font-black

                        text-white/70
                      ">
                        Total factura
                      </p>

                      <div className="
                        mt-3

                        flex
                        items-center
                        justify-between

                        gap-4
                      ">

                        <h2 className="
                          text-2xl

                          font-black
                        ">

                          RD$
                          {" "}
                          {formatMoney(total)}

                        </h2>

                        <div className="
                          px-3
                          py-1.5

                          rounded-full

                          bg-white/15

                          text-xs
                          font-bold
                        ">

                          ITBIS incluido

                        </div>

                      </div>

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
    self-center

    2xl:w-[200px]

    bg-slate-50/80

    border
    border-slate-200/70

    rounded-[28px]

    p-4

    flex
    flex-row
    2xl:flex-col

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

        rounded-2xl

        
bg-gradient-to-r
from-sky-700
via-sky-800
to-sky-900


        text-white

        text-sm
        font-black

        
shadow-[0_12px_30px_rgba(7,89,133,0.25)]

hover:shadow-[0_18px_40px_rgba(7,89,133,0.35)]


        hover:scale-[1.02]

        transition-all
        duration-300

        flex
        items-center
        justify-center
        gap-2
      "
                  >

                    <Eye size={15} />

                    Ver factura

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

          rounded-2xl

          bg-gradient-to-r
          from-emerald-500
          via-green-500
          to-emerald-600

          text-white

          text-sm
          font-black

          shadow-[0_12px_30px_rgba(16,185,129,0.22)]

          hover:shadow-[0_18px_40px_rgba(16,185,129,0.30)]

          hover:scale-[1.02]

          transition-all
          duration-300

          flex
          items-center
          justify-center
          gap-2
        "
                    >

                      <CheckCircle2 size={15} />

                      Marcar pagado

                    </button>

                    {/* ACTIONS */}

                    <button
                      onClick={() =>
                        onEditar(i)
                      }
                      className="
          h-12

          px-5

          rounded-2xl

          bg-slate-100

          border
          border-slate-200

          text-slate-700

          text-sm
          font-bold

          hover:bg-slate-200

          transition-all
          duration-300

          flex
          items-center
          justify-center
          gap-2
        "
                    >

                      <Pencil size={15} />

                      Editar

                    </button>

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