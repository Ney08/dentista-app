import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";
import { useAuthContext } from "../context/AuthContext";

function Layout({ children }) {

  const [abierto, setAbierto] = useState(false);
  const [mostrarLogout, setMostrarLogout] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(true);
  const location = useLocation();
  const { logout } = useAuthContext();
  useEffect(() => {

    let lastScrollY = window.scrollY;

    const handleScroll = () => {

      const currentScrollY = window.scrollY;

      // ✅ BAJANDO
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowMobileNav(false);
      }

      // ✅ SUBIENDO
      else {
        setShowMobileNav(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };

  }, []);
  const menu = [
    {
      path: "/",
      icon: "🏠",
      label: "Dashboard",
      mobileLabel: "Inicio"
    },
    {
      path: "/clientes",
      icon: "👤",
      label: "Clientes",
      mobileLabel: "Clientes"
    },
    {
      path: "/citas",
      icon: "📅",
      label: "Citas",
      mobileLabel: "Citas"
    },
    {
      path: "/facturaciones",
      icon: "🧾",
      label: "Facturación",
      mobileLabel: "Facturas"
    },
    {
      path: "/reportes",
      icon: "📊",
      label: "Reportes",
      mobileLabel: "Reportes"
    },
    {
      path: "/settings",
      icon: "⚙️",
      label: "Configuración",
      mobileLabel: "Ajustes"
    },
  ];

  const confirmarLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">

      {/* ✅ MOBILE TOPBAR */}
      <div className="
        md:hidden
        sticky top-0 z-40

        h-14
        px-4

        flex items-center justify-between

        bg-white/80
        backdrop-blur-xl

        border-b border-gray-200
      ">

        <div className="flex items-center gap-2">
          <span className="text-xl">🦷</span>

          <span className="font-bold tracking-tight text-gray-800">
            DentalApp
          </span>
        </div>

        <button
          onClick={() => setAbierto(true)}
          className="
            w-10 h-10 rounded-2xl

            flex items-center justify-center

            bg-gray-100 hover:bg-gray-200

            border border-gray-200

            transition-all duration-200
            active:scale-[0.98]
          "
        >
          ☰
        </button>

      </div>

      {/* ✅ OVERLAY MOBILE */}
      {abierto && (
        <div
          onClick={() => setAbierto(false)}
          className="
            fixed inset-0 z-40

            bg-black/40
            backdrop-blur-sm

            md:hidden
          "
        />
      )}

      {/* ✅ SIDEBAR DESKTOP */}
      <aside
        className={`
          hidden md:flex

          fixed top-0 left-0 z-50
          h-screen

          flex-col

          bg-gradient-to-b
          from-[#0f172a]
          via-[#081226]
          to-[#020617]

          border-r border-white/5

          text-white

          transition-all duration-300 ease-out

          ${abierto ? "w-64" : "w-20"}
        `}
      >

        {/* ✅ HEADER */}
        <div className="
          h-20 px-4

          flex items-center justify-between

          border-b border-white/5
        ">

          {abierto && (
            <div className="flex items-center gap-3">

              <div className="
                w-10 h-10 rounded-2xl

                flex items-center justify-center

                bg-gradient-to-br
                from-blue-500
                to-indigo-500

                shadow-lg
              ">
                🦷
              </div>

              <div>
                <p className="font-semibold tracking-tight text-white">
                  DentalApp
                </p>

                <p className="text-xs text-gray-400">
                  SaaS Dental
                </p>
              </div>

            </div>
          )}

          <button
            onClick={() => setAbierto(!abierto)}
            className="
              w-11 h-11 rounded-2xl

              flex items-center justify-center

              bg-white/5 hover:bg-white/10

              border border-white/10

              transition-all duration-200
            "
          >
            ☰
          </button>

        </div>

        {/* ✅ NAV */}
        <nav className="
          flex-1

          px-3 py-4

          space-y-1.5

          overflow-y-auto overflow-x-hidden
        ">

          {menu.map((item) => {

            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  relative

                  flex items-center
                  gap-3

                  px-3
                  h-12

                  rounded-2xl

                  transition-all duration-200

                  ${active
                    ? `
                      bg-gradient-to-r
                      from-[#3b82f6]
                      to-[#6366f1]

                      text-white
                      shadow-sm
                    `
                    : `
                      text-gray-400

                      hover:text-white
                      hover:bg-white/5
                      hover:translate-x-1
                    `
                  }
                `}
              >

                {/* ACTIVE BAR */}
                {active && (
                  <span className="
                    absolute left-0 top-2 bottom-2
                    w-1 rounded-r-full
                    bg-blue-300
                  " />
                )}

                {/* ICON */}
                <span className="text-[18px] shrink-0">
                  {item.icon}
                </span>

                {/* LABEL */}
                {abierto && (
                  <span className="text-sm font-medium truncate">
                    {item.label}
                  </span>
                )}

              </Link>
            );
          })}

        </nav>

        {/* ✅ FOOTER */}
        <div className="
          p-3

          border-t border-white/5
        ">

          <button
            onClick={() => setMostrarLogout(true)}
            className="
              flex items-center gap-3

              w-full
              h-12

              px-3

              rounded-2xl

              text-red-400

              hover:bg-red-500/10
              hover:text-red-300

              transition-all duration-200
            "
          >

            <span className="text-lg">
              🚪
            </span>

            {abierto && (
              <span className="text-sm font-medium">
                Cerrar sesión
              </span>
            )}

          </button>

        </div>

      </aside>

      {/* ✅ MOBILE DRAWER */}
      <aside
        className={`
          fixed top-0 left-0 z-50

          md:hidden

          h-screen
          w-72

          flex flex-col

          bg-gradient-to-b
          from-[#0f172a]
          via-[#081226]
          to-[#020617]

          border-r border-white/5

          text-white

          transition-transform duration-300 ease-out

          ${abierto
            ? "translate-x-0"
            : "-translate-x-full"}
        `}
      >

        {/* ✅ MOBILE HEADER */}
        <div className="
          h-16 px-4

          flex items-center justify-between

          border-b border-white/5
        ">

          <div className="flex items-center gap-3">

            <div className="
              w-10 h-10 rounded-2xl

              flex items-center justify-center

              bg-gradient-to-br
              from-blue-500
              to-indigo-500
            ">
              🦷
            </div>

            <div>
              <p className="font-semibold tracking-tight">
                DentalApp
              </p>

              <p className="text-xs text-gray-400">
                SaaS Dental
              </p>
            </div>

          </div>

          <button
            onClick={() => setAbierto(false)}
            className="
              w-10 h-10 rounded-2xl

              flex items-center justify-center

              bg-white/5

              border border-white/10
            "
          >
            ✕
          </button>

        </div>

        {/* ✅ MOBILE NAV */}
        <nav className="
          flex-1

          px-3 py-4

          space-y-1.5
        ">

          {menu.map((item) => {

            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setAbierto(false)}
                className={`
                  relative

                  flex items-center
                  gap-3

                  px-3
                  h-12

                  rounded-2xl

                  transition-all duration-200

                  ${active
                    ? `
                      bg-gradient-to-r
                      from-[#3b82f6]
                      to-[#6366f1]

                      text-white
                    `
                    : `
                      text-gray-400
                      hover:bg-white/5
                    `
                  }
                `}
              >

                <span className="text-[18px]">
                  {item.icon}
                </span>

                <span className="text-sm font-medium">
                  {item.label}
                </span>

              </Link>
            );
          })}

        </nav>

        {/* ✅ MOBILE FOOTER */}
        <div className="
          p-3

          border-t border-white/5
        ">

          <button
            onClick={() => setMostrarLogout(true)}
            className="
              flex items-center gap-3

              w-full
              h-12

              px-3

              rounded-2xl

              text-red-400

              hover:bg-red-500/10

              transition-all duration-200
            "
          >

            <span className="text-lg">
              🚪
            </span>

            <span className="text-sm font-medium">
              Cerrar sesión
            </span>

          </button>

        </div>

      </aside>

      {/* ✅ CONTENIDO */}
      <main
        className={`
          transition-all duration-300

          min-h-screen

          ${abierto
            ? "md:ml-64"
            : "md:ml-20"}
        `}
      >

        <div className="
          p-3 sm:p-4 md:p-6

          max-w-7xl
          mx-auto
        ">
          {children}
        </div>

      </main>

      {/* ✅ MOBILE BOTTOM NAV */}
      <div
        className={`
  fixed bottom-3 left-3 right-3 z-40

  md:hidden

  bg-white/80
  backdrop-blur-xl

  border border-gray-200/70

  rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.12)]

  px-2 py-1.5

  flex items-center justify-around

  transition-all duration-300 ease-out

  ${showMobileNav
            ? "translate-y-0 opacity-100"
            : "translate-y-24 opacity-0 pointer-events-none"}
`}
      >

        {menu.map((item) => {

          const active = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex flex-col
                items-center justify-center

                min-w-[58px]

                px-2 py-1.5

                rounded-2xl

                transition-all duration-200

                ${active
                  ? `
                    bg-gradient-to-r
                    from-[#3b82f6]
                    to-[#6366f1]

                    text-white
                    shadow-sm
                  `
                  : `
                    text-gray-500
                  `
                }
              `}
            >

              <span className="text-lg">
                {item.icon}
              </span>

              <span className="text-[9px] font-medium mt-1">
                {item.mobileLabel}
              </span>

            </Link>
          );
        })}

      </div>

      {/* ✅ LOGOUT MODAL */}
      {mostrarLogout && (
        <ConfirmModal
          mensaje="¿Seguro que quieres cerrar sesión? ⚠️"
          onConfirm={confirmarLogout}
          onCancel={() => setMostrarLogout(false)}
        />
      )}

    </div>
  );
}

export default Layout;