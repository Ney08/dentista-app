import {
  useEffect,
  useState
} from "react";

import {

  Plus,

  ClipboardList,

  Loader2

} from "lucide-react";

import { API_URL }
  from "../../config";

import {

  showError

} from "../ui/ToastStyles";

import TratamientoCard
  from "./TratamientoCard";

import TratamientoModal
  from "./TratamientoModal";

function TratamientosList({

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

    modalOpen,

    setModalOpen

  ] = useState(false);

  /*
  ==========================================
  LOAD
  ==========================================
  */

  useEffect(() => {

    if (!clienteId)
      return;

    loadTratamientos();

  }, [clienteId]);

  /*
  ==========================================
  FETCH
  ==========================================
  */

  const loadTratamientos =
    async () => {

      try {

        setLoading(true);

        const res = await fetch(

          `${API_URL}/tratamientos/${clienteId}`

        );

        if (!res.ok) {

          throw new Error();

        }

        const data =
          await res.json();

        setTratamientos(data);

      } catch {

        showError(
          "Error cargando tratamientos ❌"
        );

      } finally {

        setLoading(false);

      }

    };

  /*
  ==========================================
  TOTALS
  ==========================================
  */

  const totalTratamientos =
    tratamientos.length;

  const totalPendiente =
    tratamientos.filter(

      (t) =>
        t.estado !==
        "Completado"

    ).length;

  /*
  ==========================================
  LOADING
  ==========================================
  */

  if (loading) {

    return (

      <div className="
        flex
        items-center
        justify-center

        py-20
      ">

        <div className="
          flex
          items-center
          gap-3

          text-slate-500
        ">

          <Loader2
            size={20}
            className="
              animate-spin
            "
          />

          Cargando tratamientos...

        </div>

      </div>

    );

  }

  return (


    <div className="
  relative

  w-full

  overflow-hidden


      rounded-[36px]

      bg-white/75

      backdrop-blur-2xl

      border
      border-white/50

      shadow-[0_20px_50px_rgba(0,0,0,0.08)]

      p-6

      space-y-8
    ">

      {/* GLOW */}

      <div className="
        absolute
        -top-20
        -right-20

        w-64
        h-64

        rounded-full

        bg-indigo-500/10

        blur-3xl
      " />

      {/* HEADER */}

      <div className="
        relative
        z-10

        flex
        flex-col
        lg:flex-row

        lg:items-center
        lg:justify-between

        gap-5
      ">

        {/* LEFT */}

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

            🦷 Tratamientos

          </div>

          <h2 className="
            text-3xl

            font-black

            tracking-tight

            text-slate-800
          ">

            Planes clínicos

          </h2>

          <p className="
            mt-2

            text-sm

            text-slate-400
          ">

            Seguimiento y control
            de tratamientos del paciente

          </p>

        </div>

        {/* STATS */}

        <div className="
          flex
          flex-wrap

          items-center

          gap-3
        ">

          {/* TOTAL */}

          <div className="
            px-5
            py-4

            rounded-[24px]

            bg-indigo-50

            border
            border-indigo-100
          ">

            <p className="
              text-xs

              uppercase

              tracking-[0.12em]

              font-black

              text-indigo-500
            ">

              Total

            </p>

            <p className="
              mt-1

              text-2xl

              font-black

              text-slate-800
            ">

              {totalTratamientos}

            </p>

          </div>

          {/* PENDIENTES */}

          <div className="
            px-5
            py-4

            rounded-[24px]

            bg-amber-50

            border
            border-amber-100
          ">

            <p className="
              text-xs

              uppercase

              tracking-[0.12em]

              font-black

              text-amber-500
            ">

              Pendientes

            </p>

            <p className="
              mt-1

              text-2xl

              font-black

              text-slate-800
            ">

              {totalPendiente}

            </p>

          </div>

        </div>

      </div>

      {/* ACTIONS */}

      <div className="
        relative
        z-10

        flex
        justify-end
      ">

        <button

          onClick={() =>
            setModalOpen(true)
          }

          className="
            group

            relative
            overflow-hidden

            h-12

            px-6

            rounded-2xl

            bg-gradient-to-r
            from-indigo-500
            via-purple-500
            to-violet-500

            text-white

            text-sm
            font-black

            flex
            items-center
            gap-3

            shadow-[0_15px_35px_rgba(99,102,241,0.25)]

            hover:scale-[1.02]

            hover:shadow-[0_20px_45px_rgba(99,102,241,0.35)]

            transition-all
            duration-300
          "
        >

          <Plus size={18} />

          Nuevo tratamiento

        </button>

      </div>

      {/* EMPTY */}

      {
        tratamientos.length === 0 && (

          <div className="
            relative
            z-10

            flex
            flex-col

            items-center
            justify-center

            text-center

            py-20
          ">

            <div className="
              w-24
              h-24

              rounded-[30px]

              bg-slate-100

              flex
              items-center
              justify-center

              mb-6
            ">

              <ClipboardList

                size={38}

                className="
                  text-slate-400
                "
              />

            </div>

            <h3 className="
              text-2xl

              font-black

              text-slate-700
            ">

              Sin tratamientos

            </h3>

            <p className="
              mt-3

              max-w-md

              text-sm

              leading-relaxed

              text-slate-400
            ">

              Todavía no existen
              tratamientos registrados
              para este paciente.

            </p>

          </div>

        )
      }

      {/* LIST */}

      {
        tratamientos.length > 0 && (

          <div className="
            relative
            z-10

            
grid
grid-cols-1



            gap-5
          ">

            {
              tratamientos.map(
                (

                  tratamiento

                ) => (

                  <TratamientoCard

                    key={
                      tratamiento.id
                    }

                    tratamiento={
                      tratamiento
                    }

                  />

                )
              )
            }

          </div>

        )
      }

      {/* MODAL */}

      {
        modalOpen && (

          <TratamientoModal

            clienteId={
              clienteId
            }

            onClose={() =>
              setModalOpen(false)
            }

            onCreated={() => {

              setModalOpen(false);

              loadTratamientos();

            }}

          />

        )
      }

    </div>

  );

}

export default TratamientosList;