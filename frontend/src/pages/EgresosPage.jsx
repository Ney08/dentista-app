import { useEffect, useState } from "react";

import toast from "react-hot-toast";
import useModalStore from "../stores/useModalStore";
import {
  showSuccess,
  showError,
  showWarning,
  showInfo
} from "../components/ui/ToastStyles";
import { motion } from "framer-motion";
import PageWrapper from "../components/PageWrapper";
import SkeletonLoader from "../components/SkeletonLoader";
import Paginacion from "../components/Paginacion";
import ConfirmModal from "../components/ConfirmModal";
import BaseModal from "../components/BaseModal";
import EgresoModal from "../components/egresos/EgresoModal";
import EgresoList from "../components/egresos/EgresoList";
import {
  Wallet,
  WalletCards,
  BadgeDollarSign,
  TrendingDown,
  CalendarDays,
  CalendarClock,
  BarChart3,
  PieChart,
  Receipt,
  CircleDollarSign,
  Plus
} from "lucide-react";
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
  const {

    createEgresoOpen,

    openEgreso,

    closeEgreso

  } = useModalStore();
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

  useEffect(() => {

    if (createEgresoOpen) {

      setEgresoEditar(null);

      setModalAbierto(true);

    }

  }, [createEgresoOpen]);
  /*
  ==========================================
  ACTIONS
  ==========================================
  */


  const abrirCrear = () => {

    setEgresoEditar(null);

    openEgreso();

  };


  const abrirEditar = (egreso) => {

    setEgresoEditar(egreso);

    setModalAbierto(true);

  };


  const cerrarModal = () => {

    setModalAbierto(false);

    setEgresoEditar(null);

    closeEgreso();

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

        showSuccess(
          "Egreso actualizado ✅"
        );

      } else {

        await crearEgreso.mutateAsync(
          data
        );

        showSuccess(
          "Egreso creado ✅"
        );

      }

      cerrarModal();

    } catch {

      showError(
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
      <motion.div
        key="egresos"

        initial={{
          opacity: 0,
          y: 10
        }}

        animate={{
          opacity: 1,
          y: 0
        }}

        exit={{
          opacity: 0,
          y: -10
        }}

        transition={{
          duration: 0.25
        }}
      >
        <div className="
      h-full

      w-full

      flex
      flex-col

      gap-7

      pb-4

      overflow-hidden

      px-3
      sm:px-5
    ">

          {/* HEADER */}

          <div className="
        flex
        flex-col
        xl:flex-row

        xl:items-center
        xl:justify-between

        gap-5
      ">

            {/* LEFT */}

            <div>

              <div className="
            inline-flex

            items-center
            gap-2

            px-4
            py-2

            rounded-full

            bg-indigo-500/10

            border
            border-indigo-100

            text-indigo-600

            text-sm
            font-semibold

            mb-4
          ">

                <WalletCards size={14} />

                Control financiero

              </div>

              <h1 className="
            text-3xl
            md:text-4xl

            font-black

            tracking-tight

            text-slate-800
          ">

                Gestión de egresos

              </h1>

              <p className="
            mt-2

            text-sm
            sm:text-base

            text-slate-500
          ">
                Seguimiento y control de gastos clínicos
              </p>

            </div>

            {/* RIGHT */}

            <div className="
          bg-white/95
          backdrop-blur-md

          border
          border-slate-200/80

          rounded-[30px]

          px-6
          py-5

          shadow-[0_10px_30px_rgba(0,0,0,0.05)]

          min-w-[260px]
        ">

              <p className="
            text-xs

            uppercase

            tracking-[0.14em]

            font-black

            text-slate-400
          ">
                Balance de gastos
              </p>

              <div className="
            mt-3

            flex
            items-center
            justify-between
          ">

                <div>

                  <h3 className="
                text-3xl

                font-black

                text-indigo-600
              ">
                    RD$
                    {" "}
                    {formatMoney(totalEgresos)}
                  </h3>

                  <p className="
                mt-1

                text-xs

                font-semibold

                text-slate-500
              ">
                    Gastos registrados
                  </p>

                </div>

                <div className="
              w-14
              h-14

              rounded-[20px]

              bg-gradient-to-br
              from-indigo-500
              via-purple-500
              to-violet-500

              text-white

              flex
              items-center
              justify-center

              shadow-[0_15px_35px_rgba(99,102,241,0.25)]
            ">

                  <BadgeDollarSign size={22} />

                </div>

              </div>

            </div>

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

          bg-white/95
          backdrop-blur-md

          border
          border-slate-200/80

          rounded-[30px]

          p-5

          shadow-[0_10px_30px_rgba(0,0,0,0.05)]

          hover:-translate-y-[2px]

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

              <div className="
            flex
            items-start
            justify-between
          ">

                <div>

                  <p className="
                text-sm

                text-slate-500

                flex
                items-center
                gap-2
              ">

                    <Wallet size={14} />

                    Total egresos

                  </p>

                  <h2 className="
                mt-2

                text-3xl

                font-black

                text-rose-500
              ">

                    RD$
                    {" "}
                    {formatMoney(totalEgresos)}

                  </h2>

                </div>

                <div className="
              w-12
              h-12

              rounded-2xl

              bg-rose-50

              text-rose-500

              flex
              items-center
              justify-center
            ">

                  <TrendingDown size={20} />

                </div>

              </div>

            </div>

            {/* HOY */}

            <div className="
          relative
          overflow-hidden

          bg-white/95
          backdrop-blur-md

          border
          border-slate-200/80

          rounded-[30px]

          p-5

          shadow-[0_10px_30px_rgba(0,0,0,0.05)]

          hover:-translate-y-[2px]

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

            bg-yellow-500/10

            blur-3xl
          " />

              <div className="
            flex
            items-start
            justify-between
          ">

                <div>

                  <p className="
                text-sm

                text-slate-500

                flex
                items-center
                gap-2
              ">

                    <CalendarDays size={14} />

                    Gastado hoy

                  </p>

                  <h2 className="
                mt-2

                text-3xl

                font-black

                text-yellow-500
              ">

                    RD$
                    {" "}
                    {formatMoney(totalHoy)}

                  </h2>

                </div>

                <div className="
              w-12
              h-12

              rounded-2xl

              bg-yellow-50

              text-yellow-500

              flex
              items-center
              justify-center
            ">

                  <CalendarClock size={20} />

                </div>

              </div>

            </div>

            {/* MES */}

            <div className="
          relative
          overflow-hidden

          bg-white/95
          backdrop-blur-md

          border
          border-slate-200/80

          rounded-[30px]

          p-5

          shadow-[0_10px_30px_rgba(0,0,0,0.05)]

          hover:-translate-y-[2px]

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

              <div className="
            flex
            items-start
            justify-between
          ">

                <div>

                  <p className="
                text-sm

                text-slate-500

                flex
                items-center
                gap-2
              ">

                    <BarChart3 size={14} />

                    Total mes

                  </p>

                  <h2 className="
                mt-2

                text-3xl

                font-black

                text-indigo-600
              ">

                    RD$
                    {" "}
                    {formatMoney(totalMes)}

                  </h2>

                </div>

                <div className="
              w-12
              h-12

              rounded-2xl

              bg-indigo-50

              text-indigo-500

              flex
              items-center
              justify-center
            ">

                  <PieChart size={20} />

                </div>

              </div>

            </div>

            {/* PROMEDIO */}

            <div className="
          relative
          overflow-hidden

          bg-white/95
          backdrop-blur-md

          border
          border-slate-200/80

          rounded-[30px]

          p-5

          shadow-[0_10px_30px_rgba(0,0,0,0.05)]

          hover:-translate-y-[2px]

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

            bg-emerald-500/10

            blur-3xl
          " />

              <div className="
            flex
            items-start
            justify-between
          ">

                <div>

                  <p className="
                text-sm

                text-slate-500

                flex
                items-center
                gap-2
              ">

                    <Receipt size={14} />

                    Promedio

                  </p>

                  <h2 className="
                mt-2

                text-3xl

                font-black

                text-emerald-600
              ">

                    RD$
                    {" "}
                    {formatMoney(promedioEgreso)}

                  </h2>

                </div>

                <div className="
              w-12
              h-12

              rounded-2xl

              bg-emerald-50

              text-emerald-500

              flex
              items-center
              justify-center
            ">

                  <CircleDollarSign size={20} />

                </div>

              </div>

            </div>

          </div>

          {/* MAIN CARD */}

          <div className="
        bg-white/95
        backdrop-blur-md

        border
        border-slate-200/80

        rounded-[38px]

        shadow-[0_20px_60px_rgba(15,23,42,0.06)]

        flex
        flex-col

        h-[78vh]

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

              bg-rose-50

              border
              border-rose-100

              flex
              items-center
              gap-2

              text-sm
              font-semibold

              text-rose-500
            ">

                  <Receipt size={14} />

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

                bg-slate-50/90

                border
                border-slate-200/70

                shadow-sm

                focus:outline-none

                focus:ring-4
                focus:ring-indigo-500/10
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
                group

                relative
                overflow-hidden

                h-12

                min-w-[180px]

                px-6

                rounded-2xl

                bg-gradient-to-r
                from-indigo-500
                via-purple-500
                to-violet-500

                text-white

                font-black

                shadow-[0_15px_35px_rgba(99,102,241,0.28)]

                hover:shadow-[0_20px_45px_rgba(99,102,241,0.35)]

                hover:-translate-y-[2px]

                active:scale-95

                transition-all
                duration-300

                flex
                items-center
                justify-center
                gap-2
              "
                >

                  <Plus
                    size={18}
                    className="
                  group-hover:rotate-90

                  transition-all
                  duration-300
                "
                  />

                  Nuevo egreso

                </button>

              </div>

            </div>

            {/* LIST */}

            <div className="
          flex-1
          min-h-0

          overflow-y-auto
          overflow-x-hidden

          pr-2

          scrollbar-thin
          scrollbar-thumb-indigo-200/70
          scrollbar-track-transparent
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
                relative

                w-28
                h-28

                rounded-[34px]

                bg-gradient-to-br
                from-indigo-500
                via-purple-500
                to-violet-500

                flex
                items-center
                justify-center

                text-white

                shadow-[0_25px_60px_rgba(99,102,241,0.35)]
              ">

                    <div className="
                  absolute
                  inset-0

                  rounded-[34px]

                  bg-white/10

                  blur-xl
                " />

                    <WalletCards
                      size={42}
                      className="relative z-10"
                    />

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

                text-slate-500

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
              pt-5

              border-t
              border-slate-100

              flex
              justify-center

              shrink-0
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

        {/* MODAL */}

        {modalAbierto && (

          <BaseModal
            onClose={cerrarModal}
          >

            <EgresoModal
              egreso={egresoEditar}
              onGuardar={guardarEgreso}
              onClose={cerrarModal}
            />

          </BaseModal>

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

              showSuccess(
                "Egreso eliminado ✅"
              );

            }}

            onCancel={() =>
              setEgresoEliminar(null)
            }

          />

        )}
      </motion.div>
    </PageWrapper>
  );

}

export default EgresosPage;