Feature: Crear un protocolo
    Como sistema de prescripción
    Quiero mantener un catálogo versionado de protocolos de tratamiento
    Para poder asignarlos a pacientes y consultarlos por enfermedad y línea de tratamiento
   
    Scenario: US-01.1 Crear un protocolo con todos los campos
        Given quiero crear el protocolo con el nombre de "Osteosarcoma GBTO 2006 - No metastásico" 
        And enfermedad "Osteosarcoma"
        And de linea de tratamiento "primera linea"
        And cantidad_regimenes "3"
        When publico en la API "/protocolos" con los datos
        Then el protocolo se crea correctamente

    Scenario: US-01.2 Obtener un protocolo creado por su id
        Given existe en la base de datos un protocolo con el nombre de "Osteosarcoma GBTO 2006 - No metastásico" con id "1" y cantidad_regimenes "2"
        When consulto en la API "/protocolos/1"
        Then el sistema me devuelve el protocolo con id "1"
        And el nombre del protocolo es "Osteosarcoma GBTO 2006 - No metastásico"
        And la enfermedad es "Osteosarcoma"
        And la linea de tratamiento es "primera linea"
        And cantidad_regimenes es 2
        And el sistema responde correctamente
    
    Scenario: US-01.3 Obtener protocolos
        Given existe en la base de datos un protocolo con el nombre de "Osteosarcoma GBTO 2006 - No metastásico" con id "1" y cantidad_regimenes "2"
        And existe en la base de datos un protocolo con el nombre de "ALL-BFM" con id "2" y cantidad_regimenes "3"
        And existe en la base de datos un protocolo con el nombre de "Hodgkin-LPH / EuroNet-PHL" con id "3" y cantidad_regimenes "4"
        When consulto en la API "/protocolos"
        Then el sistema me devuelve una lista que contiene los siguientes protocolos:
            | protocolo_id | nombre                                            |
            | 1            | Osteosarcoma GBTO 2006 - No metastásico         |
            | 2            | ALL-BFM                                           |
            | 3            | Hodgkin-LPH / EuroNet-PHL                         |
 
    Scenario: US-01.4 Agregar ciclo de tratamiento a un protocolo
        Given existe en la base de datos un protocolo con el nombre de "Osteosarcoma GBTO 2006 - No metastásico" con id "1" y cantidad_regimenes "2"
        And quiero agregar al protocolo con id "1" un ciclo de tratamiento con los siguientes datos
            | protocolo_id     | 1               |
            | ciclo_id         | 2               |
            | regimen          | 0               |
            | duracion_semanas | 5               |
            | ciclo_final      | false           |
            | repeticiones     | 0               |
        When publico en la API "/protocolos/1/ciclos" con los datos
        Then el ciclo de tratamiento se agrega correctamente al protocolo "1" con id "2"
        And el sistema responde correctamente
 
    Scenario: US-01.5 Puedo agregar varios ciclos de tratamiento a un protocolo
        Given existe en la base de datos un protocolo con el nombre de "Osteosarcoma GBTO 2006 - No metastásico" con id "1" y cantidad_regimenes "2"
        And quiero agregar al protocolo con id "1" un ciclo de tratamiento con los siguientes datos
            | protocolo_id     | 1               |
            | ciclo_id         | 3               |
            | regimen          | 0               |
            | duracion_semanas | 5               |
            | ciclo_final      | false           |
            | repeticiones     | 0               |
        Given quiero agregar al protocolo con id "1" un ciclo de tratamiento con los siguientes datos
            | protocolo_id     | 1               |
            | ciclo_id         | 4               |
            | regimen          | 1               |
            | duracion_semanas | 3               |
            | ciclo_final      | true            |
            | repeticiones     | 3               |
        When publico en la API "/protocolos/1/ciclos" con los datos
        Then el ciclo de tratamiento se agrega correctamente al protocolo "1" con los ids "3","4"
        And el sistema responde correctamente

    Scenario: US-01.6 No puedo crear un protocolo sin su nombre
        Given quiero crear el protocolo con el nombre de ""
        And enfermedad "Osteosarcoma"
        And de linea de tratamiento "primera linea"
        When publico en la API "/protocolos" con los datos
        Then responde "400" con el mensaje "nombre es requerido"
        And el sistema responde correctamente
    
     Scenario: US-01.7 No puedo crear un protocolo sin su enfermedad
        Given quiero crear el protocolo con el nombre de "Osteosarcoma GBTO 2006 - No metastásico"
        And enfermedad ""
        And de linea de tratamiento "primera linea"
        When publico en la API "/protocolos" con los datos
        Then responde "400" con el mensaje "enfermedad es requerido"

    Scenario: US-01.8 No puedo crear un protocolo sin su enfermedad
        Given quiero crear el protocolo con el nombre de "Osteosarcoma GBTO 2006 - No metastásico"
        And enfermedad "Osteosarcoma"
        And de linea de tratamiento ""
        When publico en la API "/protocolos" con los datos
        Then responde "400" con el mensaje "linea es requerido"

    Scenario: US-01.9 No puedo crear un protocolo sin cantidad de regimenes
        Given quiero crear el protocolo con el nombre de "Osteosarcoma GBTO 2006 - No metastásico"
        And enfermedad "Osteosarcoma"
        And de linea de tratamiento "primera linea"
        And cantidad_regimenes ""
        When publico en la API "/protocolos" con los datos
        Then responde "400" con el mensaje "cantidad de regimenes es requerido"
