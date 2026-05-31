import { API_URL } from "../config";

// ✅ helper para errores
const handleResponse = async (res) => {
  let data = {};

  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    throw new Error(data?.detail || "Error en la petición ❌");
  }

  return data;
};

// ✅ GET
export const getIngresos = async () => {
  const res = await fetch(`${API_URL}/ingresos/`);
  return handleResponse(res);
};

// ✅ CREATE
export const crearIngreso = async (data) => {
  const res = await fetch(`${API_URL}/ingresos/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return handleResponse(res);
};

// ✅ PAGAR
export const pagarIngreso = async (id) => {
  const res = await fetch(`${API_URL}/ingresos/${id}/pagar`, {
    method: "PUT"
  });

  return handleResponse(res);
};

// ✅ EDITAR
export const actualizarIngreso = async (id, data) => {
  const res = await fetch(`${API_URL}/ingresos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return handleResponse(res);
};