### Descripción:
Este proyecto tiene por finalidad obtener los pagos pendientes de los condominos de un conjunto habitacional (desde un excel de tesorería) y enviar mediante whatsapp las deudas pendientes de cada casa.

- En vista de que no se esta usando un API sino una implementacion de whatsappWeb es necesario realizar el registro del cliente de whatsapp
    - El cliente será un usuario de whatsapp el cual se inicializará median el escaneo del QR de whatsapp para lo cual debemos identificar si al inciar la aplcaicon nos pide el registro
    - Para el envio de mensaje general a todos los condominos se usa el servicio
        http://localhost:3000/whatsapp/sendAllMessage
- El proyecto postman para probar los servicios se encuentra en la carpeta:
    /src/resources/whatsapp.postman_collection.json


### Ejecutar proyecto en servidor (esto se debe ejecutar con un usuario admin NO ROOT)
- Para ejecutar, se ejecuta desde CLI
    - Ingresar al proyecto:
        cd /volume1/nodeJs/bot_gardens
    - Instalar el proyecto (solo se ejecuta la primera vez para descargar los modulos)
        npm install
    - Ejecutar la aplicacion
        node ./app.js


##### Installar las librerias necesarias para el proyecto 
- Ingresar al path del proyecto
  cd /opt/resources/bot_gardens/
- En el path base del proyecto ejecutar por CLI
  ```unix
      npm install
  ```  
##### Configuracion adicional whatsappweb cuando ejecutamos en server sin gui
- En la libreria whatsappweb debemos editar la instanciacion de "puppeteer"
  - Ir al path
    cd [path_project]/node_modules/whatsapp-web.js/src/util

    ejemplo:
    cd /opt/resources/bot_gardens/node_modules/whatsapp-web.js/src/util
  - Editar el JS "Constants.js"  
    vi /opt/resources/bot_gardens/node_modules/whatsapp-web.js/src/util/Constants.js
    - Dentro del export "DefaultOptions"
    - En la definicion de "puppeteer"
    - Agregar el atributo:
      args:['--no-sandbox']
    - quedaría asi:
    ```javascript
      exports.DefaultOptions = {
      puppeteer: {
          headless: true,
          defaultViewport: null,
          args:['--no-sandbox']
      },
    ```
        

### Para el error: Evaluation failed: ReferenceError: webpackChunkbuild is not defined
Para el error: just temporary solution, try replace webpackChunkbuild with webpackChunkwhatsapp_web_client on node_modules/@pedroslopez/moduleraid/moduleraid.js        
