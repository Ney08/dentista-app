import {
  authHeaders
} from "./authHeaders";

export const apiFetch = async (
  url,
  options = {}
) => {

  const headers = {
    ...authHeaders(),
    ...(options.headers || {})
  };

  const res = await fetch(
    url,
    {
      ...options,
      headers
    }
  );

  let data = {};

  try {

    if (res.status !== 204) {

      data = await res.json();

    }

  } catch {

    data = {};

  }

  if (!res.ok) {

    if (res.status === 401) {

      localStorage.removeItem(
        "token"
      );

      sessionStorage.removeItem(
        "token"
      );

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