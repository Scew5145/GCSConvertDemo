const functions = require('firebase-functions');
const mkdirp = require('mkdirp-promise');
const gcs = require('@google-cloud/storage')();
const Promise = require('bluebird');
const ffmpeg = require('fluent-ffmpeg');
const ffmpeg_static = require('ffmpeg-static');

var gcloud = require('google-cloud')({
  projectId: 'videoconvertgcdemo'
});

console.log('Cloud Server Started! Probably.')