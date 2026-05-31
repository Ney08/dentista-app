const URL = "http://127.0.0.1:8000/ingresos";

// ✅ GET
export const getIngresos = async () => {
  const res = await fetch(URL + "/");
  return res.json();
};

// ✅ CREATE
export const crearIngreso = async (data) => {
  const res = await fetch(URL + "/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
};

// ✅ PAGAR
export const pagarIngreso = async (id) => {
  const res = await fetch(`${URL}/${id}/pagar`, {
    method: "PUT"
  });

  return res.json();
};

// ✅ EDITAR
export const actualizarIngreso = async (id, data) => {
  const res = await fetch(`${URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
};