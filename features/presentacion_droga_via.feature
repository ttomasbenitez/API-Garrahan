Feature: Gestión de Presentación Droga Vía
  Como sistema de prescripción
  Quiero gestionar las vías de administración asociadas a presentaciones de drogas
  Para definir cómo se puede suministrar cada presentación específica de una droga

  Scenario: US-09.1 Crear una nueva presentación droga vía
    Given que existe una droga con los siguientes datos:
      | nombre_generico | Ibuprofeno |
      | estado          | Activo     |
      | codigo_atc      | M01AE01    |
    And que existe una forma farmaceutica con los siguientes datos:
      | nombre | Ampolla |
      | codigo | AMP     |
      | estado | Activo  |
    And que existe una presentacion de droga con los siguientes datos:
      | codigo_farmacia | IBU001 |
      | estado          | Activo |
      | fuerza_valor    | 100    |
      | fuerza_unidad   | mg     |
    And que existe una via de administracion con los siguientes datos:
      | nombre | Intravenosa |
      | codigo | IV          |
    When publico en la API "/presentaciones-droga-via" los datos de la presentacion droga via con es_default "1"
    Then se crea correctamente la presentacion droga via

  Scenario: US-09.2 Obtener una presentación droga vía por sus IDs
    Given que existe una droga con los siguientes datos:
      | nombre_generico | Paracetamol |
      | estado          | Activo      |
      | codigo_atc      | N02BE01     |
    And que existe una forma farmaceutica con los siguientes datos:
      | nombre | Tableta |
      | codigo | TAB     |
      | estado | Activo  |
    And que existe una presentacion de droga con los siguientes datos:
      | codigo_farmacia | PAR001 | 
      | estado          | Activo |
      | fuerza_valor    | 500    |
      | fuerza_unidad   | mg     |
    And que existe una via de administracion con los siguientes datos:
      | nombre | Oral |
      | codigo | PO   |
    And que existe una presentacion droga via asociada
    When consulto en la API de presentacion droga via por sus IDs
    Then el sistema me devuelve la presentacion droga via correctamente
    And el campo "es_default" es "0" en la presentacion droga via

  Scenario: US-09.3 Listar todas las vías de una presentación de droga
    Given que existe una droga con los siguientes datos:
      | nombre_generico | Morfina |
      | estado          | Activo  |
      | codigo_atc      | N02AA01 |
    And que existe una forma farmaceutica con los siguientes datos:
      | nombre | Ampolla |
      | codigo | AMP     |
      | estado | Activo  |
    And que existe una presentacion de droga con los siguientes datos:
      | codigo_farmacia | MOR001 |
      | estado          | Activo |
      | fuerza_valor    | 10     |
      | fuerza_unidad   | mg     |
    And que existen las siguientes vias de administracion:
      | nombre       | codigo |
      | Intravenosa  | IV     |
      | Intramuscular| IM     |
      | Subcutánea   | SC     |
    And que existen las siguientes presentaciones droga via asociadas
    When consulto en la API "/presentaciones-droga-via/presentacion/:presentacion_id" las vias de la presentacion
    Then el sistema me devuelve una lista con 3 vias
    And se obtiene correctamente las presentaciones droga via

  Scenario: US-09.4 Eliminar una presentación droga vía
    Given que existe una droga con los siguientes datos:
      | nombre_generico | Amoxicilina |
      | estado          | Activo      |
      | codigo_atc      | J01CA04     |
    And que existe una forma farmaceutica con los siguientes datos:
      | nombre | Capsula |
      | codigo | CAP     |
      | estado | Activo  |
    And que existe una presentacion de droga con los siguientes datos:
      | codigo_farmacia | AMO001 |
      | estado          | Activo |
      | fuerza_valor    | 500    |
      | fuerza_unidad   | mg     |
    And que existe una via de administracion con los siguientes datos:
      | nombre | Oral |
      | codigo | PO   |
    And que existe una presentacion droga via asociada
    When elimino la presentacion droga via en la API
    Then el sistema elimina la presentacion droga via correctamente
