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

  /*
  ==========================================
  DATA
  ==========================================
  */

  const {

    egresos,

    crearEgreso,

    actualizarEgreso,

    eliminarEgreso,

    isLoading

  } = useEgresos();

  /*
  ==========================================
  STATES
  ==========================================
  */

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

  /*
  ==========================================
  MODAL ANIMATION
  ==========================================
  */

  useEffect(() => {

    if (modalAbierto) {

      setTimeout(() => {

        setAnimar(true);

      }, 10);

    } else {

      setAnimar(false);

    }

  }, [modalAbierto]);

  /*
  ==========================================
  ACTIONS
  ==========================================
  */

  const abrirCrear = () => {

    setEgresoEditar(null);

    setModalAbierto(true);

  };

  const abrirEditar = (egreso) => {

    setEgresoEditar(egreso);

    setModalAbierto(true);

  };

  const cerrarModal = () => {

    setModalAbierto(false);

    setEgresoEditar(null);

  };

  /*
  ==========================================
  GUARDAR
  ==========================================
  */

  const guardarEgreso = async (data) => {

    try {

      if (data.id) {

        await actualizarEgreso.mutateAsync({

          id: data.id,

          data

        });

        toast.success(
          "Egreso actualizado ✅"
        );

      } else {

        await crearEgreso.mutateAsync(
          data
        );

        toast.success(
          "Egreso creado ✅"
        );

      }

      cerrarModal();

    } catch {

      toast.error(
        "Error ❌"
      );

    }

  };

  /*
  ==========================================
  KPIS
  ==========================================
  */

  const totalEgresos =
    egresos.reduce(
      (acc, e) =>
        acc + Number(e.monto || 0),
      0
    );

  const cantidadEgresos =
    egresos.length;

  const promedioEgreso =
    cantidadEgresos > 0
      ? totalEgresos / cantidadEgresos
      : 0;

  const hoy =
    new Date();

  const totalHoy =
    egresos.reduce((acc, e) => {

      const fecha =
        new Date(e.created_at);

      const esHoy =
        fecha.getDate() === hoy.getDate() &&
        fecha.getMonth() === hoy.getMonth() &&
        fecha.getFullYear() === hoy.getFullYear();

      return esHoy
        ? acc + Number(e.monto || 0)
        : acc;

    }, 0);

  const totalMes =
    egresos.reduce((acc, e) => {

      const fecha =
        new Date(e.created_at);

      const mismoMes =
        fecha.getMonth() === hoy.getMonth() &&
        fecha.getFullYear() === hoy.getFullYear();

      return mismoMes
        ? acc + Number(e.monto || 0)
        : acc;

    }, 0);

  /*
  ==========================================
  PAGINACION
  ==========================================
  */

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

  /*
  ==========================================
  EFFECT
  ==========================================
  */

  useEffect(() => {

    if (pagina > totalPaginas) {

      setPagina(1);

    }

  }, [egresos.length]);

  /*
  ==========================================
  LOADING
  ==========================================
  */

  if (isLoading) {

    return (

      <PageWrapper>

        <div className="
          max-w-[1600px]
          mx-auto
          space-y-6
        ">

          <SkeletonLoader alto="h-12" />

          <div className="
            grid
            grid-cols-1
            md:grid-cols-4
            gap-4
          ">

            <SkeletonLoader alto="h-32" />
            <SkeletonLoader alto="h-32" />
            <SkeletonLoader alto="h-32" />
            <SkeletonLoader alto="h-32" />

          </div>

          <SkeletonLoader alto="h-[500px]" />

        </div>

      </PageWrapper>

    );

  }

  return (

    <PageWrapper>

      <div className="
        h-full

        max-w-[1600px]

        mx-auto

        flex
        flex-col

        gap-6

        pb-4

        overflow-hidden
      ">

        {/* HEADER */}

        <div className="
          text-center
          space-y-3
          pt-2
        ">

          <h1 className="
            text-4xl
            md:text-5xl

            font-black

            tracking-tight
          ">

            <span className="
              bg-gradient-to-r
              from-slate-800
              to-slate-500

              bg-clip-text
              text-transparent
            ">
              Egresos
            </span>

            <span className="ml-2">
              💸
            </span>

          </h1>

          <div className="
            w-24
            h-1

            mx-auto

            rounded-full

            bg-gradient-to-r
            from-purple-500
            to-indigo-500
          " />

          <p className="
            text-sm
            sm:text-base

            text-gray-500

            font-medium
          ">
            Gestiona los gastos del negocio
          </p>

        </div>

        {/* KPIS */}

        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4

          gap-5
        ">

          {/* TOTAL */}

          <div className="
            relative
            overflow-hidden

            bg-white/90
            backdrop-blur-xl

            border
            border-white/40

            rounded-[30px]

            p-6

            shadow-[0_10px_30px_rgba(0,0,0,0.06)]

            hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]

            transition-all
            duration-300
          ">

            <div className="
              absolute
              -top-10
              -right-10

              w-40
              h-40

              rounded-full

              bg-rose-500/10

              blur-3xl
            " />

            <p className="
              text-sm
              text-gray-500
            ">
              💸 Total egresos
            </p>

            <h2 className="
              mt-2

              text-4xl

              font-black

              text-rose-500
            ">
              RD$
              {" "}
              {formatMoney(totalEgresos)}
            </h2>

          </div>

          {/* HOY */}

          <div className="
            relative
            overflow-hidden

            bg-white/90
            backdrop-blur-xl

            border
            border-white/40

            rounded-[30px]

            p-6

            shadow-[0_10px_30px_rgba(0,0,0,0.06)]

            hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]

            transition-all
            duration-300
          ">

            <div className="
              absolute
              -top-10
              -right-10

              w-40
              h-40

              rounded-full

              bg-orange-500/10

              blur-3xl
            " />

            <p className="
              text-sm
              text-gray-500
            ">
              📅 Gastado hoy
            </p>

            <h2 className="
              mt-2

              text-4xl

              font-black

              text-orange-500
            ">
              RD$
              {" "}
              {formatMoney(totalHoy)}
            </h2>

          </div>

          {/* MES */}

          <div className="
            relative
            overflow-hidden

            bg-white/90
            backdrop-blur-xl

            border
            border-white/40

            rounded-[30px]

            p-6

            shadow-[0_10px_30px_rgba(0,0,0,0.06)]

            hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]

            transition-all
            duration-300
          ">

            <div className="
              absolute
              -top-10
              -right-10

              w-40
              h-40

              rounded-full

              bg-pink-500/10

              blur-3xl
            " />

            <p className="
              text-sm
              text-gray-500
            ">
              📊 Total mes
            </p>

            <h2 className="
              mt-2

              text-4xl

              font-black

              text-pink-500
            ">
              RD$
              {" "}
              {formatMoney(totalMes)}
            </h2>

          </div>

          {/* PROMEDIO */}

          <div className="
            relative
            overflow-hidden

            bg-white/90
            backdrop-blur-xl

            border
            border-white/40

            rounded-[30px]

            p-6

            shadow-[0_10px_30px_rgba(0,0,0,0.06)]

            hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]

            transition-all
            duration-300
          ">

            <div className="
              absolute
              -top-10
              -right-10

              w-40
              h-40

              rounded-full

              bg-indigo-500/10

              blur-3xl
            " />

            <p className="
              text-sm
              text-gray-500
            ">
              🧾 Promedio
            </p>

            <h2 className="
              mt-2

              text-4xl

              font-black

              text-indigo-500
            ">
              RD$
              {" "}
              {formatMoney(promedioEgreso)}
            </h2>

          </div>

        </div>

        {/* MAIN CARD */}

        <div className="
          bg-white/90
          backdrop-blur-xl

          border
          border-white/40

          rounded-[34px]

          shadow-[0_10px_30px_rgba(0,0,0,0.06)]

          flex
          flex-col

          h-[72vh]
          sm:h-[75vh]
          lg:h-[78vh]

          p-5
          sm:p-6

          gap-5

          overflow-hidden
        ">

          {/* TOP */}

          <div className="
            flex
            flex-col
            xl:flex-row

            xl:items-center
            xl:justify-between

            gap-4
          ">

            {/* INFO */}

            <div className="
              flex
              items-center
              gap-3
              flex-wrap
            ">

              <div className="
                px-4
                h-11

                rounded-2xl

                bg-gradient-to-r
                from-rose-50
                to-pink-50

                border
                border-rose-100

                flex
                items-center

                text-sm
                font-semibold

                text-rose-600
              ">
                {cantidadEgresos}
                {" "}
                egresos registrados
              </div>

            </div>

            {/* CONTROLES */}

            <div className="
              flex
              flex-col
              sm:flex-row

              gap-3
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
                  h-12

                  px-4

                  rounded-2xl

                  bg-white/80

                  border
                  border-white/40

                  shadow-sm

                  focus:outline-none

                  focus:ring-4
                  focus:ring-rose-500/10
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
                  h-12

                  min-w-[170px]

                  px-6

                  rounded-2xl

                  bg-gradient-to-r
                  from-indigo-500
                  via-purple-500
                  to-violet-500

                  text-white

                  font-black

                  shadow-[0_15px_35px_rgba(99,102,241,0.28)]

                  hover:scale-[1.02]

                  active:scale-95

                  transition-all
                  duration-300
                "
              >
                + Nuevo egreso
              </button>

            </div>

          </div>

          {/* LIST */}

          <div className="
            flex-1
            min-h-0

            overflow-y-auto
            overflow-x-hidden

            pr-1
          ">

            {egresosPaginados.length === 0 ? (

              <div className="
                h-full

                flex
                flex-col

                items-center
                justify-center

                text-center
              ">

                <div className="
                  w-24
                  h-24

                  rounded-[30px]

                  bg-gradient-to-br
                  from-rose-500
                  via-pink-500
                  to-red-500

                  flex
                  items-center
                  justify-center

                  text-5xl
                  text-white

                  shadow-[0_20px_50px_rgba(244,63,94,0.35)]
                ">
                  💸
                </div>

                <h3 className="
                  mt-6

                  text-3xl

                  font-black

                  text-slate-800
                ">
                  No hay egresos
                </h3>

                <p className="
                  mt-3

                  text-gray-500

                  max-w-sm
                ">
                  Los gastos registrados aparecerán aquí automáticamente
                </p>

              </div>

            ) : (

              <EgresoList
                egresos={egresosPaginados}
                onEditar={abrirEditar}
                onEliminar={(egreso) => {

                  setEgresoEliminar(
                    egreso
                  );

                }}
              />

            )}

          </div>

          {/* PAGINACION */}

          {porPagina !== "all" &&
            totalPaginas > 1 && (

              <div className="
                pt-4

                border-t
                border-gray-100

                flex
                justify-center
              ">

                <div className="
                  bg-white/80
                  backdrop-blur-xl

                  border
                  border-white/40

                  rounded-[24px]

                  p-2

                  shadow-sm
                ">

                  <Paginacion
                    pagina={pagina}
                    totalPaginas={totalPaginas}
                    onChange={setPagina}
                  />

                </div>

              </div>

            )}

        </div>

      </div>

      {/* MODAL */}

      {/* ✅ MODAL */}

      {modalAbierto && (

        <div
          onClick={cerrarModal}
          className={`
      fixed
      inset-0
      z-50

      flex
      items-end

      justify-center

      bg-black/50
      backdrop-blur-md

      transition-all
      duration-300

      ${modalAbierto
              ? "opacity-100 visible"
              : "opacity-0 invisible"
            }
    `}
        >

          <div className="
      w-full

      flex
      items-end
      justify-center
    ">

            {/* ✅ TRANSICIÓN DE ABAJO HACIA ARRIBA */}

            <div
              onClick={(e) =>
                e.stopPropagation()
              }

              className={`
          w-full

          md:max-w-3xl

          p-0
          md:p-4

          will-change-transform

          transform

          transition-all
          duration-700

          ease-[cubic-bezier(0.22,1,0.36,1)]

          ${animar
                  ? `
              translate-y-0
              opacity-100
            `
                  : `
              translate-y-full
              opacity-0
            `
                }
        `}
            >

              <EgresoModal
                egreso={egresoEditar}
                onGuardar={guardarEgreso}
                onClose={cerrarModal}
              />

            </div>

          </div>

        </div>

      )}


      {/* CONFIRM DELETE */}

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