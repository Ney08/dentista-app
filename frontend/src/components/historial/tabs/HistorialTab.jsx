import NotaClinicaModal
  from "./NotaClinicaModal";

import { useState, useEffect } from "react";

import { useHistorial } from "../../../hooks/useHistorial";

function HistorialTab({ cliente, clienteId }) {

  const {
    historial,
    isLoading,
    crearHistorial,
    eliminarHistorial,
    actualizarHistorial
  } = useHistorial(clienteId); 

  return (
    <div className="mt-8">

      <NotaClinicaModal
        historial={historial}
        cliente={cliente}
        clienteId={clienteId}
        crearHistorial={crearHistorial}
        eliminarHistorial={eliminarHistorial}
        actualizarHistorial={actualizarHistorial}
         
      />

      

    </div>
  );
}
export default HistorialTab;