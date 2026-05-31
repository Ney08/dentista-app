import { useState } from "react";
import toast from "react-hot-toast";

import { useClientes } from "../hooks/useClientes";
import { useIngresos } from "../hooks/useIngresos";

import FacturaModal from "../components/FacturaModal";
import IngresoForm from "../components/IngresoForm";
import PageWrapper from "../components/PageWrapper";

function IngresosPage() {

  const { clientes } = useClientes();
  const { ingresos, pagarIngreso, isLoading } = useIngresos();

  const [vista, setVista] = useState("lista");
  const [editando, setEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [facturaPreview, setFacturaPreview] = useState(null);

  const [limite, setLimite] = useState(10);
  const [pagina, setPagina] = useState(1);

  // ✅ BLOQUEAR DOBLE PAGO
  const marcarPagado = async (ingreso) => {

    if (ingreso.pagado) {
      toast("Esta factura ya está pagada ⚠️");
      return;
    }

    try {
      await pagarIngreso.mutateAsync(ingreso.id);
      toast.success("Factura marcada como pagada ✅");
    } catch {
      toast.error("Error ❌");
    }
  };

  // ✅ 💰 TOTAL PENDIENTE (LO QUE DEBEN)
  const totalPendiente = ingresos
    .filter(i => !i.pagado)
    .reduce((acc, i) => {

      const servicios = i.servicios || [];

      const subtotal = servicios.reduce((a, s) => a + s.monto, 0);
      const itbis = subtotal * 0.18;
      const descuento = subtotal * ((i.descuento || 0) / 100);

      return acc + (subtotal + itbis - descuento);

    }, 0);

  // ✅ CONTADOR PENDIENTES
  const pendientesCount = ingresos.filter(i => !i.pagado).length;

  // ✅ FILTRO
  const filtrados = ingresos.filter(i =>
    `${i.cliente?.nombre || ""} ${i.cliente?.apellido || ""}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  // ✅ PAGINACIÓN
  const inicio = (pagina - 1) * (limite === "all" ? filtrados.length : limite);
  const fin = limite === "all" ? undefined : inicio + limite;

  const ingresosFinal =
    limite === "all"
      ? filtrados
      : filtrados.slice(inicio, fin);

  const totalPaginas =
    limite === "all"
      ? 1
      : Math.ceil(filtrados.length / limite);

  if (isLoading) {
    return (
      <PageWrapper>
        <p className="text-center text-gray-500">Cargando facturas...</p>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>

      <div className="max-w-4xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Facturación 🧾</h1>
          <p className="text-gray-500 text-sm">
            Gestiona ingresos y facturas
          </p>
        </div>

        {/* ✅ MÉTRICA PENDIENTE DINÁMICA */}
        <div
          className={`
    p-4 rounded-xl text-center border
    ${totalPendiente > 0
              ? "bg-red-50 border-red-200"
              : "bg-green-50 border-green-200"}
  `}
        >
          <p
            className={`
      text-sm
      ${totalPendiente > 0
                ? "text-red-700"
                : "text-green-700"}
    `}
          >
            {totalPendiente > 0
              ? "💸 Pendiente por cobrar"
              : "✅ Todo saldado"}
          </p>

          <p
            className={`
      text-2xl font-bold
      ${totalPendiente > 0
                ? "text-red-800"
                : "text-green-800"}
    `}
          >
            RD$ {totalPendiente.toFixed(2)}
          </p>
        </div>

        {/* TABS */}
        <div className="flex justify-center gap-3">

          <button
            onClick={() => setVista("lista")}
            className={`px-5 py-2 rounded-full ${vista === "lista"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
              }`}
          >
            📋 Facturas
          </button>

          <button
            onClick={() => {
              setEditando(null);
              setVista("crear");
            }}
            className={`px-5 py-2 rounded-full ${vista === "crear"
                ? "bg-green-500 text-white"
                : "bg-gray-200"
              }`}
          >
            ➕ Crear
          </button>

        </div>

        {/* CREAR */}
        {vista === "crear" && (
          <div className="bg-white p-6 rounded-xl shadow border">
            <IngresoForm clientes={clientes} initialData={editando} />
          </div>
        )}

        {/* LISTA */}
        {vista === "lista" && (
          <div className="bg-white p-6 rounded-xl shadow border space-y-5">

            {/* BUSCAR */}
            <input
              placeholder="🔍 Buscar cliente..."
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPagina(1);
              }}
              className="w-full border px-4 py-2 rounded-xl"
            />

            {/* INFO */}
            <div className="flex justify-between text-sm">
              <p className="text-gray-500">
                📊 {filtrados.length} facturas • 🔴 {pendientesCount} pendientes
              </p>

              <select
                value={limite}
                onChange={(e) => {
                  const val =
                    e.target.value === "all"
                      ? "all"
                      : parseInt(e.target.value);

                  setLimite(val);
                  setPagina(1);
                }}
                className="border px-2 py-1 rounded"
              >
                <option value={10}>10</option>
                <option value={50}>50</option>
                <option value="all">Todos</option>
              </select>
            </div>

            {/* LISTA */}
            {ingresosFinal.length === 0 ? (
              <p className="text-center text-gray-400">
                No hay facturas
              </p>
            ) : (
              ingresosFinal.map(i => {

                const servicios = i.servicios || [];
                const subtotal = servicios.reduce((a, s) => a + s.monto, 0);
                const itbis = subtotal * 0.18;
                const descuento = subtotal * ((i.descuento || 0) / 100);
                const total = subtotal + itbis - descuento;

                return (
                  <div
                    key={i.id}
                    className="flex justify-between p-4 border rounded-xl"
                  >

                    <div>
                      <p className="font-bold">
                        {i.cliente?.nombre} {i.cliente?.apellido}
                      </p>

                      <p className="text-sm text-gray-500">
                        {i.created_at && new Date(i.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-400">
                        💼 {servicios.length} servicio(s)
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

                      {/* VER */}
                      <button
                        onClick={() => setFacturaPreview(i)}
                        className="bg-blue-500 text-white px-2 rounded"
                      >
                        📄
                      </button>

                      {/* EDITAR */}
                      <button
                        disabled={i.pagado}
                        onClick={() => {
                          if (i.pagado) return;
                          setEditando(i);
                          setVista("crear");
                        }}
                        className={`px-2 text-white rounded ${i.pagado
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-yellow-500"
                          }`}
                      >
                        ✏️
                      </button>

                      {/* PAGAR */}
                      <button
                        disabled={i.pagado}
                        onClick={() => marcarPagado(i)}
                        className={`px-2 text-white rounded ${i.pagado
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-purple-500"
                          }`}
                      >
                        💳
                      </button>

                    </div>

                  </div>
                );
              })
            )}

          </div>
        )}

      </div>

      {facturaPreview && (
        <FacturaModal
          ingreso={facturaPreview}
          onClose={() => setFacturaPreview(null)}
        />
      )}

    </PageWrapper>
  );
}

export default IngresosPage;
