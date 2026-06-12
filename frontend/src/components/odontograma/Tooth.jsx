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

  const hasTreatment =

    data &&

    Object.values(data)
      .some(Boolean);

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

        <div className="
          absolute

          inset-0

          rounded-[32px]

          bg-indigo-500/10

          blur-xl

          opacity-70
        " />

      )}

      {/* TOOTH */}

      <div className={`
        relative

        w-24
        h-28

        rounded-[30px]

        border

        p-2

        transition-all
        duration-300

        overflow-hidden

        ${
          hasTreatment

            ? `
              bg-gradient-to-br
              from-indigo-50
              to-violet-50

              border-indigo-200

              shadow-[0_18px_40px_rgba(99,102,241,0.15)]
            `

            : `
              bg-white

              border-slate-200

              shadow-sm
            `
        }

        hover:-translate-y-1

        hover:border-indigo-300

        hover:shadow-[0_20px_45px_rgba(99,102,241,0.18)]
      `}>

        {/* SHINE */}

        <div className="
          absolute
          inset-0

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

          {/* EMPTY */}

          <div />

          {/* TOP */}

          <ToothFace

            face="top"

            value={data?.top}

            selectedTool={
              selectedTool
            }

            onApply={
              handleApply
            }

          />

          <div />

          {/* LEFT */}

          <ToothFace

            face="left"

            value={data?.left}

            selectedTool={
              selectedTool
            }

            onApply={
              handleApply
            }

          />

          {/* CENTER */}

          <ToothFace

            face="center"

            value={data?.center}

            selectedTool={
              selectedTool
            }

            onApply={
              handleApply
            }

          />

          {/* RIGHT */}

          <ToothFace

            face="right"

            value={data?.right}

            selectedTool={
              selectedTool
            }

            onApply={
              handleApply
            }

          />

          {/* EMPTY */}

          <div />

          {/* BOTTOM */}

          <ToothFace

            face="bottom"

            value={data?.bottom}

            selectedTool={
              selectedTool
            }

            onApply={
              handleApply
            }

          />

          <div />

        </div>

        {/* STATUS DOT */}

        {hasTreatment && (

          <div className="
            absolute
            top-2
            right-2

            w-2.5
            h-2.5

            rounded-full

            bg-indigo-500

            shadow-[0_0_14px_rgba(99,102,241,0.8)]
          " />

        )}

      </div>

      {/* NUMBER */}

      <div className="
        mt-3

        flex
        items-center
        gap-2
      ">

        <span className={`
          text-xs

          font-black

          transition-all
          duration-300

          ${
            hasTreatment

              ? "text-indigo-600"

              : "text-slate-500"
          }
        `}>

          {numero}

        </span>

        {hasTreatment && (

          <div className="
            w-1.5
            h-1.5

            rounded-full

            bg-indigo-500
          " />

        )}

      </div>

    </div>

  );

}

export default Tooth;