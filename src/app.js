import express from 'express';
import cors from 'cors';
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

const app = express();
// protocolo
const repositorioProtocolo = new RepositorioProtocolo(oracleDBInstance);
const protocoloService = new ProtocoloService(repositorioProtocolo);
const protocoloController = makeProtocoloController(protocoloService);
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

app.use(cors());
app.use(express.json());
app.use('/', routes);
app.use('/protocolo', protocolosRoutes(protocoloController));
app.use('/paciente', pacientesRoutes(pacienteController));
app.use('/profesional', profesionalesRoutes(profesionalController));
app.use('/droga', drogasRoutes(drogaController));

export default app;
