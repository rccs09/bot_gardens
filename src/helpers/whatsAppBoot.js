const PendingAliquots = require('./pendingAliquots');
const Constants = require('../config/constants');
const { Client, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const ora = require('ora');
const fs = require('fs');
const path = require('path');
const FileManager = require('./fileManager');
const SESSION_FILE_PATH = "../database/session.json";
const Util = require('../config/util');

class WhatsAppBoot{
    client;
    sessionData;
    filePath;
    pendingAliquots;
    
    constructor(database){
        this.filePath = database;
        if(!this.client){
            if(fs.existsSync(path.join(__dirname, '../database/', 'session.json'))){
                this.sessionData = require(SESSION_FILE_PATH);
                this.sessionRetrieve(this.sessionData);
            }else{
                this.generateSession();
            }
        }
        this.pendingAliquots = new PendingAliquots(this.filePath);
    }

    async init(){
        await this.pendingAliquots.init();
    }

    sessionRetrieve(sessionData){
        this.client = new Client({session: this.sessionData});
        //console.log(this.client.getState());
        this.client.on('auth_failure', () => {
            console.log('** Error de autentificacion vuelve a generar el QRCODE **');
            try {
                fs.unlinkSync(path.join(__dirname, '../database/', 'session.json'));
                this.generateSession();
            } catch(err) {
                console.error(err);
            }
        });
        this.initSession();
    }

    generateSession(){
        this.client = new Client();
        console.log('No tenemos session guardada');
        this.client.on('qr', qr => {
            qrcode.generate(qr, { small: true });
        });

        this.client.on('authenticated', (session) => {
            this.sessionData = session;
            fs.writeFile(path.join(__dirname, '../database/', 'session.json'), JSON.stringify(session), function (err) {
                if (err) {
                    console.log(err);
                }
            });
        });

        this.client.on('auth_failure', () => {
            console.log('** Error de autentificacion vuelve a generar el QRCODE **');
        });
        this.initSession();
    }

    initSession(){
        this.client.on('ready', () => {
            console.log('Client is ready!');
            this.connectionReady();
        });
        this.client.initialize();
        this.closeSession();
    }

    closeSession(){
        this.client.on('disconnected', () => {
            console.log('La session fue cerrada desde el dispositivo');
            try {
                fs.unlinkSync(path.join(__dirname, '../database/', 'session.json'));
              } catch(err) {
                console.error(err);
              }
            
        });
    }

    listenMessage(){
        this.client.on('message', async msg => {
            const { from, to, body } = msg;
            console.log(from, to, body);
            this.processingMessageIn(from, body)
        });
    }

    processingMessageIn(from, body){
        const fromStd = from.replace('@c.us', '');
        const regNumbers =   this.pendingAliquots.validateFromNumber(fromStd);
        const bodyIn = body.toUpperCase();
        if(regNumbers){
            console.log(regNumbers);
            switch (bodyIn) {
                case Constants.MSG_IN_PENDING:
                    console.log("Ejecutando una solicitud de pendientes");
                    const messagePending = this.pendingAliquots.generateMessagePendingByHouse(regNumbers[Constants.SHT_TELF_HOUSE_LABEL], 0);
                    console.log(messagePending);
                    this.sendMessage(fromStd, messagePending);
                    break;
                case Constants.MSG_IN_DETAILS:
                    console.log("Ejecutando una solicitud de detalles");
                    const messageDetail = this.pendingAliquots.generateDetailPaysMessages(regNumbers[Constants.SHT_TELF_HOUSE_LABEL]);
                    console.log(messageDetail);
                    this.sendMessage(fromStd, messageDetail);
                    break;
                default:
                    const wellcomeMessage = Util.generateWelcomeMesageBot(regNumbers[Constants.SHT_TELF_HOUSE_LABEL]);
                    this.sendMessage(fromStd, wellcomeMessage);
                    break;
            }
        }else{
            console.log("Su numero no esta registrado");
        }
    }

   
    sendMessage(number = null, text = null){
        if(number){
            number = number.replace('@c.us', '');
            number = `${number}@c.us`;
            const message = text || `Hola soy un BOT recuerda`;
            this.client.sendMessage(number, message);
        }
    }

    connectionReady() {
        this.listenMessage();
        //readExcel();
    }

    sendAllMessage = async (req, res) => {
        const messages = this.pendingAliquots.generateMessageAllPendings();
        for (let index = 0; index < messages.length; index++) {
            const element = messages[index].split("|");
            const regNumbers =   this.pendingAliquots.jsonXlsCellNumbers.find(row => row.CASA === element[0]);
            /////////////////// borrar el if
            if(index === 3){
                break;
            }
            ////////////////////////
            console.log(regNumbers);
            this.sendMessage(regNumbers[Constants.SHT_TELF_CELL1_LABEL], element[1]);
            this.sendMessage(regNumbers[Constants.SHT_TELF_CELL2_LABEL], element[1]);
            console.log("**********************************************");
            //await this.sleepNow(100);
        }
        res.jsonp({mensaje:'Notificación enviada'});
    }

    updateDataBase = async (req, res) => {
        this.pendingAliquots = new PendingAliquots(this.filePath);
        await this.pendingAliquots.init();
        res.jsonp({mensaje:'Base de datos actualizada'});
    }

    pendingByHouse = async (req, res) => {
        const house = req.body?.house;
        let message = "<html> <body>";
        if(house){
            message = message + this.pendingAliquots.generateMessagePendingByHouse(house, 0);
            message = message.replace(/\n/g,"</br>");
        }else{
            message = "Request incorrecto";
        }
        message = message + "</body></html>";
        res.jsonp({mensaje:message});
    }


    pendingAllHouse = async (req, res) => {
        //const house = req.body?.house;
        let message = "<html> <style>table, th, td { border: 1px solid black;border-collapse: collapse;}</style> <body>";
        
        const house = "CASA ";
        for (let index = 1; index <= 30; index++) {
            message = message + this.pendingAliquots.generateMessagePendingByHouse(house+index, 1);
            message = message.replace(/\n/g,"</br>");
            message = message + "<h1>---------------------------------------------------</h1>";
        }

        message = message + this.pendingAliquots.generateMessagePendingByHouse("LOCALES", 1);
        message = message.replace(/\n/g,"</br>");
        message = message + "<h1>---------------------------------------------------</h1>";

        message = message + "</body></html>";
        res.jsonp({mensaje:message});
    }




    detailByHouse = async (req, res) => {
        const house = req.body?.house;
        let message = "<html> <body>";
        if(house){
            message = message + this.pendingAliquots.generateDetailPaysMessages(house);
            message = message.replace(/\n/g,"</br>");
        }else{
            message = "Request incorrecto";
        }
        message = message + "</body></html>";
        res.jsonp({mensaje:message});
    }

}

module.exports = WhatsAppBoot;
