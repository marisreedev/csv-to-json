const fs = require('fs');
const csv = require('csv-parser');
const csvFilePath = 'data.csv';  // Add csv file path here

const jsonData = [];

fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {

        jsonData.push(row);
    })
    .on('end', () => {

        const language_name = "Afrikaans"   // udpate the language name, It must be equal to csv header name 
        const file_name = `${language_name}.json`
        const jsonString = JSON.stringify(jsonData, null, 2);

        let data = JSON.parse(jsonString)
        let result = {};

        function createNestedObjects(dataArray) {
            console.log("dataArray ", dataArray)
            const result = {};
            dataArray.forEach(obj => {
                const keys = obj.KEY.toLowerCase();
                const value = obj[language_name];             //
                const keyParts = keys.split('.');

                let temp = result;
                for (let i = 0; i < keyParts.length - 1; i++) {
                    temp = temp[keyParts[i]] = temp[keyParts[i]] || {};
                }
                temp[keyParts[keyParts.length - 1]] = value;
            });
            return result;
        }

        const nestedObject = createNestedObjects(data);

        fs.writeFile(file_name, JSON.stringify(nestedObject), (err) => {
            if (err) {
                console.error('Error writing JSON file:', err);
            } else {
                console.log('JSON file has been created successfully.');
            }
        });
    });

