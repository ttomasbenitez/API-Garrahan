// seeds.js
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
  const res = await fetch('http://api-garrahan-app-1:3000/protocolo', {
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
    const res = await fetch('http://api-garrahan-app-1:3000/profesional', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
      body: JSON.stringify(p),
    });
    console.log('Profesional creado:', await res.json());
  }
}

async function createDrogas(cookie) {
  const drogas = [
    { nombre_generico: 'Cisplatina', codigo_farmacia: 'D1' },
    { nombre_generico: 'Doxorrubicina', codigo_farmacia: 'D2' },
    { nombre_generico: 'Metotrexato', codigo_farmacia: 'D3' },
    { nombre_generico: 'Desrazozxane', codigo_farmacia: 'D4' },
  ];

  const res = await fetch('http://api-garrahan-app-1:3000/droga', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
    body: JSON.stringify(drogas),
  });
  console.log('Drogas creadas:', await res.json());
}

async function createFormasFarmaceuticas(cookie) {
  const formas = [
    { nombre: 'Comprimido', codigo: 'VO' },
    { nombre: 'Ampolla', codigo: 'IV' },
  ];

  const res = await fetch('http://api-garrahan-app-1:3000/forma-farmaceutica', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
    body: JSON.stringify(formas),
  });
  console.log('Formas farmacéuticas creadas:', await res.json());
}

async function createPresentacionesDroga(cookie) {
  const presentaciones = [
    { droga_id: 1, forma_farmaceutica_id: 1, estado: 'Activo', fuerza_valor: 200, fuerza_unidad: 'mg/ml' },
    { droga_id: 2, forma_farmaceutica_id: 1, estado: null, fuerza_valor: null, fuerza_unidad: null },
    { droga_id: 3, forma_farmaceutica_id: 1, estado: null, fuerza_valor: null, fuerza_unidad: null },
  ];

  const res = await fetch('http://api-garrahan-app-1:3000/presentacion-droga', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
    body: JSON.stringify(presentaciones),
  });
  console.log('Presentaciones de droga creadas:', await res.json());
}

async function createCiclos(cookie, protocoloId) {
  const ciclos = [
    { ciclo_id: 1, regimen: 1, duracion_semanas: 5, ciclo_final: false, repeticiones: 2 },
    { ciclo_id: 2, regimen: 1, duracion_semanas: 5, ciclo_final: false, repeticiones: 2 },
    { ciclo_id: 3, regimen: 1, duracion_semanas: 4, ciclo_final: true,  repeticiones: 2 },
    { ciclo_id: 1, regimen: 2, duracion_semanas: 5, ciclo_final: false, repeticiones: 2 },
    { ciclo_id: 2, regimen: 2, duracion_semanas: 5, ciclo_final: false, repeticiones: 2 },
    { ciclo_id: 3, regimen: 2, duracion_semanas: 4, ciclo_final: false, repeticiones: 2 },
    { ciclo_id: 4, regimen: 2, duracion_semanas: 1, ciclo_final: true,  repeticiones: 73 },
  ];

  const res = await fetch(`http://api-garrahan-app-1:3000/protocolo/${protocoloId}/ciclo`, {
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

  const res = await fetch('http://api-garrahan-app-1:3000/via-administracion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
    body: JSON.stringify(vias),
  });
  console.log('Vías de administración creadas:', await res.json());
}

async function createPresentacionDrogaVia(cookie) {
  const presentaciones = [
    { via_id: 1, presentacion_id: 1, es_default: '0' },
    { via_id: 2, presentacion_id: 1, es_default: '0' },
    { via_id: 1, presentacion_id: 2, es_default: '0' },
  ];

  const res = await fetch('http://api-garrahan-app-1:3000/presentacion-droga-via', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
    body: JSON.stringify(presentaciones),
  });
  console.log('Presentaciones de droga por vía creadas:', await res.json());
}

async function createAdministracionesMedicacion(cookie) {
  const administraciones = [
    { protocolo_id: 1, ciclo_id: 1, regimen: 1, droga_id: 1, cantidad_dias: 2, administracion_diaria: 0, frecuencia_diaria: 1, fuerza_valor: 60,   fuerza_unidad: 'MG/M2', via_id: 1 },
    { protocolo_id: 1, ciclo_id: 1, regimen: 1, droga_id: 2, cantidad_dias: 2, administracion_diaria: 0, frecuencia_diaria: 1, fuerza_valor: 37.5, fuerza_unidad: 'MG/M2', via_id: 1 },
    { protocolo_id: 1, ciclo_id: 1, regimen: 1, droga_id: 3, cantidad_dias: 2, administracion_diaria: 0, frecuencia_diaria: 1, fuerza_valor: 12,   fuerza_unidad: 'G/M2',  via_id: 1 },
    { protocolo_id: 1, ciclo_id: 2, regimen: 1, droga_id: 1, cantidad_dias: 2, administracion_diaria: 0, frecuencia_diaria: 1, fuerza_valor: 60,   fuerza_unidad: 'MG/M2', via_id: 1 },
    { protocolo_id: 1, ciclo_id: 2, regimen: 1, droga_id: 2, cantidad_dias: 2, administracion_diaria: 0, frecuencia_diaria: 1, fuerza_valor: 37.5, fuerza_unidad: 'MG/M2', via_id: 1 },
    { protocolo_id: 1, ciclo_id: 2, regimen: 1, droga_id: 3, cantidad_dias: 2, administracion_diaria: 0, frecuencia_diaria: 1, fuerza_valor: 12,   fuerza_unidad: 'G/M2',  via_id: 1 },
    { protocolo_id: 1, ciclo_id: 3, regimen: 1, droga_id: 2, cantidad_dias: 2, administracion_diaria: 0, frecuencia_diaria: 1, fuerza_valor: 37.5, fuerza_unidad: 'MG/M2', via_id: 1 },
    { protocolo_id: 1, ciclo_id: 3, regimen: 1, droga_id: 4, cantidad_dias: 2, administracion_diaria: 0, frecuencia_diaria: 1, fuerza_valor: 375,  fuerza_unidad: 'MG/M2', via_id: 1 },
    { protocolo_id: 1, ciclo_id: 3, regimen: 1, droga_id: 3, cantidad_dias: 2, administracion_diaria: 0, frecuencia_diaria: 1, fuerza_valor: 12,   fuerza_unidad: 'G/M2',  via_id: 1 }
  ];

  for (const adm of administraciones) {
    const url = `http://api-garrahan-app-1:3000/protocolo/${adm.protocolo_id}/ciclo/${adm.ciclo_id}/regimen/${adm.regimen}/administracion`;

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
    console.log('Paciente creado:', await (await fetch('http://api-garrahan-app-1:3000/paciente', {
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
