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
        `${API_URL}/clientes/${clienteId}/historial`
      );

      if (!res.ok) {
        throw new Error("Error al cargar historial ❌");
      }

      return await res.json();
    }
  });

  const crearHistorial = useMutation({

    mutationFn: async (data) => {
      const res = await fetch(`${API_URL}/historiales/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      let result = {};
      try {
        result = await res.json();
      } catch {}

      if (!res.ok) {
        throw new Error(result?.detail || "Error al crear ❌");
      }

      return result;
    },

    onMutate: async (nuevaNota) => {

      await queryClient.cancelQueries({
        queryKey: ["historial", clienteId]
      });

      const prev = queryClient.getQueryData(["historial", clienteId]);

      queryClient.setQueryData(
        ["historial", clienteId],
        (old = []) => [
          ...old,
          {
            ...nuevaNota,
            id: Date.now(),
            fecha: new Date().toISOString()
          }
        ]
      );

      return { prev };
    },

    onError: (_err, _data, context) => {
      if (context?.prev) {
        queryClient.setQueryData(
          ["historial", clienteId],
          context.prev
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["historial", clienteId]
      });
    }
  });

  return {
    historial,
    isLoading,
    crearHistorial
  };
};
