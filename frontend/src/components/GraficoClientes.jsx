import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function GraficoClientes({ clientes = [] }) {

  if (!Array.isArray(clientes)) clientes = [];

  const data = {};

  clientes.forEach((c) => {

    const fechaRaw =
      c.created_at ||
      c.createdAt ||
      c.fecha;

    // ✅ SI NO HAY FECHA → USAR "Actual"
    if (!fechaRaw) {
      data["Actual"] = (data["Actual"] || 0) + 1;
      return;
    }

    const fecha = new Date(fechaRaw);

    if (isNaN(fecha)) {
      data["Actual"] = (data["Actual"] || 0) + 1;
      return;
    }

    const mes = fecha.toLocaleString("default", {
      month: "short"
    });

    data[mes] = (data[mes] || 0) + 1;

  });

  const dataFinal = Object.entries(data).map(([mes, total]) => ({
    mes,
    total
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={dataFinal}>
        <XAxis dataKey="mes" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="total" fill="#22c55e" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default GraficoClientes;
