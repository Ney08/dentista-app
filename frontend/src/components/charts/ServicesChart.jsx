import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from "recharts";

import {
  TrendingUp
} from "lucide-react";

const COLORS = [
  "#075985",
  "#0284c7",
  "#06b6d4",
  "#14b8a6",
  "#22c55e",
  "#f43f5e"
];

function ServicesChart({
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

      <div className="mb-6">

        <div>

          <div className="
            inline-flex

            items-center
            gap-2

            text-sky-800

            text-sm
            font-bold
          ">

            <TrendingUp size={18} />

            Servicios top

          </div>

          <p className="
            mt-2

            text-sm

            text-slate-500
          ">
            Procedimientos más realizados
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

          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={4}
            >

              {data.map((entry, index) => (

                <Cell
                  key={index}
                  fill={
                    COLORS[
                      index % COLORS.length
                    ]
                  }
                />

              ))}

            </Pie>

            <Tooltip />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}

export default ServicesChart;