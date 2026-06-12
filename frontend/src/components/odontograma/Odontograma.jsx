import {
  useState,
  useEffect
} from "react";

import ConfirmModal
  from "../ConfirmModal";

import {

  RotateCcw,

  RotateCw,

  Save,

  CheckCircle2,

  Trash2

} from "lucide-react";

import { API_URL }
  from "../../config";

import {

  showSuccess,

  showError

} from "../ui/ToastStyles";

import Tooth
  from "./Tooth";

import ToothToolbar
  from "./ToothToolbar";

/*
==========================================
TEETH
==========================================
*/

const dientesSuperiores = [

  18, 17, 16, 15, 14, 13, 12, 11,

  21, 22, 23, 24, 25, 26, 27, 28

];

const dientesInferiores = [

  48, 47, 46, 45, 44, 43, 42, 41,

  31, 32, 33, 34, 35, 36, 37, 38

];

/*
==========================================
LEGEND
==========================================
*/

function Legend({

  color,

  label

}) {

  return (

    <div className="
      flex
      items-center

      gap-2

      px-4
      py-2.5

      rounded-full

      bg-white/90

      border
      border-slate-200

      shadow-sm

      text-sm
      font-semibold
    ">

      <div className={`
        w-3
        h-3

        rounded-full

        ${color}
      `} />

      {label}

    </div>

  );

}

