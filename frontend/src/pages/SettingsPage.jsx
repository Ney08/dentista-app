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
import BaseModal from "../components/BaseModal";
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
  
const [modalAbierto, setModalAbierto] =
  useState(false);

const abrirCrear = () => {

  setServicioEditar(null);

  setModalAbierto(true);

};

const cerrarModal = () => {

  setModalAbierto(false);

  setServicioEditar(null);

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

      <div className="
      max-w-[1600px]

      mx-auto

      px-3
      sm:px-4

      space-y-6
    ">

        {/* HEADER */}

        <div className="
        text-center
        space-y-3
        pt-2
      ">

          <h1 className="
          text-4xl
          md:text-5xl

          font-black

          tracking-tight
        ">

            <span className="
            bg-gradient-to-r
            from-slate-800
            to-slate-500

            bg-clip-text
            text-transparent
          ">
              Configuración
            </span>

            <span className="ml-2">
              ⚙️
            </span>

          </h1>

          <div className="
          w-24
          h-1

          mx-auto

          rounded-full

          bg-gradient-to-r
          from-purple-500
          to-indigo-500
        " />

          <p className="
          text-sm
          sm:text-base

          text-gray-500

          font-medium
        ">
            Administra cuenta, seguridad y sistema
          </p>

        </div>

        {/* KPIS */}

        <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-3

        gap-5
      ">

          {/* SERVICIOS */}

          <div className="
          relative
          overflow-hidden

          bg-white/90
          backdrop-blur-xl

          border
          border-white/40

          rounded-[30px]

          p-6

          shadow-[0_10px_30px_rgba(0,0,0,0.06)]

          hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]

          transition-all
          duration-300
        ">

            <div className="
            absolute
            -top-10
            -right-10

            w-40
            h-40

            rounded-full

            bg-indigo-500/10

            blur-3xl
          " />

            <p className="
            text-sm
            text-gray-500
          ">
              🧾 Servicios
            </p>

            <h2 className="
            mt-2

            text-4xl

            font-black

            text-indigo-500
          ">
              {servicios.length}
            </h2>

          </div>

          {/* CLIENTES */}

          <div className="
          relative
          overflow-hidden

          bg-white/90
          backdrop-blur-xl

          border
          border-white/40

          rounded-[30px]

          p-6

          shadow-[0_10px_30px_rgba(0,0,0,0.06)]

          hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]

          transition-all
          duration-300
        ">

            <div className="
            absolute
            -top-10
            -right-10

            w-40
            h-40

            rounded-full

            bg-rose-500/10

            blur-3xl
          " />

            <p className="
            text-sm
            text-gray-500
          ">
              🚫 Clientes inactivos
            </p>

            <h2 className="
            mt-2

            text-4xl

            font-black

            text-rose-500
          ">
              {clientesInactivos.length}
            </h2>

          </div>

          {/* SEGURIDAD */}

          <div className="
          relative
          overflow-hidden

          bg-white/90
          backdrop-blur-xl

          border
          border-white/40

          rounded-[30px]

          p-6

          shadow-[0_10px_30px_rgba(0,0,0,0.06)]

          hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]

          transition-all
          duration-300
        ">

            <div className="
            absolute
            -top-10
            -right-10

            w-40
            h-40

            rounded-full

            bg-emerald-500/10

            blur-3xl
          " />

            <p className="
            text-sm
            text-gray-500
          ">
              🔐 Seguridad
            </p>

            <h2 className="
            mt-2

            text-4xl

            font-black

            text-emerald-500
          ">
              Activa
            </h2>

          </div>

        </div>

        {/* TABS */}

        <div className="
        flex
        overflow-x-auto

        sm:justify-center

        gap-3

        pb-2

        no-scrollbar
      ">

          {["cuenta", "servicios", "clientes"].map((t) => (

            <button
              key={t}
              onClick={() => setTab(t)}
              className={`
              h-12

              px-5

              rounded-[20px]

              whitespace-nowrap

              text-sm
              font-bold

              shrink-0

              transition-all
              duration-300

              border

              ${tab === t
                  ? `
                  bg-gradient-to-r
                  from-indigo-500
                  via-purple-500
                  to-violet-500

                  text-white

                  border-transparent

                  shadow-[0_15px_35px_rgba(99,102,241,0.28)]

                  scale-[1.02]
                `
                  : `
                  bg-white/90
                  backdrop-blur-xl

                  border-white/40

                  text-slate-700

                  hover:bg-white
                `
                }
            `}
            >

              {t === "cuenta" &&
                "👤 Cuenta"}

              {t === "servicios" &&
                "🧾 Servicios"}

              {t === "clientes" &&
                "🚫 Clientes inactivos"}

            </button>

          ))}

        </div>

        {/* CUENTA */}

        {tab === "cuenta" && (

          <div className="
          grid
          grid-cols-1
          xl:grid-cols-2

          gap-6
        ">

            {/* PERFIL */}

            <div className="
            bg-white/90
            backdrop-blur-xl

            border
            border-white/40

            rounded-[34px]

            p-6

            shadow-[0_10px_30px_rgba(0,0,0,0.06)]

            space-y-6
          ">

              {/* HEADER */}

              <div className="
              flex
              items-center
              gap-4
            ">

                <div className="
                w-14
                h-14

                rounded-[22px]

                bg-gradient-to-br
                from-indigo-500
                to-purple-500

                text-white

                flex
                items-center
                justify-center

                text-2xl
              ">
                  👤
                </div>

                <div>

                  <h3 className="
                  text-2xl

                  font-black

                  text-slate-800
                ">
                    Perfil
                  </h3>

                  <p className="
                  text-sm
                  text-gray-500
                ">
                    Configuración de usuario
                  </p>

                </div>

              </div>

              {/* INPUT */}

              <input
                type="text"
                placeholder="Nombre de usuario"

                value={username}

                onChange={(e) =>
                  setUsername(
                    e.target.value
                  )
                }

                className="
                w-full

                h-14

                px-5

                rounded-[22px]

                bg-white

                border
                border-slate-200

                hover:border-indigo-300

                text-slate-700

                shadow-sm

                focus:outline-none

                focus:ring-4
                focus:ring-indigo-500/10

                focus:border-indigo-300

                transition-all
                duration-300
              "
              />

              {/* BUTTON */}

              <button
                onClick={guardarUsuario}
                disabled={loading}
                className={`
                w-full

                h-14

                rounded-[24px]

                text-white

                font-black

                transition-all
                duration-300

                active:scale-[0.98]

                ${loading
                    ? "bg-gray-400"
                    : `
                    bg-gradient-to-r
                    from-indigo-500
                    via-purple-500
                    to-violet-500

                    shadow-[0_15px_35px_rgba(99,102,241,0.28)]

                    hover:scale-[1.01]
                  `
                  }
              `}
              >

                {loading
                  ? "Guardando..."
                  : "💾 Guardar usuario"}

              </button>

            </div>

            {/* PASSWORD */}

            <div className="
            bg-white/90
            backdrop-blur-xl

            border
            border-white/40

            rounded-[34px]

            p-6

            shadow-[0_10px_30px_rgba(0,0,0,0.06)]

            space-y-6
          ">

              {/* HEADER */}

              <div className="
              flex
              items-center
              gap-4
            ">

                <div className="
                w-14
                h-14

                rounded-[22px]

                bg-gradient-to-br
                from-emerald-500
                to-green-500

                text-white

                flex
                items-center
                justify-center

                text-2xl
              ">
                  🔐
                </div>

                <div>

                  <h3 className="
                  text-2xl

                  font-black

                  text-slate-800
                ">
                    Seguridad
                  </h3>

                  <p className="
                  text-sm
                  text-gray-500
                ">
                    Cambiar contraseña
                  </p>

                </div>

              </div>

              {/* INPUTS */}

              <div className="
              space-y-4
            ">

                <input
                  type="password"
                  placeholder="Contraseña actual"

                  value={password}

                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }

                  className="
                  w-full

                  h-14

                  px-5

                  rounded-[22px]

                  bg-white

                  border
                  border-slate-200

                  hover:border-emerald-300

                  text-slate-700

                  shadow-sm

                  focus:outline-none

                  focus:ring-4
                  focus:ring-emerald-500/10

                  focus:border-emerald-300

                  transition-all
                  duration-300
                "
                />

                <input
                  type="password"
                  placeholder="Nueva contraseña"

                  value={nuevoPassword}

                  onChange={(e) =>
                    setNuevoPassword(
                      e.target.value
                    )
                  }

                  className="
                  w-full

                  h-14

                  px-5

                  rounded-[22px]

                  bg-white

                  border
                  border-slate-200

                  hover:border-emerald-300

                  text-slate-700

                  shadow-sm

                  focus:outline-none

                  focus:ring-4
                  focus:ring-emerald-500/10

                  focus:border-emerald-300

                  transition-all
                  duration-300
                "
                />

              </div>

              {/* BUTTON */}

              <button
                onClick={cambiarPassword}
                disabled={loading}
                className={`
                w-full

                h-14

                rounded-[24px]

                text-white

                font-black

                transition-all
                duration-300

                active:scale-[0.98]

                ${loading
                    ? "bg-gray-400"
                    : `
                    bg-gradient-to-r
                    from-emerald-500
                    to-green-500

                    shadow-[0_15px_35px_rgba(16,185,129,0.28)]

                    hover:scale-[1.01]
                  `
                  }
              `}
              >

                {loading
                  ? "Aplicando..."
                  : "🔐 Cambiar contraseña"}

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

      {/* MODALS */}

      {mostrarConfirmacion && (

        <ConfirmModal
          mensaje="¿Seguro que quieres cambiar la contraseña? ⚠️"
          onConfirm={confirmarCambioPassword}
          onCancel={() =>
            setMostrarConfirmacion(false)
          }
        />

      )}

      {servicioAEliminar && (

        <ConfirmModal
          mensaje="¿Eliminar servicio? ⚠️"
          onConfirm={() => {

            eliminarServicio(
              servicioAEliminar.id
            );

            toast.success(
              "Eliminado 🗑️"
            );

            setServicioAEliminar(
              null
            );

          }}
          onCancel={() =>
            setServicioAEliminar(null)
          }
        />

      )}

      {modalServicio && (

        <ServicioModal
          servicio={servicioEditar}
          onGuardar={guardarServicio}
          onClose={() =>
            setModalServicio(false)
          }
        />

      )}

    </PageWrapper>

  );
}

export default SettingsPage;