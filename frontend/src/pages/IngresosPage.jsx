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
import SkeletonLoader from "../components/SkeletonLoader";
import { useCitas } from "../hooks/useCitas";

function IngresosPage() {

  const { clientes } = useClientes();
  const { citas = [] } = useCitas();
  const { ingresos, pagarIngreso, isLoading } = useIngresos();
  const toastMostrado = useRef(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [facturaPreview, setFacturaPreview] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [animar, setAnimar] = useState(false);
  const [limite, setLimite] = useState(1);
  const [porPagina, setPorPagina] = useState(7);
  const [orden, setOrden] = useState("fecha");
  const [pagina, setPagina] = useState(1);

  // const citaStorage = sessionStorage.getItem(
  //   "citaPreset"
  // );


  const [citaDesdeCitas, setCitaDesdeCitas] =
    useState(null);

  //const location = useLocation();



  // const citaDesdeCitas = citas.find(
  //   c => String(c.id) === String(citaId)
  // );

  // const clienteDesdeCitas = clientes.find(
  //   c => String(c.id) === String(clienteId)
  // );


  // useEffect(() => {

  //   if (citaDesdeCitas) {

  //     setEditando(null);
  //     setCitaPresetLocal(citaDesdeCitas);
  //     setModalAbierto(true);

  //   }

  // }, [citaDesdeCitas]);


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

    setCitaPresetLocal(null);

    setCitaDesdeCitas(null);

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

    if (!citaDesdeCitas) {
      return;
    }

    setEditando(null);

    setCitaPresetLocal(citaDesdeCitas);

    requestAnimationFrame(() => {

      setModalAbierto(true);

    });

    // ✅ limpiar state
    window.history.replaceState(
      {},
      document.title
    );

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

    const citaStorage =
      sessionStorage.getItem("citaPreset");

    if (!citaStorage) {
      return;
    }

    try {

      const cita = JSON.parse(citaStorage);

      setCitaDesdeCitas(cita);

      // ✅ limpiar inmediatamente
      sessionStorage.removeItem(
        "citaPreset"
      );

    } catch (err) {

      console.error(
        "ERROR STORAGE:",
        err
      );

    }

  }, []);


  useEffect(() => {
    if (pagina > totalPaginas) {
      setPagina(1);
    }
  }, [filtrados.length]);

  if (isLoading) {
    return (
      <PageWrapper>

        <div className="space-y-6">

          <SkeletonLoader alto="h-10" />

          <div className="space-y-4">

            <SkeletonLoader alto="h-20" />
            <SkeletonLoader alto="h-20" />
            <SkeletonLoader alto="h-20" />
            <SkeletonLoader alto="h-20" />
            <SkeletonLoader alto="h-20" />

          </div>

        </div>

      </PageWrapper>
    );
  }

  return (
    <PageWrapper>

      <div className="h-full max-w-7xl mx-auto flex flex-col gap-4 md:gap-6 px-3 sm:px-4 pb-4 overflow-hidden">

        {/* ✅ HEADER */}
        <div className="text-center space-y-1 pt-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            Facturación 🧾
          </h1>

          <p className="text-xs sm:text-sm text-gray-500">
            Gestiona ingresos y facturas
          </p>
        </div>

        {/* ✅ KPI */}
        <div className={`
        rounded-2xl border p-4 sm:p-5 text-center
        ${totalPendiente > 0
            ? "bg-red-50 border-red-200"
            : "bg-green-50 border-green-200"}
      `}>

          <p className="text-xs text-gray-500">
            {totalPendiente > 0 ? "Pendiente" : "Todo saldado"}
          </p>

          <p className="text-2xl sm:text-3xl font-bold">
            RD$ {formatMoney(totalPendiente)}
          </p>

        </div>

        {/* ✅ CARD PRINCIPAL */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-[72vh] sm:h-[75vh] lg:h-[74vh] p-4 sm:p-5 gap-4 overflow-hidden">

          {/* ✅ TOOLBAR */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <p className="text-sm text-gray-500">
              <span className="font-medium">{filtrados.length}</span> facturas · {" "}
              <span className="text-red-500">{pendientesCount}</span> pendientes
            </p>

            <button
              onClick={abrirNuevo}
              className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-3 rounded-xl shadow-sm transition active:scale-[0.98]"
            >
              + Nuevo
            </button>

          </div>
          {/* ✅ TOOLBAR */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">

            {/* 🔍 BUSCADOR */}
            <div className="w-full lg:flex-1">
              <input
                placeholder="🔍 Buscar cliente..."
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  setPagina(1);
                }}
                className="w-full border border-gray-200 px-4 h-12 rounded-xl text-sm sm:text-base focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 📌 ORDEN */}
            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              className="w-full lg:w-auto border px-3 h-12 rounded-xl text-sm sm:text-base hover:bg-gray-50"
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
              className="w-full lg:w-auto border px-3 h-12 rounded-xl text-sm sm:text-base hover:bg-gray-50"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value="all">Todos</option>
            </select>

          </div>

          {/* ✅ LISTA */}
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-1">

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
            <div className="pt-3 border-t flex justify-center overflow-x-auto">

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
    fixed inset-0 z-50

    flex items-end md:items-center
    justify-center

    bg-black/40 backdrop-blur-sm

    transition-all duration-300

    ${modalAbierto
            ? "opacity-100 visible"
            : "opacity-0 invisible"}
  `}
      >
        ``

        {modalAbierto && (
          <div className="w-full h-full md:h-auto md:max-w-2xl flex items-end md:items-center justify-center">

            <div
              onClick={(e) => e.stopPropagation()}

              className={`
  w-full

  transition-all duration-300 ease-out

  ${animar
                  ? "translate-y-0 md:scale-100 opacity-100"
                  : "translate-y-full md:translate-y-0 md:scale-95 opacity-0"}
`}


            >

              {
                (
                  editando ||
                  !citaDesdeCitas ||
                  citaPresetLocal
                )
                && (

                  <IngresoForm
                    key={
                      editando?.id ||
                      citaPresetLocal?.id ||
                      "nuevo"
                    }
                    clientes={clientes}
                    initialData={editando}
                    citaPreset={citaPresetLocal}
                    onClose={cerrarModal}
                  />

                )}

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
