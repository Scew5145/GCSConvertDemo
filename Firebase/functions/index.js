const functions = require('firebase-functions');
const gcs = require('@google-cloud/storage')();
const request = require('request-promise');



//Helper function for changing the ffmpeg command into a promise so that the function will properly wait for it to finish.
//Source: https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/issues/710

//Conversion function for changing webms (or other video types, maybe?) into mp4s.
exports.webm_to_mp4_requestor = functions.storage.object().onChange(event => {
    const object = event.data;
    const filePath = object.name;

    console.log(filePath)

    //Type Checking for the uploaded item
    if(object.contentType != 'video/webm'){
        console.log('Item ', fileName, 'is not a webm video. Skipping')
        return
    }

    //Make sure the event isn't a move or deletion event
    if (object.resourceState === 'not_exists') {
        console.log('Skipping Deletion/Move event')
        return;
    }

    //Set up the GET request to the app
    const appUrl = "https://8081-dot-2416846-dot-devshell.appspot.com/"
    const fullUrl = `${appUrl}${filePath}`
    console.log(fullUrl)
    return request({
            url: `${fullUrl}`,
            method: 'POST'
        }).then(function(res) {
            console.log(res.statusCode);
        }).catch(function(error) {
            console.log(error.message);
        });



});
