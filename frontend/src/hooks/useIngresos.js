import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getIngresos,
  crearIngreso,
  pagarIngreso,
  actualizarIngreso
} from "../services/ingresoService";
import { useClientes } from "./useClientes";

export const useIngresos = () => {
  const { clientes } = useClientes();
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
      old.map(i => {

        if (i.id !== id) return i;

        // ✅ buscar el nuevo cliente
        const nuevoCliente = clientes.find(
          c => c.id === data.cliente_id
        );

        return {
          ...i,
          ...data,

          // ✅ ahora sí actualiza correctamente
          cliente: nuevoCliente || i.cliente
        };
      })
    );

    return { prev };
  },

  onError: (err, vars, context) => {
    if (context?.prev) {
      queryClient.setQueryData(["ingresos"], context.prev);
    }
  },

  onSuccess: (updatedIngreso) => {
    // ✅ backend manda data correcta
    queryClient.setQueryData(["ingresos"], (old = []) =>
      old.map(i =>
        i.id === updatedIngreso.id
          ? updatedIngreso
          : i
      )
    );
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