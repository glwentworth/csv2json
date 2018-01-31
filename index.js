/*
 * small bit of code to take a csv file name from the command line then convert 
 * that file to json format.
 * Assumptions:  
 *   1- the incoming file name e.g. fname.ext is used to generate 
 *      the output file name fname.json.  
 *   2- the output file is created alongside the 
 *      input file.   
 *   3- does not generate nested json 
 * 
 * 2018 jan. 29
 * built in vscode on windows 10
 * 
 * Copyright 2018 G. L. Wentworth
 */

const fs = require('fs')
const path = require('path')
const csv = require('csvtojson')

let fileroot = process.argv[2]
console.log('Converting ',fileroot, ' to json format')

let pathparts = path.parse(fileroot)
//console.log('path parts: ', pathparts)

let base = path.basename(fileroot, pathparts['ext'])
//console.log ('basename is: ',base)

var tofile = path.join(pathparts['dir'],pathparts['name']+'.json')
console.log('Output json goes into ', tofile)

var outs = fs.createWriteStream(tofile)
outs.on('error', (err) => {
    console.log('out stream error writing: '+err)
})
outs.on('finish', () => {
    console.log('out stream file complete')
})

let firstobj = 0;
csv({flatKeys:true})
.fromFile(fileroot)
.on('json', (jsonobj, csvrow) => {
    //console.log('csv row: ', csvrow, 'json item to write: ', jsonobj)
    //console.log('json obj string: '+JSON.stringify(jsonobj))
    if (!firstobj) {
        //console.log("first csv item");
        firstobj = 1;
        outs.write("[\n");
    }
    outs.write(JSON.stringify(jsonobj)+'\n')
})
.on('error', (err) => {
    console.log('csv conversion error: ',err)
})
.on('done', (err) => {
    outs.write("]\n")
    console.log('CSV conversion to JSON complete')
})

