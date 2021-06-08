const fs = require('fs');
const xlsx = require('xlsx');
const loadJsonFile = require('load-json-file');

const getWorkSheetJsonFromFile = (filePath, sheetName) => {
    if(!fs.existsSync(filePath)){
        return null;
    }
    return xlsx.utils.sheet_to_json(xlsx.readFile(filePath).Sheets[sheetName]);
};

const getConfigJsonFile = (jsonPath) => {
    return new Promise((resolve, reject) => {
        loadJsonFile(jsonPath)
        .then(jsonTest => {
            resolve(jsonTest)
        }).catch(error => {
            reject(error);
        });
    });
}

module.exports = {
    getWorkSheetJsonFromFile,
    getConfigJsonFile
};