import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip
} from "recharts";

import {
  TrendingUp,
  ChartSpline
} from "lucide-react";

function RevenueChart({ data = [] }) {

  return (

    <div className="
      bg-white/95
      backdrop-blur-md

      border
      border-slate-200/80

      rounded-[34px]

      p-6

      shadow-[0_10px_30px_rgba(0,0,0,0.05)]
    ">

      {/* HEADER */}

      <div className="
        flex
        items-center
        justify-between

        mb-6
      ">

        <div>

          <div className="
            inline-flex

            items-center
            gap-2

            text-sky-800

            text-sm
            font-bold
          ">

            <ChartSpline size={18} />

            Ingresos mensuales

          </div>

          <p className="
            mt-2

            text-sm

            text-slate-500
          ">
            Rendimiento financiero
          </p>

        </div>

      </div>

      {/* CHART */}

      <div className="
        h-[320px]
      ">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <AreaChart data={data}>

            <defs>

              <linearGradient
                id="incomeGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="0%"
                  stopColor="#0284c7"
                  stopOpacity={0.45}
                />

                <stop
                  offset="100%"
                  stopColor="#0284c7"
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>

            <XAxis
              dataKey="mes"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#64748b",
                fontSize: 12
              }}
            />

            <Tooltip
              contentStyle={{
                borderRadius: 18,
                border: "none",
                background: "rgba(255,255,255,0.95)",
                boxShadow:
                  "0 10px 40px rgba(0,0,0,0.08)"
              }}
            />

            <Area
              type="monotone"
              dataKey="ingresos"
              stroke="#075985"
              strokeWidth={4}
              fill="url(#incomeGradient)"
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}

export default RevenueChart;