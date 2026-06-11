import jsPDF from "jspdf";

import {
  parseFechaLocal
} from "./fecha";

import {
  formatMoney
} from "./format";

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

  /*
  ==========================================
  PDF
  ==========================================
  */

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4"
  });

  const pageWidth =
    doc.internal.pageSize.getWidth();

  let y = 20;

  /*
  ==========================================
  TITULOS
  ==========================================
  */

  const tituloMap = {

    semanal:
      "Reporte Semanal",

    mensual:
      "Reporte Mensual",

    anual:
      "Reporte Anual"

  };

  /*
  ==========================================
  CALCULOS
  ==========================================
  */

  let ingresosTotales = 0;

  let costosClinicos = 0;

  let descuentosTotales = 0;

  const clientesUnicos =
    new Set();

  ingresos.forEach((i) => {

    const servicios =
      i.servicios || [];

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
            Number(
              s.costo_servicio
            ) || 0
          ),
        0
      );

    const itbis =
      subtotal * 0.18;

    const descuentoValor =
      subtotal * (
        (i.descuento || 0) / 100
      );

    const total =
      subtotal +
      itbis -
      descuentoValor;

    ingresosTotales += total;

    costosClinicos += costos;

    descuentosTotales +=
      descuentoValor;

    if (i.cliente_id) {

      clientesUnicos.add(
        i.cliente_id
      );

    }

  });

  const egresosTotales =
    egresos.reduce(
      (acc, e) =>
        acc + (
          Number(e.monto) || 0
        ),
      0
    );

  const utilidadNeta =
    ingresosTotales -
    costosClinicos -
    egresosTotales -
    descuentosTotales;

  const rentabilidad =
    ingresosTotales > 0
      ? (
          utilidadNeta /
          ingresosTotales
        ) * 100
      : 0;

  /*
  ==========================================
  WATERMARK
  ==========================================
  */

  doc.setTextColor(245);

  doc.setFontSize(80);

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.text(
    "SONRISA",
    90,
    140,
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
    297,
    35,
    "F"
  );

  /*
  ==========================================
  LOGO
  ==========================================
  */

  doc.setFillColor(
    99,
    102,
    241
  );

  doc.circle(
    22,
    17,
    10,
    "F"
  );

  doc.setTextColor(255);

  doc.setFontSize(17);

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.text(
    "DS",
    22,
    20,
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
    148,
    15,
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
    "Sistema financiero clínico",
    148,
    22,
    {
      align: "center"
    }
  );

  /*
  ==========================================
  FECHA
  ==========================================
  */

  doc.setTextColor(255);

  doc.setFontSize(9);

  doc.text(
    new Date().toLocaleDateString(
      "es-DO"
    ),
    280,
    18,
    {
      align: "right"
    }
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
  TITULO REPORTE
  ==========================================
  */

  y = 52;

  doc.setFontSize(22);

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.text(
    tituloMap[tipo] ||
    "Reporte",
    20,
    y
  );

  doc.setFontSize(10);

  doc.setTextColor(120);

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.text(
    "Estado financiero general de la clínica",
    20,
    y + 8
  );

  /*
  ==========================================
  RESUMEN FINANCIERO
  ==========================================
  */

  y += 20;

  const resumen = [

    {
      title:
        "Ingresos clínicos",

      subtitle:
        "Facturación total registrada",

      amount:
        `RD$ ${formatMoney(
          ingresosTotales
        )}`,

      color:
        [16, 185, 129]
    },

    {
      title:
        "Costos clínicos",

      subtitle:
        "Materiales y procedimientos",

      amount:
        `- RD$ ${formatMoney(
          costosClinicos
        )}`,

      color:
        [249, 115, 22]
    },

    {
      title:
        "Egresos operativos",

      subtitle:
        "Gastos administrativos",

      amount:
        `- RD$ ${formatMoney(
          egresosTotales
        )}`,

      color:
        [244, 63, 94]
    },

    {
      title:
        "Descuentos aplicados",

      subtitle:
        "Promociones y ajustes",

      amount:
        `- RD$ ${formatMoney(
          descuentosTotales
        )}`,

      color:
        [236, 72, 153]
    }

  ];

  resumen.forEach((r) => {

    doc.setFillColor(
      248,
      250,
      252
    );

    doc.roundedRect(
      15,
      y,
      267,
      22,
      6,
      6,
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
      267,
      22,
      6,
      6
    );

    doc.setFillColor(
      ...r.color
    );

    doc.circle(
      28,
      y + 11,
      5,
      "F"
    );

    doc.setTextColor(
      30,
      41,
      59
    );

    doc.setFontSize(11);

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.text(
      r.title,
      38,
      y + 9
    );

    doc.setTextColor(120);

    doc.setFontSize(9);

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.text(
      r.subtitle,
      38,
      y + 15
    );

    doc.setTextColor(
      ...r.color
    );

    doc.setFontSize(15);

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.text(
      r.amount,
      275,
      y + 13,
      {
        align: "right"
      }
    );

    y += 28;

  });

/*
==========================================
UTILIDAD NETA FINAL
==========================================
*/

y += 4;

doc.setFillColor(
  8,
  15,
  35
);

doc.roundedRect(
  15,
  y,
  267,
  28,
  8,
  8,
  "F"
);

/*
==========================================
TITLE
==========================================
*/

doc.setTextColor(255);

doc.setFontSize(10);

doc.setFont(
  "helvetica",
  "bold"
);

doc.text(
  "Utilidad neta final",
  28,
  y + 10
);

/*
==========================================
SUBTITLE
==========================================
*/

doc.setFontSize(7);

doc.setFont(
  "helvetica",
  "normal"
);

doc.setTextColor(
  180,
  190,
  210
);

doc.text(
  "Resultado operativo actual",
  28,
  y + 17
);

/*
==========================================
UTILIDAD
==========================================
*/

doc.setTextColor(
  99,
  102,
  241
);

doc.setFontSize(18);

doc.setFont(
  "helvetica",
  "bold"
);

doc.text(
  `RD$ ${formatMoney(
    utilidadNeta
  )}`,
  270,
  y + 12,
  {
    align: "right"
  }
);

/*
==========================================
RENTABILIDAD
==========================================
*/

doc.setTextColor(
  16,
  185,
  129
);

doc.setFontSize(8);

doc.setFont(
  "helvetica",
  "bold"
);

doc.text(
  `Rentabilidad ${rentabilidad.toFixed(1)}%`,
  270,
  y + 19,
  {
    align: "right"
  }
);

 /*
==========================================
UTILIDAD NETA FINAL
FIX VISIBILIDAD
==========================================
*/

y += 6;

doc.setFillColor(
  15,
  23,
  42
);

doc.roundedRect(
  15,
  y,
  267,
  32,
  8,
  8,
  "F"
);

doc.setTextColor(255);

doc.setFontSize(11);

doc.setFont(
  "helvetica",
  "bold"
);

doc.text(
  "Utilidad neta final",
  25,
  y + 11
);

doc.setFontSize(8);

doc.setFont(
  "helvetica",
  "normal"
);

doc.text(
  "Resultado operativo actual",
  25,
  y + 18
);

doc.setFontSize(20);

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
  `RD$ ${formatMoney(
    utilidadNeta
  )}`,
  272,
  y + 14,
  {
    align: "right"
  }
);

