import {
  API_URL
} from "../../config";

import {
  apiFetch
} from "../../utils/apiFetch";

/*
==========================================
GET TRATAMIENTOS POR CLIENTE
==========================================
*/

export const getTratamientos = (
  clienteId
) => {

  return apiFetch(
    `${API_URL}/tratamientos/${clienteId}`
  );

};

/*
==========================================
CREAR TRATAMIENTO
==========================================
*/

export const crearTratamiento = (
  data
) => {

  return apiFetch(
    `${API_URL}/tratamientos/`,
    {
      method: "POST",

      body:
        JSON.stringify(
          data
        )
    }
  );

};

/*
==========================================
ACTUALIZAR TRATAMIENTO
==========================================
*/

export const actualizarTratamiento = (
  id,
  data
) => {

  return apiFetch(
    `${API_URL}/tratamientos/${id}`,
    {
      method: "PUT",

      body:
        JSON.stringify(
          data
        )
    }
  );

};

/*
==========================================
ELIMINAR TRATAMIENTO
==========================================
*/

export const eliminarTratamiento = (
  id
) => {

  return apiFetch(
    `${API_URL}/tratamientos/${id}`,
    {
      method: "DELETE"
    }
  );

};

/*
==========================================
REGISTRAR PAGO
==========================================
*/

export const registrarPagoTratamiento = (
  id,
  monto
) => {

  return apiFetch(
    `${API_URL}/tratamientos/${id}/pago?monto=${monto}`,
    {
      method: "PUT"
    }
  );

};

/*
==========================================
SYNC ODONTOGRAMA
==========================================
*/

export const syncTratamientosOdontograma = (
  clienteId
) => {

  return apiFetch(
    `${API_URL}/tratamientos/sync-odontograma/${clienteId}`,
    {
      method: "POST"
    }
  );

};