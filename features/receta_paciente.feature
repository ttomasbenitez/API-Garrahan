Feature: Gestión de Recetas para Pacientes
  Como sistema de prescripción
  Quiero crear y consultar recetas emitidas a pacientes en un contexto de tratamiento
  Para registrar el inicio y parámetros del tratamiento

  Background:
    Given existe en la base de datos el paciente con id "1" y con los datos:
      | nombre            | Juan        |
      | apellido          | Pérez       |
      | id_hospitalario   | P12345      |
      | fecha_nacimiento  | 2020-05-21  |
      | peso              | 40          |
      | sexo              | M           |
      | obra_social       | OSDE        |
    And existe en la base de datos el paciente con id "2" y con los datos:
      | nombre            | Martin      |
      | apellido          | Palermo     |
      | id_hospitalario   | P99999      |
      | fecha_nacimiento  | 2012-12-12  |
      | peso              | 77          |
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
      | repeticiones     | 1 |
    And estoy logueado como médico con id "1"

  Scenario: US-11.1 Crear una nueva receta (campos mínimos)
    Given que tengo los siguientes datos de la receta:
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
    When publico la API "/recetas" con los datos de la receta
    Then el "id" de la receta es "1"
    And se crea correctamente la receta

  Scenario: US-11.2 Obtener una receta por su id
    Given existe en la base de datos una receta con id "1" y con los datos:
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
    When consulto en la API "/recetas/1" por su id de receta
    Then el sistema me devuelve la receta con id "1"
    And responde correctamente la receta

  Scenario: US-11.3 Listar recetas de un paciente
    Given existen en la base de datos las siguientes recetas:
      | receta_id | paciente_id | protocolo_id | ciclo_id | regimen | fecha_receta |
      | 1         | 1           | 1            | 1        | 1       | 2025-10-22   |
      | 2         | 1           | 1            | 1        | 1       | 2025-10-23   |
      | 3         | 2           | 1            | 1        | 1       | 2025-10-22   |
    When consulto la API de "/recetas?paciente_id=1"
    Then el sistema me devuelve una lista con 2 recetas
    And el primer registro tiene receta_id = 1
    And el segundo registro tiene receta_id = 2
    And responde correctamente la receta

  Scenario: US-11.4 Rechazar creación por FK compuesta de ciclo inválida
    Given que tengo los siguientes datos de la receta:
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
      | ciclo_id            | 0                        |
      | regimen             | 0                        |
      | paciente_id         | 1                        |
      | profesional_id      | 1                        |
      | estado              | Activo                   |
    When publico la API "/recetas" con los datos de la receta
    Then el sistema rechaza la creación por clave foránea inválida "FK_CICLO"
    And no se crea la receta

  Scenario: US-11.5 Rechazar creación por paciente inexistente
    Given que tengo los siguientes datos de la receta:
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
      | paciente_id         | 9                        |
      | profesional_id      | 1                        |
      | estado              | Activo                   |
    When publico la API "/recetas" con los datos de la receta
    Then el sistema rechaza la creación por clave foránea inválida "FK_PACIENTE"
    And no se crea la receta

  Scenario: US-11.6 Rechazar creación por profesional inexistente
    Given que tengo los siguientes datos de la receta:
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
      | profesional_id      | 10                       |
      | estado              | Activo                   |
    When publico la API "/recetas" con los datos de la receta
    Then el sistema rechaza la creación por clave foránea inválida "FK_PROFESIONAL"
    And no se crea la receta

  Scenario: US-11.7 Rechazar nulos en campos obligatorios
    Given que tengo los siguientes datos de la receta:
      | nombre              | Juan                     |
      | apellido            | Pérez                    |
      | tipo_documento      | DNI                      |
      | numero_documento    | 5098765                  |
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
      | superficie_corporal |                          |
      | diagnostico         |                          |
      | numero_ciclo        | 1                        |
      | protocolo_id        | 1                        |
      | ciclo_id            | 1                        |
      | regimen             | 1                        |
      | paciente_id         | 1                        |
      | profesional_id      | 1                        |
      | estado              | Activo                   |
    When publico la API "/recetas" con los datos de la receta
    Then el sistema rechaza la creación por campos obligatorios faltantes
    And no se crea la receta

