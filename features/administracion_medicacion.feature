Feature: Gestión de Administración de Medicación
  Como sistema de prescripción
  Quiero mantener registros de administración de medicación por protocolo/ciclo/régimen
  Para poder asignar droga y vía con su esquema de dosificación

  Background:
    Given existe en la base de datos el protocolo con id "1" y con los datos:
      | nombre     | LLA Pediátrica |
      | enfermedad | LLA            |
      | linea      | 1              |
    And existe el ciclo del protocolo "1" con:
      | ciclo_id         | 1 |
      | regimen          | 1 |
      | duracion_semanas | 4 |
      | ciclo_final      | 0 |
      | repeticiones     | 1 |
    And existe el ciclo del protocolo "1" con:
      | ciclo_id         | 1 |
      | regimen          | 2 |
      | duracion_semanas | 4 |
      | ciclo_final      | 0 |
      | repeticiones     | 1 |
    And existe el ciclo del protocolo "1" con:
      | ciclo_id         | 2 |
      | regimen          | 1 |
      | duracion_semanas | 4 |
      | ciclo_final      | 0 |
      | repeticiones     | 1 |
    And existe la droga con id "1" y con los datos:
      | nombre_generico | CISPLATINO |
      | codigo_farmacia | AAA1       |
    And existe la droga con id "2" y con los datos:
      | nombre_generico | VINCRISTINA |
      | codigo_farmacia | BBB2        |
    And existe la vía de administración con id "1" y con los datos:
      | nombre | Intravenosa |
      | codigo | IV          |
    And existe la vía de administración con id "2" y con los datos:
      | nombre | Oral |
      | codigo | PO   |


  Scenario: US-10.1 Crear una nueva administración de medicación
    Given que tengo los siguientes datos de la administración de medicación:
      | droga_id              | 1    |
      | via_id                | 2    |
      | fuerza_valor          | 10   |
      | fuerza_unidad         | mg   |
      | cantidad_dias         |  3   |
      | administracion_diaria |  1   |
      | frecuencia_diaria     |  5   |
    When publico la API "/protocolo/1/ciclo/1/regimen/1/administracion" con los datos de la administración
    Then el "protocolo_id" de la admin es "1"
    And el "ciclo_id" de la admin es "1"
    And el "regimen" de la admin es "1"
    And el "droga_id" de la admin es "1"
    And el "via_id" de la admin es "2"
    And el "fuerza_valor" de la admin es "10"
    And el "fuerza_unidad" de la admin es "mg"
    And el "cantidad_dias" de la admin es "3"
    And el "administracion_diaria" de la admin es "1"
    And el "frecuencia_diaria" de la admin es "5"
    And se crea correctamente la administración de medicación

  Scenario: US-10.2 Crear varias administraciones de medicación
    Given que tengo los siguientes datos de la administración de medicación:
      | droga_id              | 1    |
      | via_id                |  2   |
      | fuerza_valor          | 100  |
      | fuerza_unidad         | mg   |
      | cantidad_dias         |  3   |
      | administracion_diaria |  1   |
      | frecuencia_diaria     |  5   |
    And que tengo los siguientes datos de la administración de medicación:
      | droga_id              | 2    |
      | via_id                | 1    |
      | fuerza_valor          | 10   |
      | fuerza_unidad         | mg   |
      | cantidad_dias         | 10   |
      | administracion_diaria | 1    |
      | frecuencia_diaria     | 2    |
    When publico la API "/protocolo/1/ciclo/1/regimen/1/administracion" con los datos de la administración
    Then obtengo los datos de las administraciones con el id "1" y "2"
    And se crea correctamente la administración de medicación

  @wip
  Scenario: US-10.3 Listar administraciones por contexto (protocolo/ciclo/régimen)
    Given existen en la base de datos las siguientes administraciones de medicación:
      | id | protocolo_id | ciclo_id | regimen | droga_id | via_id | fuerza_valor | fuerza_unidad | cantidad_dias | administracion_diaria | frecuencia_diaria |
      | 1  | 1            | 1        | 1       | 1        | 1      | 50           | mg            | 5             | 1                     | 3                 |
      | 2  | 1            | 1        | 1       | 2        | 1      | 100          | mg            | 3             | 1                     | 2                 |
      | 3  | 1            | 2        | 1       | 2        | 2      | 80           | mg            | 4             | 1                     | 4                 |
    When consulto en la API "/protocolos/1/ciclo/1/regimen/1/administracion"
    Then el sistema me devuelve una lista con "2" administración de medicación
    And el "1" registro tiene "droga_id" = "1" y "via_id" = "1"
    And el "2" registro tiene "droga_id" = "2" y "via_id" = "1"
    And responde correctamente la administración de medicación

  @wip
  Scenario: US-10.4 Rechazar duplicado por combinación única (protocolo, ciclo, régimen, droga, vía)
    Given existe en la base de datos una administración de medicación con los datos:
      | protocolo_id | 10   |
      | ciclo_id     | 1    |
      | regimen      | 2    |
      | droga_id     | 1002 |
      | via_id       | 7    |
    When publico la API "/protocolos/10/ciclo/1/regimen/2/administracion" con los siguientes datos:
      | droga_id | 1002 |
      | via_id   | 7    |
    Then el sistema rechaza la creación por combinación única duplicada
    And no se crea la administración de medicación

  @wip
  Scenario: US-10.5 Aceptar mismo contexto con distinta vía
    Given existe en la base de datos una administración de medicación con los datos:
      | protocolo_id | 10   |
      | ciclo_id     | 1    |
      | regimen      | 1    |
      | droga_id     | 1001 |
      | via_id       | 7    |
    When publico la API "/protocolos/10/ciclo/1/regimen/1/administracion" con los siguientes datos:
      | droga_id | 1001 |
      | via_id   | 5    |
    Then se crea correctamente la administración de medicación

  @wip
  Scenario: US-10.6 Rechazar foreign key inválida hacia CICLO (compuesta)
    When publico la API "/protocolos/99/ciclo/1/regimen/1/administracion" con los siguientes datos:
      | droga_id | 1001 |
      | via_id   | 7    |
    Then el sistema rechaza la creación por clave foránea inválida a "ciclo"
    And no se crea la administración de medicación

  @wip
  Scenario: US-10.7 Rechazar foreign key inválida a DROGA
    When publico la API "/protocolos/10/ciclo/1/regimen/1/administracion" con los siguientes datos:
      | droga_id | 9999 |
      | via_id   | 7    |
    Then el sistema rechaza la creación por clave foránea inválida a "droga"
    And no se crea la administración de medicación

  @wip
  Scenario: US-10.8 Rechazar foreign key inválida a VÍA
    When publico la API "/protocolos/10/ciclo/1/regimen/1/administracion" con los siguientes datos:
      | droga_id | 1001 |
      | via_id   | 999  |
    Then el sistema rechaza la creación por clave foránea inválida a "via_administracion"
    And no se crea la administración de medicación

  @wip
  Scenario: US-10.9 Rechazar nulos en campos obligatorios
    When publico la API "/protocolos/10/ciclo/1/regimen/1/administracion" con los siguientes datos:
      | droga_id |      |
      | via_id   | 7    |
    Then el sistema rechaza la creación por campos obligatorios faltantes
    And no se crea la administración de medicación

  @wip
  Scenario: US-10.10 Actualizar una administración de medicación existente (campos opcionales)
    Given existe en la base de datos una administración de medicación con id "2" y con los datos:
      | protocolo_id         | 10  |
      | ciclo_id             | 1   |
      | regimen              | 2   |
      | droga_id             | 1002|
      | via_id               | 7   |
      | fuerza_valor         | 100 |
      | fuerza_unidad        | mg  |
      | administracion_diaria| 1   |
      | frecuencia_diaria    | 2   |
    When publico en la API "/administraciones/2" con los siguientes datos:
      | fuerza_valor         | 120 |
      | administracion_diaria| 2   |
    Then el "fuerza_valor" es "120"
    And el "administracion_diaria" es "2"
    And se actualiza correctamente

  @wip
  Scenario: US-10.11 Rechazar actualización que viola la combinación única
    Given existe en la base de datos una administración de medicación con id "3" y con los datos:
      | protocolo_id | 10   |
      | ciclo_id     | 2    |
      | regimen      | 1    |
      | droga_id     | 1001 |
      | via_id       | 5    |
    And existe en la base de datos otra administración de medicación con los datos:
      | protocolo_id | 10   |
      | ciclo_id     | 1    |
      | regimen      | 1    |
      | droga_id     | 1001 |
      | via_id       | 7    |
    When publico en la API "/administraciones/3" con los siguientes datos:
      | ciclo_id | 1 |
      | regimen  | 1 |
      | via_id   | 7 |
    Then el sistema rechaza la actualización por combinación única duplicada
    And no se actualiza la administración de medicación

  @wip
  Scenario: US-10.12 Eliminar una administración de medicación sin uso
    Given existe en la base de datos una administración de medicación con id "4" y con los datos:
      | protocolo_id | 10   |
      | ciclo_id     | 1    |
      | regimen      | 1    |
      | droga_id     | 1001 |
      | via_id       | 7    |
    And la administración no está referenciada por otras entidades
    When elimino la administración en la API "/administraciones/4"
    Then el sistema elimina la administración de medicación con id "4"
    And se elimina correctamente
