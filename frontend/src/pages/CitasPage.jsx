import { useState } from "react";
import toast from "react-hot-toast";

import { useLocation } from "react-router-dom";
import { useEffect } from "react";

import PageWrapper from "../components/PageWrapper";
import CitaForm from "../components/CitaForm";
import { useClientes } from "../hooks/useClientes";
import { useCitas } from "../hooks/useCitas";
import { formatFecha, formatHora, parseFechaLocal } from "../utils/fecha";
function CitasPage() {
  const location = useLocation();
  const clienteDesdeClientes = location.state?.clienteSeleccionado;
  const [modalAbierto, setModalAbierto] = useState(false);
  const { clientes } = useClientes();
  const [clientePresetLocal, setClientePresetLocal] = useState(null);
  const [animar, setAnimar] = useState(false);


  useEffect(() => {
    if (modalAbierto) {
      setTimeout(() => setAnimar(true), 10);
    } else {
      setAnimar(false);
    }
  }, [modalAbierto]);

  useEffect(() => {
    if (clienteDesdeClientes) {
      setClientePresetLocal(clienteDesdeClientes);
      setModalAbierto(true);

      window.history.replaceState({}, document.title);
    }
  }, [clienteDesdeClientes]);


  const {
    citas,
    completarCita,
    cancelarCita,
    isLoading
  } = useCitas();




  const [citaEditar, setCitaEditar] = useState(null);
  const [filtro, setFiltro] = useState("todas");

  const hoy = new Date();

  const abrirCrear = () => {
    setCitaEditar(null);
    setModalAbierto(true);
  };

  const abrirEditar = (c) => {
    setCitaEditar(c);
    setModalAbierto(true);
  };


  const cerrarModal = () => {
    setModalAbierto(false);
    setCitaEditar(null);
    setClientePresetLocal(null);
  };


  const getEstado = (c) => {
    if (c.estado === "cancelada") return "cancelada";
    if (c.estado === "completada") return "completada";

    const fecha = parseFechaLocal(c.fecha);
    const ahora = new Date();

    if (fecha < ahora) return "atrasada";

    return "pendiente";
  };

  const citasFiltradas = citas.filter(c => {
    const f = parseFechaLocal(c.fecha);

    if (filtro === "hoy") {
      return (
        f.getDate() === hoy.getDate() &&
        f.getMonth() === hoy.getMonth() &&
        f.getFullYear() === hoy.getFullYear()
      );
    }

    return true;
  });

  const citasActivas = citas.filter(c => c.estado !== "cancelada");

  const pendientes = citasActivas.filter(c => getEstado(c) === "pendiente").length;
  const atrasadas = citasActivas.filter(c => getEstado(c) === "atrasada").length;
  const completadas = citasActivas.filter(c => getEstado(c) === "completada").length;
  const canceladas = citas.filter(c => c.estado === "cancelada").length;

  const ordenadas = [...citasFiltradas].sort(
    (a, b) => new Date(a.fecha) - new Date(b.fecha)
  );

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

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Citas 📅</h1>
          <p className="text-gray-500 text-sm">
            Gestiona las citas del sistema
          </p>
        </div>

        {/* CARD PRINCIPAL */}
        <div className="bg-white p-6 rounded-2xl shadow-md space-y-5">

          {/* TOP BAR */}
          <div className="flex flex-wrap justify-between items-center gap-3">

            {/* IZQUIERDA */}
            <div className="flex gap-2 flex-wrap">

              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm">
                🟡 {pendientes}
              </span>

              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm">
                🔴 {atrasadas}
              </span>

              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm">
                ✅ {completadas}
              </span>

              <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm">
                ⛔ {canceladas}
              </span>

            </div>

            {/* DERECHA */}
            <div className="flex gap-2 items-center">

              <select
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="border px-2 py-1 rounded text-sm"
              >
                <option value="todas">Todas</option>
                <option value="hoy">Solo hoy</option>
              </select>

              <button
                onClick={abrirCrear}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm shadow"
              >
                ➕ Nueva
              </button>

            </div>

          </div>

          {/* LISTA */}
          <div className="space-y-3">

            {ordenadas.map(c => {

              const estado = getEstado(c);
              const fecha = parseFechaLocal(c.fecha);

              const estadoStyle = {
                pendiente: "bg-yellow-100 text-yellow-800 border-yellow-300",
                atrasada: "bg-red-100 text-red-800 border-red-300",
                completada: "bg-green-100 text-green-800 border-green-300",
                cancelada: "bg-gray-200 text-gray-700 border-gray-300"
              };

              const bordeLateral = {
                pendiente: "border-l-yellow-400",
                atrasada: "border-l-red-400",
                completada: "border-l-green-400",
                cancelada: "border-l-gray-400"
              };

              const estadoText = {
                pendiente: "🟡 Pendiente",
                atrasada: "🔴 Atrasada",
                completada: "✅ Completada",
                cancelada: "⛔ Cancelada"
              };

              return (

                <div
                  key={c.id}
                  className={`
    p-4 rounded-xl flex justify-between items-center border-l-4 transition-all
    ${bordeLateral[estado]}
    ${estado === "cancelada" ? "opacity-60" : ""}
    ${estado === "pendiente" ? "bg-yellow-50" : ""}
    hover:shadow-lg hover:-translate-y-0.5
  `}
                >


                  {/* INFO */}
                  <div className="space-y-1">

                    <p className="font-semibold text-gray-800">
                      {c.cliente?.nombre} {c.cliente?.apellido}
                    </p>


                    <p className="text-sm font-medium text-gray-700">
                      {formatFecha(fecha)} —{" "}
                      {formatHora(fecha)}
                    </p>

                    <p className="text-sm text-gray-400">
                      {c.motivo}
                    </p>
                  </div>

                  {/* DERECHA */}
                  <div className="flex items-center gap-2">

                    {/* ESTADO */}

                    <span
                      className={`
    px-3 py-1 text-xs rounded-full border flex items-center gap-1
    shadow-sm
    ${estadoStyle[estado]}
  `}
                    >

                      {estadoText[estado]}
                    </span>

                    {/* BOTONES */}
                    {estado === "pendiente" && (
                      <>
                        <button
                          title="Marcar como completada"
                          onClick={() => completarCita.mutate(c.id)}
                          className="
                bg-green-500 hover:bg-green-600
                text-white w-8 h-8 flex items-center justify-center
                rounded-lg shadow-sm transition
              "
                        >
                          ✅
                        </button>

                        <button
                          title="Editar cita"
                          onClick={() => abrirEditar(c)}
                          className="
                bg-blue-500 hover:bg-blue-600
                text-white w-8 h-8 flex items-center justify-center
                rounded-lg shadow-sm transition
              "
                        >
                          ✏️
                        </button>

                        <button
                          title="Cancelar cita"
                          onClick={async () => {
                            await cancelarCita.mutateAsync(c.id);
                            toast.success("Cancelada");
                          }}
                          className="
                bg-gray-500 hover:bg-gray-600
                text-white w-8 h-8 flex items-center justify-center
                rounded-lg shadow-sm transition
              "
                        >
                          ⛔
                        </button>
                      </>
                    )}

                    {estado === "atrasada" && (
                      <>
                        <button
                          title="Reagendar cita"
                          onClick={() => abrirEditar(c)}
                          className="
                bg-blue-500 hover:bg-blue-600
                text-white w-8 h-8 flex items-center justify-center
                rounded-lg shadow-sm transition
              "
                        >
                          ✏️
                        </button>

                        <button
                          title="Cancelar cita"
                          onClick={async () => {
                            await cancelarCita.mutateAsync(c.id);
                            toast.success("Cancelada");
                          }}
                          className="
                bg-gray-500 hover:bg-gray-600
                text-white w-8 h-8 flex items-center justify-center
                rounded-lg shadow-sm transition
              "
                        >
                          ⛔
                        </button>
                      </>
                    )}

                  </div>

                </div>
              );
            })}


          </div>

        </div>

      </div>

      {/* MODAL */}
      {modalAbierto && (

        <div
          className={`
    fixed inset-0 z-50 flex items-center justify-center
    transition-all duration-200 ease-out
    ${modalAbierto ? "visible" : "invisible"}
    ${animar
              ? "opacity-100 bg-black/40 backdrop-blur-md"
              : "opacity-0"}
  `}
        >




          <div
            className={`
    w-full max-w-3xl p-6
    transform transition-all duration-200 ease-out
    ${animar
                ? "scale-100 opacity-100 translate-y-0"
                : "scale-95 opacity-0 translate-y-6"}
  `}
          >


            <CitaForm
              key={citaEditar?.id || clientePresetLocal?.id || "nuevo"}
              clientes={clientes}
              cita={citaEditar}
              clientePreset={clientePresetLocal}
              onCrear={cerrarModal}
              onClose={cerrarModal}
            />

          </div>
        </div>

      )}

    </PageWrapper>
  );
}

export default CitasPage;