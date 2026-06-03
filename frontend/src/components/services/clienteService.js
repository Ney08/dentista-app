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

// ✅ GET (🔥 ahora dinámico)
export const getClientes = async (activos = true) => {
  const res = await fetch(
    `${API_URL}/clientes?activos=${activos}`
  );
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

// ✅ TOGGLE ACTIVO 🔥 (NUEVO)
export const toggleCliente = async (cliente) => {

  const endpoint = cliente.activo
    ? "desactivar"
    : "activar";

  const res = await fetch(
    `${API_URL}/clientes/${cliente.id}/${endpoint}`,
    {
      method: "PUT"
    }
  );

  if (!res.ok) {
    throw new Error("Error al cambiar estado del cliente");
  }

  return res.json();
};