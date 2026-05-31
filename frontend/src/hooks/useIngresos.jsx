import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getIngresos,
  crearIngreso,
  pagarIngreso as pagarIngresoService,
  actualizarIngreso as actualizarIngresoService
} from "../services/ingresoService";

export const useIngresos = () => {

  const queryClient = useQueryClient();

  // ✅ GET INGRESOS
  const {
    data: ingresos = [],
    isLoading
  } = useQuery({
    queryKey: ["ingresos"],
    queryFn: getIngresos
  });

  // ✅ CREAR INGRESO (optimistic)
  const crearIngresoMutation = useMutation({
    mutationFn: crearIngreso,

    onMutate: async (nuevo) => {
      await queryClient.cancelQueries(["ingresos"]);

      const prev = queryClient.getQueryData(["ingresos"]);

      queryClient.setQueryData(["ingresos"], (old = []) => [
        ...old,
        { ...nuevo, id: Date.now(), pagado: false }
      ]);

      return { prev };
    },

    onError: (_err, _new, context) => {
      if (context?.prev) {
        queryClient.setQueryData(["ingresos"], context.prev);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries(["ingresos"]);
    }
  });

  // ✅ PAGAR INGRESO (🔥 OPTIMISTIC)
  const pagarIngresoMutation = useMutation({
    mutationFn: pagarIngresoService,

    onMutate: async (id) => {

      await queryClient.cancelQueries(["ingresos"]);

      const prev = queryClient.getQueryData(["ingresos"]);

      queryClient.setQueryData(["ingresos"], (old) =>
        old?.map(i =>
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
      queryClient.invalidateQueries(["ingresos"]);
    }
  });

  // ✅ EDITAR INGRESO (optimistic)
  const actualizarIngresoMutation = useMutation({
    mutationFn: ({ id, data }) =>
      actualizarIngresoService(id, data),

    onMutate: async ({ id, data }) => {

      await queryClient.cancelQueries(["ingresos"]);

      const prev = queryClient.getQueryData(["ingresos"]);

      queryClient.setQueryData(["ingresos"], (old) =>
        old?.map(i =>
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
      queryClient.invalidateQueries(["ingresos"]);
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