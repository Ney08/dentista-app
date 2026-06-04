import { formatFecha } from "../../utils/fecha";
import { useState } from "react";
import ConfirmModal from "../ConfirmModal";

function IngresoList({
  facturas,
  porPagina,
  onVerFactura,
  onEditar,
  onPagar
}) {

  const [ingresoAPagar, setIngresoAPagar] = useState(null);

  return (
    <div
      className={`
        space-y-3 pr-2
        
${facturas.length > 10
          ? "max-h-[820px] overflow-y-auto"
          : ""
        }

      `}
    >

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
            className="
              group flex items-center justify-between gap-4
              bg-white border border-gray-200 rounded-xl px-4 py-3
              hover:bg-gray-50 hover:shadow-sm
              transition cursor-pointer
            "
          >

            {/* ✅ IZQUIERDA */}
            <div className="flex items-center gap-3">

              <div className="
                w-9 h-9 rounded-full bg-blue-500 text-white
                flex items-center justify-center text-xs font-semibold
              ">
                {letra}
              </div>

              <div className="leading-tight space-y-1">

                <div className="flex items-center gap-2 flex-wrap">

                  <p className="text-sm font-semibold text-gray-800">
                    {i.cliente?.nombre} {i.cliente?.apellido}
                  </p>

                  <span
                    className={`
                      text-[10px] px-2 py-[2px] rounded-full font-medium
                      ${i.pagado
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"}
                    `}
                  >
                    {i.pagado ? "Pagado" : "Pendiente"}
                  </span>

                </div>

                <p className="text-xs text-gray-500">
                  {formatFecha(i.created_at)}
                </p>

              </div>

            </div>

            {/* ✅ DERECHA */}
            <div className="flex items-center gap-3">

              <span className="text-sm font-semibold text-green-600">
                RD$ {total.toFixed(2)}
              </span>

              <div
                onClick={(e) => e.stopPropagation()}
                className="
                  flex items-center gap-1
                  opacity-0 group-hover:opacity-100
                  transition
                "
              >

                <button
                  onClick={() => onVerFactura(i)}
                  disabled={!i.pagado}
                  className={`
                    p-2 rounded-md transition
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
                    p-2 rounded-md transition
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
                    p-2 rounded-md transition
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
            onPagar(ingresoAPagar.id);
            setIngresoAPagar(null);
          }}
          onCancel={() => setIngresoAPagar(null)}
        />
      )}

    </div>
  );
}

export default IngresoList;