doc.setFontSize(9);

doc.setTextColor(
  16,
  185,
  129
);

doc.text(
  `Rentabilidad ${rentabilidad.toFixed(1)}%`,
  272,
  y + 24,
  {
    align: "right"
  }
);

/*
==========================================
NUEVA PAGINA
==========================================
*/

doc.addPage();

y = 20;

/*
==========================================
TITLE
==========================================
*/

doc.setTextColor(
  15,
  23,
  42
);

doc.setFontSize(18);

doc.setFont(
  "helvetica",
  "bold"
);

doc.text(
  "Detalle financiero clínico",
  20,
  y
);

doc.setFontSize(9);

doc.setTextColor(120);

doc.setFont(
  "helvetica",
  "normal"
);

doc.text(
  "Facturación y producción odontológica",
  20,
  y + 7
);

/*
==========================================
CARD BG
==========================================
*/

y += 18;

doc.setFillColor(
  248,
  250,
  252
);

doc.roundedRect(
  10,
  y - 8,
  277,
  160,
  8,
  8,
  "F"
);

/*
==========================================
COLUMNAS
==========================================
*/

const colFecha = 14;

const colPaciente = 32;

const colProcedimientos = 58;

const colSubtotal = 160;

const colItbis = 182;

const colDesc = 198;

const colCostos = 214;

const colProduccion = 248;

const colTotal = 282;

/*
==========================================
HEADER BG
==========================================
*/

doc.setFillColor(
  255,
  255,
  255
);

doc.roundedRect(
  12,
  y,
  273,
  10,
  4,
  4,
  "F"
);

/*
==========================================
HEADERS
==========================================
*/

doc.setTextColor(120);

doc.setFontSize(6);

doc.setFont(
  "helvetica",
  "bold"
);

doc.text(
  "FECHA",
  colFecha,
  y + 6.5
);

doc.text(
  "PACIENTE",
  colPaciente,
  y + 6.5
);

doc.text(
  "PROCEDIMIENTOS",
  colProcedimientos,
  y + 6.5
);

doc.text(
  "SUBTOTAL",
  colSubtotal,
  y + 6.5
);

doc.text(
  "ITBIS",
  colItbis,
  y + 6.5
);

doc.text(
  "DESC.",
  colDesc,
  y + 6.5
);

doc.text(
  "COSTOS",
  colCostos,
  y + 6.5
);

doc.text(
  "PRODUCCIÓN",
  colProduccion,
  y + 6.5,
  {
    align: "right"
  }
);

doc.text(
  "TOTAL",
  colTotal,
  y + 6.5,
  {
    align: "right"
  }
);

y += 13;

/*
==========================================
ROWS
==========================================
*/

