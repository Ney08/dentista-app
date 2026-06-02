import { useEffect, useState } from "react";

function BaseModal({ children, onClose }) {
  const [cerrando, setCerrando] = useState(false);

  const handleClose = () => {
    setCerrando(true);
    setTimeout(() => onClose(), 200);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  return (
    <div
      onClick={handleClose}
      className={`
        fixed inset-0 flex justify-center items-center px-4
        bg-black/40 backdrop-blur-sm
        transition-opacity duration-200
        ${cerrando ? "opacity-0" : "opacity-100"}
      `}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          bg-white rounded-xl shadow-2xl
          w-full max-w-lg
          p-6

          transform transition-all duration-200 ease-out
          ${
            cerrando
              ? "scale-90 opacity-0 translate-y-4"
              : "scale-100 opacity-100 translate-y-0"
          }
        `}
      >
        {children}
      </div>
    </div>
  );
}

export default BaseModal;