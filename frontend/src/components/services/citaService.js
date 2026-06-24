import {
  API_URL
} from "../../config";

import {
  apiFetch
} from "../../utils/apiFetch";

/*
==========================================
GET CITAS
==========================================
*/

export const getCitas = () => {

  return apiFetch(
    `${API_URL}/citas/`
  );

};

/*
==========================================
CREAR CITA
==========================================
*/

export const crearCita = (
  data
) => {

  return apiFetch(
    `${API_URL}/citas/`,
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
ACTUALIZAR CITA
==========================================
*/

export const actualizarCita = (
  id,
  data
) => {

  return apiFetch(
    `${API_URL}/citas/${id}`,
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
ELIMINAR CITA
==========================================
*/

export const eliminarCita = (
  id
) => {

  return apiFetch(
    `${API_URL}/citas/${id}`,
    {
      method: "DELETE"
    }
  );

};

/*
==========================================
COMPLETAR CITA
==========================================
*/

export const completarCita = (
  id
) => {

  return apiFetch(
    `${API_URL}/citas/${id}/completar`,
    {
      method: "PUT"
    }
  );

};

/*
==========================================
CANCELAR CITA
==========================================
*/

export const cancelarCita = (
  id
) => {

  return apiFetch(
    `${API_URL}/citas/${id}/cancelar`,
    {
      method: "PUT"
    }
  );

};