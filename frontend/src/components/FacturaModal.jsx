import { generarFactura } from "../utils/pdf";

function FacturaModal({ ingreso, onClose }) {

  const servicios = ingreso.servicios || [];

  const subtotal = servicios.reduce((acc, s) => acc + s.monto, 0);
  const itbis = subtotal * 0.18;
  const total = subtotal + itbis;

  const format = (n) => `RD$ ${n.toFixed(2)}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">

      <div className="factura-print bg-white p-6 w-full max-w-md rounded-xl shadow-xl space-y-5">

        {/* HEADER */}
        <div className="flex justify-between text-sm text-gray-500">
          <span>{new Date().toLocaleDateString()}</span>
          <span>Factura</span>
        </div>

        {/* TÍTULO */}
        <h2 className="text-2xl font-bold text-center">
          Factura #{ingreso.id}
        </h2>

        <hr />

        {/* CLIENTE */}
        <div>
          <p className="text-sm text-gray-500">Cliente</p>
          <p className="font-semibold">
            {ingreso.cliente?.nombre} {ingreso.cliente?.apellido}
          </p>
        </div>

        <hr />

        {/* SERVICIOS */}
        <div>

          <div className="flex justify-between font-semibold text-gray-700 text-sm">
            <span>Servicio</span>
            <span>Precio</span>
          </div>

          <div className="border-t my-2"></div>

          <div className="space-y-1">
            {servicios.map((s, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-700">{s.descripcion}</span>
                <span className="font-medium">{format(s.monto)}</span>
              </div>
            ))}
          </div>

        </div>

        <hr />

        {/* TOTALES */}
        <div className="space-y-2 text-sm">

          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>{format(subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">ITBIS (18%)</span>
            <span>{format(itbis)}</span>
          </div>

          <div className="flex justify-between border-t pt-2 text-lg font-bold text-green-600">
            <span>Total</span>
            <span>{format(total)}</span>
          </div>

        </div>

        {/* FOOTER */}
        <p className="text-center text-gray-500 text-sm pt-2">
          Gracias por su visita
        </p>

        {/* BOTONES */}
        <div className="no-print flex gap-3 pt-4 justify-center">

          {/* IMPRIMIR */}
          <button
            onClick={() => {
              window.modoFactura = "preview";
              generarFactura(ingreso);
            }}
            className="
              flex items-center gap-2
              bg-blue-500 hover:bg-blue-600
              text-white px-4 py-2 rounded-lg
              shadow
            "
          >
            🖨 Ver / Imprimir
          </button>

          {/* PDF */}
          <button
            onClick={() => {
              window.modoFactura = "download";
              generarFactura(ingreso);
            }}
            className="
              flex items-center gap-2
              bg-green-500 hover:bg-green-600
              text-white px-4 py-2 rounded-lg
              shadow
            "
          >
            ⬇ Descargar
          </button>

          {/* CERRAR */}
          <button
            onClick={onClose}
            className="
              bg-gray-400 hover:bg-gray-500
              text-white px-4 py-2 rounded-lg
            "
          >
            ✖
          </button>

        </div>

      </div>

    </div>
  );
}

export default FacturaModal;
