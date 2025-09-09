Feature: Administrar medicación en un ciclo de tratamiento
  Como sistema de prescripción
  Quiero registrar la administración de medicación por ciclo y régimen
  Para poder prescribir dosis y frecuencias en cada protocolo

  Background:
    Given existe en la base de datos un protocolo con el nombre de "Osteosarcoma GBTO 2006 - No metastásico" con id "1"
    And existe en la base de datos un ciclo para el protocolo "1" con ciclo_id "1" y regimen "0"
    And existe en la base de datos una droga con id "10" y nombre "Metotrexato 50 mg"
    And existe en la base de datos una droga con id "11" y nombre "Doxorrubicina 10 mg/mL"
  
  @wip
  Scenario: US-05.1 Agregar una administración (una sola droga) a un ciclo
    Given quiero agregar administración de medicación con los siguientes datos
      | id_droga             | 10     |
      | dosis                | 50     |
      | dosis_unidad         | mg     |
      | frecuencia           | D1-D2  |
      | administracion_diaria| 0      |
      | frecuencia_diaria    | 2      |
    When publico en la API "/protocolo/1/ciclo/1/regimen/0/administracion" con los datos
    Then la administración se crea correctamente
    And puedo consultar la administración de "/protocolo/1/ciclo/1/regimen/0/administracion" y veo la droga "10" con dosis "50" "mg" y frecuencia "D1-D2"
  @wip
  Scenario: US-05.2 Agregar varias administraciones en una sola llamada (array)
    Given quiero agregar múltiples administraciones con los siguientes items
      | id_droga | dosis | dosis_unidad | frecuencia | administracion_diaria | frecuencia_diaria |
      | 10       | 50    | mg           | D1-D2      |                       |                   |
      | 11       | 1.2   | mg/kg        | D1         | 1                     | 7                 |
    When publico en la API "/protocolo/1/ciclo/1/regimen/0/administracion" con los datos
    Then se crean 2 administraciones para el protocolo "1" ciclo "1" régimen "0"
    And puedo consultar la administración de "/protocolo/1/ciclo/1/regimen/0/administracion" y veo las drogas "10","11"
  @wip
  Scenario: US-05.3 Validación: campos requeridos
    Given quiero agregar administración de medicación con los siguientes datos
      | dosis        | 50 |
      | dosis_unidad | mg |
      | frecuencia   | D1 |
    When publico en la API "/protocolo/1/ciclo/1/regimen/0/administracion" con los datos
    Then el sistema responde 400
    And el error contiene "id_droga es requerido"
  @wip
  Scenario: US-05.4 Validación: dosis debe ser positiva cuando se informa
    Given quiero agregar administración de medicación con los siguientes datos
      | id_droga     | 10  |
      | dosis        | -10 |
      | dosis_unidad | mg  |
    When publico en la API "/protocolo/1/ciclo/1/regimen/0/administracion" con los datos
    Then el sistema responde 400
    And el error contiene "dosis debe ser > 0"
  @wip
  Scenario: US-05.5 Conflicto por duplicado (misma droga ya cargada en ese ciclo/régimen)
    Given ya existe en la base de datos una administración para el protocolo "1" ciclo "1" régimen "0" con id_droga "10"
    And quiero agregar administración de medicación con los siguientes datos
      | id_droga     | 10 |
      | dosis        | 50 |
      | dosis_unidad | mg |
    When publico en la API "/protocolo/1/ciclo/1/regimen/0/administracion" con los datos
    Then el sistema responde 409
    And el error contiene "administración ya existente"
  @wip
  Scenario: US-05.6 Error por FK: droga inexistente
    Given quiero agregar administración de medicación con los siguientes datos
      | id_droga     | 9999 |
      | dosis        | 50   |
      | dosis_unidad | mg   |
    When publico en la API "/protocolo/1/ciclo/1/regimen/0/administracion" con los datos
    Then el sistema responde 404
    And el error contiene "droga no encontrada"
  @wip
  Scenario: US-05.7 Error por FK: ciclo/régimen inexistente
    Given quiero agregar administración de medicación con los siguientes datos
      | id_droga     | 10 |
      | dosis        | 50 |
      | dosis_unidad | mg |
    When publico en la API "/protocolo/1/ciclo/99/regimen/7/administracion" con los datos
    Then el sistema responde 404
    And el error contiene "ciclo/régimen no encontrado"
