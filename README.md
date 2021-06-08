### Descripción:
Este proyecto tiene por finalidad obtener los pagos pendientes de los condominos de un conjunto habitacional (desde un excel de tesorería) y enviar mediante whatsapp las deudas pendientes de cada casa.

- En vista de que no se esta usando un API sino una implementacion de whatsappWeb es necesario realizar el registro del cliente de whatsapp
    - El cliente será un usuario de whatsapp el cual se inicializará median el escaneo del QR de whatsapp para lo caul es necesario llamar al servicio web:
        http://localhost:3000/whatsapp/connect
    - Para el envio de mensajes se tiene al momento implementado el servicio
        http://localhost:3000/whatsapp/sendmessage
- El proyecto postman para probar los servicios se encuentra en la carpeta:
    /src/resources/whatsapp.postman_collection.json