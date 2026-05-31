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

    // ✅ CALCULO REAL (PRO)
    const subtotal = servicios.reduce((acc, s) => acc + (s.monto || 0), 0);
    const itbis = subtotal * 0.18;
    const descuento = subtotal * ((i.descuento || 0) / 100);

    const totalFactura = subtotal + itbis - descuento;

    const fecha = new Date(i.created_at || Date.now());
    const mes = fecha.getMonth();

    if (!ingresosPorMes[mes]) {
      ingresosPorMes[mes] = 0;
    }

    ingresosPorMes[mes] += totalFactura; // ✅ AHORA USA TOTAL REAL
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
        barThickness: 40
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
          label: (context) => `RD$ ${context.raw.toFixed(2)}`
        }
      }
    },

    scales: {
      x: {
        ticks: {
          font: { size: 11 }
        },
        grid: { display: false }
      },

      y: {
        beginAtZero: true,
        ticks: {
          font: { size: 10 },
          callback: (value) => `RD$ ${value}`
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