const Song = require('../models/song');
const Album = require('../models/album');
const Artist = require('../models/artist');

exports.create = (req, res) => {
  const { albumId } = req.params;
  const { artistId } = req.body;

  const song = new Song({
    name: req.body.name,
    album: albumId,
    artist: artistId,
  });

  if (!song.album) {
    res.status(404).json({ error: 'The album could not be found.' });
  } else {
    song.save().then(savedSong => {
      Song.findOne({ _id: savedSong._id })
        .populate({ path: 'album' })
        .populate({ path: 'artist' })
        .exec((err, songId) => {
          res.status(200).json(songId);
        });
    });
  }
};

exports.list = (req, res) => {
  Song.find().then(song => {
    res.status(200).json(song);
  });
};

exports.find = (req, res) => {
  Song.findById(req.params.songId, (err, song) => {
    if (!song) {
      res.status(404).json({ error: 'The song could not be found.' });
    } else {
      res.status(200).json(song);
    }
  });
};

exports.update = (req, res) => {
  Song.findById(req.params.songId, (err, song) => {
    if (!song) {
      res.status(404).json({ error: 'The song could not be found.' });
    } else {
      song.set(req.body);
      song.save().then(updateSong => {
        res.status(200).json(updateSong);
      });
    }
  });
};

exports.delete = (req, res) => {
  Song.findById(req.params.songId, (err, song) => {
    if (!song) {
      res.status(404).json({ error: 'The song could not be found.' });
    } else {
      song.remove().then(() => {
        res.status(204).json();
      });
    }
  });
};
