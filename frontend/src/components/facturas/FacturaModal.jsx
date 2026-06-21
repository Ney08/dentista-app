import { generarFactura } from "../../utils/pdf";

import { formatMoney } from "../../utils/format";

import {
  formatUTCFechaHora
} from "../../utils/fecha";

function FacturaModal({
  ingreso,
  onClose
}) {

  if (!ingreso) return null;

  /*
  ==========================================
  DATA
  ==========================================
  */

  const servicios =
    ingreso.servicios || [];

  const subtotal =
    servicios.reduce(
      (acc, s) =>
        acc + s.monto,
      0
    );

  const itbis =
    subtotal * 0.18;

  const descuento =
    ingreso.descuento || 0;

  const descuentoValor =
    subtotal *
    (descuento / 100);

  const total =
    subtotal +
    itbis -
    descuentoValor;



  const balanceTratamiento =

    ingreso.balance_restante || 0;

  /*
  ==========================================
  PAGOS
  ==========================================
  */


  const abonado =
    ingreso.monto_abonado
    || 0;


  // const restante =
  //   total - abonado;

  /*
  ==========================================
  HELPERS
  ==========================================
  */

  const format = (n) =>
    `RD$ ${formatMoney(n)}`;

  /*
  ==========================================
  STATUS
  ==========================================
  */


  const pagada =
    ingreso.pagado;


  return (

    <div
      className="
        fixed
        inset-0

        z-50

        flex
        items-center
        justify-center

        bg-black/40

        backdrop-blur-md

        p-4

        overflow-y-auto
      "
      onClick={onClose}
    >

      {/* MODAL */}

      <div
        className="
          factura-print

          relative

          w-full
          max-w-2xl

          overflow-hidden

          rounded-[32px]

          bg-white

          shadow-[0_30px_80px_rgba(15,23,42,0.20)]

          animate-modalUp
        "
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* GLOW */}

        <div className="
          absolute
          -top-24
          -right-24

          w-72
          h-72

          rounded-full

          bg-sky-500/10

          blur-3xl
        " />

        {/* CONTENT */}

        <div className="
          relative
          z-10

          p-7
          md:p-8

          space-y-7
        ">

          {/* HEADER */}

          <div className="
            flex
            flex-col
            md:flex-row

            md:items-start
            md:justify-between

            gap-6
          ">

            {/* LEFT */}

            <div>

              <div className="
                inline-flex

                items-center
                gap-2

                rounded-full

                bg-sky-50

                px-4
                py-2

                text-xs

                font-black

                uppercase

                tracking-[0.14em]

               text-sky-800
              ">

                🦷 Clínica Dental

              </div>

              <h2 className="
                mt-5

                text-3xl
                md:text-4xl

                font-black

                tracking-tight

                text-slate-800
              ">

                Factura

              </h2>

              <p className="
                mt-2

                text-sm

                text-slate-500
              ">

                FAC-2026-
                {String(
                  ingreso.id
                ).padStart(6, "0")}

              </p>

            </div>

            {/* RIGHT */}

            <div className="
              md:text-right

              space-y-3
            ">

              {/* STATUS */}

              <div className="
                flex
                md:justify-end
              ">

                <span className={`
                  inline-flex

                  items-center
                  gap-2

                  px-4
                  py-2

                  rounded-full

                  text-xs
                  font-black

                  border

                  shadow-sm

                  ${pagada

                    ? `
                        bg-emerald-50
                        text-emerald-600
                        border-emerald-200
                      `

                    : `
                        bg-amber-50
                        text-amber-600
                        border-amber-200
                      `
                  }
                `}>

                  {pagada
                    ? "✅ PAGADA"
                    : "🕒 PENDIENTE"}

                </span>

              </div>

              {/* FECHA */}

              <div>

                <p className="
                  text-xs

                  uppercase

                  tracking-[0.12em]

                  text-slate-400

                  font-black
                ">

                  Fecha

                </p>

                <p className="
                  mt-1

                  text-sm

                  font-bold

                  text-slate-700
                ">

                  {formatUTCFechaHora(
                    ingreso.fecha
                  )}

                </p>

              </div>

              {/* PAGO */}

              {ingreso.pagado &&
                ingreso.fecha_pago && (

                  <div>

                    <p className="
                      text-xs

                      uppercase

                      tracking-[0.12em]

                      text-slate-400

                      font-black
                    ">

                      Pago registrado

                    </p>

                    <p className="
                      mt-1

                      text-sm

                      font-bold

                      text-emerald-600
                    ">

                      {formatUTCFechaHora(
                        ingreso.fecha_pago
                      )}

                    </p>

                  </div>

                )}

            </div>

          </div>

          {/* CLIENTE */}

          <div className="
            grid
            grid-cols-1
            md:grid-cols-3

            gap-4
          ">

            {/* PACIENTE */}

            <div className="
              rounded-[24px]

              border
              border-slate-200/70

              bg-slate-50/80

              p-5
            ">

              <p className="
                text-[11px]

                uppercase

                tracking-[0.12em]

                text-slate-400

                font-black
              ">

                Paciente

              </p>

              <p className="
                mt-3

                text-base

                font-black

                text-slate-800
              ">

                {ingreso.cliente?.nombre}{" "}
                {ingreso.cliente?.apellido}

              </p>

            </div>

            {/* METODO */}

            <div className="
              rounded-[24px]

              border
              border-slate-200/70

              bg-slate-50/80

              p-5
            ">

              <p className="
                text-[11px]

                uppercase

                tracking-[0.12em]

                text-slate-400

                font-black
              ">

                Método de pago

              </p>

              <p className="
                mt-3

                text-base

                font-black

                text-slate-800
              ">

                {ingreso.metodo_pago ||
                  "Efectivo"}

              </p>

            </div>

            {/* DOCTOR */}

            <div className="
              rounded-[24px]

              border
              border-slate-200/70

              bg-slate-50/80

              p-5
            ">

              <p className="
                text-[11px]

                uppercase

                tracking-[0.12em]

                text-slate-400

                font-black
              ">

                Doctor

              </p>

              <p className="
                mt-3

                text-base

                font-black

                text-slate-800
              ">

                {ingreso.doctor ||
                  "Clínica Dental"}

              </p>

            </div>

          </div>

          {/* SERVICIOS */}

          <div className="
            overflow-hidden

            rounded-[28px]

            border
            border-slate-200/70
          ">

            {/* HEADER */}

            <div className="
              grid
              grid-cols-[1fr_auto]

              gap-4

              bg-slate-50

              px-6
              py-4

              text-xs

              font-black

              uppercase

              tracking-[0.12em]

              text-slate-400
            ">

              <span>
                Servicios
              </span>

              <span>
                Monto
              </span>

            </div>

            {/* ITEMS */}

            <div className="divide-y">

              {servicios.map((s, i) => (

                <div
                  key={i}
                  className="
                    grid
                    grid-cols-[1fr_auto]

                    gap-4

                    px-6
                    py-5
                  "
                >

                  {/* LEFT */}

                  <div>

                    <p className="
                      text-sm
                      md:text-base

                      font-black

                      text-slate-800
                    ">

                      🦷 {s.descripcion}

                    </p>

                    <p className="
                      mt-1

                      text-xs

                      text-slate-500
                    ">

                      Tratamiento clínico

                    </p>
                    {

                      ingreso?.tratamiento && (

                        <p className="
      mt-1

      text-xs

      font-semibold

      text-sky-700
    ">

                          Sesión {

                            ingreso.tratamiento
                              .sesiones_completadas

                          }

                          de {

                            ingreso.tratamiento
                              .sesiones_totales

                          }

                        </p>

                      )

                    }
                  </div>

                  {/* RIGHT */}

                  <div className="
                    text-right
                  ">

                    <p className="
                      text-base

                      font-black

                      text-slate-800
                    ">

                      {format(s.monto)}

                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* TOTALS */}

          <div className="
            rounded-[28px]

            border
            border-slate-200/70

            bg-gradient-to-br
            from-slate-50
            to-white

            p-6
          ">

            <div className="
              space-y-4
            ">

              {/* SUBTOTAL */}

              <div className="
                flex
                items-center
                justify-between

                text-sm
              ">

                <span className="
                  text-slate-500
                ">

                  Subtotal

                </span>

                <span className="
                  font-bold

                  text-slate-700
                ">

                  {format(subtotal)}

                </span>

              </div>

              {/* ITBIS */}

              <div className="
                flex
                items-center
                justify-between

                text-sm
              ">

                <span className="
                  text-slate-500
                ">

                  ITBIS (18%)

                </span>

                <span className="
                  font-bold

                  text-slate-700
                ">

                  {format(itbis)}

                </span>

              </div>

              {/* DESCUENTO */}

              {descuento > 0 && (

                <div className="
                  flex
                  items-center
                  justify-between

                  text-sm

                  text-rose-500
                ">

                  <span>

                    Descuento ({descuento}%)

                  </span>

                  <span className="
                    font-black
                  ">

                    -{format(descuentoValor)}

                  </span>

                </div>

              )}

              {/* ABONADO */}

              <div className="
                flex
                items-center
                justify-between

                text-sm
              ">

                <span className="
                  text-slate-500
                ">

                  Abonado

                </span>

                <span className="
                  font-bold

                  text-emerald-600
                ">

                  {format(abonado)}

                </span>

              </div>
              {

                ingreso?.tratamiento && (

                  <div className="
      flex
      items-center
      justify-between

      text-sm
    ">

                    <span className="
        text-slate-500
      ">

                      Balance pendiente

                    </span>

                    <span className="
        font-black

        text-amber-500
      ">

                      {format(
                        balanceTratamiento
                      )}

                    </span>

                  </div>

                )

              }
              {/* RESTANTE */}

              {/* {restante > 0 && (

                <div className="
                  flex
                  items-center
                  justify-between

                  text-sm
                ">

                  <span className="
                    text-slate-500
                  ">

                    Restante

                  </span>

                  <span className="
                    font-black

                    text-amber-500
                  ">

                    {format(restante)}

                  </span>

                </div>

              )} */}

              {/* TOTAL */}

              <div className="
                flex
                items-center
                justify-between

                pt-5

                border-t
                border-slate-200
              ">

                <span className="
                  text-lg

                  font-black

                  text-slate-800
                ">

                  Total

                </span>

                <span className="
                  text-3xl

                  font-black

                  
bg-gradient-to-r
from-sky-700
to-sky-900


                  bg-clip-text
                  text-transparent
                ">

                  {format(total)}

                </span>

              </div>

            </div>

          </div>

          {/* FOOTER */}

          <div className="
            text-center

            space-y-2
          ">

            <p className="
              text-sm

              font-semibold

              text-slate-500
            ">

              Gracias por confiar en nosotros 🦷

            </p>

            <p className="
              text-xs

              text-slate-400
            ">

              Documento generado automáticamente por el sistema clínico

            </p>

          </div>

          {/* ACTIONS */}

          <div className="
            flex
            flex-col
            md:flex-row

            gap-3
          ">

            {/* PRINT */}

            <button
              onClick={() => {

                window.modoFactura =
                  "preview";

                generarFactura(
                  ingreso
                );

              }}
              className="
                flex-1

                h-14

                rounded-[22px]

                
bg-gradient-to-r
from-sky-700
via-sky-800
to-sky-900

                text-white

                font-black

                
shadow-[0_15px_35px_rgba(7,89,133,0.28)]

hover:shadow-[0_20px_45px_rgba(7,89,133,0.35)]


                hover:-translate-y-[2px]

                transition-all
                duration-300
              "
            >

              🖨 Ver / Imprimir

            </button>

            {/* WHATSAPP */}

            <button
              onClick={async () => {

                window.modoFactura =
                  "whatsapp";

                await generarFactura(
                  ingreso
                );

              }}

              className="
    flex-1

    h-14

    rounded-[22px]

    bg-emerald-500

    text-white

    font-black

    shadow-[0_15px_35px_rgba(16,185,129,0.25)]

    hover:bg-emerald-600

    hover:-translate-y-[2px]

    transition-all
    duration-300
  "
            >
              💬 WhatsApp
            </button>

            {/* CLOSE */}

            <button
              onClick={onClose}
              className="
                h-14

                px-6

                rounded-[22px]

                bg-rose-500

                text-white

                font-black

                hover:bg-rose-600

                transition-all
                duration-300
              "
            >

              ✖ Cerrar

            </button>

          </div>

        </div>

      </div>

    </div>

  );

}

export default FacturaModal;