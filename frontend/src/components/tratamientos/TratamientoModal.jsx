import {
  useEffect,
  useState
} from "react";

import {
  X,
  Save,
  Loader2
} from "lucide-react";

import BaseModal
  from "../BaseModal";

import { API_URL }
  from "../../config";

import {
  showSuccess,
  showError
} from "../ui/ToastStyles";

function TratamientoModal({

  clienteId,

  onClose,

  onCreated

}) {

  /*
  ==========================================
  STATES
  ==========================================
  */



  const [
    servicios,
    setServicios
  ] = useState([]);

  const [
    odontograma,
    setOdontograma
  ] = useState({});


  const [
    tratamientos,
    setTratamientos
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(false);

  const [
    form,
    setForm
  ] = useState({

    servicio_id: "",

    pieza: "",

    estado: "Pendiente",

    costo: "",

    pagado: "",

    sesiones_totales: 1,

    sesiones_completadas: 0,

    notas: ""

  });
  const piezasBase = [
    "18", "17", "16", "15", "14", "13", "12", "11",
    "21", "22", "23", "24", "25", "26", "27", "28",
    "48", "47", "46", "45", "44", "43", "42", "41",
    "31", "32", "33", "34", "35", "36", "37", "38"
  ];

  const piezaTieneRegistro = (numero) => {

    const pieza =
      odontograma?.[numero];

    if (!pieza) {
      return false;
    }

    return Boolean(
      pieza.top ||
      pieza.left ||
      pieza.center ||
      pieza.right ||
      pieza.bottom ||
      pieza?.meta?.tratamiento_completado
    );

  };

  const servicioSeleccionado =
    servicios.find(
      (s) =>
        String(s.id) ===
        String(form.servicio_id)
    );

  const getTratamientoCompletadoPorPieza = (numero) => {

    if (!form.servicio_id) {
      return null;
    }

    return tratamientos.find(t => {

      const mismaPieza =
        String(t.pieza) ===
        String(numero);

      const mismoServicio =
        String(t.servicio_id) ===
        String(form.servicio_id);

      const completado =
        String(t.estado || "")
          .trim()
          .toLowerCase() === "completado";

      return (
        mismaPieza &&
        mismoServicio &&
        completado
      );

    }) || null;

  };

  // const getOtroTratamientoCompletadoPorPieza = (numero) => {

  //   return tratamientos.find(t => {

  //     const mismaPieza =
  //       String(t.pieza) ===
  //       String(numero);

  //     const distintoServicio =
  //       form.servicio_id
  //         ? String(t.servicio_id) !==
  //         String(form.servicio_id)
  //         : true;

  //     const completado =
  //       String(t.estado || "")
  //         .trim()
  //         .toLowerCase() === "completado";

  //     return (
  //       mismaPieza &&
  //       distintoServicio &&
  //       completado
  //     );

  //   }) || null;

  // };
  const piezasDentales =
    piezasBase.map(numero => {

      const tratamientoMismoServicio =
        getTratamientoCompletadoPorPieza(
          numero
        );

      return {

        numero,

        tieneRegistro:
          piezaTieneRegistro(numero),

        completadoMismoServicio:
          Boolean(
            tratamientoMismoServicio
          ),

        servicioCompletado:
          tratamientoMismoServicio
            ?.servicio_nombre ||
          servicioSeleccionado
            ?.nombre

      };

    });
  /*
  ==========================================
  LOAD SERVICIOS
  ==========================================
  */



  useEffect(() => {

    loadServicios();

    loadOdontograma();

    loadTratamientos();

  }, []);


  const loadOdontograma =
    async () => {

      try {

        if (!clienteId) {
          return;
        }

        const res =
          await fetch(
            `${API_URL}/odontograma/${clienteId}`
          );

        if (!res.ok) {
          throw new Error();
        }

        const data =
          await res.json();

        setOdontograma(
          data || {}
        );

      } catch {

        setOdontograma({});

      }

    };

  const loadServicios =
    async () => {

      try {

        const res =
          await fetch(
            `${API_URL}/servicios/`
          );

        if (!res.ok) {
          throw new Error();
        }

        const data =
          await res.json();

        setServicios(data);

      } catch {

        showError(
          "Error cargando servicios ❌"
        );

      }

    };


  const loadTratamientos =
    async () => {

      try {

        if (!clienteId) {
          return;
        }

        const res =
          await fetch(
            `${API_URL}/tratamientos/${clienteId}`
          );

        if (!res.ok) {
          throw new Error();
        }

        const data =
          await res.json();

        setTratamientos(
          Array.isArray(data)
            ? data
            : []
        );

      } catch {

        setTratamientos([]);

      }

    };

  /*
  ==========================================
  HANDLE CHANGE
  ==========================================
  */

  const handleChange = (
    key,
    value
  ) => {

    setForm((prev) => ({

      ...prev,

      [key]:
        value

    }));

  };

  /*
  ==========================================
  SUBMIT
  ==========================================
  */

  const guardarTratamiento =
    async () => {

      if (!form.servicio_id) {

        showError(
          "Selecciona un servicio ⚠️"
        );

        return;

      }

      if (!form.pieza) {

        showError(
          "Selecciona una pieza dental ⚠️"
        );

        return;

      }

      const tratamientoDuplicado =
        getTratamientoCompletadoPorPieza(
          form.pieza
        );

      if (tratamientoDuplicado) {

        showError(
          `${tratamientoDuplicado.servicio_nombre || "Este servicio"} ya está completado en la pieza ${form.pieza} ⚠️`
        );

        return;

      }

      try {

        setLoading(true);

        const res =
          await fetch(
            `${API_URL}/tratamientos/`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify({

                  cliente_id:
                    clienteId,

                  servicio_id:
                    Number(
                      form.servicio_id
                    ),

                  servicio_nombre:
                    servicioSeleccionado?.nombre,

                  pieza:
                    form.pieza,

                  estado:
                    form.estado,

                  costo:
                    Number(
                      form.costo || 0
                    ),

                  pagado:
                    Number(
                      form.pagado || 0
                    ),

                  sesiones_totales:
                    Number(
                      form.sesiones_totales
                    ),

                  sesiones_completadas:
                    Number(
                      form.sesiones_completadas
                    ),

                  notas:
                    form.notas

                })

            }
          );

        if (!res.ok) {
          throw new Error();
        }

        showSuccess(
          "Tratamiento creado ✅"
        );

        onCreated();

      } catch {

        showError(
          "Error creando tratamiento ❌"
        );

      } finally {

        setLoading(false);

      }

    };

  /*
  ==========================================
  REUSABLE INPUT CLASS
  ==========================================
  */

  const inputClass = `
    w-full

    h-14

    rounded-2xl

    bg-white

    border
    border-slate-200

    px-4

    text-sm

    text-slate-700

    placeholder:text-slate-400

    focus:outline-none

    focus:ring-4
    focus:ring-sky-500/10

    focus:border-sky-300

    transition-all
    duration-300
  `;

  /*
  ==========================================
  RETURN
  ==========================================
  */

  return (

    <BaseModal
      onClose={onClose}
      maxWidth="max-w-3xl"
    >

      <div className="
        relative

        overflow-hidden

        rounded-[36px]

        bg-gradient-to-br
        from-slate-50
        via-white
        to-sky-50/50

        p-6
        sm:p-8

        space-y-8
      ">

        {/* GLOW */}

        <div className="
          absolute
          -top-20
          -right-20

          w-72
          h-72

          rounded-full

          bg-sky-500/10

          blur-3xl
        " />

        {/* HEADER */}

        <div className="
          relative
          z-10

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

              bg-sky-500/10

              border
              border-sky-100

              text-sky-800

              text-xs
              font-black

              mb-4
            ">

              🦷 Nuevo tratamiento

            </div>

            <h2 className="
              text-3xl

              font-black

              tracking-tight

              text-slate-800
            ">

              Crear tratamiento

            </h2>

            <p className="
              mt-2

              text-sm

              text-slate-400
            ">

              Registra un nuevo procedimiento clínico para el paciente

            </p>

          </div>

          {/* CLOSE */}

          <button
            onClick={onClose}
            className="
              w-12
              h-12

              rounded-2xl

              bg-white

              border
              border-slate-200

              flex
              items-center
              justify-center

              text-slate-500

              hover:text-rose-500

              hover:border-rose-200

              hover:bg-rose-50

              transition-all
              duration-300
            "
          >

            <X size={18} />

          </button>

        </div>

        {/* FORM */}

        <div className="
          relative
          z-10

          grid
          grid-cols-1
          md:grid-cols-2

          gap-5
        ">

          {/* SERVICIO */}

          <div className="
            space-y-2
          ">

            <label className="
              text-xs

              font-black

              uppercase

              tracking-[0.12em]

              text-slate-400
            ">

              Servicio

            </label>

            <select
              value={form.servicio_id}
              onChange={(e) =>
                handleChange(
                  "servicio_id",
                  e.target.value
                )
              }
              className={inputClass}
            >

              <option value="">
                Seleccionar servicio
              </option>

              {servicios.map((servicio) => (

                <option
                  key={servicio.id}
                  value={servicio.id}
                >

                  {servicio.nombre}

                </option>

              ))}

            </select>

          </div>

          {/* PIEZA */}

          <div className="
            space-y-2
          ">

            <label className="
              text-xs

              font-black

              uppercase

              tracking-[0.12em]

              text-slate-400
            ">

              Pieza dental

            </label>

            <select
              value={form.pieza}
              onChange={(e) =>
                handleChange(
                  "pieza",
                  e.target.value
                )
              }
              className={inputClass}
            >
              <option value="">
                Seleccionar pieza dental
              </option>

              {piezasDentales.map((pieza) => (


                <option
                  key={pieza.numero}
                  value={pieza.numero}
                  disabled={pieza.completadoMismoServicio}
                >
                  Pieza {pieza.numero}
                  {pieza.completadoMismoServicio
                    ? ` · ${pieza.servicioCompletado} completada`
                    : pieza.tieneRegistro
                      ? " · con registro odontograma"
                      : ""}
                </option>


              ))}


            </select>

          </div>

          {/* ESTADO */}

          <div className="
            space-y-2
          ">

            <label className="
              text-xs

              font-black

              uppercase

              tracking-[0.12em]

              text-slate-400
            ">

              Estado

            </label>

            <select
              value={form.estado}
              onChange={(e) =>
                handleChange(
                  "estado",
                  e.target.value
                )
              }
              className={inputClass}
            >

              <option>
                Pendiente
              </option>

              <option>
                En progreso
              </option>

              <option>
                Completado
              </option>

              <option>
                Cancelado
              </option>

            </select>

          </div>

          {/* COSTO */}

          <div className="
            space-y-2
          ">

            <label className="
              text-xs

              font-black

              uppercase

              tracking-[0.12em]

              text-slate-400
            ">

              Costo

            </label>

            <input
              type="number"
              value={form.costo}
              onChange={(e) =>
                handleChange(
                  "costo",
                  e.target.value
                )
              }
              placeholder="0"
              className={inputClass}
            />

          </div>

          {/* PAGADO */}

          <div className="
            space-y-2
          ">

            <label className="
              text-xs

              font-black

              uppercase

              tracking-[0.12em]

              text-slate-400
            ">

              Pagado

            </label>

            <input
              type="number"
              value={form.pagado}
              onChange={(e) =>
                handleChange(
                  "pagado",
                  e.target.value
                )
              }
              placeholder="0"
              className={inputClass}
            />

          </div>

          {/* SESIONES */}

          <div className="
            space-y-2
          ">

            <label className="
              text-xs

              font-black

              uppercase

              tracking-[0.12em]

              text-slate-400
            ">

              Sesiones totales

            </label>

            <input
              type="number"
              value={form.sesiones_totales}
              onChange={(e) =>
                handleChange(
                  "sesiones_totales",
                  e.target.value
                )
              }
              className={inputClass}
            />

          </div>

        </div>

        {/* NOTES */}

        <div className="
          relative
          z-10

          space-y-2
        ">

          <label className="
            text-xs

            font-black

            uppercase

            tracking-[0.12em]

            text-slate-400
          ">

            Observaciones

          </label>

          <textarea
            value={form.notas}
            onChange={(e) =>
              handleChange(
                "notas",
                e.target.value
              )
            }
            rows={5}
            placeholder="Paciente presenta sensibilidad en pieza 16..."
            className="
              w-full

              rounded-[28px]

              bg-white

              border
              border-slate-200

              p-5

              text-sm

              text-slate-700

              placeholder:text-slate-400

              resize-none

              focus:outline-none

              focus:ring-4
              focus:ring-sky-500/10

              focus:border-sky-300

              transition-all
              duration-300
            "
          />

        </div>

        {/* FOOTER */}

        <div className="
          relative
          z-10

          flex
          justify-end

          gap-3
        ">

          {/* CANCEL */}

          <button
            onClick={onClose}
            className="
              h-12

              px-5

              rounded-2xl

              bg-white

              border
              border-slate-200

              text-slate-700

              text-sm
              font-bold

              hover:bg-slate-50

              hover:border-slate-300

              transition-all
              duration-300
            "
          >

            Cancelar

          </button>

          {/* SAVE */}

          <button
            onClick={guardarTratamiento}
            disabled={loading}
            className={`
              h-12

              px-6

              rounded-2xl

              text-white

              text-sm
              font-black

              flex
              items-center
              gap-2

              shadow-[0_15px_35px_rgba(7,89,133,0.25)]

              transition-all
              duration-300

              ${loading
                ? `
                  bg-slate-400
                  cursor-not-allowed
                `
                : `
                  bg-gradient-to-r
                  from-sky-700
                  via-sky-800
                  to-sky-900

                  hover:scale-[1.02]

                  hover:shadow-[0_20px_45px_rgba(7,89,133,0.35)]
                `
              }
            `}
          >

            {loading ? (

              <Loader2
                size={16}
                className="
                  animate-spin
                "
              />

            ) : (

              <Save size={16} />

            )}

            {loading
              ? "Guardando..."
              : "Guardar tratamiento"}

          </button>

        </div>

      </div>

    </BaseModal>

  );

}

export default TratamientoModal;