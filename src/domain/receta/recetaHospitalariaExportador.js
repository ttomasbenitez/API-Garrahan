import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import libre from 'libreoffice-convert';
import { promisify } from 'util';
import { PDFParse } from 'pdf-parse';

const libreConvert = promisify(libre.convert);

export class RecetaHospitalariaExportador {
  constructor(receta, protocolo) {
    this.receta = receta;
    this.protocolo = protocolo;
  }

  async generar() {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile('src/templates/receta_hospitalaria_template.xlsx');
    const sheet = workbook.getWorksheet(1);

    sheet.getCell('A4').value += ` ${this.receta.fecha_prescripcion.toLocaleDateString('es-AR')}`;
    sheet.getCell('A5').value += ` ${this.receta.nombreCompleto()}`;
    sheet.getCell('A6').value += ` ${this.receta.dni()}`;
    sheet.getCell('A7').value += ` ${this.receta.diagnostico}`;
    sheet.getCell('A8').value += ` ${this.receta.domicilioCompleto()}`;
    sheet.getCell('A9').value += ` ${this.protocolo.nombre}`;
    sheet.getCell('F9').value += ` ${this.receta.contexto.numero_ciclo}`;
    sheet.getCell('A10').value += ` ${this.receta.datos_paciente.peso} kg`;
    sheet.getCell('E10').value += ` ${this.receta.datos_paciente.talla} cm`;
    sheet.getCell('H10').value += ` ${this.receta.datos_paciente.superficie_corporal} m2`;

    let startRow = 14;
    for (const det of this.receta.detalles) {
      sheet.getCell(`A${startRow}`).value = det.nombre_generico;
      sheet.getCell(`E${startRow}`).value = det.presentacion;
      sheet.getCell(`F${startRow}`).value = det.concentracion ?? '-';
      sheet.getCell(`G${startRow}`).value = det.cantidad;
      sheet.getCell(`H${startRow}`).value = det.dosis_diaria ?? '-';
      sheet.getCell(`I${startRow}`).value = det.numero_dias ?? '-';
      startRow += 2;
    }

    const tmpDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
    const excelPath = path.join(tmpDir, `receta_${Date.now()}.xlsx`);
    await workbook.xlsx.writeFile(excelPath);

    const xlsxBuffer = fs.readFileSync(excelPath);
    const pdfBuffer = await libreConvert(xlsxBuffer, '.pdf', undefined);

    fs.unlinkSync(excelPath);

    return pdfBuffer;
  }

  async cargar(body) {
    const parser = new PDFParse({ data: body });
    const result = await parser.getText();
    return result.text;
  }
}
