
// ✅ FORMATEAR DINERO RD
export const formatMoney = (valor) => {

  return new Intl.NumberFormat("es-DO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(valor || 0));
};
