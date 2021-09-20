
const Constants = require('./constants');
const Moment = require('moment');
const  monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

class Util {
    //type 0-> whatsapp 1->Mail
    static generateMesage(rowResult, house, cutoffDate, type){
        const message = [];
        if(rowResult.Total > 0 ){
            message.push(this.generateGreatMesage(house), 
                Constants.MSG_GREETING_COMPL + "\n", 
                Constants.MSG_GREETING_COMPL2+ "\n"                
            );

            if(type === 1){
                message.push("<table ><tr><th>Detalle</th><th>Valor (dólares)</th></tr>");
            }
            rowResult.Pendings.forEach(element => {
                if(type === 0){
                    message.push("   ⚠️ " + element.month + "-" + element.year + " -> " + element.pendingVal + " dólares.\n");
                }else{
                    message.push(`<tr><td>${element.month}-${element.year}</td><td>${element.pendingVal}</td></tr>`);
                }
              });
    
            if(type === 1){
                message.push("</table></br>");
                message.push(Constants.REP_MAIL_PEND_TOTAL_LABEL + "<b>" + rowResult.Total + " dólares</b>\n" );
            }else{
                message.push(Constants.REP_PEND_TOTAL_LABEL + "*" + rowResult.Total + " dólares*\n" );
            }
        }else{
            message.push(this.generateGreatMesage(house), Constants.MSG_GREETING_COMPL4);
        }

        message.push(this.generateCutDateMesage(cutoffDate, type));
        return message.join("");
    }


    static generateGreatMesage(house){
        const houseComplete = house.includes("CASA") ? "la " + house: "los " + house;
        return Constants.MSG_GREETING_INIT + houseComplete + "\n";
    } 

    //type 0-> whatsapp 1->Mail
    static generateCutDateMesage(cutoffDate, type){
        const formattedDate = Moment(cutoffDate).format('YYYY-MM-DD');
        let message = "";
        if(type === 0){
            message = Constants.MSG_CUT_DATE + formattedDate + "\n";
        }else{
            message = Constants.MSG_MAIL_CUT_DATE + formattedDate + "\n";
        }

        return message;
    } 

    static generateDetailMesageVoid(house, cutoffDate){
        const message = [];
        const houseComplete = house.includes("CASA") ? "la " + house: "los " + house;
        message.push(
            Constants.MSG_GREETING_INIT + houseComplete + "\n", Constants.MSG_GREETING_COMPL + "\n", Constants.MSG_DETAIL_VOID+ "\n"
        );
        message.push(this.generateCutDateMesage(cutoffDate, 0));
        return message.join("");
    }

    static generateDetailCompleteMesage(house, incomeByHouse, cutoffDate){
        const message = [];
        message.push(this.generateGreatMesage(house), 
                Constants.MSG_GREETING_COMPL + "\n", 
                Constants.MSG_GREETING_DETAIL+ "\n"                
        );

        incomeByHouse.forEach(element => {
            message.push(Util.generateDetailSimpleMesage(element));
        });
        message.push(this.generateCutDateMesage(cutoffDate, 0));
        return message.join("");
    }

    static generateDetailSimpleMesage(rowResult){
        const message = [];
        const payDate = this.getDateFromExcelDate(rowResult[Constants.SHT_INC_DATE_LABEL]);
        message.push("✅*Fecha de pago: " + Moment(payDate).format('YYYY-MM-DD') + "*\n");
        message.push("_Valor_:" + rowResult[Constants.SHT_INC_VALUE_LABEL] + "\n");
        message.push("_Tipo de ingreso_: " + rowResult[Constants.SHT_INC_TYPE_LABEL] + "\n");
        if(Util.REP_DESC_TRANSF_TYPE_LABEL === rowResult[Constants.SHT_INC_TYPE_LABEL]){
            message.push("_Documento_: " + rowResult[Constants.SHT_INC_DOC_LABEL] + "\n");
        }else{
            message.push("_Documento_: --- \n");
        }
        message.push("_Detalle del pago_: " + rowResult[Constants.SHT_INC_DESC_LABEL] + "\n");
        return message.join("");
    }

    static getDateFromExcelDate(excelDate){
        const date = new Date((excelDate - (25567 + 2)) * 86400 * 1000);
        const localTime = new Date(date.getTime() + (new Date()).getTimezoneOffset() * 60000);
        return localTime;
    }

    static jsDateToExcelDate(jsDate) {
        var returnDateTime = 25569.0 + ((jsDate.getTime() - (jsDate.getTimezoneOffset() * 60 * 1000)) / (1000 * 60 * 60 * 24));
        return returnDateTime.toString().substr(0,20);
    }

    static generateWelcomeMesageBot(house) {
        const message = [];
        message.push(this.generateGreatMesage(house), 
                Constants.MSG_GREETING_COMPL + "\n", 
                Constants.MSG_IN_WELLCOME + "\n \n",
                "*Pendientes* \n",
                "     Retorna los haberes que usted tiene pendiente. \n",
                "*Detalles* \n",
                "     Retorna el detalle de sus pagos realizados. \n"
        );
        return message.join("");
    }

    static get monthNames() {
        return monthNames;
    }
}

module.exports = Util;