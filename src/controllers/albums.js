const Album = require('../models/album');
const Artist = require('../models/artist');

exports.create = (req, res) => {
  const { id } = req.params;

  Artist.findOne({ _id: id }, (err, artist) => {
    if (!artist) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else {
      const album = new Album({
        name: req.body.name,
        year: req.body.year,
        artist: id,
      });

      album.save().then(() => {
        res.status(201).json(album);
      });
    }
  });
};

exports.list = (req, res) => {
  Album.find().then(album => {
    res.status(200).json(album);
  });
};

exports.find = (req, res) => {
  Album.findOne({ _id: req.params.id }, (err, album) => {
    if (!album) {
      res.status(404).json({ error: 'The album could not be found.' });
    } else {
      res.status(200).json(album);
    }
  });
};

exports.update = (req, res) => {
  Album.findById({ _id: req.params.albumId }, (err, album) => {
    album.set(req.body);
    album.save().then(updatedAlbum => {
      res.status(200).json(updatedAlbum);
    });
  });
};

exports.delete = (req, res) => {
  Album.findById({ _id: req.params.albumId }, (err, album) => {
    if (!album) {
      res.status(404).send({ error: 'The album could not be found.' });
    } else {
      album.remove().then(() => {
        res.status(204).json();
      });
    }
  });
};
