import BaseModal from "./BaseModal";

function ConfirmModal({ mensaje, onConfirm, onCancel }) {
  return (
    <BaseModal onClose={onCancel}>
      <p className="text-sm mb-5 text-center">{mensaje}</p>

      <div className="flex gap-3">
        <button
          onClick={onConfirm}
          className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          ✅ Sí
        </button>

        <button
          onClick={onCancel}
          className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400"
        >
          ❌ No
        </button>
      </div>
    </BaseModal>
  );
}
export default ConfirmModal;