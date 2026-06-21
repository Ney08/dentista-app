import {
  useState,
  useEffect
} from "react";

import {
  Link,
  useLocation
} from "react-router-dom";
import dentalLogo from "../assets/dentalapp_logo_square.png";
import CommandPalette from "./ui/CommandPalette";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Receipt,
  Wallet,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  Stethoscope,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import ThemeToggle from "./ui/ThemeToggle";
import {
  motion,
  AnimatePresence
} from "framer-motion";

import ConfirmModal from "./ConfirmModal";

import {
  useAuthContext
} from "../context/AuthContext";

function Layout({ children }) {

  const [abierto, setAbierto] =
    useState(true);

  const [mostrarLogout, setMostrarLogout] =
    useState(false);

  const [showMobileNav, setShowMobileNav] =
    useState(true);

  const location =
    useLocation();

  const { logout } =
    useAuthContext();

  useEffect(() => {

    let lastScrollY =
      window.scrollY;

    const handleScroll = () => {

      const currentScrollY =
        window.scrollY;

      if (
        currentScrollY > lastScrollY &&
        currentScrollY > 80
      ) {

        setShowMobileNav(false);

      } else {

        setShowMobileNav(true);

      }

      lastScrollY =
        currentScrollY;

    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {

      window.removeEventListener(
        "scroll",
        handleScroll
      );

    };

  }, []);

  const menu = [
    {
      path: "/",
      icon: LayoutDashboard,
      label: "Dashboard",
      mobileLabel: "Inicio"
    },
    {
      path: "/clientes",
      icon: Users,
      label: "Clientes",
      mobileLabel: "Clientes"
    },
    {
      path: "/citas",
      icon: CalendarDays,
      label: "Citas",
      mobileLabel: "Citas"
    },
    {
      path: "/facturaciones",
      icon: Receipt,
      label: "Facturación",
      mobileLabel: "Facturas"
    },
    {
      path: "/egresos",
      icon: Wallet,
      label: "Egresos",
      mobileLabel: "Egresos"
    },
    {
      path: "/reportes",
      icon: BarChart3,
      label: "Reportes",
      mobileLabel: "Reportes"
    },
    {
      path: "/settings",
      icon: Settings,
      label: "Configuración",
      mobileLabel: "Ajustes"
    }
  ];

  const confirmarLogout = () => {

    logout();

  };
  const BrandLogo = ({
    size = "w-14 h-14",
    radius = "rounded-[24px]"
  }) => (

    <div className={`
    relative

    ${size}

    ${radius}

    overflow-hidden

    shadow-[0_18px_40px_rgba(99,102,241,0.35)]

    flex
    items-center
    justify-center

    shrink-0
  `}>

      <img
        src={dentalLogo}
        alt="DentalApp"
        className="
        w-full
        h-full

        object-contain
      "
      />

    </div>

  );

  return (

    <div className="
      min-h-screen

      bg-[#f5f7fb]
    ">

      {/* MOBILE TOPBAR */}

      <div className="
        md:hidden

        sticky
        top-0
        z-40

        h-16

        px-4

        flex
        items-center
        justify-between

        bg-white/70
        backdrop-blur-2xl

        border-b
        border-white/50

        shadow-[0_10px_30px_rgba(0,0,0,0.04)]
      ">

        <div className="
          flex
          items-center
          gap-3
        ">

          
<BrandLogo
  size="w-11 h-11"
  radius="rounded-[18px]"
/>


          <div>

            <p className="
              text-sm

              font-black

              tracking-tight

              text-slate-800
            ">
              DentalApp
            </p>

            <p className="
              text-[11px]

              text-slate-400
            ">
              Gestión clínica inteligente
            </p>

          </div>

        </div>
        <ThemeToggle />
        <button
          onClick={() =>
            setAbierto(true)
          }
          className="
            group

            relative
            overflow-hidden

            w-11
            h-11

            rounded-[20px]

            bg-white/50
            backdrop-blur-xl

            border
            border-white/50

            shadow-[0_10px_30px_rgba(0,0,0,0.06)]

            hover:border-indigo-200

            hover:shadow-[0_15px_35px_rgba(99,102,241,0.15)]

            active:scale-[0.96]

            transition-all
            duration-300

            flex
            items-center
            justify-center
          "
        >

          <div className="
            absolute
            inset-0

            opacity-0

            bg-gradient-to-br
            from-indigo-500/10
            to-purple-500/10

            group-hover:opacity-100

            transition-all
            duration-300
          " />

          <Menu size={19} />

        </button>

      </div>

      {/* MOBILE OVERLAY */}

      {abierto && (

        <div
          onClick={() =>
            setAbierto(false)
          }
          className="
            fixed
            inset-0
            z-40

           bg-slate-950/40
            backdrop-blur-sm

            md:hidden
          "
        />

      )}

      {/* DESKTOP SIDEBAR */}

      <aside
        className={`
          hidden
          md:flex

          fixed
          top-0
          left-0
          z-50

          h-screen

          flex-col

          bg-gradient-to-b
          from-[#0f172a]
          via-[#081226]
          to-[#020617]

          border-r
          border-white/5

          shadow-[0_20px_60px_rgba(0,0,0,0.45)]

          transition-all
          duration-300
          ease-out

          ${abierto
            ? "w-[290px]"
            : "w-[92px]"
          }
        `}
      >

        {/* SIDEBAR GLOW */}

        <div className="
          absolute
          top-0
          left-0

          w-full
          h-64

          bg-indigo-500/10

          blur-3xl

          pointer-events-none
        " />

        {/* HEADER */}

        <div className="
          relative
          z-10

          h-24

          px-5

          flex
          items-center
          justify-between

          border-b
          border-white/5
        ">

          {abierto && (

            <div className="
              flex
              items-center
              gap-4
            ">

              <BrandLogo />

              <div>

                <p className="
                  text-lg

                  font-black

                  tracking-tight

                  text-white
                ">
                  DentalApp
                </p>

                <p className="
                  text-xs

                  text-slate-400
                ">
                  Gestión clínica inteligente
                </p>

              </div>

            </div>

          )}

          <button
            onClick={() =>
              setAbierto(!abierto)
            }
            className="
              group

              relative
              overflow-hidden

              w-12
              h-12

              rounded-[22px]

              bg-white/5
              backdrop-blur-xl

              border
              border-white/10

              shadow-[0_10px_30px_rgba(0,0,0,0.25)]

              hover:bg-white/10

              hover:border-indigo-400/20

              hover:shadow-[0_15px_35px_rgba(99,102,241,0.15)]

              active:scale-[0.96]

              transition-all
              duration-300

              flex
              items-center
              justify-center
            "
          >

            <div className="
              absolute
              inset-0

              opacity-0

              bg-gradient-to-br
              from-indigo-500/10
              to-purple-500/10

              group-hover:opacity-100

              transition-all
              duration-300
            " />

            {abierto ? (

              <ChevronLeft size={20} />

            ) : (

              <ChevronRight size={20} />

            )}

          </button>

        </div>

        {/* NAV */}

        <nav className="
          relative
          z-10

          flex-1

          px-4
          py-5

          space-y-2

          overflow-y-auto
          overflow-x-hidden
        ">

          {menu.map((item) => {

            const active =
              location.pathname === item.path;

            const Icon =
              item.icon;

            return (

              <Link
                key={item.path}
                to={item.path}
                className={`
                  group

                  relative
                  overflow-hidden

                  flex
                  items-center

                  gap-4

                  h-14

                  px-4

                  rounded-[24px]

                  transition-all
                  duration-300

                  ${active
                    ? `
                      bg-gradient-to-r
                      from-indigo-500
                      via-purple-500
                      to-violet-500

                      text-white

                      shadow-[0_15px_40px_rgba(99,102,241,0.28)]
                    `
                    : `
                      text-slate-300

                      hover:bg-white/5

                      hover:text-white

                      hover:translate-x-[3px]
                    `
                  }
                `}
              >

                {active && (

                  <div className="
                    absolute
                    inset-0

                    bg-white/10

                    opacity-60
                  " />

                )}

                <div className={`
                  relative
                  z-10

                  w-10
                  h-10

                  rounded-[18px]

                  flex
                  items-center
                  justify-center

                  transition-all
                  duration-300

                  ${active
                    ? `
                      bg-white/15
                    `
                    : `
                      bg-white/[0.03]

                      group-hover:bg-white/10
                    `
                  }
                `}>

                  <Icon size={20} />

                </div>

                {abierto && (

                  <span className="
                    relative
                    z-10

                    text-sm

                    font-semibold

                    tracking-tight

                    truncate
                  ">
                    {item.label}
                  </span>

                )}

              </Link>

            );

          })}

        </nav>

        {/* FOOTER */}

        <div className="
          relative
          z-10

          p-4

          border-t
          border-white/5
        ">

          <button
            onClick={() =>
              setMostrarLogout(true)
            }
            className="
              group

              relative
              overflow-hidden

              flex
              items-center

              gap-4

              w-full
              h-14

              px-4

              rounded-[24px]

              bg-rose-500/10

              border
              border-rose-500/10

              text-rose-300

              hover:bg-rose-500/15

              hover:border-rose-400/20

              hover:text-white

              transition-all
              duration-300
            "
          >

            <div className="
              absolute
              inset-0

              opacity-0

              bg-gradient-to-r
              from-rose-500/10
              to-pink-500/10

              group-hover:opacity-100

              transition-all
              duration-300
            " />

            <div className="
              relative
              z-10

              w-10
              h-10

              rounded-[18px]

              bg-white/5

              flex
              items-center
              justify-center
            ">

              <LogOut size={18} />

            </div>

            {abierto && (

              <span className="
                relative
                z-10

                text-sm

                font-semibold
              ">
                Cerrar sesión
              </span>

            )}

          </button>

        </div>

      </aside>

      {/* MOBILE DRAWER */}

      <aside
        className={`
          fixed
          top-0
          left-0
          z-50

          md:hidden

          h-screen
          w-[290px]

          flex
          flex-col

          bg-gradient-to-b
          from-[#0f172a]
          via-[#081226]
          to-[#020617]

          border-r
          border-white/5

          shadow-[0_20px_60px_rgba(0,0,0,0.45)]

          transition-transform
          duration-300
          ease-out

          ${abierto
            ? "translate-x-0"
            : "-translate-x-full"
          }
        `}
      >

        {/* MOBILE CONTENT SAME STYLE */}

        <div className="
          h-24

          px-5

          flex
          items-center
          justify-between

          border-b
          border-white/5
        ">

          <div className="
            flex
            items-center
            gap-4
          ">

            <BrandLogo />

            <div>

              <p className="
                text-lg

                font-black

                tracking-tight

                text-white
              ">
                DentalApp
              </p>

              <p className="
                text-xs

                text-slate-400
              ">
                Gestión clínica inteligente
              </p>

            </div>

          </div>

          <button
            onClick={() =>
              setAbierto(false)
            }
            className="
              w-11
              h-11

              rounded-[20px]

              bg-white/5

              border
              border-white/10

              text-slate-200

              flex
              items-center
              justify-center
            "
          >
            <X size={20} />
          </button>

        </div>

        <nav className="
          flex-1

          px-4
          py-5

          space-y-2
        ">

          {menu.map((item) => {

            const active =
              location.pathname === item.path;

            const Icon =
              item.icon;

            return (

              <Link
                key={item.path}
                to={item.path}
                onClick={() =>
                  setAbierto(false)
                }
                className={`
                  flex
                  items-center

                  gap-4

                  h-14

                  px-4

                  rounded-[24px]

                  transition-all
                  duration-300

                  ${active
                    ? `
                      bg-gradient-to-r
                      from-indigo-500
                      via-purple-500
                      to-violet-500

                      text-white

                      shadow-[0_15px_40px_rgba(99,102,241,0.28)]
                    `
                    : `
                      text-slate-300

                      hover:bg-white/5
                    `
                  }
                `}
              >

                <div className={`
                  w-10
                  h-10

                  rounded-[18px]

                  flex
                  items-center
                  justify-center

                  ${active
                    ? "bg-white/15"
                    : "bg-white/[0.03]"
                  }
                `}>

                  <Icon size={20} />

                </div>

                <span className="
                  text-sm

                  font-semibold
                ">
                  {item.label}
                </span>

              </Link>

            );

          })}

        </nav>

      </aside>

      {/* CONTENT */}

      <main
        className={`
          min-h-screen

          transition-all
          duration-300

          ${abierto
            ? "md:ml-[290px]"
            : "md:ml-[92px]"
          }
        `}
      >

        <div className="
          p-3
          sm:p-4
          md:p-6

          max-w-[1700px]
          mx-auto
        ">
          <AnimatePresence mode="wait">



            {children}



          </AnimatePresence>

        </div>

      </main>

      {/* MOBILE BOTTOM NAV */}

      <div
        className={`
    fixed
    bottom-3
    left-3
    right-3
    z-40

    md:hidden

    bg-white/70
    backdrop-blur-2xl

    border
    border-white/50

    rounded-[30px]

    shadow-[0_10px_40px_rgba(0,0,0,0.10)]

    px-2
    py-2

    pb-[env(safe-area-inset-bottom)]

    flex
    items-center
    justify-around

    transition-all
    duration-300

    ${showMobileNav
            ? `
        translate-y-0
        opacity-100
      `
            : `
        translate-y-24
        opacity-0
        pointer-events-none
      `
          }
  `}
      >

        {menu.map((item) => {

          const active =
            location.pathname === item.path;

          const Icon =
            item.icon;

          return (

            <Link
              key={item.path}
              to={item.path}
              className={`
                relative

                flex
                flex-col

                items-center
                justify-center

                min-w-[60px]

                px-2
                py-2

                rounded-[22px]

                transition-all
                duration-300

                ${active
                  ? `
                    bg-gradient-to-r
                    from-indigo-500
                    via-purple-500
                    to-violet-500

                    text-white

                    shadow-[0_12px_30px_rgba(99,102,241,0.25)]
                  `
                  : `
                    text-slate-500
                  `
                }
              `}
            >

              <Icon size={18} />

              <span className="
                text-[10px]

                font-semibold

                mt-1
              ">
                {item.mobileLabel}
              </span>

            </Link>

          );

        })}

      </div>
      <CommandPalette />
      {/* LOGOUT MODAL */}

      {mostrarLogout && (

        <ConfirmModal
          mensaje="¿Seguro que quieres cerrar sesión? ⚠️"
          onConfirm={confirmarLogout}
          onCancel={() =>
            setMostrarLogout(false)
          }
        />

      )}

    </div>

  );

}

export default Layout;