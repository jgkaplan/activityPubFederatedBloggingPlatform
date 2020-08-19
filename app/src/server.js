import * as sapper from '@sapper/server';
import compression from 'compression';
const express = require('express');

const { PORT, NODE_ENV } = process.env;

const app = express();

app.use(
    compression({ threshold: 0 }),
    sapper.middleware()
);

app.listen(PORT, err => {
    if (err) console.log('error', err);
});
