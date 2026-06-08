function Paginacion({
  pagina,
  totalPaginas,
  onChange
}) {

  if (totalPaginas <= 1) return null;

  const buttonBase = `
    group

    relative
    overflow-hidden

    w-11
    h-11

    rounded-2xl

    backdrop-blur-xl

    border

    flex
    items-center
    justify-center

    font-black
    text-sm

    transition-all
    duration-300

    active:scale-[0.95]
  `;

  const buttonInactive = `
    bg-white/70

    border-white/50

    text-slate-600

    shadow-[0_8px_25px_rgba(0,0,0,0.05)]

    hover:shadow-[0_15px_35px_rgba(99,102,241,0.15)]

    hover:border-indigo-200

    hover:text-indigo-600

    hover:scale-[1.05]
  `;

  const buttonActive = `
    bg-gradient-to-r
    from-indigo-500
    via-purple-500
    to-violet-500

    border-transparent

    text-white

    shadow-[0_15px_35px_rgba(99,102,241,0.28)]

    scale-[1.05]
  `;

  return (

    <div className="
      flex
      justify-center
      items-center
      gap-3
      flex-wrap

      p-2

      rounded-[28px]

      bg-white/60
      backdrop-blur-xl

      border
      border-white/40

      shadow-[0_10px_30px_rgba(0,0,0,0.05)]
    ">

      {/* ANTERIOR */}

      <button
        disabled={pagina === 1}
        onClick={() =>
          onChange(pagina - 1)
        }
        className={`
          ${buttonBase}

          ${pagina === 1
            ? `
              bg-slate-100/70
              border-white/40
              text-slate-300
              cursor-not-allowed
            `
            : buttonInactive
          }
        `}
      >
        ‹
      </button>

      {/* NUMEROS */}

      {Array.from(
        { length: totalPaginas },
        (_, i) => {

          const num = i + 1;

          return (

            <button
              key={num}
              onClick={() =>
                onChange(num)
              }
              className={`
                ${buttonBase}

                ${pagina === num
                  ? buttonActive
                  : buttonInactive
                }
              `}
            >

              {/* GLOW */}
              {pagina === num && (

                <div className="
                  absolute
                  inset-0

                  bg-white/10

                  opacity-60
                " />

              )}

              <span className="relative z-10">
                {num}
              </span>

            </button>

          );

        }
      )}

      {/* SIGUIENTE */}

      <button
        disabled={pagina === totalPaginas}
        onClick={() =>
          onChange(pagina + 1)
        }
        className={`
          ${buttonBase}

          ${pagina === totalPaginas
            ? `
              bg-slate-100/70
              border-white/40
              text-slate-300
              cursor-not-allowed
            `
            : buttonInactive
          }
        `}
      >
        ›
      </button>

    </div>

  );

}

export default Paginacion;