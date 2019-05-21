Running with Vagrant
====================
Install Vagrant
clone this repositore
`cd` into the directory with this repository
run `vagrant up`
and `vagrant ssh` to enter the development enviroment
In the vagrant machine, `cd /vagrant` to get to the source files.

Halt the vagrant machine with `vagrant halt`, , and restart it with `vagrant up`.

Completely remove the vagrant machine and free up all resources associated with it with `vagrant destroy`

Run `caddy` to start the caddy server (on port 8000),
and `node .` to start the node server (on port 3000).
Run `npm run serve` to start the Vue.js development server (on port 8080).

Requirements
============
Potentially openssl if you want to generate a server certificate yourself

Or LetsEncrypt

Mongodb

Before running
==============
Download caddy with http.cors, http.cache, http.ratelimit

run `npm install`
and `npm install -g @vue/cli`

Create a server certificate by running the following commands
```
openssl req -nodes -new -x509 -keyout server.key -out server.crt
```
Change the config to have a new session secret and db location

Start up mongodb with `mongod`
