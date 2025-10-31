Feature: Gestión del Detalle de Recetas
  Como sistema de prescripción
  Quiero registrar el detalle de medicaciones indicadas en una receta
  Para reflejar fármaco, presentación, concentración, dosis y vía de administración

  Background:
    Given existe en la base de datos el paciente con id "1" y con los datos:
      | nombre            | Juan        |
      | apellido          | Pérez       |
      | id_hospitalario   | P12345      |
      | fecha_nacimiento  | 2020-05-21  |
      | peso              | 40          |
      | sexo              | M           |
      | obra_social       | OSDE        |
    And existe en la base de datos el protocolo con id "1" y con los datos:
      | nombre      | LLA Pediátrica |
      | enfermedad  | LLA            |
      | linea       | 1              |
    And existe el ciclo del protocolo "1" con:
      | ciclo_id         | 1 |
      | regimen          | 1 |
      | duracion_semanas | 4 |
      | ciclo_final      | 0 |
      | repeticiones     | 0 |
    And existe la droga con id "1" y con los datos:
      | nombre_generico | CISPLATINO |
    And existe la vía de administración con id "1" y con los datos:
      | nombre | Intravenosa |
      | codigo | IV          |
    And existen en la base de datos las siguientes administraciones de medicación:
      | id | protocolo_id | ciclo_id | regimen | droga_id | via_id | fuerza_valor | fuerza_unidad | cantidad_dias | administracion_diaria | frecuencia_diaria |
      | 1  | 1            | 1        | 1       | 1        | 1      | 50           | mg            | 5             | 1                     | 3                 |
    And existe una receta del paciente con id "1" y con los datos:
      | nombre              | Juan                     |
      | apellido            | Pérez                    |
      | tipo_documento      | DNI                      |
      | numero_documento    | 40123456                 |
      | fecha_nacimiento    | 2020-05-21               |
      | sexo                | M                        |
      | nacionalidad        | Argentina                |
      | domicilio_calle     | Av. Corrientes           |
      | domicilio_numero    | 1234                     |
      | domicilio_piso      | 5                        |
      | domicilio_depto     | B                        |
      | codigo_postal       | C1043                    |
      | localidad           | CABA                     |
      | partido             | San Nicolás              |
      | telefono            | 1122334455               |
      | email               | juan.perez@example.com   |
      | peso                | 40.4                     |
      | talla               | 140.7                    |
      | superficie_corporal | 1.20                     |
      | diagnostico         | Leucemia Linfoblástica Aguda |
      | numero_ciclo        | 1                        |
      | protocolo_id        | 1                        |
      | ciclo_id            | 1                        |
      | regimen             | 1                        |
      | paciente_id         | 1                        |
      | profesional_id      | 1                        |
      | estado              | Activo                   |
    And estoy logueado como médico con id "1"

  Scenario: US-12.1 Crear un detalle de receta válido
    Given que tengo los siguientes datos del detalle de receta:
      | receta_id          | 1               |
      | admin_id           | 1               |
      | nombre_generico    | CISPLATINO      |
      | presentacion       | Ampolla         |
      | concentracion      | 1 mg/ml         |
      | via_administracion | Intravenosa     |
      | cantidad           | 3               |
      | dosis_diaria       | 50              |
      | numero_dias        | 5               |
      | dosis_total        | 250             |
    When publico en la API "/recetas" con los datos del detalle
    Then el "id" de la receta es "1"
    And se crea correctamente el detalle de receta

  @wip
  Scenario: US-12.2 Rechazar duplicado para la misma receta y administración
    Given ya existe un detalle con receta_id "100" y admin_id "10"
    When publico en la API "/receta-detalle" con los siguientes datos:
      | receta_id          | 100         |
      | admin_id           | 10          |
      | nombre_generico    | VINCRISTINA |
      | presentacion       | Ampolla     |
      | via_administracion | Intravenosa |
      | cantidad           | 2           |
    Then la respuesta tiene código de estado "409"
    And el mensaje de error indica "detalle de receta duplicado para receta_id y admin_id"
    And no se crea el detalle de receta

  @wip
  Scenario: US-12.3 Rechazar creación con receta inexistente
    When publico en la API "/receta-detalle" con los siguientes datos:
      | receta_id          | 999         |
      | admin_id           | 10          |
      | nombre_generico    | VINCRISTINA |
      | presentacion       | Ampolla     |
      | via_administracion | Intravenosa |
      | cantidad           | 2           |
    Then la respuesta tiene código de estado "404"
    And el mensaje de error indica "No existe una receta con el id especificado"
    And no se crea el detalle de receta

  @wip
  Scenario: US-12.4 Rechazar creación con administración inexistente
    When publico en la API "/receta-detalle" con los siguientes datos:
      | receta_id          | 100         |
      | admin_id           | 999         |
      | nombre_generico    | VINCRISTINA |
      | presentacion       | Ampolla     |
      | via_administracion | Intravenosa |
      | cantidad           | 2           |
    Then la respuesta tiene código de estado "404"
    And el mensaje de error indica "No existe una administración de medicación con el id especificado"
    And no se crea el detalle de receta

  @wip
  Scenario: US-12.5 Rechazar creación sin campos obligatorios
    When publico en la API "/receta-detalle" con los siguientes datos:
      | receta_id          | 100 |
      | admin_id           | 10  |
      | cantidad           | 1   |
    Then la respuesta tiene código de estado "400"
    And el mensaje de error indica "nombre_generico, presentacion y via_administracion son obligatorios"

  @wip
  Scenario: US-12.6 Listar detalles de una receta
    Given existen en la base de datos los siguientes detalles para la receta "100":
      | receta_id | admin_id | nombre_generico | presentacion | concentracion | via_administracion | cantidad | dosis_diaria | numero_dias | dosis_total |
      | 100       | 10       | CISPLATINO      | Ampolla      | 1 mg/ml       | Intravenosa        | 3        | 50           | 5           | 250        |
      | 100       | 11       | METOTREXATO     | Tableta      | 2.5 mg        | Oral               | 1        | 2.5          | 7           | 17.5       |
    When consulto en la API "/recetas/100/detalle"
    Then la respuesta tiene código de estado "200"
    And el sistema devuelve una lista con 2 detalles de receta
    And el primer detalle tiene "admin_id" = "10" y "nombre_generico" = "CISPLATINO"
    And el segundo detalle tiene "admin_id" = "11" y "via_administracion" = "Oral"
