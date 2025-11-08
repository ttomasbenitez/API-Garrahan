import { RecetaHospitalariaExportador } from '../domain/receta/recetaHospitalariaExportador.js';
import { RecetaProvinciaExportador } from '../domain/receta/recetaProvinciaExportador.js';
import { RECETA_TIPO_HOSPITALARIA, RECETA_TIPO_PROVINCIA } from '../utils/constants.js';
import { ERROR_RECETA_PACIENTE_ID_REQUERIDO } from '../errors/receta.js';

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

  async obtenerTodas(idPaciente) {
    if (!idPaciente) {
      throw new Error(ERROR_RECETA_PACIENTE_ID_REQUERIDO);
    }

    return await this.recetaPacienteRepo.obtenerTodasPorIdPaciente(idPaciente);
  }

  async exportar(id, tipo) {
    const receta = await this.obtener(id);
    const protocolo = await this.repositorioProtocolo.obtener(receta.contexto.protocolo_id);
    if (tipo === RECETA_TIPO_HOSPITALARIA) {
      const exportador = new RecetaHospitalariaExportador(receta, protocolo);
      return await exportador.generar();
    }
    else if (tipo === RECETA_TIPO_PROVINCIA) {
      const exportador = new RecetaProvinciaExportador(receta);
      return await exportador.generar();
    }
  }
}
