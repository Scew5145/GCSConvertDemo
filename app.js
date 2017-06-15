const express = require('express');
const functions = require('firebase-functions');
const mkdirp = require('mkdirp-promise');
const gcs = require('@google-cloud/storage')();
const Promise = require('bluebird');
const ffmpeg = require('fluent-ffmpeg');
const ffmpeg_static = require('ffmpeg-static');


const app = express();
const MP4_EXTENSION = 'mp4'
const TEMP_LOCAL_FOLDER = '/tmp/'

app.get('/*.webm', (req, res) => {
    console.log("Got a request!")
    //Parse request file address
    const filePathSplit = req.originalUrl.split('/');
    const fileName = filePathSplit.pop();
    const fileNameSplit = fileName.split('.');
    fileNameSplit.shift()
    const fileExtension = fileNameSplit.pop();
    const baseFileName = fileNameSplit.join('.');
    const fileDir = filePathSplit.join('/') + (filePathSplit.length > 0 ? '/' : '');

    const MP4FilePath = `${fileDir}${baseFileName}.${MP4_EXTENSION}`;
    const tempLocalDir = `${TEMP_LOCAL_FOLDER}${fileDir}`;
    const tempLocalFile = `${tempLocalDir}${fileName}`;
    const tempLocalMP4File = `${TEMP_LOCAL_FOLDER}${MP4FilePath}`;

    //Make the temp directory
    return mkdirp(tempLocalDir).then(() => {
        console.log('Directory Created')
        //Download item from bucket
        const bucket = gcs.bucket(object.bucket);
        return bucket.file(filePath).download({destination: tempLocalFile}).then(() => {
            console.log('file downloaded to convert. Location:', tempLocalFile)
            cmd = ffmpeg({source:tempLocalFile})
            .setFfmpegPath(ffmpeg_static.path)
            .inputFormat(fileExtension)
            .output(tempLocalMP4File)
            //Uncomment to see frame progress. Change to progress.percent to see bad % completed estimates
            /*.on('progress', function(progress) {
             console.log('Processing: ' + progress.frames + ' frames completed');
            });*/
            cmd = promisifyCommand(cmd)
            return cmd.then(() => {
                console.log('mp4 created at ', tempLocalMP4File)
                //Just the upload left
                return bucket.upload(tempLocalMP4File, {
                    destination: MP4FilePath
                }).then(() => {
                    console.log('mp4 uploaded at', filePath);
                    res.status(200).send(`0`)
                });
            })
        });
    });

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