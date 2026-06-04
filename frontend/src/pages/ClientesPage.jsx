import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";
import ClienteForm from "../components/clientes/ClienteForm";
import ClienteList from "../components/clientes/ClienteList";
import ClienteDetalle from "../components/clientes/ClienteDetalle";
import PageWrapper from "../components/PageWrapper";
//import { parseFechaLocal } from "../utils/fecha";
import { useClientes } from "../hooks/useClientes";
import Paginacion from "../components/Paginacion";
import BaseModal from "../components/BaseModal";

function ClientesPage() {

  const [mostrarActivos, setMostrarActivos] = useState(true);
  const {
    clientes,
    toggleCliente,
    isLoading
  } = useClientes(mostrarActivos);


  // ✅ MODAL

  const cerrarModal = () => {
    setModalAbierto(false);
    setClienteEditar(null);
  };


  const [modalAbierto, setModalAbierto] = useState(false);
  const [clienteEditar, setClienteEditar] = useState(null);
  const [clienteADesactivar, setClienteADesactivar] = useState(null);
  // ✅ DETALLE
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("az");
  const [limite, setLimite] = useState(6);
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
  // const handleEliminar = async (id) => {
  //   try {
  //     await eliminarCliente.mutateAsync(id);
  //     toast.success("Cliente eliminado ✅");
  //   } catch {
  //     toast.error("Error al eliminar ❌");
  //   }
  // };

  const handleToggleActivo = (cliente) => {

    if (cliente.activo) {
      setClienteADesactivar(cliente);
    } else {
      toggleCliente.mutate(cliente);
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

      <div className="max-w-6xl mx-auto space-y-6 pb-6">

        {/* ✅ HEADER */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
            Clientes 👤
          </h1>
          <p className="text-gray-500 text-sm">
            Gestiona los clientes del sistema
          </p>
        </div>

        {/* ✅ CARD PRINCIPAL */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-col h-[75vh] space-y-4">

          {/* ✅ TOOLBAR */}
          <div className="flex flex-wrap justify-between items-center gap-3">

            <p className="text-sm text-gray-500">
              Total: <span className="font-semibold">{clientes.length}</span>
            </p>

            <button
              onClick={() => {
                setClienteEditar(null);
                setModalAbierto(true);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm shadow-sm transition"
            >
              + Nuevo
            </button>

          </div>

          {/* ✅ BUSCADOR + FILTROS */}
          <div className="flex flex-col md:flex-row gap-3">

            {/* BUSCADOR */}
            <input
              type="text"
              placeholder="🔍 Buscar cliente..."
              className="flex-1 border border-gray-200 px-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPagina(1);
              }}
            />

            {/* FILTROS */}
            <div className="flex gap-3 text-sm">

              <select
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
                className="border px-2 py-2 rounded-lg"
              >
                <option value="az">A-Z</option>
                <option value="nuevo">Más recientes</option>
              </select>

              <select
                value={limite}
                onChange={(e) => {
                  const val = e.target.value === "all"
                    ? "all"
                    : parseInt(e.target.value);

                  setLimite(val);
                  setPagina(1);
                }}
                className="border px-2 py-2 rounded-lg"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={50}>50</option>
                <option value="all">Todos</option>
              </select>

            </div>

          </div>

          {/* ✅ LISTA */}
          <div className="flex-1 min-h-0 overflow-y-auto pr-2 space-y-3">

            {clientesFinal.length === 0 ? (
              <p className="text-center text-gray-500">
                No hay clientes
              </p>
            ) : (

              <ClienteList
                clientes={clientesFinal}
                onToggleActivo={(cliente) => handleToggleActivo(cliente)}
                onEditarClick={(c) => {
                  setClienteEditar(c);
                  setModalAbierto(true);
                }}
                onSeleccionar={(c) => setClienteSeleccionado(c)}
              />

            )}

          </div>

          {/* ✅ PAGINACIÓN */}
          {limite !== "all" && totalPaginas > 1 && (
            <div className="pt-4 border-t flex justify-center">

              <div className="flex gap-2">

                <Paginacion
                  pagina={pagina}
                  totalPaginas={totalPaginas}
                  onChange={setPagina}
                />

              </div>

            </div>
          )}

        </div>

        {/* ✅ MODAL DETALLE PRO */}
        {clienteSeleccionado && (
          <BaseModal onClose={() => setClienteSeleccionado(null)}>

            <div className="space-y-5">

              {/* ✅ HEADER PRO */}
              <div className="flex justify-between items-start">

                <div className="flex items-center gap-3">

                  {/* AVATAR */}
                  <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold shadow-sm">
                    {clienteSeleccionado.nombre?.charAt(0)?.toUpperCase()}
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800">
                      {clienteSeleccionado.nombre} {clienteSeleccionado.apellido}
                    </p>

                    <p className="text-xs text-gray-400">
                      Historial clínico del paciente
                    </p>
                  </div>

                </div>

                <button
                  onClick={() => setClienteSeleccionado(null)}
                  className="text-sm text-gray-400 hover:text-gray-600 transition"
                >
                  Cerrar
                </button>

              </div>

              {/* ✅ DIVISOR */}
              <div className="border-t border-gray-200" />

              {/* ✅ FORM + HISTORIAL */}
              <div className="space-y-4">

                <h4 className="text-sm font-semibold text-gray-600">
                  📝 Notas clínicas
                </h4>

                {/* ✅ CONTENIDO SCROLL */}
                <div className="max-h-[65vh] overflow-y-auto pr-2 space-y-5">

                  {/* 📥 FORM */}
                  <div className="
            bg-gray-50 border border-gray-200
            rounded-xl p-4 space-y-3
          ">

                    {/* Aquí ya tienes tu form dentro de ClienteDetalle */}
                    <ClienteDetalle cliente={clienteSeleccionado} />

                  </div>

                </div>

              </div>

            </div>

          </BaseModal>
        )}
      

      </div>

      {/* ✅ MODAL FORM */}
      <div
        onClick={cerrarModal}
        className={`
        fixed inset-0 z-50 flex items-center justify-center
        transition-all duration-200
        ${modalAbierto
            ? "opacity-100 visible bg-black/40 backdrop-blur-sm"
            : "opacity-0 invisible"}
      `}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`
          w-full max-w-2xl p-6
          transform transition-all duration-200
          ${modalAbierto
              ? "scale-100 opacity-100"
              : "scale-95 opacity-0"}
        `}
        >

          <ClienteForm
            cliente={clienteEditar}
            onClose={cerrarModal}
          />

        </div>
      </div>

      {/* ✅ CONFIRM */}
      {clienteADesactivar && (
        <ConfirmModal
          mensaje={`¿Desactivar a ${clienteADesactivar.nombre}?`}
          onCancel={() => setClienteADesactivar(null)}
          onConfirm={() => {
            toggleCliente.mutate(clienteADesactivar);
            setClienteADesactivar(null);
          }}
        />
      )}

    </PageWrapper>
  );

}

export default ClientesPage;