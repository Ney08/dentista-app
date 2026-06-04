import { useState } from "react";
import { useIngresos } from "../hooks/useIngresos";
import PageWrapper from "../components/PageWrapper";
import { generarReporte } from "../utils/pdfReporte";
import { parseFechaLocal } from "../utils/fecha";
import { exportToExcel } from "../utils/exportExcel";
import { formatMoney } from "../utils/format";
import SkeletonLoader from "../components/SkeletonLoader";

function ReportesPage() {

  const { ingresos, isLoading } = useIngresos();

  const [tipo, setTipo] = useState("mensual");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const ahora = new Date();

  const labelMap = {
    semanal: "Últimos 7 días",
    mensual: "Este mes",
    anual: "Este año",
  };

  // ✅ FILTRO COMPLETO (rango + tabs)
  const ingresosFiltrados = ingresos.filter((ingreso) => {

    if (!ingreso.created_at || !ingreso.pagado) return false;

    const fecha = parseFechaLocal(ingreso.created_at);

    // 🔥 RANGO DE FECHAS
    if (desde) {
      const fDesde = new Date(desde);
      if (fecha < fDesde) return false;
    }

    if (hasta) {
      const fHasta = new Date(hasta);
      fHasta.setHours(23, 59, 59);
      if (fecha > fHasta) return false;
    }

    // 🔥 SI NO HAY RANGO → usar tabs
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
  });

  // ✅ TABLA
  const datosTabla = ingresosFiltrados.map((ingreso) => {

    const fecha = parseFechaLocal(ingreso.created_at);
    const servicios = ingreso.servicios || [];

    const subtotal = servicios.reduce((s, x) => s + (x.monto || 0), 0);
    const itbis = subtotal * 0.18;
    const descuento = subtotal * ((ingreso.descuento || 0) / 100);
    const total = subtotal + itbis - descuento;

    return {
      Fecha: fecha,
      FechaStr: fecha.toLocaleDateString("es-DO"),
      Cliente: ingreso.cliente?.nombre || "N/A",
      Subtotal: subtotal,
      ITBIS: itbis,
      Descuento: descuento,
      Total: total
    };
  });

  const datosOrdenados = [...datosTabla].sort(
    (a, b) => b.Fecha - a.Fecha
  );

  const total = datosOrdenados.reduce((acc, d) => acc + d.Total, 0);
  const cantidadFacturas = datosOrdenados.length;
  const promedio = cantidadFacturas ? total / cantidadFacturas : 0;

  const getFileName = (ext) => {
    const fecha = new Date().toISOString().split("T")[0];
    return `reporte_${tipo}_${fecha}.${ext}`;
  };

  const handlePDF = () => {
    generarReporte({
      ingresos: ingresosFiltrados,
      tipo,
      fileName: getFileName("pdf"),
    });
  };

  const handleExcel = () => {
    exportToExcel(datosOrdenados, `reporte_${tipo}`);
  };
  if (isLoading) {
    return (
      <PageWrapper>

        <div className="h-full max-w-6xl mx-auto flex flex-col gap-4 md:gap-6 overflow-hidden">

          {/* HEADER */}
          <div className="space-y-3 text-center">

            <div className="
            h-8 w-64 mx-auto
            bg-gray-300 rounded-xl
            animate-pulse
          " />

            <div className="
            h-4 w-40 mx-auto
            bg-gray-200 rounded-xl
            animate-pulse
          " />

          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            <div className="
            h-28 rounded-2xl
            bg-gray-200 animate-pulse
          " />

            <div className="
            h-28 rounded-2xl
            bg-gray-200 animate-pulse
          " />

            <div className="
            h-28 rounded-2xl
            bg-gray-200 animate-pulse
          " />

          </div>

          {/* TABLA */}
          <div className="
          h-[400px]
          rounded-2xl
          bg-gray-200
          animate-pulse
        " />

        </div>

      </PageWrapper>
    );
  }
  return (
    <PageWrapper>

      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="text-center pt-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Reportes 📊</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            {(desde || hasta)
              ? `Filtro activo`
              : labelMap[tipo]} (solo pagos completados)
          </p>
        </div>

        {/* TABS */}
        <div className="flex overflow-x-auto justify-start sm:justify-center gap-2 pb-1">
          {["semanal", "mensual", "anual"].map((t) => (
            <button
              key={t}
              onClick={() => setTipo(t)}
              disabled={desde || hasta}
              className={`
                px-4 h-11 rounded-2xl whitespace-nowrap text-sm sm:text-base transition active:scale-[0.98]
                ${tipo === t
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"}
                ${desde || hasta ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ✅ FILTRO RANGO */}
        <div className="flex flex-col sm:flex-row justify-center gap-3">

          <input
            type="date"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
            className="w-full sm:w-auto border border-gray-200 px-4 h-12 rounded-2xl text-sm sm:text-base"
          />

          <input
            type="date"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
            className="w-full sm:w-auto border border-gray-200 px-4 h-12 rounded-2xl text-sm sm:text-base"
          />

          <button
            onClick={() => {
              setDesde("");
              setHasta("");
            }}
            className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 px-4 h-12 rounded-2xl text-sm sm:text-base transition"
          >
            Limpiar
          </button>

        </div>

        {/* CARDS */}
        <div className="grid md:grid-cols-3 gap-5">

          <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <p>💰 Ingresos</p>
            <p className="text-2xl font-bold text-green-600">
              RD$ {formatMoney(total)}
            </p>
          </div>

          <div className="card">
            <p>📄 Facturas</p>
            <p className="text-2xl font-bold">{cantidadFacturas}</p>
          </div>

          <div className="card">
            <p>📊 Promedio</p>
            <p className="text-2xl font-bold text-purple-600">
              RD$ {formatMoney(promedio)}
            </p>
          </div>

        </div>

        {/* BOTONES */}

        <div className="flex flex-col sm:flex-row justify-center gap-3">


          <button
            onClick={handlePDF}
            className="w-full sm:w-auto bg-blue-500 text-white px-6 h-12 rounded-2xl shadow-sm hover:brightness-110 transition active:scale-[0.98] text-sm sm:text-base font-medium"
          >
            📄 PDF
          </button>

          <button
            onClick={handleExcel}
            className="w-full sm:w-auto bg-green-600 text-white px-6 h-12 rounded-2xl shadow-sm hover:brightness-110 transition active:scale-[0.98] text-sm sm:text-base font-medium"
          >
            📥 Excel
          </button>

        </div>

        {/* ✅ TABLA SCROLL */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex-1 min-h-0">

          <div className="max-h-[50vh] overflow-auto">

            <table className="w-full text-sm sm:text-base">

              <thead className="bg-gray-50 sticky top-0 text-[11px] sm:text-xs uppercase text-gray-500 backdrop-blur-sm">
                <tr>
                  <th className="px-3 py-2 text-left">Fecha</th>
                  <th className="px-3 py-2 text-left">Cliente</th>
                  <th className="px-3 py-2 text-right">Subtotal</th>
                  <th className="px-3 py-2 text-right">ITBIS</th>
                  <th className="px-3 py-2 text-right">Desc.</th>
                  <th className="px-3 py-2 text-right">Total</th>
                </tr>
              </thead>

              <tbody>

                {datosOrdenados.map((d, i) => (
                  <tr
                    key={i}
                    className={`
                      border-t
                      ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      hover:bg-blue-50/60 transition-all duration-200
                    `}
                  >
                    <td className="px-3 py-2">{d.FechaStr}</td>
                    <td className="px-3 py-2">{d.Cliente}</td>

                    <td className="px-3 py-2 text-right">
                      RD$ {formatMoney(d.Subtotal)}
                    </td>

                    <td className="px-3 py-2 text-right">
                      RD$ {formatMoney(d.ITBIS)}
                    </td>

                    <td className="px-3 py-2 text-right">
                      RD$ {formatMoney(d.Descuento)}
                    </td>

                    <td className="px-3 py-2 text-right font-semibold">
                      RD$ {formatMoney(d.Total)}
                    </td>
                  </tr>
                ))}



              </tbody>
              <tfoot className="sticky bottom-0 bg-white border-t font-bold backdrop-blur-sm">

                {datosOrdenados.length > 0 && (
                  <tr className="border-t bg-gray-100 font-bold">
                    <td colSpan="5" className="px-3 py-2 text-right">
                      Total General:
                    </td>
                    <td className="px-3 py-2 text-right text-green-600">
                      RD$ {formatMoney(total)}
                    </td>
                  </tr>
                )}
              </tfoot>
            </table>

          </div>

        </div>

      </div>

    </PageWrapper>
  );
}

export default ReportesPage;