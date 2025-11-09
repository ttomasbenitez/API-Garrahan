import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

export class RecetaProvinciaExportador {
  constructor(recetaData) {
    this.receta = recetaData;
  }

  async generar() {
    const pdfBytes = fs.readFileSync('src/templates/recetario_unico_provincia.pdf');
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();

    form.getTextField('apellido').setText(` ${this.receta.apellido()}`);
    form.getTextField('nombre').setText(` ${this.receta.nombre()}`);
    form.getTextField('documento').setText(` ${this.receta.dni()}`);
    //form.getTextField('localidad').setText(this.receta.paciente.localidad || '');

    form.getTextField('peso').setText(` ${this.receta.datos_paciente.peso}`);
    form.getTextField('talla').setText(` ${this.receta.datos_paciente.talla}`);
    form.getTextField('superficieCorporal').setText(` ${this.receta.datos_paciente.talla}`);

    form.getTextField('diagnostico').setText(` ${this.receta.diagnostico}`);
    form.getTextField('numeroCiclo').setText(` ${this.receta.contexto.numero_ciclo}`);
    form.getTextField('TNM').setText(` ${this.receta.tnm}`);
    form.getTextField('estadio').setText(` ${this.receta.estadio}`);
    form.getTextField('intervalo').setText(` ${this.receta.intervalo}`);
    form.getTextField('PS').setText(` ${this.receta.ps}`);
    //form.getTextField('nombreHospital').setText(this.receta.hospital.nombreHospital || '');
    //form.getTextField('fechaPrescripcion').setText(this.receta.fechaPrescripcion || '');

    if (this.receta.detalles && Array.isArray(this.receta.detalles)) {
      this.receta.detalles.forEach((droga, index) => {
        const i = index + 1;
        if (i > 10) return;
        form.getTextField(`droga${i}Nombre`).setText(` ${droga.nombre_generico}`);
        form.getTextField(`droga${i}Presentacion`).setText(` ${droga.presentacion}`);
        form.getTextField(`droga${i}Concentracion`).setText(` ${droga.concentracion}`);
        form.getTextField(`droga${i}Cantidad`).setText(` ${droga.cantidad?.toString()}`);
        form.getTextField(`droga${i}DosisDiaria`).setText(` ${droga.dosis_diaria}`);
        form.getTextField(`droga${i}NumeroDias`).setText(` ${droga.numero_dias?.toString()}`);
        //form.getTextField(`droga${i}DosisTotal`).setText(droga.dosisTotal || '');
        //form.getTextField(`droga${i}ViaAdministracion`).setText(droga.viaAdmin || '');
      });
    }

    const pdfBytesSalida = await pdfDoc.save();

    // Crear el directorio /tmp si no existe
    const tmpDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir);
    }

    const nombreArchivo = `recetario_pdf_${Date.now()}.pdf`;
    const rutaSalida = path.join(tmpDir, nombreArchivo);
    fs.writeFileSync(rutaSalida, pdfBytesSalida);

    return Buffer.from(pdfBytesSalida);
  }
}
