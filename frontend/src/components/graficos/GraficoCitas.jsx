import { useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

function GraficoCitas({ citas = [] }) {

  const [tipo, setTipo] = useState("mes");

  const agruparCitas = () => {

    const grupos = {};

    citas.forEach((c) => {

      if (!c.fecha) return;

      const fecha = new Date(
        c.fecha.replace("Z", "")
      );

      if (isNaN(fecha)) return;

      let clave;

      if (tipo === "mes") {

        clave = fecha.toLocaleString(
          "es-DO",
          {
            month: "short",
            timeZone:
              "America/Santo_Domingo"
          }
        );

      }

      if (tipo === "anio") {
        clave = fecha.getFullYear();
      }

      if (tipo === "semana") {

        const inicio = new Date(fecha);

        inicio.setDate(
          fecha.getDate() - inicio.getDay()
        );

        clave = inicio
          .toISOString()
          .slice(0, 10);

      }

      if (!grupos[clave]) {
        grupos[clave] = 0;
      }

      grupos[clave] += 1;

    });

    return grupos;

  };

  const grupos = agruparCitas();

  const dataFinal =
    Object.entries(grupos).map(
      ([mes, total]) => ({
        mes:
          tipo === "semana"
            ? `Sem ${mes}`
            : mes,
        total
      })
    );

  if (dataFinal.length === 0) {

    return (

      <div className="flex items-center justify-center h-full text-gray-400">
        No hay citas registradas 📅
      </div>

    );

  }

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
              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-200/50"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"}
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
              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-200/50"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"}
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
              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-200/50"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"}
          `}
        >
          Año
        </button>

      </div>

      {/* GRAFICO */}
      <div className="h-[340px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <BarChart
            key={tipo}
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
                fill: "rgba(245,158,11,0.08)"
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
                `${value} citas`,
                "Total"
              ]}
            />

            <Bar
              dataKey="total"
              fill="url(#citasGradient)"
              radius={[14, 14, 6, 6]}
              maxBarSize={46}
              isAnimationActive={true}
              animationDuration={1200}
              animationEasing="ease-out"
            />

            <defs>

              <linearGradient
                id="citasGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="0%"
                  stopColor="#F59E0B"
                />

                <stop
                  offset="100%"
                  stopColor="#EA580C"
                />

              </linearGradient>

            </defs>

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}

export default GraficoCitas;