function Odontograma({

  clienteId

}) {

  /*
  ==========================================
  STATES
  ==========================================
  */

  const [

    selectedTool,

    setSelectedTool

  ] = useState("caries");

  const [

    odontograma,

    setOdontograma

  ] = useState({});

  const [

    history,

    setHistory

  ] = useState([]);

  const [

    future,

    setFuture

  ] = useState([]);

  const [

    saving,

    setSaving

  ] = useState(false);
  const [

    confirmDeleteOpen,

    setConfirmDeleteOpen

  ] = useState(false);
  const [

    loaded,

    setLoaded

  ] = useState(false);

  /*
  ==========================================
  LOAD
  ==========================================
  */

  useEffect(() => {

    if (!clienteId)
      return;

    loadOdontograma();

  }, [clienteId]);

  const loadOdontograma =
    async () => {

      try {

        const res = await fetch(

          `${API_URL}/odontograma/${clienteId}`

        );

        if (!res.ok) {

          throw new Error();

        }

        const data =
          await res.json();

        setOdontograma(data || {});

        setLoaded(true);

      } catch {

        showError(
          "Error cargando odontograma ❌"
        );

      }

    };

  /*
  ==========================================
  APPLY
  ==========================================
  */

  const handleApply = (

    tooth,

    face,

    tool

  ) => {

    /*
    ==========================================
    SAVE HISTORY
    ==========================================
    */

    setHistory((prev) => [

      ...prev,

      structuredClone(
        odontograma
      )

    ]);

    /*
    ==========================================
    CLEAR REDO
    ==========================================
    */

    setFuture([]);

    /*
    ==========================================
    UPDATE
    ==========================================
    */

    setOdontograma((prev) => ({

      ...prev,

      [tooth]: {

        ...prev[tooth],

        [face]: tool

      }

    }));

  };

  /*
  ==========================================
  UNDO
  ==========================================
  */

  const undo = () => {

    if (!history.length)
      return;

    const previous =
      history[
      history.length - 1
      ];

    setFuture((prev) => [

      structuredClone(
        odontograma
      ),

      ...prev

    ]);

    setOdontograma(previous);

    setHistory((prev) =>

      prev.slice(0, -1)

    );

  };

  /*
  ==========================================
  REDO
  ==========================================
  */

  const redo = () => {

    if (!future.length)
      return;

    const next =
      future[0];

    setHistory((prev) => [

      ...prev,

      structuredClone(
        odontograma
      )

    ]);

    setOdontograma(next);

    setFuture((prev) =>

      prev.slice(1)

    );

  };

  /*
  ==========================================
  SAVE
  ==========================================
  */

  const guardarOdontograma =
    async () => {

      try {

        setSaving(true);

        const res = await fetch(

          `${API_URL}/odontograma/${clienteId}`,

          {

            method: "PUT",

            headers: {

              "Content-Type":
                "application/json"

            },

            body: JSON.stringify({

              odontograma

            })

          }

        );

        if (!res.ok) {

          throw new Error();

        }

        showSuccess(
          "Odontograma guardado ✅"
        );

      } catch {

        showError(
          "Error guardando odontograma ❌"
        );

      } finally {

        setSaving(false);

      }

    };


  /*
==========================================
DELETE
==========================================
*/

  const eliminarOdontograma =
    async () => {

      const eliminarOdontograma =
        async () => {

          try {

            const res = await fetch(

              `${API_URL}/odontograma/${clienteId}`,

              {

                method: "DELETE"

              }

            );

            if (!res.ok) {

              throw new Error();

            }

            /*
            ==========================================
            RESET
            ==========================================
            */

            setOdontograma({});

            setHistory([]);

            setFuture([]);

            /*
            ==========================================
            CLOSE MODAL
            ==========================================
            */

            setConfirmDeleteOpen(
              false
            );

            showSuccess(
              "Odontograma eliminado ✅"
            );

          } catch {

            showError(
              "Error eliminando odontograma ❌"
            );

          }

        };



      try {

        const res = await fetch(

          `${API_URL}/odontograma/${clienteId}`,

          {

            method: "DELETE"

          }

        );

        if (!res.ok) {

          throw new Error();

        }

        /*
        ==========================================
        RESET FRONTEND
        ==========================================
        */

        setOdontograma({});

        setHistory([]);

        setFuture([]);

        showSuccess(
          "Odontograma eliminado ✅"
        );

      } catch {

        showError(
          "Error eliminando odontograma ❌"
        );

      }

    };
  /*
  ==========================================
  STATS
  ==========================================
  */

  const totalTratamientos =

    Object.values(
      odontograma || {}
    )

      .flatMap((tooth) =>

        Object.values(tooth)

      )

      .filter(Boolean)

      .length;

  /*
  ==========================================
  LOADING
  ==========================================
  */

  if (!loaded) {

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

          <div className="
            w-5
            h-5

            border-2
            border-indigo-500
            border-t-transparent

            rounded-full

            animate-spin
          " />

          Cargando odontograma...

        </div>

      </div>

    );

  }

  return (

    <div className="
      relative

      overflow-hidden

      rounded-[36px]

      border
      border-slate-200/70

      bg-white/70

      backdrop-blur-2xl

      shadow-[0_25px_70px_rgba(15,23,42,0.06)]

      p-6

      space-y-10
    ">

      {/* GLOW */}

      <div className="
        absolute
        -top-24
        -right-24

        w-72
        h-72

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

            mb-3
          ">

            🦷 Odontograma clínico

          </div>

          <h2 className="
            text-3xl

            font-black

            tracking-tight

            text-slate-800
          ">

            Evaluación dental

          </h2>

          <p className="
            mt-2

            text-sm

            text-slate-400
          ">

            Registro visual de tratamientos y superficies dentales

          </p>

        </div>

        {/* STATS */}

        <div className="
          flex
          flex-wrap

          items-center

          gap-3
        ">

          <div className="
            px-4
            py-3

            rounded-[22px]

            bg-indigo-50

            border
            border-indigo-100
          ">

            <p className="
              text-xs

              font-black

              uppercase

              tracking-[0.12em]

              text-indigo-500
            ">

              Tratamientos

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

          <div className="
            px-4
            py-3

            rounded-[22px]

            bg-emerald-50

            border
            border-emerald-100

            text-emerald-600

            text-sm
            font-bold

            flex
            items-center
            gap-2
          ">

            <CheckCircle2
              size={16}
            />

            Historial dental activo

          </div>

        </div>

      </div>

      {/* TOOLBAR */}

      <div className="
        relative
        z-10
      ">

        <ToothToolbar

          selectedTool={
            selectedTool
          }

          setSelectedTool={
            setSelectedTool
          }

        />

      </div>

      {/* ACTIONS */}

      <div className="
        relative
        z-10

        flex
        flex-wrap

        items-center
        justify-center

        gap-3
      ">

        {/* UNDO */}

        <button

          onClick={undo}

          disabled={
            !history.length
          }

          className="
            h-12

            px-5

            rounded-2xl

            bg-white

            border
            border-slate-200

            text-slate-700

            font-bold

            flex
            items-center
            gap-2

            hover:border-indigo-200

            hover:text-indigo-600

            hover:shadow-md

            disabled:opacity-40

            disabled:cursor-not-allowed

            transition-all
            duration-300
          "
        >

          <RotateCcw size={16} />

          Undo

        </button>

        {/* REDO */}

        <button

          onClick={redo}

          disabled={
            !future.length
          }

          className="
            h-12

            px-5

            rounded-2xl

            bg-white

            border
            border-slate-200

            text-slate-700

            font-bold

            flex
            items-center
            gap-2

            hover:border-indigo-200

            hover:text-indigo-600

            hover:shadow-md

            disabled:opacity-40

            disabled:cursor-not-allowed

            transition-all
            duration-300
          "
        >

          <RotateCw size={16} />

          Redo

        </button>

        {/* SAVE */}

        <button

          onClick={
            guardarOdontograma
          }

          disabled={saving}

          className={`
            h-12

            px-6

            rounded-2xl

            text-white

            font-bold

            flex
            items-center
            gap-2

            shadow-[0_15px_35px_rgba(99,102,241,0.25)]

            transition-all
            duration-300

            ${saving

              ? `
                  bg-slate-400
                  cursor-not-allowed
                `

              : `
                  bg-gradient-to-r
                  from-indigo-500
                  via-purple-500
                  to-violet-500

                  hover:scale-[1.02]

                  hover:shadow-[0_20px_45px_rgba(99,102,241,0.35)]
                `
            }
          `}
        >

          <Save size={16} />

          {

            saving

              ? "Guardando..."

              : "Guardar odontograma"

          }

        </button>
        <button

          onClick={() =>

            setConfirmDeleteOpen(
              true
            )

          }

          className="
    h-12

    px-5

    rounded-2xl

    bg-rose-500

    text-white

    font-bold

    flex
    items-center
    gap-2

    shadow-[0_15px_35px_rgba(244,63,94,0.25)]

    hover:bg-rose-600

    hover:scale-[1.02]

    transition-all
    duration-300
  "
        >

          <Trash2 size={16} />

          Eliminar odontograma

        </button>
      </div>

      {/* LEGEND */}

      <div className="
        relative
        z-10

        flex
        flex-wrap
        justify-center

        gap-4
      ">

        <Legend
          color="bg-rose-500"
          label="Caries"
        />

        <Legend
          color="bg-sky-500"
          label="Resina"
        />

        <Legend
          color="bg-amber-400"
          label="Corona"
        />

        <Legend
          color="bg-violet-500"
          label="Implante"
        />

        <Legend
          color="bg-slate-700"
          label="Extracción"
        />

      </div>

      {/* SUPERIOR */}

      <div className="
        relative
        z-10

        flex
        flex-wrap
        justify-center

        gap-5
      ">

        {dientesSuperiores.map(
          (numero) => (

            <Tooth

              key={numero}

              numero={numero}

              selectedTool={
                selectedTool
              }

              data={
                odontograma[
                numero
                ]
              }

              onApply={
                handleApply
              }

            />

          )
        )}

      </div>

      {/* SEPARATOR */}

      <div className="
        relative
        z-10

        w-full
        h-[2px]

        rounded-full

        bg-gradient-to-r
        from-transparent
        via-slate-300
        to-transparent
      " />

      {/* INFERIOR */}

      <div className="
        relative
        z-10

        flex
        flex-wrap
        justify-center

        gap-5
      ">

        {dientesInferiores.map(
          (numero) => (

            <Tooth

              key={numero}

              numero={numero}

              selectedTool={
                selectedTool
              }

              data={
                odontograma[
                numero
                ]
              }

              onApply={
                handleApply
              }

            />

          )
        )}

      </div>
      {
        confirmDeleteOpen && (

          <ConfirmModal

            title="
Eliminar odontograma"

            message="
Esta acción eliminará
todo el odontograma
guardado del paciente."

            confirmText="
Eliminar"

            cancelText="
Cancelar"

            danger

            /*
            ==========================================
            CONFIRM
            ==========================================
            */

            onConfirm={async () => {

              await eliminarOdontograma();

              setConfirmDeleteOpen(
                false
              );

            }}

            /*
            ==========================================
            CANCEL
            ==========================================
            */

            onCancel={() =>

              setConfirmDeleteOpen(
                false
              )

            }

            /*
            ==========================================
            CLOSE
            ==========================================
            */

            onClose={() =>

              setConfirmDeleteOpen(
                false
              )

            }

          />

        )
      }
    </div>

  );

}

export default Odontograma;