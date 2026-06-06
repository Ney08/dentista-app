import { formatFecha } from "../../utils/fecha";
import { useState } from "react";
import ConfirmModal from "../ConfirmModal";
import { formatMoney } from "../../utils/format";

function IngresoList({ facturas, porPagina, onVerFactura, onEditar, onPagar }) {

  const [ingresoAPagar, setIngresoAPagar] = useState(null);

  return (

    <div className="h-full space-y-2 sm:space-y-3 overflow-y-auto overflow-x-hidden pr-1 pb-2">

      {facturas.map((i) => {

        const subtotal = (i.servicios || []).reduce((a, s) => a + s.monto, 0);
        const itbis = subtotal * 0.18;
        const descuento = i.descuento || 0;
        const descuentoValor = subtotal * (descuento / 100);
        const total = subtotal + itbis - descuentoValor;

        const letra = i.cliente?.nombre?.charAt(0)?.toUpperCase();

        return (

          <div
            key={i.id}
            className="group bg-white border border-gray-200 hover:border-green-100 rounded-2xl p-4 shadow-sm hover:shadow-lg hover:-translate-y-[1px] transition-all duration-200"
          >

            <div className="flex items-center justify-between gap-3">

              {/* LEFT */}
              <div className="flex items-center gap-3 min-w-0 flex-1">

                {/* AVATAR */}
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold shrink-0">
                  {letra}
                </div>

                {/* INFO */}
                <div className="leading-tight space-y-1 min-w-0">

                  <div className="flex items-center gap-2 flex-wrap">

                    <p className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                      {i.cliente?.nombre} {i.cliente?.apellido}
                    </p>

                    <span className={`text-[11px] px-2 py-1 rounded-full font-medium ${i.pagado ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {i.pagado ? "Pagado" : "Pendiente"}
                    </span>

                  </div>

                  <p className="text-xs md:text-sm text-gray-500">
                    {formatFecha(i.created_at)}
                  </p>

                </div>

              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-3 shrink-0">

                {/* TOTAL */}
                <p className="text-lg font-bold text-green-600 whitespace-nowrap transition-all duration-200 group-hover:scale-[1.02]">
                  RD$ {formatMoney(total)}
                </p>

                {/* ACTIONS */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 opacity-100 md:opacity-20 md:group-hover:opacity-100 transition-all duration-300"
                >

                  {/* FACTURA */}
                  {i.pagado && (

                    <button
                      onClick={() => onVerFactura(i)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-300 hover:text-blue-500 hover:bg-blue-50 hover:scale-110 active:scale-95 transition-all duration-200"
                      title="Ver factura"
                    >
                      📄
                    </button>

                  )}

                  {/* EDITAR */}
                  {!i.pagado && (

                    <button
                      onClick={() => onEditar(i)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-yellow-300 hover:text-yellow-500 hover:bg-yellow-50 hover:scale-110 active:scale-95 transition-all duration-200"
                      title="Editar"
                    >
                      ✏️
                    </button>

                  )}

                  {/* PAGAR */}
                  {!i.pagado && (

                    <button
                      onClick={() => setIngresoAPagar(i)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-purple-300 hover:text-purple-500 hover:bg-purple-50 hover:scale-110 active:scale-95 transition-all duration-200"
                      title="Marcar pagado"
                    >
                      💳
                    </button>

                  )}

                </div>

              </div>

            </div>

          </div>

        );

      })}

      {/* MODAL */}
      {ingresoAPagar && (

        <ConfirmModal
          mensaje={`¿Confirmar pago de ${ingresoAPagar.cliente?.nombre}?`}
          onConfirm={() => {
            onPagar(ingresoAPagar);
            setIngresoAPagar(null);
          }}
          onCancel={() => setIngresoAPagar(null)}
        />

      )}

    </div>

  );

}

export default IngresoList;