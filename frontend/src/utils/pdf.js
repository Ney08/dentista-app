import jsPDF from "jspdf";
import axios from "axios";
import { API_URL } from "../config";
import QRCode from "qrcode";

import {
  formatUTCFechaHora
} from "./fecha";

import {
  formatMoney
} from "./format";

import toast from "react-hot-toast";

import {
  save
} from "@tauri-apps/plugin-dialog";

import {
  writeFile
} from "@tauri-apps/plugin-fs";

import {
  openPath
} from "@tauri-apps/plugin-opener";

export const generarFactura = async (
  ingreso
) => {

  /*
  ==========================================
  PDF
  ==========================================
  */

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth =
    doc.internal.pageSize.getWidth();

  const pageHeight =
    doc.internal.pageSize.getHeight();

  let y = 20;

  /*
  ==========================================
  DATA
  ==========================================
  */

  const clienteNombre =
    ingreso.cliente
      ? `${ingreso.cliente.nombre} ${ingreso.cliente.apellido}`
      : "N/A";

  const telefono =
    ingreso.cliente?.telefono || "";

  const servicios =
    ingreso.servicios || [];

  const subtotal =
    servicios.reduce(
      (acc, s) =>
        acc + Number(s.monto || 0),
      0
    );

  const descuento =
    ingreso.descuento || 0;

  const itbis =
    subtotal * 0.18;

  const descuentoValor =
    subtotal *
    (descuento / 100);

  const total =
    subtotal +
    itbis -
    descuentoValor;

  const fecha =
    formatUTCFechaHora(
      ingreso.created_at
    );

  const ncf =
    `B01${String(
      ingreso.id
    ).padStart(8, "0")}`;

  /*
  ==========================================
  QR
  ==========================================
  */

  const qrData = `
Factura #${ingreso.id}
Paciente: ${clienteNombre}
NCF: ${ncf}
Total: RD$ ${formatMoney(total)}
`;

  const qrImage =
    await QRCode.toDataURL(
      qrData
    );

  /*
  ==========================================
  WATERMARK
  ==========================================
  */

  doc.setTextColor(245);

  doc.setFontSize(60);

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.text(
    "SONRISA",
    40,
    190,
    {
      angle: 45
    }
  );

  /*
  ==========================================
  HEADER
  ==========================================
  */

  doc.setFillColor(
    10,
    18,
    40
  );

  doc.rect(
    0,
    0,
    210,
    42,
    "F"
  );

  /*
  ==========================================
  LOGO CIRCLE
  ==========================================
  */

  doc.setFillColor(
    99,
    102,
    241
  );

  doc.circle(
    24,
    21,
    10,
    "F"
  );

  doc.setTextColor(255);

  doc.setFontSize(18);

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.text(
    "DS",
    24,
    24,
    {
      align: "center"
    }
  );

  /*
  ==========================================
  TITULO
  ==========================================
  */

  doc.setFontSize(22);

  doc.text(
    "CLINICA DENTAL SONRISA",
    105,
    18,
    {
      align: "center"
    }
  );

  doc.setFontSize(10);

  doc.setTextColor(
    203,
    213,
    225
  );

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.text(
    "Odontología premium y estética dental",
    105,
    26,
    {
      align: "center"
    }
  );

  /*
  ==========================================
  INFO CLINICA
  ==========================================
  */

  doc.setTextColor(255);

  doc.setFontSize(9);

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.text(
    "RNC: 123456789",
    160,
    14
  );

  doc.text(
    "809-000-0000",
    160,
    20
  );

  doc.text(
    "Santiago, RD",
    160,
    26
  );

  /*
  ==========================================
  RESET
  ==========================================
  */

  doc.setTextColor(
    15,
    23,
    42
  );

  /*
  ==========================================
  CARD FACTURA
  ==========================================
  */

  y = 55;

  doc.setFillColor(
    248,
    250,
    252
  );

  doc.roundedRect(
    15,
    y,
    180,
    38,
    8,
    8,
    "F"
  );

  doc.setDrawColor(
    226,
    232,
    240
  );

  doc.roundedRect(
    15,
    y,
    180,
    38,
    8,
    8
  );

  doc.setFontSize(10);

  doc.setTextColor(100);

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.text(
    "FACTURA",
    25,
    y + 10
  );

  doc.setFontSize(20);

  doc.setTextColor(
    15,
    23,
    42
  );

  doc.text(
    `#${ingreso.id}`,
    25,
    y + 22
  );

  doc.setFontSize(10);

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.text(
    `NCF: ${ncf}`,
    25,
    y + 32
  );

  /*
  ==========================================
  ESTADO
  ==========================================
  */

  doc.setFillColor(
    16,
    185,
    129
  );

  doc.roundedRect(
    145,
    y + 9,
    35,
    12,
    5,
    5,
    "F"
  );

  doc.setTextColor(255);

  doc.setFontSize(11);

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.text(
    "PAGADA",
    162.5,
    y + 17,
    {
      align: "center"
    }
  );

  /*
  ==========================================
  DATOS PACIENTE
  ==========================================
  */

  y += 55;

  doc.setTextColor(
    15,
    23,
    42
  );

  doc.setFontSize(12);

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.text(
    "DATOS DEL PACIENTE",
    20,
    y
  );

  y += 12;

  doc.setFontSize(11);

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.text(
    `Paciente: ${clienteNombre}`,
    20,
    y
  );

  y += 9;

  doc.text(
    `Fecha: ${fecha}`,
    20,
    y
  );

  y += 9;

  doc.text(
    `Teléfono: ${telefono || "N/A"}`,
    20,
    y
  );

  /*
  ==========================================
  QR
  ==========================================
  */

  doc.addImage(
    qrImage,
    "PNG",
    150,
    y - 28,
    35,
    35
  );

  /*
  ==========================================
  TABLA HEADER
  ==========================================
  */

  y += 30;

  doc.setFillColor(
    23,
    92,
    169
  );

  doc.roundedRect(
    15,
    y,
    180,
    12,
    4,
    4,
    "F"
  );

  doc.setTextColor(255);

  doc.setFontSize(11);

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.text(
    "SERVICIO",
    22,
    y + 8
  );

  doc.text(
    "PRECIO",
    180,
    y + 8,
    {
      align: "right"
    }
  );

  y += 18;

  /*
  ==========================================
  SERVICIOS
  ==========================================
  */

  servicios.forEach(
    (s, index) => {

      if (y > 240) {

        doc.addPage();

        y = 20;

      }

      if (index % 2 === 0) {

        doc.setFillColor(
          241,
          245,
          249
        );

        doc.roundedRect(
          15,
          y - 6,
          180,
          12,
          3,
          3,
          "F"
        );

      }

      doc.setTextColor(
        15,
        23,
        42
      );

      doc.setFontSize(11);

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.text(
        s.descripcion ||
        "Servicio",
        22,
        y
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.text(
        `RD$ ${formatMoney(
          s.monto
        )}`,
        180,
        y,
        {
          align: "right"
        }
      );

      y += 14;

    }
  );

  /*
  ==========================================
  TOTAL CARD
  ==========================================
  */

  y += 15;

  doc.setFillColor(
    10,
    18,
    40
  );

  doc.roundedRect(
    108,
    y,
    87,
    45,
    8,
    8,
    "F"
  );

  doc.setTextColor(255);

  doc.setFontSize(10);

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.text(
    "Subtotal",
    118,
    y + 10
  );

  doc.text(
    `RD$ ${formatMoney(
      subtotal
    )}`,
    185,
    y + 10,
    {
      align: "right"
    }
  );

  doc.text(
    "ITBIS",
    118,
    y + 19
  );

  doc.text(
    `RD$ ${formatMoney(
      itbis
    )}`,
    185,
    y + 19,
    {
      align: "right"
    }
  );

  doc.text(
    "Descuento",
    118,
    y + 28
  );

  doc.text(
    `${descuento}%`,
    185,
    y + 28,
    {
      align: "right"
    }
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(15);

  doc.text(
    "TOTAL",
    118,
    y + 39
  );

  doc.text(
    `RD$ ${formatMoney(
      total
    )}`,
    185,
    y + 39,
    {
      align: "right"
    }
  );

  /*
  ==========================================
  FIRMAS
  ==========================================
  */

  y += 70;

  doc.setDrawColor(
    180
  );

  doc.setLineWidth(
    0.5
  );

  doc.line(
    25,
    y,
    85,
    y
  );

  doc.line(
    125,
    y,
    185,
    y
  );

  doc.setTextColor(
    120
  );

  doc.setFontSize(10);

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.text(
    "Firma del paciente",
    55,
    y + 6,
    {
      align: "center"
    }
  );

  doc.text(
    "Firma autorizada",
    155,
    y + 6,
    {
      align: "center"
    }
  );

  /*
  ==========================================
  FOOTER LINE
  ==========================================
  */

  doc.setDrawColor(
    99,
    102,
    241
  );

  doc.setLineWidth(
    0.8
  );

  doc.line(
    20,
    275,
    190,
    275
  );

  /*
  ==========================================
  FOOTER
  ==========================================
  */

  doc.setFontSize(8);

  doc.setTextColor(
    120
  );

  doc.text(
    "Clínica Dental Sonrisa • Santiago, República Dominicana",
    pageWidth / 2,
    282,
    {
      align: "center"
    }
  );

  doc.text(
    "www.clinicasonrisa.com",
    pageWidth / 2,
    287,
    {
      align: "center"
    }
  );

  /*
  ==========================================
  AUTO PRINT
  ==========================================
  */

  doc.autoPrint();

  /*
  ==========================================
  PDF
  ==========================================
  */

  const pdfBlob =
    doc.output("blob");
  /*
==========================================
WHATSAPP DIRECTO
==========================================
*/

  if (
    window.modoFactura ===
    "whatsapp"
  ) {

    try {

      const formData =
        new FormData();

      formData.append(
        "file",
        pdfBlob,
        `factura_${ingreso.id}.pdf`
      );

      formData.append(
        "ingreso_id",
        ingreso.id
      );

      const res =


        await axios.post(
          `http://127.0.0.1:8000/ingresos/${ingreso.id}/factura`,
          formData
        );




      const urlPDF =
        res.data?.archivo
          ? `http://127.0.0.1:8000/${res.data.archivo}`
          : "";

      const mensaje = `
🦷 *CLÍNICA DENTAL SONRISA*

Hola *${clienteNombre}* 👋

Su factura ha sido generada exitosamente ✅

━━━━━━━━━━━━━━

🧾 *Factura:* #${ingreso.id}

🏷️ *NCF:* ${ncf}

📅 *Fecha:* ${fecha}

🦷 *Servicios:*
${servicios
          .map(
            s => `• ${s.descripcion}`
          )
          .join("\n")}

💰 *Total:* RD$ ${formatMoney(total)}

━━━━━━━━━━━━━━

📄 *Ver / Descargar PDF:*
${urlPDF}

💙 Gracias por confiar en nosotros.
`;

      const waURL =
        `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

      window.open(
        waURL,
        "_blank"
      );

      return;

    } catch (err) {

      console.error(
        "ERROR WHATSAPP:",
        err?.response?.data || err
      );

      toast.error(
        "Error enviando WhatsApp ❌"
      );

      return;

    }

  }
  /*
  ==========================================
  PREVIEW
  ==========================================
  */

  if (
    window.modoFactura ===
    "preview"
  ) {

    try {

      const filePath =
        await save({

          filters: [
            {
              name: "PDF",
              extensions: ["pdf"]
            }
          ],

          defaultPath:
            `factura_${ingreso.id}.pdf`

        });

      if (!filePath) {
        return;
      }

      const pdfBytes =
        doc.output(
          "arraybuffer"
        );

      await writeFile(
        filePath,
        new Uint8Array(
          pdfBytes
        )
      );

      toast.success(
        "PDF listo para imprimir ✅"
      );

      await openPath(
        filePath
      );

    } catch (err) {

      console.error(err);

      toast.error(
        "Error PDF ❌"
      );

    }

  }

  /*
  ==========================================
  DOWNLOAD
  ==========================================
  */

  if (
    window.modoFactura ===
    "download"
  ) {

    try {

      const filePath =
        await save({

          filters: [
            {
              name: "PDF",
              extensions: ["pdf"]
            }
          ],

          defaultPath:
            `factura_${ingreso.id}.pdf`

        });

      if (!filePath) {
        return;
      }

      const pdfBytes =
        doc.output(
          "arraybuffer"
        );

      await writeFile(
        filePath,
        new Uint8Array(
          pdfBytes
        )
      );

      toast.success(
        "PDF guardado ✅"
      );

    } catch (err) {

      console.error(err);

      toast.error(
        "Error guardando PDF ❌"
      );

    }

  }

  /*
  ==========================================
  BACKEND + WHATSAPP
  ==========================================
  */



};