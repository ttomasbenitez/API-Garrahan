Feature: Generacion recetas
  Como sistema de prescripción
  Quiero generar una recerta médica para un paciente
  Para poder administrar los medicamentos indicados

  Background:
    Given existe en la base de datos el paciente con id "1" y con los datos:
      | nombre            | Juan        |
      | apellido          | Pérez       |
      | id_hospitalario   | P12345      |
      | fecha_nacimiento  | 2020-05-21  |
      | peso              | 40          |
      | sexo              | M           |
      | obra_social       | OSDE        |
      | dni               | 40123456    |
    And existe en la base de datos el protocolo con id "1" y con los datos:
      | nombre             | LLA Pediátrica |
      | enfermedad         | LLA            |
      | linea              | 1              |
      | cantidad_regimenes | 2              |
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
    And existe la vía de administración con id "2" y con los datos:
      | nombre | ORAL        |
      | codigo | OR         |
    And existen en la base de datos las siguientes administraciones de medicación:
      | id | protocolo_id | ciclo_id | regimen | droga_id | via_id | fuerza_valor | fuerza_unidad | cantidad_dias | administracion_diaria | frecuencia_diaria |
      | 1  | 1            | 1        | 1       | 1        | 1      | 50           | mg            | 5             | 1                     | 3                 |
      | 2  | 1            | 1        | 1       | 1        | 2      | 10           | mg            | 6             | 1                     | 4                 |
    And estoy logueado como médico con id "1"
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
      | tipo_receta         | hospitalaria             |
    And la receta con id "1" tiene los detalles:
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
    And la receta con id "1" tiene los detalles:
      | receta_id          | 1               |
      | admin_id           | 2               |
      | nombre_generico    | CISPLATINO      |
      | presentacion       | Ampolla         |
      | concentracion      | 1 mg/ml         |
      | via_administracion | ORAL            |
      | cantidad           | 4               |
      | dosis_diaria       | 10              |
      | numero_dias        | 5               |
      | dosis_total        | 1               |
    And la receta con id "1" está guardada en el sistema

  Scenario: US-13.1 Generar receta médica en Excel exitosamente
    When consulto la API "/recetas/1/exportar?tipo=hospitalaria" para generar la receta médica
    Then la respuesta tiene código de estado "200"
    And el cuerpo de la respuesta contiene un archivo Excel
    And el archivo contiene "Juan Pérez"
    And el archivo contiene "CISPLATINO"
    And el archivo contiene "Ampolla"
    And el archivo contiene "10"
