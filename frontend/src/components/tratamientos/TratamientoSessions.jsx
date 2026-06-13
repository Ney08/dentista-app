import {
  CalendarDays
} from "lucide-react";

function TratamientoSessions({

  total,

  completed

}) {

  const progress =

    total > 0

      ? (
          completed / total
        ) * 100

      : 0;

  return (

    <div className="
      rounded-[24px]

      bg-white

      border
      border-slate-100

      p-5
    ">

      <div className="
        flex
        items-center
        justify-between

        gap-4
      ">

        <div className="
          flex
          items-center
          gap-2

          text-slate-500

          text-xs
          font-black

          uppercase

          tracking-[0.12em]
        ">

          <CalendarDays
            size={14}
          />

          Sesiones

        </div>

        <div className="
          text-sm

          font-black

          text-slate-700
        ">

          {completed}/{total}

        </div>

      </div>

      {/* BAR */}

      <div className="
        mt-4

        h-3

        rounded-full

        bg-slate-100

        overflow-hidden
      ">

        <div

          style={{
            width: `${progress}%`
          }}

          className="
            h-full

            rounded-full

            bg-gradient-to-r
            from-indigo-500
            via-purple-500
            to-violet-500

            transition-all
            duration-500
          "
        />

      </div>

    </div>

  );

}

export default TratamientoSessions;