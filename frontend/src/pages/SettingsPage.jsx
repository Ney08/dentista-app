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

  const [tab, setTab] = useState("usuario");

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
    transition hover:scale-[1.02]
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

      <div className="max-w-3xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Configuración ⚙️</h1>
          <p className="text-gray-500 text-sm">
            Administra tu cuenta y seguridad
          </p>
        </div>

        {/* TABS */}
        <div className="flex gap-2 border-b pb-2 justify-center">
          {["usuario", "seguridad", "servicios", "clientes"].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`
                px-4 py-1.5 rounded-lg text-sm
                ${tab === t
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"}
              `}
            >
              {t === "usuario" && "👤 Usuario"}
              {t === "seguridad" && "🔒 Seguridad"}
              {t === "servicios" && "🧾 Servicios"}
              {t === "clientes" && "🚫 Clientes inactivos"}
            </button>
          ))}
        </div>

        {/* USUARIO */}
        {tab === "usuario" && (
          <div className="bg-white p-6 rounded-xl shadow border space-y-4">

            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
            />

            <button
              onClick={guardarUsuario}
              disabled={loading}
              className={`${btn} ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}`}
            >
              {loading ? "Guardando..." : "💾 Guardar usuario"}
            </button>

          </div>
        )}

        {/* SEGURIDAD */}
        {tab === "seguridad" && (
          <div className="bg-white p-6 rounded-xl shadow border space-y-4">

            <input
              type="password"
              placeholder="Contraseña actual"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />

            <input
              type="password"
              placeholder="Nueva contraseña"
              value={nuevoPassword}
              onChange={(e) => setNuevoPassword(e.target.value)}
              className="input"
            />

            <button
              onClick={cambiarPassword}
              disabled={loading}
              className={`${btn} ${loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"}`}
            >
              {loading ? "Aplicando..." : "🔐 Cambiar contraseña"}
            </button>

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
