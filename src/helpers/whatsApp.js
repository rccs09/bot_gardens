const Baileys = require('baileys')

class WhatsAppWebClient{
    client = new Baileys();

    //Iniciar el cliente de whatsapp
    conectApi = async (req, res) => {
        this.client.connect()
        .then (([user, chats, contacts, unread]) => {
            res.jsonp({mensaje: 'Autenticación exitosa'});
        })
        .catch (err => console.log(err) )
    }

    //Enviar mensajes
    sendMessage = async (req, res) => {
        // options = {
        //     quoted: null,
        //     timestamp: new Date()
        // };

        this.client.sendTextMessage(`${req.body.phone}@s.whatsapp.net`, req.body.body)
        .then( res.jsonp({mensaje:'Notificación enviada'}));
    }
    
}

module.exports = WhatsAppWebClient;

