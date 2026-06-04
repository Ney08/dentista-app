import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";
import { useAuthContext } from "../context/AuthContext";

function Layout({ children }) {

  const [abierto, setAbierto] = useState(true);
  const [mostrarLogout, setMostrarLogout] = useState(false);

  const location = useLocation();
  const { logout } = useAuthContext();

  const menu = [
    { path: "/", icon: "🏠", label: "Dashboard" },
    { path: "/clientes", icon: "👤", label: "Clientes" },
    { path: "/citas", icon: "📅", label: "Citas" },
    { path: "/facturaciones", icon: "🧾", label: "Facturación" },
    { path: "/reportes", icon: "📊", label: "Reportes" },
    { path: "/settings", icon: "⚙️", label: "Configuración" },
  ];

  const confirmarLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* ✅ SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 h-screen z-50
          flex flex-col
          bg-gradient-to-b from-[#0f172a] to-[#020617]
          text-white transition-all duration-300
          ${abierto ? "w-64" : "w-20"}
        `}
      >

        {/* ✅ HEADER */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">

          {/* LOGO */}
          {abierto && (
            <div className="flex items-center gap-2">
              <span className="text-xl">🦷</span>
              <span className="font-semibold">DentalApp</span>
            </div>
          )}

          {/* TOGGLE */}
          <button
            onClick={() => setAbierto(!abierto)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            ☰
          </button>

        </div>

        {/* ✅ NAV */}
        <nav className="flex-1 p-3 space-y-2">

          {menu.map((item) => {

            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  relative flex items-center gap-3
                  px-3 py-2 rounded-xl
                  transition-all duration-200

                  ${active
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md scale-[1.02]"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                  }
                `}
              >

                {/* INDICADOR LATERAL */}
                {active && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-blue-400 rounded-r"></span>
                )}

                {/* ICON */}
                <span className="text-lg">{item.icon}</span>

                {/* TEXT */}
                {abierto && (
                  <span className="text-sm font-medium">
                    {item.label}
                  </span>
                )}

              </Link>
            );
          })}

        </nav>

        {/* ✅ FOOTER */}
        <div className="p-3 border-t border-white/10">

          <button
            onClick={() => setMostrarLogout(true)}
            className="
              flex items-center gap-3 w-full px-3 py-2 rounded-xl
              text-red-400
              hover:bg-red-500/20 hover:text-red-300
              transition
            "
          >
            <span className="text-lg">🚪</span>
            {abierto && "Cerrar sesión"}
          </button>

        </div>

      </aside>

      {/* ✅ CONTENIDO */}
      <main
        className={`
          flex-1 transition-all duration-300
          ${abierto ? "ml-64" : "ml-20"}
        `}
      >
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* ✅ MODAL LOGOUT */}
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
