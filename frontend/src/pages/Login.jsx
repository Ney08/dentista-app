import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";


function Login() {

  const { login: loginRequest, resetPassword } = useAuth();

  // ✅ LOGIN
  const [username, setUsername] = useState(
    localStorage.getItem("lastUser") || ""
  );

  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [recordar, setRecordar] = useState(true);
  const [loading, setLoading] = useState(false);

  // ✅ MODAL RECUPERACIÓN
  const [mostrarRecovery, setMostrarRecovery] = useState(false);
  const [claveSeguridad, setClaveSeguridad] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [claveValida, setClaveValida] = useState(false);

  const CLAVE_SEGURIDAD = "1234";

  useEffect(() => {
    if (!claveSeguridad) {
      setClaveValida(false);
      return;
    }
    setClaveValida(claveSeguridad === CLAVE_SEGURIDAD);
  }, [claveSeguridad]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") cerrarModal();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // ✅ LOGIN (ACTUALIZADO)
  const login = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error("Completa los campos ❌");
      return;
    }

    setLoading(true);

    try {
      const token = await loginRequest(username, password);

      // ✅ solo guardas si quieres persistencia extra
      if (recordar) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }

      localStorage.setItem("lastUser", username);

      toast.success(`Bienvenido ${username} ✅`);

    } catch (error) {
      console.error(error);
      toast.error(error.message);
      setPassword("");
    } finally {
      setLoading(false);
    }
  };


  const recuperarPassword = async () => {
    if (!username.trim()) {
      toast.error("Escribe el usuario ⚠️");
      return;
    }

    if (!claveValida) {
      toast.error("Clave inválida ❌");
      return;
    }

    if (nuevaPassword.length < 4) {
      toast.error("Mínimo 4 caracteres ⚠️");
      return;
    }

    setLoading(true);

    try {
      await resetPassword(username, nuevaPassword);

      toast.success("Contraseña cambiada ✅");

      setNuevaPassword("");
      setClaveSeguridad("");
      cerrarModal();

    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ CERRAR MODAL
  const cerrarModal = () => {
    setMostrarRecovery(false);
    setClaveSeguridad("");
    setNuevaPassword("");
    setClaveValida(false);
  };

  return (
    <>
      {/* ✅ LOGIN */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 px-4">

        <form
          onSubmit={login}
          className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md space-y-5"
        >

          <div className="text-center">
            <h2 className="text-2xl font-bold">Login 🔐</h2>
            <p className="text-gray-500 text-sm">Accede a tu sistema</p>
          </div>

          {/* USER */}
          <input
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={mostrarPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="button"
              onClick={() => setMostrarPassword(!mostrarPassword)}
              className="absolute right-3 top-2"
            >
              👁️
            </button>
          </div>

          {/* OPCIONES */}
          <div className="flex justify-between text-sm">

            <label>
              <input
                type="checkbox"
                checked={recordar}
                onChange={() => setRecordar(!recordar)}
              /> Recordarme
            </label>

            <button
              type="button"
              onClick={() => {
                setMostrarRecovery(true);
                toast("Ingresa tu clave 🔐");
              }}
              className="text-blue-500 hover:underline"
            >
              ¿Olvidaste contraseña?
            </button>

          </div>

          {/* BOTÓN LOGIN */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-500 text-white rounded-lg"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

        </form>
      </div>

      {/* ✅ MODAL */}
      {mostrarRecovery && (
        <div
          onClick={cerrarModal} // ✅ click fuera
          className={`
      fixed inset-0 z-50 flex items-center justify-center
      bg-black/40 backdrop-blur-sm
      transition-opacity duration-200
      ${mostrarRecovery ? "opacity-100" : "opacity-0 pointer-events-none"}
    `}
        >

          <div
            onClick={(e) => e.stopPropagation()} // ✅ evita cerrar dentro
            className={`
        bg-white p-6 rounded-xl shadow-lg
        w-full max-w-sm space-y-4

        transform transition-all duration-200 ease-out
        ${mostrarRecovery
                ? "scale-100 opacity-100 translate-y-0"
                : "scale-95 opacity-0 translate-y-6"}
      `}
          >

            <h3 className="text-lg font-bold text-center">
              🔐 Recuperar contraseña
            </h3>

            <p className="text-xs text-gray-500 text-center">
              Usuario: {username || "No definido ⚠️"}
            </p>

            {/* CLAVE */}
            <input
              placeholder="Clave de seguridad"
              value={claveSeguridad}
              onChange={(e) => setClaveSeguridad(e.target.value)}
              className={`w-full border px-3 py-2 rounded ${claveSeguridad && !claveValida ? "border-red-500" : ""
                }`}
            />

            {claveSeguridad && !claveValida && (
              <p className="text-xs text-red-500">
                Clave inválida ❌
              </p>
            )}

            {/* PASSWORD */}
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={nuevaPassword}
              onChange={(e) => setNuevaPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />

            {/* BOTONES */}
            <div className="flex gap-2">

              <button
                onClick={recuperarPassword}
                disabled={!claveValida || nuevaPassword.length < 4 || loading}
                className={`flex-1 py-2 rounded text-white ${claveValida && nuevaPassword.length >= 4
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-400 cursor-not-allowed"
                  }`}
              >
                {loading ? "Guardando..." : "Guardar"}
              </button>

              <button
                onClick={cerrarModal}
                className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
              >
                Cancelar
              </button>

            </div>

          </div>
        </div>
      )}

    </>
  );
}

export default Login;