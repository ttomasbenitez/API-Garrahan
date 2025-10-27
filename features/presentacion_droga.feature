Feature: Gestión de Presentaciones de Droga
  Como sistema de prescripción
  Quiero mantener un catálogo de presentaciones de droga
  Para poder asociar formas y dosis a cada droga

  Scenario: US-08.1 Crear una nueva presentación de droga
    Given que existen las siguientes drogas:
      | nombre      | estado | codigo_atc |
      | Paracetamol | Activo | N02BE01    |
    And que existen las siguientes formas farmaceuticas:
      | nombre   | codigo | estado |
      | Tableta  | TAB    | Activo |
      | Jarabe   | JAR    | Activo |
    And que tengo los siguientes datos de la presentacion de droga:
      | droga_id              | 1         |
      | forma_farmaceutica_id | 2         |
      | codigo_farmacia       | PAR001    |
      | estado                | Activo    |
      | fuerza_valor          | 500       |
      | fuerza_unidad         | mg        |
    When publico en la API de presentacion droga "/drogas/1/presentaciones" con los datos de la presentacion
    Then el campo "droga_id" de la presentacion es "1"
    And el campo "forma_farmaceutica_id" de la presentacion es "2"
    And se crea correctamente la presentacion

  Scenario: US-08.2 Obtener una presentacion de droga por su id
    Given que existen las siguientes drogas:
      | nombre      | estado | codigo_atc |
      | Paracetamol | Activo | N02BE01    |
    And que existen las siguientes formas farmaceuticas:
      | nombre   | codigo | estado |
      | Tableta  | TAB    | Activo |
      | Jarabe   | JAR    | Activo |
    And existe en la base de datos una presentacion de droga con id "1" y con los datos:
      | droga_id              | 1         |
      | forma_farmaceutica_id | 2         |
      | codigo_farmacia       | PAR001    |
      | estado                | Activo    |
      | fuerza_valor          | 500       |
      | fuerza_unidad         | mg        |
    When consulto en la API de presentacion droga "/drogas/1/presentaciones/1" por su id
    Then el sistema me devuelve la presentacion de droga con id "1"
    And el campo "droga_id" es "1" en la presentacion
    And el campo "forma_farmaceutica_id" es "2" en la presentacion
    And se obtiene correctamente la presentacion

  Scenario: US-08.3 Listar todas las presentaciones de droga
    Given que existen las siguientes drogas:
      | nombre      | estado | codigo_atc |
      | Paracetamol | Activo | N02BE01    |
    And que existen las siguientes formas farmaceuticas:
      | nombre    | codigo | estado |
      | Tableta   | TAB    | Activo |
      | Jarabe    | JAR    | Activo |
      | Capsula   | CAP    | Activo |
    And existe en la base de datos una presentacion de droga con id "1" y con los datos:
      | droga_id              | 1         |
      | forma_farmaceutica_id | 2         |
      | codigo_farmacia       | PAR001    |
      | estado                | Activo    |
      | fuerza_valor          | 500       |
      | fuerza_unidad         | mg        |
    And existe en la base de datos una presentacion de droga con id "2" y con los datos:
      | droga_id              | 1         |
      | forma_farmaceutica_id | 3         |
      | codigo_farmacia       | PAR002    |
      | estado                | Activo    |
      | fuerza_valor          | 200       |
      | fuerza_unidad         | mg        |
    When consulto en la API de presentacion droga "/drogas/1/presentaciones"
    Then el sistema me devuelve una lista con 2 presentaciones de droga en la consulta
    And el primer registro de presentacion tiene "droga_id" = "1" y "forma_farmaceutica_id" = "2"
    And el segundo registro de presentacion tiene "droga_id" = "1" y "forma_farmaceutica_id" = "3"
    And se obtiene correctamente la presentacion

  Scenario: US-08.4 Eliminar una presentacion de droga
    Given que existen las siguientes drogas:
      | nombre      | estado | codigo_atc |
      | Paracetamol | Activo | N02BE01    |
      | Ibuprofeno  | Activo | M01AE01    |
    And que existen las siguientes formas farmaceuticas:
      | nombre    | codigo | estado |
      | Tableta   | TAB    | Activo |
      | Jarabe    | JAR    | Activo |
      | Capsula   | CAP    | Activo |
      | Ampolla   | AMP    | Activo |
    And existe en la base de datos una presentacion de droga con id "3" y con los datos:
      | droga_id              | 2         |
      | forma_farmaceutica_id | 4         |
      | codigo_farmacia       | IBU001    |
      | estado                | Inactivo  |
      | fuerza_valor          | 100       |
      | fuerza_unidad         | mg        |
    When elimino la presentacion en la API "/drogas/2/presentaciones/3"
    Then el sistema elimina la presentacion de droga con id "3"
    And se elimina correctamente la presentacion
