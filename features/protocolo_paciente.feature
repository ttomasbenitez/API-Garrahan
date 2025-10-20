
Feature: Asignar y consultar protocolos de un paciente
  Como sistema de prescripción
  Quiero asignar protocolos a pacientes
  Para poder registrar y consultar su tratamiento actual

  Background:
    Given existe en la base de datos un profesional con id "1" llamado "Dr. García"
    And existe en la base de datos un protocolo con id "1" llamado "Osteosarcoma GBTO 2006"
    And existe en la base de datos un ciclo con protocolo_id "1", ciclo_id "1" y regimen "0"
    And existe en la base de datos un paciente con id "1" llamado "Marcos Pérez"

  Scenario: US-11.1 Asignar un protocolo a un paciente
    Given quiero asignar a un paciente un protocolo con los siguientes datos
      | protocolo_id            | 1        |
      | regimen                 | 0        |
      | ciclo_actual_id         | 1        |
      | numero_ciclo            | 1        |
      | fecha_inicio            | 2025-10-07 |
      | estado                  | ACTIVO   |
      | profesional_id_asignador | 1        |
    When publico en la API "/paciente/1/protocolos" con esos datos
    Then la asignación se crea correctamente

  Scenario: US-11.2 Obtener protocolos asignados a un paciente
    Given existe en la base de datos un protocolo asignado al paciente con id "1" con los siguientes datos
      | protocolo_id            | 1        |
      | regimen                 | 0        |
      | ciclo_actual_id         | 1        |
      | numero_ciclo            | 1        |
      | fecha_inicio            | 2025-10-07 |
      | estado                  | ACTIVO   |
      | profesional_id_asignador | 1        |
    When consulto la API "/paciente/1/protocolos"
    Then el sistema devuelve una lista con al menos un protocolo asignado
    And el primer protocolo tiene "estado" igual a "ACTIVO"

  Scenario: US-11.3 Validación: campos requeridos
    Given quiero asignar a un paciente un protocolo con los siguientes datos
      | protocolo_id | 1 |
    When publico en la API "/paciente/1/protocolos" con esos datos
    Then el sistema responde con estado "400"
    And el error contiene el texto "Faltan campos requeridos"

  Scenario: US-11.4 Error por FK: paciente inexistente
    Given quiero asignar a un paciente un protocolo con los siguientes datos
      | protocolo_id            | 1 |
      | regimen                 | 0 |
      | ciclo_actual_id         | 1 |
      | profesional_id_asignador | 1 |
    When publico en la API "/paciente/999/protocolos" con esos datos
    Then el sistema responde con estado "404"
    And el error contiene el texto "Paciente no encontrado. No se puede asignar el protocolo."

  Scenario: US-11.5 Error por FK: ciclo inexistente
    Given quiero asignar a un paciente un protocolo con los siguientes datos
      | protocolo_id            | 1 |
      | regimen                 | 0 |
      | ciclo_actual_id         | 99 |
      | profesional_id_asignador | 1 |
    When publico en la API "/paciente/1/protocolos" con esos datos
    Then el sistema responde con estado "404"
    And el error contiene el texto "Ciclo no encontrado. No se puede asignar el protocolo."

  @wip
  Scenario: US-11.6 Conflicto por duplicado (mismo protocolo/regimen ya asignado)
    Given ya existe una asignación para el paciente con id "12" con los datos
      | protocolo_id            | 1 |
      | regimen                 | 0 |
      | ciclo_actual_id         | 1 |
      | profesional_id_asignador | 1 |
    When intento asignar el mismo protocolo o regimen nuevamente al paciente con id "12"
    Then el sistema responde con estado "409"
    And el error contiene el texto "protocolo ya asignado al paciente"

  Scenario: US-11.7 Obtener un protocolo específico de un paciente
    Given existe en la base de datos un protocolo asignado al paciente con id "1" con los siguientes datos
      | protocolo_id            | 1        |
      | regimen                 | 0        |
      | ciclo_actual_id         | 1        |
      | numero_ciclo            | 1        |
      | fecha_inicio            | 2025-10-07 |
      | estado                  | ACTIVO   |
      | profesional_id_asignador | 1        |
    When consulto la API "/paciente/1/protocolos/1"
    Then el sistema devuelve un protocolo con regimen igual a "0"
    And el estado es "ACTIVO"
