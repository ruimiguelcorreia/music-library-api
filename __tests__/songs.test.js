const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Artist = require('../src/models/artist');
const Album = require('../src/models/album');
const Song = require('../src/models/song');

describe('Songs', () => {
  let artistId;
  let albumId;

  beforeAll(done => {
    const url = process.env.DATABASE_CONN;
    mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    done();
  });

  beforeEach(done => {
    Artist.create({ name: 'Tame Impala', genre: 'Rock' }, (_, artist) => {
      artistId = artist._id.toString();
      Album.create({ name: 'InnerSpeaker', year: 2010, artist: artistId }, (__, album) => {
        albumId = album._id.toString();
        done();
      });
    });
  });

  afterEach(done => {
    Artist.deleteMany({}, () => {
      Album.deleteMany({}, () => {
        Song.deleteMany({}, () => {
          done();
        });
      });
    });
  });

  afterAll(done => {
    mongoose.connection.close();
    done();
  });

  describe('POST /albums/:albumId/song', () => {
    it('creates a new song under an album', done => {
      request(app)
        .post(`/albums/${albumId}/song`)
        .send({
          artistId,
          name: 'Solitude Is Bliss',
        })
        .then(res => {
          expect(res.status).toBe(200);
          const songId = res.body._id;
          expect(res.body).toEqual({
            name: 'Solitude Is Bliss',
            _id: songId,
            artist: {
              _id: artistId,
              name: 'Tame Impala',
              genre: 'Rock',
              __v: 0,
            },
            album: {
              _id: albumId,
              artist: artistId,
              name: 'InnerSpeaker',
              year: 2010,
              __v: 0,
            },
            __v: 0,
          });
          done();
        });
    });
  });

  describe('with songs in the database', () => {
    let songs;
    beforeEach(done => {
      Promise.all([Song.create({ name: 'Feel Again' })]).then(documents => {
        songs = documents;
        done();
      });
    });

    describe('GET /songs', () => {
      it('gets all the songs', done => {
        request(app)
          .get('/songs')
          .then(res => {
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(1);
            done();
          });
      });
    });

    describe('GET /songs/:songId', () => {
      it('gets song by id', done => {
        const song = songs[0];
        request(app)
          .get(`/songs/${song._id}`)
          .then(res => {
            expect(res.status).toBe(200);
            expect(res.body.name).toBe('Feel Again');
            done();
          });
      });
    });
  });
});
