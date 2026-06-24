import jsPDF from "jspdf";

import {
  parseFechaLocal
} from "./fecha";

import {
  formatMoney
} from "./format";

import dentalLogo from "../assets/dentalapp_logo_invoice_transparent_shadow.png";

import {
  showSuccess,
  showError
} from "../components/ui/ToastStyles";

import {
  save
} from "@tauri-apps/plugin-dialog";

import {
  writeFile
} from "@tauri-apps/plugin-fs";

import {
  openPath
} from "@tauri-apps/plugin-opener";

/*
==========================================
CONFIG
==========================================
*/

const CLINICA_NOMBRE =
  "CLÍNICA DENTAL SONRISA";

const CLINICA_SUBTITULO =
  "Odontología premium y estética dental";


const LOGO_PATHS = [
  dentalLogo
];


const COLORS = {
  headerBlue: [7, 83, 131],
  headerBlueDark: [3, 44, 75],
  blue: [0, 91, 150],
  navy: [15, 23, 42],
  text: [15, 23, 42],
  muted: [100, 116, 139],
  border: [203, 213, 225],
  softBorder: [226, 232, 240],
  rowAlt: [248, 250, 252],
  rowWhite: [255, 255, 255],
  summaryBlue: [37, 70, 180],
  summaryLight: [219, 234, 254],
  green: [0, 150, 95],
  red: [244, 63, 94],
  orange: [234, 88, 12],
  pink: [236, 72, 153],
  indigo: [67, 56, 202],
  black: [0, 0, 0]
};

/*
==========================================
HELPERS
==========================================
*/

const money = (value) => {

  return `RD$${formatMoney(
    Number(value) || 0
  )}`;

};

const percent = (value) => {

  return `${(
    Number(value) || 0
  ).toFixed(1)}%`;

};

const safeText = (
  value,
  fallback = "N/A"
) => {

  if (
    value === null ||
    value === undefined ||
    String(value).trim() === ""
  ) {

    return fallback;

  }

  return String(value).trim();

};

const truncateText = (
  text,
  max = 30
) => {

  const clean =
    safeText(text, "");

  if (clean.length <= max) {
    return clean;
  }

  return `${clean.substring(
    0,
    max - 3
  )}...`;

};

const getFechaIngreso = (ingreso) => {

  const raw =
    ingreso.created_at ||
    ingreso.fecha ||
    ingreso.fecha_pago;

  if (!raw) {
    return "N/A";
  }

  const fecha =
    parseFechaLocal(
      raw
    );

  if (isNaN(fecha)) {
    return "N/A";
  }

  return fecha.toLocaleDateString(
    "es-DO"
  );

};

const getPaciente = (ingreso) => {

  if (!ingreso?.cliente) {
    return "N/A";
  }

  return `${ingreso.cliente.nombre || ""} ${ingreso.cliente.apellido || ""}`.trim();

};

const getProcedimientos = (servicios = []) => {

  const nombres =
    servicios
      .map((s) =>
        s.descripcion ||
        s.nombre ||
        s.servicio?.nombre
      )
      .filter(Boolean);

  if (!nombres.length) {
    return "Sin procedimientos";
  }

  return nombres.join(", ");

};

const getEgresoMonto = (egreso) => {

  return (
    Number(egreso?.monto) ||
    Number(egreso?.total) ||
    Number(egreso?.valor) ||
    Number(egreso?.importe) ||
    0
  );

};

const calcularIngreso = (ingreso) => {

  const servicios =
    ingreso.servicios || [];

  const subtotal =
    servicios.reduce(
      (acc, s) =>
        acc + (
          Number(s.monto) || 0
        ),
      0
    );

  const costos =
    servicios.reduce(
      (acc, s) =>
        acc + (
          Number(s.costo_servicio) || 0
        ),
      0
    );

  const itbis =
    subtotal * 0.18;

  const descuentoPorcentaje =
    Number(ingreso.descuento) || 0;

  const descuento =
    subtotal *
    (
      descuentoPorcentaje / 100
    );

  const total =
    subtotal +
    itbis -
    descuento;

  const produccion =
    total -
    costos;

  return {
    subtotal,
    itbis,
    descuento,
    costos,
    produccion,
    total
  };

};

