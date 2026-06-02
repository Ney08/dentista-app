function Paginacion({
  pagina,
  totalPaginas,
  onChange
}) {

  if (totalPaginas <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 flex-wrap">

      {/* ⬅️ ANTERIOR */}
      <button
        disabled={pagina === 1}
        onClick={() => onChange(pagina - 1)}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        ◀
      </button>

      {/* NÚMEROS */}
      {Array.from({ length: totalPaginas }, (_, i) => {

        const num = i + 1;

        return (
          <button
            key={num}
            onClick={() => onChange(num)}
            className={`
              px-3 py-1 rounded-full transition
              ${pagina === num
                ? "bg-blue-500 text-white shadow"
                : "bg-gray-200 hover:bg-gray-300"}
            `}
          >
            {num}
          </button>
        );
      })}

      {/* ➡️ SIGUIENTE */}
      <button
        disabled={pagina === totalPaginas}
        onClick={() => onChange(pagina + 1)}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        ▶
      </button>

    </div>
  );
}

export default Paginacion;
