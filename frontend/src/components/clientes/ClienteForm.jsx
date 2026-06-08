import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";

import toast from "react-hot-toast";

import { useClientes } from "../../hooks/useClientes";

import provincias from "../../data/provincias.json";
import municipios from "../../data/municipios.json";

function ClienteForm({
  cliente,
  onClose
}) {

  /*
  ==========================================
  HELPERS
  ==========================================
  */

  const normalizarCedula = (cedula) =>
    cedula?.replace(/[^0-9]/g, "") || "";

  /*
  ==========================================
  HOOKS
  ==========================================
  */

  const {
    clientes,
    crearCliente,
    editarCliente
  } = useClientes();

  const isEdit =
    !!cliente;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm();

  /*
  ==========================================
  STATES
  ==========================================
  */

  const [loading, setLoading] =
    useState(false);

  const [cedulaError, setCedulaError] =
    useState("");

  const [provincia, setProvincia] =
    useState(null);

  const [municipio, setMunicipio] =
    useState("");

  const cedulaInput =
    watch("cedula");

  /*
  ==========================================
  MUNICIPIOS
  ==========================================
  */

  const municipiosFiltrados =
    municipios.filter(
      (m) =>
        Number(m.provinciaId) ===
        Number(provincia)
    );

  /*
  ==========================================
  CARGAR DATOS EDIT
  ==========================================
  */

  useEffect(() => {

    if (cliente) {

      reset({
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        cedula: cliente.cedula,
        telefono: cliente.telefono,
        calle:
          cliente.direccion?.calle || ""
      });

      const normalizar = (txt) =>
        txt?.toLowerCase().trim();

      const provinciaEncontrada =
        provincias.find(
          p =>
            normalizar(p.nombre) ===
            normalizar(
              cliente.direccion?.provincia_nombre
            )
        );

      const municipioEncontrado =
        municipios.find(
          m =>
            normalizar(m.nombre) ===
            normalizar(
              cliente.direccion?.municipio_nombre
            ) &&
            Number(m.provinciaId) ===
            Number(
              provinciaEncontrada?.id
            )
        );

      setProvincia(
        provinciaEncontrada?.id || null
      );

      setMunicipio(
        municipioEncontrado?.nombre || ""
      );

    } else {

      reset({
        nombre: "",
        apellido: "",
        cedula: "",
        telefono: "",
        calle: ""
      });

      setProvincia(null);

      setMunicipio("");

    }

  }, [cliente, reset]);

  /*
  ==========================================
  VALIDAR CEDULA
  ==========================================
  */

  useEffect(() => {

    const cedulaNormalizada =
      normalizarCedula(
        cedulaInput
      );

    if (
      !cedulaNormalizada ||
      cedulaNormalizada.length < 6
    ) {

      setCedulaError("");

      return;

    }

    const timeout =
      setTimeout(() => {

        const existente =
          clientes.find(c =>
            normalizarCedula(
              c.cedula
            ) === cedulaNormalizada
          );

        if (
          existente &&
          (
            !isEdit ||
            existente.id !== cliente?.id
          )
        ) {

          setCedulaError(
            "Cédula ya registrada"
          );

        } else {

          setCedulaError("");

        }

      }, 300);

    return () =>
      clearTimeout(timeout);

  }, [
    cedulaInput,
    clientes,
    isEdit,
    cliente
  ]);

  /*
  ==========================================
  SUBMIT
  ==========================================
  */

  const onSubmit = async (data) => {

    if (cedulaError) {

      return toast.error(
        "Cédula duplicada ❌"
      );

    }

    if (
      !provincia ||
      !municipio
    ) {

      return toast.error(
        "Ubicación requerida ⚠️"
      );

    }

    try {

      setLoading(true);

      const payload = {

        ...data,

        direccion: {

          provincia_nombre:
            provincias.find(
              p =>
                Number(p.id) ===
                Number(provincia)
            )?.nombre ?? null,

          municipio_nombre:
            municipio,

          calle:
            data.calle || ""

        }

      };

      if (isEdit) {

        await editarCliente.mutateAsync({
          id: cliente.id,
          data: payload
        });

        toast.success(
          "Cliente actualizado ✅"
        );

      } else {

        await crearCliente.mutateAsync(
          payload
        );

        toast.success(
          "Cliente creado ✅"
        );

      }

      reset();

      setProvincia(null);

      setMunicipio("");

      onClose();

    } catch {

      toast.error(
        "Error ❌"
      );

    }

    setLoading(false);

  };

  return (

    <div className="
      relative
      overflow-hidden

      w-full
      h-full

      md:h-auto
      md:max-h-[92vh]

      bg-white/95
      backdrop-blur-2xl

      rounded-t-[36px]
      md:rounded-[36px]

      border-0
      md:border
      border-white/40

      shadow-[0_25px_80px_rgba(0,0,0,0.15)]

      p-5
      sm:p-6

      flex
      flex-col

      gap-6

      overflow-y-auto
      overflow-x-hidden
    ">

      {/* GLOW */}

      <div className="
        absolute
        -top-20
        -right-20

        w-72
        h-72

        rounded-full

        bg-purple-500/10

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

        <h2 className="
          text-3xl
          sm:text-4xl

          font-black

          tracking-tight

          text-slate-800
        ">

          {isEdit
            ? "Editar cliente ✏️"
            : "Nuevo cliente 👤"}

        </h2>

        <div className="
          w-20
          h-1

          mx-auto

          rounded-full

          bg-gradient-to-r
          from-indigo-500
          to-purple-500
        " />

        <p className="
          text-sm
          sm:text-base

          text-gray-500
        ">
          Completa la información básica
        </p>

      </div>

      {/* FORM */}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="
          relative
          z-10

          flex
          flex-col

          gap-6

          flex-1
          min-h-0
        "
      >

        {/* INFO BASICA */}

        <div className="
          bg-gradient-to-br
          from-white
          to-slate-50

          border
          border-white

          rounded-[30px]

          p-5

          shadow-sm

          space-y-4
        ">

          <div className="
            flex
            items-center
            gap-3
          ">

            <div className="
              w-12
              h-12

              rounded-[18px]

              bg-gradient-to-br
              from-indigo-500
              to-purple-500

              text-white

              flex
              items-center
              justify-center

              text-xl
            ">
              👤
            </div>

            <div>

              <h3 className="
                text-sm

                font-black

                uppercase

                tracking-[0.12em]

                text-slate-700
              ">
                Información básica
              </h3>

              <p className="
                text-xs
                text-gray-400
              ">
                Datos personales del cliente
              </p>

            </div>

          </div>

          <div className="
            grid
            grid-cols-1
            sm:grid-cols-2

            gap-4
          ">

            {/* NOMBRE */}

            <div className="space-y-2">

              <label className="
                text-xs

                font-bold

                text-gray-500
              ">
                Nombre
              </label>

              <input
                {...register(
                  "nombre",
                  { required: true }
                )}
                placeholder="Nombre"
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
                  focus:ring-indigo-500/10

                  focus:border-indigo-300

                  transition-all
                  duration-300
                "
              />

            </div>

            {/* APELLIDO */}

            <div className="space-y-2">

              <label className="
                text-xs

                font-bold

                text-gray-500
              ">
                Apellido
              </label>

              <input
                {...register(
                  "apellido",
                  { required: true }
                )}
                placeholder="Apellido"
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
                  focus:ring-indigo-500/10

                  focus:border-indigo-300

                  transition-all
                  duration-300
                "
              />

            </div>

          </div>

        </div>

        {/* IDENTIDAD */}

        <div className="
          bg-gradient-to-br
          from-white
          to-slate-50

          border
          border-white

          rounded-[30px]

          p-5

          shadow-sm

          space-y-4
        ">

          <div className="
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

              text-xl
            ">
              🪪
            </div>

            <div>

              <h3 className="
                text-sm

                font-black

                uppercase

                tracking-[0.12em]

                text-slate-700
              ">
                Identidad
              </h3>

              <p className="
                text-xs
                text-gray-400
              ">
                Documento y contacto
              </p>

            </div>

          </div>

          <div className="
            grid
            grid-cols-1
            sm:grid-cols-2

            gap-4
          ">

            {/* CEDULA */}

            <div className="
              space-y-2
            ">

              <label className="
                text-xs

                font-bold

                text-gray-500
              ">
                Cédula
              </label>

              <input
                {...register("cedula")}
                placeholder="Cédula"
                className={`
                  w-full

                  h-14

                  px-5

                  rounded-[24px]

                  bg-white/80

                  text-slate-700

                  shadow-sm

                  focus:outline-none

                  focus:ring-4

                  transition-all
                  duration-300

                  ${cedulaError
                    ? `
                      border
                      border-red-300

                      focus:ring-red-500/10
                    `
                    : `
                      border
                      border-slate-200

                     focus:ring-4
                    focus:ring-emerald-500/10

                    focus:border-emerald-300
                    `
                  }
                `}
              />

              {cedulaError && (

                <p className="
                  text-sm
                  text-red-500

                  font-medium
                ">
                  {cedulaError}
                </p>

              )}

            </div>

            {/* TELEFONO */}

            <div className="
              space-y-2
            ">

              <label className="
                text-xs

                font-bold

                text-gray-500
              ">
                Teléfono
              </label>

              <input
                {...register("telefono")}
                placeholder="Teléfono"
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
                    focus:ring-emerald-500/10

                    focus:border-emerald-300

                  transition-all
                  duration-300
                "
              />

            </div>

          </div>

        </div>

        {/* UBICACION */}

        <div className="
          bg-gradient-to-br
          from-white
          to-slate-50

          border
          border-white

          rounded-[30px]

          p-5

          shadow-sm

          space-y-4
        ">

          <div className="
            flex
            items-center
            gap-3
          ">

            <div className="
              w-12
              h-12

              rounded-[18px]

              bg-gradient-to-br
              from-rose-500
              to-pink-500

              text-white

              flex
              items-center
              justify-center

              text-xl
            ">
              📍
            </div>

            <div>

              <h3 className="
                text-sm

                font-black

                uppercase

                tracking-[0.12em]

                text-slate-700
              ">
                Ubicación
              </h3>

              <p className="
                text-xs
                text-gray-400
              ">
                Provincia y dirección
              </p>

            </div>

          </div>

          <div className="
            grid
            grid-cols-1
            sm:grid-cols-2

            gap-4
          ">

            {/* PROVINCIA */}

            <div className="
              space-y-2
            ">

              <label className="
                text-xs

                font-bold

                text-gray-500
              ">
                Provincia
              </label>

              <select
                value={provincia ?? ""}
                onChange={(e) => {

                  setProvincia(
                    Number(
                      e.target.value
                    )
                  );

                  setMunicipio("");

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
              focus:ring-rose-500/10

              focus:border-rose-300

                  transition-all
                  duration-300
                "
              >

                <option value="">
                  Provincia
                </option>

                {provincias.map((p) => (

                  <option
                    key={p.id}
                    value={p.id}
                  >
                    {p.nombre}
                  </option>

                ))}

              </select>

            </div>

            {/* MUNICIPIO */}

            <div className="
              space-y-2
            ">

              <label className="
                text-xs

                font-bold
                
                text-gray-500
              ">
                Municipio
              </label>

              <select
                value={municipio ?? ""}
                onChange={(e) =>
                  setMunicipio(
                    e.target.value
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
              focus:ring-rose-500/10

              focus:border-rose-300

                  transition-all
                  duration-300
                "
              >

                <option value="">
                  Municipio
                </option>

                {municipiosFiltrados.map((m) => (

                  <option 
                    key={m.nombre}
                    value={m.nombre}
                  >
                    {m.nombre}
                  </option>

                ))}

              </select>

            </div>

          </div>

          {/* CALLE */}

          <div className="
            space-y-2
          ">

            <label className="
              text-xs

              font-bold

              text-gray-500
            ">
              Dirección / Calle
            </label>

            <input
              {...register("calle")}
              placeholder="Dirección / Calle"
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
              focus:ring-rose-500/10

              focus:border-rose-300

                transition-all
                duration-300
              "
            />

          </div>

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

          {/* PRIMARY */}
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
            "
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={
              loading ||
              cedulaError
            }
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

              ${loading || cedulaError
                ? "bg-gray-400 cursor-not-allowed"
                : `
                  bg-gradient-to-r
                  from-indigo-500
                  via-purple-500
                  to-violet-500

                  shadow-[0_15px_35px_rgba(99,102,241,0.28)]

                  hover:scale-[1.01]

                  hover:shadow-[0_20px_45px_rgba(99,102,241,0.35)]
                `
              }
            `}
          >

            {loading
              ? "Guardando..."
              : isEdit
                ? "Actualizar cliente"
                : "Crear cliente"}

          </button>



        </div>

      </form>

    </div>

  );

}

export default ClienteForm;