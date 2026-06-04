function SkeletonLoader({
  lineas = 2,
  alto = "h-4"
}) {

  return (
    <div className="animate-pulse space-y-4">

      {Array.from({ length: lineas }).map((_, i) => (

        <div
          key={i}
          className={`
            ${alto}
            bg-gray-300 rounded-xl
          `}
        />

      ))}

    </div>
  );
}

export default SkeletonLoader;