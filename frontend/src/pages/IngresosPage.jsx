import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { useClientes } from "../hooks/useClientes";
import { useIngresos } from "../hooks/useIngresos";

import FacturaModal from "../components/FacturaModal";
import IngresoForm from "../components/IngresoForm";
import PageWrapper from "../components/PageWrapper";

function IngresosPage() {

  const { clientes } = useClientes();
  const { ingresos, pagarIngreso, isLoading } = useIngresos();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [facturaPreview, setFacturaPreview] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [animar, setAnimar] = useState(false);
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
      const servicios = i.servicios || [];
      const subtotal = servicios.reduce((a, s) => a + s.monto, 0);
      return acc + subtotal * 1.18;
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
    if (pendientesCount > 0) {
      toast(`⚠️ Tienes ${pendientesCount} factura(s) pendiente(s) 💸`);
    }
  }, [pendientesCount]);

  // ✅ filtro
  const filtrados = ingresos.filter(i =>
    `${i.cliente?.nombre || ""} ${i.cliente?.apellido || ""}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  if (isLoading) {
    return (
      <PageWrapper>
        <p className="text-center text-gray-500">Cargando...</p>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>

      <div className="max-w-4xl mx-auto space-y-6">

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
        <div className="space-y-6 bg-white p-6 rounded-2xl shadow-md border border-gray-200">

          {/* TOP */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Total: {filtrados.length}
            </p>

            <button
              onClick={abrirNuevo}
              className="
                flex items-center gap-2
                bg-green-500 hover:bg-green-600
                text-white px-4 py-2 rounded-lg
                text-sm shadow-sm transition hover:scale-105
              "
            >
              ➕ Nuevo
            </button>
          </div>

          {/* BUSCAR */}
          <input
            placeholder="🔍 Buscar cliente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="
              w-full border border-gray-300 px-4 py-2 rounded-xl
              focus:ring-2 focus:ring-blue-500 transition
            "
          />

          <p className="text-sm text-gray-500">
            📊 {filtrados.length} facturas • 🔴 {pendientesCount} pendientes
          </p>

          {/* LISTA */}
          {filtrados.length === 0 ? (
            <p className="text-center text-gray-400">No hay facturas</p>
          ) : (
            filtrados.map(i => {

              const subtotal = (i.servicios || []).reduce((a, s) => a + s.monto, 0);
              const total = subtotal * 1.18;

              return (
                <div
                  key={i.id}
                  className="
                    flex justify-between items-center p-4 border rounded-xl
                    transition hover:shadow-md hover:-translate-y-0.5
                  "
                >
                  <div>
                    <p className="font-semibold">
                      {i.cliente?.nombre} {i.cliente?.apellido}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(i.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">

                    <span className={`px-3 py-1 text-xs rounded-full ${i.pagado
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                      }`}>
                      {i.pagado ? "Pagado" : "Pendiente"}
                    </span>

                    <span className="font-bold text-green-600">
                      RD$ {total.toFixed(2)}
                    </span>

                    <button
                      onClick={() => setFacturaPreview(i)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 rounded transition hover:scale-105"
                    >
                      📄
                    </button>

                    <button
                      onClick={() => abrirEditar(i)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 rounded transition hover:scale-105"
                    >
                      ✏️
                    </button>

                    <button
                      onClick={() => marcarPagado(i)}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-2 rounded transition hover:scale-105"
                    >
                      💳
                    </button>

                  </div>
                </div>
              );
            })
          )}

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

    </PageWrapper>
  );
}

export default IngresosPage;
