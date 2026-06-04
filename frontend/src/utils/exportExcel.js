import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import formatMoney from "./format";

import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";
import toast from "react-hot-toast";
export async function exportToExcel(data, nombreArchivo = "reporte") {

  const workbook = new ExcelJS.Workbook();

  // =============================
  // ✅ HOJA DETALLE
  // =============================
  const sheet = workbook.addWorksheet("Detalle");

  sheet.columns = [
    { header: "Fecha", key: "FechaStr", width: 14 },
    { header: "Cliente", key: "Cliente", width: 22 },
    { header: "Subtotal", key: "Subtotal", width: 18 },
    { header: "ITBIS", key: "ITBIS", width: 18 },
    { header: "Descuento", key: "Descuento", width: 18 },
    { header: "Total", key: "Total", width: 18 }
  ];

  // ✅ HEADER SOLO A-F
  const header = sheet.getRow(1);

  for (let col = 1; col <= 6; col++) {
    const cell = header.getCell(col);

    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1E40AF" }
    };

    cell.alignment = {
      vertical: "middle",
      horizontal: "center"
    };
  }

  // ✅ DATA
  data.forEach(d => sheet.addRow(d));

  // ✅ TOTALES
  const totalSubtotal = data.reduce((a, b) => a + b.Subtotal, 0);
  const totalItbis = data.reduce((a, b) => a + b.ITBIS, 0);
  const totalDesc = data.reduce((a, b) => a + b.Descuento, 0);
  const totalGeneral = data.reduce((a, b) => a + b.Total, 0);

  const totalRow = sheet.addRow({
    Cliente: "TOTAL GENERAL",
    Subtotal: totalSubtotal,
    ITBIS: totalItbis,
    Descuento: totalDesc,
    Total: totalGeneral
  });

  // ✅ AMARILLO SOLO B-F
  for (let col = 2; col <= 6; col++) {
    const cell = totalRow.getCell(col);

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFEF3C7" }
    };

    cell.font = { bold: true };
  }

  // ✅ BORDE SUPERIOR
  totalRow.getCell(2).border = {
    top: { style: "thick" }
  };

  // ✅ FORMATO RD$
  ["C", "D", "E", "F"].forEach(col => {
    sheet.getColumn(col).numFmt = '"RD$"#,##0.00';
  });

  // ✅ CENTRAR FECHA
  sheet.getColumn("A").alignment = { horizontal: "center" };

  // ✅ BORDES
  sheet.eachRow(row => {
    row.eachCell(cell => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      };
    });
  });

  // ✅ AUTOFILTRO SOLO A-F
  sheet.autoFilter = {
    from: "A1",
    to: "F1"
  };

  // =============================
  // ✅ HOJA RESUMEN (FIX 🔥)
  // =============================
  const resumen = workbook.addWorksheet("Resumen");

  // ✅ NO usar header en columns → evita duplicados
  resumen.getColumn(3).width = 28;
  resumen.getColumn(4).width = 22;

  // ✅ HEADER MANUAL (SIN DUPLICAR)
  const headerRow = resumen.getRow(3);

  headerRow.getCell(3).value = "Concepto";
  headerRow.getCell(4).value = "Valor";

  for (let col = 3; col <= 4; col++) {
    const cell = headerRow.getCell(col);

    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF059669" }
    };

    cell.alignment = { horizontal: "center" };
  }

  // ✅ DATA RESUMEN
  const rows = [
    ["Subtotal", totalSubtotal],
    ["ITBIS", totalItbis],
    ["Descuento", totalDesc],
    ["TOTAL INGRESOS", totalGeneral]
  ];

  rows.forEach((r, i) => {
    const row = resumen.getRow(4 + i);

    row.getCell(3).value = r[0];
    row.getCell(4).value = r[1];
  });

  // ✅ MONEDA
  resumen.getColumn(4).numFmt = '"RD$"#,##0.00';

  // ✅ RESALTAR TOTAL
  const lastRow = resumen.getRow(7);

  lastRow.font = { bold: true };

  for (let col = 3; col <= 4; col++) {
    lastRow.getCell(col).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD1FAE5" }
    };
  }

  // ✅ BORDES SOLO TABLA
  for (let row = 3; row <= 7; row++) {
    for (let col = 3; col <= 4; col++) {
      resumen.getRow(row).getCell(col).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      };
    }
  }

  // =============================
  // ✅ EXPORTAR
  // =============================

  try {

    const buffer = await workbook.xlsx.writeBuffer();

    const filePath = await save({
      defaultPath: `${nombreArchivo}.xlsx`
    });

    if (filePath) {

      await writeFile(filePath, buffer);

      toast.success("Excel guardado ✅");

    }

  } catch (err) {

    console.error(err);

    toast.error("Error exportando Excel ❌");
    
  }

}