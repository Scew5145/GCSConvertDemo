const express = require('express');
const functions = require('firebase-functions');
const mkdirp = require('mkdirp-promise');
const gcs = require('@google-cloud/storage')();
const Promise = require('bluebird');
const ffmpeg = require('fluent-ffmpeg');
const ffmpeg_static = require('ffmpeg-static');


const app = express();
console.log('Cloud Server Started! Probably.')

app.get('/', (req, res) => {
    res.status(200).send("These are some words that I'm sending to the user.")
});


if (module === require.main) {
  // [START server]
  // Start the server
  const server = app.listen(process.env.PORT || 8081, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
    console.log(server.address())
  });
  // [END server]
}