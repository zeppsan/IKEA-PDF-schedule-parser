const Event = require('./event');

module.exports = class Schedule{

    constructor(scheduleData, taskName){
        this.taskName = taskName;
        this.scheduleData = scheduleData;
        this.scheduleObjects = [];
        this.parseData();
        this.cleanData();
        this.createEvents();
    }

    parseData = () => {
        this.scheduleData.pages.forEach(page => {
            page.content.forEach(content => {
                this.parseScheduleObject(content, page.pageInfo.num);
            })
        });
    }

    cleanData = () => {
        let regex = new RegExp(/[a-ö]$/)
        let regexTwo = new RegExp(/^[0-9][0-9][0-9][0-9]/)
        this.scheduleObjects = this.scheduleObjects.filter(x => !regex.test(x.string) && regexTwo.test(x.string));
    }

    parseScheduleObject(object, pageNum){
        /* If the value does not exist. Add it */
        let finder = this.scheduleObjects.find(x => Math.floor(x.y) == Math.floor(object.y) && x.page == pageNum);
        if(finder == undefined){
            this.scheduleObjects.push({
                y: Math.floor(object.y),
                page: pageNum,
                string: object.str
            });
        } else {
            finder.string += object.str
        }
    }

    createEvents = () => {
        this.workdays = this.scheduleObjects.map(eventRow => new Event(eventRow, this.taskName));
    }

    lenght = () => this.scheduleObjects.length

    events = () => this.workdays
    

}