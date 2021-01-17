const { request, response } = require("express");
const express = require("express");
const url = require('url');
const fs = require("fs");
const app = express();
const bodyParser = require("body-parser");

const dbName = "names.json";

let names = "";
let db = [];
if (fs.existsSync(dbName)) {
    db = JSON.parse(fs.readFileSync(dbName, "utf8"));
}

app.use(bodyParser.json());

app.use("/", (request, response, next) => {
    if (request.method === "GET") {
        response.end("You should be using POST request with an appropriate header");
    }
    next();
});

app.post("/", (request, response, next) => {
    if (request.headers['iknowyoursecret'] == "TheOwlsAreNotWhatTheySeem") {
        console.log('He (she) may pass.');
        next();
    } else {
        response.end("You should provide a pass-phrase");
    }
});

app.post("/", (request, response, next) => {
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
        
        db.forEach(entry => names += `, ${entry.name}`);
        resMsg = `Hello, ${queryObject.name}!\nFull userlist can be found at /userlist.`;
        response.end(resMsg);
    } else {
        response.end("You should introduce yourself");
    }
});

app.post("/userlist", (request, response, next) => {
    let resMsg = '';
    db.forEach(entry => resMsg += `Name: ${entry.name}, ip: ${entry.ip}\n`);
    response.end(resMsg);
});

app.listen(8080, console.log("Server is listening on port 8080"));