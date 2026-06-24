import { useState } from "react";

import {
  BarChart3,
  Wallet,
  BadgeDollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Receipt,
  CalendarDays,
  FileSpreadsheet,
  FileText,
  Activity,
  Crown,
  Stethoscope,
  X,
  ArrowUpRight,
  CircleDollarSign,
  ClipboardList
} from "lucide-react";
import { motion } from "framer-motion";
import { useIngresos } from "../hooks/useIngresos";
import { useEgresos } from "../hooks/useEgresos";
import { useServicios } from "../hooks/useServicios";

import PageWrapper from "../components/PageWrapper";
import SkeletonLoader from "../components/SkeletonLoader";

import { generarReporte } from "../utils/pdfReporte";
import { exportToExcel } from "../utils/exportExcel";

import GraficoIngresos from "../components/graficos/GraficoIngresos";

import {
  parseFechaLocal
} from "../utils/fecha";

import {
  formatMoney
} from "../utils/format";

function ReportesPage() {

  const {
    ingresos,
    isLoading
  } = useIngresos();

  const {
    egresos
  } = useEgresos();

  const {
    servicios
  } = useServicios();

  const [tipo, setTipo] =
    useState("mensual");

  const [desde, setDesde] =
    useState("");

  const [hasta, setHasta] =
    useState("");

  const ahora =
    new Date();

  const labelMap = {

    semanal:
      "Últimos 7 días",

    mensual:
      "Este mes",

    anual:
      "Este año"

  };

  /*
  ==========================================
  HELPERS
  ==========================================
  */

  const serviciosMap = {};

  (servicios || []).forEach(servicio => {

    serviciosMap[servicio.id] =
      servicio.nombre;

  });

  const filtrarFecha = (fecha) => {

    if (desde) {

      const fDesde =
        new Date(desde);

      if (fecha < fDesde) {
        return false;
      }

    }

    if (hasta) {

      const fHasta =
        new Date(hasta);

      fHasta.setHours(
        23,
        59,
        59
      );

      if (fecha > fHasta) {
        return false;
      }

    }

    if (!desde && !hasta) {

      if (tipo === "semanal") {

        const hace7 =
          new Date();

        hace7.setDate(
          ahora.getDate() - 7
        );

        return fecha >= hace7;

      }

      if (tipo === "mensual") {

        return (
          fecha.getMonth() === ahora.getMonth() &&
          fecha.getFullYear() === ahora.getFullYear()
        );

      }

      if (tipo === "anual") {

        return (
          fecha.getFullYear() === ahora.getFullYear()
        );

      }

    }

    return true;

  };

  /*
  ==========================================
  FILTROS
  ==========================================
  */

  const ingresosFiltrados =
    ingresos.filter((ingreso) => {

      if (
        !ingreso.created_at ||
        !ingreso.pagado
      ) {
        return false;
      }

      const fecha =
        parseFechaLocal(
          ingreso.created_at
        );

      return filtrarFecha(
        fecha
      );

    });

  const egresosFiltrados =
    egresos.filter((egreso) => {

      const fecha =
        parseFechaLocal(
          egreso.fecha ||
          egreso.created_at
        );

      return filtrarFecha(
        fecha
      );

    });

  /*
  ==========================================
  TABLA
  ==========================================
  */

  const datosTabla =
    ingresosFiltrados.map((ingreso) => {

      const fecha =
        parseFechaLocal(
          ingreso.created_at
        );

      const tratamientos =
        ingreso.servicios || [];

      const subtotal =
        tratamientos.reduce(
          (s, x) =>
            s + (x.monto || 0),
          0
        );

      const costos =
        tratamientos.reduce(
          (s, x) =>
            s + Number(
              x.costo_servicio || 0
            ),
          0
        );

      const itbis =
        subtotal * 0.18;

      const descuento =
        subtotal *
        (
          (ingreso.descuento || 0) / 100
        );

      const total =
        subtotal +
        itbis -
        descuento;

      const utilidad =
        total - costos;

      return {

        Fecha:
          fecha,

        FechaStr:
          fecha.toLocaleDateString("es-DO"),

        Paciente:
          `${ingreso.cliente?.nombre || ""} ${ingreso.cliente?.apellido || ""}`.trim(),

        Tratamientos:
          tratamientos
            .map((s) => {

              const nombreServicio =
                serviciosMap[s.servicio_id] ||
                serviciosMap[s.catalogo_servicio_id] ||
                serviciosMap[s.servicio_catalogo_id] ||
                s.descripcion ||
                s.nombre_servicio ||
                s.nombre ||
                s.servicio;

              return nombreServicio || "Procedimiento";

            })
            .filter(Boolean)
            .join(", "),

        Subtotal:
          subtotal,

        ITBIS:
          itbis,

        Descuento:
          descuento,

        Costos:
          costos,

        Total:
          total,

        Utilidad:
          utilidad

      };

    });

  const datosOrdenados =
    [...datosTabla].sort(
      (a, b) =>
        b.Fecha - a.Fecha
    );

  /*
  ==========================================
  KPIS
  ==========================================
  */

  const ingresosClinicos =
    datosOrdenados.reduce(
      (acc, d) =>
        acc + d.Total,
      0
    );

  const costosClinicos =
    datosOrdenados.reduce(
      (acc, d) =>
        acc + d.Costos,
      0
    );

  const produccionOperativa =
    datosOrdenados.reduce(
      (acc, d) =>
        acc + d.Utilidad,
      0
    );

  const descuentosTotales =
    datosOrdenados.reduce(
      (acc, d) =>
        acc + d.Descuento,
      0
    );

  const totalEgresos =
    egresosFiltrados.reduce(
      (acc, e) =>
        acc + Number(
          e.monto || 0
        ),
      0
    );

  const cajaDisponible =
    ingresosClinicos -
    totalEgresos;

  const utilidadNeta =
    produccionOperativa -
    totalEgresos;

  const margenRentabilidad =
    ingresosClinicos > 0
      ? (
        utilidadNeta /
        ingresosClinicos
      ) * 100
      : 0;


  const rentabilidadColor =
    margenRentabilidad >= 40
      ? "text-emerald-500"
      : margenRentabilidad >= 20
        ? "text-amber-500"
        : "text-rose-500";


  const totalFacturas =
    datosOrdenados.length;

  const promedioFactura =
    totalFacturas
      ? ingresosClinicos /
      totalFacturas
      : 0;

  const pacientesUnicos =
    new Set(
      datosOrdenados.map(
        d => d.Paciente
      )
    ).size;

  const tratamientosRealizados =
    datosOrdenados.reduce(
      (acc, d) =>
        acc +
        d.Tratamientos.split(",").length,
      0
    );

  /*
  ==========================================
  TOPS
  ==========================================
  */

  const topPacientes =
    Object.entries(

      datosOrdenados.reduce((acc, d) => {

        acc[d.Paciente] =
          (acc[d.Paciente] || 0) +
          d.Total;

        return acc;

      }, {})

    )
      .sort((a, b) =>
        b[1] - a[1]
      )
      .slice(0, 5);

  const tratamientosMap = {};

  ingresosFiltrados.forEach(i => {

    (i.servicios || []).forEach(s => {

      const nombre =
        serviciosMap[s.servicio_id] ||
        serviciosMap[s.catalogo_servicio_id] ||
        s.descripcion ||
        s.servicio ||
        s.nombre_servicio ||
        s.nombre ||
        "Procedimiento";

      if (!tratamientosMap[nombre]) {

        tratamientosMap[nombre] = {

          cantidad: 0,

          total: 0

        };

      }

      tratamientosMap[nombre].cantidad += 1;

      tratamientosMap[nombre].total +=
        Number(s.monto || 0);

    });

  });

  const tratamientosFrecuentes =
    Object.entries(
      tratamientosMap
    )
      .sort(
        (a, b) =>
          b[1].cantidad -
          a[1].cantidad
      )
      .slice(0, 5);

  /*
  ==========================================
  EXPORT
  ==========================================
  */

  const getFileName = (ext) => {

    const fecha =
      new Date()
        .toISOString()
        .split("T")[0];

    return `reporte_clinico_${tipo}_${fecha}.${ext}`;

  };

  const procedimientos =
    servicios
      .map(
        s => s.descripcion
      )
      .join(", ");

  const handlePDF = () => {

    generarReporte({

      ingresos:
        ingresosFiltrados,

      tipo,

      fileName:
        getFileName("pdf")

    });

  };

  const handleExcel = () => {


    exportToExcel(
      datosOrdenados,
      egresosFiltrados,
      `reporte_clinico_${tipo}`
    );


  };

  /*
  ==========================================
  CARD
  ==========================================
  */

  const cardKpi = `
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
  `;

  /*
  ==========================================
  LOADING
  ==========================================
  */

  if (isLoading) {

    return (

      <PageWrapper>

        <div className="
          w-full

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

          <SkeletonLoader alto="h-[600px]" />

        </div>

      </PageWrapper>

    );

  }

  return (

    <PageWrapper>
      <motion.div
        key="reportes"

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

           
bg-sky-500/10

border
border-sky-100

text-sky-800


            text-sm
            font-semibold

            mb-4
          ">

                <BarChart3 size={14} />

                Inteligencia financiera

              </div>

              <h1 className="
            text-3xl
            md:text-4xl

            font-black

            tracking-tight

            text-slate-800
          ">

                Reportes clínicos

              </h1>

              <p className="
            mt-2

            text-sm
            sm:text-base

            text-slate-500
          ">

                {(desde || hasta)
                  ? "Filtro personalizado activo"
                  : labelMap[tipo]
                }
                {" • "}
                análisis financiero odontológico

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
                Utilidad neta
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

                text-sky-800
              ">

                    RD$
                    {" "}
                    {formatMoney(utilidadNeta)}

                  </h3>

                  <p className={`
                mt-1

                text-xs

                font-semibold

                ${rentabilidadColor}
              `}>

                    Rentabilidad
                    {" "}
                    {margenRentabilidad.toFixed(1)}%

                  </p>

                </div>

                <div className="
              w-14
              h-14

              rounded-[20px]

              
bg-gradient-to-br
from-sky-700
via-sky-800
to-sky-900


              text-white

              flex
              items-center
              justify-center
            ">

                  <TrendingUp size={22} />

                </div>

              </div>

            </div>

          </div>

          {/* FILTROS */}

          <div className="
        bg-white/95
        backdrop-blur-md

        border
        border-slate-200/80

        rounded-[34px]

        p-5

        shadow-[0_10px_30px_rgba(0,0,0,0.05)]

        space-y-5
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

              {/* LEFT */}

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

             text-sky-800
            ">

                  <Activity size={14} />

                  {totalFacturas}
                  {" "}
                  facturas analizadas

                </div>

                <div className="
              px-4
              h-11

              rounded-2xl

              bg-emerald-50

              border
              border-emerald-100

              flex
              items-center
              gap-2

              text-sm
              font-semibold

              text-emerald-600
            ">

                  <Users size={14} />

                  {pacientesUnicos}
                  {" "}
                  pacientes

                </div>

              </div>

              {/* EXPORT */}

              <div className="
            flex
            flex-col
            sm:flex-row

            gap-3
          ">

                <button
                  onClick={handlePDF}
                  className="
                h-12

                px-5

                rounded-2xl

                bg-rose-500

                text-white

                text-sm
                font-bold

                hover:bg-rose-600

                transition-all
                duration-300

                flex
                items-center
                justify-center
                gap-2
              "
                >

                  <FileText size={16} />

                  Exportar PDF

                </button>

                <button
                  onClick={handleExcel}
                  className="
                h-12

                px-5

                rounded-2xl

                bg-emerald-500

                text-white

                text-sm
                font-bold

                hover:bg-emerald-600

                transition-all
                duration-300

                flex
                items-center
                justify-center
                gap-2
              "
                >

                  <FileSpreadsheet size={16} />

                  Exportar Excel

                </button>

              </div>

            </div>

            {/* FILTERS */}

            <div className="
          flex
          flex-col
          xl:flex-row

          gap-3
        ">

              {/* PERIODOS */}

              <div className="
            bg-slate-50/90

            rounded-[26px]

            border
            border-slate-200/70

            p-2

            shadow-sm

            overflow-x-auto

            no-scrollbar
          ">

                <div className="
              flex
              gap-2

              min-w-max
            ">

                  {["semanal", "mensual", "anual"].map((t) => (

                    <button
                      key={t}
                      onClick={() =>
                        setTipo(t)
                      }
                      disabled={desde || hasta}
                      className={`
                    flex
                    items-center
                    gap-2

                    px-5
                    h-11

                    rounded-2xl

                    whitespace-nowrap

                    text-sm
                    font-semibold

                    border

                    transition-all
                    duration-300

                    ${tipo === t
                          ? `
                        
bg-gradient-to-r
from-sky-700
to-sky-900


                        text-white

                        border-transparent
                      `
                          : `
                        bg-white

                        text-slate-700

                        border-slate-200/70
                      `
                        }
                  `}
                    >

                      <CalendarDays size={14} />

                      {t}

                    </button>

                  ))}

                </div>

              </div>

              {/* DATES */}

              <div className="
            flex
            flex-col
            sm:flex-row

            gap-3

            flex-1
          ">

                <input
                  type="date"
                  value={desde}
                  onChange={(e) =>
                    setDesde(
                      e.target.value
                    )
                  }
                  className="
                flex-1

                h-12

                px-4

                rounded-2xl

                bg-slate-50/90

                border
                border-slate-200/70

                shadow-sm

                focus:outline-none

                focus:ring-4
                
focus:ring-sky-500/10
focus:border-sky-300

              "
                />

                <input
                  type="date"
                  value={hasta}
                  onChange={(e) =>
                    setHasta(
                      e.target.value
                    )
                  }
                  className="
                flex-1

                h-12

                px-4

                rounded-2xl

                bg-slate-50/90

                border
                border-slate-200/70

                shadow-sm

                focus:outline-none

                focus:ring-4
                
focus:ring-sky-500/10
focus:border-sky-300

              "
                />

                <button
                  onClick={() => {

                    setDesde("");

                    setHasta("");

                  }}
                  className="
                h-12

                px-5

                rounded-2xl

                bg-slate-100

                border
                border-slate-200

                text-slate-700

                font-semibold

                hover:bg-slate-200

                transition-all
                duration-300

                flex
                items-center
                justify-center
                gap-2
              "
                >

                  <X size={15} />

                  Limpiar

                </button>

              </div>

            </div>

          </div>

          {/* KPIS */}

          <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-3
        2xl:grid-cols-6

        gap-5
      ">

            {/* INGRESOS */}

            <div className={cardKpi}>

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

                    <TrendingUp size={14} />

                    Ingresos clínicos

                  </p>

                  <h2 className="
                mt-2

                text-3xl

                font-black

                text-emerald-600
              ">

                    RD$
                    {" "}
                    {formatMoney(ingresosClinicos)}

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

                  <ArrowUpRight size={20} />

                </div>

              </div>

            </div>

            {/* CAJA */}

            <div className={cardKpi}>

              <div className="
            absolute
            -top-10
            -right-10

            w-40
            h-40

            rounded-full

            bg-sky-500/10

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

                    <Wallet size={14} />

                    Caja disponible

                  </p>

                  <h2 className="
                mt-2

                text-3xl

                font-black

                text-sky-800
              ">

                    RD$
                    {" "}
                    {formatMoney(cajaDisponible)}

                  </h2>

                </div>

                <div className="
              w-12
              h-12

              rounded-2xl

             
bg-sky-50

text-sky-700


              flex
              items-center
              justify-center
            ">

                  <CircleDollarSign size={20} />

                </div>

              </div>

            </div>

            {/* EGRESOS */}

            <div className={cardKpi}>

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

                    <TrendingDown size={14} />

                    Egresos

                  </p>

                  <h2 className="
                mt-2

                text-3xl

                font-black

                text-rose-500
              ">

                    RD$
                    {" "}
                    {formatMoney(totalEgresos)}

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

                  <TrendingDown size={20} />

                </div>

              </div>

            </div>

            {/* FACTURAS */}

            <div className={cardKpi}>

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

                    <Receipt size={14} />

                    Facturas

                  </p>

                  <h2 className="
                mt-2

                text-3xl

                font-black

                text-slate-800
              ">

                    {totalFacturas}

                  </h2>

                </div>

                <div className="
              w-12
              h-12

              rounded-2xl

              bg-slate-100

              text-slate-600

              flex
              items-center
              justify-center
            ">

                  <Receipt size={20} />

                </div>

              </div>

            </div>

            {/* PACIENTES */}

            <div className={cardKpi}>

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

                    <Users size={14} />

                    Pacientes

                  </p>

                  <h2 className="
                mt-2

                text-3xl

                font-black

                text-sky-800
              ">

                    {pacientesUnicos}

                  </h2>

                </div>

                <div className="
              w-12
              h-12

              rounded-2xl

              
bg-sky-50

text-sky-700


              flex
              items-center
              justify-center
            ">

                  <Users size={20} />

                </div>

              </div>

            </div>

            {/* PROMEDIO */}

            <div className="
          relative
          overflow-hidden

          
bg-gradient-to-br
from-sky-700
via-sky-800
to-sky-900


          rounded-[30px]

          p-5

          text-white

          shadow-[0_20px_50px_rgba(7,89,133,0.28)]
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

              <div className="relative z-10">

                <p className="
              text-sm

              text-white/70

              flex
              items-center
              gap-2
            ">

                  <BadgeDollarSign size={14} />

                  Promedio factura

                </p>

                <h2 className="
              mt-2

              text-3xl

              font-black
            ">

                  RD$
                  {" "}
                  {formatMoney(promedioFactura)}

                </h2>

              </div>

            </div>

          </div>
          {/* RESUMEN + ANALISIS */}

          <div className="
  grid
  grid-cols-1
  xl:grid-cols-3

  gap-6
">

            {/* RESUMEN */}

            <div className="
    xl:col-span-2

    bg-white/95
    backdrop-blur-md

    border
    border-slate-200/80

    rounded-[34px]

    p-6

    shadow-[0_10px_30px_rgba(0,0,0,0.05)]
  ">

              <div className="
      flex
      items-center
      gap-3

      mb-6
    ">

                <div className="
        w-12
        h-12

        rounded-[18px]

        
bg-gradient-to-br
from-sky-700
via-sky-800
to-sky-900


        text-white

        flex
        items-center
        justify-center
      ">

                  <ClipboardList size={20} />

                </div>

                <div>

                  <h3 className="
          text-2xl

          font-black

          text-slate-800
        ">

                    Resumen financiero

                  </h3>

                  <p className="
          text-sm

          text-slate-500
        ">

                    Estado financiero de la clínica

                  </p>

                </div>

              </div>

              <div className="space-y-5">

                {/* INGRESOS */}

                <div className="
        flex
        items-center
        justify-between

        border-b
        border-slate-100

        pb-4
      ">

                  <div className="
          flex
          items-center
          gap-3
        ">

                    <div className="
            w-11
            h-11

            rounded-2xl

            bg-emerald-50

            text-emerald-500

            flex
            items-center
            justify-center
          ">

                      <TrendingUp size={18} />

                    </div>

                    <div>

                      <p className="
              font-semibold

              text-slate-700
            ">
                        Ingresos clínicos
                      </p>

                      <p className="
              text-sm

              text-slate-400
            ">
                        Facturación total registrada
                      </p>

                    </div>

                  </div>

                  <h3 className="
          text-2xl

          font-black

          text-emerald-600
        ">

                    RD$
                    {" "}
                    {formatMoney(ingresosClinicos)}

                  </h3>

                </div>

                {/* COSTOS */}

                <div className="
        flex
        items-center
        justify-between

        border-b
        border-slate-100

        pb-4
      ">

                  <div className="
          flex
          items-center
          gap-3
        ">

                    <div className="
            w-11
            h-11

            rounded-2xl

            bg-orange-50

            text-orange-500

            flex
            items-center
            justify-center
          ">

                      <BadgeDollarSign size={18} />

                    </div>

                    <div>

                      <p className="
              font-semibold

              text-slate-700
            ">
                        Costos clínicos
                      </p>

                      <p className="
              text-sm

              text-slate-400
            ">
                        Materiales y procedimientos
                      </p>

                    </div>

                  </div>

                  <h3 className="
          text-2xl

          font-black

          text-orange-500
        ">

                    - RD$
                    {" "}
                    {formatMoney(costosClinicos)}

                  </h3>

                </div>

                {/* EGRESOS */}

                <div className="
        flex
        items-center
        justify-between

        border-b
        border-slate-100

        pb-4
      ">

                  <div className="
          flex
          items-center
          gap-3
        ">

                    <div className="
            w-11
            h-11

            rounded-2xl

            bg-rose-50

            text-rose-500

            flex
            items-center
            justify-center
          ">

                      <TrendingDown size={18} />

                    </div>

                    <div>

                      <p className="
              font-semibold

              text-slate-700
            ">
                        Egresos operativos
                      </p>

                      <p className="
              text-sm

              text-slate-400
            ">
                        Gastos administrativos
                      </p>

                    </div>

                  </div>

                  <h3 className="
          text-2xl

          font-black

          text-rose-500
        ">

                    - RD$
                    {" "}
                    {formatMoney(totalEgresos)}

                  </h3>

                </div>

                {/* DESCUENTOS */}

                <div className="
        flex
        items-center
        justify-between

        border-b
        border-slate-100

        pb-4
      ">

                  <div className="
          flex
          items-center
          gap-3
        ">

                    <div className="
            w-11
            h-11

            rounded-2xl

            bg-pink-50

            text-pink-500

            flex
            items-center
            justify-center
          ">

                      <Receipt size={18} />

                    </div>

                    <div>

                      <p className="
              font-semibold

              text-slate-700
            ">
                        Descuentos aplicados
                      </p>

                      <p className="
              text-sm

              text-slate-400
            ">
                        Promociones y ajustes
                      </p>

                    </div>

                  </div>

                  <h3 className="
          text-2xl

          font-black

          text-pink-500
        ">

                    - RD$
                    {" "}
                    {formatMoney(descuentosTotales)}

                  </h3>

                </div>

                {/* UTILIDAD */}

                <div className="
        pt-2

        flex
        flex-col
        sm:flex-row

        sm:items-center
        sm:justify-between

        gap-4
      ">

                  <div>
                  
                    <p className="
            text-lg

            font-black

            text-slate-800
          ">
                      Utilidad neta final
                    </p>

                    <p className="
            text-sm

            text-slate-500
          ">
                      Resultado operativo actual
                    </p>

                  </div>

                  <div className="
          text-right
        ">

                    <h2 className="
            text-4xl

            font-black

            text-sky-800
          ">

                      RD$
                      {" "}
                      {formatMoney(utilidadNeta)}

                    </h2>

                    <p className={`
            mt-1

            text-sm

            font-semibold

            ${rentabilidadColor}
          `}>

                      Rentabilidad
                      {" "}
                      {margenRentabilidad.toFixed(1)}%

                    </p>

                  </div>

                </div>

              </div>
              {/* GRAFICA FINANCIERA */}

<div className="
  mt-8

  pt-6

  border-t
  border-slate-100
">

  <div className="
    rounded-[30px]

    bg-gradient-to-br
    from-white
    via-slate-50/70
    to-sky-50/50

    border
    border-slate-200/70

    p-5

    shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]
  ">

    <GraficoIngresos
      ingresos={ingresosFiltrados}
      egresos={egresosFiltrados}
      utilidadNeta={utilidadNeta}
    />

  </div>

</div>        
            </div>

            {/* SIDE ANALYTICS */}

            <div className="
    space-y-6
  ">

              {/* PACIENTES */}

              <div className="
      bg-white/95
      backdrop-blur-md

      border
      border-slate-200/80

      rounded-[34px]

      p-6

      shadow-[0_10px_30px_rgba(0,0,0,0.05)]
    ">

                <div className="
        flex
        items-center
        gap-3

        mb-5
      ">

                  <div className="
          w-12
          h-12

          rounded-[18px]

          bg-yellow-50

          text-yellow-500

          flex
          items-center
          justify-center
        ">

                    <Crown size={20} />

                  </div>

                  <div>

                    <h3 className="
            text-xl

            font-black

            text-slate-800
          ">

                      Pacientes top

                    </h3>

                    <p className="
            text-sm

            text-slate-500
          ">
                      Mayor facturación
                    </p>

                  </div>

                </div>

                <div className="
        space-y-3
      ">

                  {topPacientes.map(([paciente, total], i) => (

                    <div
                      key={i}
                      className="
              bg-slate-50/80

              border
              border-slate-200/60

              rounded-[24px]

              p-4

              flex
              items-center
              justify-between

              gap-3
            "
                    >

                      <div className="
              flex
              items-center
              gap-3
            ">

                        <div className="
                w-10
                h-10

                rounded-2xl

                
bg-gradient-to-br
from-sky-700
via-sky-800
to-sky-900

                text-white

                font-black

                flex
                items-center
                justify-center
              ">

                          {i + 1}

                        </div>

                        <div>

                          <p className="
                  font-semibold

                  text-slate-700
                ">

                            {paciente}

                          </p>

                          <p className="
                  text-xs

                  text-slate-400
                ">

                            Paciente recurrente

                          </p>

                        </div>

                      </div>

                      <p className="
              font-black

              text-emerald-600
            ">

                        RD$
                        {" "}
                        {formatMoney(total)}

                      </p>

                    </div>

                  ))}

                </div>

              </div>

              {/* PROCEDIMIENTOS */}

              <div className="
      bg-white/95
      backdrop-blur-md

      border
      border-slate-200/80

      rounded-[34px]

      p-6

      shadow-[0_10px_30px_rgba(0,0,0,0.05)]
    ">

                <div className="
        flex
        items-center
        gap-3

        mb-5
      ">

                  <div className="
          w-12
          h-12

          rounded-[18px]

          
bg-sky-50

text-sky-700


          flex
          items-center
          justify-center
        ">

                    <Stethoscope size={20} />

                  </div>

                  <div>

                    <h3 className="
            text-xl

            font-black

            text-slate-800
          ">

                      Procedimientos

                    </h3>

                    <p className="
            text-sm

            text-slate-500
          ">
                      Más realizados
                    </p>

                  </div>

                </div>

                <div className="
        space-y-3
      ">

                  {tratamientosFrecuentes.map(([nombre, data], i) => (

                    <div
                      key={i}
                      className="
              bg-slate-50/80

              border
              border-slate-200/60

              rounded-[24px]

              p-4

              flex
              items-center
              justify-between

              gap-3
            "
                    >

                      <div>

                        <p className="
                font-semibold

                text-slate-700
              ">

                          {nombre}

                        </p>

                        <p className="
                text-xs

                text-slate-400
              ">

                          {data.cantidad}
                          {" "}
                          procedimientos

                        </p>

                      </div>

                      <p className="
              font-black

              text-sky-800
            ">

                        RD$
                        {" "}
                        {formatMoney(data.total)}

                      </p>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          </div>

          {/* TABLA */}

          <div className="
  bg-white/95
  backdrop-blur-md

  border
  border-slate-200/80

  rounded-[34px]

  shadow-[0_10px_30px_rgba(0,0,0,0.05)]

  overflow-hidden
">

            {/* HEADER */}

            <div className="
    px-6
    py-5

    border-b
    border-slate-100

    flex
    items-center
    gap-3
  ">

              <div className="
      w-12
      h-12

      rounded-[18px]

      bg-gradient-to-br
      from-emerald-500
      to-green-500

      text-white

      flex
      items-center
      justify-center
    ">

                <BadgeDollarSign size={20} />

              </div>

              <div>

                <h3 className="
        text-2xl

        font-black

        text-slate-800
      ">

                  Detalle financiero clínico

                </h3>

                <p className="
        text-sm

        text-slate-500
      ">

                  Facturación y producción odontológica

                </p>

              </div>

            </div>

            {/* TABLE */}

            <div className="
    max-h-[70vh]

    overflow-auto
  ">

              <table className="
      w-full

      text-sm
    ">

                <thead className="
        sticky
        top-0

        bg-white/95
        backdrop-blur-xl

        border-b
        border-slate-100

        text-[11px]

        uppercase

        tracking-[0.12em]

        text-slate-400
      ">

                  <tr>

                    <th className="
            px-5
            py-4

            text-left
          ">
                      Fecha
                    </th>

                    <th className="
            px-5
            py-4

            text-left
          ">
                      Paciente
                    </th>

                    <th className="
            px-5
            py-4

            text-left
          ">
                      Procedimientos
                    </th>

                    <th className="
            px-5
            py-4

            text-right
          ">
                      Subtotal
                    </th>

                    <th className="
            px-5
            py-4

            text-right
          ">
                      ITBIS
                    </th>

                    <th className="
            px-5
            py-4

            text-right
          ">
                      Desc.
                    </th>

                    <th className="
            px-5
            py-4

            text-right
          ">
                      Costos
                    </th>

                    <th className="
            px-5
            py-4

            text-right
          ">
                      Producción
                    </th>

                    <th className="
            px-5
            py-4

            text-right
          ">
                      Total
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {datosOrdenados.map((d, i) => (

                    <tr
                      key={i}
                      className="
              border-b
              border-slate-100

              hover:bg-sky-50/40

              transition-all
              duration-200
            "
                    >

                      <td className="
              px-5
              py-4

              text-slate-600
            ">

                        {d.FechaStr}

                      </td>

                      <td className="
              px-5
              py-4

              font-semibold

              text-slate-700
            ">

                        {d.Paciente}

                      </td>

                      <td className="
              px-5
              py-4

              text-slate-600

              max-w-[280px]
            ">

                        {d.Tratamientos}

                      </td>

                      <td className="
              px-5
              py-4

              text-right

              text-slate-700
            ">

                        RD$
                        {" "}
                        {formatMoney(d.Subtotal)}

                      </td>

                      <td className="
              px-5
              py-4

              text-right

              text-slate-700
            ">

                        RD$
                        {" "}
                        {formatMoney(d.ITBIS)}

                      </td>

                      <td className="
              px-5
              py-4

              text-right

              text-pink-500

              font-semibold
            ">

                        RD$
                        {" "}
                        {formatMoney(d.Descuento)}

                      </td>

                      <td className="
              px-5
              py-4

              text-right

              text-orange-500

              font-bold
            ">

                        RD$
                        {" "}
                        {formatMoney(d.Costos)}

                      </td>

                      <td className="
              px-5
              py-4

              text-right

              text-sky-800

              font-bold
            ">

                        RD$
                        {" "}
                        {formatMoney(d.Utilidad)}

                      </td>

                      <td className="
              px-5
              py-4

              text-right

              font-black

              text-emerald-600
            ">

                        RD$
                        {" "}
                        {formatMoney(d.Total)}

                      </td>

                    </tr>

                  ))}

                </tbody>

                <tfoot className="
        sticky
        bottom-0

        bg-white

        border-t
        border-slate-100
      ">

                  <tr>

                    <td
                      colSpan="8"
                      className="
              px-5
              py-5

              text-right

              font-bold

              text-slate-700
            "
                    >

                      Total General

                    </td>

                    <td className="
            px-5
            py-5

            text-right

            font-black

            text-emerald-600
          ">

                      RD$
                      {" "}
                      {formatMoney(ingresosClinicos)}

                    </td>

                  </tr>

                </tfoot>

              </table>

            </div>

          </div>
        </div>
      </motion.div>
    </PageWrapper>
  );

}

export default ReportesPage;