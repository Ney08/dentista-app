import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useServicios } from "../hooks/useServicios";
import { useIngresos } from "../hooks/useIngresos";
import { useCitas } from "../hooks/useCitas";

function IngresoForm({ clientes, initialData, onClose }) {
  const { servicios: catalogoServicios } = useServicios();
  const { crearIngreso, actualizarIngreso } = useIngresos();
  const { citas } = useCitas(); // ✅ obtener citas
  const normalize = (text) =>
    text.toLowerCase().trim();

  const autoSeleccionarServicio = (clienteId) => {

    const cita = citas.find(
      c => c.cliente_id == clienteId && c.estado === "pendiente"
    );

    if (!cita) {
      setCitaSeleccionada(null);
      return;
    }

    setCitaSeleccionada(cita);

    if (!cita.motivo) return;

    const servicioEncontrado = servicios.find(
      s => normalize(s.nombre).includes(normalize(cita.motivo))
    );

    if (!servicioEncontrado) {
      toast("No hay servicio relacionado ⚠️");
      return;
    }

    setServicios([{
      descripcion: servicioEncontrado.nombre,
      monto: servicioEncontrado.precio
    }]);

    toast.success("Servicio sugerido automáticamente ✨");
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

    <div className="w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-8">

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">


        <h3 className="text-xl font-bold text-gray-800 text-center">
          {initialData ? "Editar Factura ✏️" : "Registrar Factura 🧾"}
           <p className="text-sm text-gray-500 text-center">
          {initialData
            ? "Modifica los detalles de la factura"
            : "Completa los detalles para registrar una nueva factura"}
        </p>
        </h3>
       
        {/* CLIENTE */}




        <select
          {...register("clienteId")}
          disabled={!!initialData}
          onChange={(e) => {
            const id = e.target.value;
            autoSeleccionarServicio(id);
          }}
          className={`
    w-full border px-3 py-2 rounded input
    ${initialData ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}
  `}
        >




          <option value="">Seleccionar cliente</option>
          {clientes.map(c => (
            <option key={c.id} value={c.id}>
              {c.nombre} {c.apellido}
            </option>
          ))}
        </select>

        {/* SERVICIOS */}
        <div className="bg-gray-50 border rounded-xl p-4 ">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-semibold">Servicios</p>

            <button
              type="button"
              onClick={agregarServicio}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm shadow"
            >
              + Agregar
            </button>
          </div>

          {/* ✅ SCROLL CONTENEDOR */}
          <div className="space-y-4 max-h-64 overflow-y-auto pr-2">

            {servicios.map((s, index) => (

              <div key={index} className="bg-white p-3 rounded shadow-sm">

                {servicios.length > 1 && (
                  <button
                    type="button"
                    onClick={() => eliminarServicio(index)}
                    className="text-red-500 text-xs float-right"
                  >
                    ❌
                  </button>
                )}

                {/* ✅ SELECT SERVICIO */}
                <select
                  value={s.descripcion}
                  onChange={(e) => {
                    const seleccionado = catalogoServicios.find(
                      serv => serv.nombre === e.target.value
                    );

                    actualizarServicio(index, "descripcion", seleccionado.nombre);
                    actualizarServicio(index, "monto", seleccionado.precio);
                  }}
                  className="w-full border px-3 py-2 rounded mb-2 input"
                >
                  <option value="">Seleccionar servicio</option>

                  {catalogoServicios.map((serv, i) => {

                    // ✅ BLOQUEAR DUPLICADOS
                    const yaSeleccionado = catalogoServicios.some(
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

                {/* MONTO */}
                <input
                  type="number"
                  value={s.monto}
                  disabled
                  className="w-full border px-3 py-2 rounded bg-gray-100 input"
                />

              </div>

            ))}

          </div>
        </div>

        {/* DESCUENTO */}
        <label className="text-sm font-semibold text-gray-600">
          Descuento (%)
        </label>
        <input

          type="number"
          placeholder="Descuento (%)"
          value={descuento}
          onChange={(e) => setDescuento(e.target.value)}
          className="w-full border px-3 py-2 rounded input"
        />

        {/* TOTAL */}
        <div className="bg-green-50 border border-green-200 p-4 rounded-xl text-center">
          <p className="text-sm text-green-700">Total factura</p>
          <p className="text-2xl font-bold text-green-800">
            RD$ {total.toFixed(2)}
          </p>
        </div>

        {/* BOTÓN */}
        <button
          type="submit"
          disabled={loading}
          className="
  w-full bg-gradient-to-r from-blue-500 to-blue-600
  hover:from-blue-600 hover:to-blue-700
  text-white py-3 rounded-xl font-medium
  shadow-md transition"
        >
          {loading ? "Guardando..." : "✅ Guardar factura"}
        </button>
        <button
          type="button"
          onClick={onClose}

          className="
  w-full bg-gradient-to-r from-red-500 to-red-600
  hover:from-red-600 hover:to-red-700
  text-white py-3 rounded-xl font-medium
  shadow-md transition
"

        >
          Cancelar
        </button>
      </form>
    </div >
  );
}

export default IngresoForm;