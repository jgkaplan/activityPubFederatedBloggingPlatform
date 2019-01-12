Requirements
============
Potentially openssl if you want to generate a server certificate yourself
Or LetsEncrypt
Mongodb

Before running
==============
Create a server certificate by running the following commands
```
openssl req -nodes -new -x509 -keyout server.key -out server.crt
```
Change the config to have a new session secret and db location

Start up mongodb with `mongod`
