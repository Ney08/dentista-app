import { useState, useEffect, useRef } from "react";

import toast from "react-hot-toast";

import { formatFecha } from "../utils/fecha";
import { formatMoney } from "../utils/format";

import { useClientes } from "../hooks/useClientes";
import { useIngresos } from "../hooks/useIngresos";
import { useCitas } from "../hooks/useCitas";

import IngresoList from "../components/facturas/IngresoList";
import FacturaModal from "../components/facturas/FacturaModal";
import IngresoForm from "../components/facturas/IngresoForm";

import BaseModal from "../components/BaseModal";
import PageWrapper from "../components/PageWrapper";
import Paginacion from "../components/Paginacion";
import SkeletonLoader from "../components/SkeletonLoader";

function IngresosPage() {

  /*
  ==========================================
  DATA
  ==========================================
  */

  const { clientes } =
    useClientes();

  const { citas = [] } =
    useCitas();

  const {
    ingresos,
    pagarIngreso,
    isLoading
  } = useIngresos();

  /*
  ==========================================
  STATES
  ==========================================
  */

  const toastMostrado =
    useRef(false);

  const [modalAbierto, setModalAbierto] =
    useState(false);

  const [editando, setEditando] =
    useState(null);

  const [facturaPreview, setFacturaPreview] =
    useState(null);

  const [busqueda, setBusqueda] =
    useState("");

  const [animar, setAnimar] =
    useState(false);

  const [porPagina, setPorPagina] =
    useState(7);

  const [orden, setOrden] =
    useState("fecha");

  const [pagina, setPagina] =
    useState(1);

  const [citaDesdeCitas, setCitaDesdeCitas] =
    useState(null);

  const [citaPresetLocal, setCitaPresetLocal] =
    useState(null);

  /*
  ==========================================
  MODAL
  ==========================================
  */

  useEffect(() => {

    if (modalAbierto) {

      setTimeout(() => {

        setAnimar(true);

      }, 10);

    } else {

      setAnimar(false);

    }

  }, [modalAbierto]);

  /*
  ==========================================
  ACTIONS
  ==========================================
  */

  const abrirNuevo = () => {

    setEditando(null);

    setModalAbierto(true);

  };

  const abrirEditar = (ingreso) => {

    setEditando(ingreso);

    setModalAbierto(true);

  };

  const cerrarModal = () => {

    setModalAbierto(false);

    setEditando(null);

    setCitaPresetLocal(null);

    setCitaDesdeCitas(null);

  };

  /*
  ==========================================
  PAGAR
  ==========================================
  */

  const marcarPagado = async (ingreso) => {

    if (ingreso.pagado) {

      toast(
        "Ya está pagada ⚠️"
      );

      return;

    }

    try {

      await pagarIngreso.mutateAsync(
        ingreso.id
      );

      toast.success(
        "Pagado ✅"
      );

    } catch {

      toast.error(
        "Error ❌"
      );

    }

  };

  /*
  ==========================================
  KPI
  ==========================================
  */

  const totalPendiente =
    ingresos
      .filter(i => !i.pagado)
      .reduce((acc, i) => {

        const subtotal =
          (i.servicios || []).reduce(
            (a, s) => a + s.monto,
            0
          );

        const itbis =
          subtotal * 0.18;

        const descuento =
          i.descuento || 0;

        const descuentoValor =
          subtotal *
          (descuento / 100);

        const total =
          subtotal +
          itbis -
          descuentoValor;

        return acc + total;

      }, 0);

  const totalPagado =
    ingresos
      .filter(i => i.pagado)
      .reduce((acc, i) => {

        const subtotal =
          (i.servicios || []).reduce(
            (a, s) => a + s.monto,
            0
          );

        const itbis =
          subtotal * 0.18;

        const descuento =
          i.descuento || 0;

        const descuentoValor =
          subtotal *
          (descuento / 100);

        const total =
          subtotal +
          itbis -
          descuentoValor;

        return acc + total;

      }, 0);

  const pendientesCount =
    ingresos.filter(
      i => !i.pagado
    ).length;

  const pagadasCount =
    ingresos.filter(
      i => i.pagado
    ).length;

  /*
  ==========================================
  TOAST PENDIENTES
  ==========================================
  */

  useEffect(() => {

    if (
      pendientesCount > 0 &&
      !toastMostrado.current
    ) {

      toast(
        `⚠️ Tienes ${pendientesCount} factura(s) pendiente(s) 💸`
      );

      toastMostrado.current =
        true;

    }

  }, [pendientesCount]);

  /*
  ==========================================
  STORAGE CITA
  ==========================================
  */

  useEffect(() => {

    const citaStorage =
      sessionStorage.getItem(
        "citaPreset"
      );

    if (!citaStorage) {
      return;
    }

    try {

      const cita =
        JSON.parse(
          citaStorage
        );

      setCitaDesdeCitas(
        cita
      );

      sessionStorage.removeItem(
        "citaPreset"
      );

    } catch (err) {

      console.error(
        "ERROR STORAGE:",
        err
      );

    }

  }, []);

  /*
  ==========================================
  OPEN MODAL CITA
  ==========================================
  */

  useEffect(() => {

    if (!citaDesdeCitas) {
      return;
    }

    setEditando(null);

    setCitaPresetLocal(
      citaDesdeCitas
    );

    requestAnimationFrame(() => {

      setModalAbierto(true);

    });

    window.history.replaceState(
      {},
      document.title
    );

  }, [citaDesdeCitas]);

  /*
  ==========================================
  FILTROS
  ==========================================
  */

  const filtrados =
    ingresos
      .filter(i =>
        `${i.cliente?.nombre || ""}
        ${i.cliente?.apellido || ""}`
          .toLowerCase()
          .includes(
            busqueda.toLowerCase()
          )
      )
      .sort((a, b) => {

        if (orden === "az") {

          return (
            a.cliente?.nombre || ""
          ).localeCompare(
            b.cliente?.nombre || ""
          );

        }

        if (orden === "za") {

          return (
            b.cliente?.nombre || ""
          ).localeCompare(
            a.cliente?.nombre || ""
          );

        }

        if (orden === "fecha") {

          return (
            new Date(b.created_at) -
            new Date(a.created_at)
          );

        }

        return 0;

      });

  /*
  ==========================================
  PAGINACION
  ==========================================
  */

  const totalPaginas =
    Math.ceil(
      filtrados.length / porPagina
    );

  const inicio =
    (pagina - 1) * porPagina;

  const fin =
    inicio + porPagina;

  const facturasPaginadas =
    filtrados.slice(
      inicio,
      fin
    );

  useEffect(() => {

    if (pagina > totalPaginas) {

      setPagina(1);

    }

  }, [filtrados.length]);

  /*
  ==========================================
  LOADING
  ==========================================
  */

  if (isLoading) {

    return (

      <PageWrapper>

        <div className="
          max-w-[1600px]
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

          <SkeletonLoader alto="h-[500px]" />

        </div>

      </PageWrapper>

    );

  }

  return (

    <PageWrapper>

      <div className="
        h-full

        max-w-[1600px]

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
              Facturación
            </span>

            <span className="ml-2">
              🧾
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
            Gestiona ingresos y facturas
          </p>

          <p className="
            text-xs
            sm:text-sm

            text-gray-400
          ">
            {formatFecha(
              new Date()
            )}
          </p>

        </div>

        {/* KPIS */}

        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4

          gap-5
        ">

          {/* PENDIENTE */}

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

            transition-all
            duration-300

            hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]
          ">

            <div className="
              absolute
              -top-10
              -right-10

              w-40
              h-40

              rounded-full

              bg-red-500/10

              blur-3xl
            " />

            <p className="
              text-sm
              text-gray-500
            ">
              💸 Pendiente
            </p>

            <h2 className="
              mt-2

              text-4xl

              font-black

              text-red-500
            ">
              RD$
              {" "}
              {formatMoney(totalPendiente)}
            </h2>

          </div>

          {/* PAGADO */}

          {/* <div className="
            relative
            overflow-hidden

            bg-white/90
            backdrop-blur-xl

            border
            border-white/40

            rounded-[30px]

            p-6

            shadow-[0_10px_30px_rgba(0,0,0,0.06)]

            transition-all
            duration-300

            hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]
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
              ✅ Pagado
            </p>

            <h2 className="
              mt-2

              text-4xl

              font-black

              text-emerald-500
            ">
              RD$
              {" "}
              {formatMoney(totalPagado)}
            </h2>

          </div> */}

          {/* FACTURAS */}

          {/* <div className="
            relative
            overflow-hidden

            bg-white/90
            backdrop-blur-xl

            border
            border-white/40

            rounded-[30px]

            p-6

            shadow-[0_10px_30px_rgba(0,0,0,0.06)]

            transition-all
            duration-300

            hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]
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
              🧾 Facturas
            </p>

            <h2 className="
              mt-2

              text-4xl

              font-black

              text-indigo-500
            ">
              {ingresos.length}
            </h2>

          </div> */}

          {/* PENDIENTES */}

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

            transition-all
            duration-300

            hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]
          ">

            <div className="
              absolute
              -top-10
              -right-10

              w-40
              h-40

              rounded-full

              bg-yellow-500/10

              blur-3xl
            " />

            <p className="
              text-sm
              text-gray-500
            ">
              ⚠️ Pendientes
            </p>

            <h2 className="
              mt-2

              text-4xl

              font-black

              text-yellow-500
            ">
              {pendientesCount}
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
          lg:h-[76vh]

          p-5
          sm:p-6

          gap-5

          overflow-hidden
        ">

          {/* TOOLBAR */}

          <div className="
            flex
            flex-col

            gap-4
          ">

            {/* TOP */}

            <div className="
              flex
              flex-col
              xl:flex-row

              xl:items-center
              xl:justify-between

              gap-4
            ">

              {/* INFO */}

              <div className="
                flex
                items-center
                gap-3
                flex-wrap
              ">

                <div className="
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
                  {filtrados.length}
                  {" "}
                  facturas
                </div>

                {/* <div className="
                  px-4
                  h-11

                  rounded-2xl

                  bg-gradient-to-r
                  from-red-50
                  to-rose-50

                  border
                  border-red-100

                  flex
                  items-center

                  text-sm
                  font-semibold

                  text-red-500
                ">
                  {pendientesCount}
                  {" "}
                  pendientes
                </div> */}

              </div>

              {/* BUTTON */}

              <button
                onClick={abrirNuevo}
                className="
                  h-12

                  min-w-[170px]

                  px-6

                  rounded-2xl

                  bg-gradient-to-r
                  from-indigo-500
                  via-purple-500
                  to-violet-500

                  text-white

                  font-black

                  shadow-[0_15px_35px_rgba(99,102,241,0.28)]

                  hover:scale-[1.02]

                  active:scale-95

                  transition-all
                  duration-300
                "
              >
                + Nueva factura
              </button>

            </div>

            {/* FILTERS */}

            <div className="
              flex
              flex-col
              lg:flex-row

              gap-3
            ">

              {/* SEARCH */}

              <div className="
                w-full
                lg:flex-1
              ">

                <input
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

                    h-12

                    px-5

                    rounded-2xl

                    bg-white/80

                    border
                    border-white/40

                    shadow-sm

                    focus:outline-none

                    focus:ring-4
                    focus:ring-indigo-500/10
                  "
                />

              </div>

              {/* ORDER */}

              <select
                value={orden}
                onChange={(e) =>
                  setOrden(
                    e.target.value
                  )
                }
                className="
                  h-12

                  px-4

                  rounded-2xl

                  bg-white/80

                  border
                  border-white/40

                  shadow-sm

                  focus:outline-none

                  focus:ring-4
                  focus:ring-indigo-500/10
                "
              >

                <option value="fecha">
                  Más recientes
                </option>

                <option value="az">
                  A-Z
                </option>

                <option value="za">
                  Z-A
                </option>

              </select>

              {/* LIMIT */}

              <select
                value={porPagina}
                onChange={(e) => {

                  const val =
                    e.target.value === "all"
                      ? filtrados.length || 1
                      : parseInt(
                        e.target.value
                      );

                  setPorPagina(val);

                  setPagina(1);

                }}
                className="
                  h-12

                  px-4

                  rounded-2xl

                  bg-white/80

                  border
                  border-white/40

                  shadow-sm

                  focus:outline-none

                  focus:ring-4
                  focus:ring-indigo-500/10
                "
              >

                <option value={10}>
                  10
                </option>

                <option value={20}>
                  20
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

            {filtrados.length === 0 ? (

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
                  via-purple-500
                  to-violet-500

                  flex
                  items-center
                  justify-center

                  text-5xl
                  text-white

                  shadow-[0_20px_50px_rgba(99,102,241,0.35)]
                ">
                  🧾
                </div>

                <h3 className="
                  mt-6

                  text-3xl

                  font-black

                  text-slate-800
                ">
                  No hay facturas
                </h3>

                <p className="
                  mt-3

                  text-gray-500

                  max-w-sm
                ">
                  Las facturas creadas aparecerán aquí automáticamente
                </p>

              </div>

            ) : (

              <IngresoList
                facturas={facturasPaginadas}
                porPagina={porPagina}
                onVerFactura={(i) =>
                  setFacturaPreview(i)
                }
                onEditar={abrirEditar}
                onPagar={marcarPagado}
              />

            )}

          </div>

          {/* PAGINACION */}

          {porPagina !== "all" &&
            totalPaginas > 1 && (

              <div className="
                pt-4

                border-t
                border-gray-100

                flex
                justify-center
              ">

                <div className="
                  bg-white/80
                  backdrop-blur-xl

                  border
                  border-white/40

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

      </div>



      {/* ✅ MODAL FORM */}

      {modalAbierto && (

        <BaseModal
          onClose={cerrarModal}
        >

          <IngresoForm
          key={
            editando?.id ||
            citaPresetLocal?.id ||
            "nuevo"
          }

          clientes={clientes}

          initialData={editando}

          citaPreset={citaPresetLocal}

          onClose={cerrarModal}
        />

        </BaseModal>

      )}



      {/* FACTURA MODAL */ }

  <div className={`
        fixed
        inset-0
        z-50

        flex
        items-center
        justify-center

        transition

        ${facturaPreview
      ? "bg-black/40 backdrop-blur-sm"
      : "pointer-events-none"
    }
      `}>

    {facturaPreview && (

      <FacturaModal
        ingreso={facturaPreview}
        onClose={() =>
          setFacturaPreview(null)
        }
      />

    )}

  </div>

    </PageWrapper >
  );

}

export default IngresosPage;