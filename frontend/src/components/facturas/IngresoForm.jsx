import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useServicios } from "../../hooks/useServicios";
import { useIngresos } from "../../hooks/useIngresos";
import { useCitas } from "../../hooks/useCitas";
import { formatFecha, formatHora } from "../../utils/fecha";
import { formatMoney } from "../../utils/format";

function IngresoForm({ clientes, initialData, citaPreset, onClose }) {
  const { servicios: catalogoServicios } = useServicios();

  const { crearIngreso, actualizarIngreso } =
    useIngresos();

  const { citas } = useCitas();

  // ✅ FORM
  const {
    handleSubmit,
    reset
  } = useForm();

  // ✅ STATES
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
        monto: ""
      }
    ]);

  const [descuento, setDescuento] =
    useState(0);

  // ✅ NORMALIZE
  const normalize = (text) => {

    return (text || "")
      .toLowerCase()
      .trim();

  };

  // ✅ SINCRONIZAR CLIENTE
  useEffect(() => {

    if (!citaPreset) {
      return;
    }

    setClienteId(
      String(citaPreset.cliente_id)
    );

  }, [citaPreset]);

  // ✅ AUTO SERVICIO
  const autoSeleccionarServicio = (
    clienteId
  ) => {

    // ✅ usar cita preset directamente
    if (citaPreset) {

      setCitaSeleccionada(citaPreset);

      return;
    }

    console.log(
      "👉 TODAS LAS CITAS:",
      citas
    );

    console.log(
      "👉 CLIENTE SELECCIONADO:",
      clienteId
    );

    const ahora = new Date();

    const citasCliente = citas
      .filter(
        c =>
          Number(c.cliente_id) ===
          Number(clienteId) &&
          c.estado === "pendiente"
      )
      .map(c => ({
        ...c,
        fechaObj: new Date(
          c.fecha.replace("T", " ")
        )
      }));

    if (citasCliente.length === 0) {

      setCitaSeleccionada(null);

      setServicios([
        {
          descripcion: "",
          monto: ""
        }
      ]);

      toast(
        "No hay citas relacionadas ⚠️"
      );

      return;
    }

    // ✅ cita de hoy
    const hoy = new Date();

    const citaHoy = citasCliente.find(
      c =>
        c.fechaObj.toDateString() ===
        hoy.toDateString()
    );

    let citaElegida = citaHoy;

    // ✅ más cercana
    if (!citaElegida) {

      citaElegida = citasCliente.sort(
        (a, b) =>
          Math.abs(a.fechaObj - ahora) -
          Math.abs(b.fechaObj - ahora)
      )[0];

    }

    if (!citaElegida) {

      setCitaSeleccionada(null);

      setServicios([
        {
          descripcion: "",
          monto: ""
        }
      ]);

      toast(
        "No hay citas relacionadas ⚠️"
      );

      return;
    }

    setCitaSeleccionada(citaElegida);

    // ✅ auto servicio
    if (!citaElegida.motivo) {
      return;
    }

    const servicioEncontrado =
      catalogoServicios.find(s => {

        const nombre = normalize(
          s?.nombre || s?.descripcion
        );

        const motivo = normalize(
          citaElegida?.motivo
        );

        return motivo
          .split(" ")
          .some(
            p => nombre.includes(p)
          );

      });

    if (!servicioEncontrado) {

      toast(
        "No hay servicio relacionado ⚠️"
      );

      setServicios([
        {
          descripcion: "",
          monto: ""
        }
      ]);

      return;
    }

    setServicios(prev => {

      const copia = [...prev];

      copia[0] = {
        descripcion:
          servicioEncontrado.nombre ||
          servicioEncontrado.descripcion ||
          "",

        monto:
          servicioEncontrado.precio || ""
      };

      return copia;

    });

    toast.success(
      `Servicio sugerido ✨ ${formatFecha(citaElegida.fechaObj)}`
    );

  };

  // ✅ PRESET CITA
  useEffect(() => {

    if (
      !citaPreset ||
      initialData
    ) {
      return;
    }

    setCitaSeleccionada(citaPreset);

    // ✅ servicio automático
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
              encontrado.precio
          }
        ]);

      }

    }

  }, [
    citaPreset,
    initialData,
    catalogoServicios
  ]);

  // ✅ EDITAR
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

  // ✅ AGREGAR SERVICIO
  const agregarServicio = () => {

    setServicios([
      ...servicios,
      {
        descripcion: "",
        monto: ""
      }
    ]);

  };

  // ✅ ELIMINAR SERVICIO
  const eliminarServicio = (index) => {

    setServicios(
      servicios.filter(
        (_, i) => i !== index
      )
    );

  };

  // ✅ ACTUALIZAR SERVICIO
  const actualizarServicio = (
    index,
    campo,
    valor
  ) => {

    const nuevos = [...servicios];

    nuevos[index][campo] = valor;

    setServicios(nuevos);

  };

  // ✅ TOTAL
  const subtotal = servicios.reduce(
    (acc, s) =>
      acc + Number(s.monto || 0),
    0
  );

  const itbis = subtotal * 0.18;

  const descuentoValor =
    subtotal *
    ((descuento || 0) / 100);

  const total =
    subtotal +
    itbis -
    descuentoValor;

  // ✅ SUBMIT
  const onSubmit = async () => {

    for (let s of servicios) {

      if (
        !s.descripcion ||
        !s.monto
      ) {

        toast.error(
          "Completa todos los servicios ⚠️"
        );

        return;
      }

    }

    const payload = {

      cliente_id:
        parseInt(clienteId),

      descuento:
        parseFloat(descuento) || 0,

      cita_id:
        citaSeleccionada?.id || null,

      servicios: servicios.map(s => ({
        descripcion:
          s.descripcion,

        monto:
          parseFloat(s.monto)
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

        toast.success(
          "Factura actualizada ✅",
          { id: toastId }
        );

      } else {

        await crearIngreso.mutateAsync(
          payload
        );

        toast.success(
          "Factura creada ✅",
          { id: toastId }
        );

      }

      reset();

      setServicios([
        {
          descripcion: "",
          monto: ""
        }
      ]);

      setDescuento(0);

      onClose();

    } catch {

      toast.error(
        "Error ❌",
        { id: toastId }
      );

    }

    setLoading(false);

  };

  return (
    <div className="w-full h-full md:h-auto bg-white rounded-t-3xl md:rounded-2xl shadow-lg border-0 md:border border-gray-200 p-4 sm:p-5 md:p-6 flex flex-col gap-4 max-h-screen md:max-h-[90vh] overflow-y-auto overflow-x-hidden">

      {/* ✅ HEADER */}
      <div className="text-center space-y-1 shrink-0">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
          {initialData ? "Editar factura ✏️" : "Registrar factura 🧾"}
        </h2>

        <p className="text-sm text-gray-500">
          {initialData
            ? "Modifica los detalles"
            : "Completa los datos de la factura"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 flex-1 min-h-0">

        {/* ✅ CLIENTE */}
        <select
          value={clienteId}

          disabled={!!initialData}

          onChange={(e) => {

            const id = e.target.value;

            setClienteId(id);

            autoSeleccionarServicio(id);
          }}

          className={`input h-12 sm:h-11 text-base sm:text-sm ${initialData ? "bg-gray-100 text-gray-500" : ""}`}
        >
          <option value="">Seleccionar cliente</option>
          {clientes.map(c => (
            <option
              key={c.id}
              value={String(c.id)}
            >
              {c.nombre} {c.apellido}
            </option>
          ))}
        </select>

        {/* ✅ SERVICIOS */}
        <div className="space-y-3">

          <div className="flex items-center justify-between gap-2">
            <h4 className="text-xs uppercase font-semibold text-gray-500">
              Servicios
            </h4>

            <button
              type="button"
              onClick={agregarServicio}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium active:scale-[0.98] transition"
            >
              + Agregar
            </button>
          </div>

          <div className="space-y-2 overflow-y-auto overflow-x-hidden pr-1 max-h-[32vh] sm:max-h-[38vh] md:max-h-[40vh]">

            {servicios.map((s, index) => (

              <div
                key={index}
                className="border border-gray-200 rounded-2xl p-3 bg-gray-50 space-y-2"
              >

                {servicios.length > 1 && (
                  <button
                    type="button"
                    onClick={() => eliminarServicio(index)}
                    className="text-red-500 text-xs float-right"
                  >
                    ❌
                  </button>
                )}

                <select
                  value={s.descripcion}
                  onChange={(e) => {
                    const seleccionado = catalogoServicios.find(
                      serv => serv.nombre === e.target.value
                    );

                    actualizarServicio(index, "descripcion", seleccionado.nombre);
                    actualizarServicio(index, "monto", seleccionado.precio);
                  }}
                  className="input h-12 sm:h-11 text-base sm:text-sm"
                >
                  <option value="">Seleccionar servicio</option>

                  {catalogoServicios.map((serv, i) => {

                    const yaSeleccionado = servicios.some(
                      (s2, i2) =>
                        s2.descripcion === serv.nombre && i2 !== index
                    );

                    return (
                      <option
                        key={i}
                        value={serv.nombre}
                        disabled={yaSeleccionado}
                      >
                        {serv.nombre} (RD$ {formatMoney(serv.precio)})
                      </option>
                    );
                  })}
                </select>

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
                  className="input h-12 sm:h-11 text-base sm:text-sm"
                />

              </div>

            ))}

          </div>

        </div>

        {/* ✅ DESCUENTO */}
        <div className="space-y-1">
          <label className="text-xs text-gray-500 font-medium">
            Descuento (%)
          </label>

          <input
            type="number"
            value={descuento}
            onChange={(e) => setDescuento(e.target.value)}
            className="input h-12 sm:h-11 text-base sm:text-sm"
          />
        </div>

        {/* ✅ TOTAL */}
        <div className={`
        border rounded-2xl p-4 text-center shrink-0
        ${total > 0
            ? "bg-green-50 border-green-200"
            : "bg-gray-50 border-gray-200"}
      `}>

          <p className="text-xs text-gray-500">
            Total factura
          </p>

          <p className="text-2xl sm:text-3xl md:text-2xl font-bold text-green-700">
            RD$ {formatMoney(total)}
          </p>

        </div>

        {/* ✅ BOTONES */}
        <div className="flex flex-col sm:flex-row gap-2 pt-1 shrink-0">

          <button
            type="submit"
            disabled={loading}
            className={`
           flex-1 h-12 rounded-2xl text-white font-medium text-sm sm:text-base
            ${loading
                ? "bg-gray-400"
                : "bg-blue-500 hover:bg-blue-600"}
            transition
          `}
          >
            {loading ? "Guardando..." : "Guardar factura"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="
            flex-1 h-12 rounded-2xl
            bg-gray-100 hover:bg-gray-200
            text-gray-700 transition
          "
          >
            Cancelar
          </button>

        </div>

      </form>

    </div>
  );
}

export default IngresoForm;