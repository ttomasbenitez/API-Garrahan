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

const app = express();
const repositorioProtocolo = new RepositorioProtocolo(oracleDBInstance);
const protocoloService = new ProtocoloService(repositorioProtocolo);
const protocoloController = makeProtocoloController(protocoloService);
const repositorioPaciente = new RepositorioPaciente(oracleDBInstance);
const pacienteService = new PacienteService(repositorioPaciente);
const pacienteController = makePacienteController(pacienteService);

app.use(cors());
app.use(express.json());
app.use('/', routes);
app.use('/protocolo', protocolosRoutes(protocoloController));
app.use('/paciente', pacientesRoutes(pacienteController));

export default app;
