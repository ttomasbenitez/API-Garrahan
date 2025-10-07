Feature: Gestión de Vías de Administración
  Como sistema de prescripción
  Quiero mantener un catálogo de vías de administración
  Para poder asignarlas a la administración de medicación y consultarlas por nombre y código

  Scenario: US-06.1 Crear una nueva vía de administración
    Given que tengo los siguientes datos de la vía de administración:
      | nombre      | Intravenosa |
      | codigo      | IV          |
    When publico la API "/via-administracion" con los datos de la vía
    Then el "nombre" de la via es "Intravenosa"
    And el "codigo" de la via es "IV"
    And se crea correctamente la vía de administración
  @wip
  Scenario: US-06.2 Crear varias vías de administración
    Given que tengo los siguientes datos de la vía de administración:
      | nombre | Intravenosa |
      | codigo | IV          |
    And que tengo los siguientes datos de la vía de administración:
      | nombre | Oral        |
      | codigo | PO          |
    When publico en la API "/via-administracion" con los datos de las vías
    Then obtengo los datos de las vías con el id "1" y "2"
    And se crea correctamente la vía de administración
  @wip
  Scenario: US-06.3 Obtener una vía de administración creada por su id
    Given existe en la base de datos una vía de administración con id "1" y con los datos:
      | nombre | Intravenosa |
      | codigo | IV          |
    When consulto en la API "/via-administracion/1" por su id
    Then el sistema me devuelve la vía de administración con id "1"
    And el "nombre"  de la via es "Intravenosa"
    And el "codigo"  de la via es "IV"
    And responde correctamente la vía de administración
  @wip
  Scenario: US-06.4 Listar todas las vías de administración
    Given existen en la base de datos las siguientes vías de administración:
      | id | nombre       | codigo |
      | 1  | Intravenosa  | IV     |
      | 2  | Oral         | PO     |
    When consulto en la API "/via-administracion"
    Then el sistema me devuelve una lista con 2 vías de administración
    And el primer registro tiene "nombre" = "Intravenosa" y "codigo" = "IV"
    And el segundo registro tiene "nombre" = "Oral" y "codigo" = "PO"
    And responde correctamente la vía de administración
  @wip
  Scenario: US-06.5 Actualizar una vía de administración existente
    Given existe en la base de datos una vía de administración con id "2" y con los datos:
      | nombre | Oral |
      | codigo | PO   |
    When publico en la API "/via-administracion/2" con los siguientes datos:
      | nombre | Oral en cápsulas |
      | codigo | PO-CAPS          |
    Then el "nombre" de la via es "Oral en cápsulas"
    And el "codigo" de la via es "PO-CAPS"
    And se actualiza correctamente
  @wip
  Scenario: US-06.6 Eliminar una vía de administración sin uso
    Given existe en la base de datos una vía de administración con id "3" y con los datos:
      | nombre | Sublingual |
      | codigo | SL         |
    And la vía no está referenciada en ninguna administración de medicación
    When elimino la vía en la API "/via-administracion/3"
    Then el sistema elimina la vía de administración con id "3"
    And se elimina correctamente
 