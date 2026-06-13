import {
  CircleDollarSign
} from "lucide-react";

function TratamientoPayments({

  costo,

  pagado

}) {

  const balance =

    Number(costo || 0)

    -

    Number(pagado || 0);

  return (

    <div className="
      grid
      grid-cols-1
      md:grid-cols-3

      gap-4
    ">

      {/* COSTO */}

      <div className="
        rounded-[24px]

        bg-slate-50

        border
        border-slate-100

        p-5
      ">

        <p className="
          text-xs

          uppercase

          tracking-[0.12em]

          font-black

          text-slate-400
        ">

          Costo

        </p>

        <p className="
          mt-3

          text-2xl

          font-black

          text-slate-800
        ">

          RD$

          {Number(costo).toLocaleString()}

        </p>

      </div>

      {/* PAGADO */}

      <div className="
        rounded-[24px]

        bg-emerald-50

        border
        border-emerald-100

        p-5
      ">

        <p className="
          text-xs

          uppercase

          tracking-[0.12em]

          font-black

          text-emerald-500
        ">

          Pagado

        </p>

        <p className="
          mt-3

          text-2xl

          font-black

          text-slate-800
        ">

          RD$

          {Number(pagado).toLocaleString()}

        </p>

      </div>

      {/* BALANCE */}

      <div className="
        rounded-[24px]

        bg-amber-50

        border
        border-amber-100

        p-5
      ">

        <p className="
          text-xs

          uppercase

          tracking-[0.12em]

          font-black

          text-amber-500
        ">

          Balance

        </p>

        <p className="
          mt-3

          text-2xl

          font-black

          text-slate-800
        ">

          RD$

          {balance.toLocaleString()}

        </p>

      </div>

    </div>

  );

}

export default TratamientoPayments;