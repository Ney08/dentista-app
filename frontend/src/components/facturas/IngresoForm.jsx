import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useServicios } from "../../hooks/useServicios";
import { useIngresos } from "../../hooks/useIngresos";
import { useCitas } from "../../hooks/useCitas";
import { formatFecha, formatHora } from "../../utils/fecha";

function IngresoForm({ clientes, initialData, onClose }) {
  const { servicios: catalogoServicios } = useServicios();
  const { crearIngreso, actualizarIngreso } = useIngresos();
  const { citas } = useCitas(); // ✅ obtener citas

  const normalize = (text) =>
    (text || "").toLowerCase().trim();


  const autoSeleccionarServicio = (clienteId) => {

    console.log("👉 TODAS LAS CITAS:", citas);
    console.log("👉 CLIENTE SELECCIONADO:", clienteId);

    const ahora = new Date();

    const citasCliente = citas
      .filter(c =>
        Number(c.cliente_id) === Number(clienteId) &&
        c.estado === "pendiente"
      )
      .map(c => ({
        ...c,
        fechaObj: new Date(c.fecha.replace("T", " "))

      }));

    if (citasCliente.length === 0) {
      setCitaSeleccionada(null);
      setServicios([{
        descripcion: "",
        monto: ""
      }]);
      toast("No hay citas relacionadas ⚠️");
      return;
    }

    // ✅ 1. CITA DE HOY
    const hoy = new Date();

    const citaHoy = citasCliente.find(c =>
      c.fechaObj.toDateString() === hoy.toDateString()
    );

    let citaElegida = citaHoy;

    // ✅ 2. SI NO HAY HOY → MÁS CERCANA (FUTURA O PASADA)
    if (!citaElegida) {
      citaElegida = citasCliente
        .sort((a, b) =>
          Math.abs(a.fechaObj - ahora) - Math.abs(b.fechaObj - ahora)
        )[0];
    }

    if (!citaElegida) {
      setCitaSeleccionada(null);

      setServicios([{
        descripcion: "",
        monto: ""
      }]);
      toast("No hay citas relacionadas ⚠️");
      return;
    }

    setCitaSeleccionada(citaElegida);

    // ✅ AUTO SERVICIO
    if (!citaElegida.motivo) return;

    const servicioEncontrado = catalogoServicios.find(s => {
      const nombre = normalize(s?.nombre || s?.descripcion);
      const motivo = normalize(citaElegida?.motivo);

      const palabras = motivo.split(" ");

      return palabras.some(p => nombre.includes(p));
    });

    if (!servicioEncontrado) {
      toast("No hay servicio relacionado ⚠️");

      setServicios([{
        descripcion: "",
        monto: ""
      }]);

      return;
    }

    setServicios(prev => {
      const copia = [...prev];

      copia[0] = {
        descripcion: servicioEncontrado.nombre || servicioEncontrado.descripcion || "",
        monto: servicioEncontrado.precio || ""
      };

      return copia;
    });
    console.log("✅ CITAS DEL CLIENTE:", citasCliente);
    console.log("✅ CITA ELEGIDA:", citaElegida);
    toast.success("Servicio sugerido automáticamente ✨ cita fecha: " + formatFecha(citaElegida.fechaObj));
  };





  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();


  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(false);

  const [servicios, setServicios] = useState([
    { descripcion: "", monto: "" }
  ]);

  const [descuento, setDescuento] = useState(0);

  // ✅ EDITAR

  useEffect(() => {
    if (initialData) {
      setServicios(initialData.servicios || []);
      setDescuento(initialData.descuento || 0);

      reset({
        clienteId: initialData.cliente_id
          ? String(initialData.cliente_id)
          : ""
      });

    } else {
      reset({
        clienteId: ""
      });
    }
  }, [initialData, reset]);



  // ✅ AGREGAR SERVICIO
  const agregarServicio = () => {
    setServicios([...servicios, { descripcion: "", monto: "" }]);
  };

  const eliminarServicio = (index) => {
    setServicios(servicios.filter((_, i) => i !== index));
  };

  const actualizarServicio = (index, campo, valor) => {
    const nuevos = [...servicios];
    nuevos[index][campo] = valor;
    setServicios(nuevos);
  };

  // ✅ TOTAL
  const subtotal = servicios.reduce((acc, s) => acc + Number(s.monto || 0), 0);
  const itbis = subtotal * 0.18;
  const descuentoValor = subtotal * ((descuento || 0) / 100);
  const total = subtotal + itbis - descuentoValor;

  // ✅ SUBMIT
  const onSubmit = async (data) => {

    for (let s of servicios) {
      if (!s.descripcion || !s.monto) {
        toast.error("Completa todos los servicios ⚠️");
        return;
      }
    }

    const payload = {
      cliente_id: parseInt(data.clienteId),
      descuento: parseFloat(descuento) || 0,
      cita_id: citaSeleccionada?.id || null,
      servicios: servicios.map(s => ({
        descripcion: s.descripcion,
        monto: parseFloat(s.monto)
      }))
    };

    setLoading(true);
    const toastId = toast.loading("Guardando factura...");

    try {

      if (initialData) {
        await actualizarIngreso.mutateAsync({
          id: initialData.id,
          data: payload
        });
        toast.success("Factura actualizada ✅", { id: toastId });
      } else {
        await crearIngreso.mutateAsync(payload);
        toast.success("Factura creada ✅", { id: toastId });
      }

      reset();
      setServicios([{ descripcion: "", monto: "" }]);
      setDescuento(0);
      onClose();
    } catch {
      toast.error("Error ❌", { id: toastId });
    }

    setLoading(false);
  };

  return (
    <div className="
    w-full max-w-3xl
    bg-white rounded-2xl
    shadow-lg border border-gray-200
    p-6 space-y-6
  ">

      {/* ✅ HEADER */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-semibold">
          {initialData ? "Editar factura ✏️" : "Registrar factura 🧾"}
        </h2>

        <p className="text-sm text-gray-500">
          {initialData
            ? "Modifica los detalles"
            : "Completa los datos de la factura"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* ✅ CLIENTE */}
        <select
          {...register("clienteId")}
          disabled={!!initialData}
          onChange={(e) => {
            const id = e.target.value;
            autoSeleccionarServicio(id);
          }}
          className={`
          input
          ${initialData ? "bg-gray-100 text-gray-500" : ""}
        `}
        >
          <option value="">Seleccionar cliente</option>
          {clientes.map(c => (
            <option key={c.id} value={c.id}>
              {c.nombre} {c.apellido}
            </option>
          ))}
        </select>

        {/* ✅ SERVICIOS */}
        <div className="space-y-3">

          <div className="flex justify-between items-center">
            <h4 className="text-xs uppercase font-semibold text-gray-500">
              Servicios
            </h4>

            <button
              type="button"
              onClick={agregarServicio}
              className="
              text-sm text-blue-600 hover:text-blue-700
              font-medium
            "
            >
              + Agregar
            </button>
          </div>

          <div className="
          space-y-3 max-h-64 overflow-y-auto pr-1
        ">

            {servicios.map((s, index) => (

              <div
                key={index}
                className="
                border border-gray-200 rounded-xl p-3
                bg-gray-50 space-y-2
              "
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
                  className="input"
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
                        {serv.nombre} (RD$ {serv.precio})
                      </option>
                    );
                  })}
                </select>

                <input
                  type="number"
                  value={s.monto}
                  disabled
                  className="input bg-gray-100"
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
            className="input"
          />
        </div>

        {/* ✅ TOTAL */}
        <div className={`
        border rounded-xl p-4 text-center
        ${total > 0
            ? "bg-green-50 border-green-200"
            : "bg-gray-50 border-gray-200"}
      `}>

          <p className="text-xs text-gray-500">
            Total factura
          </p>

          <p className="text-2xl font-semibold text-green-700">
            RD$ {total.toFixed(2)}
          </p>

        </div>

        {/* ✅ BOTONES */}
        <div className="space-y-2">

          <button
            type="submit"
            disabled={loading}
            className={`
            w-full py-2.5 rounded-xl text-white font-medium
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
            w-full py-2.5 rounded-xl
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