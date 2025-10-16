import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
import oracleDBInstance from './db/connection_pool.js';
import protocolosRoutes from './routes/protocolos.js';
import { RepositorioProtocolo } from './persistance/repositorioProtocolo.js';
import { ProtocoloService } from './services/ProtocoloService.js';
import { makeProtocoloController } from './controllers/protocoloController.js';
import pacientesRoutes from './routes/pacientes.js';
import { RepositorioPaciente } from './persistance/repositorioPaciente.js';
import { PacienteService } from './services/PacienteService.js';
import { makePacienteController } from './controllers/pacienteController.js';
import profesionalesRoutes from './routes/profesionales.js';
import { RepositorioProfesional } from './persistance/repositorioProfesional.js';
import { ProfesionalService } from './services/ProfesionalService.js';
import { makeProfesionalController } from './controllers/profesionalController.js';
import { DrogaService } from './services/DrogaService.js';
import { makeDrogaController } from './controllers/drogaController.js';
import drogasRoutes from './routes/drogas.js';
import { RepositorioDroga } from './persistance/repositorioDroga.js';
import { PacienteProfesionalService } from './services/PacienteProfesionalService.js';
import { makePacienteProfesionalController } from './controllers/pacienteProfesionalController.js';
import pacienteProfesionalRoutes from './routes/pacienteProfesional.js';
import authRouter from './routes/auth.js';
import { RepositorioViaAdministracion } from './persistance/repositorioViaAdministracion.js';
import { ViaAdministracionService } from './services/ViaAdministracionService.js';
import { makeViaAdministracionController } from './controllers/viaAdministracionController.js';
import viaAdministracionRoutes from './routes/viaAdministracion.js';
import { RepositorioProtocoloPaciente } from './persistance/repositorioProtocoloPaciente.js';
import { ProtocoloPacienteService } from './services/ProtocoloPacienteService.js';
import { makeProtocoloPacienteController } from './controllers/protocoloPacienteController.js';
import protocoloPacienteRoutes from './routes/protocoloPaciente.js';
import { RepositorioFormaFarmaceutica } from './persistance/repositorioFormaFarmaceutica.js';
import { FormaFarmaceuticaService } from './services/FormaFarmaceuticaService.js';
import { makeFormaFarmaceuticaController } from './controllers/formaFarmaceuticaController.js';
import formaFarmaceuticaRoutes from './routes/formaFarmaceutica.js';

const app = express();
// paciente
const repositorioPaciente = new RepositorioPaciente(oracleDBInstance);
const pacienteService = new PacienteService(repositorioPaciente);
const pacienteController = makePacienteController(pacienteService);
// profesional
const repositorioProfesional = new RepositorioProfesional(oracleDBInstance);
const profesionalService = new ProfesionalService(repositorioProfesional);
const profesionalController = makeProfesionalController(profesionalService);
// droga
const repositorioDroga = new RepositorioDroga(oracleDBInstance);
const drogasService = new DrogaService(repositorioDroga);
const drogaController = makeDrogaController(drogasService);
// forma farmacéutica
const repositorioFormaFarmaceutica = new RepositorioFormaFarmaceutica(oracleDBInstance);
const formaFarmaceuticaService = new FormaFarmaceuticaService(repositorioFormaFarmaceutica);
const formaFarmaceuticaController = makeFormaFarmaceuticaController(formaFarmaceuticaService);
// protocolo
const repositorioProtocolo = new RepositorioProtocolo(oracleDBInstance);
const protocoloService = new ProtocoloService(repositorioProtocolo);
const protocoloController = makeProtocoloController(protocoloService, drogasService);
// paciente_profesional
const pacienteProfesionalService = new PacienteProfesionalService(
  repositorioPaciente.pacienteProfesionalRepo,
  pacienteService,
  profesionalService
);
const pacienteProfesionalController = makePacienteProfesionalController(pacienteProfesionalService);
// via administracion
const respositorioViaAdministracion = new RepositorioViaAdministracion(oracleDBInstance);
const viaAdministracionService = new ViaAdministracionService(respositorioViaAdministracion);
const viaAdministracionController = makeViaAdministracionController(viaAdministracionService);
// protocolo_paciente
const repositorioProtocoloPaciente = new RepositorioProtocoloPaciente(oracleDBInstance);
const protocoloPacienteService = new ProtocoloPacienteService(repositorioProtocoloPaciente);
const protocoloPacienteController = makeProtocoloPacienteController(protocoloPacienteService);

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3003', // frontend Next
  credentials: true
}));
app.use(cookieParser());

app.use('/', routes);
app.use('/auth', authRouter);
app.use('/', routes);
app.use('/protocolo', protocolosRoutes(protocoloController));
app.use('/paciente', pacientesRoutes(pacienteController));
app.use('/paciente', protocoloPacienteRoutes(protocoloPacienteController));
app.use('/profesional', profesionalesRoutes(profesionalController));
app.use('/droga', drogasRoutes(drogaController));
app.use('/paciente-profesional', pacienteProfesionalRoutes(pacienteProfesionalController));
app.use('/via-administracion', viaAdministracionRoutes(viaAdministracionController));
app.use('/forma-farmaceutica', formaFarmaceuticaRoutes(formaFarmaceuticaController));

export default app;
