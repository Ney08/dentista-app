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

  const maxServiciosPrimeraPagina =
    4;

  const serviciosPrimeraPagina =
    servicios.slice(
      0,
      maxServiciosPrimeraPagina
    );

  const serviciosRestantes =
    servicios.slice(
      maxServiciosPrimeraPagina
    );

  const subtotal =
    servicios.reduce((acc, s) => {

      const cantidad =
        Number(
          s.cantidad ||
          s.qty ||
          1
        );

      const montoServicio =
        Number(
          s.monto || 0
        );

      const precioUnitario =
        Number(
          s.precio_unitario ||
          s.precio ||
          (
            cantidad > 0
              ? montoServicio / cantidad
              : montoServicio
          )
        );

      return acc + (
        precioUnitario * cantidad
      );

    }, 0);


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

  const fechaPartes =
    String(fecha || "")
      .split(",");

  const fechaDia =
    fechaPartes[0]?.trim() || fecha;

  const fechaHora =
    fechaPartes
      .slice(1)
      .join(",")
      .trim();

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
    70,
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

  const metaY1 =
    82;

  const metaY2 =
    92;

  const metaY3 =
    104;

  const leftLabelX =
    48;

  const leftValueX =
    75;

  const rightLabelX =
    118;

  const rightValueX =
    142;

  /*
  Labels
  */

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(7.8);

  doc.setTextColor(
    azul[0],
    azul[1],
    azul[2]
  );

  doc.text(
    "Paciente:",
    leftLabelX,
    metaY1
  );

  doc.text(
    "Factura N.º:",
    leftLabelX,
    metaY2
  );

  doc.text(
    "Fecha:",
    rightLabelX,
    metaY1
  );

  doc.text(
    "Método:",
    rightLabelX,
    metaY2
  );

  /*
  Values
  */

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(7.4);

  doc.setTextColor(
    slate[0],
    slate[1],
    slate[2]
  );

  doc.text(
    clienteNombre,
    leftValueX,
    metaY1,
    {
      maxWidth: 42
    }
  );

  doc.text(
    facturaCodigo,
    leftValueX,
    metaY2,
    {
      maxWidth: 42
    }
  );

  /*
  Fecha en 2 líneas para que no choque con el QR.
  */

  doc.text(
    fechaDia,
    rightValueX,
    metaY1,
    {
      maxWidth: 25
    }
  );

  if (fechaHora) {

    doc.setFontSize(6.6);

    doc.text(
      fechaHora,
      rightValueX,
      metaY1 + 5,
      {
        maxWidth: 25
      }
    );

  }

  doc.setFontSize(7.4);

  doc.text(
    metodoPago,
    rightValueX,
    metaY2,
    {
      maxWidth: 25
    }
  );

  /*
  ==========================================
  EXTRA INFO
  ==========================================
  */

  doc.setFontSize(6.7);

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
    leftLabelX,
    metaY3
  );

  doc.text(
    `Odontólogo: ${doctor}`,
    rightLabelX,
    metaY3,
    {
      maxWidth: 48
    }
  );

  /*
  ==========================================
  QR
  ==========================================
  */

  doc.addImage(
    qrImage,
    "PNG",
    168,
    78,
    22,
    22
  );

  doc.setFontSize(5.8);

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
    179,
    104,
    {
      align: "center"
    }
  );

  /*
  ==========================================
  ESTADO
  ==========================================
  */

  // if (pagada) {

  //   doc.setFillColor(
  //     16,
  //     185,
  //     129
  //   );

  // } else {

  //   doc.setFillColor(
  //     245,
  //     158,
  //     11
  //   );

  // }

  // doc.roundedRect(
  //   160,
  //   111,
  //   30,
  //   9,
  //   4.5,
  //   4.5,
  //   "F"
  // );

  // doc.setTextColor(255);

  // doc.setFontSize(6.8);

  // doc.setFont(
  //   "helvetica",
  //   "bold"
  // );

  // doc.text(
  //   pagada
  //     ? "PAGADA"
  //     : "PEND.",
  //   175,
  //   117.2,
  //   {
  //     align: "center"
  //   }
  // );

  /*
  ==========================================
  TABLE HEADER
  ==========================================
  */

  const tableX =
    24;

  const tableW =
    162;

  const tableY =
    124;

  const tableHeaderH =
    10;

  const colDescripcion =
    30;

  const colCantidad =
    112;

  const colPrecio =
    145;

  const colTotal =
    180;

  /*
  Header
  */

  doc.setFillColor(
    azul[0],
    azul[1],
    azul[2]
  );

  doc.rect(
    tableX,
    tableY,
    tableW,
    tableHeaderH,
    "F"
  );

  doc.setFontSize(7.8);

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setTextColor(
    255,
    255,
    255
  );

  doc.text(
    "Descripción",
    colDescripcion,
    tableY + 6.7
  );

  doc.text(
    "Monto",
    colTotal,
    tableY + 6.7,
    {
      align: "right"
    }
  );

  /*
  ==========================================
  TABLE ROWS
  ==========================================
  */

  let rowY =
    tableY + tableHeaderH;

  const rowHeight =
    tratamiento
      ? 15
      : 13;


  serviciosPrimeraPagina.forEach(
    (s, index) => {


      const isAlt =
        index % 2 !== 0;

      if (isAlt) {

        doc.setFillColor(
          226,
          232,
          240
        );

      } else {

        doc.setFillColor(
          255,
          255,
          255
        );

      }

      doc.rect(
        tableX,
        rowY,
        tableW,
        rowHeight,
        "F"
      );


      const nombreServicio =
        s.nombre_servicio ||
        s.nombre ||
        s.servicio ||
        s.descripcion ||
        "Servicio";

      const detalleServicio =
        s.detalle ||
        s.descripcion_servicio ||
        s.descripcion_catalogo ||
        s.observacion ||
        s.descripcion_larga ||
        (
          tratamiento
            ? "Tratamiento clínico"
            : "Servicio clínico"
        );


      const precio =
        Number(
          s.monto || 0
        );


      const cantidad =
        Number(
          s.cantidad ||
          s.qty ||
          1
        );

      const montoServicio =
        Number(
          s.monto || 0
        );

      /*
      Si tienes precio_unitario o precio, úsalo.
      Si no, asumimos que monto es el total de la línea
      y calculamos el precio unitario dividiendo entre cantidad.
      */

      const precioUnitario =
        Number(
          s.precio_unitario ||
          s.precio ||
          (
            cantidad > 0
              ? montoServicio / cantidad
              : montoServicio
          )
        );

      const totalLinea =
        precioUnitario * cantidad;
      /*
      Servicio
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
        nombreServicio,
        colDescripcion,
        rowY + 5.5,
        {
          maxWidth: 72
        }
      );

      /*
      Subtexto
      */

      doc.setFontSize(6.2);

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setTextColor(
        muted[0],
        muted[1],
        muted[2]
      );


      if (detalleServicio) {

        doc.text(
          detalleServicio,
          colDescripcion,
          rowY + 10,
          {
            maxWidth: 72
          }
        );

      }


      if (tratamiento) {

        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.setTextColor(
          2,
          132,
          199
        );

        doc.text(
          `Sesión ${tratamiento.sesiones_completadas} de ${tratamiento.sesiones_totales}`,
          colDescripcion,
          rowY + 13.5,
          {
            maxWidth: 72
          }
        );

      }

      /*
      Valores
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
        money(totalLinea),
        colTotal,
        rowY + 7,
        {
          align: "right"
        }
      );


      rowY +=
        rowHeight;

    }
  );

  if (serviciosRestantes.length > 0) {

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(6.5);

    doc.setTextColor(
      2,
      132,
      199
    );

    doc.text(
      `+ ${serviciosRestantes.length} servicio(s) adicional(es) en la página siguiente`,
      tableX,
      rowY + 6
    );

  }
  /*
  ==========================================
  NOTAS
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
    198
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
    208,
    {
      maxWidth: 78
    }
  );

  doc.text(
    "Gracias por confiar en Clínica Dental Sonrisa.",
    24,
    213,
    {
      maxWidth: 78
    }
  );

  /*
  ==========================================
  INFORMACIÓN DE PAGO
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
    "Información de pago:",
    24,
    222
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
    228
  );

  doc.text(
    `Teléfono: ${telefono || "N/A"}`,
    24,
    233
  );

  doc.text(
    `Estado: ${pagada ? "Pagada" : "Pendiente"}`,
    24,
    238
  );
  /*
  ==========================================
  TOTALS
  ==========================================
  */

  const totalsX = 118;
  const totalsY = 190;
  const totalsW = 68;


  const totalsRows = [
    {
      label: "Subtotal",
      value: money(subtotal),
      color: [255, 255, 255]
    },
    {
      label: "ITBIS 18%",
      value: money(itbis),
      color: [255, 255, 255]
    }
  ];


  if (descuento > 0) {

    totalsRows.push({
      label: `Descuento ${descuento}%`,
      value: `- ${money(descuentoValor)}`,
      color: [244, 63, 94]
    });

  }


  if (abonado > 0) {

    totalsRows.push({
      label: "Abonado",
      value: money(abonado),
      color: [16, 185, 129]
    });

  }


  if (tratamiento) {

    totalsRows.push({
      label: "Balance pendiente",
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

  // const firmasY =
  //   252;

  // const firmasCardX =
  //   22;

  // const firmasCardY =
  //   244;

  // const firmasCardW =
  //   124;

  // const firmasCardH =
  //   25;

  // /*
  // Fondo blanco para evitar que las firmas choquen visualmente
  // con las decoraciones inferiores del template.
  // */

  // doc.setFillColor(
  //   255,
  //   255,
  //   255
  // );

  // doc.roundedRect(
  //   firmasCardX,
  //   firmasCardY,
  //   firmasCardW,
  //   firmasCardH,
  //   4,
  //   4,
  //   "F"
  // );

  // doc.setDrawColor(
  //   226,
  //   232,
  //   240
  // );

  // doc.setLineWidth(
  //   0.25
  // );

  // doc.roundedRect(
  //   firmasCardX,
  //   firmasCardY,
  //   firmasCardW,
  //   firmasCardH,
  //   4,
  //   4,
  //   "S"
  // );

  // /*
  // Líneas de firma.
  // */

  // doc.setDrawColor(
  //   120,
  //   120,
  //   120
  // );

  // doc.setLineWidth(
  //   0.45
  // );

  // doc.line(
  //   28,
  //   firmasY,
  //   75,
  //   firmasY
  // );

  // doc.line(
  //   93,
  //   firmasY,
  //   140,
  //   firmasY
  // );

  // /*
  // Etiquetas.
  // */

  // doc.setFontSize(7);

  // doc.setFont(
  //   "helvetica",
  //   "normal"
  // );

  // doc.setTextColor(
  //   100,
  //   116,
  //   139
  // );

  // doc.text(
  //   "Firma del paciente",
  //   51.5,
  //   firmasY + 6,
  //   {
  //     align: "center"
  //   }
  // );

  // doc.text(
  //   "Firma autorizada",
  //   116.5,
  //   firmasY + 6,
  //   {
  //     align: "center"
  //   }
  // );



  /*
  ==========================================
  FIRMA AUTORIZADA SIMPLE
  ==========================================
  */

  const firmaY =
    248;

  doc.setDrawColor(
    100,
    116,
    139
  );

  doc.setLineWidth(
    0.45
  );

  doc.line(
    75,
    firmaY,
    135,
    firmaY
  );

  doc.setFontSize(7);

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setTextColor(
    15,
    23,
    42
  );

  doc.text(
    "Firma y sello autorizado",
    105,
    firmaY + 6,
    {
      align: "center"
    }
  );

  doc.setFontSize(6.2);

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setTextColor(
    100,
    116,
    139
  );

  doc.text(
    "Clínica Dental Sonrisa",
    105,
    firmaY + 11,
    {
      align: "center"
    }
  );




  /*
==========================================
PÁGINA 2 - SERVICIOS ADICIONALES
==========================================
*/

  if (serviciosRestantes.length > 0) {

    doc.addPage();

    /*
    ==========================================
    HEADER PÁGINA 2
    ==========================================
    */

    doc.setFillColor(
      azul[0],
      azul[1],
      azul[2]
    );

    doc.rect(
      0,
      0,
      pageWidth,
      30,
      "F"
    );

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(15);

    doc.setTextColor(
      255,
      255,
      255
    );

    doc.text(
      "Servicios adicionales",
      14,
      18
    );

    doc.setFontSize(8);

    doc.text(
      facturaCodigo,
      pageWidth - 14,
      18,
      {
        align: "right"
      }
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(7);

    doc.setTextColor(
      203,
      213,
      225
    );

    doc.text(
      `Paciente: ${clienteNombre}`,
      14,
      25
    );

    /*
    ==========================================
    TABLA PÁGINA 2
    ==========================================
    */

    const table2X =
      14;

    const table2W =
      182;

    let table2Y =
      45;

    const table2HeaderH =
      10;

    const table2ColDescripcion =
      table2X + 6;

    const table2ColCantidad =
      table2X + 108;

    const table2ColPrecio =
      table2X + 145;

    const table2ColTotal =
      table2X + 176;

    /*
    Header
    */

    doc.setFillColor(
      azul[0],
      azul[1],
      azul[2]
    );

    doc.rect(
      table2X,
      table2Y,
      table2W,
      table2HeaderH,
      "F"
    );

    doc.setFontSize(8);

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setTextColor(
      255,
      255,
      255
    );

    doc.text(
      "Descripción",
      table2ColDescripcion,
      table2Y + 6.7
    );

    doc.text(
      "Cant.",
      table2ColCantidad,
      table2Y + 6.7,
      {
        align: "center"
      }
    );

    doc.text(
      "Precio unit.",
      table2ColPrecio,
      table2Y + 6.7,
      {
        align: "right"
      }
    );

    doc.text(
      "Importe",
      table2ColTotal,
      table2Y + 6.7,
      {
        align: "right"
      }
    );

    table2Y +=
      table2HeaderH;

    /*
    Filas
    */

    serviciosRestantes.forEach((s, index) => {

      const rowH =
        tratamiento
          ? 15
          : 13;

      const isAlt =
        index % 2 !== 0;

      if (isAlt) {

        doc.setFillColor(
          226,
          232,
          240
        );

      } else {

        doc.setFillColor(
          255,
          255,
          255
        );

      }

      doc.rect(
        table2X,
        table2Y,
        table2W,
        rowH,
        "F"
      );

      const nombreServicio =
        s.descripcion ||
        s.nombre_servicio ||
        s.nombre ||
        s.servicio ||
        "Servicio";

      const detalleServicio =
        s.detalle ||
        s.descripcion_servicio ||
        s.descripcion_catalogo ||
        s.observacion ||
        s.descripcion_larga ||
        (
          tratamiento
            ? "Tratamiento clínico"
            : "Servicio clínico"
        );
      const cantidad =
        Number(
          s.cantidad ||
          s.qty ||
          1
        );

      const montoServicio =
        Number(
          s.monto || 0
        );

      const precioUnitario =
        Number(
          s.precio_unitario ||
          s.precio ||
          (
            cantidad > 0
              ? montoServicio / cantidad
              : montoServicio
          )
        );

      const totalLinea =
        precioUnitario * cantidad;

      /*
      Servicio
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
        nombreServicio,
        table2ColDescripcion,
        table2Y + 5.5,
        {
          maxWidth: 85
        }
      );

      /*
      Subtexto
      */

      doc.setFontSize(5.8);

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
        detalleServicio,
        table2ColDescripcion,
        table2Y + 10,
        {
          maxWidth: 85
        }
      );


      if (tratamiento) {

        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.setTextColor(
          2,
          132,
          199
        );

        doc.text(
          `Sesión ${tratamiento.sesiones_completadas} de ${tratamiento.sesiones_totales}`,
          table2ColDescripcion,
          table2Y + 13.5,
          {
            maxWidth: 85
          }
        );

      }

      /*
      Valores
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
        String(cantidad),
        table2ColCantidad,
        table2Y + 7,
        {
          align: "center"
        }
      );

      doc.text(
        money(precioUnitario),
        table2ColPrecio,
        table2Y + 7,
        {
          align: "right"
        }
      );

      doc.text(
        money(totalLinea),
        table2ColTotal,
        table2Y + 7,
        {
          align: "right"
        }
      );

      table2Y +=
        rowH;

      /*
      Si se llena la página 2, crear otra página.
      Esto evita que las filas se salgan.
      */

      if (table2Y > 265) {

        doc.addPage();

        table2Y =
          25;

      }

    });

    /*
    ==========================================
    RESUMEN PÁGINA 2
    ==========================================
    */

    doc.setDrawColor(
      azul[0],
      azul[1],
      azul[2]
    );

    doc.setLineWidth(
      0.4
    );

    doc.line(
      table2X,
      table2Y + 4,
      table2X + table2W,
      table2Y + 4
    );

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
      "Total general de la factura:",
      table2X,
      table2Y + 14
    );

    doc.setTextColor(
      slate[0],
      slate[1],
      slate[2]
    );

    doc.text(
      money(total),
      table2X + table2W,
      table2Y + 14,
      {
        align: "right"
      }
    );

  }
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