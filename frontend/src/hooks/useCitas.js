import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "../config";

export const useCitas = () => {
  const queryClient = useQueryClient();

  // ✅ GET CITAS
  const { data: citas = [], isLoading } = useQuery({
    queryKey: ["citas"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/citas/`);

      if (!res.ok) throw new Error("Error al cargar citas");

      const data = await res.json();

      return [...data].sort(
        (a, b) => new Date(a.fecha) - new Date(b.fecha)
      );
    }
  });

  // ✅ CREAR CITA (OPTIMISTIC LIMPIO ⚡)
  const crearCita = useMutation({
    mutationFn: async (nuevaCita) => {

      const res = await fetch(`${API_URL}/citas/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevaCita)
      });

      // ✅ validar respuesta
      if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.detail || "Error al crear");
      }

      return await res.json();
    },

    // ✅ OPTIMISTIC UPDATE (SIN DUPLICAR)
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["citas"] });
    },

    // ✅ SIÉMPRE REFRESCAR (CLAVE)
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["citas"] });
    },

    // ✅ SI FALLA
    onError: (err) => {
      console.error(err);
    }
  });

  // ✅ COMPLETAR CITA
  const completarCita = useMutation({
    mutationFn: async (id) => {

      const res = await fetch(
        `${API_URL}/citas/${id}/completar`,
        {
          method: "PUT",
        }
      );

      if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.detail || "Error al completar");
      }

      return await res.json();
    },

    // ✅ OPTIMISTIC UPDATE
    onMutate: async (id) => {

      await queryClient.cancelQueries(["citas"]);

      const prev = queryClient.getQueryData(["citas"]);

      queryClient.setQueryData(["citas"], (old = []) =>
        old.map(c =>
          c.id === id
            ? { ...c, estado: "completada" }
            : c
        )
      );

      return { prev };
    },

    // ✅ rollback si falla
    onError: (_err, _id, context) => {
      if (context?.prev) {
        queryClient.setQueryData(["citas"], context.prev);
      }
    },

    // ✅ refresco final
    onSettled: () => {
      queryClient.invalidateQueries(["citas"]);
    }
  });

  return {
    citas,
    isLoading,
    crearCita,
    completarCita
  };
};
