import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  X
} from "lucide-react";

import toast from "react-hot-toast";

const baseStyle = `
  relative
  overflow-hidden

  min-w-[320px]
  max-w-[420px]

  rounded-[26px]

  border
  border-white/40

  bg-white/80
  backdrop-blur-2xl

  shadow-[0_20px_50px_rgba(0,0,0,0.10)]

  px-5
  py-4

  flex
  items-start

  gap-4
`;

const renderToast = ({
  t,
  icon,
  title,
  message,
  gradient,
  glow,
  progress
}) => (

  <div
    className={`
      ${baseStyle}

      ${t.visible
        ? "animate-in slide-in-from-top fade-in"
        : "animate-out fade-out"
      }
    `}
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

      ${glow}

      opacity-10

      blur-3xl
    `} />

    {/* PROGRESS */}

    <div className={`
      absolute
      bottom-0
      left-0

      h-1
      w-full

      bg-gradient-to-r

      ${progress}
    `} />

    {/* ICON */}

    <div className={`
      relative
      z-10

      w-11
      h-11

      rounded-2xl

      bg-gradient-to-br

      ${gradient}

      text-white

      flex
      items-center
      justify-center

      shrink-0

      shadow-lg
    `}>

      {icon}

    </div>

    {/* CONTENT */}

    <div className="
      relative
      z-10

      flex-1
      min-w-0
    ">

      <p className="
        text-sm

        font-black

        text-slate-800
      ">

        {title}

      </p>

      <p className="
        mt-1

        text-sm

        leading-relaxed

        text-slate-500
      ">

        {message}

      </p>

    </div>

    {/* CLOSE */}

    <button
      onClick={() =>
        toast.dismiss(t.id)
      }
      className="
        relative
        z-10

        w-8
        h-8

        rounded-xl

        text-slate-400

        hover:bg-slate-100

        hover:text-slate-600

        transition-all
        duration-200

        flex
        items-center
        justify-center

        shrink-0
      "
    >

      <X size={15} />

    </button>

  </div>

);

/*
==========================================
SUCCESS
==========================================
*/

export const showSuccess = (
  message
) => {

  toast.custom((t) => (

    renderToast({

      t,

      icon:
        <CheckCircle2 size={20} />,

      title:
        "Operación completada",

      message,

      gradient:
        "from-emerald-500 to-green-500",

      glow:
        "from-emerald-500 to-green-500",

      progress:
        "from-emerald-500 to-green-500"

    })

  ), {

    id: "success-toast",

    duration: 2500

  });

};

/*
==========================================
ERROR
==========================================
*/

export const showError = (
  message
) => {

  toast.custom((t) => (

    renderToast({

      t,

      icon:
        <XCircle size={20} />,

      title:
        "Ocurrió un problema",

      message,

      gradient:
        "from-rose-500 to-pink-500",

      glow:
        "from-rose-500 to-pink-500",

      progress:
        "from-rose-500 to-pink-500"

    })

  ), {

    id: "error-toast",

    duration: 3000

  });

};

/*
==========================================
WARNING
==========================================
*/

export const showWarning = (
  message
) => {

  toast.custom((t) => (

    renderToast({

      t,

      icon:
        <AlertTriangle size={20} />,

      title:
        "Atención",

      message,

      gradient:
        "from-amber-400 to-orange-500",

      glow:
        "from-amber-400 to-orange-500",

      progress:
        "from-amber-400 to-orange-500"

    })

  ), {

    id: "warning-toast",

    duration: 3000

  });

};

/*
==========================================
INFO
==========================================
*/

export const showInfo = (
  message
) => {

  toast.custom((t) => (

    renderToast({

      t,

      icon:
        <Info size={20} />,

      title:
        "Información",

      message,

      gradient:
        "from-indigo-500 to-violet-500",

      glow:
        "from-indigo-500 to-violet-500",

      progress:
        "from-indigo-500 to-violet-500"

    })

  ), {

    id: "info-toast",

    duration: 2500

  });

};