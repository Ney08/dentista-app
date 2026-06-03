import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import ClienteForm from "../components/clientes/ClienteForm";
import ClienteList from "../components/clientes/ClienteList";
import ClienteDetalle from "../components/clientes/ClienteDetalle";
import PageWrapper from "../components/PageWrapper";
import { parseFechaLocal } from "../utils/fecha";
import { useClientes } from "../hooks/useClientes";
import Paginacion from "../components/Paginacion";
function ClientesPage() {

  const {
    clientes,
    eliminarCliente,
    isLoading
  } = useClientes();

  // ✅ MODAL

  const cerrarModal = () => {
    setModalAbierto(false);
    setClienteEditar(null);
  };

  const [modalAbierto, setModalAbierto] = useState(false);
  const [clienteEditar, setClienteEditar] = useState(null);

  // ✅ DETALLE
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("az");
  const [limite, setLimite] = useState(5);
  const [pagina, setPagina] = useState(1);

  // ✅ FILTRO
  const filtrados = clientes.filter(c =>
    `${c.nombre} ${c.apellido || ""}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  // ✅ ORDEN

  const ordenados = [...filtrados].sort((a, b) => {

    if (orden === "az") {
      return a.nombre.localeCompare(b.nombre);
    }

    if (orden === "nuevo") {
      return b.id - a.id; // ✅ MÁS NUEVO PRIMERO
    }

    return 0;
  });



  // ✅ PAGINACIÓN
  const inicio = (pagina - 1) * (limite === "all" ? ordenados.length : limite);
  const fin = limite === "all" ? undefined : inicio + limite;

  const clientesFinal =
    limite === "all"
      ? ordenados
      : ordenados.slice(inicio, fin);

  const totalPaginas =
    limite === "all"
      ? 1
      : Math.ceil(ordenados.length / limite);

  // ✅ ELIMINAR
  const handleEliminar = async (id) => {
    try {
      await eliminarCliente.mutateAsync(id);
      toast.success("Cliente eliminado ✅");
    } catch {
      toast.error("Error al eliminar ❌");
    }
  };

  useEffect(() => {
    if (pagina > totalPaginas) {
      setPagina(1);
    }
  }, [ordenados.length]);

  // ✅ LOADING
  if (isLoading) {
    return (
      <PageWrapper>
        <div className="animate-pulse text-center space-y-4">
          <div className="h-6 bg-gray-300 rounded w-1/3 mx-auto"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto"></div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>

      <div className="space-y-4 pb-4">

        {/* ✅ HEADER MEJORADO */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight flex items-center justify-center gap-2">
            Clientes <span className="text-xl">👤</span>
          </h1>
          <p className="text-gray-500 text-sm">
            Gestiona los clientes del sistema
          </p>
        </div>

        {/* ✅ CARD PRINCIPAL */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex flex-col h-[71vh]">
          <div className="space-y-4 pb-4">
            {/* HEADER LISTA */}
            <div className="flex justify-between items-center">

              <p className="text-sm text-gray-500">
                Total: {clientes.length}
              </p>

              <button
                onClick={() => {
                  setClienteEditar(null);
                  setModalAbierto(true);
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm shadow"
              >
                + Nuevo
              </button>

            </div>

            {/* BUSCADOR */}
            <input
              type="text"
              placeholder="🔍 Buscar cliente..."
              className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition"
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPagina(1);
              }}
            />

            {/* CONTROLES */}
            <div className="flex flex-wrap justify-between items-center gap-4">

              <div className="flex items-center gap-2 text-sm">
                <span>Orden:</span>
                <select
                  value={orden}
                  onChange={(e) => setOrden(e.target.value)}
                  className="border px-2 py-1 rounded"
                >
                  <option value="az">A-Z</option>
                  <option value="nuevo">Más recientes</option>
                </select>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span>Mostrar:</span>
                <select
                  value={limite}
                  onChange={(e) => {
                    const val = e.target.value === "all"
                      ? "all"
                      : parseInt(e.target.value);

                    setLimite(val);
                    setPagina(1);
                  }}
                  className="border px-2 py-1 rounded"
                >

                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={50}>50</option>
                  <option value="all">Todos</option>

                </select>
              </div>

            </div>
          </div>
          {/* LISTA */}
          <div className="flex-1 min-h-0 overflow-y-auto pr-2 pb-6">

            {clientesFinal.length === 0 ? (
              <p className="text-center text-gray-500">
                No hay clientes
              </p>
            ) : (

              <div className="space-y-2">

                <ClienteList
                  clientes={clientesFinal}
                  onEliminarClick={handleEliminar}
                  onEditarClick={(c) => {
                    setClienteEditar(c);
                    setModalAbierto(true);
                  }}
                  onSeleccionar={(c) => setClienteSeleccionado(c)}
                />
              </div>
            )}
          </div>
          {/* PAGINACIÓN */}
          {limite !== "all" && totalPaginas > 1 && (
            <div className="mt-auto pt-4 border-t">
              <Paginacion
                pagina={pagina}
                totalPaginas={totalPaginas}
                onChange={setPagina}
              />
            </div>
          )}

        </div>

        {/* ✅ DETALLE INTERACTIVO */}
        {clienteSeleccionado && (
          <div className="bg-white p-5 rounded-2xl border shadow-md animate-fadeIn">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Detalle del cliente
              </h3>

              <button
                onClick={() => setClienteSeleccionado(null)}
                className="text-sm text-gray-400 hover:text-gray-600"
              >
                Cerrar
              </button>
            </div>

            <ClienteDetalle cliente={clienteSeleccionado} />
          </div>
        )}

      </div>

      {/* ✅ MODAL CON ANIMACIÓN */}

      <div
        onClick={cerrarModal}
        className={`
    fixed inset-0 z-50 flex items-center justify-center
    transition-all duration-200 ease-out
    ${modalAbierto
            ? "opacity-100 visible bg-black/40 backdrop-blur-md"
            : "opacity-0 invisible"}
  `}
      >


        <div
          onClick={(e) => e.stopPropagation()}
          className={`
      w-full max-w-3xl p-6
      transform transition-all duration-200 ease-out
      ${modalAbierto
              ? "scale-100 opacity-100 translate-y-0"
              : "scale-95 opacity-0 translate-y-6"}
    `}
        >

          <ClienteForm
            cliente={clienteEditar}
            onClose={cerrarModal}
          />
        </div>
      </div>

    </PageWrapper>
  );
}

export default ClientesPage;