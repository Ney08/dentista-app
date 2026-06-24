import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export function useActividades(limit = 20) {

  const {
    data = [],
    isLoading,
    refetch
  } = useQuery({

    queryKey: [
      "actividades",
      limit
    ],

    queryFn: async () => {

      const res =
        await api.get(
          `/actividades/?limit=${limit}`
        );

      return res.data;

    },

    refetchInterval:
      15000,

    refetchOnWindowFocus:
      true

  });

  return {
    actividades: data,
    isLoading,
    refetch
  };

}