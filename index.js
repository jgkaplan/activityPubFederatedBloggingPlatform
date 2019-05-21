const config = require('./config.js');
// const spdy = require('spdy');
const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
// const session = require('express-session');
// const favicon = require('serve-favicon');
// const MongoStore = require('connect-mongo')(session);
const compression = require('compression');
// const db = require('monk')(config.dbLocation);
const { generateKeyPair } = require('crypto');
// const cors = require('cors');
const jwt  = require('jsonwebtoken');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJWT;
const bcrypt = require('bcrypt');

function jwtIsNotLoggedOut(jwt){
    //TODO: check if account has been logged out
    return true;
}

// passport.use('login', new LocalStrategy({
//     passReqToCallback: true,
//     session: false
// },function(req, username, password, done){
//     // return done(null, {id:'wowow',name:'Josh'});
//     Users.findOne({username: username}).then((doc) => {
//         if(doc == null){
//             // req.flash('message', {"error": 'Login Failed'});
//             return done(null, false, {message: 'Invalid username or password'});
//             // return done(null, false, {message: {"error": 'Login Failed'}});
//         }
//         var hash = doc.password;
//         bcrypt.compare(password, hash).then((res) => {
//             if(res == false){
//                 // req.flash('message', {"error": 'Login Failed'});
//                 return done(null, false, {message: 'Invalid username or password'});
//                 // return done(null, false, {message: {"error": 'Login Failed'}});
//             }else{
//                 delete doc.password; // might not be necessary
//                 return done(null, doc);
//             }
//         }).catch((err) => {
//             return done(err);
//         });
//     }).catch((err) => {
//         return done(err);
//     });
// }));

// passport.use('local-signup', new LocalStrategy({
//     session: false
// },
//     function(username, password, done){
//         if(config.restrictedNames.some((prefix) => {return username.toLowerCase().startsWith(prefix)})){
//             // req.flash('message', {'error': 'Restricted username'});
//             return done(null, false, {message: 'Restricted username'});
//         }
//         Users.findOne({username: username}).then((doc) => {
//             if(doc != null){
//                 // req.flash('message', {"error": 'User already exists'});
//                 return done(null, false, {message: 'User already exists'});
//                 // return done(null, false, {message: {"error": 'User already exists'}});
//             }else{
//                 bcrypt.hash(password, 12).then((hash) => {
//                     Users.insert({
//                         username: username,
//                         password: hash
//                     }, function(err, user){
//                         return done(err, user);
//                     });
//                 }).catch((err) => {
//                     return done(err);
//                 });
//             }
//         }).catch((err) => {
//             return done(err);
//     });
// }));

// passport.use('jwt', new JWTStrategy({
//     jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('jwt'),
//     secretOrKey: config.sessionSecret
// },
// function(jwtpayload, done){
//
// }));

// passport.serializeUser(function(user, done) {
//     done(null, user._id);
// });
//
// passport.deserializeUser(function(id, done) {
//   Users.findOne({_id: id}, '-password', function(err, user){
//       done(err, user);
//   });
// });

const app = express();

// app.use(compression());

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


// app.options('/.well-known/webfinger', cors());

// cors
app.get('/.well-known/webfinger', (req, res) => {
    let resource = req.query.resource;
    if (!resource || !resource.includes('acct:')) {
        return res.status(400).send('Bad request. Please make sure "acct:USER@DOMAIN" is what you are sending as the "resource" query parameter.');
    }
    else {
        let name = resource.replace('acct:','');
        Users.findOne({username: name}).then((doc) => {
            if(doc != null){
                res.json(JSON.parse(doc.webfinger));
            }else{
                return res.status(404).send(`No record found for ${name}.`);
            }
        }).catch((err) => {
            return res.status(500).send(`Error.`);
        });
    }
});

app.get('/blog', (req, res) => {
    //check host name for user
    //lookup that user's blog code
    //serve that
    console.log(req.hostname);
    
});

app.get('/api/posts', (req, res) => {

});

app.post('/api/signup', (req, res) => {
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

app.post('/api/login', (req, res) => {
    res.end('meow');
});

app.post('/api/logout', (req, res) => {
    req.logout();
    // res.redirect('/');
});

app.post('/api/makePost', (req, res) => {
    // maybe don't include this, and instead have the client post to /:username/outbox
});

app.get('/:username/inbox', (req, res) => {
    // check if user exists
    // check if user is the one logged in
    // 403 Forbidden
});

app.post('/:username/inbox', (req, res) => {
    // check if user exists
});

app.get('/:username/outbox', (req, res) => {
    // check if user exists
});

app.post('/:username/outbox', (req, res) => {
    // check if user exists
    // check if user is the one logged in
    // also post to the inbox of the target
    // 403 Forbidden
});


//catch 404. this needs to be the last route
app.all('*', (req,res) => {
    res.status(404).end('404');
});
// app.use((req,res,next) => {
//     res.status(404).end('404');
// });

// const options = {
//     key: fs.readFileSync(config.serverKey),
//     cert:  fs.readFileSync(config.serverCert)
// };

// spdy.createServer(options, app).listen(config.httpsPort, function(err){
//     if(err){
//         console.error(err);
//         return process.exit(1);
//     }
//     console.log(`Listening on port: ${config.httpsPort}`);
// });

app.listen(config.httpPort, function(){
    console.log(`Listening on port: ${config.httpPort}`);
});
