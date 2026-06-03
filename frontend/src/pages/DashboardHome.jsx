import { useClientes } from "../hooks/useClientes";
import { useIngresos } from "../hooks/useIngresos";
import { useCitas } from "../hooks/useCitas";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { formatFecha, formatHora, parseFechaLocal } from "../utils/fecha";
import GraficoIngresos from "../components/graficos/GraficoIngresos";
import GraficoClientes from "../components/graficos/GraficoClientes";
import GraficoCitas from "../components/graficos/GraficoCitas";

import PageWrapper from "../components/PageWrapper";

function DashboardHome() {

  const { clientes } = useClientes();
  const { ingresos } = useIngresos();
  const { citas = [] } = useCitas();

  const ahora = new Date();
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  // ✅ HELPER
  const esHoy = (fechaStr) => {
    if (!fechaStr) return false;

    const fecha = parseFechaLocal(fechaStr);

    return (
      fecha.getDate() === ahora.getDate() &&
      fecha.getMonth() === ahora.getMonth() &&
      fecha.getFullYear() === ahora.getFullYear()
    );
  };

  // ✅ ESTADOS
  const getEstado = (c) => {
    if (c.estado === "cancelada") return "cancelada";
    if (c.estado === "completada") return "completada";

    const fecha = parseFechaLocal(c.fecha);

    if (fecha < ahora) return "atrasada";

    return "pendiente";
  };

  // ✅ CITAS DE HOY
  const citasHoy = citas
    .filter(c => esHoy(c.fecha))
    .sort((a, b) => parseFechaLocal(a.fecha) - parseFechaLocal(b.fecha));

  // ✅ CONTADORES ESTADOS
  const pendientes = citas.filter(c => getEstado(c) === "pendiente").length;
  const atrasadas = citas.filter(c => getEstado(c) === "atrasada").length;
  const completadas = citas.filter(c => getEstado(c) === "completada").length;
  const canceladas = citas.filter(c => getEstado(c) === "cancelada").length;

  // ✅ DATOS DEL DÍA
  const clientesHoy = clientes.filter(c => esHoy(c.created_at)).length;
  const cantidadCitasHoy = citasHoy.length;

  let pagadoHoy = 0;
  let pendienteHoy = 0;
  let facturasHoy = 0;

  // ✅ MES
  let totalMes = 0;
  const mesActual = ahora.getMonth();
  const anioActual = ahora.getFullYear();

  ingresos.forEach(i => {

    const servicios = i.servicios || [];

    const subtotal = servicios.reduce((acc, s) => acc + s.monto, 0);
    const itbis = subtotal * 0.18;
    const descuento = subtotal * ((i.descuento || 0) / 100);

    const total = subtotal + itbis - descuento;

    // ✅ SOLO HOY
    if (esHoy(i.created_at)) {
      facturasHoy++;

      if (i.pagado) pagadoHoy += total;
      else pendienteHoy += total;
    }

    // ✅ MES
    if (i.created_at) {
      const fecha = parseFechaLocal(i.created_at);

      if (
        fecha.getMonth() === mesActual &&
        fecha.getFullYear() === anioActual
      ) {
        totalMes += total;
      }
    }

  });

  // ✅ TOAST

  useEffect(() => {
    const citasPendientesHoy = citasHoy.filter(
      c => c.estado === "pendiente"
    );

    if (citasPendientesHoy.length > 0) {
      toast.success(
        `Tienes ${citasPendientesHoy.length} cita(s) pendiente(s) hoy 📅`,
        { id: "toast-citas-hoy" }
      );
    }
  }, [citasHoy.length]);


  const formato = (n) => `RD$ ${n.toFixed(2)}`;

  return (
    <PageWrapper>

      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Dashboard 📊</h1>
          <p className="text-gray-500 text-sm">
            {formatFecha(new Date())}
          </p>
        </div>

        {/* ESTADOS CITAS */}
        <div className="flex flex-wrap justify-center gap-3">
          <div className="bg-yellow-100 px-4 py-2 rounded-lg">
            🟡 {pendientes} Pendientes
          </div>
          <div className="bg-red-100 px-4 py-2 rounded-lg">
            🔴 {atrasadas} Atrasadas
          </div>
          <div className="bg-green-100 px-4 py-2 rounded-lg">
            ✅ {completadas} Completadas
          </div>
          <div className="bg-gray-200 px-4 py-2 rounded-lg">
            ⛔ {canceladas} Canceladas
          </div>
        </div>

        {/* CITAS HOY */}
        <div className="bg-yellow-100 p-5 rounded-xl">
          <h3 className="font-semibold mb-3">📅 Citas de hoy</h3>

          {citasHoy.length === 0 ? (
            <p>No hay citas ✅</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3 max-h-52 overflow-y-auto">

              {citasHoy.map(c => {
                const estado = getEstado(c);

                return (
                  <div
                    key={c.id}
                    className={`p-4 rounded-xl border shadow-sm space-y-2
                      ${estado === "atrasada" ? "bg-red-50 border-red-200" : "bg-white"}
                    `}
                  >
                    <p className="font-bold">
                      🕒 {formatHora(parseFechaLocal(c.fecha))} - {c.cliente?.nombre} {c.cliente?.apellido}
                    </p>

                    <p className="text-gray-600 text-sm">{c.motivo}</p>

                    <span className={`px-3 py-1 rounded-lg text-xs
                      ${estado === "completada"
                        ? "bg-green-100 text-green-700"
                        : estado === "atrasada"
                          ? "bg-red-100 text-red-700"
                          : estado === "cancelada"
                            ? "bg-gray-300 text-gray-700"
                            : "bg-yellow-100 text-yellow-700"
                      }
                    `}>
                      {estado === "completada" && "✅ Completada"}
                      {estado === "atrasada" && "🔴 Atrasada"}
                      {estado === "cancelada" && "⛔ Cancelada"}
                      {estado === "pendiente" && "🟡 Pendiente"}
                    </span>

                  </div>
                );
              })}

            </div>
          )}
        </div>

        {/* ✅ CARDS DEL DÍA */}
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

          <div className="card bg-blue-100">
            <p>Clientes nuevos hoy</p>
            <p className="text-2xl font-bold">{clientesHoy}</p>
          </div>

          <div className="card bg-indigo-100">
            <p>Citas hoy</p>
            <p className="text-2xl font-bold">{cantidadCitasHoy}</p>
          </div>

          <div className="card bg-green-100">
            <p>Pagado hoy</p>
            <p className="text-2xl font-bold">{formato(pagadoHoy)}</p>
          </div>

          <div className={`card ${pendienteHoy > 0 ? "bg-red-100" : "bg-green-100"}`}>
            <p>Pendiente hoy</p>
            <p className="text-2xl font-bold">{formato(pendienteHoy)}</p>
          </div>

          <div className="card bg-purple-100">
            <p>Facturas hoy</p>
            <p className="text-2xl font-bold">{facturasHoy}</p>
          </div>

          <div className="card bg-gray-100">
            <p>Mes</p>
            <p className="text-2xl font-bold">{formato(totalMes)}</p>
          </div>

        </div>

        {/* GRÁFICOS */}
        <div className="grid gap-6 lg:grid-cols-3">

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-center font-semibold mb-4">📈 Ingresos</h3>
            <div className="h-[250px]">
              <GraficoIngresos ingresos={ingresos} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-center font-semibold mb-4">👥 Clientes</h3>
            <div className="h-[250px]">
              <GraficoClientes clientes={clientes} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-center font-semibold mb-4">📅 Citas</h3>
            <div className="h-[250px]">
              <GraficoCitas citas={citas} />
            </div>
          </div>

        </div>

      </div>

    </PageWrapper>
  );
}

export default DashboardHome;