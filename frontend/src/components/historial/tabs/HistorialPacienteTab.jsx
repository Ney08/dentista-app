import { useEffect, useState } from "react";

import { API_URL } from "../../../config";

import {
  ClipboardClock,
  CalendarDays,
  ClockPlus,
  Clock3,
  Receipt,
  ClipboardList,
  Activity,
  FileText,
  BadgeDollarSign,
  SmilePlus,
  X,
  Sparkles,
  AlertCircle,
  Wallet
} from "lucide-react";

import BaseModal
  from "../../BaseModal";

import {
  formatFecha,
  parseFechaLocal
} from "../../../utils/fecha";

import {
  formatMoney
} from "../../../utils/format";

function HistorialPacienteTab({

  clienteId,

  cliente,

  historial = [],

  notas = [],

  citas: citasProp = [],

  ingresos: ingresosProp = [],

  tratamientos: tratamientosProp = [],

  odontograma: odontogramaProp = null

}) {

  /*
  ==========================================
  STATES
  ==========================================
  */

  const [
    eventoSeleccionado,
    setEventoSeleccionado
  ] = useState(null);

  const [
    citas,
    setCitas
  ] = useState(citasProp || []);

  const [
    ingresos,
    setIngresos
  ] = useState(ingresosProp || []);

  const [
    tratamientos,
    setTratamientos
  ] = useState(tratamientosProp || []);

  const [
    odontograma,
    setOdontograma
  ] = useState(odontogramaProp);

  const [
    loading,
    setLoading
  ] = useState(true);

  /*
  ==========================================
  ID PACIENTE
  ==========================================
  */

  const idPaciente =
    clienteId ||
    cliente?.id;

  /*
  ==========================================
  LOAD DATA
  ==========================================
  */

  useEffect(() => {

    const cargarDatosPaciente = async () => {

      if (!idPaciente) {
        setLoading(false);
        return;
      }

      try {

        setLoading(true);

        const [
          resCitas,
          resIngresos,
          resTratamientos,
          resOdontograma
        ] = await Promise.all([

          fetch(
            `${API_URL}/citas/`
          ),

          fetch(
            `${API_URL}/ingresos/`
          ),

          fetch(
            `${API_URL}/tratamientos/${idPaciente}`
          ),

          fetch(
            `${API_URL}/odontograma/${idPaciente}`
          )

        ]);

        const citasData =
          resCitas.ok
            ? await resCitas.json()
            : [];

        const ingresosData =
          resIngresos.ok
            ? await resIngresos.json()
            : [];

        const tratamientosData =
          resTratamientos.ok
            ? await resTratamientos.json()
            : [];

        const odontogramaData =
          resOdontograma.ok
            ? await resOdontograma.json()
            : null;

        setCitas(
          Array.isArray(citasData)
            ? citasData
            : []
        );

        console.log(
          "ODONTOGRAMA DATA:",
          odontogramaData
        );

        setIngresos(
          Array.isArray(ingresosData)
            ? ingresosData
            : []
        );

        setTratamientos(
          Array.isArray(tratamientosData)
            ? tratamientosData
            : []
        );

        setOdontograma(
          odontogramaData
        );

      } catch (error) {

        console.error(
          "ERROR CARGANDO HISTORIAL DEL PACIENTE:",
          error
        );

      } finally {

        setLoading(false);

      }

    };

    cargarDatosPaciente();

  }, [idPaciente]);

  /*
  ==========================================
  HELPERS
  ==========================================
  */

  const notasClinicas =
    notas.length > 0
      ? notas
      : historial;

  const cortarTexto = (
    texto,
    limite = 120
  ) => {

    if (!texto) return "";

    return texto.length > limite
      ? texto.slice(0, limite) + "..."
      : texto;

  };

  const getFechaEvento = (fecha) => {

    if (!fecha) {
      return null;
    }

    const parsed =
      parseFechaLocal(fecha);

    if (
      !parsed ||
      Number.isNaN(parsed.getTime())
    ) {
      return null;
    }

    return parsed;

  };

  const calcularTotalFactura = (ingreso) => {

    const servicios =
      ingreso.servicios || [];

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
      ((ingreso.descuento || 0) / 100);

    return (
      subtotal +
      itbis -
      descuento
    );

  };

  /*
  ==========================================
  FILTER DATA
  ==========================================
  */

  const citasCliente =
    (citas || []).filter(c => {

      const id =
        c?.cliente_id ||
        c?.cliente?.id;

      return (
        Number(id) ===
        Number(idPaciente)
      );

    });

  const ingresosCliente =
    (ingresos || []).filter(i => {

      const id =
        i?.cliente_id ||
        i?.cliente?.id;

      return (
        Number(id) ===
        Number(idPaciente)
      );

    });

  /*
  IMPORTANTE:
  El endpoint /tratamientos/{clienteId}
  ya devuelve solo los tratamientos del paciente.
  Por eso no hace falta filtrar otra vez si vienen sin cliente_id.
  */

  const tratamientosCliente =
    (tratamientos || []).filter(t => {

      if (!t) {
        return false;
      }

      if (t.cliente_id) {

        return (
          Number(t.cliente_id) ===
          Number(idPaciente)
        );

      }

      return true;

    });

  const notasCliente =
    (notasClinicas || []).filter(n => {

      const id =
        n?.cliente_id;

      return (
        Number(id) ===
        Number(idPaciente)
      );

    });

  /*
  ==========================================
  CÁLCULOS
  ==========================================
  */

  const citasCompletadas =
    citasCliente.filter(c =>
      c.estado === "completada"
    );

  const citasCanceladas =
    citasCliente.filter(c =>
      c.estado === "cancelada"
    );

  const tratamientosActivos =
    tratamientosCliente.filter(t =>
      t.estado !== "Completado"
    );

  const tratamientosCompletados =
    tratamientosCliente.filter(t =>
      t.estado === "Completado"
    );

  const piezasCompletadasReales =
    new Set(
      tratamientosCompletados
        .map(t => t.pieza)
        .filter(Boolean)
    );

  const cantidadCompletadas =
    piezasCompletadasReales.size;

  const piezasCompletadasTexto =
    [...piezasCompletadasReales]
      .join(", ");

  const totalPagado =
    ingresosCliente.reduce((acc, ingreso) => {

      const total =
        calcularTotalFactura(ingreso);

      return ingreso.pagado
        ? acc + total
        : acc;

    }, 0);

  const balancePendiente =
    tratamientosCliente.reduce((acc, t) => {

      const costo =
        Number(t.costo || 0);

      const pagado =
        Number(t.pagado || 0);

      const balance =
        Math.max(
          costo - pagado,
          0
        );

      return acc + balance;

    }, 0);

  const ultimaVisita =
    citasCompletadas
      .filter(c => c.fecha)
      .sort(
        (a, b) =>
          parseFechaLocal(b.fecha) -
          parseFechaLocal(a.fecha)
      )[0];

  const tieneOdontograma =
    odontograma &&
    Object.keys(odontograma || {}).length > 0;



  const piezasOdontograma =
    odontograma
      ? Object.entries(
        odontograma
      )
      : [];

  const cantidadPiezas =
    piezasOdontograma.length;

  const piezasTexto =
    piezasOdontograma
      .slice(0, 10)
      .map(([pieza]) => pieza)
      .join(", ");

  const piezasCompletadas =
    piezasOdontograma.filter(
      ([, datos]) => {

        return Object.values(
          datos || {}
        ).some(
          valor =>
            valor !== null &&
            valor !== ""
        );

      }
    ).length;

  /*
  ==========================================
  RESUMEN
  ==========================================
  */

  const resumen = [

    {
      label: "Citas",
      value: citasCliente.length,
      icon: CalendarDays,
      color: "text-amber-600",
      bg: "bg-amber-50"
    },

    {
      label: "Completadas",
      value: citasCompletadas.length,
      icon: Clock3,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },

    {
      label: "Canceladas",
      value: citasCanceladas.length,
      icon: AlertCircle,
      color: "text-rose-500",
      bg: "bg-rose-50"
    },

    {
      label: "Tratamientos activos",
      value: tratamientosActivos.length,
      icon: Activity,
      color: "text-sky-800",
      bg: "bg-sky-50"
    },

    {
      label: "Tratamientos completados",
      value: tratamientosCompletados.length,
      icon: ClipboardList,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },

    {
      label: "Facturas",
      value: ingresosCliente.length,
      icon: Receipt,
      color: "text-cyan-600",
      bg: "bg-cyan-50"
    },

    {
      label: "Pagado",
      value: `RD$ ${formatMoney(totalPagado)}`,
      icon: Wallet,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },

    {
      label: "Balance",
      value: `RD$ ${formatMoney(balancePendiente)}`,
      icon: BadgeDollarSign,
      color: "text-rose-500",
      bg: "bg-rose-50"
    },

    {
      label: "Notas clínicas",
      value: notasCliente.length,
      icon: FileText,
      color: "text-sky-800",
      bg: "bg-sky-50"
    },

    {
      label: "Odontograma",

      value: tieneOdontograma
        ? `${cantidadPiezas} piezas`
        : "Pendiente",

      icon: SmilePlus,

      color: tieneOdontograma
        ? "text-sky-800"
        : "text-slate-500",

      bg: tieneOdontograma
        ? "bg-sky-50"
        : "bg-slate-100"
    }

  ];





  /*
  ==========================================
  EVENTOS
  ==========================================
  */

  const eventos = [

    /*
    ==========================================
    NOTAS CLÍNICAS
    ==========================================
    */

    ...notasCliente.map(n => ({

      tipo:
        "nota",

      titulo:
        "Nota clínica",

      descripcion:
        n.descripcion ||
        "Nota sin descripción",

      fecha:
        getFechaEvento(
          n.created_at ||
          n.fecha
        ),

      icon:
        FileText,

      color:
        "text-sky-800",

      bg:
        "bg-sky-50",

      badge:
        "Seguimiento"

    })),

    /*
    ==========================================
    CITAS
    ==========================================
    */

    ...citasCliente.map(c => ({

      tipo:
        "cita",

      titulo:
        c.estado === "completada"
          ? "Cita completada"
          : c.estado === "cancelada"
            ? "Cita cancelada"
            : "Cita programada",

      descripcion:
        c.detalle
          ? `${c.motivo || "Sin motivo"} · ${c.detalle}`
          : c.motivo || "Sin motivo",

      fecha:
        getFechaEvento(
          c.fecha ||
          c.created_at
        ),

      icon:
        CalendarDays,

      color:
        c.estado === "completada"
          ? "text-emerald-600"
          : c.estado === "cancelada"
            ? "text-rose-500"
            : "text-amber-600",

      bg:
        c.estado === "completada"
          ? "bg-emerald-50"
          : c.estado === "cancelada"
            ? "bg-rose-50"
            : "bg-amber-50",

      badge:
        c.estado === "completada"
          ? "Completada"
          : c.estado === "cancelada"
            ? "Cancelada"
            : "Programada"

    })),

    /*
    ==========================================
    TRATAMIENTOS
    ==========================================
    */

    ...tratamientosCliente.map(t => ({

      tipo:
        "tratamiento",

      titulo:
        t.estado === "Completado"
          ? "Tratamiento completado"
          : "Tratamiento registrado",

      descripcion:
        `${t.servicio_nombre || t.servicio || "Tratamiento"}${t.pieza
          ? ` · Pieza ${t.pieza}`
          : ""
        } · ${t.sesiones_completadas || 0}/${t.sesiones_totales || 0} sesiones`,

      fecha:
        getFechaEvento(
          t.created_at ||
          new Date().toISOString()
        ),

      icon:
        Activity,

      color:
        t.estado === "Completado"
          ? "text-emerald-600"
          : "text-sky-800",

      bg:
        t.estado === "Completado"
          ? "bg-emerald-50"
          : "bg-sky-50",

      badge:
        t.estado || "Tratamiento"

    })),

    /*
    ==========================================
    FACTURAS
    ==========================================
    */

    ...ingresosCliente.map(i => {

      const total =
        calcularTotalFactura(i);

      return {

        tipo:
          "factura",

        titulo:
          i.pagado
            ? "Factura pagada"
            : "Factura generada",

        descripcion:
          `Factura #${i.id} · RD$ ${formatMoney(total)}`,

        fecha:
          getFechaEvento(
            i.created_at ||
            i.fecha
          ),

        icon:
          Receipt,

        color:
          i.pagado
            ? "text-emerald-600"
            : "text-amber-600",

        bg:
          i.pagado
            ? "bg-emerald-50"
            : "bg-amber-50",

        badge:
          i.pagado
            ? "Pagada"
            : "Pendiente"

      };

    }),

    /*
    ==========================================
    ODONTOGRAMA
    ==========================================
    */

    ...(tieneOdontograma
      ? [
        {
          tipo:
            "odontograma",

          titulo:
            "Odontograma clínico",

          descripcion:
            [
              cantidadPiezas > 0
                ? `Piezas afectadas: ${piezasTexto}`
                : null,

              cantidadCompletadas > 0
                ? `Piezas completadas: ${piezasCompletadasTexto}`
                : null

            ]
              .filter(Boolean)
              .join(" · "),


          fecha:
            getFechaEvento(
              new Date().toISOString()
            ),


          icon:
            SmilePlus,

          color:
            "text-sky-800",

          bg:
            "bg-sky-50",


          badge:
            cantidadCompletadas > 0
              ? `${cantidadCompletadas} completadas`
              : `${cantidadPiezas} afectadas`

        }
      ]
      : [])

  ]

    .filter(e =>
      e.fecha &&
      !Number.isNaN(e.fecha.getTime())
    )

    .sort(
      (a, b) =>
        b.fecha.getTime() -
        a.fecha.getTime()
    );

  /*
  ==========================================
  LOADING
  ==========================================
  */

  if (loading) {

    return (

      <div className="
        bg-white

        border
        border-slate-200

        rounded-[30px]

        p-10

        text-center

        text-slate-500

        font-semibold
      ">
        Cargando historial del paciente...
      </div>

    );

  }

  /*
  ==========================================
  RETURN
  ==========================================
  */

  return (

    <div className="
      space-y-6
    ">

      {/* HEADER */}

      <div className="
        flex
        items-center
        justify-between

        gap-4
      ">

        <div>

          <div className="
            inline-flex

            items-center
            gap-2

            px-3
            py-1.5

            rounded-full

            bg-sky-500/10

            border
            border-sky-100

            text-sky-800

            text-xs
            font-black

            mb-3
          ">

            <ClipboardClock size={16} />

            Historial general

          </div>

          <h4 className="
            text-xl

            font-black

            tracking-tight

            text-slate-800
          ">
            Expediente del paciente
          </h4>

          <p className="
            mt-1

            text-sm

            text-slate-400
          ">
            Citas, tratamientos, facturación y actividad clínica
          </p>

        </div>

        <div className="
          px-4
          py-2

          rounded-full

          bg-sky-500/10

          border
          border-sky-100

          text-sky-800

          text-xs
          font-black
        ">

          {eventos.length} eventos

        </div>

      </div>

      {/* RESUMEN */}

      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-5

        gap-4
      ">

        {resumen.map((item, index) => {

          const Icon =
            item.icon;

          return (

            <div
              key={index}
              className="
                bg-white

                border
                border-slate-200/80

                rounded-[28px]

                p-5

                shadow-[0_10px_30px_rgba(0,0,0,0.04)]

                hover:-translate-y-[2px]

                hover:border-sky-200

                hover:shadow-[0_18px_40px_rgba(7,89,133,0.08)]

                transition-all
                duration-300
              "
            >

              <div className={`
                w-11
                h-11

                rounded-[18px]

                ${item.bg}

                flex
                items-center
                justify-center
              `}>

                <Icon
                  size={19}
                  className={item.color}
                />

              </div>

              <p className="
                mt-4

                text-[11px]

                uppercase

                tracking-[0.12em]

                font-black

                text-slate-400
              ">
                {item.label}
              </p>

              <p className={`
                mt-2

                text-lg

                font-black

                ${item.color}
              `}>
                {item.value}
              </p>

            </div>

          );

        })}

      </div>

      {/* ULTIMA VISITA */}

      <div className="
        bg-gradient-to-br
        from-sky-50
        to-cyan-50

        border
        border-sky-100

        rounded-[30px]

        p-5
      ">

        <div className="
          flex
          items-center
          gap-3
        ">

          <div className="
            w-12
            h-12

            rounded-[20px]

            bg-white

            border
            border-sky-100

            text-sky-800

            flex
            items-center
            justify-center
          ">

            <CalendarDays size={20} />

          </div>

          <div>

            <p className="
              text-xs

              uppercase

              tracking-[0.12em]

              font-black

              text-sky-700
            ">
              Última visita completada
            </p>

            <p className="
              mt-1

              text-sm

              font-black

              text-slate-800
            ">

              {ultimaVisita
                ? formatFecha(
                  parseFechaLocal(
                    ultimaVisita.fecha
                  )
                )
                : "Sin visitas completadas"}

            </p>

          </div>

        </div>

      </div>

      {/* TIMELINE */}

      <div className="
        flex-1

        min-h-0

        max-h-[560px]

        overflow-y-auto
        overflow-x-hidden

        pr-2

        space-y-4

        scrollbar-thin
        scrollbar-thumb-sky-200/70
        scrollbar-track-transparent
      ">

        {eventos.length === 0 ? (

          <div className="
            relative
            overflow-hidden

            bg-white

            border
            border-slate-200

            rounded-[30px]

            p-10

            text-center
          ">

            <div className="
              w-20
              h-20

              mx-auto

              rounded-[26px]

              bg-gradient-to-br
              from-sky-700
              via-sky-800
              to-sky-900

              text-white

              flex
              items-center
              justify-center

              shadow-[0_20px_50px_rgba(7,89,133,0.25)]
            ">

              <ClipboardList size={36} />

            </div>

            <h3 className="
              mt-6

              text-2xl

              font-black

              text-slate-800
            ">
              Sin historial general
            </h3>

            <p className="
              mt-2

              text-slate-500
            ">
              Las citas, facturas, tratamientos y notas aparecerán aquí
            </p>

          </div>

        ) : (

          eventos.map((evento, index) => {

            const Icon =
              evento.icon;

            return (

              <div
                key={index}
                className="
                  group

                  relative

                  flex
                  gap-4
                "
              >

                {/* TIMELINE */}

                <div className="
                  relative

                  flex
                  flex-col

                  items-center
                ">

                  <div className={`
                    w-4
                    h-4

                    rounded-full

                    border-4
                    border-white

                    shadow-md

                    z-10

                    ${index === 0
                      ? "bg-sky-700"
                      : "bg-slate-300"}
                  `} />

                  {index !== eventos.length - 1 && (

                    <div className="
                      w-[3px]

                      flex-1

                      bg-slate-200

                      min-h-[80px]
                    " />

                  )}

                </div>

                {/* CARD */}

                <div
                  onClick={() =>
                    setEventoSeleccionado(evento)
                  }
                  className="
                    relative

                    flex-1

                    cursor-pointer

                    bg-white

                    border
                    border-slate-200/80

                    rounded-[30px]

                    p-5

                    shadow-[0_10px_30px_rgba(0,0,0,0.04)]

                    hover:-translate-y-[2px]

                    hover:border-sky-200

                    hover:shadow-[0_18px_40px_rgba(7,89,133,0.08)]

                    transition-all
                    duration-300
                  "
                >

                  {/* RECENT */}

                  {index === 0 && (

                    <div className="
                      inline-flex

                      items-center
                      gap-2

                      px-3
                      py-1.5

                      rounded-full

                      bg-gradient-to-r
                      from-sky-500/10
                      to-cyan-500/10

                      text-sky-800

                      text-[11px]
                      font-black

                      mb-4
                    ">
                      <ClockPlus size={13} />
                      Evento reciente

                    </div>

                  )}

                  {/* ICON + TITLE */}

                  <div className="
                    flex
                    items-start
                    gap-4
                  ">

                    <div className={`
                      w-12
                      h-12

                      rounded-[20px]

                      ${evento.bg}

                      flex
                      items-center
                      justify-center

                      shrink-0
                    `}>

                      <Icon
                        size={19}
                        className={evento.color}
                      />

                    </div>

                    <div className="
                      flex-1
                      min-w-0
                    ">

                      <div className="
                        flex
                        items-start
                        justify-between

                        gap-3
                      ">

                        <h4 className="
                          text-sm
                          sm:text-base

                          font-black

                          text-slate-800
                        ">
                          {evento.titulo}
                        </h4>

                        <span className="
                          text-[11px]

                          font-semibold

                          text-slate-400

                          shrink-0
                        ">
                          {formatFecha(evento.fecha)}
                        </span>

                      </div>

                      <p className="
                        mt-1

                        text-sm

                        leading-relaxed

                        text-slate-500

                        line-clamp-2
                      ">
                        {cortarTexto(
                          evento.descripcion,
                          150
                        )}
                      </p>

                      <div className="
                        mt-4

                        inline-flex

                        items-center
                        gap-2

                        px-3
                        py-1.5

                        rounded-full

                        bg-emerald-50

                        text-emerald-600

                        text-[11px]
                        font-bold
                      ">

                        <AlertCircle size={12} />

                        {evento.badge}

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            );

          })

        )}

      </div>

      {/* DETAIL MODAL */}

      {eventoSeleccionado && (

        <BaseModal
          onClose={() =>
            setEventoSeleccionado(null)
          }
          maxWidth="max-w-3xl"
        >

          <div className="
            flex
            flex-col

            gap-6
          ">

            {/* HEADER */}

            <div className="
              flex
              items-start
              justify-between

              gap-4
            ">

              <div>

                <div className="
                  inline-flex

                  items-center
                  gap-2

                  px-3
                  py-1.5

                  rounded-full

                  bg-sky-500/10

                  border
                  border-sky-100

                  text-sky-800

                  text-xs
                  font-black

                  mb-4
                ">
                  <ClipboardClock
                    size={16}
                    strokeWidth={2.8}
                    className=" shrink-0"
                  />
                  Historial

                </div>

                <h3 className="
                  text-2xl

                  font-black

                  tracking-tight

                  text-slate-800
                ">
                  {eventoSeleccionado.titulo}
                </h3>

                <p className="
                  mt-2

                  text-sm

                  text-slate-400
                ">
                  {formatFecha(
                    eventoSeleccionado.fecha
                  )}
                </p>

              </div>

              <button
                onClick={() =>
                  setEventoSeleccionado(null)
                }
                className="
                  w-11
                  h-11

                  rounded-[18px]

                  bg-slate-100

                  border
                  border-slate-200

                  text-slate-500

                  hover:bg-slate-200

                  hover:text-slate-700

                  transition-all
                  duration-300

                  flex
                  items-center
                  justify-center
                "
              >

                <X size={18} />

              </button>

            </div>

            {/* CONTENT */}

            <div className="
              bg-slate-50/80

              border
              border-slate-200/80

              rounded-[30px]

              p-6

              text-sm
              sm:text-base

              leading-relaxed

              text-slate-700

              whitespace-pre-wrap
              break-words

              shadow-inner
            ">

              {eventoSeleccionado.descripcion}

            </div>

          </div>

        </BaseModal>

      )}

    </div>

  );

}

export default HistorialPacienteTab;