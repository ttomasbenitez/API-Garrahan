Feature: Creación de Drogas
    Como sistema de prescripción
    Quiero mantener un catálogo de drogas
    Para poder asignarlas a protocolos y consultarlas por nombre y presentación

  Scenario: US-04.1 Crear una nueva droga
    Given que tengo los siguientes datos de la droga:
      | nombre_generico     | CISPLATINO      |
      | codigo_farmacia     | AAA1            |
    When publico en la API "/droga" con los datos de la droga
    Then el "nombre_generico" es "CISPLATINO"
    And el "codigo_farmacia" es "AAA1"
    And se crea correctamente

  Scenario: US-04.2 Crear varias drogas
    Given que tengo los siguientes datos de la droga:
      | nombre_generico     | CISPLATINO      |
      | codigo_farmacia     | AAA1            |
    And que tengo los siguientes datos de la droga:
      | nombre_generico     | PANITUMUMAB      |
      | codigo_farmacia     | AAA2             |
    When publico en la API "/droga" con los datos de la droga
    Then obtengo los datos de las Drogas con el id "1" y "2"
    And se crea correctamente

  Scenario: US-04.3 Obtener una droga creada por su id
    Given existe en la base de datos una droga con id "1" y con los datos:
      | nombre_generico     | CISPLATINO      |
      | codigo_farmacia     | AAA1            |
    When consulto en la API "/droga/1" por su id
    Then el sistema me devuelve la droga con id "1"
    And el "nombre_generico" es "CISPLATINO"
    And el "codigo_farmacia" es "AAA1"
    And responde correctamente