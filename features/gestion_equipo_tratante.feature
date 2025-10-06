Feature: Gestión de equipo tratante paciente-profesional
  Como sistema de gestión hospitalaria
  Quiero gestionar la relación entre pacientes y profesionales
  Para permitir equipos tratantes, cambios de profesional y colaboradores

  Scenario: US-05.1 Al crear un paciente se asigna automáticamente al profesional tratante
    Given quiero crear un paciente con nombre "Juan"
    And apellido "Pérez"
    And id_hospitalario "P12345"
    And fecha_nacimiento "2020-05-21"
    And peso "30"
    And sexo "M"
    And profesional_id
    When publico en el endpoint "/paciente" con los datos
    Then el paciente se crea correctamente
    And el profesional queda asignado automáticamente como "Médico Tratante"

  Scenario: US-05.2 Puedo agregar un profesional colaborador a un paciente
    Given existe un paciente creado por un profesional
    And existe otro profesional disponible
    When agrego el segundo profesional como colaborador del paciente
    Then el profesional se agrega correctamente al equipo tratante
    And el paciente tiene 2 profesionales asignados

  Scenario: US-05.3 Cambiar profesional principal sin afectar consultores
    Given que existe un paciente con nombre "Carlos" y apellido "Mendez"
    And el paciente tiene al profesional con id 1 como médico tratante
    And el paciente tiene al profesional con id 2 como consultor
    When cambio el profesional principal del paciente al profesional con id 3
    Then el paciente debe tener al profesional con id 3 como médico tratante
    And el paciente debe mantener al profesional con id 2 como consultor
    And el profesional con id 1 no debe estar asignado al paciente

  Scenario: US-05.4 Puedo obtener el equipo tratante de un paciente
    Given existe un paciente con profesional principal
    And tiene un profesional colaborador agregado
    When consulto el equipo tratante del paciente
    Then obtengo la lista completa de profesionales
    And cada profesional tiene su rol correspondiente

  Scenario: US-05.5 Puedo obtener todos los pacientes de un profesional
    Given existe un profesional con pacientes asignados
    When consulto los pacientes del profesional
    Then obtengo la lista de todos sus pacientes

  Scenario: US-05.6 No se puede agregar consultor inexistente
    Given que existe un paciente con nombre "Ana" y apellido "Garcia"
    When intento agregar al profesional con id 9999 como consultor del paciente
    Then debo recibir un error indicando que el profesional no existe

  Scenario: US-05.7 No se puede agregar consultor ya asignado
    Given que existe un paciente con nombre "Luis" y apellido "Torres"
    And el paciente tiene al profesional con id 1 como consultor
    When intento agregar al profesional con id 1 como consultor del paciente
    Then debo recibir un error indicando que el profesional ya está asignado