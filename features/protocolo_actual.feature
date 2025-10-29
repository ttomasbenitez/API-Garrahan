Feature: Obtención del Tratamiento Activo de un Paciente
  Como usuario del sistema,
  quiero poder consultar el protocolo de tratamiento activo de un paciente
  para conocer su plan actual y las medicaciones asociadas con todos sus detalles.

  Background:
    Given existe una Droga con nombre "CISPLATINO" y droga_id 1
    And existe una FormaFarmaceutica con nombre "FRASCO AMPOLLA", código "IV" y forma_farmaceutica_id 1
    And existe una ViaAdministracion con nombre "Intravenosa", código "IV" y via_id 1
    And existe una PresentacionDroga con presentacion_id 1, droga_id 1, forma_farmaceutica_id 1, codigo_farmacia "PAR001", fuerza_valor 50 y fuerza_unidad "mg"
    And existe una PresentacionDrogaVia para la via_id 1 y presentacion_id 1
    And existe un Protocolo con protocolo_id 1 y nombre "A.B.C. (Estándar)"
    And el Protocolo 1 incluye un Ciclo {ciclo_id: 1, regimen: 1, duracion_semanas: 3}
    And el Ciclo {protocolo_id: 1, ciclo_id: 1, regimen: 1} tiene una AdministracionMedicacion:
      | droga_id              | 1    |
      | via_id                | 1    |
      | fuerza_valor          | 50   |
      | fuerza_unidad         | mg   |
      | cantidad_dias         |  3   |
      | frecuencia_diaria     |  5   |
    And estoy logueado como médico con id "2"
    And existe un Paciente con paciente_id 1 y nombre "Martina"
    And el Paciente 1 tiene asignado el Protocolo 1, Regimen 1, y está en el Ciclo Actual 1

  Scenario: Obtención exitosa del Protocolo y todos los detalles de la Medicación
    When el usuario consulta el endpoint GET /pacientes/1/protocolo-actual
    Then la respuesta debe ser exitosa (código 200)
    And la respuesta debe incluir el Protocolo "A.B.C. (Estándar)" con protocolo_id 1
    And la respuesta debe indicar el Ciclo Actual 1 y Regimen 1
    And la respuesta debe contener 1 Administracion de Medicacion con los siguientes detalles:
      | campo                   | valor           |
      | nombre_droga            | CISPLATINO      |
      | via_administracion      | Intravenosa     |
      | formato_droga           | FRASCO AMPOLLA  |
      | fuerza_valor            | 50              |
      | fuerza_unidad           | mg              |

  Scenario: El paciente no tiene un protocolo activo
      Given el Paciente 2 no tiene ningún Protocolo asignado en protocolo_paciente
      When el usuario consulta el endpoint GET /pacientes/2/protocolo-actual
      Then la respuesta debe ser de "Recurso no encontrado" (código 404)
      And la respuesta debe indicar que "No se encontró un protocolo activo para el paciente"