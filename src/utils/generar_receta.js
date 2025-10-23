import express from 'express';
import ExcelJS from 'exceljs';
import libre from 'libreoffice-convert';
import { promisify } from 'util';
import fs from 'fs';

const app = express();
app.get('/receta', async (req, res) => {
  const libreConvert = promisify(libre.convert);

  try {
    // 1. Cargar plantilla
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile('./plantillas/receta.xlsx');    // PDF de base de la receta
    const sheet = workbook.getWorksheet(1);     // primera hoja

    // 2. Rellenar con datos del backend
    sheet.getCell('A4').value += ' 09/12/2018';          // Fecha de prescripción
    sheet.getCell('A5').value += ' Juanfer Quintero';    // Paciente
    sheet.getCell('A6').value += ' 26062011';            // DNI
    sheet.getCell('G6').value += ' Valor';               // HC
    sheet.getCell('A7').value += ' Osteosarcoma';        // Diagnóstico
    sheet.getCell('G7').value += ' 77';                  // Edad
    sheet.getCell('A8').value += ' Brandsen 805';        // Domicilio
    sheet.getCell('A9').value += ' HIT-MED / SJMB03';    // Protocolo
    sheet.getCell('F9').value += ' 7';                   // Número de ciclo
    sheet.getCell('A10').value += ' 16 kg';              // Peso
    sheet.getCell('E10').value += ' 1,15 m';             // Talla
    sheet.getCell('H10').value += ' 0.729 m2';           // Superficie corporal

    sheet.getCell('A14').value = 'DOXORRUBICINA';        // Nombre genérico
    sheet.getCell('E14').value = 'Frasco Ampolla';       // Presentación
    sheet.getCell('F14').value = '5ml/m2';               // Concentración
    sheet.getCell('G14').value = '7';                    // Cantidad
    sheet.getCell('H14').value = '0.7ml/m2';             // Dosis diaria
    sheet.getCell('I14').value = '7';                    // Cantidad de días

    // 2b. Ajustar área de impresión
    const lastRow = sheet.actualRowCount;
    const lastCol = sheet.actualColumnCount;
    sheet.pageSetup.printArea = `A1:${sheet.getColumn(lastCol).letter}${lastRow}`;
    sheet.pageSetup.fitToPage = true;
    sheet.pageSetup.fitToWidth = 1;
    sheet.pageSetup.fitToHeight = 0;

    // 3. Guardar Excel completo
    const filledPath = './output/receta_completa.xlsx';
    await workbook.xlsx.writeFile(filledPath);

    // 4. Convertir a PDF
    const fileBuffer = fs.readFileSync(filledPath);
    const pdfBuffer = await libreConvert(fileBuffer, '.pdf', undefined);

    // 5. Enviar PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=receta.pdf');
    res.send(pdfBuffer);

  } catch (err) {
    console.error('Error al generar receta:', err);
    res.status(500).send('Error al generar receta');
  }
});
