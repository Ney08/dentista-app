import { useState, useEffect } from "react";


import { useAuth } from "../hooks/useAuth";

import {
  showSuccess,
  showError,
  showInfo
} from "../components/ui/ToastStyles";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  User2
} from "lucide-react";

import logoIcon from "../assets/dentalapp_icon_sky_128x128.png";

function Login() {

  const {
    login: loginRequest,
    resetPassword
  } = useAuth();

  /*
  ==========================================
  STATES
  ==========================================
  */

  const [errorShake, setErrorShake] =
    useState(false);

  const [username, setUsername] =
    useState(
      localStorage.getItem("lastUser") || ""
    );

  const [password, setPassword] =
    useState("");

  const [mostrarPassword, setMostrarPassword] =
    useState(false);

  const [recordar, setRecordar] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  /*
  ==========================================
  RECOVERY
  ==========================================
  */

  const [mostrarRecovery, setMostrarRecovery] =
    useState(false);

  const [claveSeguridad, setClaveSeguridad] =
    useState("");

  const [nuevaPassword, setNuevaPassword] =
    useState("");

  // const [claveValida, setClaveValida] =
  //   useState(false);

  // const CLAVE_SEGURIDAD =
  //   "1234";

  /*
  ==========================================
  EFFECTS
  ==========================================
  */

  // useEffect(() => {

  //   if (!claveSeguridad) {

  //     setClaveValida(false);

  //     return;

  //   }

  //   setClaveValida(
  //     claveSeguridad ===
  //     CLAVE_SEGURIDAD
  //   );

  // }, [claveSeguridad]);

  useEffect(() => {

    const handleEsc = (e) => {

      if (e.key === "Escape") {

        cerrarModal();

      }

    };

    window.addEventListener(
      "keydown",
      handleEsc
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleEsc
      );

  }, []);

  /*
  ==========================================
  LOGIN
  ==========================================
  */

  const login = async (e) => {

    e.preventDefault();

    if (
      !username.trim() ||
      !password.trim()
    ) {

      setErrorShake(true);

      setTimeout(() => {

        setErrorShake(false);

      }, 500);

      showError(
        "Completa los campos ❌"
      );

      return;

    }

    setLoading(true);

    try {

      const token =
        await loginRequest(
          username,
          password
        );

      if (recordar) {

        localStorage.setItem(
          "token",
          token
        );

      } else {

        sessionStorage.setItem(
          "token",
          token
        );

      }

      localStorage.setItem(
        "lastUser",
        username
      );

      showSuccess(
        `Bienvenido ${username} ✅`
      );

    } catch (error) {

      console.error(error);

      setErrorShake(true);

      setTimeout(() => {

        setErrorShake(false);

      }, 500);

      showError(
        error.message
      );

      setPassword("");

    } finally {

      setLoading(false);

    }

  };

  /*
  ==========================================
  RECOVERY
  ==========================================
  */

  const recuperarPassword =
    async () => {

      if (!username.trim()) {

        showError(
          "Escribe el usuario ⚠️"
        );

        return;

      }

      if (!claveSeguridad.trim()) {

        showError(
          "Ingresa la clave de seguridad 🔐"
        );

        return;

      }

      if (
        nuevaPassword.trim().length < 8
      ) {

        showError(
          "Mínimo 8 caracteres ⚠️"
        );

        return;

      }

      setLoading(true);

      try {

        await resetPassword(
          username,
          nuevaPassword,
          claveSeguridad
        );

        showSuccess(
          "Contraseña cambiada ✅"
        );

        setNuevaPassword("");

        setClaveSeguridad("");

        cerrarModal();

      } catch (error) {

        console.error(error);

        showError(
          error.message
        );

      } finally {

        setLoading(false);

      }

    };

  /*
  ==========================================
  CLOSE MODAL
  ==========================================
  */

  const cerrarModal = () => {

    setMostrarRecovery(false);

    setClaveSeguridad("");

    setNuevaPassword("");

    // setClaveValida(false);

  };

  return (

    <>

      {/* LOGIN */}

      <div className={`
        min-h-screen

        relative
        overflow-hidden

        flex
        items-center
        justify-center

        px-4

        bg-gradient-to-br
        from-sky-50
        via-slate-50
        to-cyan-100

        ${errorShake
          ? "shake"
          : ""}
      `}>

        {/* BACKGROUND GLOWS */}

        <div className="
          absolute
          top-[-140px]
          left-[-120px]

          w-[420px]
          h-[420px]

          rounded-full

          bg-sky-500/20

          blur-3xl
        " />

        <div className="
          absolute
          bottom-[-140px]
          right-[-120px]

          w-[420px]
          h-[420px]

          rounded-full

          bg-cyan-500/20

          blur-3xl
        " />

        <div className="
          absolute
          top-1/2
          left-1/2

          w-[520px]
          h-[520px]

          -translate-x-1/2
          -translate-y-1/2

          rounded-full

          bg-white/60

          blur-3xl
        " />

        {/* CARD */}

        <form
          onSubmit={login}
          className="
            relative
            overflow-hidden

            
w-full
max-w-[520px]


            bg-white/90
            backdrop-blur-2xl

            border
            border-white/60

            rounded-[36px]

            shadow-[0_30px_90px_rgba(15,23,42,0.14)]

           
p-8
sm:p-10


            space-y-6
          "
        >

          {/* CARD GLOW */}

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

  text-center

  space-y-5
">

            {/* LOGO */}

            <div className="
    mx-auto

    inline-flex
    items-center
    justify-center

    gap-4

    mb-1
  ">


              <img
                src={logoIcon}
                alt="DentalApp"
                className="
    w-24
    h-24

    rounded-[26px]

    shadow-[0_18px_45px_rgba(7,89,133,0.25)]
  "
              />


              <div className="
      text-left
    ">

                <h2 className="
        
text-3xl
  sm:text-4xl


        font-black

        leading-none

        text-slate-800
      ">
                  DentalApp
                </h2>

                <p className="
        mt-1

        text-xs
        sm:text-sm

        font-semibold

        text-slate-500
      ">
                  Gestión clínica inteligente
                </p>

              </div>

            </div>

            <div className="
    
space-y-4
  mt-2

  ">

              <h1 className="
      text-3xl
      sm:text-4xl

      font-black

      tracking-tight

      text-slate-800
    ">
                Acceso seguro
              </h1>

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
                Ingresa a tu sistema clínico
              </p>

            </div>

          </div>

          {/* FORM */}

          <div className="
            relative
            z-10

            space-y-5
          ">

            {/* USER */}

            <div className="
              space-y-2
            ">

              <p className="
                text-xs

                uppercase

                tracking-[0.12em]

                text-slate-400

                font-black
              ">
                Usuario
              </p>

              <div className="
                relative
              ">

                <User2
                  size={17}
                  className="
                    absolute
                    left-4
                    top-1/2

                    -translate-y-1/2

                    text-slate-400
                  "
                />

                <input
                  placeholder="Usuario"

                  value={username}

                  onChange={(e) =>
                    setUsername(
                      e.target.value
                    )
                  }

                  className="
                    w-full

                    h-14

                    pl-12
                    pr-5

                    rounded-[22px]

                    bg-white

                    border
                    border-slate-200

                    hover:border-sky-300

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

            </div>

            {/* PASSWORD */}

            <div className="
              space-y-2
            ">

              <p className="
                text-xs

                uppercase

                tracking-[0.12em]

                text-slate-400

                font-black
              ">
                Contraseña
              </p>

              <div className="
                relative
              ">

                <LockKeyhole
                  size={17}
                  className="
                    absolute
                    left-4
                    top-1/2

                    -translate-y-1/2

                    text-slate-400
                  "
                />

                <input
                  type={
                    mostrarPassword
                      ? "text"
                      : "password"
                  }

                  placeholder="Contraseña"

                  value={password}

                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }

                  className="
                    w-full

                    h-14

                    pl-12
                    pr-14

                    rounded-[22px]

                    bg-white

                    border
                    border-slate-200

                    hover:border-sky-300

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

                {/* EYE */}

                <button
                  type="button"

                  onClick={() =>
                    setMostrarPassword(
                      !mostrarPassword
                    )
                  }

                  className="
                    absolute
                    right-4
                    top-1/2

                    -translate-y-1/2

                    text-slate-400

                    hover:text-sky-700

                    transition-all
                    duration-300
                  "
                >
                  {mostrarPassword
                    ? <EyeOff size={18} />
                    : <Eye size={18} />}
                </button>

              </div>

            </div>

            {/* OPTIONS */}

            <div className="
              flex
              items-center
              justify-between

              gap-3

              text-sm
            ">

              {/* CHECK */}

              <label className="
                flex
                items-center

                gap-2

                text-slate-600

                font-medium
              ">

                <input
                  type="checkbox"

                  checked={recordar}

                  onChange={() =>
                    setRecordar(
                      !recordar
                    )
                  }

                  className="
                    w-4
                    h-4

                    accent-sky-700
                  "
                />

                Recordarme

              </label>

              {/* FORGOT */}

              <button
                type="button"

                onClick={() => {

                  setMostrarRecovery(true);

                  showInfo(
                    "Ingresa tu clave 🔐"
                  );

                }}

                className="
                  text-sky-700

                  hover:text-sky-900

                  font-semibold

                  transition-all
                  duration-300
                "
              >
                ¿Olvidaste contraseña?
              </button>

            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"

              disabled={loading}

              className={`
                w-full

                h-14

                rounded-[24px]

                text-white

                text-base

                font-black

                transition-all
                duration-300

                active:scale-[0.98]

                flex
                items-center
                justify-center
                gap-2

                ${loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : `
                    bg-gradient-to-r
                    from-sky-700
                    via-sky-800
                    to-sky-900

                    shadow-[0_15px_35px_rgba(7,89,133,0.28)]

                    hover:scale-[1.01]

                    hover:shadow-[0_20px_45px_rgba(7,89,133,0.35)]
                  `
                }
              `}
            >

              {loading
                ? "Entrando..."
                : "Entrar"}

            </button>

          </div>

        </form>

      </div>

      {/* RECOVERY MODAL */}

      <div
        onClick={cerrarModal}
        className={`
          fixed
          inset-0
          z-50

          flex
          items-end
          md:items-center

          justify-center

          bg-slate-950/50
          backdrop-blur-sm

          transition-all
          duration-300

          px-4

          ${mostrarRecovery
            ? "opacity-100 visible"
            : "opacity-0 invisible"
          }
        `}
      >

        {/* MODAL */}

        <div
          onClick={(e) =>
            e.stopPropagation()
          }

          className={`
            w-full

            md:max-w-2xl

            p-0
            md:p-4

            transform
            transition-all
            duration-300

            ${mostrarRecovery
              ? "translate-y-0 md:scale-100 opacity-100"
              : "translate-y-full md:scale-95 opacity-0"
            }
          `}
        >

          <div className="
            relative
            overflow-hidden

            bg-white/95
            backdrop-blur-2xl

            rounded-t-[36px]
            md:rounded-[36px]

            border-0
            md:border

            border-white/40

            shadow-[0_25px_80px_rgba(0,0,0,0.15)]

            p-7
            sm:p-8

            space-y-6
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

              text-center

              space-y-4
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

                flex
                items-center
                justify-center

                text-white

                shadow-[0_20px_50px_rgba(7,89,133,0.35)]
              ">
                <ShieldCheck size={34} />
              </div>

              <h2 className="
                text-3xl
                sm:text-4xl

                font-black

                tracking-tight

                text-slate-800
              ">
                Recuperar contraseña
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
                text-slate-500
              ">
                Usuario:
                {" "}
                <span className="
                  font-bold
                  text-slate-700
                ">
                  {username ||
                    "No definido"}
                </span>
              </p>

            </div>

            {/* FORM */}

            <div className="
              relative
              z-10

              space-y-5
            ">

              {/* CLAVE */}

              <input
                placeholder="Clave de seguridad"

                value={claveSeguridad}

                onChange={(e) =>
                  setClaveSeguridad(
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

    hover:border-sky-300

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

              {/* ERROR */}

              {/* {claveSeguridad &&
                !claveValida && (

                  <p className="
                    text-sm

                    text-red-500

                    font-medium
                  ">
                    Clave inválida ❌
                  </p>

                )} */}

              {/* PASSWORD */}

              <input
                type="password"

                placeholder="Nueva contraseña"

                value={nuevaPassword}

                onChange={(e) =>
                  setNuevaPassword(
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

                  hover:border-sky-300

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

              {/* BUTTONS */}

              <div className="
                flex
                flex-col
                sm:flex-row

                gap-3
              ">

                {/* CANCEL */}

                <button
                  onClick={cerrarModal}

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
                  "
                >
                  Cancelar
                </button>

                {/* SAVE */}

                <button
                  onClick={
                    recuperarPassword
                  }

                  disabled={
                    !claveSeguridad.trim() ||
                    nuevaPassword.trim().length < 8 ||
                    loading
                  }

                  className={`
    flex-1

    h-14

    rounded-[24px]

    text-white

    font-black

    transition-all
    duration-300

    active:scale-[0.98]

    ${claveSeguridad.trim() &&
                      nuevaPassword.trim().length >= 8 &&
                      !loading

                      ? `
        bg-gradient-to-r
        from-emerald-500
        via-green-500
        to-emerald-600

        shadow-[0_15px_35px_rgba(16,185,129,0.28)]

        hover:scale-[1.01]

        hover:shadow-[0_20px_45px_rgba(16,185,129,0.35)]
      `
                      : `
        bg-gray-400

        cursor-not-allowed
      `
                    }
  `}
                >

                  {loading
                    ? "Guardando..."
                    : "Guardar"}

                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </>

  );

}

export default Login;