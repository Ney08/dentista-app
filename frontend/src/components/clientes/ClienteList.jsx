import { useNavigate } from "react-router-dom";
import { useState } from "react";

function ClienteList({
  clientes,
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
  
  return (

    <div className="h-full space-y-6 overflow-y-auto overflow-x-hidden pr-1 pb-2">

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

              bg-white/90
              backdrop-blur-xl

              border
              border-white/40

              rounded-[34px]

              p-5 sm:p-6

              transition-all
              duration-500

              cursor-pointer

              hover:-translate-y-[4px]

              hover:border-indigo-200

              hover:bg-white

              hover:shadow-[0_25px_60px_rgba(99,102,241,0.12)]

              ${isSelected
                ? "ring-2 ring-indigo-400 shadow-[0_25px_60px_rgba(99,102,241,0.18)]"
                : ""
              }
            `}
          >

            {/* TOP LINE */}

            <div
              className={`
                absolute
                top-0
                left-0
                h-1
                w-full
                bg-gradient-to-r
                ${color}
              `}
            />

            {/* GLOW TOP */}

            <div className="
              absolute
              -top-16
              -right-16
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

            {/* GLOW BOTTOM */}

            <div className="
              absolute
              -bottom-16
              -left-16
              w-56
              h-56
              rounded-full
              bg-purple-500/10
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

              flex
              flex-col
              xl:flex-row

              xl:items-center
              xl:justify-between

              gap-6
            ">

              {/* LEFT */}

              <div className="
                flex
                items-start
                gap-5

                min-w-0
                flex-1
              ">

                {/* AVATAR */}

                <div
                  className={`
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

                    shadow-[0_15px_35px_rgba(0,0,0,0.15)]

                    shrink-0

                    group-hover:scale-105

                    transition-all
                    duration-300
                  `}
                >
                  {cliente.nombre?.charAt(0)?.toUpperCase()}
                </div>

                {/* INFO */}

                <div className="
                  min-w-0
                  flex-1
                  space-y-4
                ">

                  {/* HEADER */}

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

                      {cliente.nombre} {cliente.apellido}

                    </h3>

                    <span
                      className={`
                        px-3
                        py-1.5

                        rounded-full

                        text-[11px]
                        font-bold

                        border

                        shadow-sm

                        ${cliente.activo
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                          : "bg-rose-50 text-rose-500 border-rose-200"
                        }
                      `}
                    >
                      {cliente.activo
                        ? "Activo"
                        : "Inactivo"}
                    </span>

                  </div>

                  {/* GRID */}

                  <div className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-3
                  ">

                    {/* DOCUMENTO */}

                    <div className="
                      bg-gradient-to-br
                      from-white
                      to-slate-100/90

                      border
                      border-white

                      rounded-[24px]

                      px-5
                      py-4

                      transition-all
                      duration-300

                      group-hover:shadow-sm
                    ">

                      <p className="
                        text-[11px]

                        uppercase

                        tracking-[0.12em]

                        text-gray-400

                        font-black
                      ">
                        Documento
                      </p>

                      <p className="
                        mt-2

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
                      bg-gradient-to-br
                      from-white
                      to-slate-100/90

                      border
                      border-white

                      rounded-[24px]

                      px-5
                      py-4

                      transition-all
                      duration-300

                      group-hover:shadow-sm
                    ">

                      <p className="
                        text-[11px]

                        uppercase

                        tracking-[0.12em]

                        text-gray-400

                        font-black
                      ">
                        Teléfono
                      </p>

                      <p className="
                        mt-2

                        text-sm

                        font-bold

                        text-slate-700
                      ">
                        {cliente.telefono || "No registrado"}
                      </p>

                    </div>

                    {/* DIRECCION */}

                    <div className="
                      bg-gradient-to-br
                      from-white
                      to-slate-100/90

                      border
                      border-white

                      rounded-[24px]

                      px-5
                      py-4

                      md:col-span-2

                      transition-all
                      duration-300

                      group-hover:shadow-sm
                    ">

                      <p className="
                        text-[11px]

                        uppercase

                        tracking-[0.12em]

                        text-gray-400

                        font-black
                      ">
                        Dirección
                      </p>

                      <p className="
                        mt-2

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

              {/* RIGHT PANEL */}

              <div
                onClick={(e) =>
                  e.stopPropagation()
                }
                className="
                  xl:min-w-[180px]

                  flex
                  flex-row
                  xl:flex-col

                  items-stretch

                  gap-3

                  opacity-100

                  transition-all
                  duration-300
                "
              >

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
    group

    relative
    overflow-hidden

    h-11

    px-4

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

    hover:scale-[1.03]

    active:scale-[0.97]

    transition-all
    duration-300

    flex
    items-center
    gap-2
  "
                >

                  <div className="
    absolute
    inset-0

    opacity-0

    bg-white/10

    group-hover:opacity-100

    transition-all
    duration-300
  " />

                  <span className="relative z-10 text-base">
                    📅
                  </span>

                  <span className="relative z-10">
                    Cita
                  </span>

                </button>

                {/* ACTIONS */}

                <div className="
                  flex
                  items-center
                  justify-center
                  gap-3
                ">

                  {/* EDITAR */}

                  <button
                    onClick={() =>
                      onEditarClick(cliente)
                    }
                    className="
                      w-12
                      h-12

                      rounded-[20px]

                      bg-gradient-to-br
                      from-slate-100
                      to-slate-200/70

                      text-slate-500

                      hover:text-slate-700

                      border
                      border-white

                      flex
                      items-center
                      justify-center

                      hover:scale-110

                      active:scale-95

                      hover:shadow-lg

                      transition-all
                      duration-300
                    "
                    title="Editar"
                  >
                    ✏️
                  </button>

                  {/* TOGGLE */}

                  <button
                    onClick={() =>
                      onToggleActivo(cliente)
                    }
                    className={`
                      w-12
                      h-12

                      rounded-[20px]

                      border
                      border-white

                      flex
                      items-center
                      justify-center

                      hover:scale-110

                      active:scale-95

                      hover:shadow-lg

                      transition-all
                      duration-300

                      ${cliente.activo
                        ? "bg-gradient-to-br from-rose-50 to-rose-100 text-rose-500"
                        : "bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-500"
                      }
                    `}
                    title={
                      cliente.activo
                        ? "Desactivar"
                        : "Activar"
                    }
                  >
                    {cliente.activo
                      ? "🚫"
                      : "✅"}
                  </button>

                </div>

              </div>

            </div>

            {/* SELECTED INDICATOR */}

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

          bg-white/90
          backdrop-blur-xl

          border
          border-white/40

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

            text-5xl
            text-white

            shadow-[0_20px_50px_rgba(99,102,241,0.35)]
          ">
            👥
          </div>

          <h3 className="
            mt-8

            text-3xl

            font-black

            text-slate-800
          ">
            No hay clientes
          </h3>

          <p className="
            mt-3

            text-gray-500

            max-w-sm

            mx-auto
          ">
            Los clientes registrados aparecerán aquí automáticamente
          </p>

        </div>

      )}

    </div>

  );

}

export default ClienteList;