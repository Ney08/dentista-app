import {
  useQuery,
  useMutation,
  useQueryClient
} from "@tanstack/react-query";

import {
  parseFechaLocal
} from "../utils/fecha";

import {
  getCitas,
  crearCita as crearCitaService,
  actualizarCita as actualizarCitaService,
  completarCita as completarCitaService,
  cancelarCita as cancelarCitaService
} from "../components/services/citaService";

export const useCitas = () => {

  const queryClient =
    useQueryClient();

  /*
  ==========================================
  GET CITAS
  ==========================================
  */

  const {
    data: citas = [],
    isLoading,
    isError,
    error
  } = useQuery({

    queryKey:
      ["citas"],

    queryFn:
      async () => {

        const data =
          await getCitas();

        return [...data].sort(
          (a, b) => {

            const fechaA =
              parseFechaLocal(
                a.fecha
              );

            const fechaB =
              parseFechaLocal(
                b.fecha
              );

            return fechaA - fechaB;

          }
        );

      },

    staleTime:
      1000 * 60

  });

  /*
  ==========================================
  CREAR CITA
  ==========================================
  */

  const crearCita =
    useMutation({

      mutationFn:
        crearCitaService,

      onSuccess:
        () => {

          queryClient.invalidateQueries({
            queryKey: ["citas"]
          });

        }

    });

  /*
  ==========================================
  ACTUALIZAR CITA
  ==========================================
  */

  const actualizarCita =
    useMutation({

      mutationFn:
        ({
          id,
          data
        }) => {

          return actualizarCitaService(
            id,
            data
          );

        },

      onSuccess:
        () => {

          queryClient.invalidateQueries({
            queryKey: ["citas"]
          });

        }

    });

  /*
  ==========================================
  COMPLETAR CITA
  ==========================================
  */

  const completarCita =
    useMutation({

      mutationFn:
        completarCitaService,

      /*
      ==========================================
      OPTIMISTIC UPDATE
      ==========================================
      */

      onMutate:
        async (id) => {

          await queryClient.cancelQueries({
            queryKey: ["citas"]
          });

          const prev =
            queryClient.getQueryData(
              ["citas"]
            );

          queryClient.setQueryData(
            ["citas"],
            (old = []) =>
              old.map((c) =>
                c.id === id
                  ? {
                    ...c,
                    estado: "completada"
                  }
                  : c
              )
          );

          return {
            prev
          };

        },

      onError:
        (_err, _id, context) => {

          if (context?.prev) {

            queryClient.setQueryData(
              ["citas"],
              context.prev
            );

          }

        },

      onSettled:
        () => {

          queryClient.invalidateQueries({
            queryKey: ["citas"]
          });

        }

    });

  /*
  ==========================================
  CANCELAR CITA
  ==========================================
  */

  const cancelarCita =
    useMutation({

      mutationFn:
        cancelarCitaService,

      onSuccess:
        (_data, id) => {

          queryClient.setQueryData(
            ["citas"],
            (old = []) =>
              old.map((c) =>
                c.id === id
                  ? {
                    ...c,
                    estado: "cancelada"
                  }
                  : c
              )
          );

          queryClient.invalidateQueries({
            queryKey: ["citas"]
          });

        }

    });

  /*
  ==========================================
  RETURN
  ==========================================
  */

  return {

    citas,

    isLoading,

    isError,

    error,

    crearCita,

    actualizarCita,

    completarCita,

    cancelarCita

  };

};