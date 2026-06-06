import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import PageWrapper from "../components/PageWrapper";

import SkeletonLoader from "../components/SkeletonLoader";

import Paginacion from "../components/Paginacion";

import ConfirmModal from "../components/ConfirmModal";

import EgresoModal from "../components/egresos/EgresoModal";

import EgresoList from "../components/egresos/EgresoList";

import { useEgresos } from "../hooks/useEgresos";

import { formatMoney } from "../utils/format";


function EgresosPage() {

  const {

    egresos,

    crearEgreso,

    actualizarEgreso,

    eliminarEgreso,

    isLoading

  } = useEgresos();

  const [modalAbierto, setModalAbierto] =
    useState(false);

  const [animar, setAnimar] =
    useState(false);

  const [egresoEditar, setEgresoEditar] =
    useState(null);

  const [egresoEliminar, setEgresoEliminar] =
    useState(null);

  const [pagina, setPagina] =
    useState(1);

  const [porPagina, setPorPagina] =
    useState(7);

  // ✅ ANIMACIÓN MODAL
  useEffect(() => {

    if (modalAbierto) {

      setTimeout(() => {
        setAnimar(true);
      }, 10);

    } else {

      setAnimar(false);

    }

  }, [modalAbierto]);

  // ✅ ABRIR CREAR
  const abrirCrear = () => {

    setEgresoEditar(null);

    setModalAbierto(true);

  };

  // ✅ ABRIR EDITAR
  const abrirEditar = (egreso) => {

    setEgresoEditar(egreso);

    setModalAbierto(true);

  };

  // ✅ CERRAR
  const cerrarModal = () => {

    setModalAbierto(false);

    setEgresoEditar(null);

  };

  // ✅ GUARDAR
  const guardarEgreso = async (data) => {

    try {

      if (data.id) {

        await actualizarEgreso.mutateAsync({

          id: data.id,

          data

        });

      } else {

        await crearEgreso.mutateAsync(data);

      }

      cerrarModal();

    } catch {

      toast.error("Error ❌");

    }

  };

  // ✅ TOTAL
  const totalEgresos = egresos.reduce(
    (acc, e) =>
      acc + Number(e.monto || 0),
    0
  );

  // ✅ PAGINACIÓN
  const inicio =
    porPagina === "all"
      ? 0
      : (pagina - 1) * porPagina;

  const totalPaginas =
    porPagina === "all"
      ? 1
      : Math.ceil(
        egresos.length / porPagina
      );

  const fin =
    porPagina === "all"
      ? undefined
      : inicio + porPagina;

  const egresosPaginados =
    porPagina === "all"
      ? egresos
      : egresos.slice(inicio, fin);

  // ✅ LOADING
  if (isLoading) {

    return (
      <PageWrapper>

        <div className="space-y-6">

          <SkeletonLoader alto="h-10" />

          <div className="grid gap-4">

            <SkeletonLoader alto="h-24" />
            <SkeletonLoader alto="h-24" />
            <SkeletonLoader alto="h-24" />

          </div>

        </div>

      </PageWrapper>
    );

  }

  return (
    <PageWrapper>

      <div className="
        h-full flex flex-col
        gap-4 md:gap-5
        pb-4 overflow-hidden
      ">

        {/* ✅ HEADER */}
        <div className="text-center pt-2">

          <h1 className="
            text-2xl sm:text-3xl md:text-4xl
            font-bold tracking-tight
          ">
            Egresos 💸
          </h1>

          <p className="
            text-xs sm:text-sm
            text-gray-500
          ">
            Gestiona los gastos del negocio
          </p>

        </div>

        {/* ✅ CARD */}
        <div className="
          bg-white rounded-2xl
          shadow-sm border border-gray-200

          flex flex-col

          h-[72vh] sm:h-[75vh] lg:h-[78vh]

          p-4 sm:p-5
          gap-4

          overflow-hidden
        ">

          {/* ✅ TOP */}
          <div className="space-y-4">

            <div className="
              flex flex-col lg:flex-row
              lg:items-center
              lg:justify-between
              gap-3
            ">

              {/* ✅ KPI */}
              <div className="
                bg-red-50
                border border-red-200

                rounded-2xl

                px-4 py-3

                flex items-center gap-3
              ">

                <div>

                  <p className="
                    text-xs text-red-500
                  ">
                    Total egresos
                  </p>

                  <p className="
                    text-xl font-bold
                    text-red-600
                  ">
                    RD$ {formatMoney(totalEgresos)}
                  </p>

                </div>

              </div>

              {/* ✅ CONTROLES */}
              <div className="
                flex flex-col sm:flex-row
                gap-2 sm:items-center

                w-full lg:w-auto
              ">

                <select
                  value={porPagina}
                  onChange={(e) => {

                    const val =
                      e.target.value === "all"
                        ? "all"
                        : parseInt(
                          e.target.value
                        );

                    setPorPagina(val);

                    setPagina(1);

                  }}
                  className="
                    w-full sm:w-auto

                    border border-gray-200

                    px-3 h-11

                    rounded-xl

                    text-sm sm:text-base
                  "
                >

                  <option value={7}>
                    7
                  </option>

                  <option value={14}>
                    14
                  </option>

                  <option value={28}>
                    28
                  </option>

                  <option value="all">
                    Todos
                  </option>

                </select>

                <button
                  onClick={abrirCrear}
                  className="
                    w-full sm:w-auto

                    bg-red-500
                    hover:bg-red-600

                    text-white

                    px-4 h-11

                    rounded-xl

                    text-sm sm:text-base

                    shadow-sm

                    active:scale-[0.98]

                    transition
                  "
                >
                  + Nuevo
                </button>

              </div>

            </div>

          </div>

          {/* ✅ LISTA */}
          <div className="
            flex-1 min-h-0

            overflow-y-auto
            overflow-x-hidden

            pr-1
          ">

            <EgresoList
              egresos={egresosPaginados}
              onEditar={abrirEditar}
              onEliminar={(egreso) => {

                setEgresoEliminar(
                  egreso
                );

              }}
            />

          </div>

          {/* ✅ PAGINACIÓN */}
          {porPagina !== "all" &&
            totalPaginas > 1 && (

              <div className="
                pt-3 border-t
                overflow-x-auto
              ">

                <Paginacion
                  pagina={pagina}
                  totalPaginas={totalPaginas}
                  onChange={setPagina}
                />

              </div>

            )}

        </div>

      </div>

      {/* ✅ MODAL */}
      {modalAbierto && (

        <div
          onClick={cerrarModal}
          className={`
            fixed inset-0 z-50

            flex items-end md:items-center
            justify-center

            bg-black/40
            backdrop-blur-md

            transition-all duration-300

            ${modalAbierto
              ? "opacity-100 visible"
              : "opacity-0 invisible"}
          `}
        >

          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            className={`
              w-full h-full
              md:h-auto

              md:max-w-2xl

              p-0 md:p-4

              transition-all duration-300

              ${animar
                ? `
                  translate-y-0
                  md:scale-100
                  opacity-100
                `
                : `
                  translate-y-full
                  md:translate-y-0
                  md:scale-95
                  opacity-0
                `}
            `}
          >

            <EgresoModal
              egreso={egresoEditar}
              onGuardar={guardarEgreso}
              onClose={cerrarModal}
            />

          </div>

        </div>

      )}

      {/* ✅ CONFIRM DELETE */}
      {egresoEliminar && (

        <ConfirmModal

          mensaje={`
            ¿Eliminar el egreso
            "${egresoEliminar.descripcion}"?
          `}

          onConfirm={async () => {

            await eliminarEgreso.mutateAsync(
              egresoEliminar.id
            );

            setEgresoEliminar(null);

            toast.success(
              "Egreso eliminado ✅"
            );

          }}

          onCancel={() =>
            setEgresoEliminar(null)
          }

        />

      )}

    </PageWrapper>
  );
}

export default EgresosPage;