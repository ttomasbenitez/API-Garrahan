Feature: Gestión de Recetas para Pacientes
  Como sistema de prescripción
  Quiero crear y consultar recetas emitidas a pacientes en un contexto de tratamiento
  Para registrar el inicio y parámetros del tratamiento

  Background:
    Given existe en la base de datos el paciente con id "1" y con los datos:
      | nombre            | Juan        |
      | apellido          | Pérez       |
      | id_hospitalario   | P12345      |
      | fecha_nacimiento  | 2020-05-21  |
      | peso              | 40          |
      | sexo              | M           |
      | obra_social       | OSDE        |
    And existe en la base de datos el protocolo con id "1" y con los datos:
      | nombre      | LLA Pediátrica |
      | enfermedad  | LLA            |
      | linea       | 1              |
    And existe el ciclo del protocolo "1" con:
      | ciclo_id         | 1 |
      | regimen          | 1 |
      | duracion_semanas | 4 |
      | ciclo_final      | 0 |
      | repeticiones     | 1 |
    And estoy logueado como médico con id "1"

  Scenario: US-11.1 Crear una nueva receta (campos mínimos)
    Given que tengo los siguientes datos de la receta:
      | protocolo_id        | 1       |
      | ciclo_id            | 1       |
      | regimen             | 1       |
      | paciente_id         | 1       |
      | profesional_id      | 1       |
      | estado              | activo  |
      | peso                | 40.4    |
      | talla               | 140.7   |
      | superficie_corporal | 1.2     |
    When publico la API "/recetas" con los datos de la receta
    Then el "id" de la receta es "1"
    And el "paciente_id" de la receta es "1"
    And el "profesional_id" de la receta es "1"
    And el "estado" de la receta es "activo"
    And el "peso" de la receta es "40.4"
    And el "talla" de la receta es "140.7"
    And el "superficie_corporal" de la receta es "1.2"
    And se crea correctamente la receta

  Scenario: US-11.2 Obtener una receta por su id
    Given existe en la base de datos una receta con id "1" y con los datos:
      | protocolo_id        | 1       |
      | ciclo_id            | 1       |
      | regimen             | 1       |
      | paciente_id         | 1       |
      | profesional_id      | 1       |
      | estado              | activo  |
      | peso                | 40.4    |
      | talla               | 140.7   |
      | superficie_corporal | 1.2     |
    When consulto en la API "/recetas/1" por su id de receta
    Then el sistema me devuelve la receta con id "1"
    And responde correctamente la receta

  @wip
  Scenario: US-11.3 Listar recetas de un paciente
    Given existen en la base de datos las siguientes recetas:
      | receta_id | paciente_id | protocolo_id | ciclo_id | regimen | fecha_receta |
      | 6001      | 2001        | 10           | 1        | 1       | 2025-10-22   |
      | 6002      | 2001        | 10           | 1        | 1       | 2025-10-23   |
      | 7001      | 2002        | 10           | 1        | 1       | 2025-10-22   |
    When consulto en la API "/recetas?paciente_id=2001"
    Then el sistema me devuelve una lista con 2 recetas
    And el primer registro tiene "receta_id" = "6001"
    And el segundo registro tiene "receta_id" = "6002"
    And responde correctamente la receta

  @wip
  Scenario: US-11.4 Listar recetas por contexto (protocolo/ciclo/régimen)
    Given existen en la base de datos las siguientes recetas:
      | receta_id | paciente_id | protocolo_id | ciclo_id | regimen | fecha_receta |
      | 8001      | 2001        | 10           | 1        | 1       | 2025-10-22   |
      | 8002      | 2001        | 10           | 1        | 1       | 2025-10-23   |
      | 8003      | 2001        | 10           | 2        | 1       | 2025-10-22   |
    When consulto en la API "/recetas?protocolo_id=10&ciclo_id=1&regimen=1"
    Then el sistema me devuelve una lista con 2 recetas
    And responde correctamente la receta

  Scenario: US-11.5 Rechazar creación por FK compuesta de ciclo inválida
    Given que tengo los siguientes datos de la receta:
      | protocolo_id        | 1       |
      | ciclo_id            | 1       |
      | regimen             | 0       |
      | paciente_id         | 1       |
      | profesional_id      | 1       |
      | estado              | activo  |
      | peso                | 40.4    |
      | talla               | 140.7   |
      | superficie_corporal | 1.2     |
    When publico la API "/recetas" con los datos de la receta
    Then el sistema rechaza la creación por clave foránea inválida "FK_CICLO"
    And no se crea la receta

  Scenario: US-11.6 Rechazar creación por paciente inexistente
     Given que tengo los siguientes datos de la receta:
      | protocolo_id        | 1       |
      | ciclo_id            | 1       |
      | regimen             | 1       |
      | paciente_id         | 3       |
      | profesional_id      | 1       |
      | estado              | activo  |
      | peso                | 40.4    |
      | talla               | 140.7   |
      | superficie_corporal | 1.2     |
    When publico la API "/recetas" con los datos de la receta
    Then el sistema rechaza la creación por clave foránea inválida "FK_PACIENTE"
    And no se crea la receta

  Scenario: US-11.7 Rechazar creación por profesional inexistente
    Given que tengo los siguientes datos de la receta:
      | protocolo_id        | 1       |
      | ciclo_id            | 1       |
      | regimen             | 1       |
      | paciente_id         | 1       |
      | profesional_id      | 5       |
      | estado              | activo  |
      | peso                | 40.4    |
      | talla               | 140.7   |
      | superficie_corporal | 1.2     |
    When publico la API "/recetas" con los datos de la receta
    Then el sistema rechaza la creación por clave foránea inválida "FK_PROFESIONAL"
    And no se crea la receta

  Scenario: US-11.8 Rechazar nulos en campos obligatorios
     Given que tengo los siguientes datos de la receta:
      | protocolo_id        | 1       |
      | ciclo_id            |         |
      | regimen             |         |
      | paciente_id         | 1       |
      | profesional_id      | 1       |
      | estado              |         |
      | peso                | 40.4    |
      | talla               | 140.7   |
      | superficie_corporal |         |
    When publico la API "/recetas" con los datos de la receta
    Then el sistema rechaza la creación por campos obligatorios faltantes
    And no se crea la receta

