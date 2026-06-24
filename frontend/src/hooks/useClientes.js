import {
  useQuery,
  useMutation,
  useQueryClient
} from "@tanstack/react-query";

import {
  getClientes,
  crearCliente,
  actualizarCliente,
  toggleCliente
} from "../components/services/clienteService";

export const useClientes = (
  activos = true
) => {

  /*
  ==========================================
  QUERY CLIENT
  ==========================================
  */

  const queryClient =
    useQueryClient();

  /*
  ==========================================
  GET CLIENTES
  ==========================================
  */

  const {
    data: clientes = [],
    isLoading,
    isError,
    error
  } = useQuery({

    queryKey:
      [
        "clientes",
        activos
      ],

    queryFn:
      () =>
        getClientes(
          activos
        ),

    staleTime:
      1000 * 60

  });

  /*
  ==========================================
  CREAR CLIENTE
  ==========================================
  */

  const crearClienteMutation =
    useMutation({

      mutationFn:
        crearCliente,

      onSuccess:
        () => {

          queryClient.invalidateQueries({
            queryKey: ["clientes"]
          });

        }

    });

  /*
  ==========================================
  EDITAR CLIENTE
  ==========================================
  */

  const editarClienteMutation =
    useMutation({

      mutationFn:
        ({
          id,
          data
        }) =>
          actualizarCliente(
            id,
            data
          ),

      onSuccess:
        () => {

          queryClient.invalidateQueries({
            queryKey: ["clientes"]
          });

        }

    });

  /*
  ==========================================
  ACTIVAR / DESACTIVAR CLIENTE
  ==========================================
  */

  const toggleClienteMutation =
    useMutation({

      mutationFn:
        toggleCliente,

      onSuccess:
        () => {

          queryClient.invalidateQueries({
            queryKey: ["clientes"]
          });

        }

    });

  /*
  ==========================================
  RETURN
  ==========================================
  */

  return {

    clientes,

    isLoading,

    isError,

    error,

    crearCliente:
      crearClienteMutation,

    editarCliente:
      editarClienteMutation,

    toggleCliente:
      toggleClienteMutation

  };

};