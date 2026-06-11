import { useState } from "react";

import {
  Settings2,
  ShieldCheck,
  User2,
  LockKeyhole,
  FolderCog,
  Users,
  Save
} from "lucide-react";
import { motion } from "framer-motion";
import PageWrapper from "../components/PageWrapper";
import ConfirmModal from "../components/ConfirmModal";
import ServicioModal from "../components/ServicioModal";

import toast from "react-hot-toast";

import {
  showSuccess,
  showError,
  showWarning,
  showInfo
} from "../components/ui/ToastStyles";

import { useUser } from "../hooks/useUser";
import { useServicios } from "../hooks/useServicios";
import { useClientes } from "../hooks/useClientes";

import ClientesInactivosTab from "../components/settings/ClientesInactivosTab";
import ServiciosTab from "../components/settings/ServiciosTab";

function SettingsPage() {

  const { updateUser } =
    useUser();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [nuevoPassword, setNuevoPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [
    mostrarConfirmacion,
    setMostrarConfirmacion
  ] = useState(false);

  const [tab, setTab] =
    useState("cuenta");

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

  const [
    servicioAEliminar,
    setServicioAEliminar
  ] = useState(null);

  const [
    modalServicio,
    setModalServicio
  ] = useState(false);

  const [
    servicioEditar,
    setServicioEditar
  ] = useState(null);

  const USER_ID = 1;

  /*
  ==========================================
  USER
  ==========================================
  */

  const guardarUsuario = async () => {

    if (!username.trim()) {

      return showError(
        "Usuario vacío ❌"
      );

    }

    try {

      setLoading(true);

      await updateUser(
        USER_ID,
        username,
        password || "temp1234"
      );

      showSuccess(
        "Usuario actualizado ✅"
      );

      setPassword("");

    } catch (error) {

      showError(error.message);

    } finally {

      setLoading(false);

    }

  };

  /*
  ==========================================
  PASSWORD
  ==========================================
  */

  const cambiarPassword = () => {

    if (
      !password ||
      !nuevoPassword
    ) {

      return showError(
        "Completa los campos ❌"
      );

    }

    if (
      nuevoPassword.length < 6
    ) {

      return showError(
        "Mínimo 6 caracteres ⚠️"
      );

    }

    setMostrarConfirmacion(true);

  };

  const confirmarCambioPassword =
    async () => {

      try {

        setLoading(true);

        await updateUser(
          USER_ID,
          username,
          nuevoPassword
        );

        showSuccess(
          "Contraseña actualizada 🔒"
        );

        setPassword("");

        setNuevoPassword("");

        setMostrarConfirmacion(false);

      } catch (error) {

        showError(error.message);

      } finally {

        setLoading(false);

      }

    };

  /*
  ==========================================
  SERVICIOS
  ==========================================
  */

  const guardarServicio =
    async (data) => {

      if (!data.nombre.trim()) {

        return showError(
          "Nombre requerido ❌"
        );

      }

      if (!data.precio) {

        return showError(
          "Precio requerido ⚠️"
        );

      }

      try {

        if (data.id) {

          await actualizarServicio.mutateAsync({

            id:
              data.id,

            nombre:
              data.nombre,

            descripcion:
              data.descripcion,

            precio:
              parseFloat(
                data.precio
              ),

            costo_servicio:
              parseFloat(
                data.costo_servicio || 0
              )

          });

          showSuccess(
            "Servicio actualizado ✏️"
          );

        } else {

          await agregarServicio.mutateAsync({

            nombre:
              data.nombre,

            descripcion:
              data.descripcion,

            precio:
              parseFloat(
                data.precio
              ),

            costo_servicio:
              parseFloat(
                data.costo_servicio || 0
              )

          });

          showSuccess(
            "Servicio agregado ✅"
          );

        }

        setModalServicio(false);

        setServicioEditar(null);

      } catch {

        showError(
          "Error ❌"
        );

      }

    };

  /*
  ==========================================
  LOADING
  ==========================================
  */

  if (
    clientesLoading ||
    serviciosLoading
  ) {

    return (

      <PageWrapper>

        <div className="
          max-w-7xl
          mx-auto

          space-y-6
        ">

          <div className="
            h-14

            rounded-3xl

            bg-slate-200

            animate-pulse
          " />

          <div className="
            grid
            grid-cols-1
            md:grid-cols-3

            gap-5
          ">

            <div className="
              h-32

              rounded-3xl

              bg-slate-200

              animate-pulse
            " />

            <div className="
              h-32

              rounded-3xl

              bg-slate-200

              animate-pulse
            " />

            <div className="
              h-32

              rounded-3xl

              bg-slate-200

              animate-pulse
            " />

          </div>

        </div>

      </PageWrapper>

    );

  }

  return (

    <PageWrapper>
      <motion.div
        key="settings"

        initial={{
          opacity: 0,
          y: 10
        }}

        animate={{
          opacity: 1,
          y: 0
        }}

        exit={{
          opacity: 0,
          y: -10
        }}

        transition={{
          duration: 0.25
        }}
      >
      <div className="
        max-w-[1600px]

        mx-auto

        px-3
        sm:px-5

        pb-5

        space-y-7
      ">

        {/* HEADER */}

        <div className="
          flex
          flex-col
          xl:flex-row

          xl:items-center
          xl:justify-between

          gap-5
        ">

          {/* LEFT */}

          <div>

            <div className="
              inline-flex

              items-center
              gap-2

              px-4
              py-2

              rounded-full

              bg-indigo-500/10

              border
              border-indigo-100

              text-indigo-600

              text-sm
              font-semibold

              mb-4
            ">

              <Settings2 size={14} />

              Administración del sistema

            </div>

            <h1 className="
              text-3xl
              md:text-4xl

              font-black

              tracking-tight

              text-slate-800
            ">

              Configuración

            </h1>

            <p className="
              mt-2

              text-sm
              sm:text-base

              text-slate-500
            ">

              Gestiona usuarios, seguridad y servicios clínicos

            </p>

          </div>

          {/* STATUS */}

          <div className="
            bg-white/95
            backdrop-blur-md

            border
            border-slate-200/80

            rounded-[30px]

            px-6
            py-5

            shadow-[0_10px_30px_rgba(0,0,0,0.05)]

            min-w-[260px]
          ">

            <p className="
              text-xs

              uppercase

              tracking-[0.14em]

              font-black

              text-slate-400
            ">
              Estado sistema
            </p>

            <div className="
              mt-3

              flex
              items-center
              justify-between
            ">

              <div>

                <h3 className="
                  text-3xl

                  font-black

                  text-emerald-600
                ">

                  Activo

                </h3>

                <p className="
                  mt-1

                  text-xs

                  font-semibold

                  text-emerald-500
                ">

                  Seguridad operativa

                </p>

              </div>

              <div className="
                w-14
                h-14

                rounded-[20px]

                bg-gradient-to-br
                from-emerald-500
                to-green-500

                text-white

                flex
                items-center
                justify-center
              ">

                <ShieldCheck size={22} />

              </div>

            </div>

          </div>

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

            bg-white/95
            backdrop-blur-md

            border
            border-slate-200/80

            rounded-[30px]

            p-6

            shadow-[0_10px_30px_rgba(0,0,0,0.05)]
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

            <div className="
              relative
              z-10

              flex
              items-start
              justify-between
            ">

              <div>

                <p className="
                  text-sm

                  text-slate-500

                  flex
                  items-center
                  gap-2
                ">

                  <FolderCog size={14} />

                  Servicios clínicos

                </p>

                <h2 className="
                  mt-2

                  text-4xl

                  font-black

                  text-indigo-600
                ">

                  {servicios.length}

                </h2>

              </div>

              <div className="
                w-12
                h-12

                rounded-2xl

                bg-indigo-50

                text-indigo-500

                flex
                items-center
                justify-center
              ">

                <FolderCog size={20} />

              </div>

            </div>

          </div>

          {/* CLIENTES */}

          <div className="
            relative
            overflow-hidden

            bg-white/95
            backdrop-blur-md

            border
            border-slate-200/80

            rounded-[30px]

            p-6

            shadow-[0_10px_30px_rgba(0,0,0,0.05)]
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

            <div className="
              relative
              z-10

              flex
              items-start
              justify-between
            ">

              <div>

                <p className="
                  text-sm

                  text-slate-500

                  flex
                  items-center
                  gap-2
                ">

                  <Users size={14} />

                  Clientes inactivos

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

              <div className="
                w-12
                h-12

                rounded-2xl

                bg-rose-50

                text-rose-500

                flex
                items-center
                justify-center
              ">

                <Users size={20} />

              </div>

            </div>

          </div>

          {/* SEGURIDAD */}

          <div className="
            relative
            overflow-hidden

            bg-gradient-to-br
            from-indigo-500
            via-purple-500
            to-violet-500

            rounded-[30px]

            p-6

            text-white

            shadow-[0_20px_50px_rgba(99,102,241,0.28)]
          ">

            <div className="
              absolute
              -top-10
              -right-10

              w-48
              h-48

              rounded-full

              bg-white/10

              blur-3xl
            " />

            <div className="
              relative
              z-10

              flex
              items-start
              justify-between
            ">

              <div>

                <p className="
                  text-sm

                  text-white/70

                  flex
                  items-center
                  gap-2
                ">

                  <ShieldCheck size={14} />

                  Seguridad

                </p>

                <h2 className="
                  mt-2

                  text-4xl

                  font-black
                ">

                  Activa

                </h2>

              </div>

              <div className="
                w-12
                h-12

                rounded-2xl

                bg-white/15

                flex
                items-center
                justify-center
              ">

                <ShieldCheck size={20} />

              </div>

            </div>

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
              onClick={() =>
                setTab(t)
              }
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

                flex
                items-center
                gap-2

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

              {t === "cuenta" && (
                <>
                  <User2 size={14} />
                  Cuenta
                </>
              )}

              {t === "servicios" && (
                <>
                  <FolderCog size={14} />
                  Servicios
                </>
              )}

              {t === "clientes" && (
                <>
                  <Users size={14} />
                  Clientes inactivos
                </>
              )}

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
              bg-white/95
              backdrop-blur-md

              border
              border-slate-200/80

              rounded-[34px]

              p-6

              shadow-[0_10px_30px_rgba(0,0,0,0.05)]

              space-y-6
            ">

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
                  via-purple-500
                  to-violet-500

                  text-white

                  flex
                  items-center
                  justify-center
                ">

                  <User2 size={26} />

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

                    text-slate-500
                  ">

                    Configuración de usuario

                  </p>

                </div>

              </div>

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

              <button
                onClick={guardarUsuario}
                disabled={loading}
                className={`
                  w-full

                  h-14

                  rounded-[24px]

                  text-white

                  font-black

                  flex
                  items-center
                  justify-center
                  gap-2

                  transition-all
                  duration-300

                  ${loading
                    ? "bg-gray-400"
                    : `
                      bg-gradient-to-r
                      from-indigo-500
                      via-purple-500
                      to-violet-500
                    `
                  }
                `}
              >

                <Save size={18} />

                {loading
                  ? "Guardando..."
                  : "Guardar usuario"}

              </button>

            </div>

            {/* PASSWORD */}

            <div className="
              bg-white/95
              backdrop-blur-md

              border
              border-slate-200/80

              rounded-[34px]

              p-6

              shadow-[0_10px_30px_rgba(0,0,0,0.05)]

              space-y-6
            ">

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
                ">

                  <LockKeyhole size={26} />

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

                    text-slate-500
                  ">

                    Cambiar contraseña

                  </p>

                </div>

              </div>

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

              <button
                onClick={cambiarPassword}
                disabled={loading}
                className={`
                  w-full

                  h-14

                  rounded-[24px]

                  text-white

                  font-black

                  flex
                  items-center
                  justify-center
                  gap-2

                  transition-all
                  duration-300

                  ${loading
                    ? "bg-gray-400"
                    : `
                      bg-gradient-to-r
                      from-emerald-500
                      to-green-500
                    `
                  }
                `}
              >

                <ShieldCheck size={18} />

                {loading
                  ? "Aplicando..."
                  : "Cambiar contraseña"}

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
          mensaje="¿Seguro que quieres cambiar la contraseña?"
          onConfirm={confirmarCambioPassword}
          onCancel={() =>
            setMostrarConfirmacion(false)
          }
        />

      )}

      {servicioAEliminar && (

        <ConfirmModal
          mensaje="¿Eliminar servicio?"
          onConfirm={() => {

            eliminarServicio(
              servicioAEliminar.id
            );

            showSuccess(
              "Eliminado 🗑️"
            );

            setServicioAEliminar(null);

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
      </motion.div>
    </PageWrapper>

  );

}

export default SettingsPage;