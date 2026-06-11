import {
  CalendarPlus,
  UserPlus,
  Receipt,
  Wallet
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import useModalStore from "../../stores/useModalStore";

function QuickActions() {

  /*
  ==========================================
  MODALS
  ==========================================
  */
  const navigate = useNavigate();
  const {

    openCita,

    openCliente,

    openFactura,

    openEgreso

  } = useModalStore();

  /*
  ==========================================
  ACTIONS
  ==========================================
  */

  const actions = [

  {
    title:
      "Nueva cita",

    description:
      "Agendar paciente",

    icon:
      <CalendarPlus size={22} />,

    color:
      "from-indigo-500 to-violet-500",

    onClick: () => {

      openCita();

      navigate("/citas");

    }
  },

  {
    title:
      "Nuevo cliente",

    description:
      "Registrar paciente",

    icon:
      <UserPlus size={22} />,

    color:
      "from-emerald-500 to-green-500",

    onClick: () => {

      openCliente();

      navigate("/clientes");

    }
  },

  {
    title:
      "Facturar",

    description:
      "Crear factura",

    icon:
      <Receipt size={22} />,

    color:
      "from-orange-400 to-amber-500",

    onClick: () => {

      openFactura();

      navigate("/facturaciones");

    }
  },

  {
    title:
      "Registrar egreso",

    description:
      "Nuevo gasto",

    icon:
      <Wallet size={22} />,

    color:
      "from-rose-500 to-pink-500",

    onClick: () => {

      openEgreso();

      navigate("/egresos");

    }
  }

];

  /*
  ==========================================
  RETURN
  ==========================================
  */

  return (

    <div className="
      grid
      grid-cols-1
      sm:grid-cols-2
      xl:grid-cols-4

      gap-5

      shadow-[0_10px_30px_rgba(0,0,0,0.05)]
    ">

      {actions.map((action, i) => (

        <button
          key={i}
          onClick={action.onClick}
          className="
            group

            relative
            overflow-hidden

            text-left

            bg-white/95
            backdrop-blur-md

            border
            border-slate-200/80

            rounded-[30px]

            p-6

            shadow-[0_10px_30px_rgba(0,0,0,0.05)]

            hover:-translate-y-[3px]

            hover:shadow-[0_20px_45px_rgba(0,0,0,0.08)]

            transition-all
            duration-300
          "
        >

          {/* GLOW */}

          <div className={`
            absolute
            -top-10
            -right-10

            w-40
            h-40

            rounded-full

            bg-gradient-to-br

            ${action.color}

            opacity-10

            blur-3xl
          `} />

          {/* CONTENT */}

          <div className="
            relative
            z-10
          ">

            <div className={`
              w-14
              h-14

              rounded-[22px]

              bg-gradient-to-r

              ${action.color}

              text-white

              flex
              items-center
              justify-center

              shadow-lg

              group-hover:scale-110

              transition-transform
              duration-300
            `}>

              {action.icon}

            </div>

            <h3 className="
              mt-5

              text-xl

              font-black

              text-slate-800
            ">

              {action.title}

            </h3>

            <p className="
              mt-1

              text-sm

              text-slate-500
            ">

              {action.description}

            </p>

          </div>

        </button>

      ))}

    </div>

  );

}

export default QuickActions;