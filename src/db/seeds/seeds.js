// seeds.js
import { readFileSync } from 'fs';

const drogas = JSON.parse(readFileSync(new URL('./data/drogas.json', import.meta.url)));
const presentaciones_droga = JSON.parse(readFileSync(new URL('./data/presentaciones_droga.json', import.meta.url)));
const presentaciones_droga_via = JSON.parse(readFileSync(new URL('./data/presentaciones_droga_via.json', import.meta.url)));
const ciclos = JSON.parse(readFileSync(new URL('./data/ciclos.json', import.meta.url)));
const administraciones = JSON.parse(readFileSync(new URL('./data/administraciones.json', import.meta.url)));
const protocolos = JSON.parse(readFileSync(new URL('./data/protocolos.json', import.meta.url)));
const profesionales = JSON.parse(readFileSync(new URL('./data/profesionales.json', import.meta.url)));
const formas_farmaceuticas = JSON.parse(readFileSync(new URL('./data/formas_farmaceuticas.json', import.meta.url)));
const vias_administracion = JSON.parse(readFileSync(new URL('./data/vias_administracion.json', import.meta.url)));
const pacientes = JSON.parse(readFileSync(new URL('./data/pacientes.json', import.meta.url)));
const protocolos_paciente = JSON.parse(readFileSync(new URL('./data/protocolos_paciente.json', import.meta.url)));
const recetas = JSON.parse(readFileSync(new URL('./data/recetas.json', import.meta.url)));

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
  for (const protocolo of protocolos) {
    const res = await fetch('http://api-garrahan-app-1:3000/protocolos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
      body: JSON.stringify(protocolo),
    });
    console.log(`Protocolo ${protocolo.nombre} creado:`, await res.json());
  }
}

async function createProfesionales(cookie) {
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
  const res = await fetch('http://api-garrahan-app-1:3000/formas-farmaceuticas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
    body: JSON.stringify(formas_farmaceuticas),
  });
  console.log('Formas farmacéuticas creadas:', await res.json());
}

async function createPresentacionesDroga(cookie) {
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

//async function createCiclos(cookie, protocoloId) {
//  const ciclos = [
//    { ciclo_id: 1, regimen: 0, duracion_semanas: 5, ciclo_final: false, repeticiones: 0 },
//    { ciclo_id: 2, regimen: 0, duracion_semanas: 5, ciclo_final: false, repeticiones: 0 },
//
//    { ciclo_id: 3, regimen: 1, duracion_semanas: 5, ciclo_final: false,  repeticiones: 0 },
//    { ciclo_id: 4, regimen: 1, duracion_semanas: 5, ciclo_final: false,  repeticiones: 0 },
//    { ciclo_id: 5, regimen: 1, duracion_semanas: 4, ciclo_final: false,  repeticiones: 0 },
//    { ciclo_id: 6, regimen: 1, duracion_semanas: 4, ciclo_final: true,  repeticiones: 0 },
//
//    { ciclo_id: 3, regimen: 2, duracion_semanas: 5, ciclo_final: false,  repeticiones: 0 },
//    { ciclo_id: 4, regimen: 2, duracion_semanas: 5, ciclo_final: false,  repeticiones: 0 },
//    { ciclo_id: 5, regimen: 2, duracion_semanas: 4, ciclo_final: false,  repeticiones: 0 },
//    { ciclo_id: 6, regimen: 2, duracion_semanas: 4, ciclo_final: false,  repeticiones: 0 },
//
//    { ciclo_id: 7, regimen: 2, duracion_semanas: 1, ciclo_final: true,  repeticiones: 73 },
//  ];
//
//  const res = await fetch(`http://api-garrahan-app-1:3000/protocolos/${protocoloId}/ciclos`, {
//    method: 'POST',
//    headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
//    body: JSON.stringify(ciclos),
//  });
//  console.log('Ciclos creados:', await res.json());
//}

async function createCiclos(cookie) {
  const urlBase = 'http://api-garrahan-app-1:3000/protocolos';
  for (const protocolo of ciclos) {
    const protocoloId = protocolo.protocolo_id;
    const ciclos = protocolo.ciclos;
    console.log(`Enviando ciclos para el Protocolo ID: ${protocoloId}`);

    const res = await fetch(`${urlBase}/${protocoloId}/ciclos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie
      },
      body: JSON.stringify(ciclos),
    });
    if (res.ok) {
      const resultado = await res.json();
      console.log(`Ciclos para Protocolo ${protocoloId} creados exitosamente:`, resultado);
    }
  }
}

async function createViasAdministracion(cookie) {
  const res = await fetch('http://api-garrahan-app-1:3000/vias-administracion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
    body: JSON.stringify(vias_administracion),
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
  for (const p of pacientes) {
    const res = await fetch('http://api-garrahan-app-1:3000/pacientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
      body: JSON.stringify(p)
    });
    console.log('Paciente creado:', await res.json());
  }
}

async function createProtocolosPaciente(cookie) {
  for (const pp of protocolos_paciente) {
    const res = await fetch(`http://api-garrahan-app-1:3000/pacientes/${pp.paciente_id}/protocolos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
      body: JSON.stringify(pp)
    });
    console.log(`Protocolo asignado a paciente ${pp.paciente_id}:`, await res.json());
  }
}

async function createRecetas(cookie) {
  for (const receta of recetas) {
    const res = await fetch('http://api-garrahan-app-1:3000/recetas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
      body: JSON.stringify(receta)
    });
    if (res.ok) {
      console.log(`Receta creada para paciente ${receta.paciente_id}:`, await res.json());
    } else {
      console.log(`Error al crear receta para paciente ${receta.paciente_id}:`, await res.text());
    }
  }
}

async function main() {
  const cookieAdmin = await login('admin');
  await createProtocolo(cookieAdmin);
  await createProfesionales(cookieAdmin);
  await createDrogas(cookieAdmin);
  await createFormasFarmaceuticas(cookieAdmin);
  await createPresentacionesDroga(cookieAdmin);
  await createViasAdministracion(cookieAdmin);
  await createCiclos(cookieAdmin);
  await createPresentacionDrogaVia(cookieAdmin);
  await createAdministracionesMedicacion(cookieAdmin);
  
  const cookieMedico = await login('medico');
  await createPacientes(cookieMedico);
  await createProtocolosPaciente(cookieMedico);
  await createRecetas(cookieMedico);

  console.log('\n✅ Seeds creadas correctamente');
  console.log('\n📊 Datos para sistema de alarmas:');
  console.log('- Paciente 1 (María): Receta del 2025-10-18 (hace ~20 días)');
  console.log('- Paciente 2 (Juan): Receta del 2025-10-22 (hace ~16 días)');
  console.log('- Paciente 3 (Ana): Receta del 2025-11-02 (hace ~5 días)');
  console.log('\n💡 Con límite de 14 días, deberían generarse 2 alarmas (pacientes 1 y 2)');
  console.log('\n⏰ El job de alarmas se ejecutará automáticamente a las 2:00 AM');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
