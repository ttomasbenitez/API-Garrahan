Feature: Creación paciente
  Como usuario del sistema
  Quiero poder crear y consultar pacientes
  Para que queden correctamente registrados en la base de datos

    @wip
    Scenario: US-02.1 Crear un paciente con todos los campos
        Given quiero crear un paciente con nombre "Juan"
        And apellido "Pérez"
        And id_hospitalario "P12345"
        And fecha_nacimiento "2020-05-21"
        And peso "30"
        And sexo "M"
        And profesional_id "101"
        When publico en el endpoint "/paciente" con los datos
        Then el paciente se crea correctamente

    @wip
    Scenario: US-02.2 Obtener un paciente creado por su id
        Given existe un paciente con nombre "Juan", apellido "Pérez", id_hospitalario "P12345", fecha_nacimiento "2020-05-21", peso "30", sexo "M", profesional_id "101"
        When consulto en la API "/paciente/1"
        Then el sistema me devuelve el paciente con id "1"
        And el nombre del paciente es "Juan"
        And apellido "Pérez"
        And id_hospitalario "P12345"
        And fecha_nacimiento "2020-05-21"
        And peso "30"
        And sexo "M"
        And profesional_id "101"

    @wip
    Scenario: US-02.3 Crear paciente sin id_hospitalario
        Given quiero crear un paciente con nombre "Juan"
        And apellido "Pérez"
        And fecha_nacimiento "2020-05-21"
        And peso "30"
        And sexo "M"
        And profesional_id "101"
        When publico en el endpoint "/paciente" con los datos
        Then obtengo el error "Datos incompletos"

    @wip
    Scenario: US-02.4 Crear paciente sin profesional_id
        Given quiero crear un paciente con nombre "Juan"
        And apellido "Pérez"
        And id_hospitalario "P12345"
        And fecha_nacimiento "2020-05-21"
        And peso "30"
        And sexo "M"
        When publico en el endpoint "/paciente" con los datos
        Then obtengo el error "Datos incompletos"
