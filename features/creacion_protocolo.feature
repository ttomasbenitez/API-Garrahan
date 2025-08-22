Feature: Crear un protocolo
    Como sistema de prescripción
    Quiero mantener un catálogo versionado de protocolos de tratamiento
    Para poder asignarlos a pacientes y consultarlos por enfermedad y línea de tratamiento

    Scenario: US-01.1 Crear un protocolo con todos los campos
        Given quiero crear el protocolo con el nombre de "Osteosarcoma GBTO 2006 - No metastásico" 
        And enfermedad "Osteosarcoma"
        And de linea de tratamiento "primera linea"
        When publico en la API '/protocolo' con los datos
        Then el protocolo se crea correctamente
        And puedo consultar el protocolo por enfermedad
    
    @wip
    Scenario: US-01.2 Crear un protocolo con solo el mismo nombre
        Given existe en la base de datos un protocolo con el nombre de "Osteosarcoma GBTO 2006 - No metastásico" 
        And quiero crear el protocolo con el nombre de "Osteosarcoma GBTO 2006 - No metastásico" 
        And enfermedad "Osteosarcoma"
        And de linea de tratamiento "primera linea"
        When intento registrar de nuevo el mismo nombre y versión
        Then el sistema informa que el protocolo ya existe


