import { useClientes } from "../hooks/useClientes";
import { useIngresos } from "../hooks/useIngresos";
import { useCitas } from "../hooks/useCitas";
import { useEgresos } from "../hooks/useEgresos";
import { useEffect, useState } from "react";
import RevenueChart from "../components/charts/RevenueChart";
import toast from "react-hot-toast";
import AgendaCalendar from "../components/calendar/AgendaCalendar";
import { motion } from "framer-motion";
import { useActividades } from "../hooks/useActividades";
import {
  formatFecha,
  formatHora,
  parseFechaLocal
} from "../utils/fecha";

import {
  formatMoney
} from "../utils/format";

import {
  Wallet,
  TrendingUp,
  Receipt,
  Users,
  Clock3,
  Activity,
  ClipboardList,
  Banknote,
  CalendarDays,
  BarChart3,
  UserCheck
} from "lucide-react";


import {
  showSuccess,
  showError,
  showWarning,
  showInfo
} from "../components/ui/ToastStyles";

import QuickActions from "../components/dashboard/QuickActions";
import FinanceChart from "../components/charts/FinanceChart";

import ServicesChart from "../components/charts/ServicesChart";
import SmartInsights from "../components/dashboard/SmartInsights";
import GraficoIngresos from "../components/graficos/GraficoIngresos";
import GraficoClientes from "../components/graficos/GraficoClientes";
import GraficoCitas from "../components/graficos/GraficoCitas";

import PageWrapper from "../components/PageWrapper";
import SkeletonLoader from "../components/SkeletonLoader";

