import {
  Moon,
  Sun
} from "lucide-react";

import {
  useTheme
} from "../../context/ThemeContext";

function ThemeToggle() {

  const {
    dark,
    setDark
  } = useTheme();

  return (

    <button
      onClick={() =>
        setDark(!dark)
      }
      className="
        group

        relative
        overflow-hidden

        w-12
        h-12

        rounded-[20px]

        bg-white/70
        dark:bg-slate-900/70

        backdrop-blur-xl

        border
        border-slate-200/70
        dark:border-slate-700/60

        text-slate-700
        dark:text-slate-200

        shadow-[0_10px_30px_rgba(0,0,0,0.05)]

        hover:scale-[1.03]

        active:scale-[0.97]

        transition-all
        duration-300

        flex
        items-center
        justify-center
      "
    >

      <div className="
        absolute
        inset-0

        opacity-0

        bg-gradient-to-br
        from-indigo-500/10
        to-violet-500/10

        group-hover:opacity-100

        transition-all
        duration-300
      " />

      <div className="
        relative
        z-10
      ">

        {dark ? (

          <Sun size={18} />

        ) : (

          <Moon size={18} />

        )}

      </div>

    </button>

  );

}

export default ThemeToggle;