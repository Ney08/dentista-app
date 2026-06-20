
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "../config";

export const useHistorial = (clienteId) => {

  const queryClient = useQueryClient();

  const {
    data: historial = [],
    isLoading
  } = useQuery({
    queryKey: ["historial", clienteId],
    enabled: !!clienteId,
    queryFn: async () => {

      const res = await fetch(
        `${API_URL}/historiales/clientes/${clienteId}/historial`
      );

      if (!res.ok) {
        throw new Error("Error al cargar historial ❌");
      }

      return await res.json();
    }
  });

  // ✅ CREAR
  const crearHistorial = useMutation({
    mutationFn: async (data) => {
      const res = await fetch(`${API_URL}/historiales/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error();

      return await res.json();
    },

    onSuccess: (data) => {
      queryClient.setQueryData(
        ["historial", clienteId],
        (old = []) => [...old, data]
      );
    }
  });

  // ✅ EDITAR
  const actualizarHistorial = useMutation({
    mutationFn: async ({ id, cliente_id, descripcion }) => {

      const res = await fetch(`${API_URL}/historiales/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ cliente_id, descripcion })
      });

      if (!res.ok) throw new Error();

      return { id, descripcion };
    },

    onSuccess: ({ id, descripcion }) => {
      queryClient.setQueryData(
        ["historial", clienteId],
        (old = []) =>
          old.map((h) =>
            h.id === id
              ? { ...h, descripcion }
              : h
          )
      );
    }
  });

  // ✅ ELIMINAR
  const eliminarHistorial = useMutation({
    mutationFn: async (id) => {

      const res = await fetch(
        `${API_URL}/historiales/${id}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error();

      return id;
    },

    onSuccess: (id) => {
      queryClient.setQueryData(
        ["historial", clienteId],
        (old = []) =>
          old.filter((h) => h.id !== id)
      );
    }
  });

  return {
    historial,
    isLoading,
    crearHistorial,
    actualizarHistorial,
    eliminarHistorial 
  };
};