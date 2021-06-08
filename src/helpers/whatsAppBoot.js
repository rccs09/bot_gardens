const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');

class WhatsAppBootClient{
    client = new Client();

    constructor(){

    }

    initializeClient = async (req, res) => {
        this.client.on('qr', qr => {
            qrcode.generate(qr, {small: true});
        });
        this.client.on('ready', () => {
            console.log('Client is ready!');
        });
        this.client.initialize();
        res.jsonp({mensaje: 'Autenticación exitosa'});
    }

    // initializeClient(){
    //     this.client.on('qr', qr => {
    //         qrcode.generate(qr, {small: true});
    //     });
    //     this.client.on('ready', () => {
    //         console.log('Client is ready!');
    //     });
    //     this.client.initialize();

    //     // this.client.on('message', message => {
    //     //     if(message.body === '!ping') {
    //     //         message.reply('pong');
    //     //     }
    //     // });
    // }

    sendMessage = async (req, res) => {
        // options = {
        //     quoted: null,
        //     timestamp: new Date()
        // }
        //console.log(req);
        console.log("**********************************************************************************");
        console.log(req.body);
        // this.client.sendTextMessage(`${req.body.phone}@s.whatsapp.net`, req.body.body, options)
        //     .then( res.jsonp({mensaje:'Notificación enviada'}))
            // Your message.
           const text = req.body.body;
          
            // Getting chatId from the number.
            // we have to delete "+" from the beginning and add "@c.us" at the end of the number.
        //const chatId = req.body.phone.substring(1) + "@c.us";
        const chatId = req.body.phone + "@c.us";
        //const chatId = req.body.phone;
        
        // Sending message.
        this.client.sendMessage(chatId, text)
        .then( res.jsonp({mensaje:'Notificación enviada'}));

    }

}    

module.exports = WhatsAppBootClient;



////////////////////////////////////////////////////////////

// const express = require('express');
// const WhatsAppClient = require('./src/helpers/whatsAppClient');
// const bodyParser = require('body-parser');
// const app = express();
// const router = express.Router();
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))

// const port = 3000;

// const whatsAppClient = new WhatsAppClient();
// app.post('/whatsapp/connect', whatsAppClient.initializeClient);
// app.post('/whatsapp/sendmessage', whatsAppClient.sendMessage);


// app.listen(port, () => {
//     console.log(`Iniciado el servidor en el puerto ${port}`);
// });