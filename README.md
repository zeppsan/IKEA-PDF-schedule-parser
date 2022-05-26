# IKEA Schedule converter
I got my schedule in a pdf format which got me thinking, why not automate the process of putting it into the calendar? This is the IKEA schedule parser, it converts an IKEA schedule to .ics format. 

## How to use

This package takes a .pdf buffer and transforms it into an .ics buffer. Below is an example execution where the file schema.pdf is converted to a buffer and passed to the IKEAScheduleConverter. The result from the Promise is the .ics buffer. 

```js
const IKEAScheduleConverter = require('./index')
const fs = require('fs');

fs.readFile('./schema.pdf', (err, data) => {

    IKEAScheduleConverter.convertToIcs(data, 'IKEA Work')
    .then(resultBuffer => {
        fs.writeFile('./schema.ics', resultBuffer, {}, (err) => {
            if(err)
                console.log(err);
        })
    })

})
```

The parameters passed to the function is: 
1. The PDF schedule buffer
2. The title you want on your calendar event. 


