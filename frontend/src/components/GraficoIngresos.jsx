import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

function GraficoIngresos({ ingresos = [] }) {

  const ingresosPorMes = {};

  ingresos.forEach(i => {

    const servicios = Array.isArray(i.servicios) ? i.servicios : [];

    const subtotal = servicios.reduce((acc, s) => acc + (s.monto || 0), 0);

    const fecha = new Date(i.created_at || Date.now());
    const mes = fecha.getMonth();

    if (!ingresosPorMes[mes]) {
      ingresosPorMes[mes] = 0;
    }

    ingresosPorMes[mes] += subtotal;

  });

  const nombresMeses = [
    "Ene","Feb","Mar","Abr","May","Jun",
    "Jul","Ago","Sep","Oct","Nov","Dic"
  ];

  const labels = Object.keys(ingresosPorMes).map(m => nombresMeses[m]);
  const dataValues = Object.values(ingresosPorMes);

  const data = {
    labels,
    datasets: [
      {
        label: "RD$",
        data: dataValues,
        backgroundColor: "#3b82f6",
        borderRadius: 8,
        barThickness: 40 // ✅ controla ancho de barras
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: { display: false } // ✅ quitar leyenda inútil
    },

    scales: {
      x: {
        ticks: {
          font: { size: 11 } // ✅ texto más pequeño
        },
        grid: { display: false } // ✅ limpio
      },

      y: {
        beginAtZero: true,
        ticks: {
          font: { size: 10 },
          callback: (value) => `RD$ ${value}` // ✅ formato bonito
        },
        grid: {
          color: "#eee"
        }
      }
    }
  };

  return (
    <div className="w-full h-full">
      <Bar data={data} options={options} />
    </div>
  );
}

export default GraficoIngresos;