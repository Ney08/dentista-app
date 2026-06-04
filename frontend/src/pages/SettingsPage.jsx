import { useState } from "react";
import PageWrapper from "../components/PageWrapper";
import ConfirmModal from "../components/ConfirmModal";
import ServicioModal from "../components/ServicioModal";
import toast from "react-hot-toast";
import { useUser } from "../hooks/useUser";
import { useServicios } from "../hooks/useServicios";
import { useClientes } from "../hooks/useClientes";
import ClientesInactivosTab from "../components/settings/ClientesInactivosTab";
import ServiciosTab from "../components/settings/ServiciosTab";

function SettingsPage() {
  const { updateUser } = useUser();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nuevoPassword, setNuevoPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const [tab, setTab] = useState("cuenta");

  const {
    servicios,
    agregarServicio,
    eliminarServicio,
    actualizarServicio,
    isLoading: serviciosLoading
  } = useServicios();

  const {
    clientes: clientesInactivos,
    isLoading: clientesLoading,
    toggleCliente
  } = useClientes(false); // 🔥 SOLO INACTIVOS

  const [servicioAEliminar, setServicioAEliminar] = useState(null);
  const [modalServicio, setModalServicio] = useState(false);
  const [servicioEditar, setServicioEditar] = useState(null);

  const USER_ID = 1;

  const btn = `
    w-full py-2 rounded-lg text-white font-medium
    transition-all duration-200 active:scale-[0.98]
  `;

  // ✅ GUARDAR USUARIO
  const guardarUsuario = async () => {
    if (!username.trim()) {
      return toast.error("Usuario vacío ❌");
    }

    try {
      setLoading(true);

      await updateUser(
        USER_ID,
        username,
        password || "temp1234"
      );

      toast.success("Usuario actualizado ✅");
      setPassword("");

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ CAMBIAR PASSWORD
  const cambiarPassword = () => {
    if (!password || !nuevoPassword) {
      return toast.error("Completa los campos ❌");
    }

    if (nuevoPassword.length < 6) {
      return toast.error("Mínimo 6 caracteres ⚠️");
    }

    setMostrarConfirmacion(true);
  };

  const confirmarCambioPassword = async () => {
    try {
      setLoading(true);

      await updateUser(
        USER_ID,
        username,
        nuevoPassword
      );

      toast.success("Contraseña actualizada 🔒");

      setPassword("");
      setNuevoPassword("");
      setMostrarConfirmacion(false);

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };



  const guardarServicio = async (data) => {

    if (!data.nombre.trim()) {
      return toast.error("Nombre requerido ❌");
    }

    if (!data.precio) {
      return toast.error("Precio requerido ⚠️");
    }

    try {

      if (data.id) {
        // ✅ EDITAR
        await actualizarServicio({
          id: data.id,
          nombre: data.nombre,
          descripcion: data.descripcion,
          precio: parseFloat(data.precio)
        });

        toast.success("Servicio actualizado ✏️");

      } else {
        // ✅ CREAR
        await agregarServicio({
          nombre: data.nombre,
          descripcion: data.descripcion,
          precio: parseFloat(data.precio)
        });

        toast.success("Servicio agregado ✅");
      }

      setModalServicio(false);
      setServicioEditar(null);

    } catch {
      toast.error("Error ❌");
      console.log(data.id);
    }
  };
  if (
    clientesLoading ||
    serviciosLoading
  ) {
    return (
      <PageWrapper>

        <div className="max-w-5xl mx-auto space-y-6">

          {/* HEADER */}
          <div className="space-y-3 text-center">

            <div className="
            h-8 w-56 mx-auto
            bg-gray-300 rounded-xl
            animate-pulse
          " />

            <div className="
            h-4 w-40 mx-auto
            bg-gray-200 rounded-xl
            animate-pulse
          " />

          </div>

          {/* CARDS */}
          <div className="grid md:grid-cols-2 gap-5">

            <div className="
            h-56 rounded-2xl
            bg-gray-200 animate-pulse
          " />

            <div className="
            h-56 rounded-2xl
            bg-gray-200 animate-pulse
          " />

          </div>

          {/* TABLA */}
          <div className="
          h-[300px]
          rounded-2xl
          bg-gray-200
          animate-pulse
        " />

        </div>

      </PageWrapper>
    );
  }
  return (
    <PageWrapper>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-0 space-y-5 sm:space-y-6">

        {/* HEADER */}
        <div className="text-center space-y-1 sm:space-y-2 pt-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Configuración ⚙️</h1>
          <p className="text-sm text-gray-500">
            Administra tu cuenta y seguridad
          </p>
        </div>

        {/* TABS */}
        <div className="flex overflow-x-auto sm:justify-center gap-2 pb-2 no-scrollbar">
         {["cuenta", "servicios", "clientes"].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`
                px-4 sm:px-5 h-10 sm:h-11 rounded-2xl whitespace-nowrap text-sm transition-all duration-200 shrink-0"
                ${tab === t
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm"
                 : "bg-gray-100 hover:bg-gray-200 text-gray-700"}
              `}
            >
              {t === "cuenta" && "👤 Cuenta"}
              {t === "servicios" && "🧾 Servicios"}
              {t === "clientes" && "🚫 Clientes inactivos"}
            </button>
          ))}
        </div>

        {/* ✅ CUENTA */}
{tab === "cuenta" && (
  <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-4 sm:p-6 md:p-7 space-y-6 sm:space-y-7 overflow-hidden">

    {/* PERFIL */}
    <div className="space-y-3 sm:space-y-4">

      <div>
        <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-gray-800">
          Perfil
        </h3>

        <p className="text-sm text-gray-500">
          Administra tu información de acceso
        </p>
      </div>

      <input
        type="text"
        placeholder="Nombre de usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input h-11 sm:h-12 rounded-2xl border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 text-sm sm:text-base"
      />

      <button
        onClick={guardarUsuario}
        disabled={loading}
        className={`${btn} h-12 rounded-2xl shadow-sm ${loading
          ? "bg-gray-400"
          : "bg-blue-500 hover:bg-blue-600"
          }`}
      >
        {loading ? "Guardando..." : "💾 Guardar usuario"}
      </button>

    </div>

    {/* DIVIDER */}
    <div className="border-t border-dashed border-gray-200 my-1" />

    {/* PASSWORD */}
    <div className="space-y-3 sm:space-y-4">

      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          Seguridad
        </h3>

        <p className="text-sm text-gray-500 leading-relaxed">
          Cambia tu contraseña de acceso
        </p>
      </div>

      <input
        type="password"
        placeholder="Contraseña actual"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input h-11 sm:h-12 rounded-2xl border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 text-sm sm:text-base"
      />

      <input
        type="password"
        placeholder="Nueva contraseña"
        value={nuevoPassword}
        onChange={(e) => setNuevoPassword(e.target.value)}
        className="input h-11 sm:h-12 rounded-2xl border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 text-sm sm:text-base"
      />

      <button
        onClick={cambiarPassword}
        disabled={loading}
        className={`${btn} h-11 sm:h-12 rounded-2xl shadow-sm text-sm sm:text-base ${loading
          ? "bg-gray-400"
          : "bg-green-500 hover:bg-green-600"
          }`}
      >
        {loading ? "Aplicando..." : "🔐 Cambiar contraseña"}
      </button>

    </div>

  </div>
)}

        {/* ✅ SERVICIOS */}

        {tab === "servicios" && (
          <ServiciosTab
            servicios={servicios}
            setModalServicio={setModalServicio}
            setServicioEditar={setServicioEditar}
            setServicioAEliminar={setServicioAEliminar}
          />
        )}


        {tab === "clientes" && (
          <ClientesInactivosTab
            clientesInactivos={clientesInactivos}
            toggleCliente={toggleCliente}
          />
        )}

      </div>

      {/* MODAL PASSWORD */}
      {mostrarConfirmacion && (
        <ConfirmModal
          mensaje="¿Seguro que quieres cambiar la contraseña? ⚠️"
          onConfirm={confirmarCambioPassword}
          onCancel={() => setMostrarConfirmacion(false)}
        />
      )}

      {/* MODAL ELIMINAR */}
      {servicioAEliminar && (
        <ConfirmModal
          mensaje="¿Eliminar servicio? ⚠️"
          onConfirm={() => {
            eliminarServicio(servicioAEliminar.id);
            toast.success("Eliminado 🗑️");
            setServicioAEliminar(null);
          }}
          onCancel={() => setServicioAEliminar(null)}
        />
      )}

      {/* ✅ MODAL SERVICIO */}
      {modalServicio && (
        <ServicioModal
          servicio={servicioEditar}
          onGuardar={guardarServicio}
          onClose={() => setModalServicio(false)}
        />
      )}

    </PageWrapper>
  );
}

export default SettingsPage;
