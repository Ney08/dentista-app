import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "../config";
import { parseFechaLocal } from "../utils/fecha";
export const useCitas = () => {
  const queryClient = useQueryClient();

  // ✅ GET CITAS
  const { data: citas = [], isLoading } = useQuery({
    queryKey: ["citas"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/citas/`);

      if (!res.ok) throw new Error("Error al cargar citas");

      const data = await res.json();


      return [...data].sort((a, b) => {
        const fechaA = parseFechaLocal(a.fecha);
        const fechaB = parseFechaLocal(b.fecha);

        return fechaA - fechaB;
      });

    }
  });

  // ✅ CREAR CITA
  const crearCita = useMutation({
    mutationFn: async (nuevaCita) => {
      const res = await fetch(`${API_URL}/citas/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevaCita)
      });

      if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.detail || "Error al crear");
      }

      return await res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["citas"] });
    }
  });

  // ✅ ACTUALIZAR CITA (🔥 NUEVO)
  const actualizarCita = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await fetch(`${API_URL}/citas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.detail || "Error al actualizar");
      }

      return await res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["citas"] });
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

      await queryClient.cancelQueries({ queryKey: ["citas"] });

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

    onError: (_err, _id, context) => {
      if (context?.prev) {
        queryClient.setQueryData(["citas"], context.prev);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["citas"] });
    }
  });

  // ✅ CANCELAR CITA
  const cancelarCita = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${API_URL}/citas/${id}/cancelar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("ERROR BACKEND:", text);
        throw new Error("Error al cancelar");
      }

      return await res.json();
    },

    // ✅ OPTIMISTIC
    onMutate: async (id) => {

      await queryClient.cancelQueries({ queryKey: ["citas"] });

      const prev = queryClient.getQueryData(["citas"]);

      queryClient.setQueryData(["citas"], (old = []) =>
        old.map(c =>
          c.id === id
            ? { ...c, estado: "cancelada" }
            : c
        )
      );

      return { prev };
    },

    onError: (_err, _id, context) => {
      if (context?.prev) {
        queryClient.setQueryData(["citas"], context.prev);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["citas"] });
    }
  });

  return {
    citas,
    isLoading,
    crearCita,
    actualizarCita,
    completarCita,
    cancelarCita
  };
};
