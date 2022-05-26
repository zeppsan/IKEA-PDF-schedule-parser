const PDFExtract = require('pdf.js-extract').PDFExtract;
const pdfExtract = new PDFExtract();
const ics = require('ics')
const Schedule = require('./lib/schedule');
const fs = require('fs');

/**
 * @param {Buffer} schedule Buffer object of file.
 * @param {string} taskName title that will be displayed in calendar
 * @returns {string} ics filename 
 */
exports.convertToIcs = async (schedule, taskName) => new Promise((resolve, reject) => {
    if(!Buffer.isBuffer(schedule))
        throw "Buffer was not passed as first parameter"
    if(taskName.length < 1)
        throw "Missing task name as second parameter"

    pdfExtract.extractBuffer(schedule, {})
    .then((data) => {
        const schedule = new Schedule(data, taskName);
        resolve(generateIcs(schedule));
    })
    .catch(err => {
        reject(err)
    })
});


/* Generates the Ics file and returns the filename */
generateIcs = (schedule) => {
    if(schedule.events().length == 0)
        throw "No events found in schedule"

    let eventsArray = schedule.events().map(event => {
        return {
            start: event.startTime.split('-').map(x => parseInt(x)),
            end: event.endTime.split('-').map(x => parseInt(x)),
            title: event.title,
            description: event.description,
            status: "CONFIRMED"
        }
    })

    /* Creates the ICS */
    return createIceEvents(eventsArray);
}

function createIceEvents(eventsArray) {
    return ics.createEvents(eventsArray, (error, value) => {
        if (error)
            return console.log(error);
        
        return Buffer.from(value)
    });
}