function DashboardHome() {

  const {
    clientes,
    isLoading: clientesLoading
  } = useClientes();

  const {
    ingresos,
    isLoading: ingresosLoading
  } = useIngresos();

  const {
    egresos,
    isLoading: egresosLoading
  } = useEgresos();

  const {
    citas = [],
    isLoading: citasLoading
  } = useCitas();

  const [showCitas, setShowCitas] =
    useState(true);

  const {
    actividades: actividadesSistema,
    isLoading: actividadesLoading
  } = useActividades(20);

  const [showKpis, setShowKpis] =
    useState(true);

  const [showCharts, setShowCharts] =
    useState(true);

  const ahora = new Date();

  /*
  ==========================================
  HELPERS
  ==========================================
  */

  const esHoy = (fechaStr) => {

    if (!fechaStr) return false;

    const fecha =
      parseFechaLocal(fechaStr);

    return (
      fecha.getDate() === ahora.getDate() &&
      fecha.getMonth() === ahora.getMonth() &&
      fecha.getFullYear() === ahora.getFullYear()
    );

  };

  const getEstado = (c) => {

    if (c.estado === "cancelada") {
      return "cancelada";
    }

    if (c.estado === "completada") {
      return "completada";
    }

    const fecha =
      parseFechaLocal(c.fecha);

    if (fecha < ahora) {
      return "atrasada";
    }

    return "pendiente";

  };

  const getDetalleCita = (cita) => {

    return (
      cita?.detalle ||
      cita?.observacion ||
      cita?.descripcion ||
      cita?.nota ||
      ""
    );

  };

  const getTratamientoTexto = (cita) => {

    if (!cita?.tratamiento) {
      return "";
    }

    const servicio =
      cita.tratamiento.servicio ||
      cita.tratamiento.servicio_nombre ||
      "Tratamiento";

    const pieza =
      cita.tratamiento.pieza
        ? ` · Pieza ${cita.tratamiento.pieza}`
        : "";

    return `${servicio}${pieza}`;

  };

  const getSesionesTexto = (cita) => {

    if (!cita?.tratamiento) {
      return "";
    }

    const completadas =
      cita.tratamiento.sesiones_completadas ?? 0;

    const totales =
      cita.tratamiento.sesiones_totales ?? 0;

    if (!totales) {
      return "";
    }

    return `${completadas}/${totales} sesiones`;

  };

  /*
  ==========================================
  DATA
  ==========================================
  */
  const mesActual =
    ahora.getMonth();

  const anioActual =
    ahora.getFullYear();

  const meses = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic"
  ];

  const revenueData =
    meses.map((mes, index) => {

      let ingresosMes = 0;

      ingresos.forEach(i => {

        if (!i.created_at) return;

        const fecha =
          parseFechaLocal(
            i.created_at
          );

        if (
          fecha.getMonth() === index &&
          fecha.getFullYear() === anioActual
        ) {

          const servicios =
            i.servicios || [];

          const subtotal =
            servicios.reduce(
              (acc, s) =>
                acc + Number(s.monto || 0),
              0
            );

          const itbis =
            subtotal * 0.18;

          const descuento =
            subtotal *
            (
              (i.descuento || 0) / 100
            );

          ingresosMes +=
            subtotal +
            itbis -
            descuento;

        }

      });

      return {

        mes,

        ingresos:
          ingresosMes

      };

    });

  const financeData =
    meses.map((mes, index) => {

      let ingresosMes = 0;

      let egresosMes = 0;

      ingresos.forEach(i => {

        if (!i.created_at) return;

        const fecha =
          parseFechaLocal(
            i.created_at
          );

        if (
          fecha.getMonth() === index &&
          fecha.getFullYear() === anioActual
        ) {

          const servicios =
            i.servicios || [];

          const subtotal =
            servicios.reduce(
              (acc, s) =>
                acc + Number(s.monto || 0),
              0
            );

          const itbis =
            subtotal * 0.18;

          const descuento =
            subtotal *
            (
              (i.descuento || 0) / 100
            );

          ingresosMes +=
            subtotal +
            itbis -
            descuento;

        }

      });

      egresos.forEach(e => {

        const fecha =
          parseFechaLocal(
            e.fecha ||
            e.created_at
          );

        if (
          fecha.getMonth() === index &&
          fecha.getFullYear() === anioActual
        ) {

          egresosMes +=
            Number(
              e.monto || 0
            );

        }

      });

      return {

        mes,

        ingresos:
          ingresosMes,

        egresos:
          egresosMes

      };

    });

  const serviciosMap = {};

  ingresos.forEach(i => {

    (i.servicios || []).forEach(s => {

      const nombre =
        s.descripcion ||
        s.nombre_servicio ||
        s.nombre ||
        s.servicio ||
        "Procedimiento";

      if (!serviciosMap[nombre]) {

        serviciosMap[nombre] = 0;

      }

      serviciosMap[nombre] += 1;

    });

  });

  const servicesData =
    Object.entries(
      serviciosMap
    )
      .map(([name, value]) => ({
        name,
        value
      }))
      .sort(
        (a, b) =>
          b.value - a.value
      )
      .slice(0, 5);

  const citasHoy = citas
    .filter(c => esHoy(c.fecha))
    .sort(
      (a, b) =>
        parseFechaLocal(a.fecha) -
        parseFechaLocal(b.fecha)
    );

  const clientesHoy =
    clientes.filter(c =>
      esHoy(c.created_at)
    ).length;

  const cantidadCitasHoy =
    citasHoy.length;

  let pagadoHoy = 0;
  let pendienteHoy = 0;

  let totalMes = 0;
  let caja = 0;
  let gananciaBruta = 0;
  let gananciaNeta = 0;
  let totalCostos = 0;


  ingresos.forEach(i => {

    const servicios =
      i.servicios || [];

    const subtotal =
      servicios.reduce(
        (acc, s) => acc + s.monto,
        0
      );

    const costos =
      servicios.reduce(
        (acc, s) =>
          acc + Number(s.costo_servicio || 0),
        0
      );

    const itbis =
      subtotal * 0.18;

    const descuento =
      subtotal *
      ((i.descuento || 0) / 100);

    const total =
      subtotal + itbis - descuento;

    totalCostos += costos;

    if (i.pagado) {

      caja += total;

      gananciaBruta += (
        total - costos
      );

    }

    if (esHoy(i.created_at)) {

      if (i.pagado) {
        pagadoHoy += total;
      } else {
        pendienteHoy += total;
      }

    }

    if (i.created_at) {

      const fecha =
        parseFechaLocal(i.created_at);

      if (
        fecha.getMonth() === mesActual &&
        fecha.getFullYear() === anioActual
      ) {

        totalMes += total;

      }

    }

  });

  const totalEgresos =
    egresos.reduce(
      (acc, e) =>
        acc + Number(e.monto || 0),
      0
    );

  gananciaNeta =
    gananciaBruta - totalEgresos;

  /*
  ==========================================
  TOAST
  ==========================================
  */

  useEffect(() => {

    const pendientes =
      citasHoy.filter(
        c => c.estado === "pendiente"
      );

    if (pendientes.length > 0) {

      showSuccess(
        `Tienes ${pendientes.length} cita(s) pendiente(s) hoy 📅`,
        {
          id: "toast-citas-hoy"
        }
      );

    }

  }, [citasHoy.length]);

  /*
  ==========================================
  FORMAT
  ==========================================
  */

  const formato = (n) =>
    `RD$ ${formatMoney(n)}`;

  /*
  ==========================================
  KPIS
  ==========================================
  */

  const kpis = [
    {
      title: "Caja",
      value: formato(caja),
      color: "text-emerald-600",
      bg: "from-emerald-500/10 to-emerald-400/10",
      icon: Wallet
    },

    {
      title: "Ganancia Bruta",
      value: formato(gananciaBruta),
      color: "text-sky-800",
      bg: "from-sky-500/10 to-sky-800/10",
      icon: TrendingUp
    },

    {
      title: "Costos Servicios",
      value: formato(totalCostos),
      color: "text-rose-500",
      bg: "from-rose-500/10 to-pink-500/10",
      icon: Receipt
    },
    {
      title: "Egresos",
      value: formato(totalEgresos),
      color: "text-rose-600",
      bg: "from-rose-500/10 to-red-500/10",
      icon: Banknote
    },
    {
      title: "Clientes hoy",
      value: clientesHoy,
      color: "text-cyan-600",
      bg: "from-cyan-500/10 to-teal-500/10",
      icon: Users
    },
    {
      title: "Citas hoy",
      value: cantidadCitasHoy,
      color: "text-amber-600",
      bg: "from-amber-500/10 to-yellow-500/10",
      icon: CalendarDays
    }
  ];

  const getActividadIcon = (tipo) => {

    const icons = {
      factura: Receipt,
      cliente: Users,
      cita: CalendarDays,
      egreso: Banknote,
      backup: ClipboardList,
      servicio: ClipboardList,
      historial: ClipboardList,
      odontograma: ClipboardList,
      tratamiento: Activity,
      usuario: UserCheck,
      reporte: BarChart3
    };

    return icons[tipo] || Activity;

  };

  const getActividadColor = (tipo) => {

    const colors = {
      factura: "text-emerald-500",
      cliente: "text-cyan-500",
      cita: "text-amber-500",
      egreso: "text-rose-500",
      backup: "text-sky-700",
      servicio: "text-sky-600",
      historial: "text-violet-500",
      odontograma: "text-blue-600",
      tratamiento: "text-emerald-600",
      usuario: "text-slate-600",
      reporte: "text-indigo-500"
    };

    return colors[tipo] || "text-slate-500";

  };

  const getActividadBg = (tipo) => {

    const colors = {
      factura: "bg-emerald-50",
      cliente: "bg-cyan-50",
      cita: "bg-amber-50",
      egreso: "bg-rose-50",
      backup: "bg-sky-50",
      servicio: "bg-sky-50",
      historial: "bg-violet-50",
      odontograma: "bg-blue-50",
      tratamiento: "bg-emerald-50",
      usuario: "bg-slate-100",
      reporte: "bg-indigo-50"
    };

    return colors[tipo] || "bg-slate-100";

  };


  /*
  ==========================================
  ACTIVIDAD
  ==========================================
  */
  const actividades = Array.isArray(actividadesSistema)
    ? actividadesSistema
      .map((a) => {

        const fecha =
          parseFechaLocal(
            a.created_at
          );

        return {

          id:
            a.id,

          tipo:
            a.tipo || "sistema",

          accion:
            a.accion || "",

          fecha,

          icon:
            getActividadIcon(
              a.tipo
            ),

          title:
            a.titulo ||
            "Actividad registrada",

          desc:
            a.descripcion || "",

          usuario:
            a.usuario || "Sistema",

          time:
            fecha
              ? formatFecha(fecha)
              : ""

        };

      })
      .filter((a) => {

        if (!a.fecha) {
          return false;
        }

        return !Number.isNaN(
          a.fecha.getTime()
        );

      })
      .sort(
        (a, b) =>
          b.fecha.getTime() -
          a.fecha.getTime()
      )
      .slice(0, 10)
    : [];

  /*
  ==========================================
  COLLAPSE BUTTON
  ==========================================
  */

  const collapseButton = (
    show,
    action
  ) => (

    <button
      onClick={action}
      className="
        group

        relative

        overflow-hidden

        w-9
        h-9

        rounded-xl

        border
        border-slate-200/80

        bg-white/90
        backdrop-blur-md

        shadow-[0_8px_20px_rgba(0,0,0,0.05)]

        hover:border-sky-200

        transition-all
        duration-300

        flex
        items-center
        justify-center
      "
    >

      <div className="
        w-7
        h-7

        rounded-lg

        
bg-gradient-to-br
from-sky-700
to-sky-900


        flex
        items-center
        justify-center
      ">

        <span className={`
          text-white
          text-xs
          font-black

          transition-transform
          duration-300

          ${show
            ? "rotate-0"
            : "-rotate-90"}
        `}>
          ⌄
        </span>

      </div>

    </button>

  );

  const citasMock = [

    {
      paciente: "Pedro Díaz",
      inicio: "2026-06-08T08:00:00",
      fin: "2026-06-08T09:00:00"
    },

    {
      paciente: "Ney Martinez",
      inicio: "2026-06-08T10:00:00",
      fin: "2026-06-08T11:00:00"
    },

    {
      paciente: "Carlos Pérez",
      inicio: "2026-06-09T13:00:00",
      fin: "2026-06-09T14:00:00"
    }

  ];
  /*
  ==========================================
  LOADING
  ==========================================
  */


  if (
    clientesLoading ||
    ingresosLoading ||
    citasLoading ||
    egresosLoading ||
    actividadesLoading
  ) {


    return (

      <PageWrapper>

        <div className="space-y-6">

          <SkeletonLoader alto="h-10" />

          <div className="
            grid
            grid-cols-3
            gap-4
          ">

            <SkeletonLoader alto="h-28" />
            <SkeletonLoader alto="h-28" />
            <SkeletonLoader alto="h-28" />

          </div>

          <SkeletonLoader lineas={8} />

        </div>

      </PageWrapper>

    );

  }





  /*
  ==========================================
  RETURN
  ==========================================
  */

  return (

    <PageWrapper>
      <motion.div
        key="/"

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

            <div>

              <div className="
              inline-flex

              items-center
              gap-3

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

                <BarChart3 size={18} />

                Panel principal

              </div>

              <h1 className="
              text-3xl
              md:text-4xl

              font-black

              tracking-tight

              text-slate-800
            ">

                Dashboard clínico

              </h1>

              <p className="
              mt-2

              text-sm
              sm:text-base

              text-slate-500
            ">
                Resumen financiero y operativo de la clínica
              </p>

            </div>

            {/* DATE */}

            <div className="
            self-start
            md:self-auto

            
bg-white
dark:bg-slate-900

text-slate-800
dark:text-slate-100

border-slate-200
dark:border-slate-800


            rounded-[26px]

            px-5
            py-4

            shadow-[0_10px_30px_rgba(0,0,0,0.04)]
          ">

              <p className="
              text-xs

              uppercase

              tracking-[0.14em]

              font-black

              text-slate-400
            ">
                Fecha actual
              </p>

              <p className="
              mt-2

              text-sm

              font-semibold

              text-slate-700
            ">
                {formatFecha(new Date())}
              </p>

            </div>

          </div>

          {/* TOP GRID */}

          <div className="
          grid
          grid-cols-1
          xl:grid-cols-3

          gap-6
        ">

            {/* CITAS */}

            <div className="
            xl:col-span-2

            
bg-white
dark:bg-slate-900

text-slate-800
dark:text-slate-100

border-slate-200
dark:border-slate-800


            rounded-[34px]

            p-6

            shadow-[0_10px_30px_rgba(0,0,0,0.05)]

            space-y-6
          ">

              <div className="
              flex
              items-center
              justify-between
            ">

                <div>



                  <div className="
  inline-flex
  items-center
  gap-2

  px-4
  py-2

  rounded-full

  bg-amber-50

  border
  border-amber-100

  text-amber-600

  text-sm
  font-black
">
                    <CalendarDays size={16} />
                    Citas de hoy
                  </div>



                  <p className="
                  mt-2

                  text-sm

                  text-slate-500
                ">
                    {cantidadCitasHoy} citas programadas
                  </p>

                </div>

                {collapseButton(
                  showCitas,
                  () =>
                    setShowCitas(!showCitas)
                )}

              </div>

              <div className={`
              overflow-hidden

              transition-all
              duration-500

              ${showCitas
                  ? "max-h-[1000px] opacity-100"
                  : "max-h-0 opacity-0"}
            `}>

                {citasHoy.length === 0 ? (

                  <div className="
                  h-[220px]

                  rounded-[30px]

                  bg-slate-50/70

                  border
                  border-slate-200/70

                  flex
                  items-center
                  justify-center
                ">

                    <p className="
                    text-slate-500

                    font-medium
                  ">
                      No hay citas programadas hoy ✅
                    </p>

                  </div>

                ) : (

                  <div className="
  grid
  sm:grid-cols-2
  2xl:grid-cols-3

  gap-4

  max-h-[430px]
  overflow-y-auto

  pr-1

  scrollbar-thin
  scrollbar-thumb-sky-200/70
  scrollbar-track-transparent
">

                    {citasHoy.map(c => {

                      const estado =
                        getEstado(c);

                      const detalleCita =
                        getDetalleCita(c);

                      const tratamientoTexto =
                        getTratamientoTexto(c);

                      const sesionesTexto =
                        getSesionesTexto(c);

                      const colorEstadoHora = {
                        completada: "text-emerald-600",
                        atrasada: "text-rose-600",
                        cancelada: "text-slate-500",
                        pendiente: "text-amber-600"
                      };

                      return (

                        <div
                          key={c.id}
                          className="
  relative
  overflow-hidden

  bg-slate-50/70

  border
  border-slate-200/80

  rounded-[28px]

  p-5

  shadow-[0_10px_30px_rgba(15,23,42,0.04)]

  hover:bg-white

  hover:border-sky-200

  hover:-translate-y-[2px]

  hover:shadow-[0_18px_40px_rgba(7,89,133,0.08)]

  transition-all
  duration-300
"
                        >

                          <div className="
                          relative
                          z-10

                          space-y-4
                        ">

                            <div className="
                            flex
                            items-center
                            justify-between
                          ">


                              <div className={`
  flex
  items-center
  gap-2

  font-bold

  ${colorEstadoHora[estado] || "text-slate-700"}
`}>


                                <Clock3 size={16} />

                                {formatHora(
                                  parseFechaLocal(c.fecha)
                                )}

                              </div>

                              <span className={`
                              text-xs

                              px-3
                              py-1

                              rounded-full

                              font-semibold

                              ${estado === "completada" &&
                                "bg-emerald-100 text-emerald-700"}

                              ${estado === "atrasada" &&
                                "bg-rose-100 text-rose-700"}

                              ${estado === "cancelada" &&
                                "bg-slate-100 text-slate-700"}

                              ${estado === "pendiente" && "bg-amber-100 text-amber-700"}
                            `}>

                                {estado}

                              </span>

                            </div>

                            <div>

                              <h4 className="
    
 text-base

  font-black

  text-slate-800

  ">
                                {c.cliente?.nombre}{" "}
                                {c.cliente?.apellido}
                              </h4>

                              {/* MOTIVO */}

                              <p className="
    
mt-1

  text-sm

  font-semibold

  text-slate-600

  ">
                                {c.motivo || "Sin motivo"}
                              </p>

                              {/* DETALLE */}

                              {detalleCita && (

                                <p className="
     
  mt-1

  text-xs

  leading-relaxed

  text-slate-400

    ">
                                  {detalleCita}
                                </p>

                              )}

                              {/* TRATAMIENTO */}

                              {c.tratamiento && (

                                <div className="
      mt-3

      flex
      flex-wrap

      items-center
      gap-2
    ">

                                  {tratamientoTexto && (

                                    <span className="
          inline-flex

          items-center
          gap-1.5

          px-3
          py-1.5

          rounded-full

          bg-sky-50

          border
          border-sky-100

          text-[11px]
          font-bold

          text-sky-800
        ">

                                      <ClipboardList size={12} />

                                      {tratamientoTexto}

                                    </span>

                                  )}

                                  {sesionesTexto && (

                                    <span className="
          inline-flex

          items-center
          gap-1.5

          px-3
          py-1.5

          rounded-full

          bg-emerald-50

          border
          border-emerald-100

          text-[11px]
          font-bold

          text-emerald-600
        ">

                                      <Activity size={12} />

                                      {sesionesTexto}

                                    </span>

                                  )}

                                </div>

                              )}

                            </div>

                          </div>

                        </div>

                      );

                    })}

                  </div>

                )}

              </div>

            </div>

            {/* ACTIVIDAD */}

            <div className="
            bg-white/95
            backdrop-blur-md

            border
            border-slate-200/80

            rounded-[34px]

            p-6

            shadow-[0_10px_30px_rgba(0,0,0,0.05)]

            space-y-5
          ">

              <div>

                <div className="
                inline-flex

                items-center
                gap-2

                text-sky-800

                text-sm
                font-bold
              ">

                  <Activity size={18} />

                  Actividad reciente

                </div>

                <p className="
                mt-2

                text-sm

                text-slate-500
              ">
                  Últimos movimientos del sistema
                </p>

              </div>

              <div className="
              space-y-3

              max-h-[420px]

              overflow-y-auto

              pr-1
            ">

                {actividades.map((item, idx) => (

                  <div
                    key={idx}
                    className="
                    flex
                    items-start

                    gap-4

                    p-4

                    rounded-[24px]

                    border
                    border-transparent

                    hover:border-slate-200

                    hover:bg-slate-50/80

                    transition-all
                    duration-300
                  "
                  >


                    <div className={`
  w-11
  h-11

  rounded-[18px]

  ${getActividadBg(item.tipo)}

  flex
  items-center
  justify-center
  shrink-0
`}>



                      
<item.icon
  size={18}
  className={getActividadColor(item.tipo)}
/>



                    </div>

                    <div className="flex-1 min-w-0">

                      <div className="
                      flex
                      items-center
                      justify-between
                    ">

                        <p className="
                        text-sm

                        font-bold

                        text-slate-700
                      ">
                          {item.title}
                        </p>

                        <span className="
                        text-[11px]

                        font-semibold

                        text-slate-400
                      ">
                          {item.time}
                        </span>

                      </div>

                      <p className="
                      mt-1

                      text-xs

                      text-slate-500
                    ">
                        {item.desc}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>

          {/* QUICK ACTIONS */}

          <QuickActions />

          {/* Calendar */}

          <AgendaCalendar
            citas={citasMock}
          />



          {/* KPIS */}

          <div className="space-y-5">

            <div className="
            flex
            items-center
            justify-between
            
          ">

              <div>

                <div className="
                inline-flex

                items-center
                gap-2

                text-sky-800

                text-sm
                font-bold
              ">

                  <TrendingUp size={18} />

                  Resumen financiero

                </div>

                <p className="
                mt-2

                text-sm

                text-slate-500
              ">
                  Métricas principales de la clínica
                </p>

              </div>

              {collapseButton(
                showKpis,
                () =>
                  setShowKpis(!showKpis)
              )}

            </div>

            <div className={`
            overflow-hidden

            transition-all
            duration-500

            ${showKpis
                ? "max-h-[1200px] opacity-100"
                : "max-h-0 opacity-0"}
          `}>

              <div className="
              grid
              grid-cols-1
              sm:grid-cols-2
              xl:grid-cols-5

              gap-5
            ">

                {/* KPI PRINCIPAL */}

                <div className="
                xl:col-span-2

                relative
                overflow-hidden

                

bg-gradient-to-br
from-sky-700
via-sky-800
to-sky-900


                rounded-[34px]

                p-7

                shadow-[0_20px_50px_rgba(7,89,133,0.24)]

                min-h-[180px]

                flex
                flex-col
                justify-between
              ">

                  <div className="relative z-10">

                    <p className="
                    text-sm

                    text-sky-100
                  ">
                      Ganancia neta
                    </p>

                    <h2 className="
                    mt-4

                    text-4xl

                    font-black

                    tracking-tight

                    text-white
                  ">
                      {formato(gananciaNeta)}
                    </h2>

                  </div>

                  <div className="
                  relative
                  z-10

                  flex
                  items-center
                  justify-between
                ">

                    <div className="
                    px-3
                    py-1.5

                    rounded-full

                    bg-white/15

                    text-xs
                    font-semibold

                    text-white
                  ">
                      KPI principal
                    </div>

                    <Banknote
                      size={42}
                      className="text-white/90"
                    />

                  </div>

                </div>

                {/* KPIS SECUNDARIOS */}

                {kpis.map((kpi, idx) => (

                  <div
                    key={idx}
                    className="
                    relative
                    overflow-hidden

                    bg-white/95
                    backdrop-blur-md

                    border
                    border-slate-200/70

                    rounded-[30px]

                    p-5

                    shadow-[0_10px_30px_rgba(0,0,0,0.04)]

                    hover:-translate-y-[2px]

                    hover:shadow-[0_18px_40px_rgba(0,0,0,0.06)]

                    transition-all
                    duration-300

                    min-h-[135px]

                    flex
                    flex-col
                    justify-between
                  "
                  >


                    <div className={`
  w-12
  h-12
  rounded-[18px]
  bg-gradient-to-br
  ${kpi.bg}
  flex
  items-center
  justify-center
`}>


                      <kpi.icon
                        size={22}
                        className={kpi.color}
                      />

                    </div>

                    <div>

                      <p className="
                      text-sm

                      text-slate-500
                    ">
                        {kpi.title}
                      </p>

                      <p className={`
                      mt-2

                      text-2xl

                      font-black

                      tracking-tight

                      ${kpi.color}
                    `}>

                        {kpi.value}

                      </p>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>
          <RevenueChart
            data={revenueData}
          />  <div className="
  grid
  grid-cols-1
  xl:grid-cols-3

  gap-6
">

            <div className="xl:col-span-2">

              <FinanceChart
                data={financeData}
              />

            </div>

            <ServicesChart
              data={servicesData}
            />

          </div>

          <SmartInsights

            ingresos={caja}
            egresos={totalEgresos}
            citasHoy={cantidadCitasHoy}
            topServicio={
              servicesData[0]?.name ||
              "N/A"
            }

          />
          {/* ANALYTICS */}

          <div className="space-y-5">

            <div className="
            flex
            items-center
            justify-between
          ">

              <div>

                <div className="
                inline-flex

                items-center
                gap-2

                text-sky-800

                text-sm
                font-bold
              ">

                  <BarChart3 size={18} />

                  Analíticas

                </div>

                <p className="
                mt-2

                text-sm

                text-slate-500
              ">
                  Tendencias y rendimiento general
                </p>

              </div>

              {collapseButton(
                showCharts,
                () =>
                  setShowCharts(!showCharts)
              )}

            </div>

            <div className={`
            overflow-hidden

            transition-all
            duration-500

            ${showCharts
                ? "max-h-[3000px] opacity-100"
                : "max-h-0 opacity-0"}
          `}>

              <div className="
              grid
              grid-cols-1
              xl:grid-cols-3

              gap-6
            ">

                {/* INGRESOS */}

                <div className="
                xl:col-span-2

                bg-white/90
                backdrop-blur-md

                border
                border-slate-200/70

                rounded-[34px]

                p-6

                shadow-[0_10px_30px_rgba(0,0,0,0.05)]

                h-[520px]
              ">

                  <div className="
                  flex
                  items-center
                  justify-between

                  mb-6
                ">

                    <div>

                      <div className="
                      inline-flex
                      items-center
                      gap-2

                      text-sky-800

                      text-sm
                      font-bold
                    ">

                        <TrendingUp size={18} />

                        Ingresos y egresos

                      </div>

                      <p className="
                      mt-2

                      text-sm

                      text-slate-500
                    ">
                        Rendimiento financiero mensual
                      </p>

                    </div>

                    <div className="
                    px-4
                    py-3

                    rounded-[22px]

                    
bg-sky-500/10

border
border-sky-100

                  ">

                      <p className="
                      text-[11px]

                      uppercase

                      tracking-[0.12em]

                      font-black

                     text-sky-500
                    ">
                        Ganancia neta
                      </p>

                      <p className="
                      mt-1

                      text-lg

                      font-black
text-sky-800
                    ">
                        {formato(gananciaNeta)}
                      </p>

                    </div>

                  </div>

                  <div className="h-[420px]">

                    <GraficoIngresos
                      ingresos={ingresos}
                      egresos={egresos}
                    />

                  </div>

                </div>

                {/* RIGHT SIDE */}

                <div className="
                flex
                flex-col

                gap-6
              ">

                  {/* CLIENTES */}

                  <div className="
                  bg-white/90
                  backdrop-blur-md

                  border
                  border-slate-200/70

                  rounded-[34px]

                  p-6

                  shadow-[0_10px_30px_rgba(0,0,0,0.05)]

                  h-[250px]
                ">

                    <div className="
                    flex
                    items-start
                    justify-between

                    mb-5
                  ">

                      <div>

                        <div className="
                        inline-flex
                        items-center
                        gap-2

                        text-cyan-600

                        text-sm
                        font-bold
                      ">

                          <Users size={18} />

                          Clientes

                        </div>

                        <p className="
                        mt-2

                        text-sm

                        text-slate-500
                      ">
                          Distribución de pacientes
                        </p>

                      </div>

                      <div className="text-right">

                        <p className="
                        text-2xl

                        font-black

                        text-slate-800
                      ">
                          {clientes.length}
                        </p>

                        <p className="
                        text-xs

                        text-emerald-500

                        font-semibold
                      ">
                          +12% este mes
                        </p>

                      </div>

                    </div>

                    <div className="h-[150px]">

                      <GraficoClientes
                        clientes={clientes}
                      />

                    </div>

                  </div>

                  {/* CITAS */}

                  <div className="
                  bg-white/90
                  backdrop-blur-md

                  border
                  border-slate-200/70

                  rounded-[34px]

                  p-6

                  shadow-[0_10px_30px_rgba(0,0,0,0.05)]

                  h-[250px]
                ">

                    <div className="
                    flex
                    items-start
                    justify-between

                    mb-5
                  ">

                      <div>

                        <div className="
                        inline-flex
                        items-center
                        gap-2

                        text-amber-600

                        text-sm
                        font-bold
                      ">

                          <CalendarDays size={18} />

                          Citas

                        </div>

                        <p className="
                        mt-2

                        text-sm

                        text-slate-500
                      ">
                          Rendimiento de consultas
                        </p>

                      </div>

                      <div className="text-right">

                        <p className="
                        text-2xl

                        font-black

                        text-slate-800
                      ">
                          {citas.length}
                        </p>

                        <p className="
                        text-xs

                        text-amber-500

                        font-semibold
                      ">
                          +8% mensual
                        </p>

                      </div>

                    </div>

                    <div className="h-[150px]">

                      <GraficoCitas
                        citas={citas}
                      />

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </motion.div>
    </PageWrapper>

  );

}

export default DashboardHome;