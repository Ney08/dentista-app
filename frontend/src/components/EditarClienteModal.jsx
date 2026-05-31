import { useState } from "react";
import toast from "react-hot-toast";
import { useClientes } from "../hooks/useClientes"; // ✅ react-query

function EditarClienteModal({ cliente, onCancel }) {

  const { editarCliente } = useClientes(); // ✅ mutation

  const [nombre, setNombre] = useState(cliente.nombre || "");
  const [apellido, setApellido] = useState(cliente.apellido || "");
  const [cedula, setCedula] = useState(cliente.cedula || "");
  const [telefono, setTelefono] = useState(cliente.telefono || "");
  const [direccion, setDireccion] = useState(cliente.direccion || "");

  const [loading, setLoading] = useState(false);

  // ✅ GUARDAR CON REACT QUERY
  const guardar = async () => {

    if (!nombre || !apellido) {
      toast.error("Nombre y apellido son requeridos ❌");
      return;
    }

    try {
      setLoading(true);

      await editarCliente.mutateAsync({
        id: cliente.id,
        data: {
          nombre,
          apellido,
          cedula,
          telefono,
          direccion
        }
      });

      toast.success("Cliente actualizado ✅");

      onCancel(); // cerrar modal

    } catch {
      toast.error("Error al actualizar ❌");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4">

      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-5 space-y-4">

        <h2 className="text-lg font-semibold">
          Editar Cliente ✏️
        </h2>

        <div className="space-y-3">

          <input
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Nombre"
            className="w-full border px-3 py-2 rounded"
          />

          <input
            value={apellido}
            onChange={e => setApellido(e.target.value)}
            placeholder="Apellido"
            className="w-full border px-3 py-2 rounded"
          />

          <input
            value={cedula}
            onChange={e => setCedula(e.target.value)}
            placeholder="Cédula"
            className="w-full border px-3 py-2 rounded"
          />

          <input
            value={telefono}
            onChange={e => setTelefono(e.target.value)}
            placeholder="Teléfono"
            className="w-full border px-3 py-2 rounded"
          />

          <input
            value={direccion}
            onChange={e => setDireccion(e.target.value)}
            placeholder="Dirección"
            className="w-full border px-3 py-2 rounded"
          />

        </div>

        <div className="flex gap-2">

          <button
            onClick={guardar}
            disabled={loading}
            className={`flex-1 py-2 rounded text-white ${
              loading
                ? "bg-gray-400"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {loading ? "Guardando..." : "Guardar ✅"}
          </button>

          <button
            onClick={onCancel}
            className="flex-1 py-2 bg-gray-400 text-white rounded"
          >
            Cancelar
          </button>

        </div>

      </div>

    </div>
  );
}

export default EditarClienteModal;