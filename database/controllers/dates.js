const DateEntity = require("../index").DateEntity;

function createDates(datesArray) {
    return new Promise((resolve, reject) => {
        let dates = [];
        datesArray.forEach(date => {
            dates.push({
                date: date
            });
        });
        DateEntity.bulkCreate(dates, {
                returning: true
            })
            .then((dates) => {
                resolve(dates);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

module.exports = {
    createDates
};