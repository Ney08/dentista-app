import { useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  CalendarDays,
  Pencil,
  Ban,
  Check,
  Phone,
  FileText,
  MapPin,
  Activity,
  Clock3,
  UserCheck
} from "lucide-react";


function ClienteList({
  clientes,
  citas = [],
  onEditarClick,
  onSeleccionar,
  onToggleActivo
}) {

  const navigate = useNavigate();

  const [seleccionadoId, setSeleccionadoId] =
    useState(null);

  const colores = [
    "from-blue-500 to-cyan-500",
    "from-green-500 to-emerald-500",
    "from-purple-500 to-violet-500",
    "from-pink-500 to-rose-500",
    "from-indigo-500 to-blue-500"
  ];

  const obtenerProximaCita = (clienteId) => {

    const ahora = new Date();

    const citasCliente = citas
      .filter(c => {

        const idCliente =
          c?.cliente_id ||
          c?.cliente?.id;

        if (idCliente !== clienteId) {
          return false;
        }

        if (!c.fecha) {
          return false;
        }

        /*
        ==========================
        IGNORAR COMPLETADAS
        ==========================
        */

        const estado =
          (c.estado || "")
            .toLowerCase();

        if (

          estado === "completada"

          ||

          estado === "cancelada"

        ) {

          return false;

        }

        const fecha =
          new Date(c.fecha);

        return fecha >= ahora;

      })

  };

  const formatFechaCita = (fecha) => {

    if (!fecha) return "";

    return new Date(fecha)
      .toLocaleDateString(
        "es-DO",
        {
          day: "2-digit",
          month: "short",
          year: "numeric"
        }
      );

  };

  const formatHoraCita = (fecha) => {

    if (!fecha) return "";

    return new Date(fecha)
      .toLocaleTimeString(
        "es-DO",
        {
          hour: "2-digit",
          minute: "2-digit"
        }
      );

  };

  return (

    <div className="
      h-full

      space-y-4

      overflow-x-hidden

      pb-2
    ">

      {clientes.map((cliente) => {

        const color =
          colores[
          cliente.id % colores.length
          ];

        const isSelected =
          seleccionadoId === cliente.id;

        const direccionTexto =
          typeof cliente.direccion === "string"
            ? cliente.direccion
            : `${cliente.direccion?.municipio_nombre || ""}, ${cliente.direccion?.provincia_nombre || ""}`;

        const proximaCita =
          obtenerProximaCita(cliente.id);

        return (

          <div
            key={cliente.id}
            onClick={() => {

              setSeleccionadoId(cliente.id);

              onSeleccionar?.(cliente);

            }}
            className={`
              group

              relative
              overflow-hidden

              bg-white/95
              backdrop-blur-md

              border
              border-slate-200/80

              rounded-[34px]

              p-5
              sm:p-6

              cursor-pointer

              transition-all
              duration-500

              hover:-translate-y-[2px]

              hover:border-indigo-200

              hover:shadow-[0_20px_40px_rgba(99,102,241,0.08)]

              ${isSelected
                ? "ring-2 ring-indigo-400 shadow-[0_25px_60px_rgba(99,102,241,0.14)]"
                : ""
              }
            `}
          >

            {/* TOP BORDER */}

            <div
              className={`
                absolute
                top-0
                left-0

                h-[3px]
                w-full

                bg-gradient-to-r
                ${color}
              `}
            />

            {/* GLOW */}

            <div className="
              absolute
              -top-20
              -right-20

              w-56
              h-56

              rounded-full

              bg-indigo-500/10

              blur-3xl

              opacity-0

              group-hover:opacity-100

              transition-all
              duration-700
            " />

            {/* CONTENT */}

            <div className="
              relative
              z-10

              grid
              grid-cols-1
              2xl:grid-cols-[1fr_auto]

              gap-6
            ">

              {/* LEFT */}

              <div className="
                flex
                items-start

                gap-5

                min-w-0
              ">

                {/* AVATAR */}

                <div
                  className={`
                    relative

                    bg-gradient-to-br
                    ${color}

                    w-16
                    h-16

                    rounded-[24px]

                    text-white

                    flex
                    items-center
                    justify-center

                    font-black
                    text-xl

                    ring-4
                    ring-white

                    shadow-[0_15px_35px_rgba(0,0,0,0.15)]

                    shrink-0

                    group-hover:scale-105

                    transition-all
                    duration-300
                  `}
                >

                  {cliente.nombre?.charAt(0)?.toUpperCase()}

                  {/* STATUS DOT */}

                  <div className={`
                    absolute
                    -bottom-1
                    -right-1

                    w-5
                    h-5

                    rounded-full

                    border-4
                    border-white

                    ${cliente.activo
                      ? "bg-emerald-500"
                      : "bg-rose-500"}
                  `} />

                </div>

                {/* INFO */}

                <div className="
                  flex-1
                  min-w-0

                  space-y-5
                ">

                  {/* TOP */}

                  <div className="
                    flex
                    flex-col
                    xl:flex-row

                    xl:items-start
                    xl:justify-between

                    gap-4
                  ">

                    {/* NAME */}

                    <div className="min-w-0">

                      <div className="
                        flex
                        flex-wrap

                        items-center

                        gap-3
                      ">

                        <h3 className="
                          text-lg
                          sm:text-xl

                          font-black

                          text-slate-800

                          truncate
                        ">

                          {cliente.nombre}{" "}
                          {cliente.apellido}

                        </h3>

                        <span
                          className={`
                            px-3
                            py-1.5

                            rounded-full

                            text-[11px]
                            font-bold

                            border

                            ${cliente.activo
                              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                              : "bg-rose-50 text-rose-500 border-rose-200"
                            }
                          `}
                        >

                          {cliente.activo
                            ? "Paciente activo"
                            : "Paciente inactivo"}

                        </span>

                      </div>

                      {/* SUBTEXT */}

                      <div className="
                        mt-3

                        flex
                        flex-wrap

                        items-center
                        gap-2
                      ">

                        <div className="
                          inline-flex

                          items-center
                          gap-2

                          px-3
                          py-1.5

                          rounded-full

                          bg-indigo-50

                          text-indigo-600

                          text-xs
                          font-semibold
                        ">

                          <Activity size={12} />

                          Paciente frecuente

                        </div>

                        <div className="
                          inline-flex

                          items-center
                          gap-2

                          px-3
                          py-1.5

                          rounded-full

                          bg-slate-100

                          text-slate-600

                          text-xs
                          font-semibold
                        ">

                          <Clock3 size={12} />

                          Última visita reciente

                        </div>

                      </div>

                    </div>

                    {/* NEXT APPOINTMENT */}


                    <div className="
  shrink-0

  rounded-[24px]

  bg-gradient-to-br
  from-indigo-50
  to-purple-50

  border
  border-indigo-100

  px-5
  py-4

  min-w-[240px]
">

                      <div className="
    flex
    items-center
    gap-2

    text-indigo-600

    text-sm
    font-bold
  ">

                        <CalendarDays size={16} />

                        Próxima cita

                      </div>

                      {proximaCita ? (

                        <>

                          <p className="
        mt-3

        text-sm

        font-black

        text-slate-800
      ">

                            {formatFechaCita(
                              proximaCita.fecha
                            )}

                          </p>

                          <div className="
        mt-2

        flex
        items-center
        gap-2
      ">

                            <div className="
          px-2.5
          py-1

          rounded-full

          bg-indigo-100

          text-indigo-700

          text-[11px]
          font-bold
        ">

                              {formatHoraCita(
                                proximaCita.fecha
                              )}

                            </div>

                            {proximaCita.motivo && (

                              <span className="
            text-xs

            text-slate-500

            truncate
          ">

                                {proximaCita.motivo}

                              </span>

                            )}

                          </div>

                          <p className="
        mt-3

        text-xs

        text-emerald-600

        font-semibold
      ">
                            Cita programada
                          </p>

                        </>

                      ) : (

                        <>

                          <p className="
        mt-3

        text-sm

        font-black

        text-slate-700
      ">
                            Pendiente programación
                          </p>

                          <p className="
        mt-2

        text-xs

        text-slate-500
      ">
                            Sin citas registradas
                          </p>

                        </>

                      )}

                    </div>


                  </div>

                  {/* GRID */}

                  <div className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    xl:grid-cols-3

                    gap-4
                  ">

                    {/* DOCUMENTO */}

                    <div className="
                      bg-slate-50/80

                      border
                      border-slate-200/60

                      rounded-[24px]

                      px-5
                      py-4
                    ">

                      <div className="
                        flex
                        items-center
                        gap-2

                        text-slate-400

                        text-[11px]
                        font-black

                        uppercase

                        tracking-[0.12em]
                      ">

                        <FileText size={12} />

                        Documento

                      </div>

                      <p className="
                        mt-3

                        text-sm

                        font-bold

                        text-slate-700

                        break-all
                      ">

                        {cliente.cedula || "No registrado"}

                      </p>

                    </div>

                    {/* TELEFONO */}

                    <div className="
                      bg-slate-50/80

                      border
                      border-slate-200/60

                      rounded-[24px]

                      px-5
                      py-4
                    ">

                      <div className="
                        flex
                        items-center
                        gap-2

                        text-slate-400

                        text-[11px]
                        font-black

                        uppercase

                        tracking-[0.12em]
                      ">

                        <Phone size={12} />

                        Teléfono

                      </div>

                      <p className="
                        mt-3

                        text-sm

                        font-bold

                        text-slate-700
                      ">

                        {cliente.telefono || "No registrado"}

                      </p>

                    </div>

                    {/* DIRECCION */}

                    <div className="
                      bg-slate-50/80

                      border
                      border-slate-200/60

                      rounded-[24px]

                      px-5
                      py-4
                    ">

                      <div className="
                        flex
                        items-center
                        gap-2

                        text-slate-400

                        text-[11px]
                        font-black

                        uppercase

                        tracking-[0.12em]
                      ">

                        <MapPin size={12} />

                        Dirección

                      </div>

                      <p className="
                        mt-3

                        text-sm

                        font-bold

                        text-slate-700

                        truncate
                      ">

                        {direccionTexto || "No registrada"}

                      </p>

                    </div>

                  </div>

                </div>

              </div>

              {/* RIGHT */}

              <div
                onClick={(e) =>
                  e.stopPropagation()
                }
                className="
                  2xl:w-[190px]

                  flex
                  flex-row
                  2xl:flex-col

                  items-stretch

                  gap-3
                "
              >

                {/* PERFIL */}

                <button
                  onClick={() =>
                    onSeleccionar?.(cliente)
                  }
                  className="
                    h-12

                    px-5

                    rounded-2xl

                    bg-gradient-to-r
                    from-indigo-500
                    via-purple-500
                    to-violet-500

                    text-white

                    text-sm
                    font-bold

                    shadow-[0_12px_30px_rgba(99,102,241,0.25)]

                    hover:shadow-[0_18px_40px_rgba(99,102,241,0.35)]

                    hover:scale-[1.02]

                    transition-all
                    duration-300

                    flex
                    items-center
                    justify-center
                    gap-2
                  "
                >

                  <UserCheck size={15} />

                  Ver perfil

                </button>

                {/* NUEVA CITA */}

                <button
                  onClick={() => {

                    navigate("/citas", {

                      state: {

                        clienteSeleccionado: {
                          id: cliente.id,
                          nombre: cliente.nombre,
                          apellido: cliente.apellido
                        }

                      }

                    });

                  }}
                  className="
                    h-12

                    px-5

                    rounded-2xl

                    bg-white

                    border
                    border-slate-200

                    text-slate-700

                    text-sm
                    font-bold

                    hover:border-indigo-200

                    hover:text-indigo-600

                    hover:shadow-md

                    transition-all
                    duration-300

                    flex
                    items-center
                    justify-center
                    gap-2
                  "
                >

                  <CalendarDays size={15} />

                  Nueva cita

                </button>

                {/* ACTIONS */}

                <div className="
                  flex
                  items-center
                  justify-center

                  gap-3

                  pt-1
                ">

                  {/* EDIT */}


                  <button
                    onClick={(e) => {

                      e.stopPropagation();

                      onEditarClick(cliente);

                    }}

                    className="
                      w-11
                      h-11

                      rounded-[18px]

                      bg-slate-100

                      text-slate-500

                      hover:bg-slate-200
                      hover:text-slate-700

                      transition-all
                      duration-300

                      flex
                      items-center
                      justify-center
                    "
                    title="Editar"
                  >

                    <Pencil size={16} />

                  </button>

                  {/* TOGGLE */}

                  <button
                    onClick={() =>
                      onToggleActivo(cliente)
                    }
                    className={`
                      w-11
                      h-11

                      rounded-[18px]

                      transition-all
                      duration-300

                      flex
                      items-center
                      justify-center

                      ${cliente.activo
                        ? "bg-rose-50 text-rose-500 hover:bg-rose-100"
                        : "bg-emerald-50 text-emerald-500 hover:bg-emerald-100"
                      }
                    `}
                    title={
                      cliente.activo
                        ? "Desactivar"
                        : "Activar"
                    }
                  >

                    {cliente.activo
                      ? <Ban size={16} />
                      : <Check size={16} />}

                  </button>

                </div>

              </div>

            </div>

            {/* SELECTED */}

            {isSelected && (

              <div className="
                absolute
                top-5
                right-5
              ">

                <div className="
                  w-3.5
                  h-3.5

                  rounded-full

                  bg-indigo-500

                  shadow-[0_0_20px_rgba(99,102,241,0.9)]
                " />

              </div>

            )}

          </div>

        );

      })}

      {/* EMPTY */}

      {clientes.length === 0 && (

        <div className="
          relative
          overflow-hidden

          bg-white/95
          backdrop-blur-md

          border
          border-slate-200/80

          rounded-[36px]

          p-14

          text-center

          shadow-[0_15px_40px_rgba(0,0,0,0.05)]
        ">

          <div className="
            absolute
            -top-10
            -right-10

            w-52
            h-52

            rounded-full

            bg-indigo-500/10

            blur-3xl
          " />

          <div className="
            relative
            z-10

            w-24
            h-24

            mx-auto

            rounded-[30px]

            bg-gradient-to-br
            from-indigo-500
            via-purple-500
            to-violet-500

            flex
            items-center
            justify-center

            text-white

            shadow-[0_20px_50px_rgba(99,102,241,0.35)]
          ">

            <UserCheck size={42} />

          </div>

          <h3 className="
            mt-8

            text-3xl

            font-black

            text-slate-800
          ">
            No hay pacientes
          </h3>

          <p className="
            mt-3

            text-slate-500

            max-w-sm

            mx-auto
          ">
            Los pacientes registrados aparecerán aquí automáticamente
          </p>

        </div>

      )}

    </div>

  );

}

export default ClienteList;