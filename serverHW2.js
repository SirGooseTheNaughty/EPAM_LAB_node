#!/usr/bin/env node

const http = require('http');
const url = require('url');
const fs = require("fs");
const port = 8080;
const dbName = "names.json";

let names = "";
let db = [];
if (fs.existsSync(dbName)) {
    db = JSON.parse(fs.readFileSync(dbName, "utf8"));
    console.log(">>> db read from file:", db);
}

const requestHandler = (request, response) => {
    // Greeting
    let resMsg = 'Move along';
    if (request.headers['iknowyoursecret'] == "TheOwlsAreNotWhatTheySeem") {
        const queryObject = url.parse(request.url, true).query;

        if (queryObject.name) {
            db.push({
                name: queryObject.name,
                ip: request.connection.remoteAddress
            });
            fs.writeFile(dbName, JSON.stringify(db), (err) => {
                if (err) {
                    throw err;
                }
            });
        }
        
        db.forEach(entry => names += `, ${entry.name}`);
        resMsg = `Hello${names}!\n`;
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