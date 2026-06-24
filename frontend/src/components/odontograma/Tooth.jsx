import ToothFace
  from "./ToothFace";

function Tooth({

  numero,

  data,

  selectedTool,

  onApply

}) {

  /*
  ==========================================
  APPLY
  ==========================================
  */

  const handleApply = (
    face,
    tool
  ) => {

    onApply(
      numero,
      face,
      tool
    );

  };

  /*
  ==========================================
  STATUS
  ==========================================
  */

  const tieneTratamientoCompletado =
    Boolean(
      data?.meta
        ?.tratamiento_completado
    );

  const servicioCompletado =
    data?.meta?.servicio_nombre ||
    data?.meta?.nombre_servicio ||
    data?.meta?.tratamiento_nombre ||
    "Tratamiento";

  const textoBadgeCompletado =
    servicioCompletado.length > 12
      ? `${servicioCompletado.slice(0, 12)}...`
      : servicioCompletado;

  const tieneRegistroClinico =
    Boolean(
      data?.top ||
      data?.left ||
      data?.center ||
      data?.right ||
      data?.bottom
    );

  const hasTreatment =
    tieneRegistroClinico ||
    tieneTratamientoCompletado;

  return (

    <div className="
      group

      relative

      flex
      flex-col
      items-center
    ">

      {/* ACTIVE GLOW */}

      {hasTreatment && (

        <div className={`
          absolute

          inset-0

          rounded-[32px]

          blur-xl

          opacity-70

          ${tieneTratamientoCompletado
            ? "bg-emerald-500/15"
            : "bg-sky-500/10"}
        `} />

      )}

      {/* TOOTH */}

      <div
        title={
          tieneTratamientoCompletado
            ? `${servicioCompletado} completado en pieza ${numero}`
            : tieneRegistroClinico
              ? `Pieza ${numero} con registro odontograma`
              : `Pieza ${numero}`
        }
        className={`
          relative

          w-24
          h-28

          rounded-[30px]

          border

          p-2

          transition-all
          duration-300

          overflow-visible

          ${hasTreatment
            ? `
              bg-gradient-to-br
              from-sky-50
              to-cyan-50

              border-sky-200

              shadow-[0_18px_40px_rgba(7,89,133,0.15)]
            `
            : `
              bg-white

              border-slate-200

              shadow-sm
            `
          }

          ${tieneTratamientoCompletado
            ? `
              ring-4
              ring-emerald-200/80

              border-emerald-300

              shadow-[0_20px_45px_rgba(16,185,129,0.22)]
            `
            : ""}
          
          hover:-translate-y-1

          hover:border-sky-300

          hover:shadow-[0_20px_45px_rgba(7,89,133,0.18)]
        `}
      >

        {/* CHECK COMPLETADO */}

        {tieneTratamientoCompletado && (

          <div className="
            absolute
            -top-3
            -right-3

            z-50

            w-7
            h-7

            rounded-full

            bg-emerald-500

            border-[4px]
            border-white

            text-white

            flex
            items-center
            justify-center

            text-[11px]
            font-black

            shadow-[0_10px_25px_rgba(16,185,129,0.45)]
          ">
            ✓
          </div>

        )}

        {/* SHINE */}

        <div className="
          absolute
          inset-0

          rounded-[30px]

          bg-gradient-to-br
          from-white/50
          to-transparent

          pointer-events-none
        " />

        {/* GRID */}

        <div className="
          relative

          grid
          grid-cols-3
          grid-rows-3

          gap-1

          w-full
          h-full
        ">

          <div />

          <ToothFace
            face="top"
            value={data?.top}
            selectedTool={selectedTool}
            onApply={handleApply}
          />

          <div />

          <ToothFace
            face="left"
            value={data?.left}
            selectedTool={selectedTool}
            onApply={handleApply}
          />

          <ToothFace
            face="center"
            value={data?.center}
            selectedTool={selectedTool}
            onApply={handleApply}
          />

          <ToothFace
            face="right"
            value={data?.right}
            selectedTool={selectedTool}
            onApply={handleApply}
          />

          <div />

          <ToothFace
            face="bottom"
            value={data?.bottom}
            selectedTool={selectedTool}
            onApply={handleApply}
          />

          <div />

        </div>

        {/* STATUS DOT CLÍNICO */}

        {tieneRegistroClinico && (

          <div className="
            absolute
            top-2
            right-2

            w-2.5
            h-2.5

            rounded-full

            bg-sky-700

            shadow-[0_0_14px_rgba(7,89,133,0.8)]
          " />

        )}

        {/* BADGE TRATAMIENTO COMPLETADO */}

        {tieneTratamientoCompletado && (

          <div className="
            absolute
            left-1/2
            -bottom-3

            z-40

            -translate-x-1/2

            max-w-[88px]

            px-2
            py-0.5

            rounded-full

            bg-emerald-50

            border
            border-emerald-100

            text-[8.5px]
            font-black

            text-emerald-600

            whitespace-nowrap
            overflow-hidden
            text-ellipsis

            shadow-sm
          ">

            {textoBadgeCompletado}

          </div>

        )}

      </div>

      {/* NUMBER */}

      <div className="
        mt-4

        flex
        flex-col
        items-center
        gap-1
      ">

        <div className="
          flex
          items-center
          gap-2
        ">

          <span className={`
            text-xs

            font-black

            transition-all
            duration-300

            ${tieneTratamientoCompletado
              ? "text-emerald-600"
              : hasTreatment
                ? "text-sky-800"
                : "text-slate-500"}
          `}>

            {numero}

          </span>

          {hasTreatment && (

            <div className={`
              w-1.5
              h-1.5

              rounded-full

              ${tieneTratamientoCompletado
                ? "bg-emerald-500"
                : "bg-sky-800"}
            `} />

          )}

        </div>

        {/* TEXTO COMPLETADO DEBAJO DEL NÚMERO, OPCIONAL */}

        {tieneTratamientoCompletado && (

          <span className="
            text-[9px]

            font-black

            text-emerald-600

            leading-none

            max-w-[90px]

            truncate
          ">

            completado

          </span>

        )}

      </div>

    </div>

  );

}

export default Tooth;
