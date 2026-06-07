import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

import { formatMoney } from "../../utils/format";

function GraficoClientes({ clientes = [] }) {

  if (!Array.isArray(clientes)) {
    clientes = [];
  }

  const data = {};

  clientes.forEach((c) => {

    const fechaRaw =
      c.created_at ||
      c.createdAt ||
      c.fecha;

    if (!fechaRaw) {

      data["Actual"] =
        (data["Actual"] || 0) + 1;

      return;

    }

    const fecha = new Date(
      fechaRaw.replace("Z", "")
    );

    if (isNaN(fecha)) {

      data["Actual"] =
        (data["Actual"] || 0) + 1;

      return;

    }

    const mes =
      fecha.toLocaleString(
        "es-DO",
        {
          month: "short",
          timeZone:
            "America/Santo_Domingo"
        }
      );

    data[mes] =
      (data[mes] || 0) + 1;

  });

  const dataFinal =
    Object.entries(data).map(
      ([mes, total]) => ({
        mes,
        total
      })
    );

  return (

    <div className="w-full h-full">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <BarChart
          data={dataFinal}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0
          }}
        >

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="rgba(0,0,0,0.05)"
          />

          <XAxis
            dataKey="mes"
            tick={{
              fill: "#64748B",
              fontSize: 11,
              fontWeight: 600
            }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{
              fill: "#64748B",
              fontSize: 11,
              fontWeight: 600
            }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            cursor={{
              fill: "rgba(99,102,241,0.06)"
            }}
            contentStyle={{
              background: "#111827",
              border: "none",
              borderRadius: "16px",
              color: "#fff",
              padding: "10px 14px",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.25)"
            }}
            labelStyle={{
              color: "#fff",
              fontWeight: 700
            }}
            formatter={(value) => [
              `${value} clientes`,
              "Total"
            ]}
          />

          <Bar
            dataKey="total"
            fill="url(#clientesGradient)"
            radius={[14, 14, 6, 6]}
            maxBarSize={46}
          />

          <defs>

            <linearGradient
              id="clientesGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >

              <stop
                offset="0%"
                stopColor="#22C55E"
              />

              <stop
                offset="100%"
                stopColor="#16A34A"
              />

            </linearGradient>

          </defs>

        </BarChart>

      </ResponsiveContainer>

    </div>

  );

}

export default GraficoClientes;
