import { useState, } from "react";
import toast from "react-hot-toast";
import CitaList from "../components/citas/CitaList";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import PageWrapper from "../components/PageWrapper";
import CitaForm from "../components/citas/CitaForm";
import { useClientes } from "../hooks/useClientes";
import { useCitas } from "../hooks/useCitas";
import { formatFecha, formatHora, parseFechaLocal } from "../utils/fecha";
import Paginacion from "../components/Paginacion";
import SkeletonLoader from "../components/SkeletonLoader";


function CitasPage() {
  const location = useLocation();
  const clienteDesdeClientes = location.state?.clienteSeleccionado;
  const [modalAbierto, setModalAbierto] = useState(false);
  const { clientes } = useClientes();
  const [clientePresetLocal, setClientePresetLocal] = useState(null);
  const [animar, setAnimar] = useState(false);
  const [porPagina, setPorPagina] = useState(7);
  const [pagina, setPagina] = useState(1);
  const [limite, setLimite] = useState(7);
  const navigate = useNavigate();



  useEffect(() => {
    if (modalAbierto) {
      setTimeout(() => setAnimar(true), 10);
    } else {
      setAnimar(false);
    }
  }, [modalAbierto]);

  useEffect(() => {
    if (clienteDesdeClientes) {
      setClientePresetLocal(clienteDesdeClientes);
      setModalAbierto(true);

      window.history.replaceState({}, document.title);
    }
  }, [clienteDesdeClientes]);


  const {
    citas,
    completarCita,
    cancelarCita,
    isLoading
  } = useCitas();




  const [citaEditar, setCitaEditar] = useState(null);
  const [filtro, setFiltro] = useState("hoy");

  const hoy = new Date();

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


  const getEstado = (c) => {
    if (c.estado === "cancelada") return "cancelada";
    if (c.estado === "completada") return "completada";

    const fecha = parseFechaLocal(c.fecha);
    const ahora = new Date();

    if (fecha < ahora) return "atrasada";

    return "pendiente";
  };

  const citasFiltradas = citas.filter(c => {

    const fecha = parseFechaLocal(c.fecha);

    // ✅ HOY
    if (filtro === "hoy") {

      return (
        fecha.getDate() === hoy.getDate() &&
        fecha.getMonth() === hoy.getMonth() &&
        fecha.getFullYear() === hoy.getFullYear()
      );

    }

    // ✅ PENDIENTES
    if (filtro === "pendientes") {

      return getEstado(c) === "pendiente";

    }

    // ✅ ATRASADAS
    if (filtro === "atrasadas") {

      return getEstado(c) === "atrasada";

    }

    // ✅ COMPLETADAS
    if (filtro === "completadas") {

      return c.estado === "completada";

    }

    // ✅ CANCELADAS
    if (filtro === "canceladas") {

      return c.estado === "cancelada";

    }

    // ✅ TODAS
    return true;

  });

  const citasActivas = citas.filter(c => c.estado !== "cancelada");

  const pendientes = citasActivas.filter(c => getEstado(c) === "pendiente").length;
  const atrasadas = citasActivas.filter(c => getEstado(c) === "atrasada").length;
  const completadas = citasActivas.filter(c => getEstado(c) === "completada").length;
  const canceladas = citas.filter(c => c.estado === "cancelada").length;
  const ordenadas = [...citasFiltradas].sort(
    (a, b) => new Date(a.fecha) - new Date(b.fecha)
  );



  const inicio =
    porPagina === "all"
      ? 0
      : (pagina - 1) * porPagina;


  const totalPaginas =
    porPagina === "all"
      ? 1
      : Math.ceil(ordenadas.length / porPagina);


  const fin =
    porPagina === "all"
      ? undefined
      : inicio + porPagina;



  const citasPaginadas =
    porPagina === "all"
      ? ordenadas
      : ordenadas.slice(inicio, fin);



  useEffect(() => {
    if (pagina > totalPaginas) {
      setPagina(1);
    }
  }, [ordenadas.length]);

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
            <SkeletonLoader alto="h-24" />

          </div>

        </div>

      </PageWrapper>
    );
  }


  return (
    <PageWrapper>

      <div className="h-full flex flex-col gap-4 md:gap-5 pb-4 overflow-hidden">

        {/* HEADER */}
        <div className="text-center pt-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Citas 📅</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Gestiona las citas del sistema
          </p>
        </div>

        {/* CARD PRINCIPAL */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-[72vh] sm:h-[75vh] lg:h-[78vh] p-4 sm:p-5 gap-4 overflow-hidden">
          <div className="space-y-4 pb-4">
            {/* TOP BAR */}
            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">

              {/* IZQUIERDA */}
              <div className="flex flex-wrap gap-2">

                {/* <span className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-sm">
                  🟡 {pendientes}
                </span>

                <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm">
                  🔴 {atrasadas}
                </span>

                <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm">
                  ✅ {completadas}
                </span>

                <span className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm">
                  ⛔ {canceladas}
                </span> */}
                
              </div>
              {/* ✅ FILTROS PREMIUM */}
<div className="
  sticky top-0 z-20
  bg-white
  rounded-2xl
  border border-gray-200
  p-2
  shadow-sm
  overflow-x-auto
  no-scrollbar
">

  <div className="flex gap-2 min-w-max">

    {/* ✅ HOY */}
    <button
      onClick={() => {
        setFiltro("hoy");
        setPagina(1);
      }}
      className={`
        flex items-center gap-2
        px-4 sm:px-5 h-10 sm:h-11
        rounded-2xl
        whitespace-nowrap
        text-sm font-medium
        transition-all duration-200
        active:scale-[0.98]

        ${filtro === "hoy"
          ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm"
          : "bg-gray-100 hover:bg-gray-200 text-gray-700"}
      `}
    >
      <span>Hoy</span>

      <span className={`
        px-2 py-0.5 rounded-full text-xs font-semibold

        ${filtro === "hoy"
          ? "bg-white/20 text-white"
          : "bg-blue-100 text-blue-700"}
      `}>
        {
          citas.filter(c => {

            const fecha = parseFechaLocal(c.fecha);

            return (
              fecha.getDate() === hoy.getDate() &&
              fecha.getMonth() === hoy.getMonth() &&
              fecha.getFullYear() === hoy.getFullYear()
            );

          }).length
        }
      </span>
    </button>

    {/* ✅ PENDIENTES */}
    <button
      onClick={() => {
        setFiltro("pendientes");
        setPagina(1);
      }}
      className={`
        flex items-center gap-2
        px-4 sm:px-5 h-10 sm:h-11
        rounded-2xl
        whitespace-nowrap
        text-sm font-medium
        transition-all duration-200
        active:scale-[0.98]

        ${filtro === "pendientes"
          ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm"
          : "bg-gray-100 hover:bg-yellow-50 text-yellow-700"}
      `}
    >
      <span>Pendientes</span>

      <span className={`
        px-2 py-0.5 rounded-full text-xs font-semibold

        ${filtro === "pendientes"
          ? "bg-white/20 text-white"
          : "bg-yellow-100 text-yellow-700"}
      `}>
        {pendientes}
      </span>
    </button>

    {/* ✅ ATRASADAS */}
    <button
      onClick={() => {
        setFiltro("atrasadas");
        setPagina(1);
      }}
      className={`
        flex items-center gap-2
        px-4 sm:px-5 h-10 sm:h-11
        rounded-2xl
        whitespace-nowrap
        text-sm font-medium
        transition-all duration-200
        active:scale-[0.98]

        ${filtro === "atrasadas"
          ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm"
          : "bg-gray-100 hover:bg-red-50 text-red-700"}
      `}
    >
      <span>Atrasadas</span>

      <span className={`
        px-2 py-0.5 rounded-full text-xs font-semibold

        ${filtro === "atrasadas"
          ? "bg-white/20 text-white"
          : "bg-red-100 text-red-700"}
      `}>
        {atrasadas}
      </span>
    </button>

    {/* ✅ COMPLETADAS */}
    <button
      onClick={() => {
        setFiltro("completadas");
        setPagina(1);
      }}
      className={`
        flex items-center gap-2
        px-4 sm:px-5 h-10 sm:h-11
        rounded-2xl
        whitespace-nowrap
        text-sm font-medium
        transition-all duration-200
        active:scale-[0.98]

        ${filtro === "completadas"
          ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm"
          : "bg-gray-100 hover:bg-green-50 text-green-700"}
      `}
    >
      <span>Completadas</span>

      <span className={`
        px-2 py-0.5 rounded-full text-xs font-semibold

        ${filtro === "completadas"
          ? "bg-white/20 text-white"
          : "bg-green-100 text-green-700"}
      `}>
        {completadas}
      </span>
    </button>

    {/* ✅ CANCELADAS */}
    <button
      onClick={() => {
        setFiltro("canceladas");
        setPagina(1);
      }}
      className={`
        flex items-center gap-2
        px-4 sm:px-5 h-10 sm:h-11
        rounded-2xl
        whitespace-nowrap
        text-sm font-medium
        transition-all duration-200
        active:scale-[0.98]

        ${filtro === "canceladas"
          ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm"
          : "bg-gray-100 hover:bg-gray-200 text-gray-700"}
      `}
    >
      <span>Canceladas</span>

      <span className={`
        px-2 py-0.5 rounded-full text-xs font-semibold

        ${filtro === "canceladas"
          ? "bg-white/20 text-white"
          : "bg-gray-200 text-gray-700"}
      `}>
        {canceladas}
      </span>
    </button>

    {/* ✅ TODAS */}
    <button
      onClick={() => {
        setFiltro("all");
        setPagina(1);
      }}
      className={`
        flex items-center gap-2
        px-4 sm:px-5 h-10 sm:h-11
        rounded-2xl
        whitespace-nowrap
        text-sm font-medium
        transition-all duration-200
        active:scale-[0.98]

        ${filtro === "all"
          ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm"
          : "bg-gray-100 hover:bg-gray-200 text-gray-700"}
      `}
    >
      <span>Todas</span>

      <span className={`
        px-2 py-0.5 rounded-full text-xs font-semibold

        ${filtro === "all"
          ? "bg-white/20 text-white"
          : "bg-black text-white"}
      `}>
        {citas.length}
      </span>
    </button>

  </div>

</div>
              {/* DERECHA */}
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full lg:w-auto">
                <select
                  value={porPagina}
                  onChange={(e) => {
                    const val =
                      e.target.value === "all"
                        ? "all"
                        : parseInt(e.target.value);

                    setPorPagina(val);

                    // ✅ si elige Todos, mostrar todas las citas sin importar el día
                    if (val === "all") {
                      setFiltro("all");
                    } else {
                      // ✅ si vuelve a paginación normal, mantener por defecto solo hoy
                      setFiltro("hoy");
                    }

                    setPagina(1);
                  }}
                  className="w-full sm:w-auto border px-3 h-11 rounded-xl text-sm sm:text-base"
                >
                  <option value={7}>7</option>
                  <option value={14}>14</option>
                  <option value={28}>28</option>
                  <option value="all">Todos</option>
                </select>


                <button
                  onClick={abrirCrear}
                  className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-4 h-11 rounded-xl text-sm sm:text-base shadow-sm active:scale-[0.98] transition"
                >
                  + Nueva
                </button>

              </div>

            </div>
          </div>
          {/* ✅ LISTA CON SCROLL PRO */}
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-1">

            <CitaList
              citas={citasPaginadas}
              getEstado={getEstado}
              onEditar={abrirEditar}

              onCompletar={(cita) => {



                sessionStorage.setItem(
                  "citaPreset",
                  JSON.stringify(cita)
                );

                navigate("/facturaciones");



              }}

              porPagina={porPagina}
              onCancelar={async (id) => {
                await cancelarCita.mutateAsync(id);
                toast.success("Cancelada");
              }}
            />

          </div>
          {/* PAGINACIÓN */}
          {porPagina !== "all" && totalPaginas > 1 && (
            <div className="pt-3 border-t overflow-x-auto">
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

        <div
          onClick={cerrarModal}
          className={`
    fixed inset-0 z-50

    flex items-end md:items-center
    justify-center

    bg-black/40 backdrop-blur-md

    transition-all duration-300

    ${modalAbierto
              ? "opacity-100 visible"
              : "opacity-0 invisible"}
  `}
        >




          <div
            onClick={(e) => e.stopPropagation()}

            className={`
  w-full h-full md:h-auto
  md:max-w-3xl

  p-0 md:p-4

    
${animar
                ? "translate-y-0 md:scale-100 opacity-100"
                : "translate-y-full md:translate-y-0 md:scale-95 opacity-0"}

  `}
          >


            <CitaForm
              key={citaEditar?.id || clientePresetLocal?.id || "nuevo"}
              clientes={clientes}
              cita={citaEditar}
              clientePreset={clientePresetLocal}
              onCrear={cerrarModal}
              onClose={cerrarModal}
            />

          </div>
        </div>

      )}

    </PageWrapper>
  );
}

export default CitasPage;