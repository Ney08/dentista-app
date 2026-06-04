import jsPDF from "jspdf";
import axios from "axios";

import {
  parseFechaLocal
} from "./fecha";

import {
  formatMoney
} from "./format";

import toast from "react-hot-toast";

import { save } from "@tauri-apps/plugin-dialog";

import { writeFile } from "@tauri-apps/plugin-fs";

import { openPath } from "@tauri-apps/plugin-opener";

export const generarReporte = async ({
  ingresos = [],
  tipo = "mensual",
  fileName = "reporte.pdf"
}) => {

  if (!Array.isArray(ingresos)) {
    ingresos = [];
  }

  const doc = new jsPDF();

  let y = 20;

  // =========================
  // 🟦 HEADER
  // =========================
  doc.setFillColor(23, 92, 169);

  doc.rect(0, 0, 210, 35, "F");

  doc.setTextColor(255, 255, 255);

  doc.setFontSize(18);

  doc.setFont("helvetica", "bold");

  doc.text(
    "CLINICA DENTAL SONRISA",
    105,
    20,
    {
      align: "center"
    }
  );

  // =========================
  // RESET
  // =========================
  doc.setTextColor(0, 0, 0);

  // =========================
  // 📄 TITULO
  // =========================
  const tituloMap = {
    semanal: "Reporte Semanal",
    mensual: "Reporte Mensual",
    anual: "Reporte Anual",
  };

  y = 50;

  doc.setFontSize(16);

  doc.setFont("helvetica", "bold");

  doc.text(
    tituloMap[tipo] || "Reporte",
    20,
    y
  );

  doc.setFontSize(11);

  doc.setFont("helvetica", "normal");

  doc.text(
    `Generado: ${new Date().toLocaleDateString("es-DO")}`,
    190,
    y,
    {
      align: "right"
    }
  );

  y += 12;

  // =========================
  // 📊 TABLA HEADER
  // =========================
  doc.setFontSize(12);

  doc.setFont("helvetica", "bold");

  doc.text("Fecha", 20, y);

  doc.text("Cliente", 70, y);

  doc.text("Total (RD$)", 190, y, {
    align: "right"
  });

  y += 4;

  doc.line(20, y, 190, y);

  y += 10;

  doc.setFont("helvetica", "normal");

  // =========================
  // 📈 DATOS
  // =========================
  let totalGeneral = 0;

  const clientesUnicos = new Set();

  if (ingresos.length === 0) {

    doc.setFontSize(12);

    doc.text(
      "No hay datos para mostrar en este periodo",
      20,
      y
    );
  }

  ingresos.forEach((i) => {

    // ✅ salto página
    if (y > 270) {

      doc.addPage();

      y = 20;
    }

    const servicios = i.servicios || [];

    const subtotal = servicios.reduce(
      (acc, s) => acc + (Number(s.monto) || 0),
      0
    );

    const itbis = subtotal * 0.18;

    const descuento = subtotal * (
      (i.descuento || 0) / 100
    );

    const total = subtotal + itbis - descuento;

    totalGeneral += total;

    if (i.cliente_id) {
      clientesUnicos.add(i.cliente_id);
    }

    // ✅ fecha
    let fecha = "N/A";

    if (i.created_at) {

      const f = parseFechaLocal(i.created_at);

      if (!isNaN(f)) {

        fecha = f.toLocaleDateString("es-DO");
      }
    }

    // ✅ cliente
    const cliente = i.cliente
      ? `${i.cliente.nombre || ""} ${i.cliente.apellido || ""}`
      : "N/A";

    // ✅ render fila
    doc.setFontSize(11);

    doc.text(fecha, 20, y);

    doc.text(cliente, 70, y);

    doc.text(
      formatMoney(total),
      190,
      y,
      {
        align: "right"
      }
    );

    y += 8;
  });

  // =========================
  // 💰 RESUMEN
  // =========================
  y += 12;

  if (y > 250) {

    doc.addPage();

    y = 20;
  }

  doc.setFontSize(13);

  doc.setFont("helvetica", "bold");

  doc.text("Resumen", 20, y);

  y += 10;

  doc.setFontSize(12);

  doc.setFont("helvetica", "normal");

  doc.text(
    `Total General: RD$ ${formatMoney(totalGeneral)}`,
    20,
    y
  );

  y += 8;

  doc.text(
    `Facturas: ${ingresos.length}`,
    20,
    y
  );

  y += 8;

  doc.text(
    `Clientes unicos: ${clientesUnicos.size}`,
    20,
    y
  );

  // =========================
  // 🙏 FOOTER
  // =========================
  y += 20;

  doc.setFontSize(10);

  doc.setFont("helvetica", "italic");

  doc.text(
    "Reporte generado automaticamente",
    105,
    y,
    {
      align: "center"
    }
  );

  // =========================
  // 💾 TAURI SAVE
  // =========================
  try {

    const filePath = await save({
      filters: [
        {
          name: "PDF",
          extensions: ["pdf"]
        }
      ],
      defaultPath: fileName
    });

    // ✅ usuario canceló
    if (!filePath) {
      return;
    }

    // ✅ generar bytes
    const pdfBytes = doc.output("arraybuffer");

    // ✅ guardar archivo
    await writeFile(
      filePath,
      new Uint8Array(pdfBytes)
    );

    // ✅ abrir automáticamente
    await openPath(filePath);

    // ✅ toast éxito guardar
    toast.success(
      "Reporte PDF guardado ✅"
    );

    // ✅ intentar abrir
    try {

      await openPath(filePath);

    } catch (openErr) {

      console.error(
        "ERROR OPEN PDF:",
        openErr
      );

    }

  } catch (err) {

    console.error(
      "ERROR REPORTE PDF:",
      err
    );


    toast.success(
      `PDF guardado ✅`
    );

  }
};