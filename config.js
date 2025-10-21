import dotenv from 'dotenv';
import path from 'path';

// Define qué archivo cargar según NODE_ENV
const envFile = `.env.${process.env.NODE_ENV || 'test.example'}`;

// Carga el archivo correcto
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

export default {
  oracle: {
    port: process.env.ORACLE_PORT || 1521,
    host: process.env.ORACLE_HOST || 'localhost',
    service: process.env.ORACLE_SERVICE || 'XEPDB1',
    admin: process.env.ORACLE_ADMIN,
    adminPassword: process.env.ORACLE_PASSWORD,
    appUser: process.env.ORACLE_APP_USER,
    userPassword: process.env.ORACLE_USER_PASSWORD,
    connectString: `${process.env.ORACLE_HOST}:${process.env.ORACLE_PORT}/${process.env.ORACLE_SERVICE}`
  },
  app: {
    port: process.env.APP_PORT || 3000,
    node_env: process.env.NODE_ENV || 'test',
    jwtSecret: process.env.JWT_SECRET || 'super-secret-key',
    apiHospitalUrl: process.env.API_HOSPITAL_URL
  }
};
