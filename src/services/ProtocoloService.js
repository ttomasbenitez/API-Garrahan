import AdministracionMedicacion from '../domain/protocolo/administracionMedicacion.js';
import ValidadorAdministracionMedicacion from '../domain/validadores/validadorAdministracionMedicacion.js';

export class ProtocoloService {
  constructor(protocoloRepo) {
    this.protocoloRepo = protocoloRepo;
    this.validadorAdministracionMedicacion = new ValidadorAdministracionMedicacion();
  }

  async crear(protocolo) {
    const id = await this.protocoloRepo.guardar(protocolo);
    protocolo.protocolo_id = id;
    return id;
  }

  async obtener(id) { return this.protocoloRepo.obtener(id); }

  async agregarCiclo(protocoloId, ciclo) {
    const protocolo = await this.obtener(protocoloId);
    await protocolo.agregarCiclo(ciclo, this.protocoloRepo);
    return protocolo;
  }

  async agregarCiclos(protocoloId, ciclos) {
    const protocolo = await this.obtener(protocoloId);
    for (const ciclo of ciclos) {
      await protocolo.agregarCiclo(ciclo, this.protocoloRepo);
    }
    return protocolo;
  }

  async validarProtocolo(protocoloId) {
    const protocolo = await this.obtener(protocoloId);
    if (!protocolo) {
      throw new Error(`No se encontró el protocolo con id ${protocoloId}`);
    }
    return protocolo;
  }

  async agregarAdministracion(protocolo, ciclo, administracion_medicaciones) {
    await protocolo.agregarAdministracion(ciclo, administracion_medicaciones, this.protocoloRepo);
    return protocolo;
  }

  async validarAdministraciones(payload, drogaService) {
    const payloadValidado = this.validadorAdministracionMedicacion.validar(payload);
    return await Promise.all(
      payloadValidado.map(async (a) => {

        await drogaService.validarDroga(a.id_droga);

        return new AdministracionMedicacion(
          Number(a.id_droga),
          Number(a.dosis),
          a.dosis_unidad,
          a.frecuencia,
          Number(a.administracion_diaria),
          Number(a.frecuencia_diaria),
        );
      })
    );
  }
}
