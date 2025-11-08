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
import { RepositorioPresentacionDroga } from './persistance/repositorioPresentacionDroga.js';
import { RepositorioPresentacionDrogaConForma } from './persistance/repositorioPresentacionDrogaConForma.js';
import { PresentacionDrogaService } from './services/PresentacionDrogaService.js';
import { makePresentacionDrogaController } from './controllers/presentacionDrogaController.js';
import presentacionDrogaRoutes from './routes/presentacionDroga.js';
import { RepositorioPresentacionDrogaVia } from './persistance/repositorioPresentacionDrogaVia.js';
import { PresentacionDrogaViaService } from './services/PresentacionDrogaViaService.js';
import { makePresentacionDrogaViaController } from './controllers/presentacionDrogaViaController.js';
import presentacionDrogaViaRoutes from './routes/presentacionDrogaVia.js';
import { RepositorioPacienteProfesional } from './persistance/repositorioPacienteProfesional.js';
import apiHospitalConector from './connectors/hospital_api.js';
import { RepositorioAdminisitracionMedicacion } from './persistance/repositorioAdministracionMedicacion.js';
import { RepositorioRecetaPaciente } from './persistance/repositorioRecetaPaciente.js';
import { RecetaService } from './services/RecetaService.js';
import buildRecetasRouter from './routes/recetas.js';
import { makeRecetaController } from './controllers/recetaController.js';
import { RepositorioProtocoloActual } from './persistance/repositorioProtocoloActual.js';
import { ProtocoloActualService } from './services/ProtocoloActualService.js';
import { makeProtocoloActualController } from './controllers/protocoloActualController.js';
import protocoloActualRoutes from './routes/protocoloActual.js';
import { AdministracionMedicacionService } from './services/AdministracionMedicacionService.js';
import { makeAdministracionMedicacionController } from './controllers/administracionMedicacionController.js';
import administracionMedicacionRoutes from './routes/administracionMedicacion.js';
import { CalculoDrogaService } from './services/CalculoDrogaService.js';
import { makeCalculoDrogaController } from './controllers/calculoDrogaController.js';
import calculoDrogaRoutes from './routes/calculoDroga.js';
import { RepositorioConfiguracionAlarma } from './persistance/repositorioConfiguracionAlarma.js';
import { ConfiguracionAlarmaService } from './services/configuracionAlarmaService.js';
import { makeConfiguracionAlarmaController } from './controllers/configuracionAlarmaController.js';
import configuracionAlarmaRoutes from './routes/configuracionAlarma.js';
import { RepositorioAlarma } from './persistance/repositorioAlarma.js';
import { AlarmaService } from './services/alarmaService.js';
import { makeAlarmaController } from './controllers/alarmaController.js';
import buildAlarmaRouter from './routes/alarma.js';

const app = express();

// profesional
const repositorioProfesional = new RepositorioProfesional(oracleDBInstance);
const profesionalService = new ProfesionalService(repositorioProfesional);
const profesionalController = makeProfesionalController(profesionalService);
// paciente_profesional y paciente
const repositorioPacienteProfesional = new RepositorioPacienteProfesional(oracleDBInstance);
const repositorioPaciente = new RepositorioPaciente(oracleDBInstance);

