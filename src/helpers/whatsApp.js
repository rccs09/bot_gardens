const Baileys = require('baileys');
const PendingAliquots = require('./pendingAliquots');
const Constants = require('../config/constants');

class WhatsAppWebClient{
    client = new Baileys();

    //Iniciar el cliente de whatsapp
    conectApi = async (req, res) => {
        this.client.connect()
        .then (([user, chats, contacts, unread]) => {
            res.jsonp({mensaje: 'Autenticación exitosa'});
        })
        .catch (err => console.log(err) );
    }

    //Enviar mensajes
    sendMessage = async (req, res) => {
        this.client.sendTextMessage(`${req.body.phone}@s.whatsapp.net`, req.body.body)
        .then( res.jsonp({mensaje:'Notificación enviada'}));
    }

    sendAllMessage = async (req, res) => {
        const filePath = "D:/Documentos/Roberto/Casa/GardensClub/Directiva2021/ControlTesoreria.xlsx"
        const sheetAliquots = "Alicuotas";
        const sheetCellNumbers = "Telefonos";
        const pendingAliquots = new PendingAliquots(filePath, sheetAliquots, sheetCellNumbers, "2021", "Junio" );
        await pendingAliquots.init();

        const messages = [];
        pendingAliquots.jsonXlsAlicuotas.forEach(element => {
            if(element[Constants.NAME_LABEL]){
                const rowResult = pendingAliquots.getResumeByUser(element);
                const message = this.generateMesage(rowResult, element[Constants.HOUSE_LABEL]);
                messages.push(element[Constants.HOUSE_LABEL] + "|" +message);
            }
        });

        for (let index = 0; index < messages.length; index++) {
            const element = messages[index].split("|");
            const regNumbers =   pendingAliquots.jsonXlsCellNumbers.find(row => row.CASA === element[0]);
            /////////////////// borrar el if
            if(index === 3){
                break;
            }
            ////////////////////////
            console.log(regNumbers);
            if(regNumbers["Celular1"] && regNumbers["Celular1"].length > 0){
                this.sendBasicMessage(regNumbers["Celular1"], element[1]);
            }
            if(regNumbers["Celular2"] && regNumbers["Celular2"].length > 0){
                this.sendBasicMessage(regNumbers["Celular2"], element[1]);
            }
            console.log("**********************************************");
            //await this.sleepNow(100);
        }

        res.jsonp({mensaje:'Notificación enviada'});
    }

    sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

    generateMesage(rowResult, house){
        const message = [];
        if(rowResult.Total > 0 ){
            message.push(
                Constants.MSG_GREETING_INIT + house + "\n", Constants.MSG_GREETING_COMPL + "\n", Constants.MSG_GREETING_COMPL2+ "\n",
                `Alícuotas pendientes: \n`
            );
            rowResult.Pendings.forEach(element => {
                message.push("   * " + element.month + "-" + element.year + " -> " + element.pendingVal + "\n");
            });
    
            message.push(Constants.TOTAL_REP_LABEL + ": " + rowResult.Total);
        }else{
            message.push(Constants.MSG_GREETING_INIT + house + "\n", Constants.MSG_GREETING_COMPL4);
        }
        
        return message.join("");
    }

    sendBasicMessage = async (phone, message) => {
        console.log(phone + " --- "+ message);
         // this.client.sendTextMessage(`${phone}@s.whatsapp.net`, message)
            //         .then( console.log("Mensaje enviado"));
        console.log("**********************************************");
    }
}

module.exports = WhatsAppWebClient;

