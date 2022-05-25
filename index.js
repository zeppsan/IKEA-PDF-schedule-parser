const PDFExtract = require('pdf.js-extract').PDFExtract;
const pdfExtract = new PDFExtract();
const ics = require('ics')
const dayjs = require('dayjs');
const fs = require('fs');

/**
 * Converts an IKEA pdf schedule to ics format. 
 * @param {string} filepath path to the pdf 
 * @param {string} taskName title that will be displayed in calendar
 * @param {description} description event description in calendar
 * @param {string} output output folder path
 * @returns {string} ics filename 
 */
exports.convertToIcs = (schedule, taskName, description, output) => {

    let results = [];

    pdfExtract.extract(schedule, {}, (err, data) => {
        if (err) 
            return console.log(err);
        
        /* Scans all the pages for strings. Parses then into result array */
        data.pages.forEach(page => {
            page.content.forEach(content => {
                addToResult(results, content, page.pageInfo.num);
            })
        });
    
        /* Remove information that is not relevant */
        let regex = new RegExp(/[a-ö]$/)
        let regexTwo = new RegExp(/^[0-9][0-9][0-9][0-9]/)
        results = results.filter(x => !regex.test(x.string) && regexTwo.test(x.string));
    
        /* Parse the remaining information to correct event format */
        let workdays = [];
        results.forEach(res => {
            workdays.push(parseWorkDay(res.string, taskName, description)); 
        });
        
        /* Generate the ics and return filename */
        return generateIcs(workdays, output);
    });
}

/* Adds string to results list if it does not exist */
addToResult = (results, object, pageNum) => {

    /* If the value does not exist. Add it */
    let finder = results.find(x => Math.floor(x.y) == Math.floor(object.y) && x.page == pageNum);
    if(finder == undefined){
        results.push({
            y: Math.floor(object.y),
            page: pageNum,
            string: object.str
        });
    } else {
        finder.string += object.str
    }
}

/* Creates a workday object. */
parseWorkDay = (string, taskName) => { 

    let day, workHours, eventDescription, workours;

    /* Fetches the date in the beginnig of the string */
    day = string.substring(0, 10) + " ";

    /* Fetches the timestamps at the end of the string */
    workHours = string.match(/([0-9][0-9]?:[0-9][0-9]?)/g)
    
    /* removes the date from the string */
    eventDescription = string.replace(/^([0-9]+-[0-9]+-[0-9]+) ([a-ö]+)/g, ' ')

    /* Remoes the timestamps from the string so that we are left with only description*/
    eventDescription = eventDescription.replace(/([0-9][0-9]?:[0-9][0-9]?)/g, ' ');

    let workday = {
        day: day,
        title: taskName,
        description: eventDescription,
        startTime: dayjs(new Date(day + workHours[0])).format("YYYY-M-D-H-m"),
        endTime: dayjs(new Date(day + workHours[1])).format("YYYY-M-D-H-m"),
        totalTime: workHours[2]
    }

    return workday;
}

/* Generates the Ics file and returns the filename */
generateIcs = (events, output) => {
    let eventsArray = [];
    const fileName = Math.floor(Math.random() * 10000);

    /* Generates all the events based on the workdays passed in the events variable */
    events.forEach(event => {
        const newEvent = {
            start: event.startTime.split('-').map(x => parseInt(x)),
            end: event.endTime.split('-').map(x => parseInt(x)),
            title: event.title,
            description: event.description,
            status: "CONFIRMED"
        }
        eventsArray.push(newEvent);
    })

    /* Creates the ICS */
    ics.createEvents(eventsArray, (error, value) => {
        if (error) 
            return console.log(error);

        fs.writeFileSync(output+'/'+fileName+'.ics', value);
        return fileName + '.ics';
    });
}