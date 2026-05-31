import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getClientes,
  crearCliente,
  eliminarCliente,
  actualizarCliente
} from "../services/clienteService";

export const useClientes = () => {

  const queryClient = useQueryClient();

  // ✅ GET CLIENTES
  const {
    data: clientes = [],
    isLoading
  } = useQuery({
    queryKey: ["clientes"],
    queryFn: getClientes,
    staleTime: 1000 * 60 // ✅ 1 min cache (mejora rendimiento)
  });

  // ✅ CREAR CLIENTE
  const crearClienteMutation = useMutation({
    mutationFn: crearCliente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
    }
  });

  // ✅ ELIMINAR CLIENTE
  const eliminarClienteMutation = useMutation({
    mutationFn: eliminarCliente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
    }
  });

  // ✅ EDITAR CLIENTE
  const editarClienteMutation = useMutation({
    mutationFn: ({ id, data }) =>
      actualizarCliente(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
    }
  });

  return {
    clientes,
    isLoading,
    crearCliente: crearClienteMutation,
    eliminarCliente: eliminarClienteMutation,
    editarCliente: editarClienteMutation
  };
};