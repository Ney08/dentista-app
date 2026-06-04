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
import { formatMoney } from "../utils/format";
import SkeletonLoader from "../components/SkeletonLoader";

function DashboardHome() {

  const {
    clientes,
    isLoading: clientesLoading
  } = useClientes();

  const {
    ingresos,
    isLoading: ingresosLoading
  } = useIngresos();

  const {
    citas = [],
    isLoading: citasLoading
  } = useCitas();

  const ahora = new Date();

  const esHoy = (fechaStr) => {
    if (!fechaStr) return false;
    const fecha = parseFechaLocal(fechaStr);

    return (
      fecha.getDate() === ahora.getDate() &&
      fecha.getMonth() === ahora.getMonth() &&
      fecha.getFullYear() === ahora.getFullYear()
    );
  };

  const getEstado = (c) => {
    if (c.estado === "cancelada") return "cancelada";
    if (c.estado === "completada") return "completada";

    const fecha = parseFechaLocal(c.fecha);
    if (fecha < ahora) return "atrasada";

    return "pendiente";
  };

  const citasHoy = citas
    .filter(c => esHoy(c.fecha))
    .sort((a, b) => parseFechaLocal(a.fecha) - parseFechaLocal(b.fecha));

  const pendientes = citas.filter(c => getEstado(c) === "pendiente").length;
  const atrasadas = citas.filter(c => getEstado(c) === "atrasada").length;
  const completadas = citas.filter(c => getEstado(c) === "completada").length;
  const canceladas = citas.filter(c => getEstado(c) === "cancelada").length;

  const clientesHoy = clientes.filter(c => esHoy(c.created_at)).length;
  const cantidadCitasHoy = citasHoy.length;

  let pagadoHoy = 0;
  let pendienteHoy = 0;
  let facturasHoy = 0;

  let totalMes = 0;
  const mesActual = ahora.getMonth();
  const anioActual = ahora.getFullYear();

  ingresos.forEach(i => {

    const servicios = i.servicios || [];
    const subtotal = servicios.reduce((acc, s) => acc + s.monto, 0);
    const itbis = subtotal * 0.18;
    const descuento = subtotal * ((i.descuento || 0) / 100);
    const total = subtotal + itbis - descuento;

    if (esHoy(i.created_at)) {
      facturasHoy++;
      if (i.pagado) pagadoHoy += total;
      else pendienteHoy += total;
    }

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

  const formato = (n) => `RD$ ${formatMoney(n)}`;;
  if (
    clientesLoading ||
    ingresosLoading ||
    citasLoading
  ) {
    return (
      <PageWrapper>

        <div className="space-y-6">

          <SkeletonLoader alto="h-10" />

          <div className="grid grid-cols-3 gap-4">

            <SkeletonLoader alto="h-28" />
            <SkeletonLoader alto="h-28" />
            <SkeletonLoader alto="h-28" />

          </div>

          <SkeletonLoader lineas={8} />

        </div>

      </PageWrapper>
    );
  }
  return (
    <PageWrapper>

      <div className="max-w-7xl mx-auto space-y-8 px-4">

        {/* HEADER */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard 📊
          </h1>
          <p className="text-gray-500 text-sm">
            {formatFecha(new Date())}
          </p>
        </div>

        {/* ESTADOS */}
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">🟡 {pendientes}</span>
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">🔴 {atrasadas}</span>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">✅ {completadas}</span>
          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full">⛔ {canceladas}</span>
        </div>

        {/* CITAS HOY */}
        <div className="bg-yellow-50 border border-yellow-200 p-5 rounded-xl space-y-4">
          <h3 className="font-semibold">📅 Citas de hoy</h3>

          {citasHoy.length === 0 ? (
            <p className="text-gray-500">No hay citas ✅</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto">

              {citasHoy.map(c => {
                const estado = getEstado(c);

                return (
                  <div
                    key={c.id}
                    className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition"
                  >
                    <p className="font-medium">
                      🕒 {formatHora(parseFechaLocal(c.fecha))}
                    </p>

                    <p className="text-sm text-gray-500">
                      {c.cliente?.nombre} {c.cliente?.apellido}
                    </p>

                    <span className={`text-xs px-2 py-1 rounded-full mt-2 inline-block
                      ${estado === "completada" && "bg-green-100 text-green-700"}
                      ${estado === "atrasada" && "bg-red-100 text-red-700"}
                      ${estado === "cancelada" && "bg-gray-300 text-gray-700"}
                      ${estado === "pendiente" && "bg-yellow-100 text-yellow-700"}
                    `}>
                      {estado}
                    </span>
                  </div>
                );
              })}

            </div>
          )}
        </div>

        {/* KPIs */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

          <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">Clientes hoy</p>
              <p className="text-xl font-bold">{clientesHoy}</p>
            </div>
            <span className="text-blue-500 text-xl">👤</span>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">Citas hoy</p>
              <p className="text-xl font-bold">{cantidadCitasHoy}</p>
            </div>
            <span className="text-indigo-500 text-xl">📅</span>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">Pagado hoy</p>
              <p className="text-xl font-bold text-green-600">
                {formato(pagadoHoy)}
              </p>
            </div>
            <span className="text-green-500 text-xl">💰</span>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">Pendiente</p>
              <p className="text-xl font-bold text-red-500">
                {formato(pendienteHoy)}
              </p>
            </div>
            <span className="text-red-500 text-xl">⚠️</span>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">Facturas</p>
              <p className="text-xl font-bold">{facturasHoy}</p>
            </div>
            <span className="text-purple-500 text-xl">🧾</span>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">Mes</p>
              <p className="text-xl font-bold text-blue-600">
                {formato(totalMes)}
              </p>
            </div>
            <span className="text-blue-500 text-xl">📊</span>
          </div>

        </div>

        {/* GRÁFICOS */}
        <div className="grid gap-6 lg:grid-cols-3">

          {[
            { title: "📈 Ingresos", component: <GraficoIngresos ingresos={ingresos} /> },
            { title: "👥 Clientes", component: <GraficoClientes clientes={clientes} /> },
            { title: "📅 Citas", component: <GraficoCitas citas={citas} /> }
          ].map((g, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md h-[420px] flex flex-col">

              <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">
                {g.title}
              </h3>

              <div className="flex-1">
                <div className="h-full w-full">
                  {g.component}
                </div>
              </div>

            </div>
          ))}

        </div>

      </div>

    </PageWrapper>
  );
}

export default DashboardHome;