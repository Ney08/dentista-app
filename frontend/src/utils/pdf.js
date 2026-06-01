import jsPDF from "jspdf";
import axios from "axios";
import { parseFechaLocal } from "./fecha";
export const generarFactura = async (ingreso) => {

  const doc = new jsPDF();
  let y = 20;

  // =========================
  // 🟦 HEADER
  // =========================
  doc.setFillColor(23, 92, 169);
  doc.rect(0, 0, 210, 30, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("CLINICA DENTAL SONRISA", 105, 18, { align: "center" });

  // Reset
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  // =========================
  // 📄 INFO
  // =========================
  const clienteNombre = ingreso.cliente
    ? `${ingreso.cliente.nombre} ${ingreso.cliente.apellido}`
    : "N/A";

  const telefono = ingreso.cliente?.telefono || "";

  const fecha = parseFechaLocal(ingreso.created_at);

  doc.text(`Factura #: ${ingreso.id}`, 20, 45);
  doc.text(`Paciente: ${clienteNombre}`, 20, 55);
  doc.text(`Fecha: ${fecha}`, 20, 65);

  // =========================
  // 📊 SERVICIOS
  // =========================
  y = 80;

  doc.setFont("helvetica", "bold");
  doc.text("Servicio", 20, y);
  doc.text("Precio", 190, y, { align: "right" });

  doc.setFont("helvetica", "normal");

  y += 5;
  doc.line(20, y, 190, y);
  y += 10;

  const servicios = ingreso.servicios || [];

  let subtotal = 0;

  servicios.forEach((s) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    const monto = Number(s.monto) || 0;

    doc.text(s.descripcion || "Servicio", 20, y);
    doc.text(`RD$ ${monto.toFixed(2)}`, 190, y, { align: "right" });

    subtotal += monto;
    y += 10;
  });

  // =========================
  // 💰 CALCULOS (ALINEADOS)
  // =========================
  const descuento = ingreso.descuento || 0;
  const itbis = subtotal * 0.18;
  const descuentoValor = subtotal * (descuento / 100);
  const total = subtotal + itbis - descuentoValor;

  y += 5;
  doc.line(120, y, 190, y);
  y += 10;

  // ✅ Subtotal
  doc.text("Subtotal:", 130, y);
  doc.text(`RD$ ${subtotal.toFixed(2)}`, 190, y, { align: "right" });
  y += 8;

  // ✅ ITBIS CORREGIDO
  doc.text("ITBIS (18%):", 130, y);
  doc.text(`RD$ ${itbis.toFixed(2)}`, 190, y, { align: "right" });
  y += 8;

  // ✅ Descuento
  doc.text("Descuento:", 130, y);
  doc.text(`${descuento}%`, 190, y, { align: "right" });
  y += 10;

  // ✅ TOTAL DESTACADO
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);

  doc.text("TOTAL:", 130, y);
  doc.text(`RD$ ${total.toFixed(2)}`, 190, y, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  // =========================
  // 🧾 FOOTER
  // =========================
  // =========================
  // 🧾 FIRMAS PROFESIONALES
  // =========================

  y += 30;

  // ✅ FIRMA CLIENTE (izquierda)
  doc.line(30, y, 90, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  doc.text(
    "Firma del cliente",
    60,
    y + 5,
    { align: "center" }
  );

  // ✅ FIRMA DOCTOR (derecha)
  doc.line(120, y, 180, y);

  doc.text(
    "Firma del doctor",
    150,
    y + 5,
    { align: "center" }
  );

  // =========================
  // 🙏 MENSAJE FINAL (MÁS ABAJO)
  // =========================
  y += 20;

  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);

  doc.text(
    "Gracias por confiar en nuestra clinica",
    105,
    y,
    { align: "center" }
  );

  // =========================
  // 📄 MOSTRAR PDF
  // =========================

  const pdfBlob = doc.output("blob");

  // ✅ 1. ABRIR PREVIEW (PARA IMPRIMIR)
  if (window.modoFactura === "preview") {
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, "_blank");
  }

  // ✅ 2. DESCARGAR DIRECTO
  if (window.modoFactura === "download") {
    doc.save(`factura_${ingreso.id}.pdf`);
  }


  // =========================
  // 📤 BACKEND + WHATSAPP
  // =========================
  try {
    const formData = new FormData();
    formData.append("file", pdfBlob, `factura_${ingreso.id}.pdf`);
    formData.append("ingreso_id", ingreso.id);

    const res = await axios.post(
      "http://127.0.0.1:8000/facturas/",
      formData
    );

    const urlPDF = res.data?.url || "";

    if (telefono) {
      const mensaje = `Hola ${clienteNombre}

Su factura esta lista

Factura #${ingreso.id}
Total: RD$ ${total.toFixed(2)}

Ver:
${urlPDF}`;

      const waURL = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
      window.open(waURL, "_blank");
    }

  } catch (error) {
    console.log("⚠️ Error backend, pero PDF funciona");
  }
};
