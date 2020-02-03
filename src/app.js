const express = require('express');

const app = express();

const artistControllers = require('./controllers/artists');

app.use(express.json());

app.post('/artists', artistControllers.create);

app.get('/artists', artistControllers.find);

module.exports = app;
