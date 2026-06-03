import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getIngresos,
  crearIngreso,
  pagarIngreso,
  actualizarIngreso
} from "../components/services/ingresoService";
import { useClientes } from "./useClientes";

export const useIngresos = () => {

  const { clientes = [] } = useClientes(true); // ✅ solo activos
  const queryClient = useQueryClient();

  // ✅ GET INGRESOS (🔥 BLINDADO)
  const {
    data: ingresos = [],
    isLoading
  } = useQuery({
    queryKey: ["ingresos"],
    queryFn: async () => {

      try {
        const data = await getIngresos();

        // ✅ PROTECCIÓN TOTAL
        if (!Array.isArray(data)) {
          console.warn("⚠️ ingresos NO es array:", data);
          return [];
        }

        return data;

      } catch (error) {
        console.error("❌ Error cargando ingresos:", error);
        return []; // 🔥 evita crash
      }
    },
    staleTime: 1000 * 60
  });

  // ✅ CREAR INGRESO (OPTIMISTIC)
  const crearIngresoMutation = useMutation({
    mutationFn: crearIngreso,

    onMutate: async (nuevo) => {

      await queryClient.cancelQueries({ queryKey: ["ingresos"] });

      const prev = queryClient.getQueryData(["ingresos"]);

      queryClient.setQueryData(["ingresos"], (old = []) => [
        ...(Array.isArray(old) ? old : []), // ✅ protección
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
      queryClient.invalidateQueries({ queryKey: ["ingresos"] });
    }
  });

  // ✅ PAGAR INGRESO (OPTIMISTIC)
  const pagarIngresoMutation = useMutation({
    mutationFn: pagarIngreso,

    onMutate: async (id) => {

      await queryClient.cancelQueries({ queryKey: ["ingresos"] });

      const prev = queryClient.getQueryData(["ingresos"]);

      queryClient.setQueryData(["ingresos"], (old = []) =>
        (Array.isArray(old) ? old : []).map(i =>
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
      queryClient.invalidateQueries({ queryKey: ["ingresos"] });
    }
  });

  // ✅ EDITAR INGRESO (OPTIMISTIC)
  const actualizarIngresoMutation = useMutation({
    mutationFn: ({ id, data }) =>
      actualizarIngreso(id, data),

    onMutate: async ({ id, data }) => {

      await queryClient.cancelQueries({ queryKey: ["ingresos"] });

      const prev = queryClient.getQueryData(["ingresos"]);

      queryClient.setQueryData(["ingresos"], (old = []) =>
        (Array.isArray(old) ? old : []).map(i => {

          if (i.id !== id) return i;

          const nuevoCliente = clientes.find(
            c => c.id === data.cliente_id
          );

          return {
            ...i,
            ...data,
            cliente: nuevoCliente || i.cliente
          };
        })
      );

      return { prev };
    },

    onError: (_err, _vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData(["ingresos"], context.prev);
      }
    },

    onSuccess: (updatedIngreso) => {

      if (!updatedIngreso) return;

      queryClient.setQueryData(["ingresos"], (old = []) =>
        (Array.isArray(old) ? old : []).map(i =>
          i.id === updatedIngreso.id
            ? updatedIngreso
            : i
        )
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["ingresos"] });
    }
  });

  return {
    ingresos: Array.isArray(ingresos) ? ingresos : [], // ✅ doble seguridad
    isLoading,
    crearIngreso: crearIngresoMutation,
    pagarIngreso: pagarIngresoMutation,
    actualizarIngreso: actualizarIngresoMutation
  };
};
