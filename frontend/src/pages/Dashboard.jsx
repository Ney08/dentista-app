import { useState } from "react";
import toast from "react-hot-toast";

import DashboardHome from "./DashboardHome";
import ClientesPage from "./ClientesPage";
import IngresosPage from "./IngresosPage";
import CitasPage from "./CitasPage";

import { generarReporteMensual } from "../utils/pdfReporte";
import { useIngresos } from "../hooks/useIngresos";

function Dashboard() {

  const [seccion, setSeccion] = useState("home");
  const { ingresos } = useIngresos();

  // ✅ render dinámico limpio
  const renderSeccion = () => {
    switch (seccion) {
      case "clientes":
        return <ClientesPage />;

      case "ingresos":
        return <IngresosPage />;

      case "citas":
        return <CitasPage />;

      default:
        return <DashboardHome />; // ✅ QUITAMOS citas
    }
  };

  // ✅ estilo activo
  const btnClass = (name) =>
    `block w-full text-left p-2 rounded transition ${
      seccion === name
        ? "bg-blue-500 text-white"
        : "hover:bg-gray-200"
    }`;

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* SIDEBAR */}
      <div className="w-64 bg-white shadow-md p-4 space-y-4">

        <h2 className="text-xl font-bold mb-4">
          Panel 🦷
        </h2>

        {/* NAV */}
        <div className="space-y-2">

          <button
            onClick={() => setSeccion("home")}
            className={btnClass("home")}
          >
            🏠 Dashboard
          </button>

          <button
            onClick={() => setSeccion("clientes")}
            className={btnClass("clientes")}
          >
            👤 Clientes
          </button>

          <button
            onClick={() => setSeccion("ingresos")}
            className={btnClass("ingresos")}
          >
            🧾 Facturación
          </button>

          <button
            onClick={() => setSeccion("citas")}
            className={btnClass("citas")}
          >
            📅 Citas
          </button>

        </div>

        <hr />

        {/* ACCIONES */}
        <div className="space-y-2">

          <button
            onClick={() => {
              if (ingresos.length === 0) {
                toast.error("No hay datos para generar reporte ❌");
                return;
              }

              generarReporteMensual(ingresos);
              toast.success("Reporte generado ✅");
            }}
            className="block w-full text-left p-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            📊 Reporte mensual
          </button>

        </div>

      </div>

      {/* CONTENIDO */}
      <div className="flex-1 p-6">
        {renderSeccion()}
      </div>

    </div>
  );
}

export default Dashboard;