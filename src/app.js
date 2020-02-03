const express = require('express');

const app = express();

const artistControllers = require('./controllers/artists');

app.use(express.json());

app.post('/artists', artistControllers.create);

app.get('/artists', artistControllers.list);

app.get('/artists/:id', artistControllers.find);

app.patch('/artists/:id', artistControllers.patch);

app.delete('/artists/:id', artistControllers.delete);

module.exports = app;
