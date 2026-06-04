import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useClientes } from "../../hooks/useClientes";

import provincias from "../../data/provincias.json";
import municipios from "../../data/municipios.json";
import { API_URL } from "../../config";

function ClienteForm({ cliente, onClose }) {


  const { crearCliente, editarCliente } = useClientes();
  const isEdit = !!cliente;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [cedulaError, setCedulaError] = useState("");
  const [provincia, setProvincia] = useState(null);
  const [municipio, setMunicipio] = useState("");

  const cedulaInput = watch("cedula");

  const municipiosFiltrados = municipios.filter(
    (m) => Number(m.provinciaId) === Number(provincia)
  );

  // ✅ CARGAR DATOS SI ES EDIT
  useEffect(() => {
    if (cliente) {

      reset({
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        cedula: cliente.cedula,
        telefono: cliente.telefono,
        calle: cliente.direccion?.calle || ""
      });

      const normalizar = (txt) =>
        txt?.toLowerCase().trim();

      const provinciaEncontrada = provincias.find(
        p => normalizar(p.nombre) === normalizar(cliente.direccion?.provincia_nombre)
      );

      const municipioEncontrado = municipios.find(
        m =>
          normalizar(m.nombre) === normalizar(cliente.direccion?.municipio_nombre) &&
          Number(m.provinciaId) === Number(provinciaEncontrada?.id)
      );

      setProvincia(provinciaEncontrada?.id || null);
      setMunicipio(municipioEncontrado?.nombre || "");

    } else {

      // ✅🔥 ESTE ERA EL QUE TE FALTABA

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



  // ✅ VALIDACIÓN CÉDULA
  useEffect(() => {
    if (!cedulaInput || cedulaInput.length < 6) {
      setCedulaError("");
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `${API_URL}/clientes/?cedula=${cedulaInput}`
        );
        const data = await res.json();

        // ✅ SI ES EDIT, permitir misma cédula del mismo cliente
        if (
          Array.isArray(data) &&
          data.length > 0 &&
          (!isEdit || data[0].id !== cliente?.id)
        ) {
          setCedulaError("Cédula ya registrada");
        } else {
          setCedulaError("");
        }
      } catch { }
    }, 500);

    return () => clearTimeout(timeout);
  }, [cedulaInput, isEdit, cliente]);

  const onSubmit = async (data) => {

    if (cedulaError) return toast.error("Cédula duplicada ❌");
    if (!provincia || !municipio) return toast.error("Ubicación requerida ⚠️");

    try {
      setLoading(true);

      console.log("🔵 DATA FORM:", data);
      console.log("🟢 PROVINCIA (state):", provincia);
      console.log("🟡 MUNICIPIO (state):", municipio);

      const payload = {
        ...data,
        direccion: {
          provincia_nombre:
            provincias.find(p => Number(p.id) === Number(provincia))?.nombre ?? null,

          municipio_nombre: municipio,
          calle: data.calle || ""
        }
      };
      console.log("🚀 PAYLOAD FINAL:", payload);
      if (isEdit) {

        await editarCliente.mutateAsync({
          id: cliente.id,
          data: payload
        });

        toast.success("Cliente actualizado ✅");

      } else {

        await crearCliente.mutateAsync(payload);
        toast.success("Cliente creado ✅");
      }

      console.log("Provincia seleccionada:", provincia);
      console.log("Municipio seleccionado:", municipio);

      reset();
      setProvincia(null);
      setMunicipio("");

      onClose(); // ✅ cerrar modal

    } catch {
      toast.error("Error ❌");
    }

    setLoading(false);
  };

  return (
    <div className="w-full bg-white p-6 rounded-2xl shadow-lg border border-gray-200 space-y-6">

      {/* ✅ HEADER */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight flex items-center justify-center gap-2">
          {isEdit ? "Editar cliente ✏️" : "Nuevo cliente 👤"}
        </h2>

        <p className="text-gray-500 text-sm">
          Completa la información básica
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* ✅ INFO PERSONAL */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Información básica
          </h3>

          <div className="grid md:grid-cols-2 gap-3">
            <input
              {...register("nombre", { required: true })}
              placeholder="Nombre"
              className="input"
            />

            <input
              {...register("apellido", { required: true })}
              placeholder="Apellido"
              className="input"
            />
          </div>
        </div>

        {/* ✅ IDENTIDAD */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Identidad
          </h3>

          <div className="grid md:grid-cols-2 gap-3">

            {/* CÉDULA */}
            <div className="space-y-1">
              <input
                {...register("cedula")}
                placeholder="Cédula"
                className={`
                input 
                ${cedulaError ? "border-red-500 ring-1 ring-red-300" : ""}
              `}
              />

              {cedulaError && (
                <p className="text-xs text-red-500">
                  {cedulaError}
                </p>
              )}
            </div>

            {/* TELÉFONO */}
            <input
              {...register("telefono")}
              placeholder="Teléfono"
              className="input"
            />

          </div>
        </div>

        {/* ✅ UBICACIÓN */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Ubicación
          </h3>

          <div className="grid md:grid-cols-2 gap-3">

            <select
              value={provincia ?? ""}
              onChange={(e) => {
                setProvincia(Number(e.target.value));
                setMunicipio("");
              }}
              className="input"
            >
              <option value="">Provincia</option>
              {provincias.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>

            <select
              value={municipio ?? ""}
              onChange={(e) => setMunicipio(e.target.value)}
              className="input"
            >
              <option value="">Municipio</option>
              {municipiosFiltrados.map(m => (
                <option key={m.nombre} value={m.nombre}>
                  {m.nombre}
                </option>
              ))}
            </select>

          </div>

          <input
            {...register("calle")}
            placeholder="Dirección / Calle"
            className="input"
          />
        </div>

        {/* ✅ BOTONES */}
        <div className="space-y-2 pt-2">

          {/* PRIMARY */}
          <button
            type="submit"
            disabled={loading || cedulaError}
            className={`
            w-full py-2.5 rounded-xl font-medium
            text-white shadow-sm transition

            ${loading || cedulaError
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"}
          `}
          >
            {loading
              ? "Guardando..."
              : isEdit
                ? "Actualizar cliente"
                : "Crear cliente"}
          </button>

          {/* SECONDARY */}
          <button
            type="button"
            onClick={onClose}
            className="
            w-full py-2.5 rounded-xl font-medium
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

export default ClienteForm;
