import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import useModalStore from "../stores/useModalStore";
import {
  Users,
  UserCheck,
  UserX,
  Search,
  CalendarDays,
  FileText,
  Phone,
  Clock3,
  Plus,
  BarChart3
} from "lucide-react";

import ConfirmModal from "../components/ConfirmModal";
import ClienteForm from "../components/clientes/ClienteForm";
import ClienteList from "../components/clientes/ClienteList";
import ClienteDetalle from "../components/clientes/ClienteDetalle";
import PageWrapper from "../components/PageWrapper";
import Paginacion from "../components/Paginacion";
import BaseModal from "../components/BaseModal";
import SkeletonLoader from "../components/SkeletonLoader";
import { useCitas } from "../hooks/useCitas";
import { useClientes } from "../hooks/useClientes";
import { motion } from "framer-motion";

import {
  showSuccess,
  showError,
  showWarning,
  showInfo
} from "../components/ui/ToastStyles";

function ClientesPage() {

  /*
  ==========================================
  STATES
  ==========================================
  */

  const [mostrarActivos, setMostrarActivos] =
    useState(true);

  const {
    clientes,
    toggleCliente,
    isLoading
  } = useClientes(mostrarActivos);

  /*
  ==========================================
  MODALS
  ==========================================
  */

  const [modalAbierto, setModalAbierto] =
    useState(false);
  const {

    createClienteOpen,

    openCliente,

    closeCliente

  } = useModalStore();

  const [clienteEditar, setClienteEditar] =
    useState(null);

  const [clienteADesactivar, setClienteADesactivar] =
    useState(null);

  /*
  ==========================================
  DETALLE
  ==========================================
  */

  const [clienteSeleccionado, setClienteSeleccionado] =
    useState(null);

  /*
  ==========================================
  FILTROS
  ==========================================
  */

  const [busqueda, setBusqueda] =
    useState("");

  const [orden, setOrden] =
    useState("az");

  const [limite, setLimite] =
    useState(10);

  const [pagina, setPagina] =
    useState(1);

  /*
  ==========================================
  KPIS
  ==========================================
  */

  const clientesActivos =
    clientes.filter(c => c.activo).length;

  const clientesInactivos =
    clientes.filter(c => !c.activo).length;

  const clientesTotales =
    clientes.length;

  const nuevosEsteMes =
    clientes.filter(c => {

      if (!c.created_at) return false;

      const fecha =
        new Date(c.created_at);

      const hoy = new Date();

      return (
        fecha.getMonth() === hoy.getMonth() &&
        fecha.getFullYear() === hoy.getFullYear()
      );

    }).length;

  /*
  ==========================================
  MODAL CLOSE
  ==========================================
  */

  const cerrarModal = () => {

    setModalAbierto(false);

    setClienteEditar(null);

    closeCliente();

  };
  useEffect(() => {

    if (createClienteOpen) {

      setClienteEditar(null);

      setModalAbierto(true);

    }

  }, [createClienteOpen]);
  /*
  ==========================================
  FILTRO
  ==========================================
  */

  const filtrados = clientes.filter(c => {

    const texto = `
      ${c.nombre || ""}
      ${c.apellido || ""}
      ${c.telefono || ""}
      ${c.documento || ""}
    `
      .toLowerCase();

    return texto.includes(
      busqueda.toLowerCase()
    );

  });

  /*
  ==========================================
  ORDEN
  ==========================================
  */

  const ordenados =
    [...filtrados].sort((a, b) => {

      if (orden === "az") {

        return a.nombre.localeCompare(
          b.nombre
        );

      }

      if (orden === "nuevo") {

        return b.id - a.id;

      }

      return 0;

    });

  /*
  ==========================================
  PAGINACION
  ==========================================
  */

  const inicio =
    (pagina - 1) *
    (limite === "all"
      ? ordenados.length
      : limite);

  const fin =
    limite === "all"
      ? undefined
      : inicio + limite;

  const clientesFinal =
    limite === "all"
      ? ordenados
      : ordenados.slice(inicio, fin);

  const totalPaginas =
    limite === "all"
      ? 1
      : Math.ceil(
        ordenados.length / limite
      );

  /*
  ==========================================
  TOGGLE
  ==========================================
  */

  const handleToggleActivo = (cliente) => {

    if (cliente.activo) {

      setClienteADesactivar(cliente);

    } else {

      toggleCliente.mutate(cliente);

      showSuccess(
        "Cliente activado ✅"
      );

    }

  };

  /*
  ==========================================
  EFFECTS
  ==========================================
  */

  const {
    citas = []
  } = useCitas();

  useEffect(() => {

    if (pagina > totalPaginas) {

      setPagina(1);

    }

  }, [ordenados.length]);

  /*
  ==========================================
  LOADING
  ==========================================
  */

  if (isLoading) {

    return (

      <PageWrapper>

        <div className="
          max-w-[1700px]
          mx-auto

          space-y-6
        ">

          <SkeletonLoader alto="h-12" />

          <div className="
            grid
            grid-cols-1
            md:grid-cols-4

            gap-4
          ">

            <SkeletonLoader alto="h-32" />
            <SkeletonLoader alto="h-32" />
            <SkeletonLoader alto="h-32" />
            <SkeletonLoader alto="h-32" />

          </div>

          <SkeletonLoader alto="h-[720px]" />

        </div>

      </PageWrapper>

    );

  }

  return (

    <PageWrapper>
      <motion.div
        key="clientes"

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
        w-full

        max-w-[1700px]

        mx-auto

        space-y-7

        px-3
        sm:px-5
      ">

          {/* HEADER */}

          <div className="
          flex
          flex-col
          md:flex-row

          md:items-center
          md:justify-between

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
 

bg-sky-500/10
border
border-sky-100
text-sky-800


  text-sm
  font-semibold
  mb-4
">
                <Users size={18} />
                CRM clínico
              </div>

              <h1 className="
              text-3xl
              md:text-4xl

              font-black

              tracking-tight

              text-slate-800
            ">

                Pacientes registrados

              </h1>

              <p className="
              mt-2

              text-sm
              sm:text-base

              text-slate-500
            ">
                Gestión clínica y seguimiento de pacientes
              </p>

            </div>

            {/* RIGHT */}

            <div className="
            self-start
            md:self-auto

            bg-white/90
            backdrop-blur-md

            border
            border-slate-200/80

            rounded-[28px]

            px-5
            py-4

            shadow-[0_10px_30px_rgba(0,0,0,0.05)]

            min-w-[230px]
          ">

              <p className="
              text-xs

              uppercase

              tracking-[0.14em]

              font-black

              text-slate-400
            ">
                Nuevos este mes
              </p>

              <div className="
              mt-2

              flex
              items-center
              justify-between
            ">

                <h3 className="
                text-3xl

                font-black
text-sky-800
              ">
                  {nuevosEsteMes}
                </h3>

                <div className="
                w-12
                h-12

                rounded-2xl

                
bg-gradient-to-br
from-sky-700
to-sky-900


                text-white

                flex
                items-center
                justify-center
              ">

                  <BarChart3 size={20} />

                </div>

              </div>

            </div>

          </div>

          {/* KPIS */}

          <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4

          gap-5
        ">

            {/* TOTAL */}

            <div className="
            bg-white/95
            backdrop-blur-md

            border
            border-slate-200/80

            rounded-[30px]

            p-5

            shadow-[0_10px_30px_rgba(0,0,0,0.05)]

            hover:-translate-y-[2px]

            transition-all
            duration-300
          ">

              <div className="
              flex
              items-start
              justify-between
            ">

                <div>

                  <p className="
                  text-sm

                  text-slate-500
                ">
                    Pacientes totales
                  </p>

                  <h2 className="
                  mt-2

                  text-3xl

                  font-black

                   text-cyan-500
                ">
                    {clientesTotales}
                  </h2>

                  <p className="
                  mt-2

                  text-xs

                  font-semibold

                 text-cyan-500
                ">
                    CRM clínico
                  </p>

                </div>

                <div className="
                w-12
                h-12

                rounded-[18px]

               
bg-cyan-500/10
text-cyan-600


                flex
                items-center
                justify-center
              ">

                  <Users size={20} />

                </div>

              </div>

            </div>

            {/* ACTIVOS */}

            <div className="
            bg-white/95
            backdrop-blur-md

            border
            border-slate-200/80

            rounded-[30px]

            p-5

            shadow-[0_10px_30px_rgba(0,0,0,0.05)]

            hover:-translate-y-[2px]

            transition-all
            duration-300
          ">

              <div className="
              flex
              items-start
              justify-between
            ">

                <div>

                  <p className="
                  text-sm

                  text-slate-500
                ">
                    Pacientes activos
                  </p>

                  <h2 className="
                  mt-2

                  text-3xl

                  font-black

                  text-emerald-600
                ">
                    {clientesActivos}
                  </h2>

                  <p className="
                  mt-2

                  text-xs

                  font-semibold

                  text-emerald-500
                ">
                    +12% este mes
                  </p>

                </div>

                <div className="
                w-12
                h-12

                rounded-[18px]

                bg-emerald-500/10

                text-emerald-600

                flex
                items-center
                justify-center
              ">

                  <UserCheck size={20} />

                </div>

              </div>

            </div>

            {/* INACTIVOS */}

            <div className="
            bg-white/95
            backdrop-blur-md

            border
            border-slate-200/80

            rounded-[30px]

            p-5

            shadow-[0_10px_30px_rgba(0,0,0,0.05)]

            hover:-translate-y-[2px]

            transition-all
            duration-300
          ">

              <div className="
              flex
              items-start
              justify-between
            ">

                <div>

                  <p className="
                  text-sm

                  text-slate-500
                ">
                    Pacientes inactivos
                  </p>

                  <h2 className="
                  mt-2

                  text-3xl

                  font-black

                  text-rose-500
                ">
                    {clientesInactivos}
                  </h2>

                  <p className="
                  mt-2

                  text-xs

                  font-semibold

                  text-rose-500
                ">
                    Requieren seguimiento
                  </p>

                </div>

                <div className="
                w-12
                h-12

                rounded-[18px]

                bg-rose-500/10

                text-rose-500

                flex
                items-center
                justify-center
              ">

                  <UserX size={20} />

                </div>

              </div>

            </div>

            {/* NUEVOS */}

            <div
              onClick={() => {

                setOrden("nuevo");

                setPagina(1);

                showSuccess(
                  "Mostrando pacientes recientes ✨"
                );

              }}
              className="
              relative
              overflow-hidden

             
bg-gradient-to-br
from-cyan-500
via-teal-500
to-emerald-500


              rounded-[30px]

              p-5

              shadow-[0_20px_50px_rgba(7,89,133,0.25)]

              text-white

              cursor-pointer

              hover:scale-[1.02]
              hover:-translate-y-[2px]

              transition-all
              duration-300
            "
            >

              <div className="
              absolute
              -top-10
              -right-10

              w-40
              h-40

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

                  text-cyan-50
                ">
                    Nuevos pacientes
                  </p>

                  <h2 className="
                  mt-2

                  text-3xl

                  font-black
                ">
                    {nuevosEsteMes}
                  </h2>

                  <p className="
                  mt-2

                  text-xs

                  font-semibold

                  text-cyan-50
                ">
                    Últimos 30 días
                  </p>

                  <div className="
                  mt-4

                  inline-flex

                  items-center
                  gap-2

                  px-3
                  py-1.5

                  rounded-full

                  bg-white/15

                  text-xs
                  font-semibold
                ">

                    <CalendarDays size={12} />

                    Ver recientes

                  </div>

                </div>

                <div className="
                w-12
                h-12

                rounded-[18px]

                bg-white/15

                flex
                items-center
                justify-center
              ">

                  <Plus size={20} />

                </div>

              </div>

            </div>

          </div>

          {/* MAIN CARD */}

          <div className="
          bg-white/95
          backdrop-blur-md

          border
          border-slate-200/80

          rounded-[36px]

          shadow-[0_10px_30px_rgba(0,0,0,0.05)]

          h-[760px]

          p-5
          sm:p-6

          flex
          flex-col

          gap-5

          overflow-hidden
        ">

            {/* TOOLBAR */}

            <div className="
            flex
            flex-col
            xl:flex-row

            xl:items-center
            xl:justify-between

            gap-4
          ">

              {/* FILTERS */}

              <div className="
              flex
              items-center
              gap-3

              flex-wrap
            ">

                <button
                  onClick={() =>
                    setMostrarActivos(true)
                  }
                  className={`
                  h-11
                  px-5

                  rounded-2xl

                  text-sm
                  font-bold

                  transition-all
                  duration-300

                  ${mostrarActivos
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"}
                `}
                >
                  Activos
                </button>

                <button
                  onClick={() =>
                    setMostrarActivos(false)
                  }
                  className={`
                  h-11
                  px-5

                  rounded-2xl

                  text-sm
                  font-bold

                  transition-all
                  duration-300

                  ${!mostrarActivos
                      ? "bg-rose-100 text-rose-700"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"}
                `}
                >
                  Inactivos
                </button>

              </div>

              {/* BUTTON */}

              <button
                onClick={() => {

                  setClienteEditar(null);

                  openCliente();

                }}
                className="
                group

                relative
                overflow-hidden

                h-12

                min-w-[180px]

                px-6

                rounded-2xl

                
bg-gradient-to-r
from-sky-700
via-sky-800
to-sky-900


                text-white

                font-black

                
shadow-[0_15px_35px_rgba(7,89,133,0.28)]

hover:shadow-[0_20px_45px_rgba(7,89,133,0.35)]


                hover:-translate-y-[2px]

                active:scale-95

                transition-all
                duration-300

                flex
                items-center
                justify-center
                gap-2
              "
              >

                <Plus
                  size={18}
                  className="
                  group-hover:rotate-90

                  transition-all
                  duration-300
                "
                />

                Nuevo paciente

              </button>

            </div>

            {/* SEARCH */}

            <div className="
            flex
            flex-col
            xl:flex-row

            gap-4
          ">

              <div className="
              relative
              flex-1
            ">

                <Search
                  size={18}
                  className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2

                  text-slate-400
                "
                />

                <input
                  type="text"
                  placeholder="Buscar por nombre, teléfono o documento..."
                  value={busqueda}
                  onChange={(e) => {

                    setBusqueda(
                      e.target.value
                    );

                    setPagina(1);

                  }}
                  className="
                  w-full

                  h-14

                  pl-12
                  pr-4

                  rounded-[22px]

                  bg-white/90

                  border
                  border-slate-200/80

                  shadow-sm

                  focus:outline-none

                  focus:ring-4
                  
focus:ring-sky-500/10

focus:border-sky-300


                  transition-all
                  duration-300
                "
                />

              </div>

              <div className="
              flex
              gap-3
            ">

                <select
                  value={orden}
                  onChange={(e) =>
                    setOrden(
                      e.target.value
                    )
                  }
                  className="
                  h-14

                  px-4

                  rounded-[22px]

                  bg-white/90

                  border
                  border-slate-200/80

                  shadow-sm

                  focus:outline-none

                  focus:ring-4
                  focus:ring-sky-500/10
                "
                >

                  <option value="az">
                    A-Z
                  </option>

                  <option value="nuevo">
                    Más recientes
                  </option>

                </select>

                <select
                  value={limite}
                  onChange={(e) => {

                    const val =
                      e.target.value === "all"
                        ? "all"
                        : parseInt(
                          e.target.value
                        );

                    setLimite(val);

                    setPagina(1);

                  }}
                  className="
                  h-14

                  px-4

                  rounded-[22px]

                  bg-white/90

                  border
                  border-slate-200/80

                  shadow-sm

                  focus:outline-none

                  focus:ring-4
                  focus:ring-sky-500/10
                "
                >

                  <option value={10}>
                    10
                  </option>

                  <option value={20}>
                    20
                  </option>

                  <option value={30}>
                    30
                  </option>

                  <option value="all">
                    Todos
                  </option>

                </select>

              </div>

            </div>

            {/* LIST */}

            <div className={`
            flex-1
            min-h-0

            overflow-x-hidden

            pr-1

            ${clientesFinal.length > 3
                ? `
                overflow-y-auto

                scrollbar-thin
                scrollbar-thumb-sky-200
                scrollbar-track-transparent
              `
                : "overflow-y-hidden"}
          `}>

              {clientesFinal.length === 0 ? (

                <div className="
                h-full

                flex
                flex-col

                items-center
                justify-center

                text-center
              ">

                  <div className="
                  w-24
                  h-24

                  rounded-[30px]

                  
bg-gradient-to-br
from-sky-700
to-sky-900


                  flex
                  items-center
                  justify-center

                  text-white

                  shadow-[0_20px_50px_rgba(7,89,133,0.35)]
                ">

                    <Users size={42} />

                  </div>

                  <h3 className="
                  mt-6

                  text-2xl

                  font-black

                  text-slate-800
                ">
                    No hay pacientes
                  </h3>

                  <p className="
                  mt-2

                  text-slate-500
                ">
                    Los pacientes registrados aparecerán aquí
                  </p>

                  <button
                    onClick={() => {

                      setClienteEditar(null);

                      openCliente();

                    }}
                    className="
                    mt-6

                    h-12

                    px-6

                    rounded-2xl

                    
bg-gradient-to-r
from-sky-700
to-sky-900


                    text-white

                    font-bold

                    shadow-[0_15px_35px_rgba(7,89,133,0.25)]
                  "
                  >
                    Crear primer paciente
                  </button>

                </div>

              ) : (


                <ClienteList
                  clientes={clientesFinal}
                  citas={citas}
                  onToggleActivo={handleToggleActivo}

                  onEditarClick={(c) => {

                    setClienteEditar(c);

                    setModalAbierto(true);

                  }}

                  onSeleccionar={(c) =>
                    setClienteSeleccionado(c)
                  }
                />

              )}

            </div>

            {/* PAGINACION */}

            {limite !== "all" &&
              totalPaginas > 1 && (

                <div className="
                pt-4

                border-t
                border-slate-100

                flex
                justify-center

                shrink-0
              ">

                  <div className="
                  bg-white

                  border
                  border-slate-200/70

                  rounded-[24px]

                  p-2

                  shadow-sm
                ">

                    <Paginacion
                      pagina={pagina}
                      totalPaginas={totalPaginas}
                      onChange={setPagina}
                    />

                  </div>

                </div>

              )}

          </div>

          {/* DETALLE */}

          {clienteSeleccionado && (

            <BaseModal
              onClose={() =>
                setClienteSeleccionado(null)
              }
              maxWidth="max-w-7xl"
            >

              <div className="space-y-5">

                <div className="
                flex
                items-center
                justify-between

                gap-4
              ">

                  <div className="
                  flex
                  items-center
                  gap-4
                ">

                    <div className="
                    relative

                    w-16
                    h-16

                    rounded-[24px]

                    
bg-gradient-to-br
from-sky-700
to-sky-900


                    text-white

                    flex
                    items-center
                    justify-center

                    text-2xl
                    font-black

                    ring-4
                    ring-white
shadow-[0_15px_35px_rgba(7,89,133,0.25)]
                  ">

                      {clienteSeleccionado.nombre
                        ?.charAt(0)
                        ?.toUpperCase()}

                    </div>

                    <div>

                      <h3 className="
                      text-2xl

                      font-black

                      text-slate-800
                    ">
                        {clienteSeleccionado.nombre}{" "}
                        {clienteSeleccionado.apellido}
                      </h3>

                      <p className="
                      mt-1

                      text-sm

                      text-slate-500
                    ">
                        Perfil clínico del paciente
                      </p>

                    </div>

                  </div>

                  <button
                    onClick={() =>
                      setClienteSeleccionado(null)
                    }
                    className="
                    w-10
                    h-10

                    rounded-xl

                    bg-slate-100

                    hover:bg-slate-200

                    transition-all
                    duration-300
                  "
                  >
                    ✕
                  </button>

                </div>

                <div className="
                border-t
                border-slate-100
              " />

                <div className="
                max-h-[70vh]

                overflow-y-auto

                pr-1
              ">

                  <ClienteDetalle
                    cliente={clienteSeleccionado}

                  />

                </div>

              </div>

            </BaseModal>

          )}

        </div>

        {/* FORM MODAL */}

        {modalAbierto && (

          <BaseModal
            onClose={cerrarModal}
          >

            <ClienteForm
              cliente={clienteEditar}
              onClose={cerrarModal}
            />

          </BaseModal>

        )}

        {/* CONFIRM */}

        {clienteADesactivar && (

          <ConfirmModal
            mensaje={`¿Desactivar a ${clienteADesactivar.nombre}?`}
            onCancel={() =>
              setClienteADesactivar(null)
            }
            onConfirm={() => {

              toggleCliente.mutate(
                clienteADesactivar
              );

              setClienteADesactivar(null);

              showSuccess(
                "Cliente actualizado ✅"
              );

            }}
          />

        )}
      </motion.div>
    </PageWrapper>

  );

}

export default ClientesPage;