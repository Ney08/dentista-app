import { useState } from "react";
import { parseFechaLocal } from "../../utils/fecha";
import { Bar } from "react-chartjs-2";
import { formatMoney } from "../../utils/format";

import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function GraficoIngresos({
  ingresos = [],
  egresos = []
}) {

  const [tipo, setTipo] = useState("mes");

  const grupos = {};

  ingresos.forEach(i => {

    const fecha =
      parseFechaLocal(i.created_at);

    if (!fecha) return;

    const servicios =
      Array.isArray(i.servicios)
        ? i.servicios
        : [];

    const subtotal =
      servicios.reduce(
        (acc, s) =>
          acc + (s.monto || 0),
        0
      );

    const costos =
      servicios.reduce(
        (acc, s) =>
          acc + Number(
            s.costo_servicio || 0
          ),
        0
      );

    const itbis =
      subtotal * 0.18;

    const descuento =
      subtotal * (
        (i.descuento || 0) / 100
      );

    const total =
      subtotal +
      itbis -
      descuento;

    const neta =
      total - costos;

    let clave;

    if (tipo === "mes") {
      clave = fecha.getMonth();
    }

    if (tipo === "anio") {
      clave = fecha.getFullYear();
    }

    if (tipo === "semana") {

      const inicio =
        new Date(fecha);

      inicio.setDate(
        fecha.getDate() -
        inicio.getDay()
      );

      clave = inicio
        .toISOString()
        .slice(0, 10);

    }

    if (!grupos[clave]) {

      grupos[clave] = {
        ingresos: 0,
        neta: 0,
        egresos: 0
      };

    }

    grupos[clave].ingresos += total;

    grupos[clave].neta += neta;

  });

  egresos.forEach(e => {

    const fechaRaw =
      e.fecha ||
      e.created_at;

    if (!fechaRaw) return;

    const fecha =
      new Date(
        fechaRaw.replace("Z", "")
      );

    if (isNaN(fecha)) return;

    let clave;

    if (tipo === "mes") {
      clave = fecha.getMonth();
    }

    if (tipo === "anio") {
      clave = fecha.getFullYear();
    }

    if (tipo === "semana") {

      const inicio =
        new Date(fecha);

      inicio.setDate(
        fecha.getDate() -
        inicio.getDay()
      );

      clave = inicio
        .toISOString()
        .slice(0, 10);

    }

    if (!grupos[clave]) {

      grupos[clave] = {
        ingresos: 0,
        neta: 0,
        egresos: 0
      };

    }

    grupos[clave].egresos +=
      Number(e.monto || 0);

  });

  let labels = [];

  let ingresosData = [];
  let netaData = [];
  let egresosData = [];

  const nombresMeses = [
    "Ene", "Feb", "Mar", "Abr",
    "May", "Jun", "Jul", "Ago",
    "Sep", "Oct", "Nov", "Dic"
  ];

  if (tipo === "mes") {

    labels = nombresMeses;

    ingresosData = Array.from(
      { length: 12 },
      (_, i) =>
        grupos[i]?.ingresos || 0
    );

    netaData = Array.from(
      { length: 12 },
      (_, i) =>
        grupos[i]?.neta || 0
    );

    egresosData = Array.from(
      { length: 12 },
      (_, i) =>
        grupos[i]?.egresos || 0
    );

  }

  if (tipo === "anio") {

    const orden =
      Object.keys(grupos).sort();

    labels = orden;

    ingresosData = orden.map(
      a => grupos[a]?.ingresos || 0
    );

    netaData = orden.map(
      a => grupos[a]?.neta || 0
    );

    egresosData = orden.map(
      a => grupos[a]?.egresos || 0
    );

  }

  if (tipo === "semana") {

    const orden =
      Object.keys(grupos).sort();

    labels = orden.map(
      f => `Sem ${f}`
    );

    ingresosData = orden.map(
      f => grupos[f]?.ingresos || 0
    );

    netaData = orden.map(
      f => grupos[f]?.neta || 0
    );

    egresosData = orden.map(
      f => grupos[f]?.egresos || 0
    );

  }

  const data = {

    labels,

    datasets: [

      {
        type: "bar",

        label: "Ingresos",

        data: ingresosData,

        backgroundColor: (context) => {

          const chart =
            context.chart;

          const {
            ctx,
            chartArea
          } = chart;


          if (!chartArea) {
            return "#0369A1";
          }


          const gradient =
            ctx.createLinearGradient(
              0,
              chartArea.top,
              0,
              chartArea.bottom
            );

          gradient.addColorStop(
            0,
            "#0284C7"
          );

          gradient.addColorStop(
            1,
            "#075985"
          );

          return gradient;

        },

        borderRadius: 14,

        borderSkipped: false,

        maxBarThickness: 42

      },

      {
        type: "line",

        label: "Ganancia Neta",

        data: netaData,


        borderColor: "#059669",

        backgroundColor:
          "rgba(16,185,129,0.15)",


        tension: 0.4,

        fill: false,

        pointRadius: 4,

        pointHoverRadius: 6,


        pointBackgroundColor:
          "#10B981",


        borderWidth: 3

      },

      {
        type: "line",

        label: "Egresos",

        data: egresosData,

        borderColor: "#F43F5E",

        backgroundColor:
          "rgba(244,63,94,0.15)",

        tension: 0.4,

        fill: false,

        pointRadius: 4,

        pointHoverRadius: 6,

        pointBackgroundColor:
          "#F43F5E",

        borderWidth: 3

      }

    ]

  };

  const options = {

    responsive: true,

    maintainAspectRatio: false,

    animation: {

      duration: 1200,

      easing: "easeOutQuart"

    },

    interaction: {

      mode: "index",

      intersect: false

    },

    plugins: {

      legend: {

        display: true,

        labels: {

          color: "#64748B",

          usePointStyle: true,

          pointStyle: "circle",

          padding: 20,

          font: {
            size: 12,
            weight: "600"
          }

        }

      },

      tooltip: {

        backgroundColor: "#082F49",

        padding: 12,

        cornerRadius: 14,

        titleColor: "#fff",

        bodyColor: "#fff",

        displayColors: true,

        callbacks: {

          label: (context) =>
            `${context.dataset.label}: RD$ ${formatMoney(context.raw)}`

        }

      }

    },

    scales: {

      x: {

        grid: {
          display: false
        },

        ticks: {

          color: "#64748B",

          font: {
            size: 11,
            weight: "600"
          }

        }

      },

      y: {

        beginAtZero: true,

        grid: {
          color: "rgba(0,0,0,0.04)"
        },

        ticks: {

          color: "#64748B",

          font: {
            size: 11,
            weight: "600"
          },

          callback: (v) =>
            `RD$ ${formatMoney(v)}`

        }

      }

    }

  };

  return (

    <div className="w-full h-full space-y-5">

      {/* SELECTOR */}
      <div className="flex gap-2 justify-center flex-wrap">

        <button
          onClick={() => setTipo("semana")}
          className={`
            px-4 h-9 rounded-xl text-sm font-medium
            transition-all duration-200
            ${tipo === "semana"
              ? "bg-gradient-to-r from-sky-700 via-sky-800 to-sky-900 text-white shadow-lg shadow-sky-900/20"
              : "bg-slate-100 hover:bg-sky-50 hover:text-sky-800 text-slate-700"}
          `}
        >
          Semana
        </button>

        <button
          onClick={() => setTipo("mes")}
          className={`
            px-4 h-9 rounded-xl text-sm font-medium
            transition-all duration-200
            ${tipo === "mes"
              ? "bg-gradient-to-r from-sky-700 via-sky-800 to-sky-900 text-white shadow-lg shadow-sky-900/20"
              : "bg-slate-100 hover:bg-sky-50 hover:text-sky-800 text-slate-700"}
          `}
        >
          Mes
        </button>

        <button
          onClick={() => setTipo("anio")}
          className={`
            px-4 h-9 rounded-xl text-sm font-medium
            transition-all duration-200
            ${tipo === "anio"
              ? "bg-gradient-to-r from-sky-700 via-sky-800 to-sky-900 text-white shadow-lg shadow-sky-900/20"
              : "bg-slate-100 hover:bg-sky-50 hover:text-sky-800 text-slate-700"}
          `}
        >
          Año
        </button>

      </div>

      {/* GRAFICO */}
      <div className="h-[340px]">

        <Bar
          data={data}
          options={options}
        />

      </div>

    </div>

  );

}

export default GraficoIngresos;