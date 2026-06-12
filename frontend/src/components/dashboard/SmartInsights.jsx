import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CalendarDays,
  Sparkles
} from "lucide-react";

function SmartInsights({

  ingresos = 0,
  egresos = 0,
  citasHoy = 0,
  topServicio = "Limpieza"

}) {

  const margen =
    ingresos > 0
      ? ((ingresos - egresos) / ingresos) * 100
      : 0;

  const insights = [

    {
      icon:
        <TrendingUp size={18} />,

      color:
        "from-emerald-500 to-green-500",

      title:
        "Ingresos saludables",

      text:
        `La clínica mantiene una rentabilidad de ${margen.toFixed(1)}%`
    },

    {
      icon:
        <TrendingDown size={18} />,

      color:
        "from-rose-500 to-pink-500",

      title:
        "Control de egresos",

      text:
        `Los egresos actuales son RD$ ${egresos.toLocaleString()}`
    },

    {
      icon:
        <CalendarDays size={18} />,

      color:
        "from-indigo-500 to-violet-500",

      title:
        "Agenda activa",

      text:
        `${citasHoy} citas programadas para hoy`
    },

    {
      icon:
        <Sparkles size={18} />,

      color:
        "from-amber-400 to-orange-500",

      title:
        "Servicio destacado",

      text:
        `${topServicio} es el tratamiento más solicitado`
    }

  ];

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

                text-indigo-600

                text-sm
                font-bold
              ">

            <TrendingUp size={18} />

            Insights inteligentes

          </div>

          <p className="
                mt-2

                text-sm

                text-slate-500
              ">
            Resumen automático del sistema
          </p>

        </div>

      </div>

      {/* GRID */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2

        gap-4
      ">

        {insights.map((item, i) => (

          <div
            key={i}
            className="
              relative
              overflow-hidden

              rounded-[28px]

              border
              border-slate-200/70

              bg-slate-50/70

              p-5

              hover:-translate-y-[2px]

              transition-all
              duration-300
            "
          >

            {/* GLOW */}

            <div className={`
              absolute
              -top-10
              -right-10

              w-32
              h-32

              rounded-full

              bg-gradient-to-br

              ${item.color}

              opacity-10

              blur-3xl
            `} />

            {/* CONTENT */}

            <div className="
              relative
              z-10
            ">

              <div className={`
                w-12
                h-12

                rounded-2xl

                bg-gradient-to-r

                ${item.color}

                text-white

                flex
                items-center
                justify-center

                shadow-lg
              `}>

                {item.icon}

              </div>

              <h4 className="
                mt-4

                text-lg

                font-black

                text-slate-800
              ">

                {item.title}

              </h4>

              <p className="
                mt-2

                text-sm

                leading-relaxed

                text-slate-500
              ">

                {item.text}

              </p>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}

export default SmartInsights;