const { request, response } = require("express");
const express = require("express");
const url = require('url');
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const BearerStrategy = require("passport-http-bearer");
const jwt = require('jsonwebtoken');
const bodyParser = require("body-parser");
const app = express();

mongoose.connect("mongodb://localhost:27017", {
    useNewUrlParser: true,
});
const UserSchema = mongoose.Schema({name: String, pwd: String, jwt: String});
const User = mongoose.model("Users", UserSchema);

const privateKey = "asdfghjkl";

const localStrategy = new LocalStrategy(
    { usernameField: "username", passwordField: "pwd" },
    (username, password, done) => {
        User.find({ name: username })
            .exec()
            .then((foundUsers) => {
                if (!foundUsers || !foundUsers.length) {
                    done("Not found");
                } else {
                    done(null, foundUsers[0]);
                }
            });
    }
);
const bearerStrategy = new BearerStrategy((token, done) => {
    User.findOne({ jwt: token })
        .exec()
        .then((foundUser) => {
            if (foundUser) {
                done(null, foundUser);
            }
            else {
                done('Invalid token');
            }
    });
});

passport.serializeUser((user, done) => {
    const token = jwt.sign(
        { username: user.name },
        privateKey
    );
    User.updateOne({ name: user.name }, { jwt: token }, (err, updatedUser) => {
        done(null, updatedUser);
    })
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

app.use(bodyParser.json());
passport.use("local", localStrategy);
passport.use("bearer", bearerStrategy);
app.use(passport.initialize());

app.post("/token", passport.authenticate("local", {
    successRedirect: "/success",
    failureRedirect: "/failure",
}));

app.use("/", passport.authenticate("bearer", { session: false }), (request, response, next) => {
    if (request.method === "GET") {
        response.end("You should be using POST request with an appropriate header");
    }
    next();
});

app.post("/", (request, response) => {
    User.find({ name: request.body.username })
        .exec()
        .then(foundUser => {
            if (!foundUser || !foundUser.length) {
                const user = new User({ name: request.body.username, pwd: request.body.pwd });
                user.save((error, savedUser) => {
                    if (error) {
                        throw error;
                    }
                    console.log(`User ${savedUser.name} has joind with a pwd ${savedUser.pwd}. Data is saved.`);
                    response.end(`Hello, ${savedUser.name}!\nYou can see full userlist at /userlist`);
                }); 
            } else {
                console.log(`User ${request.body.username} has joind with a pwd ${request.body.pwd} without saving`);
                response.end(`Hello, ${request.body.username}!`);
            }
        });
});

// для добавления пользователей вручную
app.post("/adduser", (request, response) => {
    User.find({ name: request.body.username })
        .exec()
        .then(foundUser => {
            if (!foundUser || !foundUser.length) {
                const user = new User({ name: request.body.username, pwd: request.body.pwd });
                user.save((error, savedUser) => {
                    if (error) {
                        throw error;
                    }
                    console.log(`User ${savedUser.name} has joind with a pwd ${savedUser.pwd}. Data is saved.`);
                    response.end(`Hello, ${savedUser.name}!\nYou can see full userlist at /userlist`);
                }); 
            } else {
                console.log(`User ${request.body.username} has joind with a pwd ${request.body.pwd} without saving`);
                response.end(`Hello, ${request.body.username}!`);
            }
        });
});

app.post("/userlist", passport.authenticate("bearer", { session: false }),  (request, response, next) => {
    let resMsg = 'Full userlist:\n';
    User.find({}, (err, users) => {
        users.forEach(entry => resMsg += `Name: ${entry.name}, pwd: ${entry.pwd}, jwt: ${entry.jwt}\n`);
        response.end(resMsg);
    });
});

app.listen(8080, () => {
    console.log("Server is listening on port 8080");

    User.find({})
      .exec()
      .then((db) => {
        console.log(`In the database now ${db.length} users:\n`, db.map((user) => user.name + '\t\t' + user.pwd + '\t\t' + user.jwt).join('\n'))
      });
});