const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const bcrypt = require('bcrypt');
const Database = require('arangojs').Database;
const aqlQuery = require('arangojs').aqlQuery;

const LocalStrategy = require('passport-local').Strategy;

const app = express();

//********Database stuff********
const db = new Database("db:8529"); //db url goes here
const users = db.collection("users");
// await users.create();
// db.graph(graphname);
// db.edgeCollection(collectionName)
// db.query(aql``).then(function(cursor) => {});

app.use(bodyParser.json({type: 'application/activity+json'}));
app.use(bodyParser.urlencoded({ extended: true }));

passport.use('login', new LocalStrategy({
    passReqToCallback: true,
    session: false
},function(req, username, password, done){
    //TODO: login
}));

passport.use('local-signup', new LocalStrategy({
    session: false
},
    function(username, password, done){
        if(config.restrictedNames.some((prefix) => {return username.toLowerCase().startsWith(prefix)})){
            // req.flash('message', {'error': 'Restricted username'});
            return done(null, false, {message: 'Restricted username'});
        }
        //TODO: sign up
    });
}));



//catch 404. this needs to be the last route
app.all('*', (req,res) => {
    res.status(404).end('404');
});

const server = app.listen(process.env.PORT);

process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  console.log('Closing http server.');
  server.close(() => {
    console.log('Http server closed.');
    db.close().then(() => {
        process.exit(0);
    });
  });
});
