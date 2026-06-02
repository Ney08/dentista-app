import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";

// ✅ AUTH GLOBAL
import { useAuthContext } from "../context/AuthContext";

function Layout({ children }) {

  const [abierto, setAbierto] = useState(true);
  const [mostrarLogout, setMostrarLogout] = useState(false);

  const location = useLocation();

  // ✅ CONTEXTO
  const { logout } = useAuthContext();

  // ✅ ESTILO MODERNO
  const linkClass = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium
    ${location.pathname === path
      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
      : "text-gray-300 hover:bg-gray-800 hover:text-white"
    }`;

  // ✅ LOGOUT GLOBAL
  const confirmarLogout = () => {
    logout(); 
  };

  return (
    <div className="h-screen flex bg-gray-100 overflow-hidden">

      {/* ✅ SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 h-screen
          bg-gray-900 text-white flex flex-col
          transition-all duration-300
          ${abierto ? "w-64" : "w-16"}
        `}
      >

        {/* HEADER */}
        <div>

          <div className="p-4 flex justify-between items-center border-b border-white/10">

            {abierto && (
              <h2 className="text-lg font-semibold tracking-wide">
                🦷 Panel
              </h2>
            )}

            <button
              onClick={() => setAbierto(!abierto)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
            >
              ☰
            </button>

          </div>

          {/* NAV */}
          <nav className="p-3 space-y-1">

            {[
              { path: "/", icon: "🏠", label: "Dashboard" },
              { path: "/clientes", icon: "👤", label: "Clientes" },
              { path: "/citas", icon: "📅", label: "Citas" },
              { path: "/facturaciones", icon: "🧾", label: "Facturación" },
              { path: "/reportes", icon: "📊", label: "Reportes" },
              { path: "/settings", icon: "⚙️", label: "Configuración" },
            ].map((item) => {

              const active = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl
                    transition-all duration-200
                    
                    ${active
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                    }
                  `}
                >
                  <span className="text-lg">{item.icon}</span>
                  {abierto && <span>{item.label}</span>}
                </Link>
              );
            })}

          </nav>

        </div>

        {/* FOOTER */}
        <div className="p-3 border-t border-white/10 mt-auto">

          <button
            onClick={() => setMostrarLogout(true)}
            className="
              flex items-center gap-3 w-full px-4 py-3 rounded-xl
              text-red-400
              hover:bg-red-500/20 hover:text-red-300
              transition
            "
          >
            🚪 {abierto && "Cerrar sesión"}
          </button>

        </div>

      </aside>

      {/* ✅ CONTENIDO */}
      <main
        className={`
          flex-1
          p-4 md:p-6
          bg-gray-100
          ${abierto ? "ml-64" : "ml-16"}
        `}
      >
        <div className="max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* ✅ MODAL */}
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