import jsPDF from "jspdf";
import axios from "axios";
import QRCode from "qrcode";

import facturaTemplateUrl from "../assets/factura.svg";
import dentalLogo from "../assets/dentalapp_logo_invoice_transparent_shadow.png";

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
  invoke
} from "@tauri-apps/api/core";

import {
  writeFile
} from "@tauri-apps/plugin-fs";

import {
  openUrl
} from "@tauri-apps/plugin-opener";

/*
==========================================
IMAGE URL TO DATA URL
==========================================
*/

const imageUrlToDataUrl = async (url) => {

  const response =
    await fetch(url);

  const blob =
    await response.blob();

  return await new Promise((resolve, reject) => {

    const reader =
      new FileReader();

    reader.onloadend = () =>
      resolve(reader.result);

    reader.onerror = reject;

    reader.readAsDataURL(blob);

  });

};

/*
==========================================
GET SVG TEXT
==========================================
*/

const getSvgText = async (svgUrl) => {

  const response =
    await fetch(svgUrl);

  if (!response.ok) {

    throw new Error(
      `No se pudo cargar el SVG: ${response.status}`
    );

  }

  return await response.text();

};

/*
==========================================
SVG TO PNG DATA URL
==========================================
*/

const svgToDataUrl = async (svgText) => {

  const svgBlob =
    new Blob(
      [svgText],
      {
        type: "image/svg+xml;charset=utf-8"
      }
    );

  const url =
    URL.createObjectURL(svgBlob);

  const img =
    new Image();

  img.src = url;

  await new Promise((resolve, reject) => {

    img.onload = resolve;

    img.onerror = () =>
      reject(
        new Error(
          "No se pudo renderizar el SVG. Revisa si tiene imágenes externas, fuentes no convertidas o elementos incompatibles."
        )
      );

  });

  const canvas =
    document.createElement("canvas");

  /*
  ==========================================
  A4 300DPI APROX
  ==========================================
  */

  canvas.width =
    2480;

  canvas.height =
    3508;

  const ctx =
    canvas.getContext("2d");

  ctx.drawImage(
    img,
    0,
    0,
    canvas.width,
    canvas.height
  );

  URL.revokeObjectURL(url);

  return canvas.toDataURL("image/png");

};

