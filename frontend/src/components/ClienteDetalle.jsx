import { useEffect, useState } from "react";
import HistorialForm from "./HistorialForm";

function ClienteDetalle({ cliente }) {

  const [historial, setHistorial] = useState([]);

  // ✅ cargar historial
  const cargarHistorial = async () => {
    const res = await fetch(
      `http://127.0.0.1:8000/clientes/${cliente.id}/historial`
    );

    const data = await res.json();
    setHistorial(data);
  };

  // ✅ cuando abre el cliente
  useEffect(() => {
    if (cliente?.id) {
      cargarHistorial();
    }
  }, [cliente]);

  return (
    <div className="space-y-4">

      <h2 className="text-xl font-bold">
        Historial de {cliente.nombre}
      </h2>

      {/* ✅ FORM PARA AGREGAR */}
      <HistorialForm
        clienteId={cliente.id}
        onAdd={cargarHistorial}
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