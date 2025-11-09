Feature: Creación paciente
  Como usuario del sistema
  Quiero poder crear y consultar pacientes
  Para que queden correctamente registrados en la base de datos

  Background:
    Given existe en la base de datos el protocolo con id "1" y con los datos:
      | nombre             | LLA Pediátrica |
      | enfermedad         | LLA            |
      | linea              | 1              |
      | cantidad_regimenes | 2              |
    And existe el ciclo del protocolo "1" con:
      | ciclo_id         | 1 |
      | regimen          | 0 |
      | duracion_semanas | 4 |
      | ciclo_final      | 0 |
      | repeticiones     | 0 |
    And estoy logueado como médico con id "2"

  Scenario: US-03.1 Crear un paciente con todos los campos
    Given quiero crear un paciente con los siguientes datos:
      | nombre                | Juan         |
      | apellido              | Pérez        |
      | id_hospitalario       | P12345       |
      | fecha_nacimiento      | 2020-05-21   |
      | peso                  | 30           |
      | altura                | 60           |
      | sexo                  | M            |
      | obra_social           | OSDE         |
      | tipo_documento        | DNI          |
      | numero_documento      | 12345678     |
      | nacionalidad          | Argentina    |
      | domicilio_calle       | Av. Calchaqui |
      | domicilio_numero      | 1090         |
      | domicilio_piso_depto  | Piso 3B      |
      | codigo_postal         | 1414         |
      | localidad             | Quilmes Oeste |
      | partido               | Quilmes      |
      | telefono              | +54-11-5555-5555 |
      | email                 | juan.perez@example.org |
      | diagnostico           | LLA Pediátrica |
    When publico en el endpoint "/pacientes" con los datos del paciente
    Then el paciente se crea correctamente

  Scenario: US-03.2 Obtener un paciente asignado al médico por su id
    Given existe un paciente con los siguientes datos asociado al médico con id "2":
      | nombre           | Juan        |
      | apellido         | Pérez       |
      | id_hospitalario  | P12345      |
      | fecha_nacimiento | 2020-05-21  |
      | peso             | 40          |
      | altura           | 70          |
      | sexo             | M           |
      | obra_social      | OSDE        |
      | numero_documento | 12345678    |
    When consulto en la API "/pacientes/1" por su id de paciente
    Then el sistema me devuelve el paciente correspondiente
    And "nombre" del paciente esperado es "Juan"
    And "apellido" del paciente esperado es "Pérez"
    And "id_hospitalario" del paciente esperado es "P12345"
    And "fecha_nacimiento" del paciente esperada es "2020-05-21"
    And "peso" del paciente esperado es "40"
    And "altura" del paciente esperado es "70"
    And "sexo" del paciente esperado es "M"
    And "numero_documento" del paciente esperado es "12345678"
    And "obra_social" del paciente esperado es "OSDE"

  Scenario: US-03.3 Intentar obtener un paciente no asignado al médico por su id
    Given existe un paciente con los siguientes datos no asociado al médico con id "2":
      | nombre           | Juan        |
      | apellido         | Pérez       |
      | id_hospitalario  | P12345      |
      | fecha_nacimiento | 2020-05-21  |
      | peso             | 40          |
      | altura           | 70          |
      | sexo             | M           |
      | obra_social      | OSDE        |
      | numero_documento | 12345678    |
    When consulto en la API "/pacientes/1" por su id de paciente
    Then el sistema devuelve el estado "404"
    And el mensaje de error "Paciente no asociado a profesional"

  Scenario: US-03.4 Modificar campos en paciente existente
    Given existe un paciente con los siguientes datos asociado al médico con id "2":
      | nombre          | Juan        |
      | apellido        | Pérez       |
      | id_hospitalario | P12345      |
      | peso            | 40          |
      | altura          | 70          |
      | obra_social     | OSDE        |
    When modifico en la API "/pacientes/1" por el peso "42", altura "100" y obra_social "OCA"
    Then el sistema devuelve el estado "200"
    And el paciente 1 ahora tiene peso 42, altura 100 y obra_social "OCA"

  Scenario: US-03.5 Obtener pacientes
    Given existe en la base de datos un paciente con id "1" llamado "Martin Palermo"
    And existe en la base de datos un paciente con id "2" llamado "Leandro Paredes"
    And existe en la base de datos un paciente con id "3" llamado "Miguel Merentiel"
    When consulto en la API de "/pacientes"
    Then el sistema me devuelve una lista que contiene los siguientes pacientes:
      | paciente_id | nombre  | apellido  |
      | 1           | Martin  | Palermo   |
      | 2           | Leandro | Paredes   |
      | 3           | Miguel  | Merentiel |

  Scenario: US-03.6 Guardar el protocolo del paciente junto con sus datos
    And quiero crear un paciente con los siguientes datos:
      | nombre           | Juan        |
      | apellido         | Pérez       |
      | id_hospitalario  | P12345      |
      | fecha_nacimiento | 2020-05-21  |
      | peso             | 30          |
      | altura           | 60          |
      | sexo             | M           |
      | obra_social      | OSDE        |
      | numero_documento | 12345678    |
    And el siguiente protocolo asociado:
      | protocolo_id     | 1           |
      | regimen          | 0           |
      | ciclo_actual_id  | 1           |
      | fecha_inicio     | 2025-01-01  |
      | estado           | ACTIVO      |
    When publico en el endpoint "/pacientes" con los datos del paciente y el protocolo
    Then el paciente se crea correctamente con el protocolo asociado

  @wip
  Scenario: US-03.7 Obtener paciente de la api del hospital por su id_hospitalario
    Given quiero obtener el paciente con id_hospitalario "2" del sistema del hospital
    And con nombre "Juan" y apellido "Pérez"
    When consulto en la API externa "/pacientes/2/externo" por su id_hospitalario
    Then el sistema devuelve el paciente esperado

  @wip
  Scenario: US-03.8 Crear paciente sin id_hospitalario
    Given existe un paciente con los siguientes datos:
      | nombre           | Juan        |
      | apellido         | Pérez       |
      | fecha_nacimiento | 2020-05-21  |
      | peso             | 40          |
      | sexo             | M           |
    When publico en el endpoint "/pacientes" con los datos del paciente
    Then obtengo el error "Faltan campos requeridos"
