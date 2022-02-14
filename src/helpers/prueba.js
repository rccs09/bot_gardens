const PendingAliquots = require('./pendingAliquots');
const Util = require('../config/util');
const Constants = require('../config/constants');

const pruebaCodigo = async() => {

// ************ PRUEBA DE RESUMEN GENERAL DE PAGOS Y PENDIENTES   */ 
    const pendingAliquots = new PendingAliquots(Constants.FILE_PATH);
    await pendingAliquots.init();
    console.log(Constants.FILE_PATH);
    let message = "<html> <style>table, th, td { border: 1px solid black;border-collapse: collapse;}</style> <body>";
    const house = "CASA ";
    for (let index = 1; index <= 30; index++) {
        //let index = 26;
        message = message + pendingAliquots.generateDetailPaysMessages(house+index, 1);
        message = message.replace(/\n/g,"</br>");    
        message = message + "</body></html>";
        console.log(message);
/*
        message = message + this.pendingAliquots.generateMessagePendingByHouse(house+index, 1);
        message = message.replace(/\n/g,"</br>");
        message = message + "<h1>---------------------------------------------------</h1>";
*/            
    }
//////////////////////////////////





   /* const from = "593995711770";
    //const from = "593987416406";
    //const from = "593990102302";
    //const from = "59312345678";
    const pendingAliquots = new PendingAliquots(Constants.FILE_PATH);
    await pendingAliquots.init();

    //console.log(pendingAliquots.jsonXlsIncome);
    console.log("******✅ ⚠️ ❌ pruebas***********************");
    
    
    const house = "CASA 29"
    //console.log(pendingAliquots.generateMessagePendingByHouse(house));
    console.log(pendingAliquots.generateDetailPaysMessages(house));

*/
    //=========================================
    /*
    const regNumbers =   pendingAliquots.validateFromNumber(from);
    if(regNumbers){
        console.log(regNumbers);
        const messageTest = pendingAliquots.generateMessagePendingByHouse(regNumbers[Constants.SHT_TELF_HOUSE_LABEL]);
        console.log(messageTest);

        if(regNumbers[Constants.SHT_TELF_CELL1_LABEL]?.length > 0){
            console.log(regNumbers[Constants.SHT_TELF_CELL1_LABEL]);
        }
        if(regNumbers[Constants.SHT_TELF_CELL2_LABEL]?.length > 0){
            console.log(regNumbers[Constants.SHT_TELF_CELL2_LABEL]);
        }
    }else{
        console.log("Su numero no esta registrado");
    }
    */
    
    //============================


}


module.exports = {pruebaCodigo};