ingresos.forEach(
  (i, index) => {

    /*
    ==========================================
    PAGINA NUEVA
    ==========================================
    */

    if (y > 185) {

      doc.addPage();

      y = 20;

    }

    /*
    ==========================================
    CALCULOS
    ==========================================
    */

    const servicios =
      i.servicios || [];

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
            Number(
              s.costo_servicio
            ) || 0
          ),
        0
      );

    const itbis =
      subtotal * 0.18;

    const descuentoValor =
      subtotal * (
        (i.descuento || 0) / 100
      );

    const total =
      subtotal +
      itbis -
      descuentoValor;

    const produccion =
      total - costos;

    /*
    ==========================================
    FECHA
    ==========================================
    */

    let fecha = "N/A";

    if (i.created_at) {

      const f =
        parseFechaLocal(
          i.created_at
        );

      if (!isNaN(f)) {

        fecha =
          f.toLocaleDateString(
            "es-DO"
          );

      }

    }

    /*
    ==========================================
    CLIENTE
    ==========================================
    */

    const cliente =
      i.cliente
        ? `${i.cliente.nombre || ""} ${i.cliente.apellido || ""}`
        : "N/A";

    /*
    ==========================================
    PROCEDIMIENTOS
    ==========================================
    */

    const procedimientos =
      servicios
        .map(
          s => s.descripcion
        )
        .join(", ");

    /*
    ==========================================
    ROW BG
    ==========================================
    */

    if (index % 2 === 0) {

      doc.setFillColor(
        255,
        255,
        255
      );

      doc.roundedRect(
        12,
        y - 4,
        273,
        8,
        2,
        2,
        "F"
      );

    }

    /*
    ==========================================
    FONT
    ==========================================
    */

    doc.setFontSize(6);

    /*
    ==========================================
    FECHA
    ==========================================
    */

    doc.setTextColor(100);

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.text(
      fecha,
      colFecha,
      y
    );

    /*
    ==========================================
    CLIENTE
    ==========================================
    */

    doc.setTextColor(
      30,
      41,
      59
    );

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.text(
      cliente.substring(
        0,
        15
      ),
      colPaciente,
      y
    );

    /*
    ==========================================
    PROCEDIMIENTOS
    ==========================================
    */

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setTextColor(90);

    doc.text(
      procedimientos.substring(
        0,
        30
      ),
      colProcedimientos,
      y
    );

    /*
    ==========================================
    SUBTOTAL
    ==========================================
    */

    doc.setTextColor(
      71,
      85,
      105
    );

    doc.text(
      formatMoney(
        subtotal
      ),
      colSubtotal,
      y
    );

    /*
    ==========================================
    ITBIS
    ==========================================
    */

    doc.text(
      formatMoney(
        itbis
      ),
      colItbis,
      y
    );

    /*
    ==========================================
    DESCUENTO
    ==========================================
    */

    doc.setTextColor(
      236,
      72,
      153
    );

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.text(
      formatMoney(
        descuentoValor
      ),
      colDesc,
      y
    );

    /*
    ==========================================
    COSTOS
    ==========================================
    */

    doc.setTextColor(
      249,
      115,
      22
    );

    doc.text(
      formatMoney(
        costos
      ),
      colCostos,
      y
    );

    /*
    ==========================================
    PRODUCCION
    ==========================================
    */

    doc.setTextColor(
      99,
      102,
      241
    );

    doc.text(
      formatMoney(
        produccion
      ),
      colProduccion,
      y,
      {
        align: "right"
      }
    );

    /*
    ==========================================
    TOTAL
    ==========================================
    */

    doc.setTextColor(
      16,
      185,
      129
    );

    doc.text(
      formatMoney(
        total
      ),
      colTotal,
      y,
      {
        align: "right"
      }
    );

    /*
    ==========================================
    NEXT ROW
    ==========================================
    */

    y += 8;

  }
);

/*
==========================================
TOTAL GENERAL
==========================================
*/

y += 8;

doc.setDrawColor(
  226,
  232,
  240
);

doc.line(
  205,
  y,
  282,
  y
);

y += 8;

doc.setTextColor(
  30,
  41,
  59
);

doc.setFontSize(9);

doc.setFont(
  "helvetica",
  "bold"
);

doc.text(
  "Total General",
  232,
  y
);

doc.setTextColor(
  16,
  185,
  129
);

doc.setFontSize(11);

doc.text(
  `RD$ ${formatMoney(
    ingresosTotales
  )}`,
  282,
  y,
  {
    align: "right"
  }
);

  /*
  ==========================================
  FOOTER
  ==========================================
  */

  doc.setDrawColor(
    99,
    102,
    241
  );

  doc.setLineWidth(0.8);

  doc.line(
    20,
    200,
    277,
    200
  );

  doc.setFontSize(8);

  doc.setTextColor(120);

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.text(
    "Clínica Dental Sonrisa • Reporte financiero premium",
    pageWidth / 2,
    207,
    {
      align: "center"
    }
  );

  doc.text(
    "Documento generado automáticamente",
    pageWidth / 2,
    212,
    {
      align: "center"
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