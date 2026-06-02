function ConfirmModal({ mensaje, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4">

      {/* ✅ CONTENEDOR */}
      <div className="
        bg-white rounded-xl shadow-lg
        w-full
        max-w-sm
        sm:max-w-md
        p-5 md:p-6
        text-center
        bg-black/40 backdrop-blur-md
        transition-all duration-200 ease-out
      ">

        {/* ✅ MENSAJE */}
        <p className="text-sm md:text-base mb-5">
          {mensaje}
        </p>

        {/* ✅ BOTONES */}
        <div className="flex gap-3">

          <button
            onClick={onConfirm}
            className="
              flex-1
              bg-red-500 text-white
              px-4 py-2
              rounded text-sm md:text-base
              hover:bg-red-600
            "
          >
            ✅ Sí
          </button>

          <button
            onClick={onCancel}
            className="
              flex-1
              bg-gray-300 text-gray-700
              px-4 py-2
              rounded text-sm md:text-base
              hover:bg-gray-400
            "
          >
            ❌ No
          </button>

        </div>

      </div>

    </div>
  );
}

export default ConfirmModal;