import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "../config";
import toast from "react-hot-toast";
import axios from "axios";

export function useServicios() {

  const queryClient = useQueryClient();

  // ✅ GET
  const {
    data: servicios = [],
    isLoading
  } = useQuery({

    queryKey: ["servicios"],

    queryFn: async () => {

      const res = await axios.get(
        `${API_URL}/servicios/`
      );

      return res.data;

    }

  });

  // ✅ CREAR
  const agregarServicio = useMutation({

    mutationFn: async (data) => {

      const res = await axios.post(
        `${API_URL}/servicios/`,
        data
      );

      return res.data;

    },

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["servicios"]
      });

      toast.success("Servicio creado ✅");

    },

    onError: () => {

      toast.error("Error creando servicio ❌");

    }

  });

  // ✅ ELIMINAR
  const eliminarServicio = useMutation({

    mutationFn: async (id) => {

      await axios.delete(
        `${API_URL}/servicios/${id}`
      );

    },

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["servicios"]
      });

      toast.success("Servicio eliminado ✅");

    },

    onError: () => {

      toast.error("Error eliminando ❌");

    }

  });

  // ✅ ACTUALIZAR
  const actualizarServicio = useMutation({

    mutationFn: async (data) => {

      const res = await axios.put(
        `${API_URL}/servicios/${data.id}`,
        data
      );

      return res.data;

    },

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["servicios"]
      });

      toast.success("Servicio actualizado ✅");

    },

    onError: () => {

      toast.error("Error actualizando ❌");

    }

  });

  return {

    servicios,

    isLoading,

    agregarServicio,

    eliminarServicio,

    actualizarServicio

  };

}
