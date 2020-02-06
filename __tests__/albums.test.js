const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Artist = require('../src/models/artist');
const Album = require('../src/models/album');

describe('/albums', () => {
  let artist;

  beforeAll(done => {
    const url = process.env.DATABASE_CONN;
    mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    done();
  });

  beforeEach(done => {
    Artist.create(
      {
        name: 'Tame Impala',
        genre: 'Rock',
      },
      (_, document) => {
        artist = document;
        done();
      },
    );
  });

  afterEach(done => {
    Artist.deleteMany({}, () => {
      Album.deleteMany({}, () => {
        done();
      });
    });
  });

  afterAll(done => {
    mongoose.connection.db.dropDatabase();
    mongoose.connection.close();
    done();
  });

  describe('POST /artists/:artistId/albums', () => {
    it('creates a new album for a given artist', done => {
      request(app)
        .post(`/artists/${artist._id}/albums`)
        .send({
          name: 'InnerSpeaker',
          year: 2010,
        })
        .then(res => {
          expect(res.status).toBe(201);

          Album.findById(res.body._id, (err, album) => {
            expect(err).toBe(null);
            expect(album.name).toBe('InnerSpeaker');
            expect(album.year).toBe(2010);
            expect(album.artist).toEqual(artist._id);
            done();
          });
        });
    });

    it('returns a 404 and does not create an album if the artist does not exist', done => {
      request(app)
        .post('/artists/1234/albums')
        .send({
          name: 'InnerSpeaker',
          year: 2010,
        })
        .then(res => {
          expect(res.status).toBe(404);
          expect(res.body.error).toBe('The artist could not be found.');

          Album.find({}, (err, albums) => {
            expect(err).toBe(null);
            expect(albums.length).toBe(0);
            done();
          });
        });
    });
  });

  describe('with albums in the database', () => {
    let albums;
    beforeEach(done => {
      Promise.all([
        Album.create({ name: 'Lonerism', year: 2012 }),
        Album.create({ name: 'Currents', year: 2015 }),
      ]).then(documents => {
        albums = documents;
        done();
      });
    });

    describe('GET /albums', () => {
      it('gets all albums', done => {
        request(app)
          .get(`/albums`)
          .then(res => {
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
          });
        done();
      });
    });

    describe('PATCH /albums/:albumId', () => {
      it('updates selected album information', done => {
        const album = albums[0];
        request(app)
          .patch(`/albums/${album._id}`)
          .send({ name: 'testing' })
          .then(res => {
            expect(res.status).toBe(200);
            Album.findById(album._id, (_, updatedAlbum) => {
              expect(updatedAlbum.name).toBe('testing');
              done();
            });
          });
      });
    });

    describe('DELETE /albums/:albumId', () => {
      it('deletes the selected album', done => {
        const album = albums[0];
        request(app)
          .delete(`/albums/${album._id}`)
          .then(res => {
            expect(res.status).toBe(204);
            Album.findById(album._id, (error, deletedAlbum) => {
              expect(error).toBe(null);
              expect(deletedAlbum).toBe(null);
              done();
            });
          });
      });

      it('returns a 404 if the album does not exist', done => {
        request(app)
          .delete('/albums/123')
          .then(res => {
            expect(res.status).toBe(404);
            expect(res.body.error).toBe('The album could not be found.');
            done();
          });
      });
    });
  });
});
