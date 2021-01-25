const { request, response } = require("express");
const express = require("express");
const url = require('url');
const mongoose = require("mongoose");
const app = express();

mongoose.connect("mongodb://localhost:27017");
const UserSchema = mongoose.Schema({name: String, ip: String});
const User = mongoose.model("Users", UserSchema);

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
    console.log(queryObject.name);
    
    if (queryObject.name) {
        const user = new User({ name: queryObject.name, ip: request.connection.remoteAddress });
        user.save((error, savedUser) => {
            if (error) {
                throw error;
            }
            console.log(`User ${savedUser.name} has joind with an ip ${savedUser.ip}`);
            response.end("Your data is saved\nYou can see full userlist at /userlist");
        }); 
    } else {
        response.end("You should introduce yourself");
    }
});

app.post("/userlist", (request, response, next) => {
    let resMsg = 'Full userlist:\n';
    User.find({}, (err, users) => {
        users.forEach(entry => resMsg += `Name: ${entry.name}, ip: ${entry.ip}\n`);
        response.end(resMsg);
    });
});

app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});