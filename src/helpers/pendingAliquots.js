const FileManager = require('./fileManager');
const Constants = require('../config/constants');
const Util = require('../config/util');

class PendingAliquots{
    filePath;
    monthsConf ;
    jsonXlsAlicuotas;
    jsonXlsCellNumbers;
    jsonXlsStatusAcount;
    jsonXlsIncome;
    currentMonth;
    currentYear;
    cutoffDate;
    
    constructor(filePath){
        this.filePath = filePath;
    }
    
    async init(){
        this.monthsConf = await FileManager.getConfigJsonFile("./src/config/monthsOfPeriod.json");
        this.jsonXlsAlicuotas = FileManager.getWorkSheetJsonFromFile(this.filePath, Constants.SHT_ALIQUOTS_NAME);
        this.jsonXlsCellNumbers = FileManager.getWorkSheetJsonFromFile(this.filePath, Constants.SHT_TELF_NAME);
        this.jsonXlsStatusAcount = FileManager.getWorkSheetJsonFromFile(this.filePath, Constants.SHT_STATUS_ACOUNT_NAME);
        this.jsonXlsIncome = FileManager.getWorkSheetJsonFromFile(this.filePath, Constants.SHT_INC_NAME);
        const statusAccountFinalLine = this.jsonXlsStatusAcount[0];
        this.cutoffDate = Util.getDateFromExcelDate(statusAccountFinalLine.Fecha);
        this.currentYear = String(this.cutoffDate.getFullYear());
        this.currentMonth = Util.monthNames[this.cutoffDate.getMonth()];
    }

    getMothByCode(codeValue){
        return this.monthsConf.find(row => row.code === codeValue);
    }

    getResumeByUser(rowUser){
        const objResult = {};
        const items = []; 
        let totalVal = 0;
        //caso especial casa 15
        if(rowUser[Constants.HOUSE_LABEL] === "CASA 15"){
            const pendingVal = 50;
            totalVal += pendingVal;
            items.push({ 
                "year"      : "2019",
                "month"     : "Febrero",
                "pendingVal": pendingVal
            });
        }

        if(rowUser[Constants.HOUSE_LABEL] === "CASA 11"){
            const pendingVal = 2050;
            totalVal += pendingVal;
            items.push({ 
                "year"      : "Anteriores",
                "month"     : "Directivas",
                "pendingVal": pendingVal
            });
        }


        for(var i in rowUser){
            if(i === Constants.NAME_LABEL || i === Constants.HOUSE_LABEL){
                objResult[i] = rowUser[i];
            }else{
                const monthVal = this.getMothByCode(i);
                let valAlicouta = objResult[Constants.HOUSE_LABEL] === Constants.LOCAL_LABEL ? 60: 50;
                if(monthVal.month === Constants.MONTH_DOUBLE_ALIQUOT_NAME){
                    valAlicouta = objResult[Constants.HOUSE_LABEL] === Constants.LOCAL_LABEL ? 120 : 100;
                }    
                if(rowUser[i] < valAlicouta){
                    const pendingVal = valAlicouta - rowUser[i];
                    totalVal += pendingVal;
                    items.push({ 
                        "year"      : monthVal.year,
                        "month"     : monthVal.month,
                        "pendingVal": pendingVal
                    });
                }
                if(monthVal.year === this.currentYear && monthVal.month === this.currentMonth){
                    objResult[Constants.TOTAL_REP_LABEL] = totalVal;
                    break;   
                }
            }
        }
        objResult[Constants.PENDINGS_REP_LABEL] = items;
        return objResult;
    }

    generateMessageAllPendings(){
        const messages = [];
        this.jsonXlsAlicuotas.forEach(element => {
            if(element[Constants.NAME_LABEL]){
                const rowResult = this.getResumeByUser(element);
                const message = Util.generateMesage(rowResult, element[Constants.HOUSE_LABEL], this.cutoffDate, 0);
                messages.push(element[Constants.HOUSE_LABEL] + "|" +message);
            }
        });
        return messages;
    }

    //type 0-> whatsapp 1->Mail
    generateMessagePendingByHouse(house, type){
        const rowByHoue = this.jsonXlsAlicuotas.find(row => (row[Constants.HOUSE_LABEL]  === house));
        const rowResult = this.getResumeByUser(rowByHoue);
        const message = Util.generateMesage(rowResult, house, this.cutoffDate, type);
        return message;
    }

    validateFromNumber(from){
        const regNumbers =   this.jsonXlsCellNumbers.find(row => (row[Constants.SHT_TELF_CELL1_LABEL] === from || row[Constants.SHT_TELF_CELL2_LABEL] === from));
        return regNumbers;
    }

    generateDetailPaysMessages(house){
        let message;
        const incomeByHouse =   this.jsonXlsIncome.filter(row => (row[Constants.SHT_INC_HOUSE_LABEL] === house));
        console.log("###########################");
        //console.log(incomeByHouse);
        if(Object.keys(incomeByHouse).length === 0){
            message = Util.generateDetailMesageVoid(house, this.cutoffDate);
        }else{
            message = Util.generateDetailCompleteMesage(house, incomeByHouse, this.cutoffDate)
        }
        return message;
    }


}

module.exports = PendingAliquots;