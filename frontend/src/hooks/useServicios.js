import { useState, useEffect } from "react";
import serviciosData from "../data/servicios.json";

export function useServicios() {

  const [servicios, setServicios] = useState(serviciosData);

  useEffect(() => {
    const saved = localStorage.getItem("servicios");

    if (saved) {
      setServicios(JSON.parse(saved));
    }
  }, []);

  const guardar = (lista) => {
    setServicios(lista);
    localStorage.setItem("servicios", JSON.stringify(lista));
  };

  const agregarServicio = (servicio) => {
    const nuevo = {
      id: Date.now(),
      ...servicio
    };

    guardar([...servicios, nuevo]);
  };

  const eliminarServicio = (id) => {
    guardar(servicios.filter(s => s.id !== id));
  };

  return {
    servicios,
    agregarServicio,
    eliminarServicio
  };
}
