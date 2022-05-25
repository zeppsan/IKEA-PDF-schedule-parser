# IKEA Schedule converter
I got my schedule in a pdf format which got me thinking, why not automate the process of putting it into the calendar? This is the IKEA schedule parser, it converts an IKEA schedule to .ics format. 

## How to use

Import the ikeashedule package and use like this:

    const ikeaSchedule = require('ikeaschedule');
	const outputFilePath = ikeaSchedule.convertToIcs('./schema.pdf', 'IKEA work',  './parsedSchedules/');
The parameters passed to the function is: 
1. The PDF schedule that you want to convert 
2. The title you want on your calendar event. 
3. The output folder. 



