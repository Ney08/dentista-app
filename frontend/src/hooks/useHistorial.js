import {
  useQuery,
  useMutation,
  useQueryClient
} from "@tanstack/react-query";

import {
  API_URL
} from "../config";

import {
  apiFetch
} from "../utils/apiFetch";

export const useHistorial = (
  clienteId
) => {

  const queryClient =
    useQueryClient();

  /*
  ==========================================
  GET HISTORIAL
  ==========================================
  */

  const {
    data: historial = [],
    isLoading,
    isError,
    error
  } = useQuery({

    queryKey:
      [
        "historial",
        clienteId
      ],

    enabled:
      !!clienteId,

    queryFn:
      async () => {

        return await apiFetch(
          `${API_URL}/historiales/clientes/${clienteId}/historial`
        );

      }

  });

  /*
  ==========================================
  CREAR HISTORIAL
  ==========================================
  */

  const crearHistorial =
    useMutation({

      mutationFn:
        async (data) => {

          return await apiFetch(
            `${API_URL}/historiales/`,
            {
              method: "POST",

              body:
                JSON.stringify(
                  data
                )
            }
          );

        },

      onSuccess:
        (data) => {

          queryClient.setQueryData(
            [
              "historial",
              clienteId
            ],
            (old = []) => [
              ...old,
              data
            ]
          );

          queryClient.invalidateQueries({
            queryKey: [
              "historial",
              clienteId
            ]
          });

        }

    });

  /*
  ==========================================
  EDITAR HISTORIAL
  ==========================================
  */

  const actualizarHistorial =
    useMutation({

      mutationFn:
        async ({
          id,
          cliente_id,
          descripcion
        }) => {

          await apiFetch(
            `${API_URL}/historiales/${id}`,
            {
              method: "PUT",

              body:
                JSON.stringify({
                  cliente_id,
                  descripcion
                })
            }
          );

          return {
            id,
            descripcion
          };

        },

      onSuccess:
        ({
          id,
          descripcion
        }) => {

          queryClient.setQueryData(
            [
              "historial",
              clienteId
            ],
            (old = []) =>
              old.map((h) =>
                h.id === id
                  ? {
                    ...h,
                    descripcion
                  }
                  : h
              )
          );

          queryClient.invalidateQueries({
            queryKey: [
              "historial",
              clienteId
            ]
          });

        }

    });

  /*
  ==========================================
  ELIMINAR HISTORIAL
  ==========================================
  */

  const eliminarHistorial =
    useMutation({

      mutationFn:
        async (id) => {

          await apiFetch(
            `${API_URL}/historiales/${id}`,
            {
              method: "DELETE"
            }
          );

          return id;

        },

      onSuccess:
        (id) => {

          queryClient.setQueryData(
            [
              "historial",
              clienteId
            ],
            (old = []) =>
              old.filter(
                (h) => h.id !== id
              )
          );

          queryClient.invalidateQueries({
            queryKey: [
              "historial",
              clienteId
            ]
          });

        }

    });

  /*
  ==========================================
  RETURN
  ==========================================
  */

  return {

    historial,

    isLoading,

    isError,

    error,

    crearHistorial,

    actualizarHistorial,

    eliminarHistorial

  };

};