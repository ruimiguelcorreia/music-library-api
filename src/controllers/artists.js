const Artist = require('../models/artist');

exports.create = (req, res) => {
  const artist = new Artist({
    name: req.body.name,
    genre: req.body.genre,
  });

  artist.save().then(() => {
    res.status(201).json(artist);
  });
};

exports.list = (req, res) => {
  Artist.find().then(artists => {
    res.status(200).json(artists);
  });
};

exports.find = (req, res) => {
  Artist.findOne({ _id: req.params.id }, (err, artist) => {
    if (!artist) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else {
      res.status(200).json(artist);
    }
  });
};

exports.patch = (req, res) => {
  Artist.findOne({ _id: req.params.id }, (err, artist) => {
    if (!artist) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else {
      artist.set(req.body);
      artist.save().then(updatedArtist => {
        res.status(200).json(updatedArtist);
      });
    }
  });
};

exports.delete = (req, res) => {
  Artist.findOne({ _id: req.params.id }, (err, artist) => {
    if (!artist) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else {
      artist.remove().then(() => {
        res.status(204).json();
      });
    }
  });
};
