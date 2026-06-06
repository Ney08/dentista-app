import { useEffect, useState } from "react";

function EgresoModal({ egreso, onGuardar, onClose }) {

  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [monto, setMonto] = useState("");
  const [metodoPago, setMetodoPago] = useState("");
  const [observacion, setObservacion] = useState("");

  const isEdit = !!egreso;

  useEffect(() => {

    if (!egreso) return;

    setDescripcion(egreso.descripcion || "");
    setCategoria(egreso.categoria || "");
    setMonto(egreso.monto || "");
    setMetodoPago(egreso.metodo_pago || "");
    setObservacion(egreso.observacion || "");

  }, [egreso]);

  const guardar = () => {

    if (!descripcion.trim()) return;
    if (!monto) return;

    onGuardar({
      ...(egreso || {}),
      descripcion,
      categoria,
      monto: parseFloat(monto),
      metodo_pago: metodoPago,
      observacion
    });

  };

  return (

    <div
      onClick={onClose}
      className="bg-white rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] w-full overflow-hidden"
    >

      <div
        onClick={(e) => e.stopPropagation()}
        className="p-5 sm:p-7"
      >

        {/* HEADER */}
        <div className="text-center mb-7">

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            {isEdit ? "Editar egreso 💸" : "Nuevo egreso 💸"}
          </h2>

          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Registra un gasto del negocio
          </p>

        </div>

        {/* FORM */}
        <div className="space-y-5">

          {/* DESCRIPCIÓN */}
          <div className="space-y-2">

            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Información básica
            </p>

            <input
              type="text"
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full h-14 rounded-2xl border border-gray-300 px-4 text-sm sm:text-base outline-none focus:ring-4 focus:ring-red-100 focus:border-red-400 transition-all duration-200"
            />

          </div>

          {/* CATEGORÍA */}
          <div className="space-y-2">

            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Categoría
            </p>

            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full h-14 rounded-2xl border border-gray-300 px-4 text-sm sm:text-base outline-none focus:ring-4 focus:ring-red-100 focus:border-red-400 transition-all duration-200"
            >

              <option value="">Selecciona categoría</option>
              <option value="Materiales">Materiales</option>
              <option value="Nómina">Nómina</option>
              <option value="Internet">Internet</option>
              <option value="Luz">Luz</option>
              <option value="Publicidad">Publicidad</option>
              <option value="Transporte">Transporte</option>
              <option value="Otros">Otros</option>

            </select>

          </div>

          {/* MONTO + MÉTODO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            <div className="space-y-2">

              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Monto
              </p>

              <input
                type="number"
                placeholder="Monto"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                className="w-full h-14 rounded-2xl border border-gray-300 px-4 text-sm sm:text-base outline-none focus:ring-4 focus:ring-red-100 focus:border-red-400 transition-all duration-200"
              />

            </div>

            <div className="space-y-2">

              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Método pago
              </p>

              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                className="w-full h-14 rounded-2xl border border-gray-300 px-4 text-sm sm:text-base outline-none focus:ring-4 focus:ring-red-100 focus:border-red-400 transition-all duration-200"
              >

                <option value="">Selecciona método</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Tarjeta">Tarjeta</option>

              </select>

            </div>

          </div>

          {/* OBSERVACIÓN */}
          <div className="space-y-2">

            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Observación
            </p>

            <textarea
              rows={4}
              placeholder="Observación adicional..."
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 px-4 py-4 text-sm sm:text-base resize-none outline-none focus:ring-4 focus:ring-red-100 focus:border-red-400 transition-all duration-200"
            />

          </div>

        </div>

        {/* BOTONES */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8">

          <button
            onClick={guardar}
            className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-semibold shadow-lg shadow-red-200/50 transition-all duration-200 hover:scale-[1.01] active:scale-[0.98]"
          >
            {isEdit ? "Guardar cambios" : "Crear egreso"}
          </button>

          <button
            onClick={onClose}
            className="flex-1 h-14 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all duration-200 active:scale-[0.98]"
          >
            Cancelar
          </button>

        </div>

      </div>

    </div>

  );

}

export default EgresoModal;