import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { useAuth } from "../hooks/useAuth";

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

  const [mostrarPassword,
    setMostrarPassword] =
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

  const [mostrarRecovery,
    setMostrarRecovery] =
    useState(false);

  const [claveSeguridad,
    setClaveSeguridad] =
    useState("");

  const [nuevaPassword,
    setNuevaPassword] =
    useState("");

  const [claveValida,
    setClaveValida] =
    useState(false);

  const CLAVE_SEGURIDAD =
    "1234";

  /*
  ==========================================
  EFFECTS
  ==========================================
  */

  useEffect(() => {

    if (!claveSeguridad) {

      setClaveValida(false);

      return;

    }

    setClaveValida(
      claveSeguridad ===
      CLAVE_SEGURIDAD
    );

  }, [claveSeguridad]);

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

      toast.error(
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

      toast.success(
        `Bienvenido ${username} ✅`
      );

    } catch (error) {

      console.error(error);

      setErrorShake(true);

      setTimeout(() => {

        setErrorShake(false);

      }, 500);

      toast.error(
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

        toast.error(
          "Escribe el usuario ⚠️"
        );

        return;

      }

      if (!claveValida) {

        toast.error(
          "Clave inválida ❌"
        );

        return;

      }

      if (
        nuevaPassword.length < 4
      ) {

        toast.error(
          "Mínimo 4 caracteres ⚠️"
        );

        return;

      }

      setLoading(true);

      try {

        await resetPassword(
          username,
          nuevaPassword
        );

        toast.success(
          "Contraseña cambiada ✅"
        );

        setNuevaPassword("");

        setClaveSeguridad("");

        cerrarModal();

      } catch (error) {

        console.error(error);

        toast.error(
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

    setClaveValida(false);

  };

  return (

    <>

      {/* ✅ LOGIN */}

      <div className={`
        min-h-screen

        relative
        overflow-hidden

        flex
        items-center
        justify-center

        px-4

        bg-gradient-to-br
        from-indigo-100
        via-slate-100
        to-violet-200

        ${errorShake
          ? "shake"
          : ""}
      `}>

        {/* ✅ BG GLOW */}

        <div className="
          absolute
          top-[-120px]
          left-[-120px]

          w-[350px]
          h-[350px]

          rounded-full

          bg-indigo-500/20

          blur-3xl
        " />

        <div className="
          absolute
          bottom-[-120px]
          right-[-120px]

          w-[350px]
          h-[350px]

          rounded-full

          bg-violet-500/20

          blur-3xl
        " />

        {/* ✅ CARD */}

        <form
          onSubmit={login}
          className="
            relative
            overflow-hidden

            w-full
            max-w-md

            bg-white/90
            backdrop-blur-2xl

            border
            border-white/40

            rounded-[36px]

            shadow-[0_25px_80px_rgba(0,0,0,0.12)]

            p-7
            sm:p-8

            space-y-6
          "
        >

          {/* ✅ GLOW */}

          <div className="
            absolute
            -top-20
            -right-20

            w-72
            h-72

            rounded-full

            bg-indigo-500/10

            blur-3xl
          " />

          {/* ✅ HEADER */}

          <div className="
            relative
            z-10

            text-center

            space-y-4
          ">

            {/* ICON */}

            <div className="
              w-24
              h-24

              mx-auto

              rounded-[30px]

              bg-gradient-to-br
              from-indigo-500
              via-purple-500
              to-violet-500

              flex
              items-center
              justify-center

              text-6xl

              text-white

              shadow-[0_20px_50px_rgba(99,102,241,0.35)]
            ">
              🔐
            </div>

            {/* TITLE */}

            <div className="
              space-y-3
            ">

              <h1 className="
                text-4xl

                font-black

                tracking-tight

                text-slate-800
              ">
                Login
              </h1>

              <div className="
                w-20
                h-1

                mx-auto

                rounded-full

                bg-gradient-to-r
                from-indigo-500
                to-violet-500
              " />

              <p className="
                text-sm
                sm:text-base

                text-gray-500
              ">
                Accede a tu sistema
              </p>

            </div>

          </div>

          {/* ✅ FORM */}

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

                text-gray-400

                font-black
              ">
                Usuario
              </p>

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

                  px-5

                  rounded-[22px]

                  bg-white

                  border
                  border-slate-200

                  hover:border-indigo-300

                  text-slate-700

                  shadow-sm

                  focus:outline-none

                  focus:ring-4
                  focus:ring-indigo-500/10

                  focus:border-indigo-300

                  transition-all
                  duration-300
                "
              />

            </div>

            {/* PASSWORD */}

            <div className="
              space-y-2
            ">

              <p className="
                text-xs

                uppercase

                tracking-[0.12em]

                text-gray-400

                font-black
              ">
                Contraseña
              </p>

              <div className="
                relative
              ">

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

                    px-5
                    pr-14

                    rounded-[22px]

                    bg-white

                    border
                    border-slate-200

                    hover:border-indigo-300

                    text-slate-700

                    shadow-sm

                    focus:outline-none

                    focus:ring-4
                    focus:ring-indigo-500/10

                    focus:border-indigo-300

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

                    text-lg

                    text-slate-400

                    hover:text-indigo-500

                    transition-all
                    duration-300
                  "
                >
                  {mostrarPassword
                    ? "🙈"
                    : "👁️"}
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

                    accent-indigo-500
                  "
                />

                Recordarme

              </label>

              {/* FORGOT */}

              <button
                type="button"

                onClick={() => {

                  setMostrarRecovery(true);

                  toast(
                    "Ingresa tu clave 🔐"
                  );

                }}

                className="
                  text-indigo-500

                  hover:text-indigo-600

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

                ${loading
                  ? "bg-gray-400"
                  : `
                    bg-gradient-to-r
                    from-indigo-500
                    via-purple-500
                    to-violet-500

                    shadow-[0_15px_35px_rgba(99,102,241,0.28)]

                    hover:scale-[1.01]

                    hover:shadow-[0_20px_45px_rgba(99,102,241,0.35)]
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

      {/* ✅ RECOVERY MODAL */}

      {mostrarRecovery && (

        <div
          onClick={cerrarModal}
          className="
            fixed
            inset-0
            z-50

            flex
            items-end

            justify-center

            bg-black/50
            backdrop-blur-md
          "
        >

          {/* ✅ MODAL */}

          <div
            onClick={(e) =>
              e.stopPropagation()
            }

            className="
              w-full

              md:max-w-2xl

              p-0
              md:p-4

              animate-[slideUp_.55s_cubic-bezier(0.22,1,0.36,1)]
            "
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

              p-7 sm:p-8

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

                bg-indigo-500/10

                blur-3xl
              " />

              {/* HEADER */}

              <div className="
                relative
                z-10

                text-center

                space-y-3
              ">

                <div className="
                  w-24
                  h-24

                  mx-auto

                  rounded-[30px]

                  bg-gradient-to-br
                  from-indigo-500
                  via-purple-500
                  to-violet-500

                  flex
                  items-center
                  justify-center

                  text-5xl

                  text-white

                  shadow-[0_20px_50px_rgba(99,102,241,0.35)]
                ">
                  🔐
                </div>

                <h2 className="
                  text-4xl

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
                  from-indigo-500
                  to-violet-500
                " />

                <p className="
                  text-sm
                  text-gray-500
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

                  className={`
                    w-full

                    h-14

                    px-5

                    rounded-[22px]

                    bg-white

                    border

                    text-slate-700

                    shadow-sm

                    focus:outline-none

                    transition-all
                    duration-300

                    ${claveSeguridad &&
                      !claveValida
                        ? `
                          border-red-400

                          focus:ring-4
                          focus:ring-red-500/10
                        `
                        : `
                          border-slate-200

                          hover:border-indigo-300

                          focus:ring-4
                          focus:ring-indigo-500/10

                          focus:border-indigo-300
                        `
                    }
                  `}
                />

                {/* ERROR */}

                {claveSeguridad &&
                  !claveValida && (

                  <p className="
                    text-sm

                    text-red-500

                    font-medium
                  ">
                    Clave inválida ❌
                  </p>

                )}

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

                    hover:border-indigo-300

                    text-slate-700

                    shadow-sm

                    focus:outline-none

                    focus:ring-4
                    focus:ring-indigo-500/10

                    focus:border-indigo-300

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

                  {/* SAVE */}

                  <button
                    onClick={
                      recuperarPassword
                    }

                    disabled={
                      !claveValida ||
                      nuevaPassword.length < 4 ||
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

                      ${claveValida &&
                        nuevaPassword.length >= 4
                          ? `
                            bg-gradient-to-r
                            from-emerald-500
                            to-green-500

                            shadow-[0_15px_35px_rgba(16,185,129,0.28)]

                            hover:scale-[1.01]
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

                </div>

              </div>

            </div>

          </div>

        </div>

      )}

    </>

  );

}

export default Login;