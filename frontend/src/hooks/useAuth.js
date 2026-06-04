import { API_URL } from "../config";
import { useAuthContext } from "../context/AuthContext";
import SkeletonLoader from "../components/SkeletonLoader";

export const useAuth = () => {

  const { login: loginGlobal, logout } = useAuthContext();

  // ✅ LOGIN
  const login = async (username, password) => {

    if (!username.trim() || !password.trim()) {
      throw new Error("Completa los datos ❌");
    }

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
    } catch { }

    if (!res.ok) {
      console.warn("Error login:", res.status, data);
      throw new Error(data?.detail || "Error al iniciar sesión ❌");
    }

    if (!data.token) {
      throw new Error("Respuesta inválida ❌");
    }

    loginGlobal(data.token);

    return data.token;
  };

  // ✅ RESET PASSWORD
  const resetPassword = async (username, nuevaPassword) => {

    if (!username.trim()) {
      throw new Error("Usuario requerido ❌");
    }

    if (!nuevaPassword || nuevaPassword.trim().length < 6) {
      throw new Error("Mínimo 6 caracteres ⚠️");
    }

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
    } catch { }


    if (!res.ok) {
      console.error("Error reset:", res.status, data);

      throw new Error(
        typeof data?.detail === "string"
          ? data.detail
          : JSON.stringify(data?.detail) || "Error al cambiar ❌"
      );
    }


    return true;
  };

  // ✅ LOGOUT
  const cerrarSesion = () => {
    logout();
  };

  return {
    login,
    resetPassword,
    cerrarSesion
  };
};