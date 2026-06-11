import { create } from "zustand";

const useModalStore = create((set) => ({

  /*
  ==========================================
  CLIENTE
  ==========================================
  */

  createClienteOpen: false,

  openCliente: () =>
    set({
      createClienteOpen: true
    }),

  closeCliente: () =>
    set({
      createClienteOpen: false
    }),

  /*
  ==========================================
  CITA
  ==========================================
  */

  createCitaOpen: false,

  openCita: () =>
    set({
      createCitaOpen: true
    }),

  closeCita: () =>
    set({
      createCitaOpen: false
    }),

  /*
  ==========================================
  FACTURA
  ==========================================
  */

  createFacturaOpen: false,

  openFactura: () =>
    set({
      createFacturaOpen: true
    }),

  closeFactura: () =>
    set({
      createFacturaOpen: false
    }),

  /*
  ==========================================
  EGRESO
  ==========================================
  */

  createEgresoOpen: false,

  openEgreso: () =>
    set({
      createEgresoOpen: true
    }),

  closeEgreso: () =>
    set({
      createEgresoOpen: false
    })

}));

export default useModalStore;