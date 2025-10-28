// seeds.js
//import drogas from './data/drogas.json';
//import presentaciones_droga from './data/presentaciones_droga.json';
import { readFileSync } from 'fs';
const drogas = JSON.parse(readFileSync(new URL('./data/drogas.json', import.meta.url)));
const presentaciones_droga = JSON.parse(readFileSync(new URL('./data/presentaciones_droga.json', import.meta.url)));
const presentaciones_droga_via = JSON.parse(readFileSync(new URL('./data/presentaciones_droga_via.json', import.meta.url)));


async function login(role) {
  const res = await fetch('http://api-garrahan-app-1:3000/auth/login-test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: '2', name: 'admin', role: role }),
  });
  const cookies = res.headers.get('set-cookie');
  if (!cookies) throw new Error('No se recibió cookie de sesión');
  return cookies;
}

async function createProtocolo(cookie) {
  const res = await fetch('http://api-garrahan-app-1:3000/protocolos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
    body: JSON.stringify({
      nombre: 'Osteosarcoma GBTO 2006 - No metastásico',
      enfermedad: 'Osteosarcoma',
      linea: '1',
    }),
  });
  return res.json();
}

async function createProfesionales(cookie) {
  const profesionales = [
    { nombre: 'Walter', apellido: 'Cacciavillano', dni: '19201241', matricula: 'MP12345', especialidad: 'Oncología' },
    { nombre: 'Fernando', apellido: 'Gómez', dni: '21201241', matricula: 'MP12346', especialidad: 'Pediatría' },
  ];

  for (const p of profesionales) {
    const res = await fetch('http://api-garrahan-app-1:3000/profesionales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
      body: JSON.stringify(p),
    });
    console.log('Profesional creado:', await res.json());
  }
}

async function createDrogas(cookie) {
  const res = await fetch('http://api-garrahan-app-1:3000/drogas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
    body: JSON.stringify(drogas),
  });
  console.log('Drogas creadas:', await res.json());
}

async function createFormasFarmaceuticas(cookie) {
  const formas = [
    { nombre: 'COMPRIMIDO', codigo: 'VO' },
    { nombre: 'CÁPSULA', codigo: 'VO' },
    { nombre: 'FRASCO AMPOLLA', codigo: 'IV' },
    { nombre: 'VIAL', codigo: 'IV' },
    { nombre: 'JERINGA PRELLENADA', codigo: 'IV' }
  ];

  const res = await fetch('http://api-garrahan-app-1:3000/formas-farmaceuticas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
    body: JSON.stringify(formas),
  });
  console.log('Formas farmacéuticas creadas:', await res.json());
}

async function createPresentacionesDroga(cookie) {
  // estado para qué sirve?
  //const presentaciones = [
  //  { droga_id: 20, forma_farmaceutica_id: 3, estado: 'Activo', fuerza_valor: 10, fuerza_unidad: 'mg' }, //CISPLATINO
  //  { droga_id: 20, forma_farmaceutica_id: 3, estado: 'Activo', fuerza_valor: 50, fuerza_unidad: 'mg' }, //CISPLATINO
  //  { droga_id: 2, forma_farmaceutica_id: 1, estado: null, fuerza_valor: null, fuerza_unidad: null },
  //  { droga_id: 3, forma_farmaceutica_id: 1, estado: null, fuerza_valor: null, fuerza_unidad: null },
  //];

  for (const presentacion of presentaciones_droga) {
    const drogaId = presentacion.droga_id;

    const url = `http://api-garrahan-app-1:3000/drogas/${drogaId}/presentaciones`;


    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
      body: JSON.stringify(presentacion),
    });

    console.log('Presentaciones de droga creadas:', await res.json());
  }
}

