import { useClientes } from "../hooks/useClientes";
import { useIngresos } from "../hooks/useIngresos";
import { useCitas } from "../hooks/useCitas";
import { useEffect } from "react";
import toast from "react-hot-toast";

import GraficoIngresos from "../components/GraficoIngresos";
import GraficoClientes from "../components/GraficoClientes";
import GraficoCitas from "../components/GraficoCitas";

import PageWrapper from "../components/PageWrapper";

function DashboardHome() {

  const { clientes } = useClientes();
  const { ingresos } = useIngresos();
  const { citas = [] } = useCitas();

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  // ✅ CITAS HOY
  const citasHoy = citas.filter((c) => {
    if (!c.fecha) return false;

    const fecha = new Date(c.fecha);
    fecha.setHours(0, 0, 0, 0);

    return (
      fecha.getTime() === hoy.getTime() &&
      c.estado !== "completada"
    );
  });

  // ✅ TOAST
  useEffect(() => {
    if (citasHoy.length > 0) {
      toast.success(`Tienes ${citasHoy.length} cita(s) hoy 📅`, {
        id: "toast-citas-hoy"
      });
    }
  }, [citasHoy.length]);

  // ✅ CALCULOS
  let totalFacturado = 0;
  let totalPagado = 0;
  let totalPendiente = 0;
  let totalMes = 0;

  const mesActual = hoy.getMonth();
  const anioActual = hoy.getFullYear();

  ingresos.forEach(i => {

    const servicios = i.servicios || [];

    const subtotal = servicios.reduce((acc, s) => acc + s.monto, 0);
    const itbis = subtotal * 0.18;
    const descuento = subtotal * ((i.descuento || 0) / 100);

    const totalFactura = subtotal + itbis - descuento;

    totalFacturado += totalFactura;

    if (i.pagado) totalPagado += totalFactura;
    else totalPendiente += totalFactura;

    if (i.created_at) {
      const fecha = new Date(i.created_at);

      if (
        fecha.getMonth() === mesActual &&
        fecha.getFullYear() === anioActual
      ) {
        totalMes += totalFactura;
      }
    }

  });

  const formato = (n) => `RD$ ${n.toFixed(2)}`;

  return (
    <PageWrapper>

      <div className="max-w-6xl mx-auto space-y-8">

        {/* ✅ HEADER */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">
            Dashboard 📊
          </h1>
          <p className="text-gray-500 text-sm">
            {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* ✅ CITAS DE HOY (SIN HOVER SCALE) */}
        <div className="bg-yellow-100 p-5 rounded-xl shadow-sm">
          <h3 className="font-semibold mb-3">
            📅 Citas de hoy
          </h3>

          {citasHoy.length === 0 ? (
            <p>No hay citas ✅</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3 max-h-52 overflow-y-auto">

              {citasHoy.map(c => (
                <div
                  key={c.id}
                  className="bg-white p-4 rounded-xl shadow-sm"
                >
                  <p className="font-bold">
                    🕒 {new Date(c.fecha).toLocaleTimeString()}
                  </p>

                  <p className="text-gray-600 text-sm">
                    {c.motivo}
                  </p>
                </div>
              ))}

            </div>
          )}
        </div>

        {/* ✅ CARDS */}
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

          <div className="card bg-blue-100">
            <p>Clientes</p>
            <p className="text-2xl font-bold">{clientes.length}</p>
          </div>

          <div className="card bg-indigo-100">
            <p>Facturado</p>
            <p className="text-2xl font-bold">{formato(totalFacturado)}</p>
          </div>

          <div className="card bg-green-100">
            <p>Pagado</p>
            <p className="text-2xl font-bold">{formato(totalPagado)}</p>
          </div>

          <div className={`card ${totalPendiente > 0 ? "bg-red-100" : "bg-green-100"}`}>
            <p>Pendiente</p>
            <p className="text-2xl font-bold">{formato(totalPendiente)}</p>
          </div>

          <div className="card bg-purple-100">
            <p>Facturas</p>
            <p className="text-2xl font-bold">{ingresos.length}</p>
          </div>

          <div className="card bg-gray-100">
            <p>Mes</p>
            <p className="text-2xl font-bold">{formato(totalMes)}</p>
          </div>

        </div>

        {/* ✅ 3 GRÁFICOS */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* INGRESOS */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-center font-semibold mb-4">
              📈 Ingresos
            </h3>


            <div className="w-full h-[250px]">
              <GraficoIngresos ingresos={ingresos} />
            </div>

          </div>

          {/* CLIENTES */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-center font-semibold mb-4">
              👥 Clientes
            </h3>

            <div className="h-[250px]">
              <GraficoClientes clientes={clientes} />
            </div>
          </div>

          {/* ✅ CITAS */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-center font-semibold mb-4">
              📅 Citas
            </h3>

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