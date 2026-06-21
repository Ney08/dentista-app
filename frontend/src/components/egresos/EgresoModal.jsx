import { useEffect, useState } from "react";

import { formatMoney } from "../../utils/format";

import {
  WalletCards,
  Receipt,
  BadgeDollarSign,
  FileText,
  CreditCard,
  Save,
  X,
  ClipboardList
} from "lucide-react";

function EgresoModal({
  egreso,
  onGuardar,
  onClose
}) {

  /*
  ==========================================
  STATES
  ==========================================
  */

  const [descripcion, setDescripcion] =
    useState("");

  const [categoria, setCategoria] =
    useState("");

  const [monto, setMonto] =
    useState("");

  const [metodoPago, setMetodoPago] =
    useState("");

  const [observacion, setObservacion] =
    useState("");

  const isEdit =
    !!egreso;

  /*
  ==========================================
  EFFECT
  ==========================================
  */

  useEffect(() => {

    if (!egreso) {
      return;
    }

    setDescripcion(
      egreso.descripcion || ""
    );

    setCategoria(
      egreso.categoria || ""
    );

    setMonto(
      egreso.monto || ""
    );

    setMetodoPago(
      egreso.metodo_pago || ""
    );

    setObservacion(
      egreso.observacion || ""
    );

  }, [egreso]);

  /*
  ==========================================
  GUARDAR
  ==========================================
  */

  const guardar = () => {

    if (!descripcion.trim()) {
      return;
    }

    if (!monto) {
      return;
    }

    onGuardar({

      ...(egreso || {}),

      descripcion,

      categoria,

      monto:
        parseFloat(monto),

      metodo_pago:
        metodoPago,

      observacion

    });

  };

  return (

    <div className="
      
    ">

      {/* GLOW */}

      <div className="
        absolute
        -top-20
        -right-20

        w-72
        h-72

        rounded-full

        bg-rose-500/10

        blur-3xl
      " />

      {/* HEADER */}

      <div className="
  relative
  z-10

  text-center

  space-y-3

  shrink-0
">

        <div className="
    mx-auto

    w-20
    h-20

    rounded-[28px]

    
bg-gradient-to-br
from-sky-700
via-sky-800
to-sky-900


    text-white

    flex
    items-center
    justify-center

    shadow-[0_20px_50px_rgba(7,89,133,0.35)]
  ">

          <WalletCards size={34} />

        </div>

        <h2 className="
    text-3xl
    sm:text-4xl

    font-black

    tracking-tight

    text-slate-800
  ">

          {isEdit
            ? "Editar egreso"
            : "Nuevo egreso"}

        </h2>

        <div className="
    w-20
    h-1

    mx-auto

    rounded-full

    
bg-gradient-to-r
from-cyan-500
to-sky-800

  " />

        <p className="
    text-sm
    sm:text-base

    text-slate-500
  ">
          Registra un gasto del negocio
        </p>

      </div>

      {/* FORM */}

      <div className="
        relative
        z-10

        flex
        flex-col

        gap-6
      ">

        {/* INFORMACION */}

        <div className="
  bg-slate-50/70

  border
  border-slate-200/70

  rounded-[30px]

  p-5

  shadow-sm

  space-y-5
">

          {/* HEADER */}

          <div className="
    flex
    items-center

    gap-3
  ">

            <div className="
      w-12
      h-12

      rounded-[18px]

     
bg-gradient-to-br
from-sky-700
via-sky-800
to-sky-900


      flex
      items-center
      justify-center

      text-white
    ">

              <ClipboardList size={20} />

            </div>

            <div>

              <h3 className="
        text-sm

        font-black

        uppercase

        tracking-[0.12em]

        text-slate-700
      ">
                Información básica
              </h3>

              <p className="
        text-xs
        text-slate-400
      ">
                Datos generales del egreso
              </p>

            </div>

          </div>

          {/* DESCRIPCION */}

          <div className="space-y-2">

            {/* <label className="
    text-xs

    font-bold

    text-slate-500

    flex
    items-center
    gap-2
  ">

              <Receipt size={13} />

              Descripción

            </label> */}

            <input
              type="text"
              placeholder="Descripción"

              value={descripcion}

              onChange={(e) =>
                setDescripcion(
                  e.target.value
                )
              }

              className="
      w-full

      h-14

      px-5

      rounded-[22px]

      bg-white

      border
      border-slate-200

      text-slate-700

      shadow-sm

      focus:outline-none

      focus:ring-4
     
focus:ring-sky-500/10

focus:border-sky-300


      transition-all
      duration-300
    "
            />

          </div>
          {/* CATEGORIA */}

          {/* <label className="
    text-xs

    font-bold

    text-slate-500

    flex
    items-center
    gap-2
  ">

            <ClipboardList size={13} />

            Categoría

          </label> */}

          <select
            value={categoria}

            onChange={(e) =>
              setCategoria(
                e.target.value
              )
            }

            className="
              w-full

              h-14

              px-5

              rounded-[22px]

              bg-white

              border
              border-slate-200

              text-slate-700

              shadow-sm

              focus:outline-none

              focus:ring-4
              focus:ring-rose-500/10

              focus:border-rose-300

              transition-all
              duration-300
            "
          >

            <option value="">
              Selecciona categoría
            </option>

            <option value="Materiales">
              Materiales
            </option>

            <option value="Nómina">
              Nómina
            </option>

            <option value="Internet">
              Internet
            </option>

            <option value="Luz">
              Luz
            </option>

            <option value="Publicidad">
              Publicidad
            </option>

            <option value="Transporte">
              Transporte
            </option>

            <option value="Otros">
              Otros
            </option>

          </select>

        </div>

        {/* PAGO */}

        <div className="
  bg-slate-50/70

  border
  border-slate-200/70

  rounded-[30px]

  p-5

  shadow-sm

  space-y-5
">

          {/* HEADER */}

          <div className="
    flex
    items-center

    gap-3
  ">

            <div className="
      w-12
      h-12

      rounded-[18px]

      bg-gradient-to-br
      from-emerald-500
      to-green-500

      flex
      items-center
      justify-center

      text-white
    ">

              <BadgeDollarSign size={20} />

            </div>

            <div>

              <h3 className="
        text-sm

        font-black

        uppercase

        tracking-[0.12em]

        text-slate-700
      ">
                Pago
              </h3>

              <p className="
        text-xs
        text-slate-400
      ">
                Información financiera
              </p>

            </div>

          </div>

          {/* GRID */}

          <div className="
            grid
            grid-cols-1
            sm:grid-cols-2

            gap-4
          ">

            {/* MONTO */}

            <div className="space-y-2">

              {/* <label className="
    text-xs

    font-bold

    text-slate-500

    flex
    items-center
    gap-2
  ">

                <WalletCards size={13} />

                Monto

              </label> */}

              <input
                type="number"
                placeholder="Monto"

                value={monto}

                onChange={(e) =>
                  setMonto(
                    e.target.value
                  )
                }

                className="
      w-full

      h-14

      px-5

      rounded-[22px]

      bg-white

      border
      border-slate-200

      text-slate-700

      shadow-sm

      focus:outline-none

      focus:ring-4
      focus:ring-emerald-500/10

      focus:border-emerald-300

      transition-all
      duration-300
    "
              />

            </div>

            {/* METODO */}

            <div className="space-y-2">

              {/* <label className="
    text-xs

    font-bold

    text-slate-500

    flex
    items-center
    gap-2
  ">

                <CreditCard size={13} />

                Método de pago

              </label> */}

              <select
                value={metodoPago}

                onChange={(e) =>
                  setMetodoPago(
                    e.target.value
                  )
                }

                className="
      w-full

      h-14

      px-5

      rounded-[22px]

      bg-white

      border
      border-slate-200

      text-slate-700

      shadow-sm

      focus:outline-none

      focus:ring-4
      focus:ring-emerald-500/10

      focus:border-emerald-300

      transition-all
      duration-300
    "
              >
            

                <option value="">
                  Selecciona método
                </option>

                <option value="Efectivo">
                  Efectivo
                </option>

                <option value="Transferencia">
                  Transferencia
                </option>

                <option value="Tarjeta">
                  Tarjeta
                </option>

              </select>
                
            </div>
                 </div>
            {/* KPI */}

            <div className="

bg-gradient-to-r
from-rose-500
via-pink-500
to-rose-600


  rounded-[28px]

  p-6

  text-white

  shadow-[0_20px_45px_rgba(244,63,94,0.25)]

  text-center
">

              <div className="
    flex
    items-center
    justify-center
    gap-2
  ">

                <BadgeDollarSign
                  size={16}
                  className="text-white/80"
                />

                <p className="
      text-xs

      uppercase

      tracking-[0.14em]

      font-black

      text-white/70
    ">
                  Total egreso
                </p>

              </div>

              <p className="
    mt-3

    text-4xl

    tracking-tight

    font-black
  ">

                RD$
                {" "}
                {formatMoney(monto || 0)}

              </p>

            </div>


          </div>

          {/* OBSERVACION */}

          <div className="
  bg-slate-50/70

  border
  border-slate-200/70

  rounded-[30px]

  p-5

  shadow-sm

  space-y-5
">

            {/* HEADER */}

            <div className="
    flex
    items-center

    gap-3
  ">

              <div className="
      w-12
      h-12

      rounded-[18px]

     
bg-gradient-to-br
from-sky-700
via-sky-800
to-sky-900


      flex
      items-center
      justify-center

      text-white
    ">

                <FileText size={20} />

              </div>

              <div>

                <h3 className="
        text-sm

        font-black

        uppercase

        tracking-[0.12em]

        text-slate-700
      ">
                  Observación
                </h3>

                <p className="
        text-xs
        text-slate-400
      ">
                  Información adicional
                </p>

              </div>

            </div>

            {/* TEXTAREA */}

            <textarea
              rows={5}

              placeholder="Observación adicional..."

              value={observacion}

              onChange={(e) =>
                setObservacion(
                  e.target.value
                )
              }

              className="
              w-full

              rounded-[24px]

              bg-white

              border
              border-slate-200

              px-5
              py-4

              text-slate-700

              resize-none

              shadow-sm

              focus:outline-none

              focus:ring-4
             
focus:ring-sky-500/10

focus:border-sky-300


              transition-all
              duration-300
            "
            />

          </div>

          {/* ACTIONS */}

          <div className="
  sticky
  bottom-0

  bg-white/90
  backdrop-blur-xl

  pt-2

  flex
  flex-col
  sm:flex-row

  gap-3
">

            {/* CANCEL */}

            <button
              onClick={onClose}
              className="
      flex-1

      h-14

      rounded-[24px]

      bg-slate-100

      hover:bg-slate-200

      text-slate-700

      font-semibold

      transition-all
      duration-300

      active:scale-[0.98]

      flex
      items-center
      justify-center
      gap-2
    "
            >

              <X size={18} />

              Cancelar

            </button>

            {/* SAVE */}

            <button
              onClick={guardar}
              className="
      flex-1

      h-14

      rounded-[24px]

      
bg-gradient-to-r
from-sky-700
via-sky-800
to-sky-900


      text-white

      text-sm
      sm:text-base

      font-black

      shadow-[0_15px_35px_rgba(7,89,133,0.28)]

      hover:scale-[1.01]

      hover:shadow-[0_20px_45px_rgba(7,89,133,0.35)]
      active:scale-[0.98]

      transition-all
      duration-300

      flex
      items-center
      justify-center
      gap-2
    "
            >

              <Save size={18} />

              {isEdit
                ? "Guardar cambios"
                : "Crear egreso"}

            </button>

          </div>

        </div>

      </div>

      );

}

      export default EgresoModal;