async function createCiclos(cookie, protocoloId) {
  const ciclos = [
    { ciclo_id: 1, regimen: 0, duracion_semanas: 5, ciclo_final: false, repeticiones: 3 },
    { ciclo_id: 2, regimen: 0, duracion_semanas: 5, ciclo_final: false, repeticiones: 2 },
    { ciclo_id: 3, regimen: 1, duracion_semanas: 5, ciclo_final: false,  repeticiones: 1 },
    { ciclo_id: 4, regimen: 1, duracion_semanas: 5, ciclo_final: false,  repeticiones: 0 },
    { ciclo_id: 5, regimen: 1, duracion_semanas: 4, ciclo_final: false,  repeticiones: 1 },
    { ciclo_id: 6, regimen: 1, duracion_semanas: 4, ciclo_final: true,  repeticiones: 0 },

    { ciclo_id: 3, regimen: 2, duracion_semanas: 5, ciclo_final: false,  repeticiones: 1 },
    { ciclo_id: 4, regimen: 2, duracion_semanas: 5, ciclo_final: false,  repeticiones: 0 },
    { ciclo_id: 5, regimen: 2, duracion_semanas: 4, ciclo_final: false,  repeticiones: 1 },
    { ciclo_id: 6, regimen: 2, duracion_semanas: 4, ciclo_final: false,  repeticiones: 0 },

    { ciclo_id: 7, regimen: 2, duracion_semanas: 1, ciclo_final: true,  repeticiones: 73 },
  ];

  const res = await fetch(`http://api-garrahan-app-1:3000/protocolos/${protocoloId}/ciclos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
    body: JSON.stringify(ciclos),
  });
  console.log('Ciclos creados:', await res.json());
}

async function createViasAdministracion(cookie) {
  const vias = [
    { nombre: 'Intravenosa', codigo: 'IV' },
    { nombre: 'Oral', codigo: 'VO' },
  ];

  const res = await fetch('http://api-garrahan-app-1:3000/vias-administracion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
    body: JSON.stringify(vias),
  });
  console.log('Vías de administración creadas:', await res.json());
}

async function createPresentacionDrogaVia(cookie) {
  const res = await fetch('http://api-garrahan-app-1:3000/presentaciones-droga-via', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
    body: JSON.stringify(presentaciones_droga_via),
  });
  console.log('Presentaciones de droga por vía creadas:', await res.json());
}

async function createAdministracionesMedicacion(cookie) {
  // REHACER.
  const administraciones = [

    // RÉGIMEN 0
    { protocolo_id: 1, ciclo_id: 1, regimen: 0, droga_id: 20, cantidad_dias: 2, frecuencia_diaria: 1, fuerza_valor: 60, fuerza_unidad: 'mg/m2', via_id: 1 },
    { protocolo_id: 1, ciclo_id: 1, regimen: 0, droga_id: 34, cantidad_dias: 2, frecuencia_diaria: 1, fuerza_valor: 37.5, fuerza_unidad: 'mg/m2', via_id: 1 },
    { protocolo_id: 1, ciclo_id: 1, regimen: 0, droga_id: 68, cantidad_dias: 2, frecuencia_diaria: 1, fuerza_valor: 12, fuerza_unidad: 'gr/m2',  via_id: 1 },

    { protocolo_id: 1, ciclo_id: 2, regimen: 0, droga_id: 20, cantidad_dias: 2, frecuencia_diaria: 1, fuerza_valor: 60, fuerza_unidad: 'mg/m2', via_id: 1 },
    { protocolo_id: 1, ciclo_id: 2, regimen: 0, droga_id: 34, cantidad_dias: 2, frecuencia_diaria: 1, fuerza_valor: 37.5, fuerza_unidad: 'mg/m2', via_id: 1 },
    { protocolo_id: 1, ciclo_id: 2, regimen: 0, droga_id: 68, cantidad_dias: 2, frecuencia_diaria: 1, fuerza_valor: 12, fuerza_unidad: 'gr/m2',  via_id: 1 },

    // RÉGIMEN 1
    { protocolo_id: 1, ciclo_id: 3, regimen: 1, droga_id: 20, cantidad_dias: 2, frecuencia_diaria: 1, fuerza_valor: 60, fuerza_unidad: 'mg/m2', via_id: 1 },
    { protocolo_id: 1, ciclo_id: 3, regimen: 1, droga_id: 34, cantidad_dias: 2, frecuencia_diaria: 1, fuerza_valor: 37.5, fuerza_unidad: 'mg/m2', via_id: 1 },
    { protocolo_id: 1, ciclo_id: 3, regimen: 1, droga_id: 68, cantidad_dias: 2, frecuencia_diaria: 1, fuerza_valor: 12, fuerza_unidad: 'gr/m2',  via_id: 1 },

    { protocolo_id: 1, ciclo_id: 4, regimen: 1, droga_id: 20, cantidad_dias: 2, frecuencia_diaria: 1, fuerza_valor: 60, fuerza_unidad: 'mg/m2', via_id: 1 },
    { protocolo_id: 1, ciclo_id: 4, regimen: 1, droga_id: 34, cantidad_dias: 2, frecuencia_diaria: 1, fuerza_valor: 37.5, fuerza_unidad: 'mg/m2', via_id: 1 },
    { protocolo_id: 1, ciclo_id: 4, regimen: 1, droga_id: 68, cantidad_dias: 2, frecuencia_diaria: 1, fuerza_valor: 12, fuerza_unidad: 'gr/m2',  via_id: 1 },

    { protocolo_id: 1, ciclo_id: 5, regimen: 1, droga_id: 34, cantidad_dias: 2, frecuencia_diaria: 1, fuerza_valor: 37.5, fuerza_unidad: 'mg/m2', via_id: 1 },
    { protocolo_id: 1, ciclo_id: 5, regimen: 1, droga_id: 68, cantidad_dias: 2, frecuencia_diaria: 1, fuerza_valor: 12, fuerza_unidad: 'gr/m2',  via_id: 1 },
    { protocolo_id: 1, ciclo_id: 5, regimen: 1, droga_id: 104, cantidad_dias: 2, frecuencia_diaria: 1, fuerza_valor: 375, fuerza_unidad: 'mg/m2', via_id: 1 },

    { protocolo_id: 1, ciclo_id: 6, regimen: 1, droga_id: 34, cantidad_dias: 2, frecuencia_diaria: 1, fuerza_valor: 37.5, fuerza_unidad: 'mg/m2', via_id: 1 },
    { protocolo_id: 1, ciclo_id: 6, regimen: 1, droga_id: 68, cantidad_dias: 2, frecuencia_diaria: 1, fuerza_valor: 12, fuerza_unidad: 'gr/m2',  via_id: 1 },
    { protocolo_id: 1, ciclo_id: 6, regimen: 1, droga_id: 104, cantidad_dias: 2, frecuencia_diaria: 1, fuerza_valor: 375, fuerza_unidad: 'mg/m2', via_id: 1 },

    // RÉGIMEN 2
    { protocolo_id: 1, ciclo_id: 3, regimen: 2, droga_id: 20, cantidad_dias: 2, frecuencia_diaria: 1, fuerza_valor: 60, fuerza_unidad: 'mg/m2', via_id: 1 },
    { protocolo_id: 1, ciclo_id: 3, regimen: 2, droga_id: 34, cantidad_dias: 2, frecuencia_diaria: 1, fuerza_valor: 37.5, fuerza_unidad: 'mg/m2', via_id: 1 },
    { protocolo_id: 1, ciclo_id: 3, regimen: 2, droga_id: 68, cantidad_dias: 2, frecuencia_diaria: 1, fuerza_valor: 12, fuerza_unidad: 'gr/m2',  via_id: 1 },

    { protocolo_id: 1, ciclo_id: 4, regimen: 2, droga_id: 20, cantidad_dias: 2, frecuencia_diaria: 1, fuerza_valor: 60, fuerza_unidad: 'mg/m2', via_id: 1 },
    { protocolo_id: 1, ciclo_id: 4, regimen: 2, droga_id: 34, cantidad_dias: 2, frecuencia_diaria: 1, fuerza_valor: 37.5, fuerza_unidad: 'mg/m2', via_id: 1 },
    { protocolo_id: 1, ciclo_id: 4, regimen: 2, droga_id: 68, cantidad_dias: 2, frecuencia_diaria: 1, fuerza_valor: 12, fuerza_unidad: 'gr/m2',  via_id: 1 },

    { protocolo_id: 1, ciclo_id: 5, regimen: 2, droga_id: 34, cantidad_dias: 2, frecuencia_diaria: 1, fuerza_valor: 37.5, fuerza_unidad: 'mg/m2', via_id: 1 },
    { protocolo_id: 1, ciclo_id: 5, regimen: 2, droga_id: 68, cantidad_dias: 2, frecuencia_diaria: 1, fuerza_valor: 12, fuerza_unidad: 'gr/m2',  via_id: 1 },
    { protocolo_id: 1, ciclo_id: 5, regimen: 2, droga_id: 104, cantidad_dias: 2, frecuencia_diaria: 1, fuerza_valor: 375, fuerza_unidad: 'mg/m2', via_id: 1 },

    { protocolo_id: 1, ciclo_id: 6, regimen: 2, droga_id: 34, cantidad_dias: 2, frecuencia_diaria: 1, fuerza_valor: 37.5, fuerza_unidad: 'mg/m2', via_id: 1 },
    { protocolo_id: 1, ciclo_id: 6, regimen: 2, droga_id: 68, cantidad_dias: 2, frecuencia_diaria: 1, fuerza_valor: 12, fuerza_unidad: 'gr/m2',  via_id: 1 },
    { protocolo_id: 1, ciclo_id: 6, regimen: 2, droga_id: 104, cantidad_dias: 2, frecuencia_diaria: 1, fuerza_valor: 375, fuerza_unidad: 'mg/m2', via_id: 1 },

    { protocolo_id: 1, ciclo_id: 7, regimen: 2, droga_id: 18, cantidad_dias: 7, frecuencia_diaria: 1, fuerza_valor: 25, fuerza_unidad: 'mg/m2', via_id: 1 },
    { protocolo_id: 1, ciclo_id: 7, regimen: 2, droga_id: 68, cantidad_dias: 2, frecuencia_diaria: 2, fuerza_valor: 1.5, fuerza_unidad: 'mg/m2',  via_id: 1 },

  ];
  //MISSING DEXRAZOXANE DE SU TABLA DE DROGAS DROGA-ID 4 ACÁ.
  // 2do DEXRAZOXANE solo para dar la opción de VO y IV por lo pronto.

  for (const adm of administraciones) {
    const url = `http://api-garrahan-app-1:3000/protocolos/${adm.protocolo_id}/ciclos/${adm.ciclo_id}/regimenes/${adm.regimen}/administraciones`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
      body: JSON.stringify(adm),
    });

    console.log(`Administración creada para ciclo ${adm.ciclo_id}, droga ${adm.droga_id}:`, await res.json());
  }
}

