const express = require('express');
const functions = require('firebase-functions');
const mkdirp = require('mkdirp-promise');
const gcs = require('@google-cloud/storage')();
const Promise = require('bluebird');
const ffmpeg = require('fluent-ffmpeg');
const ffmpeg_static = require('ffmpeg-static');


const app = express();

app.get('/*.webm', (req, res) => {
    addr = req.originalUrl
    console.log("Got a request!")
    res.status(200).send(`Address: ${addr}.`)
});

/*
 * TODO: Start working up the requestor from firebase.
 * All it needs to do (for the most part) is just ask for the URL of the cloud app with the file location appended.
 * From there, I should be able to handle all of the bucket bits within here, using cloud/storage + firebase/functions.
 * even the uploading will be handled here.
 * I should probably set up a entirely new firebase app for it using my x.xirel.x account, for consistency.
 * Basic workflow: webm gets uploaded --> trigger fires from firebase-functions --> send http request to here -->
 * respond with 200, return file found check and start promise chain -->  transcode file --> end promise chain
 * may make sense to include a realtime database portion to check status of converted files, hold names, etc.
 */


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