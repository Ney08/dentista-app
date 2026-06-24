import { API_URL } from "../../config";

import {
  authHeaders
} from "../../utils/authHeaders";

/*
==========================================
HELPER PARA MANEJAR RESPUESTAS
==========================================
*/

const handleResponse = async (res) => {

  let data = {};

  try {

    data = await res.json();

  } catch {}

  if (!res.ok) {

    if (res.status === 401) {

      throw new Error(
        "Sesión expirada o no autorizada 🔐"
      );

    }

    throw new Error(
      data?.detail ||
      "Error en la petición ❌"
    );

  }

  return data;

};

/*
==========================================
GET CLIENTES
==========================================
*/

export const getClientes = async (
  activos = true
) => {

  const res = await fetch(
    `${API_URL}/clientes/?activos=${activos}`,
    {
      method: "GET",

      headers:
        authHeaders()
    }
  );

  return handleResponse(
    res
  );

};

/*
==========================================
CREAR CLIENTE
==========================================
*/

export const crearCliente = async (
  data
) => {

  const res = await fetch(
    `${API_URL}/clientes/`,
    {
      method: "POST",

      headers:
        authHeaders(),

      body:
        JSON.stringify(
          data
        )
    }
  );

  return handleResponse(
    res
  );

};

/*
==========================================
ACTUALIZAR CLIENTE
==========================================
*/

export const actualizarCliente = async (
  id,
  data
) => {

  const res = await fetch(
    `${API_URL}/clientes/${id}`,
    {
      method: "PUT",

      headers:
        authHeaders(),

      body:
        JSON.stringify(
          data
        )
    }
  );

  return handleResponse(
    res
  );

};

/*
==========================================
ACTIVAR / DESACTIVAR CLIENTE
==========================================
*/

export const toggleCliente = async (
  cliente
) => {

  const endpoint =
    cliente.activo
      ? "desactivar"
      : "activar";

  const res = await fetch(
    `${API_URL}/clientes/${cliente.id}/${endpoint}`,
    {
      method: "PUT",

      headers:
        authHeaders()
    }
  );

  return handleResponse(
    res
  );

};