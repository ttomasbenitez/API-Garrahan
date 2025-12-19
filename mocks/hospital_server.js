import express from 'express';
import config from '../config.js';
import logger from '../src/utils/logger.js';
import { PACIENTES_BY_ID_HOSPITALARIO, PROFESIONALES_BY_DNI } from './data.js';

const app = express();

app.get('/fhir/Patient/:id', (req, res) => {
  try {
    const { id } = req.params;
    const patient = PACIENTES_BY_ID_HOSPITALARIO[id];
    if (!patient) {
      logger.info(`Mock hospital server: patient ID ${id} not found`);
      return res.status(404).json({ error: 'Patient not found' });
    }
    logger.info(`Mock hospital server: returning data for patient ID ${id}`);
    res.status(200).json(JSON.stringify(patient));

  } catch (error) {
    logger.error('Mock hospital server error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/fhir/Patient', (req, res) => {
  const patiens = Object.values(PACIENTES_BY_ID_HOSPITALARIO);
  res.json(patiens);
});

app.get('/fhir/Practitioner/:dni', (req, res) => {
  try {
    const { dni } = req.params;
    const profesional = PROFESIONALES_BY_DNI[dni];
    if (!profesional) {
      logger.info(`Mock hospital server: PROFESIONAL DNI ${dni} not found`);
      return res.status(404).json({ error: 'Profesional not found' });
    }
    logger.info(`Mock hospital server: returning data for profesional DNI ${dni}`);
    res.status(200).json(JSON.stringify(profesional));
  } catch (error) {
    logger.error('Mock hospital server error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(config.app.apiHospitalPort, () => {
  logger.info(`FHIR mock server listening on http://mock-hospital-server:${config.app.apiHospitalPort}`);
});
