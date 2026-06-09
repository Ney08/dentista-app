import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  Tooltip,
  Legend
} from "recharts";

function FinanceChart({
  data = []
}) {

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

          <h3 className="
            text-2xl

            font-black

            text-slate-800
          ">

            Finanzas generales

          </h3>

          <p className="
            text-sm

            text-slate-500
          ">

            Ingresos vs egresos

          </p>

        </div>

      </div>

      {/* CHART */}

      <div className="
        h-[350px]
      ">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <AreaChart data={data}>

            <defs>

              <linearGradient
                id="income"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="0%"
                  stopColor="#8b5cf6"
                  stopOpacity={0.4}
                />

                <stop
                  offset="100%"
                  stopColor="#8b5cf6"
                  stopOpacity={0}
                />

              </linearGradient>

              <linearGradient
                id="expense"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="0%"
                  stopColor="#f43f5e"
                  stopOpacity={0.4}
                />

                <stop
                  offset="100%"
                  stopColor="#f43f5e"
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
            />

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

            <Legend />

            <Area
              type="monotone"
              dataKey="ingresos"
              stroke="#8b5cf6"
              fill="url(#income)"
              strokeWidth={3}
            />

            <Area
              type="monotone"
              dataKey="egresos"
              stroke="#f43f5e"
              fill="url(#expense)"
              strokeWidth={3}
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}

export default FinanceChart;