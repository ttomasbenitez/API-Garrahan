Feature: Cálculo de Droga
  Como sistema de prescripción
  Quiero calcular la cantidad de droga necesaria para un tratamiento
  Para generar recetas con dosis correctas según el peso del paciente

  Background:
    Given existe en la base de datos el protocolo con id "1" y con los datos:
      | nombre             | LLA Pediátrica |
      | enfermedad         | LLA            |
      | linea              | 1              |
      | cantidad_regimenes | 1              |
    And existe el ciclo del protocolo "1" con:
      | ciclo_id         | 1 |
      | regimen          | 1 |
      | duracion_semanas | 4 |
      | ciclo_final      | 0 |
      | repeticiones     | 0 |
    And existe la droga con id "1" y con los datos:
      | nombre_generico | CISPLATINO |
    And existe la droga con id "2" y con los datos:
      | nombre_generico | VINCRISTINA |
    And existe la vía de administración con id "1" y con los datos:
      | nombre | Intravenosa |
      | codigo | IV          |
    And existe la vía de administración con id "2" y con los datos:
      | nombre | Oral |
      | codigo | VO   |


  Scenario: US-CALC-01 Calcular dosis con mg/m2
    Given existe la administración de medicación:
      | droga_id          | 1     |
      | via_id            | 2     |
      | fuerza_valor      | 100   |
      | fuerza_unidad     | mg/m2 |
      | cantidad_dias     | 7     |
      | frecuencia_diaria | 1     |
    When calculo la droga con los siguientes datos:
      | administracion_id  | 1   |
      | peso               | 25  |
      | nueva_fuerza_valor | 500 |
      | nueva_fuerza_unidad| mg  |
      | nombre_droga       | CISPLATINO |
    Then la dosis diaria es aproximadamente "93.04" "mg"
    And la cantidad total es aproximadamente "651.30" "mg"
    And las unidades calculadas son "2"


  Scenario: US-CALC-02 Calcular dosis con mg/kg
    Given existe la administración de medicación:
      | droga_id          | 1   |
      | via_id            | 2   |
      | fuerza_valor      | 2   |
      | fuerza_unidad     | mg/kg |
      | cantidad_dias     | 7   |
      | frecuencia_diaria | 1   |
    When calculo la droga con los siguientes datos:
      | administracion_id  | 1  |
      | peso               | 25 |
      | nueva_fuerza_valor | 50 |
      | nueva_fuerza_unidad| mg |
      | nombre_droga       | CISPLATINO |
    Then la dosis diaria es aproximadamente "50.00" "mg"
    And la cantidad total es aproximadamente "350.00" "mg"
    And las unidades calculadas son "7"


  Scenario: US-CALC-03 Calcular dosis con conversión de unidades (gr a mg)
    Given existe la administración de medicación:
      | droga_id          | 1    |
      | via_id            | 2    |
      | fuerza_valor      | 10   |
      | fuerza_unidad     | gr/m2 |
      | cantidad_dias     | 7    |
      | frecuencia_diaria | 1    |
    When calculo la droga con los siguientes datos:
      | administracion_id  | 1    |
      | peso               | 25   |
      | nueva_fuerza_valor | 1000 |
      | nueva_fuerza_unidad| mg   |
      | nombre_droga       | CISPLATINO |
    Then la dosis diaria es aproximadamente "9304.35" "mg"
    And la cantidad total es aproximadamente "65130.43" "mg"
    And las unidades calculadas son "66"


  Scenario: US-CALC-04 Calcular con vía IV - descarte diario
    Given existe la administración de medicación:
      | droga_id          | 1   |
      | via_id            | 1   |
      | fuerza_valor      | 1.2 |
      | fuerza_unidad     | mg  |
      | cantidad_dias     | 4   |
      | frecuencia_diaria | 1   |
    When calculo la droga con los siguientes datos:
      | administracion_id  | 1  |
      | peso               | 20 |
      | nueva_fuerza_valor | 1  |
      | nueva_fuerza_unidad| mg |
      | nombre_droga       | CISPLATINO |
    Then la dosis diaria es aproximadamente "1.20" "mg"
    And las unidades calculadas son "8"


  Scenario: US-CALC-05 VINCRISTINA - Validar límite máximo de 2mg
    Given existe la administración de medicación:
      | droga_id          | 2     |
      | via_id            | 1     |
      | fuerza_valor      | 150   |
      | fuerza_unidad     | mg/m2 |
      | cantidad_dias     | 7     |
      | frecuencia_diaria | 1     |
    When calculo la droga con los siguientes datos:
      | administracion_id  | 1   |
      | peso               | 25  |
      | nueva_fuerza_valor | 1   |
      | nueva_fuerza_unidad| mg  |
      | nombre_droga       | VINCRISTINA |
    Then la dosis diaria es exactamente "2.00" "mg"
    And la cantidad total es aproximadamente "14.00" "mg"
    And el sistema aplica el límite máximo de VINCRISTINA


  Scenario: US-CALC-06 VINCRISTINA - No limitar si está por debajo de 2mg
    Given existe la administración de medicación:
      | droga_id          | 2     |
      | via_id            | 2     |
      | fuerza_valor      | 1.5   |
      | fuerza_unidad     | mg/kg |
      | cantidad_dias     | 5     |
      | frecuencia_diaria | 1     |
    When calculo la droga con los siguientes datos:
      | administracion_id  | 1  |
      | peso               | 1  |
      | nueva_fuerza_valor | 1  |
      | nueva_fuerza_unidad| mg |
      | nombre_droga       | VINCRISTINA |
    Then la dosis diaria es exactamente "1.50" "mg"
    And la cantidad total es aproximadamente "7.50" "mg"


  Scenario: US-CALC-07 Calcular con frecuencia diaria múltiple
    Given existe la administración de medicación:
      | droga_id          | 1    |
      | via_id            | 2    |
      | fuerza_valor      | 50   |
      | fuerza_unidad     | mg/kg |
      | cantidad_dias     | 3    |
      | frecuencia_diaria | 2    |
    When calculo la droga con los siguientes datos:
      | administracion_id  | 1   |
      | peso               | 10  |
      | nueva_fuerza_valor | 400 |
      | nueva_fuerza_unidad| mg  |
      | nombre_droga       | CISPLATINO |
    Then la dosis diaria es aproximadamente "1000.00" "mg"
    And la cantidad total es aproximadamente "3000.00" "mg"
    And las unidades calculadas son "8"


  Scenario: US-CALC-08 Calcular con conversión a microgramos
    Given existe la administración de medicación:
      | droga_id          | 1     |
      | via_id            | 2     |
      | fuerza_valor      | 5000  |
      | fuerza_unidad     | μg/m2 |
      | cantidad_dias     | 7     |
      | frecuencia_diaria | 1     |
    When calculo la droga con los siguientes datos:
      | administracion_id  | 1    |
      | peso               | 25   |
      | nueva_fuerza_valor | 1000 |
      | nueva_fuerza_unidad| μg   |
      | nombre_droga       | CISPLATINO |
    Then la dosis diaria es aproximadamente "4652.17" "μg"
    And la cantidad total es aproximadamente "32565.22" "μg"


  Scenario: US-CALC-09 Error cuando no existe la administración
    When intento calcular con una administración inexistente:
      | administracion_id  | 999 |
      | peso               | 25  |
      | nueva_fuerza_valor | 500 |
      | nueva_fuerza_unidad| mg  |
      | nombre_droga       | CISPLATINO |
    Then el cálculo falla con error "Administración no encontrada"
