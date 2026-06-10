import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { useState, useEffect } from "react";

import { useServicios } from "../../hooks/useServicios";
import { useIngresos } from "../../hooks/useIngresos";
import { useCitas } from "../../hooks/useCitas";

import {
  User2,
  Receipt,
  BadgeDollarSign,
  Wallet,
  Plus,
  Trash2,
  Save,
  X,
  CalendarDays,
  Clock3,
  Sparkles,
  FileText
} from "lucide-react";

import {
  showSuccess,
  showError,
  showWarning,
  showInfo
} from "../ui/ToastStyles";

import {
  formatFecha,
  formatHora
} from "../../utils/fecha";

import { formatMoney } from "../../utils/format";

function IngresoForm({
  clientes,
  initialData,
  citaPreset,
  onClose
}) {

  /*
  ==========================================
  HOOKS
  ==========================================
  */

  const {
    servicios: catalogoServicios
  } = useServicios();

  const {
    crearIngreso,
    actualizarIngreso
  } = useIngresos();

  const {
    citas
  } = useCitas();

  /*
  ==========================================
  FORM
  ==========================================
  */

  const {
    handleSubmit,
    reset
  } = useForm();

  /*
  ==========================================
  STATES
  ==========================================
  */

  const [clienteId, setClienteId] =
    useState("");

  const [citaSeleccionada, setCitaSeleccionada] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [servicios, setServicios] =
    useState([
      {
        descripcion: "",
        monto: "",
        costo_servicio: 0
      }
    ]);

  const [descuento, setDescuento] =
    useState(0);

  /*
  ==========================================
  HELPERS
  ==========================================
  */

  const normalize = (text) => {

    return (text || "")
      .toLowerCase()
      .trim();

  };

  /*
  ==========================================
  CLIENTE PRESET
  ==========================================
  */

  useEffect(() => {

    if (!citaPreset) {
      return;
    }

    setClienteId(
      String(
        citaPreset.cliente_id
      )
    );

  }, [citaPreset]);

  /*
  ==========================================
  AUTO SERVICIO
  ==========================================
  */

  const autoSeleccionarServicio = (
    clienteId
  ) => {

    if (citaPreset) {

      setCitaSeleccionada(
        citaPreset
      );

      return;

    }

    const ahora =
      new Date();

    const citasCliente =
      citas
        .filter(
          c =>
            Number(c.cliente_id) ===
            Number(clienteId) &&
            c.estado === "pendiente"
        )
        .map(c => ({
          ...c,
          fechaObj: new Date(
            c.fecha.replace(
              "T",
              " "
            )
          )
        }));

    if (citasCliente.length === 0) {

      setCitaSeleccionada(
        null
      );

      setServicios([
        {
          descripcion: "",
          monto: "",
          costo_servicio: 0
        }
      ]);

      showWarning(
        "No hay citas relacionadas ⚠️"
      );

      return;

    }

    const hoy =
      new Date();

    const citaHoy =
      citasCliente.find(
        c =>
          c.fechaObj.toDateString() ===
          hoy.toDateString()
      );

    let citaElegida =
      citaHoy;

    if (!citaElegida) {

      citaElegida =
        citasCliente.sort(
          (a, b) =>
            Math.abs(
              a.fechaObj - ahora
            ) -
            Math.abs(
              b.fechaObj - ahora
            )
        )[0];

    }

    if (!citaElegida) {

      setCitaSeleccionada(
        null
      );

      setServicios([
        {
          descripcion: "",
          monto: "",
          costo_servicio: 0
        }
      ]);

      showInfo(
        "No hay citas relacionadas ⚠️"
      );

      return;

    }

    setCitaSeleccionada(
      citaElegida
    );

    if (!citaElegida.motivo) {
      return;
    }

    const servicioEncontrado =
      catalogoServicios.find(s => {

        const nombre =
          normalize(
            s?.nombre ||
            s?.descripcion
          );

        const motivo =
          normalize(
            citaElegida?.motivo
          );

        return motivo
          .split(" ")
          .some(
            p =>
              nombre.includes(p)
          );

      });

    if (!servicioEncontrado) {

      showInfo(
        "No hay servicio relacionado ⚠️"
      );

      setServicios([
        {
          descripcion: "",
          monto: "",
          costo_servicio: 0
        }
      ]);

      return;

    }

    setServicios(prev => {

      const copia =
        [...prev];

      copia[0] = {

        descripcion:
          servicioEncontrado.nombre ||
          servicioEncontrado.descripcion ||
          "",

        monto:
          servicioEncontrado.precio || "",

        costo_servicio:
          servicioEncontrado.costo_servicio || 0

      };

      return copia;

    });

    showSuccess(
      `Servicio sugerido ✨ ${formatFecha(citaElegida.fechaObj)}`
    );

  };

  /*
  ==========================================
  PRESET CITA
  ==========================================
  */

  useEffect(() => {

    if (
      !citaPreset ||
      initialData
    ) {
      return;
    }

    setCitaSeleccionada(
      citaPreset
    );

    if (citaPreset.motivo) {

      const encontrado =
        catalogoServicios.find(
          s =>
            s.nombre
              ?.toLowerCase()
              .trim() ===
            citaPreset.motivo
              ?.toLowerCase()
              .trim()
        );

      if (encontrado) {

        setServicios([
          {
            descripcion:
              encontrado.nombre,

            monto:
              encontrado.precio,

            costo_servicio:
              encontrado.costo_servicio || 0
          }
        ]);

      }

    }

  }, [
    citaPreset,
    initialData,
    catalogoServicios
  ]);

  /*
  ==========================================
  EDITAR
  ==========================================
  */

  useEffect(() => {

    if (initialData) {

      setServicios(
        initialData.servicios || []
      );

      setDescuento(
        initialData.descuento || 0
      );

      const id =
        initialData.cliente_id
          ? String(
            initialData.cliente_id
          )
          : "";

      setClienteId(id);

    } else if (!citaPreset) {

      setClienteId("");

    }

  }, [
    initialData,
    citaPreset
  ]);

  /*
  ==========================================
  CRUD SERVICIOS
  ==========================================
  */

  const agregarServicio = () => {

    setServicios([
      ...servicios,
      {
        descripcion: "",
        monto: "",
        costo_servicio: 0
      }
    ]);

  };

  const eliminarServicio = (index) => {

    setServicios(
      servicios.filter(
        (_, i) => i !== index
      )
    );

  };

  const actualizarServicio = (
    index,
    campo,
    valor
  ) => {

    const nuevos =
      [...servicios];

    nuevos[index][campo] =
      valor;

    setServicios(
      nuevos
    );

  };

  /*
  ==========================================
  TOTAL
  ==========================================
  */

  const subtotal =
    servicios.reduce(
      (acc, s) =>
        acc + Number(s.monto || 0),
      0
    );

  const itbis =
    subtotal * 0.18;

  const descuentoValor =
    subtotal *
    ((descuento || 0) / 100);

  const total =
    subtotal +
    itbis -
    descuentoValor;

  /*
  ==========================================
  SUBMIT
  ==========================================
  */

  const onSubmit = async () => {

    for (let s of servicios) {

      if (
        !s.descripcion ||
        !s.monto
      ) {

        showError(
          "Completa todos los servicios ⚠️"
        );

        return;

      }

    }

    const payload = {

      cliente_id:
        parseInt(
          clienteId
        ),

      descuento:
        parseFloat(
          descuento
        ) || 0,

      cita_id:
        citaSeleccionada?.id || null,

      servicios:
        servicios.map(s => ({

          descripcion:
            s.descripcion,

          monto:
            parseFloat(
              s.monto
            ),

          costo_servicio:
            parseFloat(
              s.costo_servicio || 0
            )

        }))

    };

    setLoading(true);

    const toastId =
      toast.loading(
        "Guardando factura..."
      );

    try {

      if (initialData) {

        await actualizarIngreso.mutateAsync({
          id: initialData.id,
          data: payload
        });

        showSuccess(
          "Factura actualizada ✅",
          { id: toastId }
        );

      } else {

        await crearIngreso.mutateAsync(
          payload
        );

        showSuccess(
          "Factura creada ✅",
          { id: toastId }
        );

      }

      reset();

      setServicios([
        {
          descripcion: "",
          monto: "",
          costo_servicio: 0
        }
      ]);

      setDescuento(0);

      onClose();

    } catch {

      showError(
        "Error ❌",
        { id: toastId }
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

        bg-indigo-500/10

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
    from-indigo-500
    via-purple-500
    to-violet-500

    text-white

    flex
    items-center
    justify-center

    shadow-[0_20px_50px_rgba(99,102,241,0.35)]
  ">

          <Receipt size={34} />

        </div>

        <h2 className="
    text-3xl
    sm:text-4xl

    font-black

    tracking-tight

    text-slate-800
  ">

          {initialData
            ? "Editar factura"
            : "Registrar factura"}

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

    text-slate-500
  ">

          {initialData
            ? "Modifica los detalles de la factura"
            : "Completa los datos de facturación"}

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

        {/* CLIENTE */}

        <div className="
  bg-slate-50/70

  border
  border-slate-200/70

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
      via-purple-500
      to-violet-500

      text-white

      flex
      items-center
      justify-center
    ">

              <User2 size={20} />

            </div>

            <div>

              <h3 className="
        text-sm

        font-black

        uppercase

        tracking-[0.12em]

        text-slate-700
      ">
                Cliente
              </h3>

              <p className="
        text-xs
        text-slate-400
      ">
                Selecciona el paciente
              </p>

            </div>

          </div>


          <select
            value={clienteId}


            disabled={
              !!initialData ||
              !!citaPreset
            }


            onChange={(e) => {

              const id =
                e.target.value;

              setClienteId(id);

              autoSeleccionarServicio(
                id
              );

            }}

            className={`
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

              ${initialData || citaPreset
                ? "bg-slate-100 text-slate-400"
                : ""
              }
            `}
          >

            <option value="">
              Seleccionar cliente
            </option>

            {clientes.map(c => (

              <option
                key={c.id}
                value={String(c.id)}
              >
                {c.nombre}
                {" "}
                {c.apellido}
              </option>

            ))}

          </select>

          {/* CITA */}

          {citaSeleccionada && (

            <div className="
    bg-emerald-50

    border
    border-emerald-100

    rounded-[24px]

    p-4

    flex
    flex-col
    sm:flex-row

    sm:items-center
    sm:justify-between

    gap-3
  ">

              <div>

                <div className="
        flex
        items-center
        gap-2

        text-emerald-500

        text-xs
        font-black

        uppercase

        tracking-[0.12em]
      ">

                  <CalendarDays size={12} />

                  Cita vinculada

                </div>

                <p className="
        mt-2

        text-sm

        font-bold

        text-slate-700
      ">

                  {formatFecha(
                    citaSeleccionada.fecha
                  )}
                  {" • "}
                  {formatHora(
                    citaSeleccionada.fecha
                  )}

                </p>

              </div>

              <div className="
      inline-flex

      items-center
      gap-2

      px-4
      py-2

      rounded-2xl

      bg-white

      text-sm
      font-semibold

      text-emerald-600

      shadow-sm
    ">

                <Sparkles size={14} />

                {citaSeleccionada.motivo}

              </div>

            </div>

          )}

        </div>

        {/* SERVICIOS */}

        <div className="
  bg-slate-50/70

  border
  border-slate-200/70

  rounded-[30px]

  p-5

  shadow-sm

  flex
  flex-col

  gap-5

  min-h-0
">

          {/* HEADER */}

          <div className="
    flex
    items-center
    justify-between

    gap-3
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
      ">

                <Receipt size={20} />

              </div>

              <div>

                <h3 className="
          text-sm

          font-black

          uppercase

          tracking-[0.12em]

          text-slate-700
        ">
                  Servicios
                </h3>

                <p className="
          text-xs
          text-slate-400
        ">
                  Procedimientos incluidos
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={agregarServicio}
              className="
        h-11

        px-5

        rounded-2xl

        bg-gradient-to-r
        from-indigo-500
        via-purple-500
        to-violet-500

        text-white

        text-sm
        font-bold

        shadow-[0_10px_30px_rgba(99,102,241,0.25)]

        hover:scale-[1.03]

        active:scale-95

        transition-all
        duration-300

        flex
        items-center
        justify-center
        gap-2
      "
            >

              <Plus size={15} />

              Agregar

            </button>

          </div>

          {/* ITEMS */}

          <div className="
            space-y-4

            overflow-y-auto
            overflow-x-hidden

            pr-1

            max-h-[38vh]
          ">

            {servicios.map((s, index) => (

              <div
                key={index}
                className="
                  relative

                  bg-white/80

                  border
                  border-slate-200

                  rounded-[28px]

                  p-4

                  shadow-sm

                  space-y-4
                "
              >

                {/* DELETE */}

                {servicios.length > 1 && (

                  <button
                    type="button"
                    onClick={() =>
                      eliminarServicio(index)
                    }
                    className="
      absolute
      top-4
      right-4

      w-10
      h-10

      rounded-xl

      bg-rose-50

      border
      border-rose-100

      text-rose-500

      hover:bg-rose-100

      transition-all
      duration-300

      flex
      items-center
      justify-center
    "
                  >

                    <Trash2 size={16} />

                  </button>

                )}

                {/* SELECT */}

                <select
                  value={s.descripcion}
                  onChange={(e) => {

                    const seleccionado =
                      catalogoServicios.find(
                        serv =>
                          serv.nombre ===
                          e.target.value
                      );

                    actualizarServicio(
                      index,
                      "descripcion",
                      seleccionado.nombre
                    );

                    actualizarServicio(
                      index,
                      "monto",
                      seleccionado.precio
                    );

                    actualizarServicio(
                      index,
                      "costo_servicio",
                      seleccionado.costo_servicio || 0
                    );

                  }}
                  className="
                    w-full

                    h-14

                    px-5

                    rounded-[22px]

                    bg-white

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
                >

                  <option value="">
                    Seleccionar servicio
                  </option>

                  {catalogoServicios.map((serv, i) => {

                    const yaSeleccionado =
                      servicios.some(
                        (s2, i2) =>
                          s2.descripcion ===
                          serv.nombre &&
                          i2 !== index
                      );

                    return (

                      <option
                        key={i}
                        value={serv.nombre}
                        disabled={yaSeleccionado}
                      >
                        {serv.nombre}
                        {" "}
                        (RD$
                        {" "}
                        {formatMoney(serv.precio)}
                        )

                      </option>

                    );

                  })}

                </select>

                {/* PRECIO */}

                <input
                  type="number"
                  value={s.monto}
                  onChange={(e) =>
                    actualizarServicio(
                      index,
                      "monto",
                      e.target.value
                    )
                  }
                  placeholder="Monto del servicio"
                  className="
                    w-full

                    h-14

                    px-5

                    rounded-[22px]

                    bg-white

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

                {/* COSTO */}

                <div className="
  flex
  items-center
  justify-between

  bg-slate-50

  border
  border-slate-100

  rounded-[20px]

  px-4
  py-3
">

                  <div className="
    flex
    items-center
    gap-2

    text-sm
    text-slate-500
  ">

                    <Wallet size={14} />

                    Costo interno

                  </div>

                  <span className="
    text-sm

    font-bold

    text-slate-700
  ">

                    RD$
                    {" "}
                    {formatMoney(
                      s.costo_servicio || 0
                    )}

                  </span>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* RESUMEN */}

        <div className="
  bg-slate-50/70

  border
  border-slate-200/70

  rounded-[30px]

  p-5

  shadow-sm

  space-y-5
">

          {/* HEADER */}

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
      from-yellow-500
      to-orange-500

      text-white

      flex
      items-center
      justify-center
    ">

              <BadgeDollarSign size={20} />

            </div>

            <div>

              <h3 className="
        text-sm

        font-black

        uppercase

        tracking-[0.12em]

        text-slate-700
      ">
                Resumen factura
              </h3>

              <p className="
        text-xs
        text-slate-400
      ">
                Totales e impuestos
              </p>

            </div>

          </div>


          {/* DESCUENTO */}

          <div className="
            space-y-2
          ">

            {/* DESCUENTO LABEL */}

            <label className="
  text-xs

  font-bold

  text-slate-500

  flex
  items-center
  gap-2
">

              <BadgeDollarSign size={13} />

              Descuento (%)

            </label>

            <input
              type="number"
              value={descuento}
              onChange={(e) =>
                setDescuento(
                  e.target.value
                )
              }
              className="
                w-full

                h-14

                px-5

                rounded-[22px]

                bg-white

                border
                border-slate-200

                text-slate-700

                shadow-sm

                focus:outline-none

                focus:ring-4
                focus:ring-yellow-500/10

                focus:border-yellow-300

                transition-all
                duration-300
              "
            />

          </div>

          {/* TOTALS */}

          <div className="
            grid
            grid-cols-1
            sm:grid-cols-3

            gap-4
          ">

            {/* SUBTOTAL */}

            <div className="
              bg-white

              border
              border-slate-100

              rounded-[24px]

              p-4

              text-center
            ">

              <p className="
                text-xs

                uppercase

                tracking-[0.12em]

                font-black

                text-gray-400
              ">
                Subtotal
              </p>

              <p className="
                mt-2

                text-xl

                font-black

                text-slate-700
              ">
                RD$
                {" "}
                {formatMoney(subtotal)}
              </p>

            </div>

            {/* ITBIS */}

            <div className="
              bg-white

              border
              border-slate-100

              rounded-[24px]

              p-4

              text-center
            ">

              <p className="
                text-xs

                uppercase

                tracking-[0.12em]

                font-black

                text-gray-400
              ">
                ITBIS
              </p>

              <p className="
                mt-2

                text-xl

                font-black

                text-orange-500
              ">
                RD$
                {" "}
                {formatMoney(itbis)}
              </p>

            </div>

            {/* DESCUENTO */}

            <div className="
              bg-white

              border
              border-slate-100

              rounded-[24px]

              p-4

              text-center
            ">

              <p className="
                text-xs

                uppercase

                tracking-[0.12em]

                font-black

                text-gray-400
              ">
                Descuento
              </p>

              <p className="
                mt-2

                text-xl

                font-black

                text-rose-500
              ">
                - RD$
                {" "}
                {formatMoney(descuentoValor)}
              </p>

            </div>

          </div>

          {/* TOTAL FINAL */}

          <div className="
  bg-gradient-to-r
  from-emerald-500
  to-green-500

  rounded-[30px]

  p-6

  text-white

  shadow-[0_20px_45px_rgba(16,185,129,0.28)]

  text-center
">

            <div className="
    flex
    items-center
    justify-center
    gap-2
  ">

              <Receipt
                size={16}
                className="text-white/80"
              />

              <p className="
      text-xs

      uppercase

      tracking-[0.14em]

      font-black

      text-white/70
    ">
                Total factura
              </p>

            </div>

            <p className="
    mt-3

    text-4xl

    font-black
  ">

              RD$
              {" "}
              {formatMoney(total)}

            </p>

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
            type="submit"
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

            <Save size={18} />

            {loading
              ? "Guardando..."
              : "Guardar factura"}

          </button>

        </div>

      </form>

    </div>

  );

}

export default IngresoForm;