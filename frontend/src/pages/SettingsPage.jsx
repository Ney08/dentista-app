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
  } = useClientes(false);

  const [servicioAEliminar, setServicioAEliminar] = useState(null);
  const [modalServicio, setModalServicio] = useState(false);
  const [servicioEditar, setServicioEditar] = useState(null);

  const USER_ID = 1;

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

  // ✅ GUARDAR SERVICIO
  const guardarServicio = async (data) => {

    if (!data.nombre.trim()) {
      return toast.error("Nombre requerido ❌");
    }

    if (!data.precio) {
      return toast.error("Precio requerido ⚠️");
    }

    try {

      if (data.id) {

        await actualizarServicio.mutateAsync({
          id: data.id,
          nombre: data.nombre,
          descripcion: data.descripcion,
          precio: parseFloat(data.precio),
          costo_servicio: parseFloat(data.costo_servicio || 0)
        });

        toast.success("Servicio actualizado ✏️");

      } else {

        await agregarServicio.mutateAsync({
          nombre: data.nombre,
          descripcion: data.descripcion,
          precio: parseFloat(data.precio),
          costo_servicio: parseFloat(data.costo_servicio || 0)
        });

        toast.success("Servicio agregado ✅");

      }

      setModalServicio(false);
      setServicioEditar(null);

    } catch {

      toast.error("Error ❌");

    }

  };

  // ✅ LOADING
  if (clientesLoading || serviciosLoading) {

    return (

      <PageWrapper>

        <div className="max-w-5xl mx-auto space-y-6">

          <div className="space-y-3 text-center">

            <div className="h-10 w-64 mx-auto bg-gray-300 rounded-2xl animate-pulse" />

            <div className="h-4 w-40 mx-auto bg-gray-200 rounded-xl animate-pulse" />

          </div>

          <div className="grid md:grid-cols-2 gap-5">

            <div className="h-56 rounded-3xl bg-gray-200 animate-pulse" />

            <div className="h-56 rounded-3xl bg-gray-200 animate-pulse" />

          </div>

          <div className="h-[300px] rounded-3xl bg-gray-200 animate-pulse" />

        </div>

      </PageWrapper>

    );

  }

  return (

    <PageWrapper>

      <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-0 space-y-6">

        {/* HEADER */}
        <div className="text-center space-y-2 pt-2">

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent">
            Configuración ⚙️
          </h1>

          <p className="text-sm sm:text-base text-gray-500">
            Administra tu cuenta, seguridad y servicios
          </p>

        </div>

        {/* TABS */}
        <div className="flex overflow-x-auto sm:justify-center gap-2 pb-2 no-scrollbar">

          {["cuenta", "servicios", "clientes"].map((t) => (

            <button
              key={t}
              onClick={() => setTab(t)}
              className={`
                px-4 sm:px-5 h-11 rounded-2xl whitespace-nowrap text-sm font-medium shrink-0 transition-all duration-200
                ${tab === t
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-200/50"
                  : "bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 shadow-sm"}
              `}
            >

              {t === "cuenta" && "👤 Cuenta"}
              {t === "servicios" && "🧾 Servicios"}
              {t === "clientes" && "🚫 Clientes inactivos"}

            </button>

          ))}

        </div>

        {/* CUENTA */}
        {tab === "cuenta" && (

          <div className="bg-white/90 backdrop-blur-xl rounded-[32px] border border-white/40 shadow-[0_10px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-300 p-5 sm:p-7 space-y-8 overflow-hidden">

            {/* PERFIL */}
            <div className="space-y-5">

              <div>

                <h3 className="text-xl font-bold tracking-tight text-gray-800">
                  Perfil
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Administra tu información de acceso
                </p>

              </div>

              <input
                type="text"
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-12 sm:h-14 rounded-2xl border border-gray-200 bg-white/70 px-4 text-sm sm:text-base outline-none transition-all duration-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 hover:border-blue-200"
              />

              <button
                onClick={guardarUsuario}
                disabled={loading}
                className={`
                  w-full h-12 sm:h-14 rounded-2xl text-white font-semibold transition-all duration-200 active:scale-[0.98]
                  ${loading
                    ? "bg-gray-400"
                    : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg shadow-blue-200/50 hover:scale-[1.01]"}
                `}
              >
                {loading ? "Guardando..." : "💾 Guardar usuario"}
              </button>

            </div>

            {/* DIVIDER */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            {/* PASSWORD */}
            <div className="space-y-5">

              <div>

                <h3 className="text-xl font-bold tracking-tight text-gray-800">
                  Seguridad
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Cambia tu contraseña de acceso
                </p>

              </div>

              <input
                type="password"
                placeholder="Contraseña actual"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 sm:h-14 rounded-2xl border border-gray-200 bg-white/70 px-4 text-sm sm:text-base outline-none transition-all duration-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 hover:border-blue-200"
              />

              <input
                type="password"
                placeholder="Nueva contraseña"
                value={nuevoPassword}
                onChange={(e) => setNuevoPassword(e.target.value)}
                className="w-full h-12 sm:h-14 rounded-2xl border border-gray-200 bg-white/70 px-4 text-sm sm:text-base outline-none transition-all duration-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 hover:border-blue-200"
              />

              <button
                onClick={cambiarPassword}
                disabled={loading}
                className={`
                  w-full h-12 sm:h-14 rounded-2xl text-white font-semibold transition-all duration-200 active:scale-[0.98]
                  ${loading
                    ? "bg-gray-400"
                    : "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-lg shadow-green-200/50 hover:scale-[1.01]"}
                `}
              >
                {loading ? "Aplicando..." : "🔐 Cambiar contraseña"}
              </button>

            </div>

          </div>

        )}

        {/* SERVICIOS */}
        {tab === "servicios" && (

          <ServiciosTab
            servicios={servicios}
            setModalServicio={setModalServicio}
            setServicioEditar={setServicioEditar}
            setServicioAEliminar={setServicioAEliminar}
          />

        )}

        {/* CLIENTES */}
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

      {/* MODAL SERVICIO */}
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