async function createPacientes(cookie) {
  const pacientes = [
    { nombre: 'María', apellido: 'Pérez', id_hospitalario: 'H001', fecha_nacimiento: '2020-05-12', peso: 30.5, sexo: 'F', profesional_id: 1, obra_social: 'OSDE' },
    { nombre: 'Juan', apellido: 'Esposito', id_hospitalario: 'H002', fecha_nacimiento: null, peso: null, sexo: 'M', profesional_id: 2, obra_social: null }
  ];
  for (const p of pacientes) {
    console.log('Paciente creado:', await (await fetch('http://api-garrahan-app-1:3000/pacientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
      body: JSON.stringify(p) })).json());
  }
}


async function main() {
  const cookieAdmin = await login('admin');
  const protocolo = await createProtocolo(cookieAdmin);
  await createProfesionales(cookieAdmin);
  await createDrogas(cookieAdmin);
  await createFormasFarmaceuticas(cookieAdmin);
  await createPresentacionesDroga(cookieAdmin);
  await createViasAdministracion(cookieAdmin);
  await createCiclos(cookieAdmin, protocolo.protocolo_id);
  await createPresentacionDrogaVia(cookieAdmin);
  await createAdministracionesMedicacion(cookieAdmin);
  const cookieMedico = await login('medico');
  await createPacientes(cookieMedico);

  console.log('Seeds creadas correctamente');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
