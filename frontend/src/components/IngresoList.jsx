import { formatFecha } from "../utils/fecha";

function IngresoList({
  facturas,
  porPagina,
  onVerFactura,
  onEditar,
  onPagar
}) {
  return (

    <div
      className={`
        space-y-4 pr-2
        ${porPagina > 5 && facturas.length > 5
          ? "max-h-90 overflow-y-auto"
          : ""
        }
      `}
    >

      {facturas.map(i => {

        const subtotal = (i.servicios || []).reduce((a, s) => a + s.monto, 0);
        const itbis = subtotal * 0.18;

        const descuento = i.descuento || 0;
        const descuentoValor = subtotal * (descuento / 100);

        const total = subtotal + itbis - descuentoValor;

        return (
          <div
            key={i.id}
            className="
              flex justify-between items-center p-4 border rounded-xl
              transition hover:shadow-md hover:-translate-y-0.5 border-gray-200 border-l-4 border-blue-500
            "
          >

            {/* INFO */}
            <div>
              <p className="font-semibold">
                {i.cliente?.nombre} {i.cliente?.apellido}
              </p>

              <p className="text-sm text-gray-500">
                {formatFecha(i.created_at)}
              </p>
            </div>

            {/* DERECHA */}
            <div className="flex items-center gap-2">

              <span className={`px-3 py-1 text-xs rounded-full ${
                i.pagado
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}>
                {i.pagado ? "Pagado" : "Pendiente"}
              </span>

              <span className="font-bold text-green-600">
                RD$ {total.toFixed(2)}
              </span>

              <button
                onClick={() => onVerFactura(i)}
                disabled={!i.pagado}
                className={`px-2 rounded ${
                  i.pagado
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                📄
              </button>

              <button
                onClick={() => onEditar(i)}
                disabled={i.pagado}
                className={`px-2 rounded ${
                  i.pagado
                    ? "bg-gray-300 text-gray-500"
                    : "bg-yellow-500 text-white"
                }`}
              >
                ✏️
              </button>

              <button
                onClick={() => onPagar(i)}
                disabled={i.pagado}
                className={`px-2 rounded ${
                  i.pagado
                    ? "bg-gray-300 text-gray-500"
                    : "bg-purple-500 text-white"
                }`}
              >
                💳
              </button>

            </div>

          </div>
        );

      })}

    </div>
  );
}

export default IngresoList;