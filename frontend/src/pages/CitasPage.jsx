import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

import PageWrapper from "../components/PageWrapper";
import CitaForm from "../components/citas/CitaForm";
import CitaList from "../components/citas/CitaList";
import Paginacion from "../components/Paginacion";
import SkeletonLoader from "../components/SkeletonLoader";
import BaseModal from "../components/BaseModal";
import {
  Search,
  Plus,
  Wallet,
  BadgeDollarSign,
  Receipt,
  AlertTriangle,
  FileText,
  CalendarClock,
  CalendarCheck,
  Siren,
  BadgeCheck,
  Clock3,
  TimerReset,
  CheckCircle2,
  CalendarDays
} from "lucide-react";
import {
  useClientes
} from "../hooks/useClientes";

import {
  useCitas
} from "../hooks/useCitas";

import {
  parseFechaLocal
} from "../utils/fecha";

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

  const {
    clientes
  } = useClientes();

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
          w-full

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

          <SkeletonLoader alto="h-[600px]" />

        </div>

      </PageWrapper>

    );

  }

return (

  <PageWrapper>

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

            <CalendarDays size={14} />

            Agenda clínica

          </div>

          <h1 className="
            text-3xl
            md:text-4xl

            font-black

            tracking-tight

            text-slate-800
          ">

            Gestión de citas

          </h1>

          <p className="
            mt-2

            text-sm
            sm:text-base

            text-slate-500
          ">
            Control y seguimiento de citas odontologicas
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

          min-w-[250px]
        ">

          <p className="
            text-xs

            uppercase

            tracking-[0.14em]

            font-black

            text-slate-400
          ">
            Próxima jornada
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
                {pendientes}
              </h3>

              <p className="
                mt-1

                text-xs

                font-semibold

                text-slate-500
              ">
                Citas pendientes
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

              <CalendarClock size={22} />

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

            bg-blue-500/10

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

                Citas hoy

              </p>

              <h2 className="
                mt-2

                text-3xl

                font-black

                text-blue-600
              ">
                {hoyCount}
              </h2>

            </div>

            <div className="
              w-12
              h-12

              rounded-2xl

              bg-blue-50

              text-blue-500

              flex
              items-center
              justify-center
            ">

              <CalendarCheck size={20} />

            </div>

          </div>

        </div>

        {/* PENDIENTES */}

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

                <Clock3 size={14} />

                Pendientes

              </p>

              <h2 className="
                mt-2

                text-3xl

                font-black

                text-yellow-500
              ">
                {pendientes}
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

              <TimerReset size={20} />

            </div>

          </div>

        </div>

        {/* COMPLETADAS */}

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

                <CheckCircle2 size={14} />

                Completadas

              </p>

              <h2 className="
                mt-2

                text-3xl

                font-black

                text-emerald-600
              ">
                {completadas}
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

              <BadgeCheck size={20} />

            </div>

          </div>

        </div>

        {/* ATRASADAS */}

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

                <AlertTriangle size={14} />

                Atrasadas

              </p>

              <h2 className="
                mt-2

                text-3xl

                font-black

                text-rose-500
              ">
                {atrasadas}
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

              <Siren size={20} />

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

          {/* FILTROS */}

          <div className="
            bg-slate-50/90

            rounded-[26px]

            border
            border-slate-200/70

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

                    border

                    transition-all
                    duration-300

                    active:scale-[0.98]

                    ${filtro === item.key
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent shadow-lg shadow-indigo-200/40"
                      : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200/70"
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
                      : "bg-slate-100 text-slate-700"
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

                bg-white

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

              Nueva cita

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

                <CalendarDays
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
                No hay citas
              </h3>

              <p className="
                mt-3

                text-slate-500

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

  </PageWrapper>
);

}

export default CitasPage;
