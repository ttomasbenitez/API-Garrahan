Feature: Creación de Drogas
    Como sistema de prescripción
    Quiero mantener un catálogo de drogas
    Para poder asignarlas a protocolos y consultarlas por nombre y presentación

  Scenario: US-04.1 Crear una nueva droga
    Given que tengo los siguientes datos de la droga:
      | nombre_generico     | CISPLATINO      |
    When publico en la API "/drogas" con los datos de la droga
    Then el "nombre_generico" es "CISPLATINO"
    And se crea correctamente

  Scenario: US-04.2 Crear varias drogas
    Given que tengo los siguientes datos de la droga:
      | nombre_generico     | CISPLATINO      |
    And que tengo los siguientes datos de la droga:
      | nombre_generico     | PANITUMUMAB      |
    When publico en la API "/drogas" con los datos de la droga
    Then obtengo los datos de las Drogas con el id "1" y "2"
    And se crea correctamente

  Scenario: US-04.3 Obtener una droga creada por su id
    Given que tengo los siguientes datos de la droga con id "1":
      | nombre_generico     | CISPLATINO      |
    When consulto en la API "/drogas/1" por su id
    Then el sistema me devuelve la droga con id "1"
    And el "nombre_generico" es "CISPLATINO"
    And responde correctamente