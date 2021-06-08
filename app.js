// const PendingAliquots = require('./src/helpers/pendingAliquots');

// const main = async() => {
//     const filePath = "D:/Documentos/Roberto/Casa/GardensClub/Directiva2021/ControlTesoreria.xlsx"
//     const sheetName = "Alicuotas";
//     const pendingAliquots = new PendingAliquots(filePath, sheetName, "2021", "Junio" );
//     await pendingAliquots.init();
//     pendingAliquots.gerateAllPendingReport();

// }

// main();
////////////////////////////////////////////////

const express = require('express');
const bodyParser = require('body-parser');
const Whatsapp = require('./src/helpers/whatsApp');
const app = express();
const router = express.Router();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const port = 3000;

whatsapp = new Whatsapp();
app.post('/whatsapp/connect', whatsapp.conectApi);
app.post('/whatsapp/sendmessage', whatsapp.sendMessage);


app.listen(port, () => {
    console.log(`Iniciado el servidor en el puerto ${port}`);
});


