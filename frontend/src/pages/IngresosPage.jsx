import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { formatFecha } from "../utils/fecha";
import { useClientes } from "../hooks/useClientes";
import { useIngresos } from "../hooks/useIngresos";
import IngresoList from "../components/IngresoList";
import FacturaModal from "../components/FacturaModal";
import IngresoForm from "../components/IngresoForm";
import PageWrapper from "../components/PageWrapper";
import Paginacion from "../components/Paginacion";
function IngresosPage() {

  const { clientes } = useClientes();
  const { ingresos, pagarIngreso, isLoading } = useIngresos();
  const toastMostrado = useRef(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [facturaPreview, setFacturaPreview] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [animar, setAnimar] = useState(false);

  const [porPagina, setPorPagina] = useState(5);
  const [orden, setOrden] = useState("fecha");
  const [pagina, setPagina] = useState(1);
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

      <div className="space-y-4 pb-4">

        {/* HEADER */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight flex justify-center gap-2">
            Facturación <span>🧾</span>
          </h1>
          <p className="text-gray-500 text-sm">
            Gestiona ingresos y facturas
          </p>
        </div>

        {/* MÉTRICA */}
        <div className={`p-5 rounded-2xl text-center border ${totalPendiente > 0
          ? "bg-red-50 border-red-200"
          : "bg-green-50 border-green-200"
          }`}>
          <p className="text-sm font-medium">
            {totalPendiente > 0 ? "💸 Pendiente" : "✅ Todo saldado"}
          </p>
          <p className="text-3xl font-bold">
            RD$ {totalPendiente.toFixed(2)}
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex flex-col h-[70vh]">
          <div className="space-y-4 pb-4">
            {/* TOP */}
            <div className="flex justify-between items-center flex-wrap gap-2">
              <p className="text-sm text-gray-500">
                📊 {filtrados.length} facturas • 🔴 {pendientesCount} pendientes
              </p>


              <button
                onClick={abrirNuevo}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm shadow"
              >
                + Nuevo
              </button>
            </div>

            {/* BUSCADOR */}
            <input
              placeholder="🔍 Buscar cliente..."
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPagina(1);
              }}
              className="
    w-full border border-gray-300 px-4 py-2 rounded-xl
    focus:ring-2 focus:ring-blue-500 transition
  "
            />

            {/* CONTROLES */}
            <div className="flex flex-wrap justify-between items-center gap-4">

              {/* IZQUIERDA */}
              <div className="flex items-center gap-2 text-sm">
                <span>Orden:</span>

                <select
                  value={orden}
                  onChange={(e) => setOrden(e.target.value)}
                  className="border px-2 py-1 rounded"
                >
                  <option value="az">A-Z</option>
                  <option value="za">Z-A</option>
                  <option value="fecha">Más recientes</option>
                </select>
              </div>

              {/* DERECHA */}
              <div className="flex items-center gap-2 text-sm">
                <span>Mostrar:</span>

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
                  className="border px-2 py-1 rounded"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value="todos">Todos</option>
                </select>
              </div>
            </div>
          </div>






          {/* LISTA */}
          <div className="flex-1 min-h-0 overflow-y-auto pr-2 pb-4">
            {filtrados.length === 0 ? (
              <p className="text-center text-gray-400">No hay facturas</p>
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
          <div className="mt-auto pt-4 border-t">
            <Paginacion
              pagina={pagina}
              totalPaginas={totalPaginas}
              onChange={setPagina}
            />
          </div>
        </div>
      </div>

      {/* ✅ MODAL FORM */}

      <div
        className={`
    fixed inset-0 z-50
    flex items-center justify-center
    overflow-y-auto 
    transition-all duration-200 ease-out
    ${modalAbierto
            ? "opacity-100 visible bg-black/40 backdrop-blur-md"
            : "opacity-0 invisible"}
  `}
      >
        {modalAbierto && (

          <div className="w-full max-w-2xl px-4 my-10"> {/* ✅ margen vertical */}

            <div

              className={`
        w-full max-w-2xl transform transition-all duration-200 ease-out
        ${animar
                  ? "scale-100 opacity-100 translate-y-0"
                  : "scale-95 opacity-0 translate-y-6"}
      `}

            >
              <IngresoForm
                key={editando?.id || "nuevo"}
                clientes={clientes}
                initialData={editando}
                onClose={cerrarModal}
              />
            </div>

          </div>

        )}

      </div>

      {/* ✅ MODAL FACTURA */}
      <div className={`
        fixed inset-0 z-50 flex items-center justify-center
        ${facturaPreview ? "bg-black/40 backdrop-blur-md" : "pointer-events-none"}
        transition
      `}>
        {facturaPreview && (
          <FacturaModal
            ingreso={facturaPreview}
            onClose={() => setFacturaPreview(null)}
          />
        )}
      </div>

    </PageWrapper >
  );
}

export default IngresosPage;
