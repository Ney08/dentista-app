import {

  Brush,

  Shield,

  Crown,

  XCircle,

  Circle,

  Eraser,

  Sparkles

} from "lucide-react";

/*
==========================================
TOOLS
==========================================
*/

const tools = [

  {

    id: "caries",

    label: "Caries",

    description:
      "Lesión dental",

    color:
      "bg-rose-500",

    icon: Brush

  },

  {

    id: "resina",

    label: "Resina",

    description:
      "Restauración",

    color:
      "bg-sky-500",

    icon: Shield

  },

  {

    id: "corona",

    label: "Corona",

    description:
      "Corona dental",

    color:
      "bg-amber-400",

    icon: Crown

  },

  {

    id: "implante",

    label: "Implante",

    description:
      "Implante dental",

    color:
      "bg-violet-500",

    icon: Circle

  },

  {

    id: "extraccion",

    label: "Extracción",

    description:
      "Pieza extraída",

    color:
      "bg-slate-700",

    icon: XCircle

  },

  {

    id: "clear",

    label: "Limpiar",

    description:
      "Eliminar tratamiento",

    color:
      "bg-slate-300",

    icon: Eraser

  }

];

function ToothToolbar({

  selectedTool,

  setSelectedTool

}) {

  return (

    <div className="
      relative

      overflow-hidden

      rounded-[34px]

      border
      border-slate-200/70

      bg-white/80

      backdrop-blur-xl

      shadow-[0_20px_60px_rgba(15,23,42,0.06)]

      p-5
    ">

      {/* GLOW */}

      <div className="
        absolute
        -top-20
        -right-20

        w-64
        h-64

        rounded-full

        bg-indigo-500/10

        blur-3xl
      " />

      {/* HEADER */}

      <div className="
        relative
        z-10

        flex
        items-center
        justify-between

        gap-4

        mb-5
      ">

        <div>

          <div className="
            inline-flex

            items-center
            gap-2

            px-3
            py-1.5

            rounded-full

            bg-indigo-500/10

            text-indigo-600

            text-xs
            font-black

            mb-3
          ">

            <Sparkles size={13} />

            Herramientas clínicas

          </div>

          <h3 className="
            text-xl

            font-black

            tracking-tight

            text-slate-800
          ">

            Odontograma interactivo

          </h3>

          <p className="
            mt-1

            text-sm

            text-slate-400
          ">

            Selecciona un tratamiento y aplícalo sobre una superficie dental

          </p>

        </div>

      </div>

      {/* TOOLS */}

      <div className="
        relative
        z-10

        flex
        flex-wrap
        justify-center

        gap-4
      ">

        {tools.map((tool) => {

          const Icon =
            tool.icon;

          const isActive =
            selectedTool === tool.id;

          return (

            <button

              key={tool.id}

              title={
                tool.description
              }

              onClick={() =>
                setSelectedTool(
                  tool.id
                )
              }

              className={`
                relative

                group

                overflow-hidden

                min-w-[150px]

                rounded-[26px]

                border

                px-5
                py-4

                transition-all
                duration-300

                hover:-translate-y-1

                ${
                  isActive

                    ? `
                      border-transparent

                      bg-gradient-to-br
                      from-indigo-500
                      to-violet-500

                      text-white

                      shadow-[0_20px_45px_rgba(99,102,241,0.30)]
                    `

                    : `
                      bg-white

                      border-slate-200

                      text-slate-700

                      hover:border-indigo-200

                      hover:shadow-lg
                    `
                }
              `}

            >

              {/* ACTIVE RING */}

              {isActive && (

                <div className="
                  absolute
                  inset-0

                  rounded-[26px]

                  ring-4
                  ring-indigo-500/20
                " />

              )}

              {/* CONTENT */}

              <div className="
                relative
                z-10

                flex
                items-center

                gap-4
              ">

                {/* ICON */}

                <div className={`
                  w-12
                  h-12

                  rounded-[18px]

                  flex
                  items-center
                  justify-center

                  transition-all
                  duration-300

                  ${
                    isActive

                      ? `
                        bg-white/15
                      `

                      : `
                        bg-slate-100
                      `
                  }
                `}>

                  <div className={`
                    w-3
                    h-3

                    rounded-full

                    ${tool.color}
                  `} />

                </div>

                {/* TEXT */}

                <div className="
                  text-left
                ">

                  <p className="
                    text-sm

                    font-black
                  ">

                    {tool.label}

                  </p>

                  <p className={`
                    mt-1

                    text-xs

                    ${
                      isActive

                        ? `
                          text-white/70
                        `

                        : `
                          text-slate-400
                        `
                    }
                  `}>

                    {tool.description}

                  </p>

                </div>

              </div>

            </button>

          );

        })}

      </div>

    </div>

  );

}

export default ToothToolbar;