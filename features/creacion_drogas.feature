Feature: Creación de Drogas
    Como sistema de prescripción
    Quiero mantener un catálogo de drogas
    Para poder asignarlas a protocolos y consultarlas por nombre y presentación

  Scenario: US-03.1 Crear una nueva droga
    Given que tengo los siguientes datos de la droga:
      | medicamento         | CISPLATINO      |
      | presentacion        | FRASCO AMPOLLA  |
      | dosis               | 10              |
      | dosis_unidad        | mg              |
      | dosis_maxima        | 10              |
      | dosis_maxima_unidad | mg              |
    When publico en la API "/droga" con los datos de la droga
    Then obtengo los datos de la droga con el id "1"
    And el medicamento es "CISPLATINO"
    And la "presentacion" es "FRASCO AMPOLLA"
    And la "dosis" es "10"
    And la "dosis_unidad" es "mg"
    And la "dosis_maxima" es "10"
    And la "dosis_maxima_unidad" es "mg"
    And responde correctamente

  Scenario: US-03.2 Crear varias drogas
    Given que tengo los siguientes datos de la droga:
      | medicamento         | CISPLATINO      |
      | presentacion        | CAPSULA         |
      | dosis               | 10              |
      | dosis_unidad        | mg              |
      | dosis_maxima        | 10              | 
      | dosis_maxima_unidad | mg              |
    And que tengo los siguientes datos de la droga:
      | medicamento         | DOXORRUBICINA   |
      | presentacion        | FRASCO AMPOLLA  |
      | dosis               | 20              |
      | dosis_unidad        | mg              |
      | dosis_maxima        | 2               | 
      | dosis_maxima_unidad | mg              |
    When publico en la API "/droga" con los datos de la droga
    Then obtengo los datos de las Drogas con el id "2" y "3"
    And responde correctamente

  @wip
  Scenario: US-03.3 Obtener una droga creada por su id
    Given existe en la base de datos una droga con id "1" con los siguientes datos:
      | medicamento        | CISPLATINO         |
      | presentacion       | FRASCO AMPOLLA     |
      | dosis              | 10                 |
      | dosis_unidad       | "mg"               |
      | dosis_maxima       | 10                 | 
      | dosis_maxima_unidad| "mg"               |
    When consulto en la API "/droga/1"
    Then el sistema me devuelve la droga con id "1"
    And el medicamento es "CISPLATINO"
    And la presentacion es "FRASCO AMPOLLA"
    And la dosis es "10"
    And la dosis_unidad es "mg"
    And la dosis_maxima es "10"
    And la dosis_maxima_unidad es "mg"