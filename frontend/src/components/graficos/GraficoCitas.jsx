import { formatFecha, formatHora } from "../../utils/fecha";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function GraficoCitas({ citas = [] }) {

  const data = {};

  citas.forEach((c) => {

    if (!c.fecha) return;

    const fecha = new Date(c.fecha.replace("Z", ""));

    if (isNaN(fecha)) return;


    const mes = fecha.toLocaleString("es-DO", {
      month: "short",
      timeZone: "America/Santo_Domingo" 
    });


    data[mes] = (data[mes] || 0) + 1;
  });

  const dataFinal = Object.entries(data).map(([mes, total]) => ({
    mes,
    total
  }));

  if (dataFinal.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No hay citas registradas 📅
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={dataFinal}>
        <XAxis dataKey="mes" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="total" fill="#f59e0b" /> {/* naranja */}
      </BarChart>
    </ResponsiveContainer>
  );
}

export default GraficoCitas;