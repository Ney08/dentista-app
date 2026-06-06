import { useState, useEffect } from "react";

function ServicioModal({ servicio, onGuardar, onClose }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");

  const [costoServicio, setCostoServicio] = useState("");

  const isEdit = !!servicio;

  useEffect(() => {
    if (servicio) {
      setNombre(servicio.nombre || "");
      setDescripcion(servicio.descripcion || "");
      setPrecio(servicio.precio || "");

      setCostoServicio(servicio.costo_servicio || "");

    }
  }, [servicio]);

  const guardar = () => {
    if (!nombre || !precio) return;

    onGuardar({
      ...(servicio || {}),
      nombre,
      descripcion,
      precio: parseFloat(precio),
      costo_servicio: parseFloat(costoServicio || 0)
    });
  };

  return (
    <div
      onClick={onClose}
      className="
        fixed inset-0 z-50 flex items-center justify-center
        bg-black/40 backdrop-blur-sm
      "
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          bg-white rounded-xl shadow-2xl p-6 w-full max-w-md
          transform transition-all duration-200
          scale-100
        "
      >
        <h2 className="text-lg font-bold mb-4 text-center">
          {isEdit ? "✏️ Editar servicio" : "➕ Nuevo servicio"}
        </h2>

        <div className="space-y-3">

          <input
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="input w-full"
          />

          <input
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="input w-full"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            <input
              type="number"
              placeholder="Precio"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="input w-full"
            />

            <input
              type="number"
              placeholder="Costo del servicio"
              value={costoServicio}
              onChange={(e) =>
                setCostoServicio(e.target.value)
              }
              className="input w-full"
            />

          </div>
        </div>

        <div className="flex gap-2 mt-5">

          <button
            onClick={guardar}
            className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Guardar
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
          >
            Cancelar
          </button>

        </div>

      </div>
    </div>
  );
}

export default ServicioModal;