const loadImageAsBase64 = async (
  paths = []
) => {

  for (const path of paths) {

    try {

      const response =
        await fetch(path);

      if (!response.ok) {
        continue;
      }

      const blob =
        await response.blob();

      const type =
        blob.type.includes("jpeg") ||
          blob.type.includes("jpg")
          ? "JPEG"
          : "PNG";

      const base64 =
        await new Promise(
          (resolve, reject) => {

            const reader =
              new FileReader();

            reader.onloadend =
              () => resolve(reader.result);

            reader.onerror =
              reject;

            reader.readAsDataURL(
              blob
            );

          }
        );

      return {
        base64,
        type
      };

    } catch {

      continue;

    }

  }

  return null;

};

/*
==========================================
DRAW LOGO
==========================================
*/

const drawLogo = (
  doc,
  logo,
  x,
  y,
  size = 24
) => {

  if (logo?.base64) {

    try {

      doc.addImage(
        logo.base64,
        logo.type,
        x,
        y,
        size,
        size
      );

      return;

    } catch {

      // fallback

    }

  }

  /*
  Fallback simple tipo diente
  */

  doc.setFillColor(255, 255, 255);

  doc.circle(
    x + size / 2,
    y + size / 2,
    size / 2,
    "F"
  );

  doc.setTextColor(
    ...COLORS.headerBlue
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);

  doc.text(
    "🦷",
    x + size / 2,
    y + size / 2 + 4,
    {
      align: "center"
    }
  );

};

/*
==========================================
HEADER FORMAL
==========================================
*/

