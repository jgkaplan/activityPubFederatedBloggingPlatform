const config = require('./config.js');
const spdy = require('spdy');
const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const session = require('express-session');
const favicon = require('serve-favicon');
// const MongoStore = require('connect-mongo')(session);
const compression = require('compression');
// const db = require('monk')(config.dbLocation);
const { generateKeyPair } = require('crypto');
const cors = require('cors');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
passport.use(new LocalStrategy({
    passReqToCallback: true
},function(req, username, password, done){
    // return done(null, {id:'wowow',name:'Josh'});
    Users.findOne({username: username}).then((doc) => {
        if(doc == null){
            // req.flash('message', {"error": 'Login Failed'});
            return done(null, false);
            // return done(null, false, {message: {"error": 'Login Failed'}});
        }
        var hash = doc.password;
        bcrypt.compare(password, hash).then((res) => {
            if(res == false){
                // req.flash('message', {"error": 'Login Failed'});
                return done(null, false);
                // return done(null, false, {message: {"error": 'Login Failed'}});
            }else{
                delete doc.password; // might not be necessary
                return done(null, doc);
            }
        }).catch((err) => {
            return done(err);
        });
    }).catch((err) => {
        return done(err);
    });
}));

// passport.use('local-signup', new LocalStrategy({
//     passReqToCallback: true
// },
//     function(req, username, password, done){
//         if(config.restrictedNames.some((prefix) => {return username.toLowerCase().startsWith(prefix)})){
//             // req.flash('message', {'error': 'Restricted username'});
//             return done(null, false);
//         }
//         Users.findOne({username: username}).then((doc) => {
//             if(doc != null){
//                 // req.flash('message', {"error": 'User already exists'});
//                 return done(null, false);
//                 // return done(null, false, {message: {"error": 'User already exists'}});
//             }else{
//                 bcrypt.hash(password, 8, function(err, hash){
//                     if(err) return done(err);
//                     Users.insert({
//                         username: username,
//                         password: hash
//                     }, function(err, user){
//                         return done(err, user);
//                     });
//                 });
//             }
//         }).catch((err) => {
//             return done(err);
//     });
// }));

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  Users.findOne({_id: id}, '-password', function(err, user){
      done(err, user);
  });
});

const app = express();

app.use(compression());

// app.use(favicon(config.favicon));

app.use(bodyParser.json({type: 'application/activity+json'}));
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(session({
//     secret: config.sessionSecret,
//     saveUninitialized: false,
//     resave: false,
//     store: new MongoStore({
//         url: config.dbLocation
//     })
// }));
// app.use(passport.initialize());
// app.use(passport.session());

app.get('/', (req, res) => {
    res.end("meow");
});

app.options('/.well-known/webfinger', cors());

app.get('/.well-known/webfinger', cors(), (req, res) => {
    let queryString = req.query.resource;
    
});

app.get('/signup', (req, res) => {});

app.get('/login', (req, res) => {});

app.post('/signup', (req, res) => {
    // generateKeyPair('rsa',  {
    //     modulusLength: 4096,
    //     publicKeyEncoding: {
    //         type: 'spki',
    //         format: 'pem'
    //     },
    //     privateKeyEncoding: {
    //         type: 'pkcs8',
    //         format: 'pem',
    //         cipher: 'aes-256-cbc',
    //         passphrase: config.privateKeyPassphrase
    //     }
    // }, (err, publicKey, privateKey) => {
    //     // Handle errors and use the generated key pair.
    //     res.end(publicKey);
    // });
});

app.post('/login', (req, res) => {});

app.get('/settings', (req, res) => {});

app.get('/dashboard', (req, res) => {});

app.get('/followers', (req, res) => {});

app.get('/following', (req, res) => {});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});


//catch 404. this needs to be the last route
app.all('*', (req,res) => {
    res.status(404).end('404');
});
// app.use((req,res,next) => {
//     res.status(404).end('404');
// });

const options = {
    key: fs.readFileSync(config.serverKey),
    cert:  fs.readFileSync(config.serverCert)
};

spdy.createServer(options, app).listen(config.httpsPort, function(err){
    if(err){
        console.error(err);
        return process.exit(1);
    }
    console.log(`Listening on port: ${config.httpsPort}`);
});
