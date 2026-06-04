
import { useState } from "react";
import { parseFechaLocal } from "../../utils/fecha";
import { Bar } from "react-chartjs-2";

import { formatMoney } from "../../utils/format";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

function GraficoIngresos({ ingresos = [] }) {

  const [tipo, setTipo] = useState("mes"); // semana | mes | anio

  // ✅ AGRUPAR DINÁMICO
  const agruparIngresos = () => {
    const grupos = {};

    ingresos.forEach(i => {
      const fecha = parseFechaLocal(i.created_at);
      if (!fecha) return;

      const servicios = Array.isArray(i.servicios) ? i.servicios : [];

      const subtotal = servicios.reduce((acc, s) => acc + (s.monto || 0), 0);
      const itbis = subtotal * 0.18;
      const descuento = subtotal * ((i.descuento || 0) / 100);
      const total = subtotal + itbis - descuento;

      let clave;

      if (tipo === "mes") {
        clave = fecha.getMonth();
      }

      if (tipo === "anio") {
        clave = fecha.getFullYear();
      }

      if (tipo === "semana") {
        const inicio = new Date(fecha);
        inicio.setDate(fecha.getDate() - inicio.getDay());
        clave = inicio.toISOString().slice(0, 10);
      }

      if (!grupos[clave]) {
        grupos[clave] = 0;
      }

      grupos[clave] += total;
    });

    return grupos;
  };

  const grupos = agruparIngresos();

  let labels = [];
  let dataValues = [];

  const nombresMeses = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
  ];

  // ✅ ✅ ✅ FIX PRO (MES COMPLETO)
  if (tipo === "mes") {

    labels = nombresMeses;

    dataValues = Array.from({ length: 12 }, (_, i) => {
      return grupos[i] || 0;
    });
  }

  // ✅ AÑO
  if (tipo === "anio") {
    const orden = Object.keys(grupos).sort();

    labels = orden;
    dataValues = orden.map(a => grupos[a]);
  }

  // ✅ SEMANA
  if (tipo === "semana") {
    const orden = Object.keys(grupos).sort();

    labels = orden.map(f => `Sem ${f}`);
    dataValues = orden.map(f => grupos[f]);
  }

  const data = {
    labels,
    datasets: [
      {
        label: "Ingresos RD$",
        data: dataValues,
        backgroundColor: dataValues.map((_, i) => {
          const mesActual = new Date().getMonth();
          return i === mesActual
              
            ? "#3b82f6"
            : "#f59e0b";
        }),
        borderRadius: 6,
        barThickness: 30
      }
    ]

  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `RD$ ${formatMoney(context.raw)}`
        }
      }
    },

    scales: {
      x: {
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (v) => `RD$ ${formatMoney(v)}`
        }
      }
    }
  };

  return (
    <div className="w-full h-full space-y-3">

      {/* ✅ SELECTOR */}
      <div className="flex gap-2 justify-center">

        <button
          onClick={() => setTipo("semana")}
          className={`px-3 py-1 rounded ${tipo === "semana"
            ? "bg-blue-500 text-white"
            : "bg-gray-200"
            }`}
        >
          Semana
        </button>

        <button
          onClick={() => setTipo("mes")}
          className={`px-3 py-1 rounded ${tipo === "mes"
            ? "bg-blue-500 text-white"
            : "bg-gray-200"
            }`}
        >
          Mes
        </button>

        <button
          onClick={() => setTipo("anio")}
          className={`px-3 py-1 rounded ${tipo === "anio"
            ? "bg-blue-500 text-white"
            : "bg-gray-200"
            }`}
        >
          Año
        </button>

      </div>

      {/* ✅ GRÁFICO */}
      <div className="h-[300px]">
        <Bar data={data} options={options} />
      </div>

    </div>
  );
}

export default GraficoIngresos;
