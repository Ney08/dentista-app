import {

  CheckCircle2,

  Clock3,

  AlertCircle,

  XCircle

} from "lucide-react";

const statusConfig = {

  Pendiente: {

    icon: Clock3,

    bg: "bg-amber-50",

    border: "border-amber-100",

    text: "text-amber-600"

  },

  "En progreso": {

    icon: AlertCircle,

    bg: "bg-sky-50",

    border: "border-sky-100",

    text: "text-sky-600"

  },

  Completado: {

    icon: CheckCircle2,

    bg: "bg-emerald-50",

    border: "border-emerald-100",

    text: "text-emerald-600"

  },

  Cancelado: {

    icon: XCircle,

    bg: "bg-rose-50",

    border: "border-rose-100",

    text: "text-rose-600"

  }

};

function TratamientoStatusBadge({

  estado

}) {

  const config =

    statusConfig[
      estado
    ]

    ||

    statusConfig[
      "Pendiente"
    ];

  const Icon =
    config.icon;

  return (

    <div className={`
      inline-flex

      items-center
      gap-2

      px-3
      py-2

      rounded-2xl

      border

      text-sm
      font-bold

      ${config.bg}

      ${config.border}

      ${config.text}
    `}>

      <Icon size={15} />

      {estado}

    </div>

  );

}

export default TratamientoStatusBadge;