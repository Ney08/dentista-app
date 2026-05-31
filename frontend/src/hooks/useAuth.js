import { API_URL } from "../config";
import { useAuthContext } from "../context/AuthContext";

export const useAuth = () => {

  // ✅ contexto global
  const { login: loginGlobal, logout } = useAuthContext();

  // ✅ LOGIN
  const login = async (username, password) => {

    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username.trim(),
        password: password.trim()
      })
    });

    let data = {};
    try {
      data = await res.json();
    } catch {}

    // ✅ error backend
    if (!res.ok) {
      console.warn("Error login:", res.status, data);
      throw new Error(data?.detail || "Error al iniciar sesión ❌");
    }

    // ✅ validación token
    if (!data.token) {
      throw new Error("Respuesta inválida ❌");
    }

    // ✅ LOGIN GLOBAL AUTOMÁTICO
    loginGlobal(data.token);

    return data.token;
  };

  // ✅ RESET PASSWORD
  const resetPassword = async (username, nuevaPassword) => {

    const res = await fetch(`${API_URL}/users/reset`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username.trim(),
        password: nuevaPassword.trim()
      })
    });

    let data = {};
    try {
      data = await res.json();
    } catch {}

    if (!res.ok) {
      throw new Error(data?.detail || "Error al cambiar ❌");
    }

    return true;
  };

  // ✅ LOGOUT (por si quieres llamarlo desde aquí)
  const cerrarSesion = () => {
    logout();
  };

  return {
    login,
    resetPassword,
    cerrarSesion
  };
};