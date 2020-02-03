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
