import { useState } from "react";
import toast from "react-hot-toast";
import { API_URL } from "../../config";

function HistorialForm({ clienteId, onAdd }) {
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ GUARDAR
  const guardar = async () => {

    if (!texto.trim()) {
      toast.error("Escribe una nota clínica ⚠️");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Guardando historial...");

    try {
      const res = await fetch(`${API_URL}/historiales/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          cliente_id: clienteId,
          descripcion: texto
        })
      });

      if (!res.ok) throw new Error();

      toast.success("Historial guardado ✅", { id: toastId });

      setTexto("");
      onAdd(); // ✅ recargar lista

    } catch {
      toast.error("Error al guardar ❌", { id: toastId });
    }

    setLoading(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-4 shadow-sm">


      {/* ✅ TITULO */}
      <h3 className="font-semibold text-xl sm:text-lg tracking-tight">
        Agregar nota clínica 🦷
      </h3>

      {/* ✅ TEXTAREA */}
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Ej: Paciente presenta dolor en molar 16..."
        rows={3}
        className="
  w-full border border-gray-200
  px-4 py-3

  rounded-2xl

  text-base sm:text-sm

  focus:outline-none
  focus:ring-2 focus:ring-blue-400
  focus:border-blue-400

  resize-none
  transition

  min-h-[110px]
"
      />

      {/* ✅ BOTÓN */}
      <button
        onClick={guardar}
        disabled={loading}
        className={`w-full h-12 rounded-2xl text-white text-sm sm:text-base font-semibold shadow-sm transition active:scale-[0.98] ${
          loading
            ? "bg-gray-400"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {loading ? "Guardando..." : "Guardar historial"}
      </button>

    </div>
  );
}

export default HistorialForm;