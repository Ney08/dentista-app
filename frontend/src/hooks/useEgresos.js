import {
  useQuery,
  useMutation,
  useQueryClient
} from "@tanstack/react-query";

import axios from "axios";

import toast from "react-hot-toast";

import { API_URL } from "../config";


export function useEgresos() {

  const queryClient = useQueryClient();

  // ✅ GET
  const {
    data: egresos = [],
    isLoading
  } = useQuery({

    queryKey: ["egresos"],

    queryFn: async () => {

      const res = await axios.get(
        `${API_URL}/egresos/`
      );

      return res.data;

    }

  });

  // ✅ CREAR
  const crearEgreso = useMutation({

    mutationFn: async (data) => {

      const res = await axios.post(
        `${API_URL}/egresos/`,
        data
      );

      return res.data;

    },

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["egresos"]
      });

      toast.success(
        "Egreso creado ✅"
      );

    },

    onError: () => {

      toast.error(
        "Error creando egreso ❌"
      );

    }

  });

  // ✅ ACTUALIZAR
  const actualizarEgreso = useMutation({

    mutationFn: async ({
      id,
      data
    }) => {

      const res = await axios.put(
        `${API_URL}/egresos/${id}`,
        data
      );

      return res.data;

    },

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["egresos"]
      });

      toast.success(
        "Egreso actualizado ✅"
      );

    },

    onError: () => {

      toast.error(
        "Error actualizando ❌"
      );

    }

  });

  // ✅ ELIMINAR
  const eliminarEgreso = useMutation({

    mutationFn: async (id) => {

      await axios.delete(
        `${API_URL}/egresos/${id}`
      );

    },

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["egresos"]
      });

      toast.success(
        "Egreso eliminado ✅"
      );

    },

    onError: () => {

      toast.error(
        "Error eliminando ❌"
      );

    }

  });

  return {

    egresos,

    isLoading,

    crearEgreso,

    actualizarEgreso,

    eliminarEgreso

  };

}