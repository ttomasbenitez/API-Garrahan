import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import protocolosRoutes from './routes/protocolos.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/', routes);
app.use('/protocolo', protocolosRoutes);

export default app;
