import { useState } from "react";
import PageWrapper from "../components/PageWrapper";
import ConfirmModal from "../components/ConfirmModal";
import toast from "react-hot-toast";

function SettingsPage() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nuevoPassword, setNuevoPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const USER_ID = 1;

  // ✅ FORMATEO BOTÓN
  const btn = `
    w-full py-2 rounded-lg text-white font-medium
    transition hover:scale-[1.02]
  `;

  // ✅ GUARDAR USUARIO
  const guardarUsuario = async () => {

    if (!username.trim()) {
      return toast.error("Usuario vacío ❌");
    }

    try {
      setLoading(true);

      const res = await fetch(`http://127.0.0.1:8000/users/${USER_ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password: password || "temp1234"
        })
      });

      const data = await res.json();

      if (!res.ok) {
        return toast.error(data.detail || "Error ❌");
      }

      toast.success("Usuario actualizado ✅");

      // ✅ limpiar opcional
      setPassword("");

    } catch {
      toast.error("Error del servidor ❌");
    } finally {
      setLoading(false);
    }
  };

  // ✅ VALIDAR CAMBIO PASSWORD
  const cambiarPassword = () => {

    if (!password || !nuevoPassword) {
      return toast.error("Completa los campos ❌");
    }

    if (nuevoPassword.length < 6) {
      return toast.error("Mínimo 6 caracteres ⚠️");
    }

    setMostrarConfirmacion(true);
  };

  // ✅ CONFIRMAR
  const confirmarCambioPassword = async () => {

    try {
      setLoading(true);

      const res = await fetch(`http://127.0.0.1:8000/users/${USER_ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password: nuevoPassword
        })
      });

      const data = await res.json();

      if (!res.ok) {
        return toast.error(data.detail || "Error ❌");
      }

      toast.success("Contraseña actualizada 🔒");

      setPassword("");
      setNuevoPassword("");
      setMostrarConfirmacion(false);

    } catch {
      toast.error("Error del servidor ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>

      <div className="max-w-3xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">
            Configuración ⚙️
          </h1>

          <p className="text-gray-500 text-sm">
            Administra tu cuenta y seguridad
          </p>
        </div>


        {/* ✅ USUARIO */}
        <div className="bg-white p-6 rounded-xl shadow border space-y-4">

          <h2 className="font-semibold text-lg flex items-center gap-2">
            👤 Usuario
          </h2>

          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="
              w-full border px-4 py-2 rounded-lg
              focus:ring-2 focus:ring-blue-500 outline-none
            "
          />

          <button
            onClick={guardarUsuario}
            disabled={loading}
            className={`${btn} ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
              }`}
          >
            {loading ? "Guardando..." : "💾 Guardar usuario"}
          </button>

        </div>

        {/* ✅ SEGURIDAD */}
        <div className="bg-white p-6 rounded-xl shadow border space-y-4">

          <h2 className="font-semibold text-lg flex items-center gap-2">
            🔒 Seguridad
          </h2>

          <input
            type="password"
            placeholder="Contraseña actual"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full border px-4 py-2 rounded-lg
              focus:ring-2 focus:ring-green-500 outline-none
            "
          />

          <input
            type="password"
            placeholder="Nueva contraseña"
            value={nuevoPassword}
            onChange={(e) => setNuevoPassword(e.target.value)}
            className="
              w-full border px-4 py-2 rounded-lg
              focus:ring-2 focus:ring-green-500 outline-none
            "
          />

          <button
            onClick={cambiarPassword}
            disabled={loading}
            className={`${btn} ${loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
              }`}
          >
            {loading ? "Aplicando..." : "🔐 Cambiar contraseña"}
          </button>

        </div>

      </div>

      {/* ✅ MODAL */}
      {mostrarConfirmacion && (
        <ConfirmModal
          mensaje="¿Seguro que quieres cambiar la contraseña? ⚠️"
          onConfirm={confirmarCambioPassword}
          onCancel={() => setMostrarConfirmacion(false)}
        />
      )}

    </PageWrapper>
  );
}

export default SettingsPage;