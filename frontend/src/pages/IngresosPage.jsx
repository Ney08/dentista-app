import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { formatFecha } from "../utils/fecha";
import { useClientes } from "../hooks/useClientes";
import { useIngresos } from "../hooks/useIngresos";
import IngresoList from "../components/facturas/IngresoList";
import FacturaModal from "../components/facturas/FacturaModal";
import IngresoForm from "../components/facturas/IngresoForm";
import PageWrapper from "../components/PageWrapper";
import Paginacion from "../components/Paginacion";
import { useLocation } from "react-router-dom";
import { formatMoney } from "../utils/format";

function IngresosPage() {

  const { clientes } = useClientes();
  const { ingresos, pagarIngreso, isLoading } = useIngresos();
  const toastMostrado = useRef(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [facturaPreview, setFacturaPreview] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [animar, setAnimar] = useState(false);
  const [limite, setLimite] = useState(1);
  const [porPagina, setPorPagina] = useState(10);
  const [orden, setOrden] = useState("fecha");
  const [pagina, setPagina] = useState(1);


  const location = useLocation();

  const citaDesdeCitas = location.state?.citaPreset;
  const clienteDesdeCitas = location.state?.clienteSeleccionado;

  const [citaPresetLocal, setCitaPresetLocal] = useState(null);

  // ✅ abrir/cerrar form
  const abrirNuevo = () => {
    setEditando(null);
    setModalAbierto(true);
  };

  const abrirEditar = (ingreso) => {
    setEditando(ingreso);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setEditando(null);
  };

  // ✅ pago
  const marcarPagado = async (ingreso) => {
    if (ingreso.pagado) {
      toast("Ya está pagada ⚠️");
      return;
    }

    try {
      await pagarIngreso.mutateAsync(ingreso.id);
      toast.success("Pagado ✅");
    } catch {
      toast.error("Error ❌");
    }
  };

  // ✅ total pendiente
  const totalPendiente = ingresos
    .filter(i => !i.pagado)
    .reduce((acc, i) => {

      const subtotal = (i.servicios || []).reduce((a, s) => a + s.monto, 0);
      const itbis = subtotal * 0.18;

      const descuento = i.descuento || 0;
      const descuentoValor = subtotal * (descuento / 100);

      const total = subtotal + itbis - descuentoValor;

      return acc + total;

    }, 0);


  const pendientesCount = ingresos.filter(i => !i.pagado).length;

  useEffect(() => {
    if (modalAbierto) {
      setTimeout(() => setAnimar(true), 10);
    } else {
      setAnimar(false);
    }
  }, [modalAbierto]);


  useEffect(() => {
    if (citaDesdeCitas) {
      setEditando(null);
      setCitaPresetLocal(citaDesdeCitas);
      setModalAbierto(true);

      window.history.replaceState({}, document.title);
    }
  }, [citaDesdeCitas]);

  useEffect(() => {
    if (pendientesCount > 0 && !toastMostrado.current) {
      toast(`⚠️ Tienes ${pendientesCount} factura(s) pendiente(s) 💸`);
      toastMostrado.current = true;
    }
  }, [pendientesCount]);


  // ✅ filtro
  const filtrados = ingresos
    .filter(i =>
      `${i.cliente?.nombre || ""} ${i.cliente?.apellido || ""}`
        .toLowerCase()
        .includes(busqueda.toLowerCase())
    )
    .sort((a, b) => {
      if (orden === "az") {
        return (a.cliente?.nombre || "").localeCompare(b.cliente?.nombre || "");
      }

      if (orden === "za") {
        return (b.cliente?.nombre || "").localeCompare(a.cliente?.nombre || "");
      }

      if (orden === "fecha") {
        return new Date(b.created_at) - new Date(a.created_at);
      }

      return 0;
    });
  const totalPaginas = Math.ceil(filtrados.length / porPagina);

  const inicio = (pagina - 1) * porPagina;
  const fin = inicio + porPagina;

  const facturasPaginadas = filtrados.slice(inicio, fin);


  useEffect(() => {
    if (pagina > totalPaginas) {
      setPagina(1);
    }
  }, [filtrados.length]);

  if (isLoading) {
    return (
      <PageWrapper>
        <p className="text-center text-gray-500">Cargando...</p>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>

      <div className="max-w-7xl mx-auto space-y-6 pb-6 px-4">

        {/* ✅ HEADER */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Facturación 🧾
          </h1>

          <p className="text-gray-500 text-sm">
            Gestiona ingresos y facturas
          </p>
        </div>

        {/* ✅ KPI */}
        <div className={`
        rounded-xl border p-4 text-center
        ${totalPendiente > 0
            ? "bg-red-50 border-red-200"
            : "bg-green-50 border-green-200"}
      `}>

          <p className="text-xs text-gray-500">
            {totalPendiente > 0 ? "Pendiente" : "Todo saldado"}
          </p>

          <p className="text-2xl font-bold">
            RD$ {formatMoney(totalPendiente)}
          </p>

        </div>

        {/* ✅ CARD PRINCIPAL */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-col min-h-[75vh] space-y-4">

          {/* ✅ TOOLBAR */}
          <div className="flex flex-wrap justify-between items-center gap-3">

            <p className="text-sm text-gray-500">
              <span className="font-medium">{filtrados.length}</span> facturas · {" "}
              <span className="text-red-500">{pendientesCount}</span> pendientes
            </p>

            <button
              onClick={abrirNuevo}
              className="
              bg-blue-500 hover:bg-blue-600
              text-white text-sm px-4 py-2 rounded-lg
              shadow-sm transition
            "
            >
              + Nuevo
            </button>

          </div>
          {/* ✅ TOOLBAR */}
          <div className="flex flex-wrap items-center gap-3">

            {/* 🔍 BUSCADOR */}
            <div className="flex-1">
              <input
                placeholder="🔍 Buscar cliente..."
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  setPagina(1);
                }}
                className="
        w-full border border-gray-200
        px-4 py-2 rounded-xl text-sm
        focus:ring-2 focus:ring-blue-500
      "
              />
            </div>

            {/* 📌 ORDEN */}
            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              className="
      border px-3 py-2 rounded-lg text-sm
      hover:bg-gray-50
    "
            >
              <option value="fecha">Más recientes</option>
              <option value="az">A-Z</option>
              <option value="za">Z-A</option>
            </select>

            {/* 📄 MOSTRAR */}
            <select
              value={porPagina}
              onChange={(e) => {
                const val =
                  e.target.value === "todos"
                    ? filtrados.length || 1
                    : parseInt(e.target.value);

                setPorPagina(val);
                setPagina(1);
              }}
              className="
      border px-3 py-2 rounded-lg text-sm
      hover:bg-gray-50
    "
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value="todos">Todos</option>
            </select>

          </div>

          {/* ✅ LISTA */}
          <div className="flex-1 min-h-0 overflow-y-auto pr-2 space-y-3">

            {filtrados.length === 0 ? (
              <p className="text-center text-gray-400">
                No hay facturas
              </p>
            ) : (

              <IngresoList
                facturas={facturasPaginadas}
                porPagina={porPagina}
                onVerFactura={(i) => setFacturaPreview(i)}
                onEditar={abrirEditar}
                onPagar={marcarPagado}
              />

            )}

          </div>

          {/* ✅ PAGINACIÓN */}
          {limite !== "all" && totalPaginas > 1 && (
            <div className="pt-4 border-t flex justify-center">

              <Paginacion
                pagina={pagina}
                totalPaginas={totalPaginas}
                onChange={setPagina}
              />

            </div>
          )}

        </div>

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

        {modalAbierto && (
          <div className="w-full max-w-2xl px-4">

            <div
              onClick={(e) => e.stopPropagation()}
              className={`
              transform transition-all duration-200
              ${animar
                  ? "scale-100 opacity-100"
                  : "scale-95 opacity-0"}
            `}
            >

              <IngresoForm
                key={editando?.id || citaPresetLocal?.id || "nuevo"}
                clientes={clientes}
                initialData={editando}
                citaPreset={citaPresetLocal}
                clientePreset={clienteDesdeCitas}
                onClose={cerrarModal}
              />

            </div>

          </div>
        )}

      </div>

      {/* ✅ MODAL FACTURA */}
      <div className={`
      fixed inset-0 z-50 flex items-center justify-center
      ${facturaPreview
          ? "bg-black/40 backdrop-blur-sm"
          : "pointer-events-none"}
      transition
    `}>

        {facturaPreview && (
          <FacturaModal
            ingreso={facturaPreview}
            onClose={() => setFacturaPreview(null)}
          />
        )}

      </div>

    </PageWrapper>
  );

}

export default IngresosPage;
