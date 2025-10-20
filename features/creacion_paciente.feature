
Feature: Creación paciente
  Como usuario del sistema
  Quiero poder crear y consultar pacientes
  Para que queden correctamente registrados en la base de datos

    Scenario: US-03.1 Crear un paciente con todos los campos
        Given quiero crear un paciente con los siguientes datos:
            | nombre            | Juan        |
            | apellido          | Pérez       |
            | id_hospitalario   | P12345      |
            | fecha_nacimiento  | 2020-05-21  |
            | peso              | 30          |
            | sexo              | M           |
            | obra_social       | OSDE        |
        And profesional_id
        When publico en el endpoint "/paciente" con los datos del paciente
        Then el paciente se crea correctamente

    Scenario: US-03.2 Obtener un paciente creado por su id
        Given existe un paciente con los siguientes datos:
            | nombre            | Juan        |
            | apellido          | Pérez       |
            | id_hospitalario   | P12345      |
            | fecha_nacimiento  | 2020-05-21  |
            | peso              | 40          |
            | sexo              | M           |
            | obra_social       | OSDE        |
        And profesional_id
        When consulto en la API "/paciente/1" por su id de paciente
        Then el sistema me devuelve el paciente correspondiente
        And "nombre" del paciente esperado es "Juan"
        And "apellido" del paciente esperado es "Pérez"
        And "id_hospitalario" del paciente esperado es "P12345"
        And "fecha_nacimiento" del paciente esperada es "2020-05-21"
        And "peso" del paciente esperado es "40"
        And "sexo" del paciente esperado es "M"
        And "obra_social" del paciente esperado es "OSDE"
        And "profesional_id" del paciente esperado es "1"

    Scenario: US-03.3 Crear paciente sin id_hospitalario
        Given existe un paciente con los siguientes datos:
            | nombre            | Juan        |
            | apellido          | Pérez       |
            | fecha_nacimiento  | 2020-05-21  |
            | peso              | 40          |
            | sexo              | M           |
        And profesional_id
        When publico en el endpoint "/paciente" con los datos del paciente
        Then obtengo el error "Faltan campos requeridos"

    Scenario: US-03.4 Crear paciente sin profesional_id
        Given existe un paciente con los siguientes datos:
            | nombre            | Juan        |
            | apellido          | Pérez       |
            | id_hospitalario   | P12345      |
            | fecha_nacimiento  | 2020-05-21  |
            | peso              | 40          |
            | sexo              | M           |
        When publico en el endpoint "/paciente" con los datos del paciente
        Then obtengo el error "Faltan campos requeridos"
