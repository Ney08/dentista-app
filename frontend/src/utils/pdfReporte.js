import jsPDF from "jspdf";

export const generarReporte = ({
  ingresos = [],
  tipo = "mensual",
  fileName = "reporte.pdf"
}) => {

  if (!Array.isArray(ingresos)) ingresos = [];

  const doc = new jsPDF();
  let y = 20;

  // =========================
  // HEADER
  // =========================
  doc.setFillColor(23, 92, 169);
  doc.rect(0, 0, 210, 35, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);

  doc.text("Clinica Dental Sonrisa", 105, 20, {
    align: "center"
  });


  doc.setTextColor(0, 0, 0);

  // =========================
  // TITULO
  // =========================
  const tituloMap = {
    semanal: "Reporte Semanal",
    mensual: "Reporte Mensual",
    anual: "Reporte Anual",
  };

  y = 50;

  doc.setFontSize(16);
  doc.setFont(undefined, "bold");
  doc.text(tituloMap[tipo], 20, y);

  doc.setFontSize(11);
  doc.setFont(undefined, "normal");
  doc.text(
    `Generado: ${new Date().toLocaleDateString()}`,
    190,
    y,
    { align: "right" }
  );

  y += 12;

  // =========================
  // TABLA HEADER
  // =========================
  doc.setFontSize(12);
  doc.setFont(undefined, "bold");

  doc.text("Fecha", 20, y);
  doc.text("Total (RD$)", 190, y, { align: "right" });

  y += 4;
  doc.line(20, y, 190, y);
  y += 10;

  doc.setFont(undefined, "normal");

  // =========================
  // DATOS
  // =========================
  let totalGeneral = 0;
  const clientesUnicos = new Set();

  if (ingresos.length === 0) {
    doc.setFontSize(12);
    doc.text("No hay datos para mostrar en este periodo", 20, y);
  }

  ingresos.forEach((i) => {

    const servicios = i.servicios || [];

    const subtotal = servicios.reduce((acc, s) => acc + (s.monto || 0), 0);
    const itbis = subtotal * 0.18;
    const descuento = subtotal * ((i.descuento || 0) / 100);

    const total = subtotal + itbis - descuento;

    totalGeneral += total;

    if (i.cliente_id) clientesUnicos.add(i.cliente_id);

    let fecha = "N/A";

    if (i.created_at) {
      const f = new Date(i.created_at);
      if (!isNaN(f)) fecha = f.toLocaleDateString();
    }

    doc.setFontSize(11);

    doc.text(fecha, 20, y);
    doc.text(total.toFixed(2), 190, y, {
      align: "right"
    });

    y += 8;

    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  // =========================
  // RESUMEN
  // =========================
  y += 12;

  doc.setFontSize(13);
  doc.setFont(undefined, "bold");
  doc.text("Resumen", 20, y);

  y += 10;

  doc.setFontSize(12);
  doc.setFont(undefined, "normal");

  doc.text(`Total General: RD$ ${totalGeneral.toFixed(2)}`, 20, y);
  y += 8;

  doc.text(`Facturas: ${ingresos.length}`, 20, y);
  y += 8;

  doc.text(`Clientes unicos: ${clientesUnicos.size}`, 20, y);

  // =========================
  // FOOTER
  // =========================
  y += 20;

  doc.setFontSize(10);
  // doc.text("Reporte generado automaticamente", 20, y);

  // =========================
  // DESCARGA
  // =========================
  doc.save(fileName);
};