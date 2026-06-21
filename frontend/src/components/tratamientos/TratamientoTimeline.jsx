function TratamientoTimeline({ events = [] }) {

  // ✅ Normalizar fechas (para soportar "Actual")
  const parseFecha = (fecha) => {
    if (!fecha || fecha === "Actual") {
      return new Date(); // ✅ lo trata como lo más reciente
    }

    return new Date(fecha);
  };

  // ✅ Ordenar: más reciente primero
  const eventosOrdenados = [...events].sort(
    (a, b) => parseFecha(b.date) - parseFecha(a.date)
  );

  return (
    <div className="space-y-5">

      {eventosOrdenados.map((event, index) => {

        const esActivo = index === 0;

        return (
          <div key={index} className="flex gap-4">

            {/* TIMELINE */}

            <div className="relative flex flex-col items-center">

              {/* DOT */}

              <div
                className={`
                  w-4 h-4 rounded-full transition-all
                  ${esActivo
                    ? "bg-sky-700 scale-110 shadow-md"
                    : "bg-slate-300"
                  }
                `}
              />

              {/* LINE */}

              {index !== eventosOrdenados.length - 1 && (
                <div
                  className={`
                    w-[2px] flex-1 mt-1
                    ${esActivo
                      ? "bg-sky-200"
                      : "bg-slate-200"
                    }
                  `}
                />
              )}

            </div>

            {/* CONTENT */}

            <div className="flex-1 pb-5">

              <div className={`
                rounded-[24px]
                bg-white
                border
                p-5
                shadow-sm
                transition-all
                ${esActivo
                  ? "border-sky-200 shadow-md"
                  : "border-slate-100"
                }
              `}>

                {/* HEADER */}

                <div className="flex items-center justify-between gap-4">

                  <h4 className="text-sm font-black text-slate-800">
                    {event.title}
                  </h4>

                  <span className={`
                    text-xs font-semibold
                    ${esActivo
                      ? "text-sky-700"
                      : "text-slate-400"
                    }
                  `}>
                    {event.date}
                  </span>

                </div>

                {/* DESCRIPTION */}

                {event.description && (
                  <p className="mt-3 text-sm leading-relaxed text-slate-500">
                    {event.description}
                  </p>
                )}

                {/* BADGE ACTUAL */}

                {esActivo && (
                  <span className="
                    inline-block mt-3
                    text-[10px]
                    font-bold
                    px-2 py-1
                    rounded-full
                    bg-sky-100
                    text-sky-800
                  ">
                    ACTUAL
                  </span>
                )}

              </div>

            </div>

          </div>
        );

      })}

    </div>
  );

}

export default TratamientoTimeline;