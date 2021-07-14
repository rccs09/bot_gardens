/*
const { pruebaCodigo } = require('./src/helpers/prueba');
const main = async() => {
    pruebaCodigo();
}
main();
*/

////////////////////////////////////////////////////////////////////////////////////////

const Constants = require('./src/config/constants');
const WhatsAppBoot = require('./src/helpers/whatsAppBoot');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const port = 3001;

let whatsAppBoot = new WhatsAppBoot(Constants.FILE_PATH);
whatsAppBoot.init();

app.post('/whatsapp/sendAllMessage', whatsAppBoot.sendAllMessage);
app.post('/whatsapp/updateDataBase', whatsAppBoot.updateDataBase);
app.post('/whatsapp/pendingByHouse', whatsAppBoot.pendingByHouse);
app.post('/whatsapp/detailByHouse', whatsAppBoot.detailByHouse);
app.listen(port, () => {
    console.log(`Iniciado el servidor en el puerto ${port}`);
});

