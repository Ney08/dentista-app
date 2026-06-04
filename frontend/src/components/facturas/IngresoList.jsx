import { formatFecha } from "../../utils/fecha";
import { useState } from "react";
import ConfirmModal from "../ConfirmModal";
import { formatMoney } from "../../utils/format";

function IngresoList({
  facturas,
  porPagina,
  onVerFactura,
  onEditar,
  onPagar
}) {

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
            className="group flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 bg-white border border-gray-200 rounded-2xl px-3 sm:px-4 py-3 sm:py-4 hover:bg-gray-50 hover:shadow-sm transition"
          >

            {/* ✅ IZQUIERDA */}
            <div className="flex items-center gap-3 min-w-0 flex-1">

              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold shrink-0">
                {letra}
              </div>

              <div className="leading-tight space-y-1 min-w-0">

                <div className="flex items-center gap-2 flex-wrap">

                  <p className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                    {i.cliente?.nombre} {i.cliente?.apellido}
                  </p>

                  <span
                    className={`
                      text-[11px] px-2 py-1 rounded-full font-medium
                      ${i.pagado
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"}
                    `}
                  >
                    {i.pagado ? "Pagado" : "Pendiente"}
                  </span>

                </div>

                <p className="text-xs md:text-sm text-gray-500">
                  {formatFecha(i.created_at)}
                </p>

              </div>

            </div>

            {/* ✅ DERECHA */}
            <div className="flex items-center justify-between lg:justify-end gap-3 w-full lg:w-auto pt-1 lg:pt-0">

              <span className="text-lg sm:text-xl lg:text-base font-bold text-green-600 whitespace-nowrap">
                RD$ {formatMoney(total)}
              </span>



              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition"
              >



                <button
                  onClick={() => onVerFactura(i)}
                  disabled={!i.pagado}
                  className={`
                    p-2.5 sm:p-2 rounded-md transition
                    ${i.pagado
                      ? "text-blue-500 hover:bg-blue-100"
                      : "text-gray-400 cursor-not-allowed"}
                  `}
                  title="Ver factura"
                >
                  📄
                </button>

                <button
                  onClick={() => onEditar(i)}
                  disabled={i.pagado}
                  className={`
                    p-2.5 sm:p-2 rounded-md transition
                    ${i.pagado
                      ? "text-gray-400"
                      : "text-yellow-500 hover:bg-yellow-100"}
                  `}
                  title="Editar"
                >
                  ✏️
                </button>

                <button
                  onClick={() => setIngresoAPagar(i)}
                  disabled={i.pagado}
                  className={`
                    p-2.5 sm:p-2 rounded-md transition
                    ${i.pagado
                      ? "text-gray-400"
                      : "text-purple-500 hover:bg-purple-100"}
                  `}
                  title="Marcar pagado"
                >
                  💳
                </button>

              </div>

            </div>

          </div>
        );
      })}

      {/* ✅ MODAL */}
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