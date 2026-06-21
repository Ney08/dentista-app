import { useState, useEffect } from "react";
// import toast from "react-hot-toast";
import {
  showSuccess,
  showError,
  showWarning,
  showInfo
} from "../ui/ToastStyles";
import Calendar from "react-calendar";

import "react-calendar/dist/Calendar.css";

import { API_URL } from "../../config";

import { useCitas } from "../../hooks/useCitas";
import { useServicios } from "../../hooks/useServicios";

import {
  CalendarDays,
  User2,
  ClipboardList,
  FileText,
  Clock3,
  CalendarClock,
  Save,
  X,
  CheckCircle2
} from "lucide-react";

import {
  formatFecha,
  parseFechaLocal,
  crearFechaLocal
} from "../../utils/fecha";

function CitaForm({
  clientes,
  cita,
  clientePreset,
  onCrear,
  onClose
}) {

  const {
    servicios: catalogoServicios
  } = useServicios();

  const {
    crearCita,
    actualizarCita
  } = useCitas();

  const isEdit =
    !!cita;

  /*
  ==========================================
  STATES
  ==========================================
  */

  const [

    servicioId,

    setServicioId

  ] = useState("");

  const [horaSeleccionadaManual, setHoraSeleccionadaManual] =
    useState(false);

  const [fechaBase, setFechaBase] =
    useState(new Date());

  const [hora, setHora] =
    useState("");

  const [duracion, setDuracion] =
    useState(30);

  const [motivo, setMotivo] =
    useState("");

  const [detalle, setDetalle] =
    useState("");

  const [citas, setCitas] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [clienteId, setClienteId] =
    useState("");
  const [

    tratamientos,

    setTratamientos

  ] = useState([]);

  const [

    tratamientoId,

    setTratamientoId

  ] = useState("");
  /*
  ==========================================
  CLIENTE PRESET
  ==========================================
  */

  useEffect(() => {

    if (clientePreset) {

      setClienteId(
        clientePreset.id
      );

    }

  }, [clientePreset]);
  /*
==========================================
LOAD TRATAMIENTOS
==========================================
*/

  useEffect(() => {

    if (!clienteId) return;

    fetch(

      `${API_URL}/tratamientos/${clienteId}`

    )
      .then((res) => res.json())
      .then(setTratamientos)
      .catch(() => {

        showError(
          "Error cargando tratamientos ❌"
        );

      });

  }, [clienteId]);

  /*
  ==========================================
  CARGAR CITAS
  ==========================================
  */

  useEffect(() => {

    fetch(`${API_URL}/citas/`)
      .then((res) => res.json())
      .then(setCitas)
      .catch(() => {

       showError(
          "Error al cargar citas ❌"
        );

      });

  }, []);

  /*
  ==========================================
  PRECARGAR EDIT
  ==========================================
  */

  useEffect(() => {

    if (isEdit && cita) {
      console.log(cita);
      setClienteId(
        cita.cliente_id || ""
      );


      setServicioId(
        String(
          cita.tratamiento?.id
            ? tratamientos.find(

              (t) =>

                String(t.id)

                ===

                String(
                  cita.tratamiento.id
                )

            )?.servicio_id || ""

            : ""
        )
      );

      setMotivo(
        cita.motivo || ""
      );

      /*
==========================================
BUSCAR SERVICIO POR MOTIVO
==========================================
*/

      if (

        !cita.tratamiento?.id

        &&

        cita.motivo

        &&

        catalogoServicios.length > 0

      ) {

        const servicioRelacionado =

          catalogoServicios.find(

            (s) =>

              s.nombre?.toLowerCase()

              ===

              cita.motivo?.toLowerCase()

          );

        if (servicioRelacionado) {

          setServicioId(
            String(servicioRelacionado.id)
          );

        }

      }


      setTratamientoId(
        String(
          cita.tratamiento?.id || ""
        )
      );


      if (

        cita.tratamiento_id

        &&

        tratamientos.length > 0

      ) {

        const tratamientoRelacionado =

          tratamientos.find(

            (t) =>

              String(t.id)

              ===

              String(
                cita.tratamiento_id
              )

          );

        if (tratamientoRelacionado) {


          setServicioId(
            String(
              tratamientoRelacionado.servicio_id
            )
          );


        }

      }
      setDetalle(
        cita.detalle || ""
      );

      setDuracion(
        cita.duracion || 30
      );


      const fecha =
        parseFechaLocal(
          cita.fecha
        );

      const base = new Date(
        fecha.getFullYear(),
        fecha.getMonth(),
        fecha.getDate()
      );

      setFechaBase(base);

      const hh =
        String(
          fecha.getHours()
        ).padStart(2, "0");

      const mm =
        String(
          fecha.getMinutes()
        ).padStart(2, "0");

      setHora(`${hh}:${mm}`);

      setHoraSeleccionadaManual(
        true
      );

    }

  }, [cita, isEdit, tratamientos, catalogoServicios]);

  /*
  ==========================================
  GENERAR HORAS
  ==========================================
  */

  const generarHoras = () => {

    const horas = [];

    for (let h = 8; h <= 18; h++) {

      for (let m = 0; m < 60; m += 15) {

        horas.push(
          `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
        );

      }

    }

    return horas;

  };

  /*
  ==========================================
  HELPERS
  ==========================================
  */

  const getHoy = () => {

    const hoy = new Date();

    hoy.setHours(0, 0, 0, 0);

    return hoy;

  };

  const esHoy = (fecha) => {

    const hoy =
      getHoy();

    const test =
      new Date(fecha);

    test.setHours(0, 0, 0, 0);

    return (
      test.getTime() ===
      hoy.getTime()
    );

  };

  /*
  ==========================================
  VALIDAR OCUPADO
  ==========================================
  */

  const estaOcupada = (fechaNueva) => {

    const nuevaInicio =
      new Date(fechaNueva);

    const nuevaFin =
      new Date(
        nuevaInicio.getTime() +
        duracion * 60000
      );

    return citas.some((c) => {

      if (
        isEdit &&
        c.id === cita.id
      ) {
        return false;
      }

      const existenteInicio =
        parseFechaLocal(c.fecha);

      const existenteFin =
        new Date(
          existenteInicio.getTime() +
          (c.duracion || 30) * 60000
        );

      return (
        nuevaInicio < existenteFin &&
        nuevaFin > existenteInicio
      );

    });

  };

  /*
  ==========================================
  DIA LLENO
  ==========================================
  */

  const estaDiaLleno = (fecha) => {

    const horas =
      generarHoras();

    const ahora =
      new Date();

    const disponible =
      horas.some((h) => {

        const fechaTest =
          crearFechaLocal(
            fecha,
            h
          );

        if (
          esHoy(fecha) &&
          fechaTest < ahora
        ) {
          return false;
        }

        return !estaOcupada(
          fechaTest
        );

      });

    return !disponible;

  };

  /*
  ==========================================
  BUSCAR DIA DISPONIBLE
  ==========================================
  */

  const buscarSiguienteDiaDisponible = (fecha) => {

    let nuevaFecha =
      new Date(fecha);

    for (let i = 0; i < 30; i++) {

      nuevaFecha.setDate(
        nuevaFecha.getDate() + 1
      );

      if (!estaDiaLleno(nuevaFecha)) {

        return new Date(
          nuevaFecha
        );

      }

    }

    return null;

  };

  /*
  ==========================================
  AUTO HORA
  ==========================================
  */

  useEffect(() => {

    if (isEdit) return;

    if (horaSeleccionadaManual) return;

    const ahora =
      new Date();

    const libre =
      generarHoras().find((h) => {

        const fechaTest =
          crearFechaLocal(
            fechaBase,
            h
          );

        if (
          esHoy(fechaBase) &&
          fechaTest < ahora
        ) {
          return false;
        }

        return !estaOcupada(
          fechaTest
        );

      });

    if (libre) {

      setHora(libre);

    }

  }, [
    fechaBase,
    duracion,
    citas,
    isEdit,
    horaSeleccionadaManual
  ]);

  /*
  ==========================================
  SCROLL
  ==========================================
  */

  useEffect(() => {

    document
      .querySelector(".horas-scroll")
      ?.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    if (!isEdit) {

      setHoraSeleccionadaManual(
        false
      );

    }

  }, [fechaBase, isEdit]);

  /*
  ==========================================
  AUTO NEXT DAY
  ==========================================
  */

  useEffect(() => {

    if (!fechaBase) return;

    if (isEdit) return;

    const hayDisponible =
      generarHoras().some((h) => {

        const fechaTest =
          crearFechaLocal(
            fechaBase,
            h
          );

        if (
          esHoy(fechaBase) &&
          fechaTest < new Date()
        ) {
          return false;
        }

        return !estaOcupada(
          fechaTest
        );

      });

    if (!hayDisponible) {

      const siguiente =
        buscarSiguienteDiaDisponible(
          fechaBase
        );

      if (
        siguiente &&
        siguiente.toDateString() !==
        fechaBase.toDateString()
      ) {

        setFechaBase(
          siguiente
        );

        setHora("");

        setHoraSeleccionadaManual(
          false
        );

        showInfo(
          `Día lleno → movido al ${formatFecha(siguiente)} ✅`,
          { id: "dia-lleno" }
        );

      }

    }

  }, [
    fechaBase,
    duracion,
    citas,
    isEdit
  ]);

  /*
  ==========================================
  VALIDAR BLOQUE
  ==========================================
  */

  const bloqueDisponible = (
    fechaInicio,
    duracionMin
  ) => {

    const inicio =
      parseFechaLocal(
        fechaInicio
      );

    const fin =
      new Date(
        inicio.getTime() +
        duracionMin * 60000
      );

    return !citas.some((c) => {

      if (
        isEdit &&
        c.id === cita.id
      ) {
        return false;
      }

      const existenteInicio =
        parseFechaLocal(c.fecha);

      const existenteFin =
        new Date(
          existenteInicio.getTime() +
          (c.duracion || 30) * 60000
        );

      return (
        inicio < existenteFin &&
        fin > existenteInicio
      );

    });

  };

  /*
  ==========================================
  GUARDAR
  ==========================================
  */

  const guardar = async () => {

    if (
      !clienteId ||
      !hora ||
      !motivo
    ) {

      return showError(
        "Completa los campos ⚠️"
      );

    }

    const fechaLocal =
      crearFechaLocal(
        fechaBase,
        hora
      );

    const fechaFinal =
      fechaLocal.getFullYear() + "-" +
      String(
        fechaLocal.getMonth() + 1
      ).padStart(2, "0") + "-" +
      String(
        fechaLocal.getDate()
      ).padStart(2, "0") + "T" +
      String(
        fechaLocal.getHours()
      ).padStart(2, "0") + ":" +
      String(
        fechaLocal.getMinutes()
      ).padStart(2, "0") + ":00";

    if (
      !bloqueDisponible(
        fechaFinal,
        duracion
      )
    ) {

      return showWarning(
        "Ese horario no tiene espacio suficiente ⏰"
      );

    }

    if (
      parseFechaLocal(
        fechaFinal
      ) < new Date()
    ) {

      return showError(
        "Fecha inválida ⏰"
      );

    }

    setLoading(true);

    try {

      if (isEdit) {

        await actualizarCita.mutateAsync({
          id: cita.id,
          data: {
            cliente_id:
              parseInt(clienteId),

            tratamiento_id:

              tratamientoId

                ? parseInt(tratamientoId)

                : null,

            fecha: fechaFinal,
            motivo,
            detalle,
            duracion
          }
        });

        showSuccess(
          "Cita actualizada ✅"
        );

      } else {

        await crearCita.mutateAsync({
          cliente_id:
            parseInt(clienteId),

          tratamiento_id:

            tratamientoId

              ? parseInt(tratamientoId)

              : null,

          fecha: fechaFinal,
          motivo,
          detalle,
          duracion
        });

       showSuccess(
          "Cita creada ✅"
        );

      }

      onCrear();

      onClose();

    } catch {

      showError(
        "Error ❌"
      );

    }

    setLoading(false);

  };

  return (

    <div className="
     

     
    ">

      {/* GLOW */}

      <div className="
        absolute
        -top-20
        -right-20

        w-72
        h-72

        rounded-full

        bg-sky-500/10

        blur-3xl
      " />

      {/* HEADER */}

      <div className="
  relative
  z-10

  text-center

  space-y-3

  shrink-0
">

        <div className="
    mx-auto

    w-20
    h-20

    rounded-[28px]

    
bg-gradient-to-br
from-sky-700
via-sky-800
to-sky-900


    text-white

    flex
    items-center
    justify-center

    shadow-[0_20px_50px_rgba(7,89,133,0.35)]
  ">

          <CalendarDays size={34} />

        </div>

        <h2 className="
    text-3xl
    sm:text-4xl

    font-black

    tracking-tight

    text-slate-800
  ">

          {isEdit
            ? "Editar cita"
            : "Nueva cita"}

        </h2>

        <div className="
    w-20
    h-1

    mx-auto

    rounded-full

    
bg-gradient-to-r
from-cyan-500
to-sky-800

  " />

        <p className="
    text-sm
    sm:text-base

    text-slate-500
  ">

          {isEdit
            ? "Modifica la información de la cita"
            : "Selecciona cliente, servicio y horario"}

        </p>

      </div>

      {/* CONTENT */}

      <form className="
        relative
        z-10

        grid
        grid-cols-1
        xl:grid-cols-2

        gap-6

        flex-1
        min-h-0
      ">

        {/* LEFT */}

        <div className="
          space-y-4
        ">

          {/* CLIENTE PRESET */}

          {clientePreset && (

            <div className="
    flex
    items-center
    gap-3

   
bg-sky-50

border
border-sky-100


    rounded-[24px]

    px-4
    py-4

    text-sm
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

                <User2 size={20} />

              </div>

              <div>

                <p className="
        text-slate-400
        text-xs
      ">
                  Cliente seleccionado
                </p>

                <p className="
        font-black
        text-slate-700
      ">
                  {clientePreset.nombre}
                  {" "}
                  {clientePreset.apellido}
                </p>

              </div>

            </div>

          )}

          {/* CLIENTE */}

          <div className="space-y-2">

            {/* <label className="
    text-xs

    font-bold

    text-slate-500

    flex
    items-center
    gap-2
  ">

              <User2 size={13} />

              Cliente

            </label> */}

            <select
              value={clienteId}
              onChange={(e) =>
                setClienteId(
                  e.target.value
                )
              }

              disabled={
                !!clientePreset ||
                isEdit
              }

              className={`
  w-full

  h-14

  px-5

  rounded-[24px]

  border
  border-slate-200

  shadow-sm

  focus:outline-none

  focus:ring-4
  
focus:ring-sky-500/10

focus:border-sky-300

  transition-all
  duration-300

  ${clientePreset || isEdit
                  ? `
        bg-slate-100
        text-slate-400
        cursor-not-allowed
      `
                  : `
        bg-white/80
        text-slate-700
      `
                }
`}
            >

              <option value="">
                Cliente
              </option>

              {clientes.map((c) => (

                <option
                  key={c.id}
                  value={c.id}
                >
                  {c.nombre}
                  {" "}
                  {c.apellido}
                </option>

              ))}

            </select>

          </div>

          {/* SERVICIO */}

          <div className="space-y-2">

            {/* <label className="
    text-xs

    font-bold

    text-slate-500

    flex
    items-center
    gap-2
  ">

              <ClipboardList size={13} />

              Servicio / Motivo

            </label> */}

            <select

              value={servicioId}

              onChange={(e) => {

                const id =
                  e.target.value;

                setServicioId(id);

                const servicio =
                  catalogoServicios.find(

                    (s) =>

                      String(s.id)
                      ===
                      String(id)

                  );

                if (servicio) {

                  /*
                  ==========================================
                  SET MOTIVO
                  ==========================================
                  */

                  setMotivo(
                    servicio.nombre
                  );

                  /*
                  ==========================================
                  AUTO SELECT TRATAMIENTO
                  ==========================================
                  */

                  const tratamientoRelacionado =

                    tratamientos.find(

                      (t) =>

                        t.estado !== "Completado"

                        &&

                        t.servicio_nombre
                          ?.toLowerCase()

                        ===

                        servicio.nombre
                          ?.toLowerCase()

                    );


                  if (tratamientoRelacionado) {

                    setTratamientoId(
                      tratamientoRelacionado.id
                    );

                  } else {

                    setTratamientoId("");

                  }

                }

              }}


              className="
    w-full

    h-14

    px-5

    rounded-[24px]

    bg-white/80

    border
    border-slate-200

    text-slate-700

    shadow-sm

    focus:outline-none

    focus:ring-4
   
focus:ring-sky-500/10

focus:border-sky-300


    transition-all
    duration-300
  "
            >

              <option value="">
                Servicio / Motivo
              </option>

              {catalogoServicios.map((serv) => (


                <option
                  key={serv.id}
                  value={serv.id}
                >

                  {serv.nombre}
                </option>

              ))}

            </select>
            {/* TRATAMIENTO */}

            <div className="space-y-2">

              <select

                value={tratamientoId}

                onChange={(e) => {

                  const id =
                    e.target.value;

                  setTratamientoId(id);

                  const tratamiento =
                    tratamientos.find(

                      (t) =>

                        String(t.id)
                        ===
                        String(id)

                    );

                  if (tratamiento) {

                    setMotivo(
                      tratamiento.servicio_nombre
                    );

                    setServicioId(
                      tratamiento.servicio_id
                    );

                  }

                }}


                className="
      w-full

      h-14

      px-5

      rounded-[24px]

      bg-white/80

      border
      border-slate-200

      text-slate-700

      shadow-sm

      focus:outline-none

      focus:ring-4
      
focus:ring-sky-500/10

focus:border-sky-300


      transition-all
      duration-300
    "
              >

                <option value="">
                  Tratamiento (opcional)
                </option>

                {


                  tratamientos

                    .filter((t) => {

                      /*
                      ==========================================
                      MOSTRAR EL ACTUAL EN EDIT
                      ==========================================
                      */

                      if (

                        isEdit

                        &&

                        String(t.id)

                        ===

                        String(tratamientoId)

                      ) {

                        return true;

                      }

                      return t.estado !== "Completado";

                    })

                    .map((t) => (


                      <option

                        key={t.id}

                        value={t.id}

                      >

                        {

                          t.servicio_nombre

                        }

                        {

                          t.pieza

                            ? ` • Pieza ${t.pieza}`

                            : ""

                        }

                        {

                          t.estado

                            ? ` • ${t.estado}`

                            : ""

                        }

                      </option>

                    ))

                }

              </select>

            </div>
          </div>

          {/* DETALLE */}

          <div className="space-y-2">

            {/* <label className="
    text-xs

    font-bold

    text-slate-500

    flex
    items-center
    gap-2
  ">

              <FileText size={13} />

              Detalle adicional

            </label> */}

            <textarea
              placeholder="Detalle adicional (opcional)"
              value={detalle}
              onChange={(e) =>
                setDetalle(
                  e.target.value
                )
              }
              rows={5}
              className="
      w-full

      px-5
      py-4

      rounded-[24px]

      bg-white/80

      border
      border-slate-200

      text-slate-700

      shadow-sm

      resize-none

      focus:outline-none

      focus:ring-4
      
focus:ring-sky-500/10

focus:border-sky-300


      transition-all
      duration-300
    "
            />

          </div>

          <select
            value={duracion}
            onChange={(e) =>
              setDuracion(
                parseInt(
                  e.target.value
                )
              )
            }
            className="
              w-full

              h-14

              px-5

              rounded-[24px]

              bg-white/80

              border
              border-slate-200

              text-slate-700

              shadow-sm

              focus:outline-none

              focus:ring-4
             
focus:ring-sky-500/10

focus:border-sky-300


              transition-all
              duration-300
            "
          >

            <option value={30}>
              30 min
            </option>

            <option value={45}>
              45 min
            </option>

            <option value={60}>
              1 hora
            </option>

          </select>

        </div>

        {/* RIGHT */}

        <div className="
          flex
          flex-col

          min-h-0

          space-y-4
        ">

          {/* CALENDAR */}

          <div className="
  bg-slate-50/70

  border
  border-slate-200/70

  rounded-[30px]

  p-3

  shadow-sm

  overflow-hidden
">


            <Calendar
              className="
                custom-calendar
                w-full
                border-0
              "
              value={fechaBase}
              onChange={(date) => {

                if (estaDiaLleno(date)) {

                  const siguiente =
                    buscarSiguienteDiaDisponible(
                      date
                    );

                  if (siguiente) {

                    setFechaBase(
                      siguiente
                    );

                    setHora("");

                    setHoraSeleccionadaManual(
                      false
                    );

                    showInfo(
                      `Día lleno 🚫 → movido al ${formatFecha(siguiente)} ✅`,
                      {
                        id: "dia-lleno"
                      }
                    );

                  } else {

                    showError(
                      "No hay días disponibles próximos 🚫",
                      {
                        id: "sin-disponibilidad"
                      }
                    );

                  }

                  return;

                }

                setFechaBase(date);

                setHora("");

                setHoraSeleccionadaManual(
                  false
                );

              }}
              minDate={getHoy()}
            />

          </div>

          {/* HORARIOS */}

          <div className="
  flex
  items-center
  justify-between
">

            <div className="
    flex
    items-center
    gap-2
  ">

              <CalendarClock
                size={16}
                className="text-sky-700"
              />

              <p className="
      text-sm

      font-bold

      text-slate-700
    ">
                Horarios disponibles
              </p>

            </div>

            <span className="
    text-xs

    text-sky-700

    font-semibold
  ">
              {duracion} min
            </span>

          </div>


          {/* HORAS */}

          <div className="
            horas-scroll

            grid
            grid-cols-3
            sm:grid-cols-4

            gap-3

            max-h-[320px]

            overflow-y-auto

            pr-1
          ">

            {generarHoras().map((h) => {

              const fechaTest =
                crearFechaLocal(
                  fechaBase,
                  h
                );

              const ahora =
                new Date();

              const esPasado =
                esHoy(fechaBase) &&
                fechaTest < ahora;

              const ocupada =
                estaOcupada(
                  fechaTest
                );

              return (

                <button
                  type="button"
                  key={h}
                  disabled={
                    ocupada ||
                    esPasado
                  }
                  onClick={() => {

                    if (
                      !ocupada &&
                      !esPasado
                    ) {

                      setHora(h);

                      setHoraSeleccionadaManual(
                        true
                      );

                    }

                  }}
                  className={`
                    h-12

                    rounded-[20px]

                    text-sm
                    font-semibold

                    border

                    transition-all
                    duration-300

                    active:scale-[0.98]

                    ${ocupada || esPasado
                      ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                      : hora === h
                        ? `
                          
bg-gradient-to-r
from-sky-700
to-sky-900


                          text-white

                          border-transparent

                          shadow-[0_15px_35px_rgba(7,89,133,0.25)]

                          scale-[1.03]
                        `
                        : `
                          bg-white

                          text-slate-700

                          border-slate-200

                         
hover:border-sky-200

hover:bg-sky-50

                        `
                    }
                  `}
                >
                  {h}
                </button>

              );

            })}

          </div>

        </div>

      </form>

      {/* RESUMEN */}

      <div className={`
  relative
  z-10

  border

  rounded-[28px]

  p-5

  backdrop-blur-xl

  transition-all
  duration-300

  ${hora && clienteId
          ? `
      
bg-gradient-to-r
from-sky-50
to-cyan-50

border-sky-100

    `
          : `
      bg-slate-50

      border-slate-200

      opacity-80
    `
        }
`}>

        <div className="
    flex
    items-center
    gap-2
  ">

          <CheckCircle2
            size={18}
            className={`
        ${hora && clienteId
                ? "text-emerald-500"
                : "text-slate-400"
              }
      `}
          />

          <p className="
      font-black

      text-slate-700
    ">

            {hora && clienteId
              ? "Cita seleccionada"
              : "Selecciona una hora"}

          </p>

        </div>

        {hora && clienteId && (

          <div className="
      mt-3
      space-y-1
    ">

            <p className="
        text-sky-800

        font-semibold
      ">

              {formatFecha(fechaBase)}
              {" — "}
              {hora}

            </p>

            <p className="
        text-sm
        text-slate-500
      ">

              {

                tratamientoId

                  ? tratamientos.find(

                    (t) =>

                      String(t.id)
                      ===
                      String(tratamientoId)

                  )?.servicio_nombre

                  : motivo

              }
              {" • "}
              {duracion} min

            </p>

          </div>

        )}

      </div>

      {/* ACTIONS */}

      <div className="
  sticky
  bottom-0

  bg-white/90
  backdrop-blur-xl

  pt-2

  flex
  flex-col
  sm:flex-row

  gap-3

  shrink-0
">

        {/* CANCEL */}

        <button
          type="button"
          onClick={onClose}
          className="
      flex-1

      h-14

      rounded-[24px]

      bg-slate-100

      hover:bg-slate-200

      text-slate-700

      font-semibold

      transition-all
      duration-300

      active:scale-[0.98]

      flex
      items-center
      justify-center
      gap-2
    "
        >

          <X size={18} />

          Cancelar

        </button>

        {/* SAVE */}

        <button
          type="button"
          onClick={guardar}
          disabled={loading}
          className={`
      flex-1

      h-14

      rounded-[24px]

      text-white

      text-sm
      sm:text-base

      font-black

      transition-all
      duration-300

      active:scale-[0.98]

      flex
      items-center
      justify-center
      gap-2

      ${loading
              ? "bg-gray-400"
              : `
          
bg-gradient-to-r
from-sky-700
via-sky-800
to-sky-900

shadow-[0_15px_35px_rgba(7,89,133,0.28)]


          hover:scale-[1.01]

          
hover:shadow-[0_20px_45px_rgba(7,89,133,0.35)]

        `
            }
    `}
        >

          <Save size={18} />

          {loading
            ? "Guardando..."
            : isEdit
              ? "Guardar cambios"
              : "Crear cita"}

        </button>

      </div>

    </div>

  );

}

export default CitaForm;