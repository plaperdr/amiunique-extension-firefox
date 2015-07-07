//AmIUnique index.js

var pageWorkers = require("sdk/page-worker");
var self = require("sdk/self");
var preferences = require("sdk/simple-prefs").prefs;

console.log("AmIUnique extension");

function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}

//Generation of the unique ID if not present in the preferences
if(!preferences.AmIUniqueID){
    preferences.AmIUniqueID = generateUUID();
}

//Launch of the page worker responsible for the
//loading of the AmIUnique extension webpage
var pageWorker = pageWorkers.Page({
    contentURL: self.data.url("page.html"),
    contentScriptFile: self.data.url("page-script.js"),
    contentScriptOptions: {"uuid":preferences.AmIUniqueID}
});

pageWorker.on("message", function(message) {
    console.log(message);
});