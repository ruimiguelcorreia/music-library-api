const express = require('express');

const app = express();

const artistControllers = require('./controllers/artists');
const albumControllers = require('./controllers/albums');
const songControllers = require('./controllers/songs');

app.use(express.json());

app.post('/artists', artistControllers.create);

app.get('/artists', artistControllers.list);

app.get('/artists/:id', artistControllers.find);

app.patch('/artists/:id', artistControllers.patch);

app.delete('/artists/:id', artistControllers.delete);

app.post('/artists/:id/albums', albumControllers.create);

app.post('/album/:albumId/song', songControllers.create);

module.exports = app;
