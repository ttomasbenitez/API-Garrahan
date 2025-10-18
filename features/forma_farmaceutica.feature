Feature: Gestión de Formas Farmacéuticas
  Como sistema de prescripción
  Quiero mantener un catálogo de formas farmacéuticas
  Para poder asociarlas a las presentaciones de drogas y consultarlas por nombre y código

  Scenario: US-07.1 Crear una nueva forma farmacéutica
    Given que tengo los siguientes datos de la forma farmacéutica:
      | nombre | Comprimido |
      | codigo | TAB        |
    When publico en la API de forma farmaceutica "/forma-farmaceutica" con los datos de la forma
    Then el campo "nombre" de la forma farmaceutica es "Comprimido"
    And el campo "codigo" de la forma farmaceutica es "TAB"
    And se crea correctamente la forma farmaceutica

  Scenario: US-07.2 Crear varias formas farmacéuticas
    Given que tengo los siguientes datos de la forma farmacéutica:
      | nombre | Cápsula dura |
      | codigo | CAPD         |
    And que tengo los siguientes datos de la forma farmacéutica:
      | nombre | Solución inyectable |
      | codigo | SOL-INY             |
    When publico en la API de forma farmaceutica "/forma-farmaceutica" con los datos de las formas
    Then obtengo los datos de las formas con el id "1" y "2"
    And se crea correctamente la forma farmaceutica

  Scenario: US-07.3 Obtener una forma farmacéutica creada por su id
    Given existe en la base de datos una forma farmacéutica con id "1" y con los datos:
      | nombre | Comprimido |
      | codigo | TAB        |
    When consulto en la API de forma farmaceutica "/forma-farmaceutica/1" por su id
    Then el sistema me devuelve la forma farmacéutica con id "1"
    And el campo "nombre" es "Comprimido" en la forma farmaceutica
    And el campo "codigo" es "TAB" en la forma farmaceutica
    And se obtiene correctamente la forma farmaceutica

  Scenario: US-07.4 Listar todas las formas farmacéuticas
    Given existe en la base de datos una forma farmacéutica con id "1" y con los datos:
      | nombre | Comprimido |
      | codigo | TAB        |
    And existe en la base de datos una forma farmacéutica con id "2" y con los datos:
      | nombre | Solución inyectable |
      | codigo | SOL-INY             |
    When consulto en la API de forma farmaceutica "/forma-farmaceutica"
    Then el sistema me devuelve una lista con 2 formas farmacéuticas en la consulta
    And el primer registro de forma farmaceutica tiene "nombre" = "Comprimido" y "codigo" = "TAB"
    And el segundo registro de forma farmaceutica tiene "nombre" = "Solución inyectable" y "codigo" = "SOL-INY"
    And se obtiene correctamente la forma farmaceutica
  @wip
  Scenario: US-07.5 Actualizar una forma farmacéutica existente
    Given existe en la base de datos una forma farmacéutica con id "1" y con los datos:
      | nombre | Solución inyectable |
      | codigo | SOL-INY             |
    When publico en la API de forma farmaceutica "/forma-farmaceutica/1" con los siguientes datos:
      | nombre | Solución inyectable estéril |
      | codigo | SOL-INY-EST                 |
    Then el campo "nombre" es "Solución inyectable estéril" en la respuesta de forma farmaceutica
    And el campo "codigo" es "SOL-INY-EST" en la respuesta de forma farmaceutica
    And se actualiza correctamente la forma farmaceutica
  @wip
  Scenario: US-07.6 Eliminar una forma farmacéutica sin uso
    Given existe en la base de datos una forma farmacéutica con id "3" y con los datos:
      | nombre | Jarabe |
      | codigo | JAR    |
    And la forma farmacéutica no está asociada a ninguna presentación de droga
    When elimino la forma en la API "/forma-farmaceutica/3"
    Then el sistema elimina la forma farmacéutica con id "3"
    And se obtiene correctamente la forma farmaceutica