const drawHeader = (
  doc,
  {
    logo,
    title,
    subtitle
  }
) => {

  const pageWidth =
    doc.internal.pageSize.getWidth();

  /*
  Fondo header
  */

  doc.setFillColor(
    ...COLORS.headerBlue
  );

  doc.rect(
    0,
    0,
    pageWidth,
    34,
    "F"
  );

  /*
  Logo
  */

  drawLogo(
    doc,
    logo,
    18,
    5,
    24
  );

  /*
  Nombre clínica
  */

  doc.setTextColor(255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);

  doc.text(
    CLINICA_NOMBRE,
    50,
    15
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(219, 234, 254);

  doc.text(
    CLINICA_SUBTITULO,
    50,
    24
  );

  /*
  Bloque derecho
  */

  doc.setTextColor(255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);

  doc.text(
    title,
    pageWidth - 14,
    13,
    {
      align: "right"
    }
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(219, 234, 254);

  doc.text(
    subtitle,
    pageWidth - 14,
    21,
    {
      align: "right"
    }
  );

  doc.setFontSize(7);
  doc.setTextColor(255);

  doc.text(
    new Date().toLocaleDateString(
      "es-DO"
    ),
    pageWidth - 14,
    28,
    {
      align: "right"
    }
  );

};

/*
==========================================
FOOTER
==========================================
*/

const drawFooter = (
  doc,
  pageNumber
) => {

  const pageWidth =
    doc.internal.pageSize.getWidth();

  const pageHeight =
    doc.internal.pageSize.getHeight();

  doc.setDrawColor(
    ...COLORS.softBorder
  );

  doc.line(
    12,
    pageHeight - 12,
    pageWidth - 12,
    pageHeight - 12
  );

  doc.setTextColor(
    ...COLORS.muted
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);

  doc.text(
    "Documento generado automáticamente por el sistema clínico",
    12,
    pageHeight - 6
  );

  doc.text(
    `Página ${pageNumber}`,
    pageWidth - 12,
    pageHeight - 6,
    {
      align: "right"
    }
  );

};

/*
==========================================
SECTION TITLE
==========================================
*/

const drawSectionTitle = (
  doc,
  title,
  subtitle,
  y
) => {

  doc.setTextColor(
    ...COLORS.text
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);

  doc.text(
    title,
    12,
    y
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(
    ...COLORS.muted
  );

  doc.text(
    subtitle,
    12,
    y + 6
  );

};

/*
==========================================
DETAIL TABLE CONFIG
==========================================
*/

const TABLE = {
  x: 8,
  width: 281,
  headerHeight: 11,
  rowMinHeight: 10,
  bottomLimit: 190,

  cols: {
    fecha: {
      x: 10,
      w: 21,
      label: "Fecha",
      align: "left"
    },
    paciente: {
      x: 33,
      w: 39,
      label: "Paciente",
      align: "left"
    },
    procedimientos: {
      x: 74,
      w: 58,
      label: "Procedimientos",
      align: "left"
    },
    subtotal: {
      x: 136,
      w: 25,
      label: "Subtotal",
      align: "right"
    },
    itbis: {
      x: 164,
      w: 22,
      label: "ITBIS",
      align: "right"
    },
    descuento: {
      x: 189,
      w: 24,
      label: "Descuento",
      align: "right"
    },
    costos: {
      x: 216,
      w: 23,
      label: "Costos",
      align: "right"
    },
    produccion: {
      x: 242,
      w: 25,
      label: "Producción",
      align: "right"
    },
    total: {
      x: 270,
      w: 17,
      label: "Total",
      align: "right"
    }
  }
};

const textX = (col) => {

  return col.align === "right"
    ? col.x + col.w - 1
    : col.x + 1;

};

const drawTableHeader = (
  doc,
  y
) => {

  doc.setFillColor(
    ...COLORS.navy
  );

  doc.rect(
    TABLE.x,
    y,
    TABLE.width,
    TABLE.headerHeight,
    "F"
  );

  doc.setTextColor(255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.3);

  Object.values(TABLE.cols).forEach((col) => {

    doc.text(
      col.label,
      textX(col),
      y + 7,
      {
        align: col.align
      }
    );

  });

  /*
  Separadores sutiles
  */

  doc.setDrawColor(
    30,
    64,
    100
  );

  Object.values(TABLE.cols).forEach((col) => {

    if (col.x > TABLE.x + 3) {

      doc.line(
        col.x - 1.5,
        y + 2,
        col.x - 1.5,
        y + TABLE.headerHeight - 2
      );

    }

  });

  return y + TABLE.headerHeight;

};

const drawTableRow = (
  doc,
  ingreso,
  index,
  y
) => {

  const {
    subtotal,
    itbis,
    descuento,
    costos,
    produccion,
    total
  } = calcularIngreso(
    ingreso
  );

  const servicios =
    ingreso.servicios || [];

  const fecha =
    getFechaIngreso(
      ingreso
    );

  const paciente =
    getPaciente(
      ingreso
    );

  const procedimientos =
    getProcedimientos(
      servicios
    );

  const procedimientoLines =
    doc.splitTextToSize(
      procedimientos,
      TABLE.cols.procedimientos.w - 3
    );

  const visibleLines =
    procedimientoLines.slice(
      0,
      2
    );

  const rowHeight =
    visibleLines.length > 1
      ? 13
      : TABLE.rowMinHeight;

  doc.setFillColor(
    ...(index % 2 === 0
      ? COLORS.rowWhite
      : COLORS.rowAlt)
  );

  doc.rect(
    TABLE.x,
    y,
    TABLE.width,
    rowHeight,
    "F"
  );

  doc.setDrawColor(
    ...COLORS.softBorder
  );

  doc.line(
    TABLE.x,
    y + rowHeight,
    TABLE.x + TABLE.width,
    y + rowHeight
  );

  /*
  Separadores verticales suaves
  */

  doc.setDrawColor(
    235,
    240,
    246
  );

  Object.values(TABLE.cols).forEach((col) => {

    if (col.x > TABLE.x + 3) {

      doc.line(
        col.x - 1.5,
        y,
        col.x - 1.5,
        y + rowHeight
      );

    }

  });

  const amountY =
    y + 6.3;

  doc.setFontSize(5.8);

  /*
  Fecha
  */

  doc.setFont("helvetica", "normal");
  doc.setTextColor(
    ...COLORS.muted
  );

  doc.text(
    fecha,
    TABLE.cols.fecha.x + 1,
    amountY
  );

  /*
  Paciente
  */

  doc.setFont("helvetica", "bold");
  doc.setTextColor(
    ...COLORS.text
  );

  doc.text(
    truncateText(
      paciente,
      21
    ),
    TABLE.cols.paciente.x + 1,
    amountY
  );

  /*
  Procedimientos
  */

  doc.setFont("helvetica", "normal");
  doc.setTextColor(
    51,
    65,
    85
  );

  doc.text(
    visibleLines,
    TABLE.cols.procedimientos.x + 1,
    y + 5.4
  );

  /*
  Montos
  */

  doc.setFont("helvetica", "normal");
  doc.setTextColor(
    ...COLORS.text
  );

  doc.text(
    money(subtotal),
    textX(TABLE.cols.subtotal),
    amountY,
    {
      align: "right"
    }
  );

  doc.text(
    money(itbis),
    textX(TABLE.cols.itbis),
    amountY,
    {
      align: "right"
    }
  );

  doc.setTextColor(
    ...COLORS.pink
  );

  doc.text(
    money(descuento),
    textX(TABLE.cols.descuento),
    amountY,
    {
      align: "right"
    }
  );

  doc.setTextColor(
    ...COLORS.orange
  );

  doc.text(
    money(costos),
    textX(TABLE.cols.costos),
    amountY,
    {
      align: "right"
    }
  );

  doc.setTextColor(
    ...COLORS.indigo
  );

  doc.setFont("helvetica", "bold");

  doc.text(
    money(produccion),
    textX(TABLE.cols.produccion),
    amountY,
    {
      align: "right"
    }
  );

  doc.setTextColor(
    ...COLORS.green
  );

  doc.text(
    money(total),
    textX(TABLE.cols.total),
    amountY,
    {
      align: "right"
    }
  );

  return y + rowHeight;

};

/*
==========================================
SUMMARY PAGE
==========================================
*/

const drawSummaryPage = (
  doc,
  {
    logo,
    tipo,
    totals,
    egresosTotales,
    clientesCount,
    facturasCount,
    egresosCount,
    pageNumber
  }
) => {

  const pageWidth =
    doc.internal.pageSize.getWidth();

  drawHeader(
    doc,
    {
      logo,
      title: "Resumen financiero clínico",
      subtitle: "Estado financiero general"
    }
  );

  drawSectionTitle(
    doc,
    "Resumen financiero clínico",
    "Estado financiero general de ingresos, costos, egresos, descuentos y rentabilidad",
    50
  );

  doc.setFontSize(8);
  doc.setTextColor(
    ...COLORS.muted
  );

  const tipoLabelMap = {
    semanal: "Semanal",
    mensual: "Mensual",
    anual: "Anual"
  };

  doc.text(
    `Tipo de reporte: ${tipoLabelMap[tipo] || "General"}`,
    12,
    65
  );

  doc.text(
    `Facturas incluidas: ${facturasCount}`,
    12,
    71
  );

  doc.text(
    `Pacientes únicos: ${clientesCount}`,
    12,
    77
  );

  doc.text(
    `Egresos registrados: ${egresosCount}`,
    12,
    83
  );

  const tableX =
    52;

  const tableY =
    96;

  const tableW =
    194;

  const col1W =
    118;

  const col2W =
    tableW - col1W;

  const utilidadNeta =
    totals.produccion -
    egresosTotales;

  const rentabilidad =
    totals.total > 0
      ? (
        utilidadNeta /
        totals.total
      ) * 100
      : 0;

  const rows = [
    {
      concept: "Ingresos clínicos",
      value: money(totals.total),
      color: COLORS.green
    },
    {
      concept: "Costos clínicos",
      value: money(totals.costos),
      color: COLORS.orange
    },
    {
      concept: "Egresos operativos",
      value: money(egresosTotales),
      color: COLORS.red
    },
    {
      concept: "Descuentos aplicados",
      value: money(totals.descuento),
      color: COLORS.pink
    },
    {
      concept: "Producción operativa",
      value: money(totals.produccion),
      color: COLORS.indigo
    },
    {
      concept: "Utilidad neta final",
      value: money(utilidadNeta),
      color: COLORS.blue,
      highlight: true
    },
    {
      concept: "Rentabilidad %",
      value: percent(rentabilidad),
      color: COLORS.green
    }
  ];

  doc.setFillColor(
    ...COLORS.summaryBlue
  );

  doc.rect(
    tableX,
    tableY,
    tableW,
    12,
    "F"
  );

  doc.setDrawColor(
    ...COLORS.black
  );

  doc.rect(
    tableX,
    tableY,
    tableW,
    12
  );

  doc.line(
    tableX + col1W,
    tableY,
    tableX + col1W,
    tableY + 12
  );

  doc.setTextColor(255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);

  doc.text(
    "Concepto",
    tableX + col1W / 2,
    tableY + 8,
    {
      align: "center"
    }
  );

  doc.text(
    "Valor",
    tableX + col1W + col2W / 2,
    tableY + 8,
    {
      align: "center"
    }
  );

  let y =
    tableY + 12;

  rows.forEach((row) => {

    doc.setFillColor(
      ...(row.highlight
        ? COLORS.summaryLight
        : [255, 255, 255])
    );

    doc.rect(
      tableX,
      y,
      tableW,
      12,
      "F"
    );

    doc.setDrawColor(
      ...COLORS.black
    );

    doc.rect(
      tableX,
      y,
      tableW,
      12
    );

    doc.line(
      tableX + col1W,
      y,
      tableX + col1W,
      y + 12
    );

    doc.setTextColor(
      ...COLORS.text
    );

    doc.setFont(
      "helvetica",
      row.highlight
        ? "bold"
        : "normal"
    );

    doc.setFontSize(8.5);

    doc.text(
      row.concept,
      tableX + 3,
      y + 8
    );

    doc.setTextColor(
      ...row.color
    );

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.text(
      row.value,
      tableX + tableW - 3,
      y + 8,
      {
        align: "right"
      }
    );

    y += 12;

  });

  doc.setTextColor(
    ...COLORS.muted
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);

  doc.text(
    "Producción operativa = ingresos clínicos - costos clínicos. Utilidad neta = producción operativa - egresos operativos.",
    pageWidth / 2,
    y + 14,
    {
      align: "center"
    }
  );

  drawFooter(
    doc,
    pageNumber
  );

};

/*
==========================================
GENERAR REPORTE
==========================================
*/

export const generarReporte = async ({
  ingresos = [],
  egresos = [],
  tipo = "mensual",
  fileName = "reporte.pdf"
}) => {

  if (!Array.isArray(ingresos)) {
    ingresos = [];
  }

  if (!Array.isArray(egresos)) {
    egresos = [];
  }

  console.log(
    "PDF REPORTE - INGRESOS:",
    ingresos
  );

  console.log(
    "PDF REPORTE - EGRESOS:",
    egresos
  );

  const logo =
    await loadImageAsBase64(
      LOGO_PATHS
    );

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4"
  });

  const totals =
    ingresos.reduce(
      (acc, ingreso) => {

        const calc =
          calcularIngreso(
            ingreso
          );

        acc.subtotal += calc.subtotal;
        acc.itbis += calc.itbis;
        acc.descuento += calc.descuento;
        acc.costos += calc.costos;
        acc.produccion += calc.produccion;
        acc.total += calc.total;

        return acc;

      },
      {
        subtotal: 0,
        itbis: 0,
        descuento: 0,
        costos: 0,
        produccion: 0,
        total: 0
      }
    );

  const egresosTotales =
    egresos.reduce(
      (acc, egreso) =>
        acc + getEgresoMonto(
          egreso
        ),
      0
    );

  const clientesUnicos =
    new Set();

  ingresos.forEach((ingreso) => {

    if (ingreso.cliente_id) {

      clientesUnicos.add(
        ingreso.cliente_id
      );

    } else if (ingreso.cliente?.id) {

      clientesUnicos.add(
        ingreso.cliente.id
      );

    }

  });

  /*
  ==========================================
  PÁGINA 1: DETALLE
  ==========================================
  */

  let pageNumber = 1;

  drawHeader(
    doc,
    {
      logo,
      title: "Detalle financiero clínico",
      subtitle: "Facturación y producción odontológica"
    }
  );

  drawSectionTitle(
    doc,
    "Detalle financiero clínico",
    "Tabla completa de facturación, costos, producción y totales",
    50
  );

  let y = 66;

  y =
    drawTableHeader(
      doc,
      y
    );

  ingresos.forEach(
    (ingreso, index) => {

      const procedimientos =
        getProcedimientos(
          ingreso.servicios || []
        );

      const lines =
        doc.splitTextToSize(
          procedimientos,
          TABLE.cols.procedimientos.w - 3
        );

      const rowHeight =
        Math.min(
          lines.length,
          2
        ) > 1
          ? 13
          : TABLE.rowMinHeight;

      if (y + rowHeight > TABLE.bottomLimit) {

        drawFooter(
          doc,
          pageNumber
        );

        doc.addPage();

        pageNumber += 1;

        drawHeader(
          doc,
          {
            logo,
            title: "Detalle financiero clínico",
            subtitle: "Continuación"
          }
        );

        y = 44;

        y =
          drawTableHeader(
            doc,
            y
          );

      }

      y =
        drawTableRow(
          doc,
          ingreso,
          index,
          y
        );

    }
  );

  /*
  ==========================================
  TOTAL GENERAL
  ==========================================
  */

  if (y + 16 > TABLE.bottomLimit) {

    drawFooter(
      doc,
      pageNumber
    );

    doc.addPage();

    pageNumber += 1;

    drawHeader(
      doc,
      {
        logo,
        title: "Detalle financiero clínico",
        subtitle: "Totales"
      }
    );

    y = 48;

  }

  doc.setFillColor(
    220,
    252,
    231
  );

  doc.rect(
    TABLE.x,
    y + 4,
    TABLE.width,
    13,
    "F"
  );

  doc.setDrawColor(
    ...COLORS.border
  );

  doc.rect(
    TABLE.x,
    y + 4,
    TABLE.width,
    13
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.8);
  doc.setTextColor(
    ...COLORS.text
  );

  doc.text(
    "TOTAL GENERAL",
    TABLE.cols.paciente.x + 1,
    y + 12
  );

  doc.text(
    money(totals.subtotal),
    textX(TABLE.cols.subtotal),
    y + 12,
    {
      align: "right"
    }
  );

  doc.text(
    money(totals.itbis),
    textX(TABLE.cols.itbis),
    y + 12,
    {
      align: "right"
    }
  );

  doc.setTextColor(
    ...COLORS.pink
  );

  doc.text(
    money(totals.descuento),
    textX(TABLE.cols.descuento),
    y + 12,
    {
      align: "right"
    }
  );

  doc.setTextColor(
    ...COLORS.orange
  );

  doc.text(
    money(totals.costos),
    textX(TABLE.cols.costos),
    y + 12,
    {
      align: "right"
    }
  );

  doc.setTextColor(
    ...COLORS.indigo
  );

  doc.text(
    money(totals.produccion),
    textX(TABLE.cols.produccion),
    y + 12,
    {
      align: "right"
    }
  );

  doc.setTextColor(
    ...COLORS.green
  );

  doc.text(
    money(totals.total),
    textX(TABLE.cols.total),
    y + 12,
    {
      align: "right"
    }
  );

  drawFooter(
    doc,
    pageNumber
  );

  /*
  ==========================================
  PÁGINA RESUMEN
  ==========================================
  */

  doc.addPage();

  pageNumber += 1;

  drawSummaryPage(
    doc,
    {
      logo,
      tipo,
      totals,
      egresosTotales,
      clientesCount: clientesUnicos.size,
      facturasCount: ingresos.length,
      egresosCount: egresos.length,
      pageNumber
    }
  );

  /*
  ==========================================
  SAVE
  ==========================================
  */

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
          fileName

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

    showSuccess(
      "Reporte PDF guardado ✅"
    );

    try {

      await openPath(
        filePath
      );

    } catch (openErr) {

      console.error(
        "ERROR OPEN PDF:",
        openErr
      );

    }

  } catch (err) {

    console.error(
      "ERROR PDF:",
      err
    );

    showError(
      "Error generando PDF ❌"
    );

  }

};