import { useState } from "react";
import { useIngresos } from "../hooks/useIngresos";
import PageWrapper from "../components/PageWrapper";
import { generarReporte } from "../utils/pdfReporte"; // 🔥 nuevo nombre genérico

function ReportesPage() {

  const { ingresos } = useIngresos();
  const [tipo, setTipo] = useState("mensual");

  const ahora = new Date();

  const labelMap = {
    semanal: "Últimos 7 días",
    mensual: "Este mes",
    anual: "Este año",
  };

  // ✅ FILTRO
  const ingresosFiltrados = ingresos.filter((ingreso) => {

    if (!ingreso.created_at || !ingreso.pagado) return false;

    const fecha = new Date(ingreso.created_at);

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

    return false;
  });

  // ✅ TOTAL REAL
  const total = ingresosFiltrados.reduce((acc, ingreso) => {

    const servicios = ingreso.servicios || [];

    const subtotal = servicios.reduce((s, x) => s + x.monto, 0);
    const itbis = subtotal * 0.18;
    const descuento = subtotal * ((ingreso.descuento || 0) / 100);

    return acc + (subtotal + itbis - descuento);

  }, 0);

  const cantidadFacturas = ingresosFiltrados.length;

  const promedio =
    cantidadFacturas > 0
      ? total / cantidadFacturas
      : 0;

  // ✅ NOMBRE DINÁMICO PRO
  const getFileName = () => {
    const fecha = new Date().toISOString().split("T")[0];
    return `reporte_${tipo}_${fecha}.pdf`;
  };


  const handlePDF = () => {
    generarReporte({
      ingresos: ingresosFiltrados,
      tipo,
      fileName: getFileName(),
    });
  };


  return (
    <PageWrapper>

      <div className="max-w-5xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Reportes 📊</h1>
          <p className="text-sm text-gray-500">
            {labelMap[tipo]} (solo pagos completados)
          </p>
        </div>

        {/* TABS */}
        <div className="flex justify-center gap-3">
          {["semanal", "mensual", "anual"].map((t) => (
            <button
              key={t}
              onClick={() => setTipo(t)}
              className={`px-5 py-2 rounded-full transition ${tipo === t
                  ? t === "mensual"
                    ? "bg-green-500 text-white"
                    : t === "semanal"
                      ? "bg-blue-500 text-white"
                      : "bg-purple-500 text-white"
                  : "bg-gray-200"
                }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* CARDS */}
        <div className="grid md:grid-cols-3 gap-5">

          <div className="card">
            <p>💰 Ingresos</p>
            <p className="text-2xl font-bold text-green-600">
              RD$ {total.toFixed(2)}
            </p>
          </div>

          <div className="card">
            <p>📄 Facturas</p>
            <p className="text-2xl font-bold">
              {cantidadFacturas}
            </p>
          </div>

          <div className="card">
            <p>📊 Promedio</p>
            <p className="text-2xl font-bold text-purple-600">
              RD$ {promedio.toFixed(2)}
            </p>
          </div>

        </div>

        {/* BOTÓN */}
        <div className="flex justify-center">
          <button
            onClick={handlePDF}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl shadow"
          >
            📄 Descargar reporte {tipo}
          </button>
        </div>

      </div>

    </PageWrapper>
  );
}

export default ReportesPage;