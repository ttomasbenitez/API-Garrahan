Feature: Administrar medicación en un ciclo de tratamiento
  Como sistema de prescripción
  Quiero registrar la administración de medicación por ciclo y régimen
  Para poder prescribir dosis y frecuencias en cada protocolo

  Background:
    Given existe en la base de datos un protocolo con el nombre de "Osteosarcoma GBTO 2006 - No metastásico" con id "1"
    And existe en la base de datos un ciclo para el protocolo "1" con ciclo_id "1" y regimen "0"
    And existe en la base de datos un ciclo para el protocolo "1" con ciclo_id "1" y regimen "1"
    And existe en la base de datos una droga con id "1" y con los datos:
      | medicamento         | CISPLATINO      |
      | presentacion        | CAPSULA         |
      | dosis               | 10              |
      | dosis_unidad        | mg              |
      | dosis_maxima        | 10              | 
      | dosis_maxima_unidad | mg              |
    And existe en la base de datos una droga con id "2" y con los datos:
      | medicamento          | PANITUMUMAB     |
      | presentacion         | FRASCO AMPOLLA  |
      | dosis                | 20              |
      | dosis_unidad         | mg/ml           |
      | dosis_maxima         | 2               | 
      | dosis_maxima_unidad  | mg              |

  Scenario: US-05.1 Agregar una administración (una sola droga) a un ciclo
    Given quiero agregar administración de medicación con los siguientes datos
      | id_droga              | 2      |
      | dosis                 | 50     |
      | dosis_unidad          | mg     |
      | frecuencia            | 1,2    |
      | administracion_diaria | 0      |
      | frecuencia_diaria     | 2      |
    When publico en la API "/protocolo/1/ciclo/1/regimen/0/administracion" con los datos de la administración
    Then la administración se crea correctamente

  Scenario: US-05.2 Agregar varias administraciones en una sola llamada (array)
    Given quiero agregar múltiples administraciones con los siguientes items
      | id_droga | dosis | dosis_unidad | frecuencia | administracion_diaria | frecuencia_diaria |
      | 2        | 50    | mg           | 1,2        | 2                     | 1                 |
      | 1        | 1.2   | mg/kg        | 1,5        | 1                     | 7                 |
    When publico en la API "/protocolo/1/ciclo/1/regimen/1/administracion" con los datos de la administración
    Then se crean "2" administraciones para el protocolo "1" ciclo "1" régimen "1"

  Scenario: US-05.3 Validación: campos requeridos
    Given quiero agregar administración de medicación con los siguientes datos
      | dosis        | 50 |
      | dosis_unidad | mg |
      | frecuencia   | D1 |
    When publico en la API "/protocolo/1/ciclo/1/regimen/0/administracion" con los datos de la administración
    Then el sistema responde "400"
    And el error contiene "id_droga es requerido"

  Scenario: US-05.4 Validación: dosis debe ser positiva cuando se informa
    Given quiero agregar administración de medicación con los siguientes datos
      | id_droga     | 10  |
      | dosis        | -10 |
      | dosis_unidad | mg  |
    When publico en la API "/protocolo/1/ciclo/1/regimen/0/administracion" con los datos de la administración
    Then el sistema responde "400"
    And el error contiene "dosis debe ser > 0"
  
  @wip
  Scenario: US-05.5 Conflicto por duplicado (misma droga ya cargada en ese ciclo/régimen)
    Given quiero agregar administración de medicación con los siguientes datos
      | id_droga     | 10 |
      | dosis        | 50 |
      | dosis_unidad | mg |
    When publico en la API "/protocolo/1/ciclo/1/regimen/0/administracion" con los datos de la administración
    Then el sistema responde "409"
    And el error contiene "administración ya existente"

  Scenario: US-05.6 Error por FK: droga inexistente
    Given quiero agregar administración de medicación con los siguientes datos
      | id_droga              | 2232   |
      | dosis                 | 50     |
      | dosis_unidad          | mg     |
      | frecuencia            | 1,2    |
      | administracion_diaria | 0      |
      | frecuencia_diaria     | 2      |
    When publico en la API "/protocolo/1/ciclo/1/regimen/0/administracion" con los datos de la administración
    Then el sistema responde "404"
    And el error contiene "droga no encontrada"
  @wip
  Scenario: US-05.7 Error por FK: ciclo/régimen inexistente
    Given quiero agregar administración de medicación con los siguientes datos
      | id_droga     | 10 |
      | dosis        | 50 |
      | dosis_unidad | mg |
    When publico en la API "/protocolo/1/ciclo/99/regimen/7/administracion" con los datos de la administración
    Then el sistema responde "404"
    And el error contiene "ciclo/régimen no encontrado"
