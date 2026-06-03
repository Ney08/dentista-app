import { API_URL } from "../../config";

// ✅ helper para manejar errores
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
export const getClientes = async () => {
  const res = await fetch(`${API_URL}/clientes/`);
  return handleResponse(res);
};

// ✅ CREATE
export const crearCliente = async (data) => {
  const res = await fetch(`${API_URL}/clientes/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return handleResponse(res);
};

// ✅ DELETE
export const eliminarCliente = async (id) => {
  const res = await fetch(`${API_URL}/clientes/${id}`, {
    method: "DELETE"
  });

  return handleResponse(res);
};

// ✅ UPDATE
export const actualizarCliente = async (id, data) => {
  const res = await fetch(`${API_URL}/clientes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return handleResponse(res);
};