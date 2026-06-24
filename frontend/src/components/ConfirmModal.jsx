import BaseModal from "./BaseModal";

import {
  TriangleAlert,
  X,
  Check,
  Clock,
  CircleCheck
} from "lucide-react";

function ConfirmModal({
  mensaje,
  onConfirm,
  onCancel
}) {

  return (

    <BaseModal onClose={onCancel}>

      <div className="
        relative
        overflow-hidden

        bg-white/95
        backdrop-blur-2xl

        rounded-[34px]

        border
        border-white/40

        shadow-[0_25px_80px_rgba(0,0,0,0.15)]

        p-6
        sm:p-7

        w-full

        space-y-6
      ">

        {/*  GLOW */}

        <div className="
          absolute
          -top-16
          -right-16

          w-52
          h-52

          rounded-full

          bg-rose-500/10

          blur-3xl
        " />

        {/*  CONTENT */}

        <div className="
          relative
          z-10

          text-center

          space-y-5
        ">

          {/*  ICON */}

          <div className="
            w-24
            h-24

            mx-auto

            rounded-[30px]

            bg-gradient-to-br
            from-rose-500
            via-pink-500
            to-red-500

            flex
            items-center
            justify-center

            text-5xl

            text-white

            shadow-[0_20px_50px_rgba(244,63,94,0.35)]
          ">
            
<TriangleAlert
  size={50}
  strokeWidth={3}
  className="shrink-0 text-amber-300"
/>

          </div>

          {/*  MENSAJE */}

          <div className="
            space-y-3
          ">

            <h2 className="
              text-2xl
              sm:text-3xl

              font-black

              tracking-tight

              text-slate-800
            ">
              Confirmación
            </h2>

            <div className="
              w-20
              h-1

              mx-auto

              rounded-full

              bg-gradient-to-r
              from-rose-500
              to-pink-500
            " />

            <p className="
              text-sm
              sm:text-base

              text-slate-500

              leading-relaxed

              max-w-md

              mx-auto
            ">
              {mensaje}
            </p>

          </div>

        </div>

        {/*  ACTIONS */}

        <div className="
          relative
          z-10

          flex
          flex-col
          sm:flex-row

          gap-3
        ">
          {/*  CANCEL */}

          <button
            onClick={onCancel}
            className="
              flex-1

              h-14

              rounded-[24px]

              bg-slate-100/80
              backdrop-blur-xl

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
            <X
                size={22}
                strokeWidth={5}
                className="shrink-0 text-rose-400"
              />
             Cancelar
          </button>

          {/* CONFIRM */}

          <button
            onClick={onConfirm}
            className="
              flex-1

              h-14

              rounded-[24px]

              bg-gradient-to-r
              from-rose-500
              via-pink-500
              to-red-500

              text-white

              text-sm
              sm:text-base

              font-black

              shadow-[0_15px_35px_rgba(244,63,94,0.28)]

              hover:scale-[1.01]

              hover:shadow-[0_20px_45px_rgba(244,63,94,0.35)]

              active:scale-[0.98]
              
flex
    items-center
    justify-center

              transition-all
              duration-300
              gap-2
            "
          >
            
          <Check
                size={22}
                strokeWidth={5}
                className="shrink-0"
              />

             Sí, continuar
          </button>


        </div>

      </div>

    </BaseModal>

  );

}

export default ConfirmModal;