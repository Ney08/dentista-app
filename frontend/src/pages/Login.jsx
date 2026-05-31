import { useState, useEffect } from "react";
import toast from "react-hot-toast";

function Login({ setToken }) {

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

  // 🔐 CLAVE MAESTRA
  const CLAVE_SEGURIDAD = "1234";

  // ✅ VALIDACIÓN AUTOMÁTICA DE CLAVE
  useEffect(() => {
    if (!claveSeguridad) {
      setClaveValida(false);
      return;
    }

    setClaveValida(claveSeguridad === CLAVE_SEGURIDAD);
  }, [claveSeguridad]);

  // ✅ LOGIN
  const login = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error("Completa los campos ❌");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim()
        })
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.detail || "Credenciales incorrectas ❌");
        return;
      }

      if (recordar) {
        localStorage.setItem("token", data.token);
      } else {
        sessionStorage.setItem("token", data.token);
      }

      setToken(data.token);
      localStorage.setItem("lastUser", username);
      toast.success(`Bienvenido ${username} ✅`);

    } catch {
      toast.error("Error de conexión ❌");
    } finally {
      setLoading(false);
    }
  };

  // ✅ CAMBIAR CONTRASEÑA
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

  try {
    const res = await fetch("http://127.0.0.1:8000/users/reset", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password: nuevaPassword
      })
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.detail || "Error al cambiar ❌");
      return;
    }

    // ✅ 🎯 AQUÍ ESTÁ LO QUE QUIERES
    toast.success("Contraseña cambiada ✅");

    cerrarModal();  // cerrar popup automáticamente

  } catch (error) {
    console.error(error);
    toast.error("Error del servidor ❌");
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

          {/* BOTÓN */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-500 text-white rounded-lg"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

        </form>

      </div>

      {/* ✅ MODAL RECUPERACIÓN */}
      {mostrarRecovery && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm space-y-4">

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
                disabled={!claveValida || nuevaPassword.length < 4}
                className={`
                  flex-1 py-2 rounded text-white
                  ${claveValida && nuevaPassword.length >= 4
                    ? "bg-green-500"
                    : "bg-gray-400 cursor-not-allowed"}
                `}
              >
                Guardar
              </button>

              <button
                onClick={cerrarModal}
                className="flex-1 bg-gray-400 text-white py-2 rounded"
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