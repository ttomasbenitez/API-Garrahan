import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import protocolosRoutes from './routes/protocolos.js';
import { RepositorioProtocolo } from './persistance/repositorioProtocolo.js';
import oracleDBInstance from './db/connection_pool.js';
import { ProtocoloService } from './services/ProtocoloService.js';
import { makeProtocoloController } from './controllers/protocoloController.js';

const app = express();
const repositorioProtocolo = new RepositorioProtocolo(oracleDBInstance);
const protocoloService = new ProtocoloService(repositorioProtocolo);
const protocoloController = makeProtocoloController(protocoloService);

app.use(cors());
app.use(express.json());
app.use('/', routes);
app.use('/protocolo', protocolosRoutes(protocoloController));

export default app;