export const generarFactura = async (
  ingreso
) => {

  /*
  ==========================================
  PDF A4
  ==========================================
  */

  const doc =
    new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

  const pageWidth =
    doc.internal.pageSize.getWidth();

  const pageHeight =
    doc.internal.pageSize.getHeight();

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

  const abonado =
    ingreso.monto_abonado ||
    0;

  const balanceTratamiento =
    ingreso.balance_restante ||
    0;

  const tratamiento =
    ingreso.tratamiento ||
    null;

  const metodoPago =
    ingreso.metodo_pago ||
    "Efectivo";

  const doctor =
    ingreso.doctor ||
    "Clínica Dental";

  const pagada =
    ingreso.pagado;

  const fecha =
    formatUTCFechaHora(
      ingreso.fecha ||
      ingreso.created_at
    );

  const ncf =
    `B01${String(
      ingreso.id
    ).padStart(8, "0")}`;

  const facturaCodigo =
    `FAC-2026-${String(
      ingreso.id
    ).padStart(6, "0")}`;

  const money = (n) =>
    `RD$ ${formatMoney(n)}`;

  /*
  ==========================================
  QR
  ==========================================
  */

  const qrData = `
Factura #${ingreso.id}
Código: ${facturaCodigo}
Paciente: ${clienteNombre}
NCF: ${ncf}
Fecha: ${fecha}
Total: ${money(total)}
`;

  const qrImage =
    await QRCode.toDataURL(
      qrData
    );

  /*
  ==========================================
  ASSETS
  ==========================================
  */

  let svgText = "";
  let templateDataUrl = "";
  let logoDataUrl = "";

  try {

    svgText =
      await getSvgText(
        facturaTemplateUrl
      );

    svgText =
      svgText
        .replaceAll("{{CLIENTE}}", clienteNombre)
        .replaceAll("{{FACTURA}}", facturaCodigo)
        .replaceAll("{{FECHA}}", fecha)
        .replaceAll("{{NCF}}", ncf)
        .replaceAll("{{METODO}}", metodoPago)
        .replaceAll("{{DOCTOR}}", doctor)
        .replaceAll("{{TELEFONO}}", telefono || "N/A")
        .replaceAll("{{TOTAL}}", money(total));

    templateDataUrl =
      await svgToDataUrl(
        svgText
      );

    logoDataUrl =
      await imageUrlToDataUrl(
        dentalLogo
      );

  } catch (error) {

    console.error(
      "ERROR CARGANDO ASSETS:",
      error
    );

    toast.error(
      "Error cargando la plantilla de factura ❌"
    );

    return;

  }

  /*
  ==========================================
  TEMPLATE COMO FONDO
  ==========================================
  */

  doc.addImage(
    templateDataUrl,
    "PNG",
    0,
    0,
    pageWidth,
    pageHeight
  );

  /*
  ==========================================
  COLORES
  ==========================================
  */

  const azul =
    [0, 75, 130];

  const azulOscuro =
    [10, 18, 40];

  const slate =
    [15, 23, 42];

  const muted =
    [100, 116, 139];

  /*
  ==========================================
  HEADER CONTENT
  ==========================================
  */

  doc.addImage(
    logoDataUrl,
    "PNG",
    12,
    6,
    28,
    28
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(19);

  doc.setTextColor(
    255,
    255,
    255
  );

  doc.text(
    "CLINICA DENTAL SONRISA",
    50,
    15
  );

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(9);

  doc.setTextColor(
    203,
    213,
    225
  );

  doc.text(
    "Odontología premium y estética dental",
    50,
    26
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(8.5);

  doc.setTextColor(
    255,
    255,
    255
  );

  doc.text(
    "RNC: 123456789",
    160,
    10
  );

  doc.text(
    "809-000-0000",
    160,
    18
  );

  doc.text(
    "Santiago, RD",
    160,
    26
  );

  /*
  ==========================================
  TITLE
  ==========================================
  */

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(21);

  doc.setTextColor(
    6,
    182,
    212
  );

  doc.text(
    "FACTURA",
    pageWidth / 2,
    75,
    {
      align: "center"
    }
  );

  /*
  ==========================================
  LIMPIEZA SUAVE DE ÁREAS DINÁMICAS
  Ajustada para no borrar decoraciones.
  ==========================================
  */

  doc.setFillColor(
    255,
    255,
    255
  );

  /*
  Solo valores del bloque superior, no todo el diseño.
  */
  doc.rect(
    70,
    78,
    42,
    18,
    "F"
  );

  doc.rect(
    138,
    78,
    25,
    18,
    "F"
  );

  /*
  Área de tabla dinámica.
  */
  doc.rect(
    24,
    127,
    162,
    58,
    "F"
  );

  /*
  Área notas + payment.
  */
  doc.rect(
    22,
    198,
    80,
    46,
    "F"
  );

  /*
  Área total.
  */
  doc.rect(
    116,
    196,
    72,
    50,
    "F"
  );

  /*
  ==========================================
  META INFO
  ==========================================
  */

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(8);

  doc.setTextColor(
    azul[0],
    azul[1],
    azul[2]
  );

  doc.text(
    "To:",
    58,
    82
  );

  doc.text(
    "Invoice N°:",
    48,
    90
  );

  doc.text(
    "Date:",
    122,
    82
  );

  doc.text(
    "Account:",
    116,
    90
  );

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setTextColor(
    slate[0],
    slate[1],
    slate[2]
  );

  doc.text(
    clienteNombre,
    75,
    82
  );

  doc.text(
    facturaCodigo,
    75,
    90
  );

  doc.text(
    fecha,
    141,
    82
  );

  doc.text(
    metodoPago,
    141,
    90
  );

  /*
  ==========================================
  EXTRA INFO
  ==========================================
  */

  doc.setFontSize(7);

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setTextColor(
    muted[0],
    muted[1],
    muted[2]
  );

  doc.text(
    `NCF: ${ncf}`,
    48,
    101
  );

  doc.text(
    `Doctor: ${doctor}`,
    116,
    101
  );

  /*
  ==========================================
  QR
  ==========================================
  */

  doc.addImage(
    qrImage,
    "PNG",
    164,
    78,
    24,
    24
  );

  doc.setFontSize(6);

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setTextColor(
    muted[0],
    muted[1],
    muted[2]
  );

  doc.text(
    "Escanear",
    176,
    105,
    {
      align: "center"
    }
  );

  /*
  ==========================================
  ESTADO
  ==========================================
  */

  if (pagada) {

    doc.setFillColor(
      16,
      185,
      129
    );

  } else {

    doc.setFillColor(
      245,
      158,
      11
    );

  }

  doc.roundedRect(
    160,
    111,
    30,
    9,
    4.5,
    4.5,
    "F"
  );

  doc.setTextColor(255);

  doc.setFontSize(6.8);

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.text(
    pagada
      ? "PAGADA"
      : "PEND.",
    175,
    117.2,
    {
      align: "center"
    }
  );

  /*
  ==========================================
  TABLE HEADER
  ==========================================
  */

  const tableX = 24;
  const tableW = 162;

  let tableY = 128;

  doc.setFillColor(
    azul[0],
    azul[1],
    azul[2]
  );

  doc.rect(
    tableX,
    tableY,
    tableW,
    10,
    "F"
  );

  doc.setFontSize(8);

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setTextColor(255);

  doc.text(
    "Description",
    30,
    tableY + 7
  );

  doc.text(
    "Qty",
    112,
    tableY + 7,
    {
      align: "center"
    }
  );

  doc.text(
    "Price",
    145,
    tableY + 7,
    {
      align: "right"
    }
  );

  doc.text(
    "Total",
    180,
    tableY + 7,
    {
      align: "right"
    }
  );

  tableY += 15;

  /*
  ==========================================
  TABLE ROWS
  ==========================================
  */

  servicios.forEach(
    (s, index) => {

      const rowHeight =
        tratamiento
          ? 15
          : 11;

      if (index % 2 === 0) {

        doc.setFillColor(
          255,
          255,
          255
        );

      } else {

        doc.setFillColor(
          226,
          232,
          240
        );

      }

      doc.rect(
        tableX,
        tableY - 6,
        tableW,
        rowHeight,
        "F"
      );

      const nombreServicio =
        s.descripcion ||
        s.nombre_servicio ||
        s.nombre ||
        s.servicio ||
        "Servicio";

      const cantidad =
        Number(
          s.cantidad ||
          s.qty ||
          1
        );

      const precio =
        Number(
          s.monto || 0
        );

      const totalLinea =
        precio * cantidad;

      doc.setFontSize(8);

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setTextColor(
        azul[0],
        azul[1],
        azul[2]
      );

      doc.text(
        nombreServicio,
        30,
        tableY
      );

      doc.setFontSize(6.3);

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setTextColor(
        muted[0],
        muted[1],
        muted[2]
      );

      doc.text(
        "Tratamiento clínico",
        30,
        tableY + 5
      );

      if (tratamiento) {

        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.setTextColor(
          99,
          102,
          241
        );

        doc.text(
          `Sesión ${tratamiento.sesiones_completadas} de ${tratamiento.sesiones_totales}`,
          30,
          tableY + 10
        );

      }

      doc.setFontSize(8);

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setTextColor(
        azul[0],
        azul[1],
        azul[2]
      );

      doc.text(
        String(cantidad),
        112,
        tableY,
        {
          align: "center"
        }
      );

      doc.text(
        money(precio),
        145,
        tableY,
        {
          align: "right"
        }
      );

      doc.text(
        money(totalLinea),
        180,
        tableY,
        {
          align: "right"
        }
      );

      tableY += rowHeight;

    }
  );

  /*
  ==========================================
  NOTES
  ==========================================
  */

  doc.setFontSize(8);

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setTextColor(
    azul[0],
    azul[1],
    azul[2]
  );


  doc.text(
    "Notas:",
    24,
    207
  );


  doc.setFontSize(6.3);

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setTextColor(
    muted[0],
    muted[1],
    muted[2]
  );

  doc.text(
    "Documento generado automáticamente por el sistema clínico.",
    24,
    207
  );

  doc.text(
    "Gracias por confiar en Clínica Dental Sonrisa.",
    24,
    212
  );

  /*
  ==========================================
  PAYMENT INFO
  ==========================================
  */

  doc.setFontSize(8);

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setTextColor(
    azul[0],
    azul[1],
    azul[2]
  );


  doc.text(
    "Pago info:",
    24,
    230
  );


  doc.setFontSize(6.3);

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setTextColor(
    muted[0],
    muted[1],
    muted[2]
  );

  doc.text(
    `Método: ${metodoPago}`,
    24,
    230
  );

  doc.text(
    `Teléfono: ${telefono || "N/A"}`,
    24,
    235
  );

  doc.text(
    `Estado: ${pagada ? "Pagada" : "Pendiente"}`,
    24,
    240
  );

  /*
  ==========================================
  TOTALS
  ==========================================
  */

  const totalsX = 118;
  const totalsY = 198;
  const totalsW = 68;

  const totalsRows = [
    {
      label: "Sub total",
      value: money(subtotal),
      color: [255, 255, 255]
    },
    {
      label: "Taxes 18%",
      value: money(itbis),
      color: [255, 255, 255]
    }
  ];

  if (descuento > 0) {

    totalsRows.push({
      label: `Discount ${descuento}%`,
      value: `- ${money(descuentoValor)}`,
      color: [244, 63, 94]
    });

  }

  totalsRows.push({
    label: "Paid",
    value: money(abonado),
    color: [16, 185, 129]
  });

  if (tratamiento) {

    totalsRows.push({
      label: "Balance",
      value: money(balanceTratamiento),
      color: [245, 158, 11]
    });

  }

  const totalsH =
    12 +
    totalsRows.length * 7 +
    13;


  doc.setFillColor(
    0,
    75,
    130
  );


  doc.rect(
    totalsX,
    totalsY,
    totalsW,
    totalsH,
    "F"
  );

  let totalY =
    totalsY + 8;

  totalsRows.forEach((row) => {

    doc.setFontSize(7);

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setTextColor(255);

    doc.text(
      row.label,
      totalsX + 8,
      totalY
    );

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setTextColor(
      row.color[0],
      row.color[1],
      row.color[2]
    );

    doc.text(
      row.value,
      totalsX + totalsW - 7,
      totalY,
      {
        align: "right"
      }
    );

    totalY += 7;

  });

  doc.setDrawColor(
    180,
    210,
    230
  );

  doc.line(
    totalsX + 8,
    totalY,
    totalsX + totalsW - 7,
    totalY
  );

  totalY += 9;

  doc.setFontSize(8.5);

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setTextColor(255);

  doc.text(
    "Total",
    totalsX + 8,
    totalY
  );

  doc.text(
    money(total),
    totalsX + totalsW - 7,
    totalY,
    {
      align: "right"
    }
  );

  /*
  ==========================================
  FIRMAS
  ==========================================
  */

  doc.setDrawColor(
    180
  );

  doc.setLineWidth(
    0.5
  );

  doc.line(
    24,
    262,
    79,
    262
  );

  doc.line(
    86,
    262,
    141,
    262
  );

  doc.setFontSize(7.5);

  doc.setTextColor(
    120
  );

  doc.text(
    "Firma del paciente",
    51.5,
    267,
    {
      align: "center"
    }
  );

  doc.text(
    "Firma autorizada",
    113.5,
    267,
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
*CLÍNICA DENTAL SONRISA*

Hola *${clienteNombre}*

Su factura ha sido generada exitosamente.

━━━━━━━━━━━━━━

*Factura:* #${ingreso.id}

*NCF:* ${ncf}

*Fecha:* ${fecha}

*Servicios:*
${servicios
          .map(
            s => `- ${s.descripcion || "Servicio"}`
          )
          .join("\n")}

*Total:* RD$ ${formatMoney(total)}

━━━━━━━━━━━━━━

*Ver / Descargar PDF:*
${urlPDF}

Gracias por confiar en nosotros.
`;

      const limpiarTelefonoWhatsApp = (telefono) => {

        let numero =
          String(telefono || "")
            .replace(/\D/g, "");

        if (
          numero.length === 10 &&
          (
            numero.startsWith("809") ||
            numero.startsWith("829") ||
            numero.startsWith("849")
          )
        ) {

          numero =
            `1${numero}`;

        }

        return numero;

      };

      const telefonoWhatsApp =
        limpiarTelefonoWhatsApp(telefono);

      const textoWhatsApp =
        encodeURIComponent(
          mensaje.normalize("NFC")
        );

      const waURL =
        `https://wa.me/${telefonoWhatsApp}?text=${textoWhatsApp}`;

      const whatsappAppURL =
        `whatsapp://send?phone=${telefonoWhatsApp}&text=${textoWhatsApp}`;

      try {

        await openUrl(
          whatsappAppURL
        );

      } catch {

        await openUrl(
          waURL
        );

      }

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
        "PDF guardado ✅"
      );

      console.log(
        "PDF guardado en:",
        filePath
      );

      await invoke(
        "open_pdf",
        {
          path: filePath
        }
      );

      return;

    } catch (err) {

      console.error(
        "ERROR PREVIEW PDF:",
        err
      );

      toast.error(
        "Error abriendo PDF ❌"
      );

      return;

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

};