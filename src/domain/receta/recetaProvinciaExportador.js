import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

const NOMBRE_HOSPITAL = 'GARRAHAN';
const LOCALIDAD_HOSPITAL = 'CABA';

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
    form.getTextField('documento').setText(` ${this.receta.tipoYNumeroDocumento()}`);
    form.getTextField('fechaDeNacimiento').setText(` ${this.receta.fechaNacimiento()}`);
    form.getTextField('sexo').setText(` ${this.receta.paciente_snapshot.identidad.sexo}`);
    form.getTextField('nacionalidad').setText(` ${this.receta.paciente_snapshot.identidad.nacionalidad}`);
    form.getTextField('telefono').setText(` ${this.receta.paciente_snapshot.contacto.telefono}`);
    form.getTextField('email').setText(` ${this.receta.paciente_snapshot.contacto.email}`);

    form.getTextField('domicilio').setText(` ${this.receta.paciente_snapshot.domicilio.calle}`);
    form.getTextField('domicilioNumero').setText(` ${this.receta.paciente_snapshot.domicilio.numero}`);
    form.getTextField('pisoYDepto').setText(` ${this.receta.paciente_snapshot.domicilio.piso_depto}`);
    form.getTextField('codigoPostal').setText(` ${this.receta.paciente_snapshot.domicilio.codigo_postal}`);
    form.getTextField('localidad').setText(` ${this.receta.paciente_snapshot.domicilio.localidad}`);
    form.getTextField('partido').setText(` ${this.receta.paciente_snapshot.domicilio.partido}`);

    form.getTextField('nombreHospital').setText(NOMBRE_HOSPITAL);
    form.getTextField('localidadHospital').setText(LOCALIDAD_HOSPITAL);

    form.getTextField('peso').setText(` ${this.receta.datos_paciente.peso}`);
    form.getTextField('talla').setText(` ${this.receta.datos_paciente.talla}`);
    form.getTextField('superficieCorporal').setText(` ${this.receta.datos_paciente.talla}`);

    form.getTextField('diagnostico').setText(` ${this.receta.diagnostico}`);
    form.getTextField('numeroCiclo').setText(` ${this.receta.contexto.ciclo_id}`);
    form.getTextField('TNM').setText(` ${this.receta.tnm}`);
    form.getTextField('estadio').setText(` ${this.receta.estadio}`);
    form.getTextField('intervalo').setText(` ${this.receta.intervalo}`);
    form.getTextField('PS').setText(` ${this.receta.ps}`);

    if (this.receta.detalles && Array.isArray(this.receta.detalles)) {
      this.receta.detalles.forEach((droga, index) => {
        const i = index + 1;
        if (i > 10) return;
        form.getTextField(`droga${i}Nombre`).setText(` ${droga.nombre_generico}`);
        form.getTextField(`droga${i}Presentacion`).setText(` ${droga.presentacion}`);
        form.getTextField(`droga${i}Concentracion`).setText(` ${droga.concentracion}`);
        form.getTextField(`droga${i}Cantidad`).setText(` ${droga.cantidad?.toString()}`);
        form.getTextField(`droga${i}DosisDiaria`).setText(` ${droga.dosis_diaria} ${droga.dosis_unidad}`);
        form.getTextField(`droga${i}NumeroDias`).setText(` ${droga.numero_dias?.toString()}`);
        form.getTextField(`droga${i}DosisTotal`).setText(` ${droga.dosis_total?.toString()} ${droga.dosis_unidad?.toString()}`);
        form.getTextField(`droga${i}ViaAdministracion`).setText(` ${droga.via_administracion?.toString()}`);
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
