const Song = require('../models/song');
const Album = require('../models/album');
const Artist = require('../models/artist');

exports.create = (req, res) => {
  const { albumId } = req.params;
  const { artistId } = req.body;

  Album.findById(albumId, (err, album) => {
    if (!album) {
      res.status(404).json({ error: 'The album could not be found.' });
    } else {
      Artist.findById(artistId, (err, artist) => {
        if (!artist) {
          res.status(404).json({ error: 'The artist could not be found.' });
        } else {
          const song = new Song({
            name: req.body.name,
            artist,
            album,
          });

          song.save().then(() => {
            res.status(200).json(song);
          });
        }
      });
    }
  });
};
