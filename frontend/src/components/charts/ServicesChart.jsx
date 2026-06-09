import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from "recharts";

const COLORS = [
  "#8b5cf6",
  "#6366f1",
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

        <h3 className="
          text-2xl

          font-black

          text-slate-800
        ">

          Servicios top

        </h3>

        <p className="
          text-sm

          text-slate-500
        ">

          Procedimientos más realizados

        </p>

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