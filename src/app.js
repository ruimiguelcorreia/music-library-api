const express = require('express');

const app = express();

const artistControllers = require('./controllers/artists');
const albumControllers = require('./controllers/albums');
const songControllers = require('./controllers/songs');

app.use(express.json());

// Artists Routes

app.post('/artists', artistControllers.create);

app.get('/artists', artistControllers.list);

app.get('/artists/:id', artistControllers.find);

app.patch('/artists/:id', artistControllers.patch);

app.delete('/artists/:id', artistControllers.delete);

// Albums Routes

app.post('/artists/:id/albums', albumControllers.create);

app.get('/albums', albumControllers.list);

app.get('/albums/:albumId', albumControllers.find);

app.patch('/albums/:albumId', albumControllers.update);

app.delete('/albums/:albumId', albumControllers.delete);

// Songs Routes

app.post('/albums/:albumId/song', songControllers.create);

app.get('/songs', songControllers.list);

app.get('/songs/:songId', songControllers.find);

module.exports = app;
