import { useEffect, useState } from "react";

function BaseModal({
  children,
  onClose,
  maxWidth = "max-w-3xl"
}) {

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

    setTimeout(() => {

      onClose();

    }, 300);

  };

  /*
  ==========================================
  ESC + BODY LOCK
  ==========================================
  */

  useEffect(() => {

    document.body.style.overflow =
      "hidden";

    const handleEsc = (e) => {

      if (e.key === "Escape") {

        handleClose();

      }

    };

    window.addEventListener(
      "keydown",
      handleEsc
    );

    return () => {

      document.body.style.overflow =
        "auto";

      window.removeEventListener(
        "keydown",
        handleEsc
      );

    };

  }, []);

  return (

  <div
    onClick={handleClose}
    className={`
      fixed
      inset-0
      z-50

      flex
      items-end
      md:items-center

      justify-center

      p-0
      md:p-6

      bg-slate-950/45

      backdrop-blur-md

      transition-all
      duration-300
      ease-out

      ${visible
        ? "opacity-100 visible"
        : "opacity-0 invisible"
      }
    `}
  >

    <div
  onClick={(e) =>
    e.stopPropagation()
  }
  className={`
    relative

    w-full
    h-full

    md:h-auto
    md:${maxWidth}

    overflow-hidden

    rounded-t-[34px]
    md:rounded-[36px]

    bg-white
    backdrop-blur-xl

    border
    border-slate-200/70

    shadow-[0_20px_60px_rgba(15,23,42,0.16)]

    transform

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
        md:p-7
      ">

        {children}

      </div>

    </div>

  </div>

);


}

export default BaseModal;