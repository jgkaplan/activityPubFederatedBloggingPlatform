const config = require('./config.js');
// const db = require('monk')(config.dbLocation);
// const Users = db.get('users');

const crypto = require('crypto');
const generateRSAKeypair = require('generate-rsa-keypair');

const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['localhost'], localDataCenter: 'datacenter1', keyspace: 'activitypubbloggingplatform' });
// client.connect(function (err) {
//   assert.ifError(err);
// });

await client.connect();

//Create tables
const createTablesQueries = [
    {
        query: 'CREATE TABLE IF NOT EXISTS users ( \
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
    },{
        query: 'CREATE TABLE IF NOT EXISTS posts ( \
            id timeuuid PRIMARY KEY, \
            type text \
            contents text, \
            title text, \
            image text \
            audio text, \
            video text, \
            sensitive bool \
        )'
    }
]
await client.batch(createTablesQueries);

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
            let query = 'SELECT * FROM users WHERE username=?';
            return client.execute(query, [username], {prepare: true}).then(result => {return result.first();});
        },
        addUser: (username, email, password) => {
            let query = 'INSERT INTO users (userid, username, password, email, privkey, pubkey, webfinger, actor, )'
        }
    },
    shutdown: () => {await client.shutdown();}
}
