import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import ConfirmModal from "../components/ConfirmModal";
import ClienteForm from "../components/clientes/ClienteForm";
import ClienteList from "../components/clientes/ClienteList";
import ClienteDetalle from "../components/clientes/ClienteDetalle";
import PageWrapper from "../components/PageWrapper";
import Paginacion from "../components/Paginacion";
import BaseModal from "../components/BaseModal";
import SkeletonLoader from "../components/SkeletonLoader";

import { useClientes } from "../hooks/useClientes";

function ClientesPage() {

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
    useState(3);

  const [pagina, setPagina] =
    useState(1);
  const glassInner = `
  bg-white/70
  backdrop-blur-xl

  border
  border-white/50

  shadow-[0_8px_25px_rgba(0,0,0,0.05)]

  hover:border-indigo-200

  transition-all
  duration-300
`;
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

  /*
  ==========================================
  MODAL CLOSE
  ==========================================
  */

  const cerrarModal = () => {

    setModalAbierto(false);

    setClienteEditar(null);

  };

  /*
  ==========================================
  FILTRO
  ==========================================
  */

  const filtrados = clientes.filter(c =>

    `${c.nombre} ${c.apellido || ""}`
      .toLowerCase()
      .includes(
        busqueda.toLowerCase()
      )

  );

  /*
  ==========================================
  ORDEN
  ==========================================
  */

  const ordenados = [...filtrados].sort((a, b) => {

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
  TOGGLE ACTIVO
  ==========================================
  */

  const handleToggleActivo = (cliente) => {

    if (cliente.activo) {

      setClienteADesactivar(cliente);

    } else {

      toggleCliente.mutate(cliente);

      toast.success(
        "Cliente activado ✅"
      );

    }

  };

  /*
  ==========================================
  EFFECTS
  ==========================================
  */

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
          max-w-6xl
          mx-auto
          space-y-6
        ">

          <SkeletonLoader alto="h-12" />

          <div className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-4
          ">

            <SkeletonLoader alto="h-32" />
            <SkeletonLoader alto="h-32" />
            <SkeletonLoader alto="h-32" />

          </div>

          <SkeletonLoader alto="h-[500px]" />

        </div>

      </PageWrapper>

    );

  }

  return (

    <PageWrapper>

      <div className="
        h-full
        max-w-7xl
        mx-auto

        flex
        flex-col

        gap-6

        pb-4

        overflow-hidden
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
              Clientes
            </span>

            <span className="ml-2">
              👤
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
            Gestiona los clientes del sistema
          </p>

        </div>

        {/* KPIS */}

        <div className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-5
        ">

          {/* TOTAL */}

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
              👥 Clientes totales
            </p>

            <h2 className="
              mt-2
              text-4xl
              font-black
              text-slate-800
            ">
              {clientesTotales}
            </h2>

          </div>

          {/* ACTIVOS */}

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
              ✅ Clientes activos
            </p>

            <h2 className="
              mt-2
              text-4xl
              font-black
              text-emerald-600
            ">
              {clientesActivos}
            </h2>

          </div>

          {/* INACTIVOS */}

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
              {clientesInactivos}
            </h2>

          </div>

        </div>

        {/* MAIN CARD */}

        <div className="
          bg-white/90
          backdrop-blur-xl

          border
          border-white/40

          rounded-[34px]

          shadow-[0_10px_30px_rgba(0,0,0,0.06)]

          flex
          flex-col

          h-[72vh]
          sm:h-[75vh]
          lg:h-[78vh]

          p-5
          sm:p-6

          gap-5

          overflow-hidden
        ">

          {/* TOOLBAR */}

          <div className="
            flex
            flex-col
            lg:flex-row

            lg:items-center
            lg:justify-between

            gap-4
          ">

            {/* LEFT */}

            <div className="
              flex
              items-center
              gap-3
              flex-wrap
            ">

              {/* <div className="
                px-4
                h-11

                rounded-2xl

                bg-gradient-to-r
                from-indigo-50
                to-purple-50

                border
                border-indigo-100

                flex
                items-center

                text-sm
                font-semibold

                text-indigo-600
              ">
                {clientes.length} clientes registrados
              </div> */}

              <button
                onClick={() =>
                  setMostrarActivos(
                    !mostrarActivos
                  )
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
                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }
                `}
              >
                {mostrarActivos
                  ? "Mostrando activos"
                  : "Mostrando inactivos"}
              </button>

            </div>

            {/* NUEVO */}

            <button
              onClick={() => {

                setClienteEditar(null);

                setModalAbierto(true);

              }}
              className="
                h-12

                px-6

                rounded-2xl

                bg-gradient-to-r
                from-indigo-500
                via-purple-500
                to-violet-500

                text-white

                font-bold

                shadow-[0_15px_35px_rgba(99,102,241,0.28)]

                hover:scale-[1.02]

                active:scale-95

                transition-all
                duration-300
              "
            >
              + Nuevo cliente
            </button>

          </div>

          {/* BUSCADOR */}

          <div className="
            flex
            flex-col
            xl:flex-row

            gap-4
          ">

            {/* SEARCH */}

            <div className="
              relative
              flex-1
            ">

              <span className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2

                text-gray-400
              ">
                🔍
              </span>

              <input
                type="text"
                placeholder="Buscar cliente..."
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

                  bg-white/80
                  backdrop-blur-xl

                  border
                  border-white/40

                  shadow-sm

                  focus:outline-none

                  focus:ring-4
                  focus:ring-indigo-500/10

                  focus:border-indigo-300

                  transition-all
                  duration-300
                "
              />

            </div>

            {/* FILTERS */}

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

                  bg-white/80

                  border
                  border-white/40

                  shadow-sm

                  focus:outline-none

                  focus:ring-4
                  focus:ring-indigo-500/10
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

                  bg-white/80

                  border
                  border-white/40

                  shadow-sm

                  focus:outline-none

                  focus:ring-4
                  focus:ring-indigo-500/10
                "
              >
                <option value={6}>
                  6
                </option>

                <option value={12}>
                  12
                </option>

                <option value={24}>
                  24
                </option>

                <option value="all">
                  Todos
                </option>

              </select>

            </div>

          </div>

          {/* LIST */}

          <div className="
            flex-1
            min-h-0

            overflow-y-auto
            overflow-x-hidden

            pr-1
          ">

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
                  from-indigo-500
                  to-purple-500

                  flex
                  items-center
                  justify-center

                  text-5xl

                  shadow-[0_20px_50px_rgba(99,102,241,0.35)]
                ">
                  👥
                </div>

                <h3 className="
                  mt-6

                  text-2xl

                  font-black

                  text-slate-800
                ">
                  No hay clientes
                </h3>

                <p className="
                  mt-2

                  text-gray-500
                ">
                  Los clientes aparecerán aquí
                </p>

              </div>

            ) : (

              <ClienteList
                clientes={clientesFinal}
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
                border-gray-100

                flex
                justify-center
              ">

                <Paginacion
                  pagina={pagina}
                  totalPaginas={totalPaginas}
                  onChange={setPagina}
                />

              </div>

            )}

        </div>

        {/* DETALLE */}

        {clienteSeleccionado && (

          <BaseModal
            onClose={() =>
              setClienteSeleccionado(null)
            }
          >

            <div className="space-y-5">

              {/* HEADER */}

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
                    w-14
                    h-14

                    rounded-[20px]

                    bg-gradient-to-br
                    from-indigo-500
                    to-purple-500

                    text-white

                    flex
                    items-center
                    justify-center

                    text-xl
                    font-black
                  ">
                    {clienteSeleccionado.nombre?.charAt(0)?.toUpperCase()}
                  </div>

                  <div>

                    <h3 className="
                      text-xl
                      font-black
                      text-slate-800
                    ">
                      {clienteSeleccionado.nombre}
                      {" "}
                      {clienteSeleccionado.apellido}
                    </h3>

                    <p className="
                      text-sm
                      text-gray-500
                    ">
                      Historial clínico del paciente
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

              {/* DIVIDER */}

              <div className="
                border-t
                border-gray-100
              " />

              {/* CONTENT */}

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

            toast.success(
              "Cliente actualizado ✅"
            );

          }}
        />

      )}

    </PageWrapper>
  );

}

export default ClientesPage;