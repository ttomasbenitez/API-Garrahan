Feature: Crear un protocolo
    Como sistema de prescripción
    Quiero mantener un catálogo versionado de protocolos de tratamiento
    Para poder asignarlos a pacientes y consultarlos por enfermedad y línea de tratamiento
    
    Scenario: US-01.1 Crear un protocolo con todos los campos
        Given quiero crear el protocolo con el nombre de "Osteosarcoma GBTO 2006 - No metastásico" 
        And enfermedad "Osteosarcoma"
        And de linea de tratamiento "primera linea"
        When publico en la API "/protocolo" con los datos
        Then el protocolo se crea correctamente
    
    Scenario: US-01.2 Obtener un protocolo creado por su id
        Given existe en la base de datos un protocolo con el nombre de "Osteosarcoma GBTO 2006 - No metastásico" con id "2"
        When consulto en la API "/protocolo/2"
        Then el sistema me devuelve el protocolo con id "2"
        And el nombre del protocolo es "Osteosarcoma GBTO 2006 - No metastásico"
        And la enfermedad es "Osteosarcoma"
        And la linea de tratamiento es "primera linea"
    
    Scenario: US-01.3 Agregar ciclo de tratamiento a un protocolo
        Given existe en la base de datos un protocolo con el nombre de "Osteosarcoma GBTO 2006 - No metastásico" con id "2"
        And quiero agregar al protocolo con id "2" un ciclo de tratamiento con los siguientes datos
            | protocolo_id     | 2               |
            | ciclo_id         | 1               |
            | regimen          | 0               |
            | duracion_semanas | 5               |
            | ciclo_final      | false           |
            | repeticiones     | 1               |
        When publico en la API "/protocolo/2/ciclo" con los datos
        Then el ciclo de tratamiento se agrega correctamente al protocolo "2" con id "1"

    Scenario: US-01.4 Puedo agregar varios ciclos de tratamiento a un protocolo
        Given existe en la base de datos un protocolo con el nombre de "Osteosarcoma GBTO 2006 - No metastásico" con id "2"
        And quiero agregar al protocolo con id "2" un ciclo de tratamiento con los siguientes datos
            | protocolo_id     | 2               |
            | ciclo_id         | 2               |
            | regimen          | 0               |
            | duracion_semanas | 5               |
            | ciclo_final      | false           |
            | repeticiones     | 1               |
        Given quiero agregar al protocolo con id "2" un ciclo de tratamiento con los siguientes datos
            | protocolo_id     | 2               |
            | ciclo_id         | 3               |
            | regimen          | 1               |
            | duracion_semanas | 3               |
            | ciclo_final      | true            |
            | repeticiones     | 3               |
        When publico en la API "/protocolo/2/ciclo" con los datos
        Then el ciclo de tratamiento se agrega correctamente al protocolo "2" con los ids "2","3"


