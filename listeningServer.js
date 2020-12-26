const http = require('http');
const url = require('url');
const port = 8080;

const requestHandler = (request, response) => {
    // Greeting
    let username = url.parse(request.url, true).query.name;
    username ? true : username = "unnamed person";

    // What type of request is recieved
    let message = `Got a ${request.method} request.`;

    // Does it know anything about how to save the world?
    if (request.rawHeaders[0] === 'WhatWillSaveTheWorld') {
        message += ` It says that love will save the world!`;
    } else {
        message += ` It doesn't say anything about saving the world :(`;
    }

    console.log(message);
    response.end(`Hello, ${username}!\n`);
}

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
    if(err) {
        return console.log('The exception happened', err);
    }

    console.log(`Server is listening on ${port}`);
})