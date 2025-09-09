Feature: Creación paciente
  Como usuario del sistema
  Quiero poder crear y consultar pacientes
  Para que queden correctamente registrados en la base de datos

    Scenario: US-03.1 Crear un paciente con todos los campos
        Given quiero crear un paciente con nombre "Juan"
        And apellido "Pérez"
        And id_hospitalario "P12345"
        And fecha_nacimiento "2020-05-21"
        And peso "30"
        And sexo "M"
        And profesional_id
        When publico en el endpoint "/paciente" con los datos
        Then el paciente se crea correctamente

    Scenario: US-03.2 Obtener un paciente creado por su id
        Given existe un paciente con nombre "Juan", apellido "Pérez", id_hospitalario "P12345", fecha_nacimiento "2021-05-21", peso "40", sexo "M", profesional_id "121"
        When consulto en la API de pacientes por él
        Then el sistema me devuelve el paciente correspondiente
        And el nombre del paciente esperado es "Juan"
        And apellido esperado "Pérez"
        And id_hospitalario esperado "P12345"
        And fecha_nacimiento esperada "2021-05-21"
        And peso esperado "40"
        And sexo esperado "M"
        And profesional_id esperado "121"

    Scenario: US-03.3 Crear paciente sin id_hospitalario
        Given quiero crear un paciente con nombre "Juan"
        And apellido "Pérez"
        And fecha_nacimiento "2020-05-21"
        And peso "30"
        And sexo "M"
        And profesional_id
        When publico en el endpoint "/paciente" con los datos
        Then obtengo el error "Faltan campos requeridos"

    Scenario: US-03.4 Crear paciente sin profesional_id
        Given quiero crear un paciente con nombre "Juan"
        And apellido "Pérez"
        And id_hospitalario "P12345"
        And fecha_nacimiento "2020-05-21"
        And peso "30"
        And sexo "M"
        When publico en el endpoint "/paciente" con los datos
        Then obtengo el error "Faltan campos requeridos"
