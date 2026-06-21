import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  X
} from "lucide-react";

import toast from "react-hot-toast";

const TOAST_Z_INDEX = 2147483647;

const baseStyle = `
  relative
  z-[2147483647]
  pointer-events-auto

  overflow-hidden

  min-w-[320px]
  max-w-[420px]

  rounded-[26px]

  border
  border-white/40

  bg-white/90
  backdrop-blur-2xl

  shadow-[0_20px_50px_rgba(15,23,42,0.18)]

  px-5
  py-4

  flex
  items-start

  gap-4
`;

const getToastOptions = (
  id,
  duration,
  options = {}
) => ({
  id,
  duration,
  style: {
    zIndex: TOAST_Z_INDEX,
    ...options.style
  },
  ...options
});

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
  message,
  options = {}
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
        "from-emerald-500 via-green-500 to-emerald-600",

      glow:
        "from-emerald-500 to-green-500",

      progress:
        "from-emerald-500 via-green-500 to-emerald-600"

    })

  ), getToastOptions(
    options.id || "success-toast",
    options.duration || 2500,
    options
  ));

};

/*
==========================================
ERROR
==========================================
*/

export const showError = (
  message,
  options = {}
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
        "from-rose-500 via-pink-500 to-rose-600",

      glow:
        "from-rose-500 to-pink-500",

      progress:
        "from-rose-500 via-pink-500 to-rose-600"

    })

  ), getToastOptions(
    options.id || "error-toast",
    options.duration || 3000,
    options
  ));

};

/*
==========================================
WARNING
==========================================
*/

export const showWarning = (
  message,
  options = {}
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
        "from-amber-400 via-orange-400 to-orange-500",

      glow:
        "from-amber-400 to-orange-500",

      progress:
        "from-amber-400 via-orange-400 to-orange-500"

    })

  ), getToastOptions(
    options.id || "warning-toast",
    options.duration || 3000,
    options
  ));

};

/*
==========================================
INFO
==========================================
*/

export const showInfo = (
  message,
  options = {}
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
        "from-sky-700 via-sky-800 to-sky-900",

      glow:
        "from-sky-500 to-cyan-500",

      progress:
        "from-cyan-500 via-sky-700 to-sky-800"

    })

  ), getToastOptions(
    options.id || "info-toast",
    options.duration || 2500,
    options
  ));

};