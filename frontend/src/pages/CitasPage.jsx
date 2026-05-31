import { useState } from "react";
import toast from "react-hot-toast";

import PageWrapper from "../components/PageWrapper";
import CitaForm from "../components/CitaForm";
import { useClientes } from "../hooks/useClientes";
import { useCitas } from "../hooks/useCitas";

function CitasPage() {

  const { clientes } = useClientes();

  const {
    citas,
    completarCita,
    isLoading
  } = useCitas();

  const [vista, setVista] = useState("lista");
  const [limite, setLimite] = useState(10);
  const [pagina, setPagina] = useState(1);
  const [filtro, setFiltro] = useState("todas");

  const hoy = new Date();

  // ✅ FILTRO (HOY / TODAS)
  const citasFiltradas = citas.filter(c => {
    const f = new Date(c.fecha);

    if (filtro === "hoy") {
      return (
        f.getDate() === hoy.getDate() &&
        f.getMonth() === hoy.getMonth() &&
        f.getFullYear() === hoy.getFullYear()
      );
    }

    return true;
  });

  // ✅ ALERTA HOY
  const citasHoy = citasFiltradas.filter(
    c =>
      new Date(c.fecha).toDateString() === hoy.toDateString() &&
      c.estado !== "completada"
  );

  // ✅ ORDENAR
  const ordenadas = [...citasFiltradas].sort(
    (a, b) => new Date(a.fecha) - new Date(b.fecha)
  );

  // ✅ PAGINACIÓN
  const inicio = (pagina - 1) * (limite === "all" ? ordenadas.length : limite);
  const fin = limite === "all" ? undefined : inicio + limite;

  const citasFinal =
    limite === "all"
      ? ordenadas
      : ordenadas.slice(inicio, fin);

  const totalPaginas =
    limite === "all"
      ? 1
      : Math.ceil(ordenadas.length / limite);

  // ✅ LOADING
  if (isLoading) {
    return (
      <PageWrapper>
        <p className="text-center text-gray-500">Cargando citas...</p>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>

      <div className="max-w-4xl mx-auto space-y-6">

        {/* ✅ HEADER */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Citas 📅
          </h1>
          <p className="text-gray-500 text-sm">
            Gestiona las citas del sistema
          </p>
        </div>

        {/* ✅ ALERTA */}
        {citasHoy.length > 0 && (
          <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg text-center">
            Tienes {citasHoy.length} cita(s) hoy ⚡
          </div>
        )}

        {/* ✅ TABS */}
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setVista("lista")}
            className={`px-5 py-2 rounded-full ${
              vista === "lista"
                ? "bg-blue-500 text-white shadow"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            📋 Lista
          </button>

          <button
            onClick={() => setVista("crear")}
            className={`px-5 py-2 rounded-full ${
              vista === "crear"
                ? "bg-green-500 text-white shadow"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            ➕ Crear
          </button>
        </div>

        {/* ✅ CREAR */}
        {vista === "crear" && (
          <div className="bg-white p-6 rounded-2xl shadow-md border">
            <CitaForm
              clientes={clientes}
              onCrear={() => {
                toast.success("Cita creada ✅");
                setVista("lista");
              }}
            />
          </div>
        )}

        {/* ✅ LISTA */}
        {vista === "lista" && (

          <div className="bg-white p-6 rounded-2xl shadow-md border space-y-5">

            {/* ✅ CONTROLES PRO */}
            <div className="flex flex-wrap justify-between items-center gap-4 border-b pb-3">

              <p className="text-sm text-gray-500">
                Total: {ordenadas.length} citas
              </p>

              <div className="flex items-center gap-3">

                {/* FILTRO */}
                <select
                  value={filtro}
                  onChange={(e) => {
                    setFiltro(e.target.value);
                    setPagina(1);
                  }}
                  className="border px-2 py-1 rounded text-sm"
                >
                  <option value="todas">Todas</option>
                  <option value="hoy">Solo hoy</option>
                </select>

                {/* LIMITE */}
                <select
                  value={limite}
                  onChange={(e) => {
                    const val =
                      e.target.value === "all"
                        ? "all"
                        : parseInt(e.target.value);

                    setLimite(val);
                    setPagina(1);
                  }}
                  className="border px-2 py-1 rounded text-sm"
                >
                  <option value={10}>10</option>
                  <option value={50}>50</option>
                  <option value="all">Todos</option>
                </select>

              </div>

            </div>

            {/* ✅ LISTA */}
            {citasFinal.length === 0 ? (
              <p className="text-center text-gray-500">
                No hay citas...
              </p>
            ) : (
              <div className="space-y-5">

                {citasFinal.map(c => {

                  const fecha = new Date(c.fecha);

                  const esHoy =
                    fecha.toDateString() === hoy.toDateString() &&
                    c.estado !== "completada";

                  return (
                    <div
                      key={c.id}
                      className={`
                        flex items-center justify-between
                        bg-white border border-gray-200 border-l-4 rounded-xl p-4
                        shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition
                        ${esHoy ? "border-yellow-400" : "border-blue-400"}
                      `}
                    >

                      {/* INFO */}
                      <div>
                        <p className="font-semibold text-gray-800">
                          {c.cliente?.nombre} {c.cliente?.apellido}
                        </p>

                        <p className="text-sm text-gray-500">
                          {fecha.toLocaleDateString()} — {fecha.toLocaleTimeString()}
                        </p>

                        {c.motivo && (
                          <p className="text-sm text-gray-400">
                            Motivo: {c.motivo}
                          </p>
                        )}
                      </div>

                      {/* DERECHA */}
                      <div className="flex items-center gap-2">

                        <span className={`px-3 py-1 text-sm rounded-lg ${
                          c.estado === "completada"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {c.estado === "completada" ? "Completada ✅" : "Pendiente"}
                        </span>

                        {c.estado !== "completada" && (
                          <button
                            onClick={async () => {
                              try {
                                await completarCita.mutateAsync(c.id);
                                toast.success("Cita completada ✅");
                              } catch {
                                toast.error("Error ❌");
                              }
                            }}
                            className="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-sm"
                          >
                            ✅ Completar
                          </button>
                        )}

                      </div>

                    </div>
                  );
                })}

              </div>
            )}

            {/* ✅ PAGINACIÓN */}
            {limite !== "all" && totalPaginas > 1 && (
              <div className="flex justify-center gap-2 pt-4 border-t">

                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(num => (
                  <button
                    key={num}
                    onClick={() => setPagina(num)}
                    className={`px-3 py-1 rounded-full ${
                      pagina === num
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {num}
                  </button>
                ))}

              </div>
            )}

          </div>
        )}

      </div>

    </PageWrapper>
  );
}

export default CitasPage;