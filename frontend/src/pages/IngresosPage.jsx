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

import {
  Search,
  Plus,
  Wallet,
  BadgeDollarSign,
  Receipt,
  AlertTriangle,
  FileText,
  CalendarDays
} from "lucide-react";

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

      w-full

      flex
      flex-col

      gap-7

      pb-4

      overflow-hidden

      px-3
      sm:px-5
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

              <Wallet size={14} />

              CRM financiero

            </div>

            <h1 className="
            text-3xl
            md:text-4xl

            font-black

            tracking-tight

            text-slate-800
          ">

              Facturación clínica

            </h1>

            <p className="
            mt-2

            text-sm
            sm:text-base

            text-slate-500
          ">
              Control clínico de ingresos y facturas
            </p>

          </div>

          {/* RIGHT */}

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
              Facturación total
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

                text-indigo-600
              ">
                  RD$
                  {" "}
                  {formatMoney(totalPagado)}
                </h3>

                <p className="
                mt-1

                text-xs

                font-semibold

                text-slate-500
              ">
                  Ingresos registrados
                </p>

              </div>

              <div className="
              w-14
              h-14

              rounded-[20px]

              bg-gradient-to-br
              from-indigo-500
              via-purple-500
              to-violet-500

              text-white

              flex
              items-center
              justify-center

              shadow-[0_15px_35px_rgba(99,102,241,0.25)]
            ">

                <Receipt size={22} />

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

          {/* PENDIENTE */}

          <div className="
          relative
          overflow-hidden

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

                  <BadgeDollarSign size={14} />

                  Pendiente

                </p>

                <h2 className="
                mt-2

                text-3xl

                font-black

                text-rose-500
              ">

                  RD$
                  {" "}
                  {formatMoney(totalPendiente)}

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

                <Wallet size={20} />

              </div>

            </div>

          </div>

          {/* PAGADO */}

          <div className="
          relative
          overflow-hidden

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
            absolute
            -top-10
            -right-10

            w-40
            h-40

            rounded-full

            bg-emerald-500/10

            blur-3xl
          " />

            <div className="
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

                  <BadgeDollarSign size={14} />

                  Pagado

                </p>

                <h2 className="
                mt-2

                text-3xl

                font-black

                text-emerald-600
              ">

                  RD$
                  {" "}
                  {formatMoney(totalPagado)}

                </h2>

              </div>

              <div className="
              w-12
              h-12

              rounded-2xl

              bg-emerald-50

              text-emerald-500

              flex
              items-center
              justify-center
            ">

                <Wallet size={20} />

              </div>

            </div>

          </div>

          {/* FACTURAS */}

          <div className="
          relative
          overflow-hidden

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

                  <FileText size={14} />

                  Facturas

                </p>

                <h2 className="
                mt-2

                text-3xl

                font-black

                text-indigo-600
              ">

                  {ingresos.length}

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

                <Receipt size={20} />

              </div>

            </div>

          </div>

          {/* PENDIENTES */}

          <div className="
          relative
          overflow-hidden

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
            absolute
            -top-10
            -right-10

            w-40
            h-40

            rounded-full

            bg-yellow-500/10

            blur-3xl
          " />

            <div className="
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

                  <AlertTriangle size={14} />

                  Pendientes

                </p>

                <h2 className="
                mt-2

                text-3xl

                font-black

                text-yellow-500
              ">

                  {pendientesCount}

                </h2>

              </div>

              <div className="
              w-12
              h-12

              rounded-2xl

              bg-yellow-50

              text-yellow-500

              flex
              items-center
              justify-center
            ">

                <CalendarDays size={20} />

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

        rounded-[38px]

        shadow-[0_20px_60px_rgba(15,23,42,0.06)]

        flex
        flex-col

        h-[78vh]

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

                bg-indigo-50

                border
                border-indigo-100

                flex
                items-center
                gap-2

                text-sm
                font-semibold

                text-indigo-600
              ">

                  <Receipt size={14} />

                  {filtrados.length}
                  {" "}
                  facturas

                </div>

                <div className="
                px-4
                h-11

                rounded-2xl

                bg-rose-50

                border
                border-rose-100

                flex
                items-center
                gap-2

                text-sm
                font-semibold

                text-rose-500
              ">

                  <AlertTriangle size={14} />

                  {pendientesCount}
                  {" "}
                  pendientes

                </div>

              </div>

              {/* BUTTON */}

              <button
                onClick={abrirNuevo}
                className="
                group

                relative
                overflow-hidden

                h-12

                min-w-[190px]

                px-6

                rounded-2xl

                bg-gradient-to-r
                from-indigo-500
                via-purple-500
                to-violet-500

                text-white

                font-black

                shadow-[0_15px_35px_rgba(99,102,241,0.28)]

                hover:shadow-[0_20px_45px_rgba(99,102,241,0.35)]

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

                Nueva factura

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
              relative

              w-full
              lg:flex-1
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

                  pl-12
                  pr-5

                  rounded-2xl

                  bg-slate-50/90

                  border
                  border-slate-200/70

                  shadow-sm

                  placeholder:text-slate-400

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

                bg-slate-50/90

                border
                border-slate-200/70

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

                bg-slate-50/90

                border
                border-slate-200/70

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

          pr-2

          scrollbar-thin
          scrollbar-thumb-indigo-200/70
          scrollbar-track-transparent
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
                relative

                w-28
                h-28

                rounded-[34px]

                bg-gradient-to-br
                from-indigo-500
                via-purple-500
                to-violet-500

                flex
                items-center
                justify-center

                text-white

                shadow-[0_25px_60px_rgba(99,102,241,0.35)]
              ">

                  <div className="
                  absolute
                  inset-0

                  rounded-[34px]

                  bg-white/10

                  blur-xl
                " />

                  <Receipt
                    size={42}
                    className="relative z-10"
                  />

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

                text-slate-500

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
              pt-5

              border-t
              border-slate-100

              flex
              justify-center

              shrink-0
            ">

                <Paginacion
                  pagina={pagina}
                  totalPaginas={totalPaginas}
                  onChange={setPagina}
                />

              </div>

            )}

        </div>

      </div>

      {/* MODAL FORM */}

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

      {/* FACTURA MODAL */}

      <div className={`
      fixed
      inset-0
      z-50

      flex
      items-center
      justify-center

      transition-all
      duration-300

      ${facturaPreview
          ? "bg-slate-900/40 backdrop-blur-sm"
          : "pointer-events-none opacity-0"
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

    </PageWrapper>
  );

}

export default IngresosPage;