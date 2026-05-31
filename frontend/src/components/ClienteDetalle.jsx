import HistorialForm from "./HistorialForm";
import { useHistorial } from "../hooks/useHistorial";

function ClienteDetalle({ cliente }) {

  const { historial, isLoading, crearHistorial } = useHistorial(cliente?.id);

  // ✅ loading
  if (!cliente?.id) {
    return <p>Selecciona un cliente...</p>;
  }

  if (isLoading) {
    return <p>Cargando historial...</p>;
  }

  return (
    <div className="space-y-4">

      <h2 className="text-xl font-bold">
        Historial de {cliente.nombre}
      </h2>

      {/* ✅ FORM */}
      <HistorialForm
        clienteId={cliente.id}
        onAdd={(data) => crearHistorial.mutate(data)}
      />

      {/* ✅ LISTA */}
      {historial.length === 0 ? (
        <p>No hay historial...</p>
      ) : (
        historial.map((h) => (
          <div key={h.id} className="border p-2 rounded">
            <p>{h.descripcion}</p>
            <small>
              {new Date(h.fecha).toLocaleDateString()}
            </small>
          </div>
        ))
      )}

    </div>
  );
}

export default ClienteDetalle;