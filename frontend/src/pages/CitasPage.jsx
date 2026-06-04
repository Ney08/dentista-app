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
    const f = parseFechaLocal(c.fecha);

    if (filtro === "hoy") {
      return (
        f.getDate() === hoy.getDate() &&
        f.getMonth() === hoy.getMonth() &&
        f.getFullYear() === hoy.getFullYear()
      );
    }

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

      <div className="space-y-4 pb-4 ">

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Citas 📅</h1>
          <p className="text-gray-500 text-sm">
            Gestiona las citas del sistema
          </p>
        </div>

        {/* CARD PRINCIPAL */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex flex-col h-[70vh] ">
          <div className="space-y-4 pb-4">
            {/* TOP BAR */}
            <div className="flex flex-wrap justify-between items-center gap-3">

              {/* IZQUIERDA */}
              <div className="flex gap-2 flex-wrap">

                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm">
                  🟡 {pendientes}
                </span>

                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm">
                  🔴 {atrasadas}
                </span>

                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm">
                  ✅ {completadas}
                </span>

                <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm">
                  ⛔ {canceladas}
                </span>

              </div>

              {/* DERECHA */}
              <div className="flex gap-2 items-center">
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
                  className="border px-2 py-1 rounded text-sm"
                >
                  <option value={7}>7</option>
                  <option value={12}>12</option>
                  <option value={20}>20</option>
                  <option value="all">Todos</option>
                </select>


                <button
                  onClick={abrirCrear}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm shadow"
                >
                  + Nueva
                </button>

              </div>

            </div>
          </div>
          {/* ✅ LISTA CON SCROLL PRO */}
          <div
            className={`
        space-y-3 pr-2
        
${citas.length > 7
                ? "max-h-[730px] overflow-y-auto"
                : ""
              }

      `}
          >

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
            <div className="mt-auto pt-4 border-t">
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
    fixed inset-0 z-50 flex items-center justify-center
    transition-all duration-200 ease-out
    ${modalAbierto ? "visible" : "invisible"}
    ${animar
              ? "opacity-100 bg-black/40 backdrop-blur-md"
              : "opacity-0"}
  `}
        >




          <div
            onClick={(e) => e.stopPropagation()}
            className={`
    w-full max-w-3xl p-6
    transform transition-all duration-200 ease-out
    ${animar
                ? "scale-100 opacity-100 translate-y-0"
                : "scale-95 opacity-0 translate-y-6"}
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