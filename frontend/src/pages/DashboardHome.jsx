import { useClientes } from "../hooks/useClientes";
import { useIngresos } from "../hooks/useIngresos";
import { useCitas } from "../hooks/useCitas";
import { useEgresos } from "../hooks/useEgresos";
import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import { formatFecha, formatHora, parseFechaLocal } from "../utils/fecha";
import { formatMoney } from "../utils/format";

import GraficoIngresos from "../components/graficos/GraficoIngresos";
import GraficoClientes from "../components/graficos/GraficoClientes";
import GraficoCitas from "../components/graficos/GraficoCitas";

import PageWrapper from "../components/PageWrapper";
import SkeletonLoader from "../components/SkeletonLoader";

function DashboardHome() {

  const { clientes, isLoading: clientesLoading } = useClientes();

  const { ingresos, isLoading: ingresosLoading } = useIngresos();

  const { egresos, isLoading: egresosLoading } = useEgresos();

  const { citas = [], isLoading: citasLoading } = useCitas();

  const [showCitas, setShowCitas] = useState(true);

  const [showKpis, setShowKpis] = useState(true);

  const [showCharts, setShowCharts] = useState(true);

  const [kpiIndex, setKpiIndex] = useState(0);

  const ahora = new Date();

  const esHoy = (fechaStr) => {

    if (!fechaStr) return false;

    const fecha = parseFechaLocal(fechaStr);

    return (
      fecha.getDate() === ahora.getDate() &&
      fecha.getMonth() === ahora.getMonth() &&
      fecha.getFullYear() === ahora.getFullYear()
    );

  };

  const [pauseSlider, setPauseSlider] = useState(false);

  const getEstado = (c) => {

    if (c.estado === "cancelada") return "cancelada";

    if (c.estado === "completada") return "completada";

    const fecha = parseFechaLocal(c.fecha);

    if (fecha < ahora) return "atrasada";

    return "pendiente";

  };

  const citasHoy = citas
    .filter(c => esHoy(c.fecha))
    .sort((a, b) => parseFechaLocal(a.fecha) - parseFechaLocal(b.fecha));

  const pendientes = citas.filter(c => getEstado(c) === "pendiente").length;

  const atrasadas = citas.filter(c => getEstado(c) === "atrasada").length;

  const completadas = citas.filter(c => getEstado(c) === "completada").length;

  const canceladas = citas.filter(c => getEstado(c) === "cancelada").length;

  const clientesHoy = clientes.filter(c => esHoy(c.created_at)).length;

  const cantidadCitasHoy = citasHoy.length;

  let pagadoHoy = 0;
  let pendienteHoy = 0;
  let facturasHoy = 0;

  let totalMes = 0;
  let caja = 0;
  let gananciaBruta = 0;
  let gananciaNeta = 0;
  let totalCostos = 0;
  let totalEgresos = 0;

  const mesActual = ahora.getMonth();

  const anioActual = ahora.getFullYear();

  ingresos.forEach(i => {

    const servicios = i.servicios || [];

    const subtotal = servicios.reduce(
      (acc, s) => acc + s.monto,
      0
    );

    const costos = servicios.reduce(
      (acc, s) =>
        acc + Number(s.costo_servicio || 0),
      0
    );

    const itbis = subtotal * 0.18;

    const descuento =
      subtotal * ((i.descuento || 0) / 100);

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

      facturasHoy++;

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

  totalEgresos = egresos.reduce(
    (acc, e) =>
      acc + Number(e.monto || 0),
    0
  );

  gananciaNeta =
    gananciaBruta - totalEgresos;

  useEffect(() => {

    const citasPendientesHoy =
      citasHoy.filter(
        c => c.estado === "pendiente"
      );

    if (citasPendientesHoy.length > 0) {

      toast.success(
        `Tienes ${citasPendientesHoy.length} cita(s) pendiente(s) hoy 📅`,
        { id: "toast-citas-hoy" }
      );

    }

  }, [citasHoy.length]);

  const formato = (n) =>
    `RD$ ${formatMoney(n)}`;

  const kpis = [
    {
      title: "Caja",
      value: formato(caja),
      color: "text-green-600",
      icon: "💵",
      tint: "from-emerald-500/15 via-emerald-500/5 to-white/30"
    },
    {
      title: "Ganancia Bruta",
      value: formato(gananciaBruta),
      color: "text-blue-600",
      icon: "📈",

      tint: "from-blue-500/15 via-blue-500/5 to-white/30"

    },
    {
      title: "Costos Servicios",
      value: formato(totalCostos),
      color: "text-red-500",
      icon: "🧾",
      tint: "from-rose-500/15 via-rose-500/5 to-white/30"
    },
    {
      title: "Egresos",
      value: formato(totalEgresos),
      color: "text-rose-500",
      icon: "💸",
      tint: "from-pink-500/15 via-pink-500/5 to-white/30"
    },
    {
      title: "Clientes hoy",
      value: clientesHoy,
      color: "text-slate-700",
      icon: "👤",
      tint: "from-indigo-500/15 via-indigo-500/5 to-white/30"
    },
    {
      title: "Citas hoy",
      value: cantidadCitasHoy,
      color: "text-indigo-600",
      icon: "📅",
      tint: "from-indigo-500/10 to-white/40"
    },
    {
      title: "Pagado hoy",
      value: formato(pagadoHoy),
      color: "text-green-600",
      icon: "💰",
      tint: "from-emerald-500/15 via-emerald-500/5 to-white/30"
    },
    {
      title: "Pendiente",
      value: formato(pendienteHoy),
      color: "text-red-500",
      icon: "⚠️",
      tint: "from-rose-500/15 via-rose-500/5 to-white/30"
    },
    {
      title: "Facturas",
      value: facturasHoy,
      color: "text-purple-600",
      icon: "🧾",
      tint: "from-indigo-500/15 via-indigo-500/5 to-white/30"
    },
    {
      title: "Mes",
      value: formato(totalMes),
      color: "text-blue-600",
      icon: "📊",
      tint: "from-blue-500/15 via-blue-500/5 to-white/30"
    }
  ];

  useEffect(() => {

    if (!showKpis || pauseSlider) return;

    const interval = setInterval(() => {

      setKpiIndex(prev => {

        const totalSlides =
          Math.ceil(kpis.length / 3);

        return (
          prev + 1
        ) % totalSlides;

      });

    }, 6500);

    return () =>
      clearInterval(interval);

  }, [showKpis, kpis.length]);

  const cardKpi = (tint) => `
  relative
  overflow-hidden

  bg-gradient-to-br
  ${tint}

  backdrop-blur-xl

  border
  border-white/40

  rounded-[30px]

  p-6

  shadow-[0_10px_30px_rgba(0,0,0,0.06)]

  hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]

  hover:-translate-y-[2px]
  hover:scale-[1.015]

  transition-all
  duration-300

  flex
  justify-between
  items-center

  min-h-[130px]
`;

  const collapseButton = (show, action) => (

    <button
      onClick={action}
      className="
      group

      relative

      overflow-hidden

      h-11

      px-4

      rounded-2xl

      border border-white/50

      bg-white/70
      backdrop-blur-xl

      shadow-[0_8px_25px_rgba(0,0,0,0.06)]

      hover:shadow-[0_15px_35px_rgba(99,102,241,0.18)]

      hover:border-indigo-200

      transition-all duration-300

      hover:scale-[1.03]

      flex items-center gap-2
    "
    >

      <div className="
      absolute inset-0

      opacity-0

      bg-gradient-to-r
      from-indigo-500/10
      via-purple-500/10
      to-fuchsia-500/10

      group-hover:opacity-100

      transition-all duration-500
    " />

      <div className="
      relative z-10

      w-7 h-7

      rounded-xl

      bg-gradient-to-br
      from-indigo-500
      to-purple-500

      shadow-lg shadow-indigo-200/50

      flex items-center justify-center
    ">

        <span className={`
        text-white text-xs font-black

        transition-transform duration-300

        ${show ? "rotate-0" : "-rotate-90"}
      `}>
          ⌄
        </span>

      </div>

      <span className="
      relative z-10

      text-sm font-semibold

      text-slate-600

      group-hover:text-slate-800

      transition-colors duration-300
    ">
        {show ? "" : ""}
      </span>

    </button>

  );

  if (
    clientesLoading ||
    ingresosLoading ||
    citasLoading ||
    egresosLoading
  ) {

    return (

      <PageWrapper>

        <div className="space-y-6">

          <SkeletonLoader alto="h-10" />

          <div className="grid grid-cols-3 gap-4">

            <SkeletonLoader alto="h-28" />
            <SkeletonLoader alto="h-28" />
            <SkeletonLoader alto="h-28" />

          </div>

          <SkeletonLoader lineas={8} />

        </div>

      </PageWrapper>

    );

  }

  return (

    <PageWrapper>

      <div className="w-full space-y-10 px-2 sm:px-4">

        {/* HEADER */}
        <div className="text-center space-y-3 pt-2">

          <h1 className="text-4xl md:text-5xl font-black tracking-tight">

            <span className="bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent">
              Dashboard
            </span>

            <span className="ml-2">
              📊
            </span>

          </h1>

          <div className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-indigo-500" />

          <p className="text-sm sm:text-base text-gray-500 font-medium">
            Resumen financiero y operativo
          </p>

          <p className="text-xs sm:text-sm text-gray-400">
            {formatFecha(new Date())}
          </p>

        </div>

        {/* ESTADOS */}
        {/* <div className="flex flex-wrap justify-center gap-3 text-sm">

          <span className="
  bg-yellow-500/10
  backdrop-blur-xl

  text-yellow-700

  border
  border-yellow-200/40

  px-4
  py-2

  rounded-full

  font-semibold

  shadow-[0_8px_25px_rgba(0,0,0,0.05)]

  transition-all
  duration-300

  hover:scale-[1.03]
">
            🟡 {pendientes}
          </span>

          <span className="bg-red-100 text-red-700 border border-red-200 px-4 py-1.5 rounded-full font-medium shadow-sm">
            🔴 {atrasadas}
          </span>

          <span className="bg-green-100 text-green-700 border border-green-200 px-4 py-1.5 rounded-full font-medium shadow-sm">
            ✅ {completadas}
          </span>

          <span className="bg-gray-100 text-gray-700 border border-gray-200 px-4 py-1.5 rounded-full font-medium shadow-sm">
            ⛔ {canceladas}
          </span>

        </div> */}

        {/* CITAS */}
        <div className="bg-gradient-to-br from-white to-yellow-50/40 backdrop-blur-xl border border-white/40 shadow-[0_10px_30px_rgba(0,0,0,0.06)] rounded-[32px] p-6 space-y-5">

          <div className="flex items-center justify-between gap-4">

            <div>

              <h3 className="font-bold text-lg text-slate-800">
                📅 Citas de hoy
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                {cantidadCitasHoy} citas programadas
              </p>

            </div>

            {collapseButton(
              showCitas,
              () => setShowCitas(!showCitas)
            )}

          </div>

          <div className={`
            overflow-hidden transition-all duration-500
            ${showCitas
              ? "max-h-[1000px] opacity-100"
              : "max-h-0 opacity-0"}
          `}>

            {citasHoy.length === 0 ? (

              <div className="
  relative
  overflow-hidden

  h-40

  flex
  items-center
  justify-center

  rounded-[30px]

  bg-white/70
  backdrop-blur-xl

  border
  border-white/40

  shadow-[0_10px_30px_rgba(0,0,0,0.05)]
">


                <p className="text-gray-500">
                  No hay citas hoy ✅
                </p>

              </div>

            ) : (

              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[360px] overflow-y-auto pr-1">

                {citasHoy.map(c => {

                  const estado = getEstado(c);

                  return (

                    <div
                      key={c.id}
                      className="
    relative
    overflow-hidden

    bg-white/90
    backdrop-blur-xl

    border
    border-white/40

    rounded-[30px]

    p-5

    shadow-[0_10px_30px_rgba(0,0,0,0.06)]

    hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]

    hover:-translate-y-[2px]
    hover:scale-[1.01]

    transition-all
    duration-300
  "
                    >
                      <div className="
  absolute
  -top-10
  -right-10

  w-32
  h-32

  rounded-full

  bg-indigo-500/10

  blur-3xl
" />
                      <div className="space-y-3">

                        <div className="flex items-center justify-between">

                          <p className="font-bold text-slate-700">
                            🕒 {formatHora(parseFechaLocal(c.fecha))}
                          </p>

                          <span className={`
                            text-xs px-3 py-1 rounded-full font-medium shadow-sm
                            ${estado === "completada" && "bg-green-100 text-green-700 border border-green-200"}
                            ${estado === "atrasada" && "bg-red-100 text-red-700 border border-red-200"}
                            ${estado === "cancelada" && "bg-gray-100 text-gray-700 border border-gray-200"}
                            ${estado === "pendiente" && "bg-yellow-100 text-yellow-700 border border-yellow-200"}
                          `}>
                            {estado}
                          </span>

                        </div>

                        <div>

                          <p className="font-semibold text-slate-800">
                            {c.cliente?.nombre} {c.cliente?.apellido}
                          </p>

                          <p className="text-sm text-gray-500 mt-1">
                            {c.motivo}
                          </p>

                        </div>

                      </div>

                    </div>

                  );

                })}

              </div>

            )}

          </div>

        </div>

        {/* KPIS */}
        <div className="space-y-5">

          <div className="flex items-center justify-between">

            <div>

              <h3 className="text-xl font-bold text-slate-800">
                📈 Resumen financiero
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Métricas principales del negocio
              </p>

            </div>

            {collapseButton(
              showKpis,
              () => setShowKpis(!showKpis)
            )}

          </div>

          <div className={`
            overflow-hidden transition-all duration-500
            ${showKpis
              ? "max-h-[1200px] opacity-100"
              : "max-h-0 opacity-0"}
          `}>

            <div className="
  grid
  xl:grid-cols-[1.2fr_2fr]
  gap-5
">

              {/* KPI PRINCIPAL */}
              <div className="
    relative

    overflow-hidden

    bg-gradient-to-br
    from-indigo-500
    via-purple-500
    to-violet-600

    rounded-[32px]

    p-7

    shadow-[0_20px_50px_rgba(99,102,241,0.28)]

    min-h-[170px]

    flex flex-col justify-between
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
        font-medium

        text-purple-100
      ">
                    Ganancia Neta
                  </p>

                  <h2 className="
        mt-3

        text-4xl xl:text-5xl

        font-black

        text-white

        tracking-tight
      ">
                    {formato(gananciaNeta)}
                  </h2>

                </div>

                <div className="
      relative z-10

      flex items-center justify-between
    ">

                  <div className="
        px-3 py-1.5

        rounded-full

        bg-white/15

        border border-white/10

        text-xs font-semibold

        text-white/90
      ">
                    KPI principal
                  </div>

                  <span className="
        text-5xl

        opacity-90
      ">
                    🏦
                  </span>

                </div>

              </div>

              {/* SLIDER */}

              <div
                className="
    overflow-hidden
    relative
  "

                onMouseEnter={() =>
                  setPauseSlider(true)
                }

                onMouseLeave={() =>
                  setPauseSlider(false)
                }
              >


                <div
                  className="
        flex

        transition-transform
        duration-700
        ease-in-out
      "
                  style={{
                    transform: `translateX(-${kpiIndex * 100}%)`
                  }}
                >

                  {Array.from({
                    length: Math.ceil(kpis.length / 3)
                  }).map((_, slideIndex) => (

                    <div
                      key={slideIndex}
                      className="
            min-w-full

            grid
            grid-cols-1
            md:grid-cols-3

            gap-4
          "
                    >

                      {kpis
                        .slice(
                          slideIndex * 3,
                          slideIndex * 3 + 3
                        )
                        .map((kpi, idx) => (

                          <div
                            key={idx}
                            className={cardKpi()}
                          >


                            <div
                              className={`
    absolute
    inset-0

    opacity-80

    bg-gradient-to-br

    ${kpi.tint}
  `}
                            />


                            <div className="relative z-10">

                              <p className="
                    text-xs
                    text-gray-500
                  ">
                                {kpi.title}
                              </p>

                              <p className={`
                    text-2xl md:text-3xl
                    font-black
                    mt-1

                    ${kpi.color}
                  `}>
                                {kpi.value}
                              </p>

                            </div>


                            <span className="
  relative z-10

  text-3xl
  opacity-80
">

                              {kpi.icon}
                            </span>

                          </div>

                        ))}

                    </div>

                  ))}

                </div>

                {/* INDICADORES */}
                <div className="
      flex justify-center gap-2 mt-5
    ">

                  {Array.from({
                    length: Math.ceil(kpis.length / 3)
                  }).map((_, idx) => (

                    <button
                      key={idx}

                      onClick={() =>
                        setKpiIndex(idx)
                      }

                      className={`
            h-2.5 rounded-full

            transition-all duration-300

            ${kpiIndex === idx
                          ? "w-8 bg-gradient-to-r from-indigo-500 to-purple-500"
                          : "w-2.5 bg-gray-300 hover:bg-gray-400"}
          `}
                    />

                  ))}

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* GRAFICOS */}
       {/* GRAFICOS */}
<div className="space-y-5">

  <div className="flex items-center justify-between">

    <div>

      <h3 className="text-xl font-bold text-slate-800">
        📊 Analíticas
      </h3>

      <p className="text-sm text-gray-500 mt-1">
        Visualización de tendencias y rendimiento
      </p>

    </div>

    {collapseButton(
      showCharts,
      () => setShowCharts(!showCharts)
    )}

  </div>

  <div className={`
    overflow-hidden transition-all duration-500
    ${showCharts
      ? "max-h-[3000px] opacity-100"
      : "max-h-0 opacity-0"}
  `}>

    <div className="grid gap-6 xl:grid-cols-3 pt-1">

      {[
        {
          title: "📈 Ingresos",
          tint: `
            from-indigo-500/10
            via-indigo-500/5
            to-transparent
          `,
          glow: "bg-indigo-500/5",
          component: (
            <GraficoIngresos
              ingresos={ingresos}
              egresos={egresos}
            />
          )
        },
        {
          title: "👥 Clientes",
          tint: `
            from-emerald-500/10
            via-emerald-500/5
            to-transparent
          `,
          glow: "bg-emerald-500/5",
          component: (
            <GraficoClientes
              clientes={clientes}
            />
          )
        },
        {
          title: "📅 Citas",
          tint: `
            from-orange-500/10
            via-orange-500/5
            to-transparent
          `,
          glow: "bg-orange-500/5",
          component: (
            <GraficoCitas
              citas={citas}
            />
          )
        }
      ].map((g, idx) => (

        <div
          key={idx}
          className="
            relative
            overflow-hidden

            bg-white/85
            backdrop-blur-xl

            border
            border-white/40

            rounded-[32px]

            p-6

            shadow-[0_10px_30px_rgba(0,0,0,0.06)]

            hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]

            hover:-translate-y-[2px]
            hover:scale-[1.01]

            transition-all
            duration-300

            h-[500px]

            flex
            flex-col
          "
        >

          {/* TINT */}
          <div
            className={`
              absolute
              inset-0

              opacity-40

              bg-gradient-to-br

              ${g.tint}
            `}
          />

          {/* GLOW */}
          <div
            className={`
              absolute
              -top-12
              -right-12

              w-44
              h-44

              rounded-full

              blur-3xl

              ${g.glow}
            `}
          />

          {/* HEADER */}
          <div className="
            relative
            z-10

            mb-5

            text-center
          ">

            <h3 className="
              text-sm

              font-black

              tracking-wide

              text-slate-700
            ">
              {g.title}
            </h3>

          </div>

          {/* CHART */}
          <div className="
            relative
            z-10

            flex-1

            min-h-0
          ">

            <div className="h-full w-full">
              {g.component}
            </div>

          </div>

        </div>

      ))}

    </div>

  </div>

</div>

      </div>

    </PageWrapper>

  );

}

export default DashboardHome;