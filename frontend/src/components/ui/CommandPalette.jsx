import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  Command
} from "cmdk";

import {
  useNavigate
} from "react-router-dom";

import {

  LayoutDashboard,

  Users,

  CalendarDays,

  Receipt,

  Wallet,

  BarChart3,

  Settings,

  Search,

  UserPlus,

  CalendarPlus,

  FilePlus2,

  CircleDollarSign,

  ArrowRight,

  Phone,

  Mail,

  Stethoscope,

  Activity,

  CreditCard,

  Clock3,

  Sparkles

} from "lucide-react";

import useModalStore
  from "../../stores/useModalStore";

import {
  useClientes
} from "../../hooks/useClientes";

import {
  useCitas
} from "../../hooks/useCitas";

import {
  useIngresos
} from "../../hooks/useIngresos";

import {
  useEgresos
} from "../../hooks/useEgresos";

import {
  formatMoney
} from "../../utils/format";

function CommandPalette() {

  const navigate =
    useNavigate();

  /*
  ==========================================
  DATA
  ==========================================
  */

  const {
    clientes = []
  } = useClientes();

  const {
    citas = []
  } = useCitas();

  const {
    ingresos = []
  } = useIngresos();

  const {
    egresos = []
  } = useEgresos();

  /*
  ==========================================
  MODALS
  ==========================================
  */

  const {

    openCliente,

    openCita,

    openFactura,

    openEgreso

  } = useModalStore();

  /*
  ==========================================
  STATES
  ==========================================
  */

  const [open, setOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  /*
  ==========================================
  SHORTCUT
  ==========================================
  */

  useEffect(() => {

    const down = (e) => {

      /*
      ==========================================
      CTRL + K
      ==========================================
      */

      if (

        (e.metaKey || e.ctrlKey)

        &&

        e.key.toLowerCase() === "k"

      ) {

        e.preventDefault();

        setOpen((prev) => !prev);

      }

      /*
      ==========================================
      ESC
      ==========================================
      */

      if (
        e.key === "Escape"
      ) {

        setOpen(false);

      }

    };

    document.addEventListener(
      "keydown",
      down
    );

    return () =>

      document.removeEventListener(
        "keydown",
        down
      );

  }, []);

  /*
  ==========================================
  STATIC COMMANDS
  ==========================================
  */

  const staticCommands = [

    /*
    ==========================================
    NAVIGATION
    ==========================================
    */

    {

      id:
        "dashboard",

      label:
        "Dashboard",

      description:
        "Vista general del sistema",

      type:
        "Página",

      icon:
        LayoutDashboard,

      keywords: [

        "inicio",

        "home",

        "panel"

      ],

      action: () => {

        navigate("/");

      }

    },

    {

      id:
        "clientes",

      label:
        "Clientes",

      description:
        "Gestión de pacientes",

      type:
        "Página",

      icon:
        Users,

      keywords: [

        "pacientes"

      ],

      action: () => {

        navigate("/clientes");

      }

    },

    {

      id:
        "citas",

      label:
        "Citas",

      description:
        "Agenda clínica",

      type:
        "Página",

      icon:
        CalendarDays,

      keywords: [

        "agenda",

        "calendar"

      ],

      action: () => {

        navigate("/citas");

      }

    },

    {

      id:
        "facturacion",

      label:
        "Facturación",

      description:
        "Facturas e ingresos",

      type:
        "Página",

      icon:
        Receipt,

      keywords: [

        "facturas",

        "pagos"

      ],

      action: () => {

        navigate("/facturaciones");

      }

    },

    {

      id:
        "egresos",

      label:
        "Egresos",

      description:
        "Control financiero",

      type:
        "Página",

      icon:
        Wallet,

      keywords: [

        "gastos"

      ],

      action: () => {

        navigate("/egresos");

      }

    },

    {

      id:
        "reportes",

      label:
        "Reportes",

      description:
        "Métricas y estadísticas",

      type:
        "Página",

      icon:
        BarChart3,

      keywords: [

        "analytics",

        "stats"

      ],

      action: () => {

        navigate("/reportes");

      }

    },

    {

      id:
        "settings",

      label:
        "Configuración",

      description:
        "Preferencias del sistema",

      type:
        "Página",

      icon:
        Settings,

      keywords: [

        "ajustes",

        "settings"

      ],

      action: () => {

        navigate("/settings");

      }

    },

    /*
    ==========================================
    QUICK ACTIONS
    ==========================================
    */

    {

      id:
        "new-cliente",

      label:
        "Nuevo cliente",

      description:
        "Registrar paciente",

      type:
        "Acción",

      icon:
        UserPlus,

      keywords: [

        "crear",

        "paciente"

      ],

      action: () => {

        navigate("/clientes");

        openCliente();

      }

    },

    {

      id:
        "new-cita",

      label:
        "Nueva cita",

      description:
        "Agendar nueva cita",

      type:
        "Acción",

      icon:
        CalendarPlus,

      keywords: [

        "agendar",

        "appointment"

      ],

      action: () => {

        navigate("/citas");

        openCita();

      }

    },

    {

      id:
        "new-factura",

      label:
        "Nueva factura",

      description:
        "Crear facturación",

      type:
        "Acción",

      icon:
        FilePlus2,

      keywords: [

        "factura",

        "ingreso",

        "cobro"

      ],

      action: () => {

        navigate("/facturaciones");

        openFactura();

      }

    },

    {

      id:
        "new-egreso",

      label:
        "Nuevo egreso",

      description:
        "Registrar gasto",

      type:
        "Acción",

      icon:
        CircleDollarSign,

      keywords: [

        "gasto",

        "expense"

      ],

      action: () => {

        navigate("/egresos");

        openEgreso();

      }

    }

  ];

  /*
  ==========================================
  CLIENTS
  ==========================================
  */

  const clientCommands =
    clientes.map((cliente) => ({

      id:
        `cliente-${cliente.id}`,

      label:
        `${cliente.nombre || ""}
         ${cliente.apellido || ""}`
          .replace(/\s+/g, " ")
          .trim(),

      description:

        cliente.telefono ||

        cliente.email ||

        "Paciente registrado",

      type:
        "Cliente",

      icon:
        Users,

      keywords: [

        cliente.nombre || "",

        cliente.apellido || "",

        cliente.telefono || "",

        cliente.email || "",

        cliente.cedula || ""

      ],

      action: () => {

        navigate("/clientes");

      }

    }));

  /*
  ==========================================
  CITAS
  ==========================================
  */

  const citasCommands =
    citas.map((cita) => ({

      id:
        `cita-${cita.id}`,

      label:

        `${cita.cliente?.nombre || ""}
         ${cita.cliente?.apellido || ""}`
          .replace(/\s+/g, " ")
          .trim(),

      description:

        `${cita.motivo || "Consulta"} •
         ${cita.fecha || ""}`,

      type:
        "Cita",

      icon:
        Clock3,

      keywords: [

        cita.motivo || "",

        cita.estado || "",

        cita.fecha || "",

        cita.cliente?.nombre || "",

        cita.cliente?.apellido || ""

      ],

      action: () => {

        navigate("/citas");

      }

    }));

  /*
  ==========================================
  FACTURAS
  ==========================================
  */

  const facturaCommands =
    ingresos.map((factura) => ({

      id:
        `factura-${factura.id}`,

      label:

        `${factura.cliente?.nombre || ""}
         ${factura.cliente?.apellido || ""}`
          .replace(/\s+/g, " ")
          .trim(),

      description:

        `Factura • RD$ ${formatMoney(

          factura.total ||

          0

        )}`,

      type:
        "Factura",

      icon:
        CreditCard,

      keywords: [

        factura.cliente?.nombre || "",

        factura.cliente?.apellido || "",

        factura.estado || "",

        factura.id?.toString() || ""

      ],

      action: () => {

        navigate("/facturaciones");

      }

    }));

  /*
  ==========================================
  EGRESOS
  ==========================================
  */

  const egresoCommands =
    egresos.map((egreso) => ({

      id:
        `egreso-${egreso.id}`,

      label:
        egreso.descripcion ||
        "Egreso",

      description:

        `RD$ ${formatMoney(
          egreso.monto || 0
        )}`,

      type:
        "Egreso",

      icon:
        Wallet,

      keywords: [

        egreso.descripcion || "",

        egreso.categoria || "",

        egreso.monto?.toString() || ""

      ],

      action: () => {

        navigate("/egresos");

      }

    }));

  /*
  ==========================================
  ALL COMMANDS
  ==========================================
  */

  const allCommands = [

    ...staticCommands,

    ...clientCommands,

    ...citasCommands,

    ...facturaCommands,

    ...egresoCommands

  ];

  /*
  ==========================================
  FILTER
  ==========================================
  */

  const filteredCommands =
    useMemo(() => {

      const query =
        search
          .toLowerCase()
          .trim();

      if (!query) {

        return allCommands;

      }

      return allCommands.filter((cmd) => {

        return (

          cmd.label
            ?.toLowerCase()
            .includes(query)

          ||

          cmd.description
            ?.toLowerCase()
            .includes(query)

          ||

          cmd.keywords?.some((k) =>

            k
              ?.toLowerCase()
              .includes(query)

          )

        );

      });

    }, [

      search,

      clientes,

      citas,

      ingresos,

      egresos

    ]);

  /*
  ==========================================
  EXECUTE
  ==========================================
  */

  const executeCommand = (
    command
  ) => {

    command.action();

    setOpen(false);

    setSearch("");

  };

  /*
  ==========================================
  TYPE COLOR
  ==========================================
  */

  const getTypeStyles = (
    type
  ) => {

    switch (type) {

      case "Cliente":

        return `
          bg-emerald-100
          text-emerald-600
        `;

      case "Factura":

        return `
          bg-indigo-100
          text-indigo-600
        `;

      case "Cita":

        return `
          bg-violet-100
          text-violet-600
        `;

      case "Egreso":

        return `
          bg-rose-100
          text-rose-600
        `;

      case "Acción":

        return `
          bg-amber-100
          text-amber-600
        `;

      default:

        return `
          bg-slate-100
          text-slate-500
        `;

    }

  };

  /*
  ==========================================
  HIDE
  ==========================================
  */

  if (!open) {

    return null;

  }

  return (

    <div className="
      fixed
      inset-0
      z-[9999]

      bg-slate-950/60

      backdrop-blur-xl

      flex
      items-start
      justify-center

      pt-[8vh]

      px-4
    ">

      {/* BACKDROP */}

      <div
        onClick={() =>
          setOpen(false)
        }
        className="
          absolute
          inset-0
        "
      />

      <Command
        className="
          relative

          overflow-hidden

          w-full
          max-w-4xl

          rounded-[38px]

          border
          border-white/30

          bg-white/80

          backdrop-blur-2xl

          shadow-[0_40px_120px_rgba(15,23,42,0.28)]

          animate-modalIn
        "
      >

        {/* GLOW */}

        <div className="
          absolute
          -top-32
          -right-32

          w-[440px]
          h-[440px]

          rounded-full

          bg-indigo-500/10

          blur-3xl
        " />

        {/* HEADER */}

        <div className="
          relative
          z-10

          flex
          items-center

          gap-4

          px-7
          py-6

          border-b
          border-slate-200/60
        ">

          <div className="
            w-14
            h-14

            rounded-[22px]

            bg-gradient-to-br
            from-indigo-500
            to-violet-500

            text-white

            flex
            items-center
            justify-center

            shadow-[0_15px_35px_rgba(99,102,241,0.25)]
          ">

            <Sparkles size={22} />

          </div>

          <div className="
            flex-1
          ">

            <Command.Input

              autoFocus

              value={search}

              onValueChange={
                setSearch
              }

              placeholder="
Buscar pacientes, citas, facturas, páginas...
              "

              className="
                w-full

                bg-transparent

                text-[17px]

                font-semibold

                text-slate-700

                placeholder:text-slate-400

                outline-none
              "
            />

            <p className="
              mt-1

              text-xs

              text-slate-400
            ">

              Busca cualquier módulo o registro del sistema

            </p>

          </div>

          <kbd className="
            hidden
            sm:flex

            items-center
            justify-center

            h-10

            rounded-2xl

            border
            border-slate-200

            bg-white/90

            px-4

            text-xs

            font-black

            text-slate-500

            shadow-sm
          ">

            ESC

          </kbd>

        </div>

        {/* LIST */}

        <Command.List
          className="
            relative
            z-10

            max-h-[580px]

            overflow-y-auto

            p-4
          "
        >

          <Command.Empty
            className="
              py-20

              text-center
            "
          >

            <div className="
              inline-flex

              items-center
              justify-center

              w-20
              h-20

              rounded-[30px]

              bg-slate-100

              text-slate-400
            ">

              <Search size={34} />

            </div>

            <h3 className="
              mt-6

              text-2xl

              font-black

              text-slate-800
            ">

              Sin resultados

            </h3>

            <p className="
              mt-2

              text-sm

              text-slate-400
            ">

              No encontramos coincidencias

            </p>

          </Command.Empty>

          <Command.Group
            heading="Resultados"
            className="
              space-y-2
            "
          >

            {filteredCommands.map((item) => {

              const Icon =
                item.icon;

              return (

                <Command.Item

                  key={item.id}

                  onSelect={() =>
                    executeCommand(item)
                  }

                  className="
                    group

                    flex
                    items-center
                    justify-between

                    gap-4

                    rounded-[28px]

                    border
                    border-transparent

                    px-5
                    py-4

                    cursor-pointer

                    transition-all
                    duration-200

                    text-slate-700

                    aria-selected:bg-gradient-to-r
                    aria-selected:from-indigo-500
                    aria-selected:to-violet-500

                    aria-selected:text-white

                    aria-selected:shadow-[0_18px_45px_rgba(99,102,241,0.28)]
                  "
                >

                  {/* LEFT */}

                  <div className="
                    flex
                    items-center
                    gap-4

                    min-w-0
                  ">

                    {/* ICON */}

                    <div className="
                      shrink-0

                      w-14
                      h-14

                      rounded-[22px]

                      bg-slate-100

                      flex
                      items-center
                      justify-center

                      transition-all
                      duration-200

                      group-aria-selected:bg-white/15
                    ">

                      <Icon size={20} />

                    </div>

                    {/* CONTENT */}

                    <div className="
                      min-w-0
                    ">

                      <p className="
                        truncate

                        text-sm

                        font-black
                      ">

                        {item.label}

                      </p>

                      <p className="
                        mt-1

                        truncate

                        text-xs

                        opacity-70
                      ">

                        {item.description}

                      </p>

                    </div>

                  </div>

                  {/* RIGHT */}

                  <div className="
                    flex
                    items-center
                    gap-3

                    shrink-0
                  ">

                    <span className={`
                      hidden
                      sm:inline-flex

                      rounded-full

                      px-3
                      py-1.5

                      text-[11px]

                      font-black

                      ${getTypeStyles(item.type)}

                      group-aria-selected:bg-white/15
                      group-aria-selected:text-white
                    `}>

                      {item.type}

                    </span>

                    <ArrowRight
                      size={16}
                      className="
                        opacity-50

                        transition-all
                        duration-200

                        group-aria-selected:translate-x-1
                      "
                    />

                  </div>

                </Command.Item>

              );

            })}

          </Command.Group>

        </Command.List>

        {/* FOOTER */}

        <div className="
          flex
          items-center
          justify-between

          border-t
          border-slate-200/60

          px-6
          py-4

          text-xs

          text-slate-400
        ">

          <div className="
            flex
            items-center
            gap-2
          ">

            <kbd className="
              rounded-lg

              bg-slate-100

              px-2
              py-1

              font-black
            ">

              ↵

            </kbd>

            Ejecutar

          </div>

          <div className="
            flex
            items-center
            gap-2
          ">

            <kbd className="
              rounded-lg

              bg-slate-100

              px-2
              py-1

              font-black
            ">

              ↑↓

            </kbd>

            Navegar

          </div>

        </div>

      </Command>

    </div>

  );

}

export default CommandPalette;