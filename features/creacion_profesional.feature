Feature: Creación profesional
  Como usuario del sistema
  Quiero poder crear y consultar profesionales
  Para que queden correctamente registrados en la base de datos

    Scenario: US-02.1 Crear un profesional con todos los campos
        Given quiero crear un profesional con nombre "Walter"
        And apellido del profesional "Perez"
        And dni del profesional "20981812"
        And matricula del profesional "MP12345"
        And especialidad del profesional "Oncología"
        When publico en el endpoint de profesionales "/profesional" con los datos
        Then el profesional se crea correctamente

    Scenario: US-02.2 Obtener un profesional creado por su id
        Given existe un profesional con nombre "Walter", apellido "Perez", dni "20981812", matricula "MP12345", especialidad "Oncología"
        When consulto en la API "/profesional/1" por su id de profesional
        Then el sistema me devuelve el profesional con id correspondiente
        And "nombre" del profesional es "Walter"
        And "apellido" del profesional es "Perez"
        And "dni" del profesional es "20981812"
        And "matricula" del profesional es "MP12345"
        And "especialidad" del profesional es "Oncología"

    Scenario: US-02.3 Crear profesional sin dni
        Given quiero crear un profesional con nombre "Walter"
        And apellido del profesional "Perez"
        And matricula del profesional "MP12345"
        And especialidad del profesional "Oncología"
        When publico en el endpoint de profesionales "/profesional" con los datos
        Then obtengo el error "Faltan campos requeridos"

    Scenario: US-02.4 Crear profesional sin nombre
        Given quiero crear un profesional con apellido "Perez"
        And dni del profesional "20981812"
        And matricula del profesional "MP12345"
        And especialidad del profesional "Oncología"
        When publico en el endpoint de profesionales "/profesional" con los datos
        Then obtengo el error "Faltan campos requeridos"

    Scenario: US-02.5 Crear profesional sin apellido
        Given quiero crear un profesional con nombre "Walter"
        And dni del profesional "20981812"
        And matricula del profesional "MP12345"
        And especialidad del profesional "Oncología"
        When publico en el endpoint de profesionales "/profesional" con los datos
        Then obtengo el error "Faltan campos requeridos"
