const URL = "http://127.0.0.1:8000/clientes";

// ✅ GET
export const getClientes = async () => {
  const res = await fetch(URL + "/");
  return res.json();
};

// ✅ CREATE
export const crearCliente = async (data) => {
  const res = await fetch(URL + "/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
};

// ✅ DELETE
export const eliminarCliente = async (id) => {
  await fetch(`${URL}/${id}`, {
    method: "DELETE"
  });
};

// ✅ ✨ AGREGAR ESTO (FALTABA)
export const actualizarCliente = async (id, data) => {
  const res = await fetch(`${URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
};
