import toast from "react-hot-toast";

function ClientesInactivosTab({ clientesInactivos, toggleCliente }) {

  return (
    <div className="bg-white p-6 rounded-xl shadow border space-y-4">

      <h3 className="text-lg font-semibold">
        Clientes desactivados ({clientesInactivos.length})
      </h3>

      <div className="space-y-2 max-h-[300px] overflow-y-auto">

        {clientesInactivos.length === 0 ? (
          <p className="text-gray-500 text-sm text-center">
            No hay clientes desactivados
          </p>
        ) : (

          clientesInactivos.map(c => (
            <div
              key={c.id}
              className="flex justify-between items-center border p-3 rounded-xl bg-gray-50 hover:shadow-sm transition"
            >

              <div className="space-y-1">
                <p className="font-medium">
                  {c.nombre} {c.apellido}
                </p>

                <p className="text-xs text-gray-400">
                  {c.telefono}
                </p>

                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                  Inactivo
                </span>
              </div>

              <button
                onClick={() => {
                  toggleCliente.mutate(c, {
                    onSuccess: () => {
                      toast.success("Cliente activado ✅");
                    }
                  });
                }}
                className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 text-sm"
              >
                Activar
              </button>

            </div>
          ))

        )}

      </div>

    </div>
  );
}

export default ClientesInactivosTab;