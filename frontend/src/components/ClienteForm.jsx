import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useClientes } from "../hooks/useClientes";

import provincias from "../data/provincias.json";
import municipios from "../data/municipios.json";
import { API_URL } from "../config";

function ClienteForm() {
  const { crearCliente } = useClientes();

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

        if (Array.isArray(data) && data.length > 0) {
          setCedulaError("Cédula ya registrada");
        } else {
          setCedulaError("");
        }
      } catch {}
    }, 500);

    return () => clearTimeout(timeout);
  }, [cedulaInput]);

  const onSubmit = async (data) => {

    if (cedulaError) return toast.error("Cédula duplicada ❌");
    if (!provincia || !municipio) return toast.error("Ubicación requerida ⚠️");

    try {
      setLoading(true);

      await crearCliente.mutateAsync({
        ...data,
        direccion: {
          provincia_nombre:
            provincias.find(p => p.id == provincia)?.nombre || "",
          municipio_nombre:
            municipios.find(m => m.id == municipio)?.nombre || "",
          calle: data.calle || ""
        }
      });

      toast.success("Cliente creado ✅");
      reset();
      setProvincia(null);
      setMunicipio("");

    } catch {
      toast.error("Error ❌");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-md border space-y-8">

      {/* HEADER */}
      <div className="text-center">
        <h2 className="text-xl font-bold">
          Nuevo cliente 👤
        </h2>
        <p className="text-gray-500 text-sm">
          Completa la información básica
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        {/* 🧾 INFO PERSONAL */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-600">
            Información básica
          </h3>

          <div className="grid md:grid-cols-2 gap-4">

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

        {/* 🆔 IDENTIDAD */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-600">
            Identidad
          </h3>

          <div className="grid md:grid-cols-2 gap-4">

            <div>
              <input
                {...register("cedula")}
                placeholder="Cédula"
                className={`input ${cedulaError ? "border-red-500" : ""}`}
              />
              {cedulaError && <p className="error">{cedulaError}</p>}
            </div>

            <input
              {...register("telefono")}
              placeholder="Teléfono"
              className="input"
            />

          </div>
        </div>

        {/* 📍 UBICACIÓN */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-600">
            Ubicación
          </h3>

          <div className="grid md:grid-cols-2 gap-4">

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
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>

            <select
              value={municipio}
              onChange={(e) => setMunicipio(e.target.value)}
              disabled={!provincia}
              className="input"
            >
              <option value="">Municipio</option>
              {municipiosFiltrados.map(m => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
            </select>

          </div>

          <input
            {...register("calle")}
            placeholder="Dirección / Calle"
            className="input"
          />
        </div>

        {/* BOTÓN */}
        <button
          type="submit"
          disabled={loading || cedulaError}
          className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          {loading ? "Guardando..." : "Guardar cliente"}
        </button>

      </form>
    </div>
  );
}

export default ClienteForm;