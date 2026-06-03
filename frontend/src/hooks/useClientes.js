import { API_URL } from "../config";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getClientes,
  crearCliente,
  eliminarCliente,
  actualizarCliente
} from "../components/services/clienteService";

export const useClientes = (activos = true) => {

  const queryClient = useQueryClient();

  const {
    data: clientes = [],
    isLoading
  } = useQuery({
    queryKey: ["clientes", activos], 
    queryFn: () => getClientes(activos),
    staleTime: 1000 * 60
  });

  const crearClienteMutation = useMutation({
    mutationFn: crearCliente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
    }
  });

  const toggleClienteMutation = useMutation({
    mutationFn: async (cliente) => {

      const endpoint = cliente.activo
        ? "desactivar"
        : "activar";

      const res = await fetch(
        `${API_URL}/clientes/${cliente.id}/${endpoint}`,
        { method: "PUT" }
      );

      if (!res.ok) {
        throw new Error("Error al cambiar estado");
      }

      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
    }
  });

  const editarClienteMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      return await actualizarCliente(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
    }
  });

  return {
    clientes,
    isLoading,
    crearCliente: crearClienteMutation,
    editarCliente: editarClienteMutation,
    toggleCliente: toggleClienteMutation
  };
};