const pacienteService = new PacienteService(repositorioPaciente, repositorioPacienteProfesional, apiHospitalConector);
const pacienteProfesionalService = new PacienteProfesionalService(
  repositorioPacienteProfesional,
  pacienteService,
  profesionalService
);
const pacienteProfesionalController = makePacienteProfesionalController(pacienteProfesionalService);
// paciente
const pacienteController = makePacienteController(pacienteService);
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
const repositorioAdministracionMedicacion = new RepositorioAdminisitracionMedicacion(oracleDBInstance);
const protocoloService = new ProtocoloService(repositorioProtocolo, repositorioAdministracionMedicacion);
const protocoloController = makeProtocoloController(protocoloService, drogasService);
// via administracion
const respositorioViaAdministracion = new RepositorioViaAdministracion(oracleDBInstance);
const viaAdministracionService = new ViaAdministracionService(respositorioViaAdministracion);
const viaAdministracionController = makeViaAdministracionController(viaAdministracionService);
// protocolo_paciente
const repositorioProtocoloPaciente = new RepositorioProtocoloPaciente(oracleDBInstance);
const protocoloPacienteService = new ProtocoloPacienteService(repositorioProtocoloPaciente, repositorioProtocolo);
const protocoloPacienteController = makeProtocoloPacienteController(protocoloPacienteService);
// presentacion droga
const repositorioPresentacionDroga = new RepositorioPresentacionDroga(oracleDBInstance);
const repositorioPresentacionDrogaConForma = new RepositorioPresentacionDrogaConForma(oracleDBInstance);
const presentacionDrogaService = new PresentacionDrogaService(repositorioPresentacionDroga, repositorioPresentacionDrogaConForma);
const presentacionDrogaController = makePresentacionDrogaController(presentacionDrogaService);
// presentacion droga via
const repositorioPresentacionDrogaVia = new RepositorioPresentacionDrogaVia(oracleDBInstance);
const presentacionDrogaViaService = new PresentacionDrogaViaService(repositorioPresentacionDrogaVia);
const presentacionDrogaViaController = makePresentacionDrogaViaController(presentacionDrogaViaService);
// recetas
const repositorioRecetaPaciente = new RepositorioRecetaPaciente(oracleDBInstance);
const recetaService = new RecetaService(repositorioRecetaPaciente, repositorioProtocolo);
const recetaController = makeRecetaController(recetaService);
// protocolo-actual
const repositorioProtocoloActual = new RepositorioProtocoloActual(oracleDBInstance);
const protocoloActualService = new ProtocoloActualService(repositorioProtocoloActual);
const protocoloActualController = makeProtocoloActualController(protocoloActualService);
// administracion medicacion
const administracionMedicacionService = new AdministracionMedicacionService(repositorioAdministracionMedicacion);
const administracionMedicacionController = makeAdministracionMedicacionController(administracionMedicacionService);
// Calculo Droga
const calculoDrogaService = new CalculoDrogaService(repositorioAdministracionMedicacion);
const calculoDrogaController = makeCalculoDrogaController(calculoDrogaService);
// Configuracion Alarma
const repositorioConfiguracionAlarma = new RepositorioConfiguracionAlarma(oracleDBInstance);
const configuracionAlarmaService = new ConfiguracionAlarmaService(repositorioConfiguracionAlarma);
const configuracionAlarmaController = makeConfiguracionAlarmaController(configuracionAlarmaService);
// Alarma
const repositorioAlarma = new RepositorioAlarma(oracleDBInstance);
const alarmaService = new AlarmaService(repositorioAlarma, repositorioConfiguracionAlarma, oracleDBInstance);
const alarmaController = makeAlarmaController(alarmaService);

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3003', // frontend Next
  credentials: true
}));
app.use(cookieParser());

app.use('/', routes);
app.use('/auth', authRouter);
app.use('/', routes);
app.use('/protocolos', protocolosRoutes(protocoloController));
app.use('/pacientes', pacientesRoutes(pacienteController));
app.use('/pacientes', protocoloPacienteRoutes(protocoloPacienteController));
app.use('/pacientes', protocoloActualRoutes(protocoloActualController));
app.use('/profesionales', profesionalesRoutes(profesionalController));
app.use('/drogas', drogasRoutes(drogaController));
app.use('/paciente-profesional', pacienteProfesionalRoutes(pacienteProfesionalController));
app.use('/vias-administracion', viaAdministracionRoutes(viaAdministracionController));
app.use('/formas-farmaceuticas', formaFarmaceuticaRoutes(formaFarmaceuticaController));
app.use('/drogas', presentacionDrogaRoutes(presentacionDrogaController));
app.use('/presentaciones-droga-via', presentacionDrogaViaRoutes(presentacionDrogaViaController));
app.use('/recetas', buildRecetasRouter(recetaController));
app.use('/administraciones', administracionMedicacionRoutes(administracionMedicacionController));
app.use('/calculo', calculoDrogaRoutes(calculoDrogaController));
app.use('/configuracion-alarma', configuracionAlarmaRoutes(configuracionAlarmaController));
app.use('/alarmas', buildAlarmaRouter(alarmaController));

export default app;
