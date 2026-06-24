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
) => {

  const {
    style,
    ...restOptions
  } = options;

  return {
    ...restOptions,
    id,
    duration,
    style: {
      zIndex: TOAST_Z_INDEX,
      ...style
    }
  };

};

const renderToast = ({
  t,
  icon,
  title,
  message,
  gradient,
  glow,
  progress,
  duration = 2500
}) => {

  const shouldAnimateProgress =
    Number.isFinite(duration) &&
    duration > 0;

  return (

    <div
      className={`
        ${baseStyle}

        ${t.visible
          ? "animate-in slide-in-from-top fade-in"
          : "animate-out fade-out"
        }
      `}
    >

      {/* KEYFRAMES */}

      <style>
        {`
          @keyframes toast-progress-shrink {
            from {
              transform: scaleX(1);
            }

            to {
              transform: scaleX(0);
            }
          }
        `}
      </style>

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

      {/* PROGRESS TRACK */}

      <div className="
        absolute
        bottom-0
        left-0

        h-1
        w-full

        bg-slate-200/50
      " />

      {/* PROGRESS BAR */}

      <div
        className={`
          absolute
          bottom-0
          left-0

          h-1
          w-full

          origin-left

          bg-gradient-to-r

          ${progress}
        `}
        style={{
          transformOrigin:
            "left",

          animation:
            shouldAnimateProgress
              ? `toast-progress-shrink ${duration}ms linear forwards`
              : "none"
        }}
      />

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
        type="button"
        aria-label="Cerrar notificación"
        onClick={(e) => {

          e.preventDefault();

          e.stopPropagation();

          toast.dismiss(
            t.id
          );

        }}
        className="
          relative
          z-10

          w-8
          h-8

          rounded-xl

          text-slate-400

          hover:bg-slate-100

          hover:text-slate-600

          active:scale-95

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

};

/*
==========================================
SUCCESS
==========================================
*/

export const showSuccess = (
  message,
  options = {}
) => {

  const duration =
    options.duration || 2500;

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
        "from-emerald-500 via-green-500 to-emerald-600",

      duration

    })

  ), getToastOptions(
    options.id || "success-toast",
    duration,
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

  const duration =
    options.duration || 3000;

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
        "from-rose-500 via-pink-500 to-rose-600",

      duration

    })

  ), getToastOptions(
    options.id || "error-toast",
    duration,
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

  const duration =
    options.duration || 3000;

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
        "from-amber-400 via-orange-400 to-orange-500",

      duration

    })

  ), getToastOptions(
    options.id || "warning-toast",
    duration,
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

  const duration =
    options.duration || 2500;

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
        "from-cyan-500 via-sky-700 to-sky-800",

      duration

    })

  ), getToastOptions(
    options.id || "info-toast",
    duration,
    options
  ));

};