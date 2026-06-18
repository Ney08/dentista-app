import {
  useEffect,
  useState
} from "react";

import {
  createPortal
} from "react-dom";

function BaseModal({
  children,
  onClose,
  maxWidth = "max-w-3xl"
}) {

  /*
  ==========================================
  STATES
  ==========================================
  */

  const [cerrando, setCerrando] =
    useState(false);

  const [visible, setVisible] =
    useState(false);

  /*
  ==========================================
  ENTRADA
  ==========================================
  */

  useEffect(() => {

    const frame =
      requestAnimationFrame(() => {

        setVisible(true);

      });

    return () =>
      cancelAnimationFrame(frame);

  }, []);

  /*
  ==========================================
  CLOSE
  ==========================================
  */

  const handleClose = () => {

    if (cerrando) return;

    setCerrando(true);

    setVisible(false);

    onClose?.();

  };


  /*
  ==========================================
  ESC + BODY LOCK
  ==========================================
  */

  useEffect(() => {

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const handleEsc = (e) => {

      if (
        e.key === "Escape"
      ) {

        handleClose();

      }

    };

    window.addEventListener(
      "keydown",
      handleEsc
    );

    return () => {

      document.body.style.overflow =
        originalOverflow;

      window.removeEventListener(
        "keydown",
        handleEsc
      );

    };

  }, []);

  /*
  ==========================================
  MODAL
  ==========================================
  */

  return createPortal(

    <div
      onMouseDown={(e) => {

        if (
          e.target === e.currentTarget
        ) {

          handleClose();

        }

      }}
      className={`
        fixed
        inset-0

        z-[99999]

        flex
        items-center
        justify-center

        p-0
        md:p-6

        bg-slate-950/45

        backdrop-blur-md

        transition-all
        duration-300
        ease-out

        
${visible
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
        }

      `}
    >

      {/* OVERLAY */}

      <div className="
        absolute
        inset-0
      " />

      {/* MODAL */}


      <div
        onMouseDown={(e) =>
          e.stopPropagation()
        }

        className={`
          relative

          w-full

          ${maxWidth}

          max-h-[92vh]

          overflow-y-auto
          overflow-x-hidden

          rounded-t-[34px]
          md:rounded-[36px]

          bg-white
          dark:bg-slate-900

          backdrop-blur-xl

          border
          border-slate-200/70
          dark:border-slate-800

          shadow-[0_20px_60px_rgba(15,23,42,0.16)]

          

          transition-all
          duration-300
          ease-out

          ${visible
            ? `
              translate-y-0
              md:scale-100
              opacity-100
            `
            : `
              translate-y-full
              md:scale-95
              opacity-0
            `
          }
        `}
      >

        {/* AMBIENT GLOW */}

        <div className="
          absolute
          -top-24
          -right-24

          w-72
          h-72

          rounded-full

          bg-indigo-500/10

          blur-3xl

          pointer-events-none
        " />

        {/* CONTENT */}

        <div className="
          relative
          z-10

          p-5
          md:p-4
        ">

          {children}

        </div>

      </div>

    </div>,

    document.body

  );

}

export default BaseModal;