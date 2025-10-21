
Feature: Creación paciente
  Como usuario del sistema
  Quiero poder crear y consultar pacientes
  Para que queden correctamente registrados en la base de datos

    Background:
        Given estoy logueado como médico con id "2"

    Scenario: US-03.1 Crear un paciente con todos los campos
        Given quiero crear un paciente con los siguientes datos:
            | nombre            | Juan        |
            | apellido          | Pérez       |
            | id_hospitalario   | P12345      |
            | fecha_nacimiento  | 2020-05-21  |
            | peso              | 30          |
            | sexo              | M           |
            | obra_social       | OSDE        |
        When publico en el endpoint "/paciente" con los datos del paciente
        Then el paciente se crea correctamente

    Scenario: US-03.2 Obtener un paciente asignado al médico por su id
        Given existe un paciente con los siguientes datos asociado al médico con id "2":
            | nombre            | Juan        |
            | apellido          | Pérez       |
            | id_hospitalario   | P12345      |
            | fecha_nacimiento  | 2020-05-21  |
            | peso              | 40          |
            | sexo              | M           |
            | obra_social       | OSDE        |
        When consulto en la API "/paciente/1" por su id de paciente
        Then el sistema me devuelve el paciente correspondiente
        And "nombre" del paciente esperado es "Juan"
        And "apellido" del paciente esperado es "Pérez"
        And "id_hospitalario" del paciente esperado es "P12345"
        And "fecha_nacimiento" del paciente esperada es "2020-05-21"
        And "peso" del paciente esperado es "40"
        And "sexo" del paciente esperado es "M"
        And "obra_social" del paciente esperado es "OSDE"

    Scenario: US-03.3 Intentar obtener un paciente no asignado al médico por su id
        Given existe un paciente con los siguientes datos no asociado al médico con id "2":
            | nombre            | Juan        |
            | apellido          | Pérez       |
            | id_hospitalario   | P12345      |
            | fecha_nacimiento  | 2020-05-21  |
            | peso              | 40          |
            | sexo              | M           |
            | obra_social       | OSDE        |
        When consulto en la API "/paciente/1" por su id de paciente
        Then el sistema devuelve el estado "404"
        And el mensaje de error "Paciente no asociado a profesional"

    @wip
    Scenario: US-03.4 Crear paciente sin id_hospitalario
        Given existe un paciente con los siguientes datos:
            | nombre            | Juan        |
            | apellido          | Pérez       |
            | fecha_nacimiento  | 2020-05-21  |
            | peso              | 40          |
            | sexo              | M           |
        When publico en el endpoint "/paciente" con los datos del paciente
        Then obtengo el error "Faltan campos requeridos"
