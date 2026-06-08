import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { useLocation, useNavigate } from "react-router-dom";

import PageWrapper from "../components/PageWrapper";
import CitaForm from "../components/citas/CitaForm";
import CitaList from "../components/citas/CitaList";
import Paginacion from "../components/Paginacion";
import SkeletonLoader from "../components/SkeletonLoader";
import BaseModal from "../components/BaseModal";
import { useClientes } from "../hooks/useClientes";
import { useCitas } from "../hooks/useCitas";

import { parseFechaLocal } from "../utils/fecha";

function CitasPage() {

  const location = useLocation();

  const navigate = useNavigate();

  const clienteDesdeClientes =
    location.state?.clienteSeleccionado;

  /*
  ==========================================
  MODAL
  ==========================================
  */

  const [modalAbierto, setModalAbierto] =
    useState(false);

  const [animar, setAnimar] =
    useState(false);

  const [citaEditar, setCitaEditar] =
    useState(null);

  const [clientePresetLocal, setClientePresetLocal] =
    useState(null);

  /*
  ==========================================
  FILTROS
  ==========================================
  */

  const [filtro, setFiltro] =
    useState("hoy");

  const [pagina, setPagina] =
    useState(1);

  const [porPagina, setPorPagina] =
    useState(7);

  /*
  ==========================================
  DATA
  ==========================================
  */

  const { clientes } =
    useClientes();

  const {
    citas,
    cancelarCita,
    isLoading
  } = useCitas();

  /*
  ==========================================
  FECHAS
  ==========================================
  */

  const hoy = new Date();

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
  CLIENTE PRESET
  ==========================================
  */

  useEffect(() => {

    if (clienteDesdeClientes) {

      setClientePresetLocal(
        clienteDesdeClientes
      );

      setModalAbierto(true);

      window.history.replaceState(
        {},
        document.title
      );

    }

  }, [clienteDesdeClientes]);

  /*
  ==========================================
  ESTADO CITA
  ==========================================
  */

  const getEstado = (c) => {

    if (c.estado === "cancelada") {
      return "cancelada";
    }

    if (c.estado === "completada") {
      return "completada";
    }

    const fecha =
      parseFechaLocal(c.fecha);

    const ahora =
      new Date();

    if (fecha < ahora) {
      return "atrasada";
    }

    return "pendiente";

  };

  /*
  ==========================================
  FILTROS
  ==========================================
  */

  const citasFiltradas =
    citas.filter(c => {

      const fecha =
        parseFechaLocal(c.fecha);

      if (filtro === "hoy") {

        return (
          fecha.getDate() === hoy.getDate() &&
          fecha.getMonth() === hoy.getMonth() &&
          fecha.getFullYear() === hoy.getFullYear()
        );

      }

      if (filtro === "pendientes") {

        return getEstado(c) === "pendiente";

      }

      if (filtro === "atrasadas") {

        return getEstado(c) === "atrasada";

      }

      if (filtro === "completadas") {

        return c.estado === "completada";

      }

      if (filtro === "canceladas") {

        return c.estado === "cancelada";

      }

      return true;

    });

  /*
  ==========================================
  KPIS
  ==========================================
  */

  const citasActivas =
    citas.filter(
      c => c.estado !== "cancelada"
    );

  const pendientes =
    citasActivas.filter(
      c => getEstado(c) === "pendiente"
    ).length;

  const atrasadas =
    citasActivas.filter(
      c => getEstado(c) === "atrasada"
    ).length;

  const completadas =
    citasActivas.filter(
      c => getEstado(c) === "completada"
    ).length;

  const canceladas =
    citas.filter(
      c => c.estado === "cancelada"
    ).length;

  const hoyCount =
    citas.filter(c => {

      const fecha =
        parseFechaLocal(c.fecha);

      return (
        fecha.getDate() === hoy.getDate() &&
        fecha.getMonth() === hoy.getMonth() &&
        fecha.getFullYear() === hoy.getFullYear()
      );

    }).length;

  /*
  ==========================================
  ORDEN
  ==========================================
  */

  const ordenadas =
    [...citasFiltradas].sort(
      (a, b) =>
        new Date(a.fecha) -
        new Date(b.fecha)
    );

  /*
  ==========================================
  PAGINACION
  ==========================================
  */

  const inicio =
    porPagina === "all"
      ? 0
      : (pagina - 1) * porPagina;

  const fin =
    porPagina === "all"
      ? undefined
      : inicio + porPagina;

  const totalPaginas =
    porPagina === "all"
      ? 1
      : Math.ceil(
        ordenadas.length / porPagina
      );

  const citasPaginadas =
    porPagina === "all"
      ? ordenadas
      : ordenadas.slice(inicio, fin);

  /*
  ==========================================
  EFFECTS
  ==========================================
  */

  useEffect(() => {

    if (pagina > totalPaginas) {

      setPagina(1);

    }

  }, [ordenadas.length]);

  /*
  ==========================================
  ACTIONS
  ==========================================
  */

  const abrirCrear = () => {

    setCitaEditar(null);

    setModalAbierto(true);

  };

  const abrirEditar = (c) => {

    setCitaEditar(c);

    setModalAbierto(true);

  };

  const cerrarModal = () => {

    setModalAbierto(false);

    setCitaEditar(null);

    setClientePresetLocal(null);

  };

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
              Citas
            </span>

            <span className="ml-2">
              📅
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
            Gestiona las citas del sistema
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

              bg-blue-500/10

              blur-3xl
            " />

            <p className="
              text-sm
              text-gray-500
            ">
              📅 Citas hoy
            </p>

            <h2 className="
              mt-2
              text-4xl
              font-black
              text-blue-600
            ">
              {hoyCount}
            </h2>

          </div>

          {/* PENDIENTES */}

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

              bg-yellow-500/10

              blur-3xl
            " />

            <p className="
              text-sm
              text-gray-500
            ">
              🟡 Pendientes
            </p>

            <h2 className="
              mt-2
              text-4xl
              font-black
              text-yellow-500
            ">
              {pendientes}
            </h2>

          </div>

          {/* COMPLETADAS */}

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

              bg-emerald-500/10

              blur-3xl
            " />

            <p className="
              text-sm
              text-gray-500
            ">
              ✅ Completadas
            </p>

            <h2 className="
              mt-2
              text-4xl
              font-black
              text-emerald-600
            ">
              {completadas}
            </h2>

          </div>

          {/* ATRASADAS */}

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
              🔴 Atrasadas
            </p>

            <h2 className="
              mt-2
              text-4xl
              font-black
              text-rose-500
            ">
              {atrasadas}
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

            {/* FILTROS */}

            <div className="
              bg-white/80
              backdrop-blur-xl

              rounded-[28px]

              border
              border-white/40

              p-2

              shadow-sm

              overflow-x-auto

              no-scrollbar
            ">

              <div className="
                flex
                gap-2
                min-w-max
              ">

                {[
                  {
                    key: "hoy",
                    label: "Hoy",
                    count: hoyCount
                  },
                  {
                    key: "pendientes",
                    label: "Pendientes",
                    count: pendientes
                  },
                  {
                    key: "atrasadas",
                    label: "Atrasadas",
                    count: atrasadas
                  },
                  {
                    key: "completadas",
                    label: "Completadas",
                    count: completadas
                  },
                  {
                    key: "canceladas",
                    label: "Canceladas",
                    count: canceladas
                  },
                  {
                    key: "all",
                    label: "Todas",
                    count: citas.length
                  }
                ].map(item => (

                  <button
                    key={item.key}
                    onClick={() => {

                      setFiltro(item.key);

                      setPagina(1);

                    }}
                    className={`
                      flex
                      items-center
                      gap-2

                      px-5
                      h-11

                      rounded-2xl

                      whitespace-nowrap

                      text-sm
                      font-semibold

                      transition-all
                      duration-300

                      active:scale-[0.98]

                      ${filtro === item.key
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-200/40"
                        : "bg-gray-100 hover:bg-gray-200 text-slate-700"
                      }
                    `}
                  >

                    <span>
                      {item.label}
                    </span>

                    <span className={`
                      px-2
                      py-0.5

                      rounded-full

                      text-xs
                      font-bold

                      ${filtro === item.key
                        ? "bg-white/20 text-white"
                        : "bg-white text-slate-700"
                      }
                    `}>
                      {item.count}
                    </span>

                  </button>

                ))}

              </div>

            </div>

            {/* RIGHT */}

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

                  if (val === "all") {

                    setFiltro("all");

                  } else {

                    setFiltro("hoy");

                  }

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
                + Nueva cita
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

            {citasPaginadas.length === 0 ? (

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
                  from-indigo-500
                  via-purple-500
                  to-violet-500

                  flex
                  items-center
                  justify-center

                  text-5xl
                  text-white

                  shadow-[0_20px_50px_rgba(99,102,241,0.35)]
                ">
                  📅
                </div>

                <h3 className="
                  mt-6

                  text-3xl

                  font-black

                  text-slate-800
                ">
                  No hay citas
                </h3>

                <p className="
                  mt-3

                  text-gray-500

                  max-w-sm
                ">
                  Las citas agendadas aparecerán aquí automáticamente
                </p>

              </div>

            ) : (

              <CitaList
                citas={citasPaginadas}
                getEstado={getEstado}
                porPagina={porPagina}
                onEditar={abrirEditar}
                onCompletar={(cita) => {

                  sessionStorage.setItem(
                    "citaPreset",
                    JSON.stringify(cita)
                  );

                  navigate(
                    "/facturaciones"
                  );

                }}
                onCancelar={async (id) => {

                  await cancelarCita.mutateAsync(
                    id
                  );

                  toast.success(
                    "Cancelada ✅"
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

      {/* FORM MODAL */}
      {modalAbierto && (

        <BaseModal
          onClose={cerrarModal}
        >

          <CitaForm
            key={
              citaEditar?.id ||
              clientePresetLocal?.id ||
              "nuevo"
            }
            clientes={clientes}
            cita={citaEditar}
            clientePreset={clientePresetLocal}
            onCrear={cerrarModal}
            onClose={cerrarModal}
          />

        </BaseModal>

      )}




    </PageWrapper >
  );

}

export default CitasPage;