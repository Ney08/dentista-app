import { useState } from "react";
import { useIngresos } from "../hooks/useIngresos";
import { useEgresos } from "../hooks/useEgresos";
import PageWrapper from "../components/PageWrapper";
import SkeletonLoader from "../components/SkeletonLoader";
import { generarReporte } from "../utils/pdfReporte";
import { parseFechaLocal } from "../utils/fecha";
import { exportToExcel } from "../utils/exportExcel";
import { formatMoney } from "../utils/format";
import { useServicios } from "../hooks/useServicios";
function ReportesPage() {

  const { ingresos, isLoading } = useIngresos();

  const { egresos } = useEgresos();
  const { servicios } = useServicios();
  const [tipo, setTipo] = useState("mensual");

  const [desde, setDesde] = useState("");

  const [hasta, setHasta] = useState("");

  const ahora = new Date();

  const labelMap = {
    semanal: "Últimos 7 días",
    mensual: "Este mes",
    anual: "Este año",
  };

  const serviciosMap = {};

  (servicios || []).forEach(servicio => {

    serviciosMap[servicio.id] =
      servicio.nombre;

  });

  const filtrarFecha = (fecha) => {

    if (desde) {

      const fDesde = new Date(desde);

      if (fecha < fDesde) return false;

    }

    if (hasta) {

      const fHasta = new Date(hasta);

      fHasta.setHours(23, 59, 59);

      if (fecha > fHasta) return false;

    }

    if (!desde && !hasta) {

      if (tipo === "semanal") {

        const hace7 = new Date();

        hace7.setDate(ahora.getDate() - 7);

        return fecha >= hace7;

      }

      if (tipo === "mensual") {

        return (
          fecha.getMonth() === ahora.getMonth() &&
          fecha.getFullYear() === ahora.getFullYear()
        );

      }

      if (tipo === "anual") {

        return fecha.getFullYear() === ahora.getFullYear();

      }

    }

    return true;

  };

  const ingresosFiltrados = ingresos.filter((ingreso) => {

    if (!ingreso.created_at || !ingreso.pagado) return false;

    const fecha = parseFechaLocal(ingreso.created_at);

    return filtrarFecha(fecha);

  });

  const egresosFiltrados = egresos.filter((egreso) => {

    const fecha = parseFechaLocal(
      egreso.fecha || egreso.created_at
    );

    return filtrarFecha(fecha);

  });

  const datosTabla = ingresosFiltrados.map((ingreso) => {

    const fecha = parseFechaLocal(ingreso.created_at);

    const tratamientos = ingreso.servicios || [];

    const subtotal = tratamientos.reduce(
      (s, x) => s + (x.monto || 0),
      0
    );

    const costos = tratamientos.reduce(
      (s, x) =>
        s + Number(x.costo_servicio || 0),
      0
    );

    const itbis = subtotal * 0.18;

    const descuento =
      subtotal * ((ingreso.descuento || 0) / 100);

    const total =
      subtotal + itbis - descuento;

    const utilidad =
      total - costos;

    return {

      Fecha: fecha,

      FechaStr:
        fecha.toLocaleDateString("es-DO"),

      Paciente:
        `${ingreso.cliente?.nombre || ""} ${ingreso.cliente?.apellido || ""}`.trim(),

      Tratamientos:
  tratamientos
    .map((s) => {

      const nombreServicio =
        serviciosMap[s.servicio_id] ||
        serviciosMap[s.catalogo_servicio_id] ||
        serviciosMap[s.servicio_catalogo_id] ||
        s.nombre_servicio ||
        s.nombre ||
        s.servicio;

      return nombreServicio || "Procedimiento";

    })
    .filter(Boolean)
    .join(", "),
      Subtotal: subtotal,

      ITBIS: itbis,

      Descuento: descuento,

      Costos: costos,

      Total: total,

      Utilidad: utilidad

    };

  });

  const datosOrdenados = [...datosTabla].sort(
    (a, b) => b.Fecha - a.Fecha
  );

  const ingresosClinicos = datosOrdenados.reduce(
    (acc, d) => acc + d.Total,
    0
  );

  const costosClinicos = datosOrdenados.reduce(
    (acc, d) => acc + d.Costos,
    0
  );

  const produccionOperativa = datosOrdenados.reduce(
    (acc, d) => acc + d.Utilidad,
    0
  );

  const descuentosTotales = datosOrdenados.reduce(
    (acc, d) => acc + d.Descuento,
    0
  );

  const totalEgresos = egresosFiltrados.reduce(
    (acc, e) =>
      acc + Number(e.monto || 0),
    0
  );

  const cajaDisponible = ingresosClinicos - totalEgresos

  const utilidadNeta =
    produccionOperativa - totalEgresos;

  const margenRentabilidad =
    ingresosClinicos > 0
      ? (utilidadNeta / ingresosClinicos) * 100
      : 0;

  const rentabilidadColor =
    margenRentabilidad >= 40
      ? "text-green-300"
      : margenRentabilidad >= 20
        ? "text-yellow-300"
        : "text-red-300";

  const totalFacturas =
    datosOrdenados.length;

  const promedioFactura =
    totalFacturas
      ? ingresosClinicos / totalFacturas
      : 0;

  const pacientesUnicos =
    new Set(
      datosOrdenados.map(d => d.Paciente)
    ).size;

  const tratamientosRealizados =
    datosOrdenados.reduce(
      (acc, d) =>
        acc +
        d.Tratamientos.split(",").length,
      0
    );

  const topPacientes = Object.entries(

    datosOrdenados.reduce((acc, d) => {

      acc[d.Paciente] =
        (acc[d.Paciente] || 0) + d.Total;

      return acc;

    }, {})

  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const tratamientosMap = {};

  ingresosFiltrados.forEach(i => {

    (i.servicios || []).forEach(s => {


      const nombre =
        serviciosMap[s.servicio_id] ||
        serviciosMap[s.catalogo_servicio_id] ||
        s.servicio ||
        s.nombre_servicio ||
        s.nombre ||
        "Procedimiento";


      if (!tratamientosMap[nombre]) {

        tratamientosMap[nombre] = {
          cantidad: 0,
          total: 0
        };

      }

      tratamientosMap[nombre].cantidad += 1;

      tratamientosMap[nombre].total +=
        Number(s.monto || 0);

    });

  });

  const tratamientosFrecuentes =
    Object.entries(tratamientosMap)
      .sort((a, b) => b[1].cantidad - a[1].cantidad)
      .slice(0, 5);

  const getFileName = (ext) => {

    const fecha =
      new Date().toISOString().split("T")[0];

    return `reporte_clinico_${tipo}_${fecha}.${ext}`;

  };

  const handlePDF = () => {

    generarReporte({
      ingresos: ingresosFiltrados,
      tipo,
      fileName: getFileName("pdf"),
    });

  };

  const handleExcel = () => {

    exportToExcel(
      datosOrdenados,
      `reporte_clinico_${tipo}`
    );

  };

  const cardKpi = "relative overflow-hidden bg-white/90 backdrop-blur-xl border border-white/40 rounded-[30px] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-[2px] hover:scale-[1.015] transition-all duration-300";

  if (isLoading) {

    return (

      <PageWrapper>

        <div className="h-full max-w-7xl mx-auto space-y-6">

          <SkeletonLoader alto="h-10" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            <SkeletonLoader alto="h-32" />
            <SkeletonLoader alto="h-32" />
            <SkeletonLoader alto="h-32" />
            <SkeletonLoader alto="h-32" />

          </div>

          <SkeletonLoader alto="h-[500px]" />

        </div>

      </PageWrapper>

    );

  }

  return (

    <PageWrapper>

      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="text-center space-y-3 pt-2">

          <h1 className="text-4xl md:text-5xl font-black tracking-tight">

            <span className="bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent">
              Reportes Clínicos
            </span>

            <span className="ml-2">
              🦷
            </span>

          </h1>

          <div className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-indigo-500" />

          <p className="text-sm text-gray-500">
            {(desde || hasta)
              ? "Filtro personalizado activo"
              : labelMap[tipo]
            } • control financiero odontológico
          </p>

        </div>

        {/* FILTROS */}
        <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-[32px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] space-y-5">

          <div className="flex flex-wrap justify-center gap-2">

            {["semanal", "mensual", "anual"].map((t) => (

              <button
                key={t}
                onClick={() => setTipo(t)}
                disabled={desde || hasta}
                className={`px-5 h-11 rounded-2xl text-sm font-semibold transition-all duration-300 active:scale-[0.98] ${tipo === t ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-200/50" : "bg-gray-100 hover:bg-gray-200 text-slate-600"} ${desde || hasta ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {t}
              </button>

            ))}

          </div>

          <div className="flex flex-col md:flex-row justify-center gap-3">

            <input
              type="date"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
              className="h-12 px-4 rounded-2xl border border-gray-100 bg-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all duration-300"
            />

            <input
              type="date"
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
              className="h-12 px-4 rounded-2xl border border-gray-100 bg-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all duration-300"
            />

            <button
              onClick={() => {
                setDesde("");
                setHasta("");
              }}
              className="h-12 px-5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-slate-700 font-semibold transition-all duration-300 active:scale-[0.98]"
            >
              Limpiar
            </button>

          </div>

        </div>

        {/* KPIS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-5">

          <div className={cardKpi}>
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-green-500/10 blur-3xl" />
            <p className="text-sm text-gray-500">💰 Ingresos clínicos</p>
            <h2 className="mt-2 text-3xl font-black text-green-600">RD$ {formatMoney(ingresosClinicos)}</h2>
          </div>
          <div className={cardKpi}>

            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-emerald-500/10 blur-3xl" />

            <p className="text-sm text-gray-500">
              💵 Caja disponible
            </p>

            <h2 className="mt-2 text-3xl font-black text-emerald-600">
              RD$ {formatMoney(cajaDisponible)}
            </h2>

            <p className="mt-2 text-xs text-gray-400">
              Ingresos - egresos
            </p>

          </div>
          <div className={cardKpi}>
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-orange-500/10 blur-3xl" />
            <p className="text-sm text-gray-500">🧾 Costos clínicos</p>
            <h2 className="mt-2 text-3xl font-black text-orange-500">RD$ {formatMoney(costosClinicos)}</h2>
          </div>

          <div className={cardKpi}>
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-rose-500/10 blur-3xl" />
            <p className="text-sm text-gray-500">💸 Egresos operativos</p>
            <h2 className="mt-2 text-3xl font-black text-rose-500">RD$ {formatMoney(totalEgresos)}</h2>
          </div>

          <div className={cardKpi}>
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-pink-500/10 blur-3xl" />
            <p className="text-sm text-gray-500">🏷️ Descuentos aplicados</p>
            <h2 className="mt-2 text-3xl font-black text-pink-500">RD$ {formatMoney(descuentosTotales)}</h2>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 rounded-[30px] p-6 shadow-[0_20px_50px_rgba(99,102,241,0.28)]">
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
            <p className="text-sm text-purple-100">🏦 Utilidad neta</p>
            <h2 className="mt-2 text-4xl font-black text-white">RD$ {formatMoney(utilidadNeta)}</h2>

            <p className={`mt-2 text-sm font-semibold ${rentabilidadColor}`}>
              Rentabilidad {margenRentabilidad.toFixed(1)}%
            </p>

          </div>

        </div>

        {/* KPIS SECUNDARIOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

          <div className={cardKpi}>
            <p className="text-sm text-gray-500">📄 Facturas pagadas</p>
            <h2 className="mt-2 text-3xl font-black text-slate-800">{totalFacturas}</h2>
          </div>

          <div className={cardKpi}>
            <p className="text-sm text-gray-500">👥 Pacientes atendidos</p>
            <h2 className="mt-2 text-3xl font-black text-indigo-600">{pacientesUnicos}</h2>
          </div>

          <div className={cardKpi}>
            <p className="text-sm text-gray-500">⭐ Promedio por factura</p>
            <h2 className="mt-2 text-3xl font-black text-purple-600">RD$ {formatMoney(promedioFactura)}</h2>
          </div>

          <div className={cardKpi}>
            <p className="text-sm text-gray-500">🦷 Procedimientos realizados</p>
            <h2 className="mt-2 text-3xl font-black text-blue-600">{tratamientosRealizados}</h2>
          </div>

        </div>

        {/* ALERTAS
        <div className="bg-amber-50 border border-amber-200 rounded-[32px] p-6">

          <h3 className="font-bold text-amber-700 mb-4">
            ⚠️ Alertas financieras
          </h3>

          <div className="space-y-2 text-sm">

            {margenRentabilidad < 20 && (
              <p className="text-red-500">
                • Rentabilidad baja en este período
              </p>
            )}

            {totalEgresos > ingresosClinicos * 0.4 && (
              <p className="text-amber-600">
                • Egresos operativos elevados
              </p>
            )}

            {descuentosTotales > ingresosClinicos * 0.15 && (
              <p className="text-orange-500">
                • Muchos descuentos aplicados
              </p>
            )}

            {totalFacturas === 0 && (
              <p className="text-slate-500">
                • No hay facturas registradas
              </p>
            )}

          </div>

        </div> */}

        {/* RESUMEN */}
        <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-[32px] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">

          <h3 className="text-xl font-bold text-slate-800 mb-6">
            📊 Resumen financiero
          </h3>

          <div className="space-y-4">

            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <p className="text-slate-600">Ingresos clínicos</p>
              <p className="font-black text-green-600">RD$ {formatMoney(ingresosClinicos)}</p>
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <p className="text-slate-600">Costos clínicos</p>
              <p className="font-black text-orange-500">- RD$ {formatMoney(costosClinicos)}</p>
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <p className="text-slate-600">Egresos operativos</p>
              <p className="font-black text-rose-500">- RD$ {formatMoney(totalEgresos)}</p>
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <p className="text-slate-600">Descuentos aplicados</p>
              <p className="font-black text-pink-500">- RD$ {formatMoney(descuentosTotales)}</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-lg font-bold text-slate-800">Utilidad neta final</p>
              <p className="text-3xl font-black text-indigo-600">RD$ {formatMoney(utilidadNeta)}</p>
            </div>

          </div>

        </div>

        {/* EXPORTAR */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">

          <button
            onClick={handlePDF}
            className="group relative overflow-hidden h-12 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold shadow-lg shadow-rose-200/50 hover:scale-[1.03] transition-all duration-300"
          >
            <span className="relative z-10">
              📄 Exportar PDF
            </span>
          </button>

          <button
            onClick={handleExcel}
            className="group relative overflow-hidden h-12 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold shadow-lg shadow-emerald-200/50 hover:scale-[1.03] transition-all duration-300"
          >
            <span className="relative z-10">
              📥 Exportar Excel
            </span>
          </button>

        </div>

        {/* ANALISIS */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-[32px] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">

            <div className="mb-5">

              <h3 className="text-lg font-bold text-slate-800">
                👑 Pacientes principales
              </h3>

              <p className="text-sm text-gray-500">
                Mayor facturación
              </p>

            </div>

            <div className="space-y-3">

              {topPacientes.map(([paciente, total], i) => (

                <div
                  key={i}
                  className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3"
                >

                  <div className="flex items-center gap-3">

                    <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold flex items-center justify-center">
                      {i + 1}
                    </div>

                    <p className="font-semibold text-slate-700">
                      {paciente}
                    </p>

                  </div>

                  <p className="font-black text-green-600">
                    RD$ {formatMoney(total)}
                  </p>

                </div>

              ))}

            </div>

          </div>

          <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-[32px] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">

            <div className="mb-5">

              <h3 className="text-lg font-bold text-slate-800">
                🔥 Procedimientos frecuentes
              </h3>

              <p className="text-sm text-gray-500">
                Más realizados
              </p>

            </div>

            <div className="space-y-3">

              {tratamientosFrecuentes.map(([nombre, data], i) => (

                <div
                  key={i}
                  className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3"
                >

                  <div>

                    <p className="font-semibold text-slate-700">
                      {nombre}
                    </p>

                    <p className="text-sm text-gray-500">
                      {data.cantidad} procedimientos
                    </p>

                  </div>

                  <p className="font-black text-indigo-600">
                    RD$ {formatMoney(data.total)}
                  </p>

                </div>

              ))}

            </div>

          </div>

        </div>

        {/* TABLA INGRESOS */}
        <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-[32px] shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden">

          <div className="px-6 py-5 border-b border-gray-100">

            <h3 className="text-xl font-bold text-slate-800">
              💰 Detalle financiero clínico
            </h3>

          </div>

          <div className="max-h-[70vh] overflow-auto">

            <table className="w-full text-sm">

              <thead className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-500">

                <tr>

                  <th className="px-5 py-4 text-left">Fecha</th>

                  <th className="px-5 py-4 text-left">Paciente</th>

                  <th className="px-5 py-4 text-left">Procedimientos</th>

                  <th className="px-5 py-4 text-right">Subtotal</th>

                  <th className="px-5 py-4 text-right">ITBIS</th>

                  <th className="px-5 py-4 text-right">Desc.</th>

                  <th className="px-5 py-4 text-right">Costos</th>

                  <th className="px-5 py-4 text-right">Producción</th>

                  <th className="px-5 py-4 text-right">Total</th>

                </tr>

              </thead>

              <tbody>

                {datosOrdenados.map((d, i) => (

                  <tr
                    key={i}
                    className="border-b border-gray-100 hover:bg-indigo-50/40 transition-all duration-200"
                  >

                    <td className="px-5 py-4 text-slate-600">
                      {d.FechaStr}
                    </td>

                    <td className="px-5 py-4 font-medium text-slate-700">
                      {d.Paciente}
                    </td>

                    <td className="px-5 py-4 text-slate-600 max-w-[300px]">
                      {d.Tratamientos}
                    </td>

                    <td className="px-5 py-4 text-right">
                      RD$ {formatMoney(d.Subtotal)}
                    </td>

                    <td className="px-5 py-4 text-right">
                      RD$ {formatMoney(d.ITBIS)}
                    </td>

                    <td className="px-5 py-4 text-right text-rose-500">
                      RD$ {formatMoney(d.Descuento)}
                    </td>

                    <td className="px-5 py-4 text-right text-orange-500 font-semibold">
                      RD$ {formatMoney(d.Costos)}
                    </td>

                    <td className="px-5 py-4 text-right text-indigo-600 font-bold">
                      RD$ {formatMoney(d.Utilidad)}
                    </td>

                    <td className="px-5 py-4 text-right font-black text-green-600">
                      RD$ {formatMoney(d.Total)}
                    </td>

                  </tr>

                ))}

              </tbody>

              <tfoot className="sticky bottom-0 bg-white border-t border-gray-100">

                <tr>

                  <td
                    colSpan="8"
                    className="px-5 py-4 text-right font-bold text-slate-700"
                  >
                    Total General
                  </td>

                  <td className="px-5 py-4 text-right font-black text-green-600">
                    RD$ {formatMoney(ingresosClinicos)}
                  </td>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">

                    <p className="text-slate-600">
                      Caja disponible
                    </p>

                    <p className="font-black text-emerald-600">
                      RD$ {formatMoney(cajaDisponible)}
                    </p>

                  </div>
                </tr>

              </tfoot>

            </table>

          </div>

        </div>

        {/* TABLA EGRESOS */}
        <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-[32px] shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden">

          <div className="px-6 py-5 border-b border-gray-100">

            <h3 className="text-xl font-bold text-slate-800">
              💸 Egresos operativos
            </h3>

          </div>

          <div className="max-h-[50vh] overflow-auto">

            <table className="w-full text-sm">

              <thead className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-500">

                <tr>

                  <th className="px-5 py-4 text-left">
                    Fecha
                  </th>

                  <th className="px-5 py-4 text-left">
                    Concepto
                  </th>

                  <th className="px-5 py-4 text-right">
                    Monto
                  </th>

                </tr>

              </thead>

              <tbody>

                {egresosFiltrados.length === 0 && (

                  <tr>

                    <td
                      colSpan="3"
                      className="text-center py-10 text-gray-400"
                    >
                      No hay egresos registrados
                    </td>

                  </tr>

                )}

                {egresosFiltrados.map((e, i) => (

                  <tr
                    key={i}
                    className="border-b border-gray-100 hover:bg-rose-50/40 transition-all duration-200"
                  >

                    <td className="px-5 py-4 text-slate-600">
                      {parseFechaLocal(
                        e.fecha || e.created_at
                      ).toLocaleDateString("es-DO")}
                    </td>

                    <td className="px-5 py-4 font-medium text-slate-700">
                      {e.descripcion || e.concepto || "Egreso"}
                    </td>

                    <td className="px-5 py-4 text-right font-black text-rose-500">
                      RD$ {formatMoney(e.monto)}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </PageWrapper>

  );

}

export default ReportesPage;