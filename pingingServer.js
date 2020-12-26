const http = require('http');
const port = 8081;
const targetUrl = 'localhost';
const targetPort = 8080;

const getOptions = {
    hostname: targetUrl,
    port: targetPort,
    method: 'GET'
}

const postOptionsWithoutHeaders = {
    hostname: targetUrl,
    port: targetPort,
    method: 'POST'
}

const postOptionsWithHeaders = {
    hostname: targetUrl,
    port: targetPort,
    method: 'POST',
    headers: {
      'WhatWillSaveTheWorld': 'Love'
    }
}

const requestHandler = (request, response) => {
    console.log(`Accessed by url ${request.url}`);
    response.end(`We're now pinging`);
}

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
    if(err) {
        return console.log('The exception happened', err);
    }

    console.log(`Server is listening on ${port}`);
})

// Sending GET request
const getRequest = http.request(getOptions, res => {
    // console.log(`statusCode: ${res.statusCode}`)
  
    res.on('data', d => {
      process.stdout.write(d)
    })
})

getRequest.on('error', error => {
    console.error(error)
})

getRequest.end()

// Sending POST request without headers
const postRequestWO = http.request(postOptionsWithoutHeaders, res => {
    // console.log(`statusCode: ${res.statusCode}`)
  
    res.on('data', d => {
        process.stdout.write(d)
    })
})

postRequestWO.on('error', error => {
    console.error(error)
})

postRequestWO.end()

// Sending POST request without headers
const postRequestW = http.request(postOptionsWithHeaders, res => {
    // console.log(`statusCode: ${res.statusCode}`)
  
    res.on('data', d => {
        process.stdout.write(d)
    })
})

postRequestW.on('error', error => {
    console.error(error)
})

postRequestW.end()