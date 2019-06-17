const config = require('./config.js');

const crypto = require('crypto');
const generateRSAKeypair = require('generate-rsa-keypair');

// const mysql = require('mysql');
const mysqlx = require('@mysql/xdevapi');

const NUM_POSTS_PER_REQUEST = 30;

const postTypes = {
    TEXT: 0,
    IMAGE: 1,
    GIFSET: 3,
    AUDIO: 4,
    VIDEO: 5,
    QUOTE: 6,
    LINK: 7
}

const DB_NAME = 'activitypubbloggingplatform';

// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : 'mysqlRootPassword',
//   // database : 'my_db'
// });

// connection.connect();

const client = mysqlx.getClient(
    { host: 'localhost'
    , user: 'main'
    , password: 'user_password'
    },
    { pooling:
        { enabled: true
        , maxSize: 10
        }
    });

// function execute( sql, args ) {
//     return new Promise((resolve, reject) => {
//         connection.query(sql, args, (err, rows) => {
//             if(err)
//                 return reject(err);
//             resolve(rows);
//         });
//     });
// }

// client.execute('CREATE DATABASE IF NOT EXISTS ?', [DB_NAME]);

//Create tables
// let query = 'CREATE TABLE IF NOT EXISTS users ( \
//     userid INT AUTO_INCREMENT, \
//     username text PRIMARY KEY, \
//     password text, \
//     email text, \
//     privkey text, \
//     pubkey text, \
//     webfinger text, \
//     actor text, \
//     apikey text \
// )'
const createPostsQuery = `CREATE TABLE IF NOT EXISTS ${DB_NAME}.posts ( \
    postid BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE, \
    type TINYINT UNSIGNED NOT NULL, \
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, \
    contents TEXT NULL, \
    title VARCHAR(255), \
    image TEXT NULL, \
    audio TEXT NULL, \
    video TEXT NULL, \
    is_sensitive BOOLEAN DEFAULT FALSE, \
    is_explicit BOOLEAN DEFAULT FALSE, \
    PRIMARY KEY (postid) \
) CHARACTER SET utf8`;
// query = 'CREATE TABLE IF NOT EXISTS likes ( \
//     likeid timeuuid PRIMARY KEY, \
//     username text, \
//     postid timeuuid \
// )'
// client.execute(query);

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

module.exports = {
    Users: {
        // findUser: (username) => Users.findOne({username: username}),
        findUser: (username) => {
            // let query = 'SELECT * FROM users WHERE username=?';
            // return client.execute(query, [username], {prepare: true}).then(result => {return result.first();});
        },
        addUser: (username, email, password) => {
            // let query = 'INSERT INTO users (userid, username, password, email, privkey, pubkey, webfinger, actor, )'
            //TODO finish
        }
    },
    Posts: {
        addPost: async (type, title, contents) => {
            // let query = 'INSERT INTO posts (postid, createdAt, type, contents, title) VALUES (?, ?, ?, ?, ?)'
            let session = await client.getSession();
            let db = await session.getSchema(DB_NAME);
            let posts = await db.getTable('posts');
            let done = await posts.insert('postid', 'type', 'contents', 'title').values(null, type, contents, title).execute();
            return session.close();
            // let query = session.sql('INSERT INTO posts (postid, type, contents, title) VALUES (?, ?, ?, ?)').bind([null, type, contents, title]);
            // return query.execute();
            // return execute(query, [null, type, contents, title]);
        },
        getPosts: async (lastPostId) => {
            let session = await client.getSession();
            let db = await session.getSchema(DB_NAME);
            let posts = await db.getTable('posts');

            let query = posts.select('postid', 'createdAt', 'type', 'contents', 'title');
            if(lastPostId != null){
                query = query.where('postId < :id').bind('id', lastPostId);
            }
            const rows = [];
            return query.orderBy(['createdAt desc', 'postId desc']).limit(NUM_POSTS_PER_REQUEST).execute(row => {
                rows.push({postid: row[0], createdat: row[1], type: row[2], contents: row[3], title: row[4]});
            }).then((results) => {
                session.close();
                return rows;
            });
            // if(lastPostId == null){
            //     let query = 'SELECT postid, createdAt, type, contents, title FROM posts ORDER BY createdAt DESC LIMIT ?';
            //     return execute(query, [NUM_POSTS_PER_REQUEST]);
            // }else{
            //
            //     let query = 'SELECT postid, createdAt, type, contents, title FROM posts WHERE postId < ? ORDER BY postId DESC LIMIT ?';
            //     //TODO sort by createdAt and also grab the right posts properly
            //     return execute(query, [lastPostId, NUM_POSTS_PER_REQUEST]);
            // }
        }
    },
    Likes: {
        getLikes: (postId) => {
            // let query = 'SELECT * FROM likes WHERE postID=?';
            // return client.execute(query, [postId], {prepare: true}).then(result => {return result.rows;});
        }
    },
    init: async () => {
        let session = await client.getSession();
        let dbCreated = await session.sql(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`).execute();
        await session.sql(createPostsQuery).execute();
        return session.close();
    },
    shutdown: () => {return client.close();},
    postTypes: postTypes,
    NUM_POSTS_PER_REQUEST: NUM_POSTS_PER_REQUEST
}
