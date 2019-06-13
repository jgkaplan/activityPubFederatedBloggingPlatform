const config = require('./config.js');
// const db = require('monk')(config.dbLocation);
// const Users = db.get('users');

const crypto = require('crypto');
const generateRSAKeypair = require('generate-rsa-keypair');

// const cassandra = require('cassandra-driver');
// const client = new cassandra.Client({ contactPoints: ['localhost'], localDataCenter: 'datacenter1', keyspace: 'activitypubbloggingplatform' });
// const Uuid = cassandra.types.Uuid;
// const TimeUuid = cassandra.types.TimeUuid;
// client.connect(function (err) {
//   assert.ifError(err);
// });

const mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'me',
  password : 'secret',
  // database : 'my_db'
});

connection.connect();

const NUM_POSTS_PER_REQUEST = 30;

client.connect();

const postTypes = {
    TEXT: 'text',
    IMAGE: 'image',
    AUDIO: 'audio',
    VIDEO: 'video'
}

//Create tables
let query = 'CREATE TABLE IF NOT EXISTS users ( \
    userid timeuuid, \
    username text PRIMARY KEY, \
    password text, \
    email text, \
    privkey text, \
    pubkey text, \
    webfinger text, \
    actor text, \
    apikey text \
)'
client.execute(query);
query = 'CREATE TABLE IF NOT EXISTS posts ( \
    postid timeuuid, \
    type text, \
    contents text, \
    title text, \
    image text, \
    audio text, \
    video text, \
    sensitive boolean, \
    explicit boolean, \
    PRIMARY KEY (postid) \
)'
client.execute(query);
query = 'CREATE TABLE IF NOT EXISTS likes ( \
    likeid timeuuid PRIMARY KEY, \
    username text, \
    postid timeuuid \
)'
client.execute(query);

function createActor(name, domain, pubkey) {
  return {
    '@context': [
      'https://www.w3.org/ns/activitystreams',
      'https://w3id.org/security/v1'
    ],

    'id': `https://${domain}/u/${name}`,
    'type': 'Person',
    'preferredUsername': `${name}`,
    'inbox': `https://${domain}/api/inbox`,
    'followers': `https://${domain}/u/${name}/followers`,

    'publicKey': {
      'id': `https://${domain}/u/${name}#main-key`,
      'owner': `https://${domain}/u/${name}`,
      'publicKeyPem': pubkey
    }
  };
}

function createWebfinger(name, domain) {
  return {
    'subject': `acct:${name}@${domain}`,

    'links': [
      {
        'rel': 'self',
        'type': 'application/activity+json',
        'href': `https://${domain}/u/${name}`
      }
    ]
  };
}

function query( sql, args ) {
    return new Promise((resolve, reject) => {
        connection.query(sql, args, (err, rows) => {
            if(err)
                return reject(err);
            resolve(rows);
        });
    });
}

module.exports = {
    Users: {
        // findUser: (username) => Users.findOne({username: username}),
        findUser: (username) => {
            let query = 'SELECT * FROM users WHERE username=?';
            return client.execute(query, [username], {prepare: true}).then(result => {return result.first();});
        },
        addUser: (username, email, password) => {
            let query = 'INSERT INTO users (userid, username, password, email, privkey, pubkey, webfinger, actor, )'
            //TODO finish
        }
    },
    Posts: {
        addPost: (type, title, contents) => {
            // let query = 'INSERT INTO posts (postid, createdAt, type, contents, title) VALUES (?, ?, ?, ?, ?)'
            let query = 'INSERT INTO posts (postid, type, contents, title) VALUES (?, ?, ?, ?)'
            return client.execute(query, [TimeUuid.now(), type, contents, title], {prepare: true});
        },
        getPosts: (lastPostId) => {
            if(lastPostId == null){
                let query = `SELECT postid, toUnixTimestamp(postId) as createdAt, type, contents, title FROM posts ORDER BY postId DESC LIMIT ${NUM_POSTS_PER_REQUEST}`;
                return client.execute(query, [], {prepare: true}).then(result => {console.log(result.rows); return result.rows;});
            }else{
                let query = `SELECT postid, toUnixTimestamp(postId) as createdAt, type, contents, title FROM posts WHERE postId < ? ORDER BY postId DESC LIMIT ${NUM_POSTS_PER_REQUEST}`;
                //TODO sort by createdAt and also grab the right posts properly
                return client.execute(query, [lastPostId], {prepare: true}).then(result => {return result.rows;});
            }
        }
    },
    Likes: {
        getLikes: (postId) => {
            let query = 'SELECT * FROM likes WHERE postID=?';
            return client.execute(query, [postId], {prepare: true}).then(result => {return result.rows;});
        }
    },
    shutdown: (callback) => {client.end(callback);},
    postTypes: postTypes,
    NUM_POSTS_PER_REQUEST: NUM_POSTS_PER_REQUEST
}
