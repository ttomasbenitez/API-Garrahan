import Protocolo from '../domain/protocolo/index.js';

async function crearProtocolo(body, repositorioProtocolo) {
  const protocolo = new Protocolo(body.nombre, body.enfermedad, body.linea);
  try {
    const id = await repositorioProtocolo.crearProtocolo(protocolo);
    return {
      protocolo_id: id,
      nombre: body.nombre,
      enfermedad: body.enfermedad,
      linea: body.linea
    };
  } catch (err) {
    throw new Error(err.message);
  }
}

async function obtenerProtocolo(id, repositorioProtocolo) {
  try {
    const result = await repositorioProtocolo.obtenerProtocolo(id);
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
}

export { crearProtocolo, obtenerProtocolo };
