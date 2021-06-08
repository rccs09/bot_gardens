const FileManager = require('./fileManager');
const Constants = require('../config/constants');


class PendingAliquots{
    filePath;
    sheetName;
    monthsConf ;
    jsonXlsAlicuotas;
    currentMonth;
    currentYear;
    constructor(filePath, sheetName, currentYear, currentMonth){
        this.filePath = filePath;
        this.sheetName = sheetName;
        this.currentYear = currentYear;
        this.currentMonth = currentMonth;
    }
    
    async init(){
        this.monthsConf = await FileManager.getConfigJsonFile("./src/config/months.json");
        this.jsonXlsAlicuotas = FileManager.getWorkSheetJsonFromFile(this.filePath, this.sheetName);
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


    gerateAllPendingReport(){
        this.jsonXlsAlicuotas.forEach(element => {
            if(element[Constants.NAME_LABEL]){
                const rowResult = this.getResumeByUser(element);
               console.log(rowResult);
            }
        });
    }
    

}



module.exports = PendingAliquots;