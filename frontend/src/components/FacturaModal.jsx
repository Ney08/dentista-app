import { generarFactura } from "../utils/pdf";
import { formatFecha, formatHora, parseFechaLocal } from "../utils/fecha";

function FacturaModal({ ingreso, onClose }) {

  if (!ingreso) return null;

  const servicios = ingreso.servicios || [];

  const subtotal = servicios.reduce((acc, s) => acc + s.monto, 0);
  const itbis = subtotal * 0.18;

  // ✅ descuento
  const descuento = ingreso.descuento || 0;
  const descuentoValor = subtotal * (descuento / 100);

  const total = subtotal + itbis - descuentoValor;

  const format = (n) => `RD$ ${n.toFixed(2)}`;

  return (
    <div
      className="
        fixed inset-0 z-50 flex items-center justify-center
        bg-black/40 backdrop-blur-md
        transition-all duration-200 ease-out
      "
      onClick={onClose}
    >

      {/* CAJA */}
      <div
        className="
          factura-print bg-white w-full max-w-md p-6
          rounded-2xl shadow-xl space-y-6
          transform transition-all duration-200 ease-out
          scale-100 opacity-100
        "
        onClick={(e) => e.stopPropagation()}
      >

        {/* HEADER */}
        <div className="flex justify-between text-sm text-gray-500">
          <span>{formatFecha(new Date())}</span>
          <span>Factura</span>
        </div>

        {/* TÍTULO */}
        <h2 className="text-2xl font-semibold text-center tracking-tight">
          Factura #{ingreso.id}
        </h2>

        <hr />

        {/* CLIENTE */}
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Cliente
          </p>
          <p className="font-medium text-gray-800">
            {ingreso.cliente?.nombre} {ingreso.cliente?.apellido}
          </p>
        </div>

        {/* ✅ NUEVO: INFO DE PAGO */}
        {ingreso.pagado && ingreso.fecha_pago && (
          <div className="text-sm text-gray-500 bg-green-50 border border-green-200 p-3 rounded-lg">
            <p className="font-semibold text-green-600 mb-1">
              ✅ Pago registrado
            </p>
            <p>📅 {formatFecha(ingreso.fecha_pago)}</p>
            <p>⏰ {formatHora(ingreso.fecha_pago)}</p>
          </div>
        )}

        <hr />

        {/* SERVICIOS */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-gray-500 uppercase">
            <span>Servicio</span>
            <span>Monto</span>
          </div>

          <div className="border-t"></div>

          {servicios.map((s, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-gray-700">{s.descripcion}</span>
              <span className="font-medium">{format(s.monto)}</span>
            </div>
          ))}
        </div>

        <hr />

        {/* TOTALES */}
        <div className="space-y-1 text-sm">

          <div className="flex justify-between">
            <span className="text-gray-500">Subtotal</span>
            <span>{format(subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">ITBIS (18%)</span>
            <span>{format(itbis)}</span>
          </div>

          {/* ✅ DESCUENTO */}
          {descuento > 0 && (
            <div className="flex justify-between text-red-500">
              <span>Descuento ({descuento}%)</span>
              <span>-{format(descuentoValor)}</span>
            </div>
          )}

          <div className="flex justify-between text-lg font-bold text-green-600 pt-2 border-t">
            <span>Total</span>
            <span>{format(total)}</span>
          </div>

        </div>

        {/* FOOTER */}
        <p className="text-center text-gray-400 text-sm">
          Gracias por su visita
        </p>

        {/* BOTONES (INTACTOS ✅) */}
        <div className="flex flex-col gap-2">

          <button
            onClick={() => {
              window.modoFactura = "preview";
              generarFactura(ingreso);
            }}
            className="
              w-full bg-blue-500 hover:bg-blue-600
              text-white py-2.5 rounded-xl
              shadow-sm transition
            "
          >
            🖨 Ver / Imprimir
          </button>

          <button
            onClick={() => {
              window.modoFactura = "download";
              generarFactura(ingreso);
            }}
            className="
              w-full bg-green-500 hover:bg-green-600
              text-white py-2.5 rounded-xl
              shadow-sm transition
            "
          >
            ⬇ Descargar PDF
          </button>

          <button
            onClick={onClose}
            className="
              w-full bg-red-500 hover:bg-red-600
              text-white py-2.5 rounded-xl
              transition
            "
          >
            ✖ Cerrar
          </button>

        </div>

      </div>
    </div>
  );
}

export default FacturaModal;