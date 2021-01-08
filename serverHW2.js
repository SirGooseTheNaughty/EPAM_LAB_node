#!/usr/bin/env node

const http = require('http');
const url = require('url');
const fs = require("fs");
const port = 8080;
const dbName = "names.json";

let names = [];
if (fs.existsSync(dbName)) {
    names = JSON.parse(fs.readFileSync(dbName, "utf8"));
    console.log(">>> names read from file:", names);
}

const requestHandler = (request, response) => {
    // Greeting
    let resMsg = 'Move along';
    if (request.headers['iknowyoursecret'] == "TheOwlsAreNotWhatTheySeem") {
        const queryObject = url.parse(request.url, true).query;

        if (queryObject.name && !names.includes(`${queryObject.name}`)) {
            names.push(queryObject.name);
            fs.writeFile(dbName, JSON.stringify(names), (err) => {
                if (err) {
                    throw err;
                }
            });
        }

        resMsg = `Hello, ${names.join(", ")}!\n`;
    }

    response.end(resMsg);
}

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
    if(err) {
        return console.log('The exception happened', err);
    }

    console.log(`Server is listening on ${port}`);
})