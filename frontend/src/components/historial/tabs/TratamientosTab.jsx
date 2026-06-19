import { useEffect, useState }
  from "react";

import TratamientoModal
  from "../../tratamientos/TratamientoModal";

import { API_URL }
  from "../../../config";

function TratamientosTab({
  clienteId
}) {

  /*
  ==========================================
  STATES
  ==========================================
  */

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

                      className="
                        group

                        relative
                        overflow-hidden

                        rounded-[32px]

                        bg-white

                        border
                        border-slate-200

                        p-6

                        shadow-sm

                        hover:shadow-xl

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

    </div>

  );

}

export default TratamientosTab;