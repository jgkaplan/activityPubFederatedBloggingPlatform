#!/usr/bin/env bash

# Make
sudo apt-get install build-essential

# Node
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs

# Caddy
curl https://getcaddy.com | bash -s personal http.cors,http.ratelimit

# MongoDB
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo service mongod start

# Cassandra
echo "deb http://www.apache.org/dist/cassandra/debian 311x main" | sudo tee -a /etc/apt/sources.list.d/cassandra.sources.list
curl https://www.apache.org/dist/cassandra/KEYS | sudo apt-key add -
sudo apt-get update
sudo apt-get install cassandra
sudo service cassandra start
echo "CREATE KEYSPACE IF NOT EXISTS activitypubbloggingplatform WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 }; quit;" | cqlsh
#TODO update config in /etc/cassandra/cassandra.yaml

# Install node packages
cd /vagrant
npm install
npm install -g @vue/cli
npm install -g elm
npm install --global uglify-js
