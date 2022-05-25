### Features

I got my schedule in a pdf and created this converter that creates an ics file frmo a pdf. 

# IKEA PDF schedule parser

This converter can be run with node.js.

Example: 

    const ics = require('./index');
	const outputFilePath = ics.convertToIcs('./schema.pdf', 'IKEA work', 'Västerås warehouse', './');

    
The parameters are:
*PDF path*, *Calendar event title*, *Calendar event description*, *Output folder*

