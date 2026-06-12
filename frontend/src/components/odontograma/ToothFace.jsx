function ToothFace({

  face,

  selectedTool,

  value,

  onApply

}) {

  /*
  ==========================================
  COLORS
  ==========================================
  */

  const getStyles = () => {

    switch (value) {

      case "caries":

        return `
          bg-rose-500

          border-rose-600

          shadow-[0_0_14px_rgba(244,63,94,0.45)]
        `;

      case "resina":

        return `
          bg-sky-500

          border-sky-600

          shadow-[0_0_14px_rgba(14,165,233,0.45)]
        `;

      case "corona":

        return `
          bg-amber-400

          border-amber-500

          shadow-[0_0_14px_rgba(251,191,36,0.45)]
        `;

      case "extraccion":

        return `
          bg-slate-700

          border-slate-800

          shadow-[0_0_14px_rgba(15,23,42,0.45)]
        `;

      case "implante":

        return `
          bg-violet-500

          border-violet-600

          shadow-[0_0_14px_rgba(139,92,246,0.45)]
        `;

      default:

        return `
          bg-white/90

          border-slate-200

          hover:bg-indigo-100

          hover:border-indigo-300
        `;

    }

  };

  /*
  ==========================================
  SHAPE
  ==========================================
  */

  const getShape = () => {

    switch (face) {

      case "top":

        return "rounded-t-xl";

      case "bottom":

        return "rounded-b-xl";

      case "left":

        return "rounded-l-xl";

      case "right":

        return "rounded-r-xl";

      case "center":

        return "rounded-xl";

      default:

        return "rounded-lg";

    }

  };

  /*
  ==========================================
  LABEL
  ==========================================
  */

  const getLabel = () => {

    switch (face) {

      case "top":

        return "Superior";

      case "bottom":

        return "Inferior";

      case "left":

        return "Izquierda";

      case "right":

        return "Derecha";

      case "center":

        return "Centro";

      default:

        return face;

    }

  };

  return (

    <button

      title={
        value

          ? `${getLabel()} • ${value}`

          : getLabel()
      }

      onClick={() =>

        onApply(

          face,

          selectedTool === "clear"

            ? null

            : selectedTool

        )

      }

      className={`
        relative

        overflow-hidden

        border

        transition-all
        duration-200

        hover:scale-105

        active:scale-[0.97]

        ${getShape()}

        ${getStyles()}
      `}
    >

      {/* SHINE */}

      <div className="
        absolute
        inset-0

        bg-gradient-to-br
        from-white/40
        to-transparent

        pointer-events-none
      " />

      {/* ACTIVE INDICATOR */}

      {value && (

        <div className="
          absolute
          inset-0

          ring-2
          ring-white/30

          pointer-events-none
        " />

      )}

    </button>

  );

}

export default ToothFace;