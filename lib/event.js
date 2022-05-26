const dayjs = require('dayjs');
const fs = require('fs');

module.exports = class Event{

    constructor(scheduleRow, taskName){
        this.taskName = taskName;
        this.y = scheduleRow.y;
        this.page = scheduleRow.page;
        this.rowString = scheduleRow.string;
        this.parseDay();
    }

    static taskName;
    
    parseDay = () => {
        let workHours;

        /* Fetches the date in the beginnig of the string */
        this.day = this.rowString.substring(0, 10) + " ";

        /* Fetches the timestamps at the end of the string */
        workHours = this.rowString.match(/([0-9][0-9]?:[0-9][0-9]?)/g)
        
        /* removes the date from the string */
        this.description = this.rowString.replace(/^([0-9]+-[0-9]+-[0-9]+) ([a-ö]+)/g, ' ')

        /* Remoes the timestamps from the string so that we are left with only description*/
        this.description = this.rowString.replace(/([0-9][0-9]?:[0-9][0-9]?)/g, ' ');

        this.title = this.taskName
        this.startTime = dayjs(new Date(this.day + workHours[0])).format("YYYY-M-D-H-m")
        this.endTime = dayjs(new Date(this.day + workHours[1])).format("YYYY-M-D-H-m")
        this.totalTime = workHours[2]
    }


}