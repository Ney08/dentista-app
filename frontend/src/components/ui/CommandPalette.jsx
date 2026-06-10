import {
  useEffect,
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
  Search
} from "lucide-react";

function CommandPalette() {

  const navigate =
    useNavigate();

  const [open, setOpen] =
    useState(false);

  /*
  ==========================================
  SHORTCUT
  ==========================================
  */

  useEffect(() => {

  const down = (e) => {

    /*
    ================================
    CTRL + K
    ================================
    */

    if (
      (e.metaKey || e.ctrlKey) &&
      e.key.toLowerCase() === "k"
    ) {

      e.preventDefault();

      setOpen((open) => !open);

    }

    /*
    ================================
    ESC
    ================================
    */

    if (e.key === "Escape") {

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
  ITEMS
  ==========================================
  */

  const items = [

    {
      label: "Dashboard",
      icon: LayoutDashboard,
      action: () => navigate("/")
    },

    {
      label: "Clientes",
      icon: Users,
      action: () => navigate("/clientes")
    },

    {
      label: "Citas",
      icon: CalendarDays,
      action: () => navigate("/citas")
    },

    {
      label: "Facturación",
      icon: Receipt,
      action: () =>
        navigate("/facturaciones")
    },

    {
      label: "Egresos",
      icon: Wallet,
      action: () =>
        navigate("/egresos")
    },

    {
      label: "Reportes",
      icon: BarChart3,
      action: () =>
        navigate("/reportes")
    },

    {
      label: "Configuración",
      icon: Settings,
      action: () =>
        navigate("/settings")
    }

  ];

  if (!open) {
    return null;
  }

  return (

    <div className="
      fixed
      inset-0
      z-[999]

      bg-slate-950/40
      backdrop-blur-md

      flex
      items-start
      justify-center

      pt-[12vh]

      px-4
    ">

      <Command
        className="
          relative
          overflow-hidden

          w-full
          max-w-2xl

          rounded-[32px]

          border
          border-white/40

          bg-white/80
          backdrop-blur-2xl

          shadow-[0_30px_80px_rgba(0,0,0,0.18)]
        "
      >

        {/* GLOW */}

        <div className="
          absolute
          -top-20
          -right-20

          w-72
          h-72

          rounded-full

          bg-indigo-500/10

          blur-3xl
        " />

        {/* INPUT */}

        <div className="
          relative
          z-10

          flex
          items-center

          gap-4

          px-6
          py-5

          border-b
          border-slate-200/70
        ">

          <Search
            size={20}
            className="
              text-slate-400
            "
          />

          <Command.Input
            autoFocus
            placeholder="Buscar acciones, páginas o módulos..."
            className="
              flex-1

              bg-transparent

              text-[15px]

              text-slate-700

              placeholder:text-slate-400

              outline-none
            "
          />

          <div className="
            hidden
            sm:flex

            items-center
            gap-1

            text-xs

            text-slate-400
          ">

            <kbd className="
              px-2
              py-1

              rounded-lg

              bg-slate-100
            ">
              ESC
            </kbd>

          </div>

        </div>

        {/* LIST */}

        <Command.List
          className="
            relative
            z-10

            max-h-[420px]

            overflow-y-auto

            p-3
          "
        >

          <Command.Empty
            className="
              py-10

              text-center

              text-sm

              text-slate-400
            "
          >

            No se encontraron resultados

          </Command.Empty>

          <Command.Group>

            {items.map((item) => {

              const Icon =
                item.icon;

              return (

                <Command.Item
                  key={item.label}
                  onSelect={() => {

                    item.action();

                    setOpen(false);

                  }}
                  className="
                    flex
                    items-center

                    gap-4

                    px-4
                    py-4

                    rounded-[22px]

                    cursor-pointer

                    text-slate-700

                    aria-selected:bg-indigo-500
                    aria-selected:text-white

                    transition-all
                    duration-200
                  "
                >

                  <div className="
                    w-11
                    h-11

                    rounded-[18px]

                    bg-slate-100

                    flex
                    items-center
                    justify-center
                  ">

                    <Icon size={18} />

                  </div>

                  <span className="
                    text-sm

                    font-semibold
                  ">

                    {item.label}

                  </span>

                </Command.Item>

              );

            })}

          </Command.Group>

        </Command.List>

      </Command>

    </div>

  );

}

export default CommandPalette;