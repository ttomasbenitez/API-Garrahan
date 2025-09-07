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
        Given existe en la base de datos un protocolo con el nombre de "Osteosarcoma GBTO 2006 - No metastásico" con id "1"
        When consulto en la API "/protocolo/1"
        Then el sistema me devuelve el protocolo con id "1"
        And el nombre del protocolo es "Osteosarcoma GBTO 2006 - No metastásico"
        And la enfermedad es "Osteosarcoma"
        And la linea de tratamiento es "primera linea"
    
    @wip
    Scenario: US-01.3 Agregar ciclo de tratamiento a un protocolo
        Given existe en la base de datos un protocolo con el nombre de "Osteosarcoma GBTO 2006 - No metastásico" con id "1"
        And quiero agregar al protocolo con id "1" un ciclo de tratamiento con los siguientes datos
            | protocolo_id     | 1               |
            | ciclo_id         | 1               |
            | regimen          | 0               |
            | duracion_semanas | 5               |
            | ciclo_final      | false           |
        When publico en la API "/protocolo/1/ciclo" con los datos
        Then el ciclo de tratamiento se agrega correctamente al protocolo "1" con id "1"


