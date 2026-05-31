import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getClientes,
  crearCliente,
  eliminarCliente,
  actualizarCliente as updateClienteService
} from "../services/clienteService";

export const useClientes = () => {

  const queryClient = useQueryClient();

  // ✅ OBTENER CLIENTES
  const {
    data: clientes = [],
    isLoading
  } = useQuery({
    queryKey: ["clientes"],
    queryFn: getClientes
  });

  // ✅ CREAR CLIENTE
  const crearClienteMutation = useMutation({
    mutationFn: crearCliente,
    onSuccess: () => {
      queryClient.invalidateQueries(["clientes"]);
    }
  });

  // ✅ ELIMINAR CLIENTE
  const eliminarClienteMutation = useMutation({
    mutationFn: eliminarCliente,
    onSuccess: () => {
      queryClient.invalidateQueries(["clientes"]);
    }
  });

  // ✅ EDITAR CLIENTE
  const editarClienteMutation = useMutation({
    mutationFn: ({ id, data }) =>
      updateClienteService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["clientes"]);
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