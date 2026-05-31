import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getIngresos,
  crearIngreso,
  pagarIngreso,
  actualizarIngreso
} from "../services/ingresoService";

export const useIngresos = () => {

  const queryClient = useQueryClient();

  // ✅ GET INGRESOS
  const {
    data: ingresos = [],
    isLoading
  } = useQuery({
    queryKey: ["ingresos"],
    queryFn: getIngresos,
    staleTime: 1000 * 60 // ✅ cache 1 min
  });

  // ✅ CREAR INGRESO (OPTIMISTIC)
  const crearIngresoMutation = useMutation({
    mutationFn: crearIngreso,

    onMutate: async (nuevo) => {

      await queryClient.cancelQueries({
        queryKey: ["ingresos"]
      });

      const prev = queryClient.getQueryData(["ingresos"]);

      queryClient.setQueryData(["ingresos"], (old = []) => [
        ...old,
        {
          ...nuevo,
          id: Date.now(),
          pagado: false
        }
      ]);

      return { prev };
    },

    onError: (_err, _new, context) => {
      if (context?.prev) {
        queryClient.setQueryData(["ingresos"], context.prev);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["ingresos"]
      });
    }
  });

  // ✅ PAGAR INGRESO (OPTIMISTIC)
  const pagarIngresoMutation = useMutation({
    mutationFn: pagarIngreso,

    onMutate: async (id) => {

      await queryClient.cancelQueries({
        queryKey: ["ingresos"]
      });

      const prev = queryClient.getQueryData(["ingresos"]);

      queryClient.setQueryData(["ingresos"], (old = []) =>
        old.map(i =>
          i.id === id ? { ...i, pagado: true } : i
        )
      );

      return { prev };
    },

    onError: (_err, _id, context) => {
      if (context?.prev) {
        queryClient.setQueryData(["ingresos"], context.prev);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["ingresos"]
      });
    }
  });

  // ✅ EDITAR INGRESO (OPTIMISTIC)
  const actualizarIngresoMutation = useMutation({
    mutationFn: ({ id, data }) =>
      actualizarIngreso(id, data),

    onMutate: async ({ id, data }) => {

      await queryClient.cancelQueries({
        queryKey: ["ingresos"]
      });

      const prev = queryClient.getQueryData(["ingresos"]);

      queryClient.setQueryData(["ingresos"], (old = []) =>
        old.map(i =>
          i.id === id ? { ...i, ...data } : i
        )
      );

      return { prev };
    },

    onError: (_err, _vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData(["ingresos"], context.prev);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["ingresos"]
      });
    }
  });

  return {
    ingresos,
    isLoading,
    crearIngreso: crearIngresoMutation,
    pagarIngreso: pagarIngresoMutation,
    actualizarIngreso: actualizarIngresoMutation
  };
};