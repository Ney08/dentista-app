import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const URL = "http://127.0.0.1:8000/historiales";

export const useHistorial = (clienteId) => {

  const queryClient = useQueryClient();

  // ✅ OBTENER HISTORIAL
  const {
    data: historial = [],
    isLoading
  } = useQuery({
    queryKey: ["historial", clienteId],
    queryFn: async () => {
      const res = await fetch(`${URL}/?cliente_id=${clienteId}`);
      return res.json();
    },
    enabled: !!clienteId
  });

  // ✅ CREAR NOTA (OPTIMISTIC 🔥)
  const crearHistorial = useMutation({
    mutationFn: async (data) => {
      const res = await fetch(URL + "/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      return res.json();
    },

    // ⚡ OPTIMISTIC UPDATE
    onMutate: async (nuevaNota) => {

      await queryClient.cancelQueries(["historial", clienteId]);

      const prev = queryClient.getQueryData(["historial", clienteId]);

      queryClient.setQueryData(["historial", clienteId], (old = []) => [
        ...old,
        {
          ...nuevaNota,
          id: Date.now(),
          fecha: new Date().toISOString()
        }
      ]);

      return { prev };
    },

    // ❌ SI FALLA → revertir
    onError: (_err, _data, context) => {
      if (context?.prev) {
        queryClient.setQueryData(["historial", clienteId], context.prev);
      }
    },

    // ✅ SINCRONIZAR CON BACKEND
    onSettled: () => {
      queryClient.invalidateQueries(["historial", clienteId]);
    }
  });

  return {
    historial,
    isLoading,
    crearHistorial
  };
};