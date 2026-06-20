import { useEffect, useState }
  from "react";

import {

  FileText,

  Pencil,

  Trash2,

  MoreVertical,

  Stethoscope

} from "lucide-react";


import BaseModal
  from "../../BaseModal";

import TratamientoModal
  from "../../tratamientos/TratamientoModal";
import TratamientoTimeline
  from "../../tratamientos/TratamientoTimeline";

import { API_URL }
  from "../../../config";

function TratamientosTab({
  clienteId,
  tratamiento

}) {

  /*
  ==========================================
  STATES
  ==========================================
  */


  const [

    abierto,

    setAbierto

  ] = useState(false);


  const [

    tratamientoSeleccionado,

    setTratamientoSeleccionado

  ] = useState(null);

  const [

    tratamientos,

    setTratamientos

  ] = useState([]);

  const [

    loading,

    setLoading

  ] = useState(true);

  const [

    openModal,

    setOpenModal

  ] = useState(false);

  /*
  ==========================================
  LOAD
  ==========================================
  */

  const loadTratamientos =
    async () => {

      try {

        setLoading(true);

        const res = await fetch(

          `${API_URL}/tratamientos/${clienteId}`

        );

        const data =
          await res.json();

        setTratamientos(data);

      } catch {

        console.error(
          "Error cargando tratamientos"
        );

      } finally {

        setLoading(false);

      }

    };

  useEffect(() => {

    loadTratamientos();

  }, [clienteId]);

  /*
  ==========================================
  HELPERS
  ==========================================
  */

  const pendientes =
    tratamientos.filter(

      (t) =>
        t.estado !== "Completado"

    ).length;

  /*
  ==========================================
  RENDER
  ==========================================
  */

  const timelineEvents = tratamientos
  .flatMap((t) => [
    {
      title: `Tratamiento: ${t.servicio_nombre}`,
      date: t.created_at
        ? new Date(t.created_at).toLocaleDateString()
        : "--",
      description: `Se creó el tratamiento (Estado: ${t.estado})`
    },
    {
      title: `Estado actualizado`,
      date: "Actual",
      description: `Actualmente está en estado: ${t.estado}`
    }
  ])
  .sort((a, b) => {
    // opcional: ordenar por fecha si quieres
    return new Date(b.date) - new Date(a.date);
  });
  
  return (

    <div className="
      space-y-8
    ">

      {/* HEADER */}

      <div className="
        flex
        flex-col
        xl:flex-row

        items-start
        xl:items-center

        justify-between

        gap-5
      ">

        <div>

          <div className="
            inline-flex

            items-center
            gap-2

            px-4
            py-2

            rounded-2xl

            bg-indigo-50

            border
            border-indigo-100

            text-indigo-600

            text-xs
            font-black
          ">

            💎 Tratamientos

          </div>

          <h3 className="
            mt-4

            text-4xl

            font-black

            tracking-tight

            text-slate-800
          ">

            Planes clínicos

          </h3>

          <p className="
            mt-2

            text-slate-500
          ">

            Gestión y seguimiento
            de tratamientos del paciente.

          </p>

        </div>

        {/* STATS */}

        <div className="
          flex

          gap-4
        ">

          <div className="
            rounded-[28px]

            bg-white

            border
            border-slate-200

            px-6
            py-5

            shadow-sm
          ">

            <p className="
              text-xs

              font-black

              uppercase

              tracking-wider

              text-indigo-400
            ">

              Total

            </p>

            <p className="
              mt-2

              text-3xl

              font-black

              text-slate-800
            ">

              {tratamientos.length}

            </p>

          </div>

          <div className="
            rounded-[28px]

            bg-amber-50

            border
            border-amber-100

            px-6
            py-5
          ">

            <p className="
              text-xs

              font-black

              uppercase

              tracking-wider

              text-amber-500
            ">

              Pendientes

            </p>

            <p className="
              mt-2

              text-3xl

              font-black

              text-amber-700
            ">

              {pendientes}

            </p>

          </div>

        </div>

      </div>

      {/* ACTION */}

      <div className="
        flex
        justify-end
      ">

        <button

          onClick={() =>
            setOpenModal(true)
          }

          className="
            h-14

            px-6

            rounded-[24px]

            bg-gradient-to-r
            from-indigo-500
            via-purple-500
            to-violet-500

            text-white

            text-sm
            font-black

            shadow-[0_15px_35px_rgba(99,102,241,0.25)]

            hover:scale-[1.02]

            transition-all
            duration-300
          "
        >

          + Nuevo tratamiento

        </button>

      </div>

      {/* GRID */}

      {

        loading

          ? (

            <div className="
              text-center

              py-20

              text-slate-400
            ">

              Cargando tratamientos...

            </div>

          )

          : tratamientos.length === 0

            ? (

              <div className="
                rounded-[32px]

                bg-white

                border
                border-dashed
                border-slate-300

                py-24

                text-center
              ">

                <div className="
                  text-6xl
                ">

                  🦷

                </div>

                <h4 className="
                  mt-5

                  text-2xl

                  font-black

                  text-slate-700
                ">

                  No hay tratamientos

                </h4>

                <p className="
                  mt-2

                  text-slate-400
                ">

                  Crea el primer tratamiento clínico.

                </p>

              </div>

            )

            : (

              <div className="
                grid
                grid-cols-1
                xl:grid-cols-2
                2xl:grid-cols-3

                gap-6
              ">

                {

                  tratamientos.map((t) => (


                    <div
                      key={t.id}

                      onClick={() =>
                        setTratamientoSeleccionado(t)
                      }

                      className="
    group

    relative
    overflow-hidden

    cursor-pointer


                        rounded-[32px]

                        bg-white

                        border
                        border-slate-200

                        p-6

                        shadow-sm

                        
hover:-translate-y-1

hover:border-indigo-200

hover:shadow-[0_25px_60px_rgba(99,102,241,0.12)]


                        transition-all
                        duration-300
                      "
                    >

                      {/* STATUS */}

                      <div className="
                        flex
                        items-center
                        justify-between
                      ">

                        <span className={`
                          px-4
                          py-2

                          rounded-full

                          text-xs
                          font-black

                          ${t.estado === "Completado"

                            ? `
                              bg-emerald-100
                              text-emerald-700
                            `

                            : `
                              bg-amber-100
                              text-amber-700
                            `
                          }
                        `}>

                          {t.estado}

                        </span>

                        <span className="
                          text-xs

                          text-slate-400
                        ">

                          #{t.id}

                        </span>

                      </div>

                      {/* TITLE */}

                      <h4 className="
                        mt-6

                        text-2xl

                        font-black

                        text-slate-800
                      ">

                        {t.servicio_nombre}

                      </h4>

                      {/* INFO */}

                      <div className="
                        mt-5

                        space-y-3
                      ">

                        <div className="
                          flex
                          items-center
                          justify-between
                        ">

                          <span className="
                            text-slate-400
                          ">

                            Pieza

                          </span>

                          <span className="
                            font-bold

                            text-slate-700
                          ">

                            {t.pieza || "--"}

                          </span>

                        </div>

                        <div className="
                          flex
                          items-center
                          justify-between
                        ">

                          <span className="
                            text-slate-400
                          ">

                            Sesiones

                          </span>

                          <span className="
                            font-bold

                            text-slate-700
                          ">

                            {

                              t.sesiones_completadas

                            }

                            /

                            {

                              t.sesiones_totales

                            }

                          </span>

                        </div>

                        <div className="
                          flex
                          items-center
                          justify-between
                        ">

                          <span className="
                            text-slate-400
                          ">

                            Balance

                          </span>

                          <span className="
                            font-black

                            text-indigo-600
                          ">

                            RD$

                            {

                              Number(t.costo || 0)

                              -

                              Number(t.pagado || 0)

                            }

                          </span>

                        </div>

                      </div>

                      {/* PROGRESS */}

                      <div className="
                        mt-6
                      ">

                        <div className="
                          h-3

                          rounded-full

                          bg-slate-100

                          overflow-hidden
                        ">

                          <div

                            style={{
                              width: `${(

                                (
                                  t.sesiones_completadas

                                  /

                                  t.sesiones_totales

                                ) * 100

                              )}%`
                            }}

                            className="
                              h-full

                              rounded-full

                              bg-gradient-to-r
                              from-indigo-500
                              to-violet-500
                            "
                          />

                        </div>

                      </div>

                    </div>

                  ))

                }

              </div>

            )

      }

      {/* MODAL */}

      {

        openModal && (

          <TratamientoModal

            clienteId={clienteId}

            onClose={() =>
              setOpenModal(false)
            }

            onCreated={() => {

              setOpenModal(false);

              loadTratamientos();

            }}

          />

        )

      }
      {

        tratamientoSeleccionado && (

          <BaseModal
            onClose={() =>
              setTratamientoSeleccionado(null)
            }

            maxWidth="max-w-5xl"
          >

            <div className="
        space-y-8
      ">

              {/* HEADER */}

              <div className="
          flex
          items-start
          justify-between

          gap-4
        ">

                <div>

                  <div className="
              inline-flex

              items-center
              gap-2

              px-3
              py-1.5

              rounded-full

              bg-indigo-500/10

              text-indigo-600

              text-xs
              font-black

              mb-4
            ">

                    🦷 Tratamiento dental

                  </div>

                  <h2 className="
              text-4xl

              font-black

              tracking-tight

              text-slate-800
            ">

                    {

                      tratamientoSeleccionado
                        .servicio_nombre

                    }

                  </h2>

                </div>

                <button
                  onClick={() =>
                    setTratamientoSeleccionado(null)
                  }

                  className="
              w-12
              h-12

              rounded-2xl

              bg-slate-100

              border
              border-slate-200
            "
                >

                  ✕

                </button>

              </div>

              {/* GRID */}

              <div className="
          grid
          grid-cols-1
          lg:grid-cols-2

          gap-6
        ">

                {/* INFO */}

                <div className="
            rounded-[30px]

            bg-slate-50

            border
            border-slate-200

            p-6

            space-y-4
          ">

                  <h3 className="
              text-lg

              font-black

              text-slate-800
            ">

                    Información clínica

                  </h3>

                  <div className="
              flex
              justify-between
            ">

                    <span>Pieza</span>

                    <strong>

                      {

                        tratamientoSeleccionado
                          .pieza || "--"

                      }

                    </strong>

                  </div>

                  <div className="
              flex
              justify-between
            ">

                    <span>Estado</span>

                    <strong>

                      {

                        tratamientoSeleccionado
                          .estado

                      }

                    </strong>

                  </div>

                  <div className="
              flex
              justify-between
            ">

                    <span>Sesiones</span>

                    <strong>

                      {

                        tratamientoSeleccionado
                          .sesiones_completadas

                      }

                      /

                      {

                        tratamientoSeleccionado
                          .sesiones_totales

                      }

                    </strong>

                  </div>

                </div>

                {/* FINANZAS */}

                <div className="
            rounded-[30px]

            bg-indigo-50/60

            border
            border-indigo-100

            p-6

            space-y-4
          ">

                  <h3 className="
              text-lg

              font-black

              text-slate-800
            ">

                    Balance financiero

                  </h3>

                  <div className="
              flex
              justify-between
            ">

                    <span>Costo</span>

                    <strong>

                      RD$

                      {

                        tratamientoSeleccionado
                          .costo

                      }

                    </strong>

                  </div>

                  <div className="
              flex
              justify-between
            ">

                    <span>Pagado</span>

                    <strong>

                      RD$

                      {

                        tratamientoSeleccionado
                          .pagado

                      }

                    </strong>

                  </div>

                  <div className="
              flex
              justify-between

              text-indigo-600
            ">

                    <span>Balance</span>

                    <strong>

                      RD$

                      {

                        Number(
                          tratamientoSeleccionado.costo || 0
                        )

                        -

                        Number(
                          tratamientoSeleccionado.pagado || 0
                        )

                      }

                    </strong>

                  </div>

                </div>

              </div>

              {/* NOTES */}

              {

                tratamientoSeleccionado.notas && (

                  <div className="
              rounded-[30px]

              bg-white

              border
              border-slate-200

              p-6
            ">

                    <h3 className="
                text-lg

                font-black

                mb-4
              ">

                      Observaciones clínicas

                    </h3>

                    <p className="
                text-slate-600

                leading-relaxed
              ">

                      {

                        tratamientoSeleccionado
                          .notas

                      }

                    </p>

                  </div>

                )

              }

            </div>

          </BaseModal>

        )



      }
      {/* TIMELINE */}

      <div className="
        relative
        z-10

        mt-8
      ">

        <div className="
          flex
          items-center
          gap-2

          mb-5

          text-slate-500

          text-xs
          font-black

          uppercase

          tracking-[0.12em]
        ">

          <MoreVertical
            size={14}
          />

          Timeline clínico

        </div>

        <TratamientoTimeline

          events={
            timelineEvents
          }

        />

      </div>
    </div>

  );

}

export default TratamientosTab;