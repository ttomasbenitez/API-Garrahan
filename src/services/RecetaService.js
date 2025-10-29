import { RecetaHospitalariaExportador } from '../domain/receta/recetaHospitalariaExportador.js';
import { RECETA_TIPO_HOSPITALARIA } from '../utils/constants.js';

export class RecetaService {

  constructor(recetaPacienteRepo, repositorioProtocolo) {
    this.recetaPacienteRepo = recetaPacienteRepo;
    this.repositorioProtocolo = repositorioProtocolo;
  }

  async crear(receta) {
    return await this.recetaPacienteRepo.guardar(receta);
  }

  async obtener(id) {
    return await this.recetaPacienteRepo.obtener(id);
  }

  async exportar(id, tipo) {
    const receta = await this.obtener(id);
    const protocolo = await this.repositorioProtocolo.obtener(receta.contexto.protocolo_id);
    if (tipo === RECETA_TIPO_HOSPITALARIA) {
      const exportador = new RecetaHospitalariaExportador(receta, protocolo);
      return await exportador.generar();
    }
  }
}
