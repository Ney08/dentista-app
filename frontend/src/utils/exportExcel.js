import ExcelJS from "exceljs";

import {
  save
} from "@tauri-apps/plugin-dialog";

import {
  writeFile
} from "@tauri-apps/plugin-fs";

import toast from "react-hot-toast";

export async function exportToExcel(
  data = [],
  egresos = [],
  nombreArchivo = "reporte"
) {

  /*
  ==========================================
  VALIDACIONES
  ==========================================
  */

  if (!Array.isArray(data)) {
    data = [];
  }

  if (!Array.isArray(egresos)) {
    egresos = [];
  }

  /*
  ==========================================
  WORKBOOK
  ==========================================
  */

  const workbook =
    new ExcelJS.Workbook();

  workbook.creator =
    "Clinica Dental Sonrisa";

  workbook.created =
    new Date();

  /*
  ==========================================
  CALCULOS
  ==========================================
  */

  const totalSubtotal =
    data.reduce(
      (a, b) =>
        a + (
          Number(
            b.Subtotal
          ) || 0
        ),
      0
    );

  const totalItbis =
    data.reduce(
      (a, b) =>
        a + (
          Number(
            b.ITBIS
          ) || 0
        ),
      0
    );

  const totalDesc =
    data.reduce(
      (a, b) =>
        a + (
          Number(
            b.Descuento
          ) || 0
        ),
      0
    );

  const totalCostos =
    data.reduce(
      (a, b) =>
        a + (
          Number(
            b.Costos
          ) || 0
        ),
      0
    );

  const totalProduccion =
    data.reduce(
      (a, b) =>
        a + (
          Number(
            b.Utilidad
          ) || 0
        ),
      0
    );

  const totalGeneral =
    data.reduce(
      (a, b) =>
        a + (
          Number(
            b.Total
          ) || 0
        ),
      0
    );

  const totalEgresos =
    egresos.reduce(
      (acc, e) =>
        acc + (
          Number(
            e.monto
          ) || 0
        ),
      0
    );

  const utilidadNeta =
    totalProduccion -
    totalEgresos;

  const rentabilidad =
    totalGeneral > 0
      ? (
        utilidadNeta /
        totalGeneral
      ) * 100
      : 0;

  /*
  ==========================================
  HOJA DETALLE
  ==========================================
  */

  const sheet =
    workbook.addWorksheet(
      "Detalle financiero"
    );

  sheet.views = [
    {
      state: "frozen",
      ySplit: 1
    }
  ];

  /*
  ==========================================
  COLUMNAS
  ==========================================
  */

  sheet.columns = [

    {
      header: "Fecha",
      key: "FechaStr",
      width: 14
    },

    {
      header: "Paciente",
      key: "Paciente",
      width: 28
    },

    {
      header: "Procedimientos",
      key: "Tratamientos",
      width: 42
    },

    {
      header: "Subtotal",
      key: "Subtotal",
      width: 18
    },

    {
      header: "ITBIS",
      key: "ITBIS",
      width: 18
    },

    {
      header: "Descuento",
      key: "Descuento",
      width: 18
    },

    {
      header: "Costos",
      key: "Costos",
      width: 18
    },

    {
      header: "Producción",
      key: "Utilidad",
      width: 18
    },

    {
      header: "Total",
      key: "Total",
      width: 18
    }

  ];

  /*
  ==========================================
  HEADER
  ==========================================
  */

  const header =
    sheet.getRow(1);

  header.height = 28;

  for (
    let col = 1;
    col <= 9;
    col++
  ) {

    const cell =
      header.getCell(col);

    cell.font = {

      bold: true,

      size: 11,

      color: {
        argb:
          "FFFFFFFF"
      }

    };

    cell.fill = {

      type:
        "pattern",

      pattern:
        "solid",

      fgColor: {
        argb:
          "FF0F172A"
      }

    };

    cell.alignment = {

      vertical:
        "middle",

      horizontal:
        "center"

    };

    cell.border = {

      top: {
        style:
          "thin"
      },

      left: {
        style:
          "thin"
      },

      bottom: {
        style:
          "thin"
      },

      right: {
        style:
          "thin"
      }

    };

  }

  /*
  ==========================================
  DATA
  ==========================================
  */

  data.forEach((d) => {

    const row =
      sheet.addRow({

        ...d,

        Tratamientos:
          d.Tratamientos ||
          "N/A"

      });

    row.height = 24;

  });

  /*
  ==========================================
  FORMATOS
  ==========================================
  */

  [
    "D",
    "E",
    "F",
    "G",
    "H",
    "I"
  ].forEach((col) => {

    sheet.getColumn(
      col
    ).numFmt =
      '"RD$"#,##0.00';

  });

  /*
  ==========================================
  ALIGNMENTS
  ==========================================
  */

  sheet.getColumn(
    "A"
  ).alignment = {

    horizontal:
      "center"

  };

  [
    "D",
    "E",
    "F",
    "G",
    "H",
    "I"
  ].forEach((col) => {

    sheet.getColumn(
      col
    ).alignment = {

      horizontal:
        "right"

    };

  });

  /*
  ==========================================
  STYLES
  ==========================================
  */

  sheet.eachRow(
    (
      row,
      rowNumber
    ) => {

      if (
        rowNumber === 1
      ) {
        return;
      }

      row.eachCell(
        (cell) => {

          cell.border = {

            top: {
              style:
                "thin"
            },

            left: {
              style:
                "thin"
            },

            bottom: {
              style:
                "thin"
            },

            right: {
              style:
                "thin"
            }

          };

        }
      );

      /*
      ==========================================
      ZEBRA
      ==========================================
      */

      if (
        rowNumber % 2 === 0
      ) {

        row.eachCell(
          (cell) => {

            cell.fill = {

              type:
                "pattern",

              pattern:
                "solid",

              fgColor: {
                argb:
                  "FFF8FAFC"
              }

            };

          }
        );

      }

    }
  );

  /*
  ==========================================
  TOTAL ROW
  ==========================================
  */

  const totalRow =
    sheet.addRow({

      Paciente:
        "TOTAL GENERAL",

      Subtotal:
        totalSubtotal,

      ITBIS:
        totalItbis,

      Descuento:
        totalDesc,

      Costos:
        totalCostos,

      Utilidad:
        totalProduccion,

      Total:
        totalGeneral

    });

  totalRow.height = 28;

  totalRow.font = {

    bold: true,

    size: 11

  };

  totalRow.eachCell(
    (cell) => {

      cell.fill = {

        type:
          "pattern",

        pattern:
          "solid",

        fgColor: {
          argb:
            "FFDCFCE7"
        }

      };

      cell.border = {

        top: {
          style:
            "thick"
        },

        left: {
          style:
            "thin"
        },

        bottom: {
          style:
            "thin"
        },

        right: {
          style:
            "thin"
        }

      };

    }
  );

  /*
  ==========================================
  AUTOFILTER
  ==========================================
  */

  sheet.autoFilter = {

    from: "A1",

    to: "I1"

  };

  /*
  ==========================================
  HOJA RESUMEN
  ==========================================
  */

  const resumen =
    workbook.addWorksheet(
      "Resumen ejecutivo"
    );

  resumen.views = [
    {
      showGridLines: false
    }
  ];

  resumen.getColumn(
    2
  ).width = 38;

  resumen.getColumn(
    3
  ).width = 24;

  /*
  ==========================================
  TITULO
  ==========================================
  */

  resumen.mergeCells(
    "B2:C2"
  );

  const titleCell =
    resumen.getCell(
      "B2"
    );

  titleCell.value =
    "Resumen financiero clínico";

  titleCell.font = {

    bold: true,

    size: 18,

    color: {
      argb:
        "FF0F172A"
    }

  };

  /*
  ==========================================
  SUBTITLE
  ==========================================
  */

  resumen.mergeCells(
    "B3:C3"
  );

  resumen.getCell(
    "B3"
  ).value =
    "Estado financiero general";

  resumen.getCell(
    "B3"
  ).font = {

    size: 10,

    color: {
      argb:
        "FF64748B"
    }

  };

  /*
  ==========================================
  HEADER RESUMEN
  ==========================================
  */

  const headerRow =
    resumen.getRow(5);

  headerRow.height = 24;

  headerRow.getCell(
    2
  ).value =
    "Concepto";

  headerRow.getCell(
    3
  ).value =
    "Valor";

  [
    2,
    3
  ].forEach((col) => {

    const cell =
      headerRow.getCell(
        col
      );

    cell.font = {

      bold: true,

      color: {
        argb:
          "FFFFFFFF"
      }

    };

    cell.fill = {

      type:
        "pattern",

      pattern:
        "solid",

      fgColor: {
        argb:
          "FF1E40AF"
      }

    };

    cell.alignment = {

      horizontal:
        "center"

    };

  });

  /*
  ==========================================
  ROWS RESUMEN
  ==========================================
  */

  const resumenRows = [

    [
      "Ingresos clínicos",
      totalGeneral,
      "FF10B981"
    ],

    [
      "Costos clínicos",
      totalCostos,
      "FFF97316"
    ],

    [
      "Egresos operativos",
      totalEgresos,
      "FFF43F5E"
    ],

    [
      "Descuentos aplicados",
      totalDesc,
      "FFEC4899"
    ],

    [
      "Producción operativa",
      totalProduccion,
      "FF6366F1"
    ],

    [
      "Utilidad neta final",
      utilidadNeta,
      "FF2563EB"
    ]

  ];

  resumenRows.forEach(
    (r, i) => {

      const row =
        resumen.getRow(
          6 + i
        );

      row.height = 24;

      /*
      ==========================================
      LABEL
      ==========================================
      */

      row.getCell(
        2
      ).value = r[0];

      /*
      ==========================================
      VALUE
      ==========================================
      */

      row.getCell(
        3
      ).value = r[1];

      row.getCell(
        3
      ).numFmt =
        '"RD$"#,##0.00';

      row.getCell(
        3
      ).font = {

        bold: true,

        color: {
          argb: r[2]
        }

      };

      /*
      ==========================================
      BORDERS
      ==========================================
      */

      [
        2,
        3
      ].forEach((col) => {

        row.getCell(
          col
        ).border = {

          top: {
            style:
              "thin"
          },

          left: {
            style:
              "thin"
          },

          bottom: {
            style:
              "thin"
          },

          right: {
            style:
              "thin"
          }

        };

      });

    }
  );

  /*
  ==========================================
  RENTABILIDAD
  ==========================================
  */

  const rentabilidadRow =
    resumen.getRow(12);

  rentabilidadRow.height =
    24;

  rentabilidadRow.getCell(
    2
  ).value =
    "Rentabilidad %";

  rentabilidadRow.getCell(
    3
  ).value =
    Number(
      rentabilidad.toFixed(1)
    ) / 100;

  rentabilidadRow
    .getCell(3)
    .numFmt =
    '0.0%';

  rentabilidadRow
    .getCell(3)
    .font = {

    bold: true,

    color: {
      argb:
        rentabilidad >= 0.4
          ? "FF10B981"
          : rentabilidad >= 0.2
            ? "FFEAB308"
            : "FFF43F5E"
    }

  };

  /*
  ==========================================
  HIGHLIGHT UTILIDAD
  ==========================================
  */

  const utilidadRow =
    resumen.getRow(11);

  utilidadRow.eachCell(
    (cell) => {

      cell.fill = {

        type:
          "pattern",

        pattern:
          "solid",

        fgColor: {
          argb:
            "FFDBEAFE"
        }

      };

    }
  );

  /*
  ==========================================
  BORDERS RESUMEN
  ==========================================
  */

  for (
    let row = 5;
    row <= 12;
    row++
  ) {

    for (
      let col = 2;
      col <= 3;
      col++
    ) {

      resumen
        .getRow(row)
        .getCell(col)
        .border = {

        top: {
          style:
            "thin"
        },

        left: {
          style:
            "thin"
        },

        bottom: {
          style:
            "thin"
        },

        right: {
          style:
            "thin"
        }

      };

    }

  }

  /*
  ==========================================
  EXPORTAR
  ==========================================
  */

  try {

    const buffer =
      await workbook.xlsx.writeBuffer();

    const filePath =
      await save({

        defaultPath:
          `${nombreArchivo}.xlsx`

      });

    if (!filePath) {
      return;
    }

    await writeFile(
      filePath,
      buffer
    );

    toast.success(
      "Excel guardado ✅"
    );

  } catch (err) {

    console.error(err);

    toast.error(
      "Error exportando Excel ❌"
    );

  }

}