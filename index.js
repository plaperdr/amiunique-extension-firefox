//AmIUnique index.js

var pageWorkers = require("sdk/page-worker");
var self = require("sdk/self");
var tabs = require("sdk/tabs");
var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var preferences = require("sdk/simple-prefs").prefs;

console.log("AmIUnique extension");


/***************** Creation of parameters *****************/
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
//Creation of the extension variables
if(!preferences.AmIUniqueID) {
    preferences.AmIUniqueID = generateUUID();
}
if(!preferences.nbEvol){
    preferences.nbEvol = 0;
    preferences.lastSent = new Date().toString();
    preferences.changesToSee = false;
}

/***************** Toggle button and Panel *****************/

var button = ToggleButton({
    id: "ami-button",
    label: "AmIUnique",
    icon: {
        "16": "./icon.png",
        "32": "./icon.png",
        "64": "./icon.png"
    },
    onChange: handleChange
});
if(preferences.changesToSee) button.badge = "!";

var panel = panels.Panel({
    height: 350,
    contentURL: self.data.url("popup.html"),
    contentScriptFile:  [
        self.data.url("dependencies/jquery-2.1.4.min.js"),
        self.data.url("dependencies/materialize.min.js"),
        self.data.url("popup.js")
    ],
    contentStyleFile: [
        self.data.url("dependencies/materialize.min.css"),
        self.data.url("style.css")
    ],
    contentScriptOptions: {
        "lastSent":preferences.lastSent,
        "nbEvol": preferences.nbEvol,
        "changesToSee":preferences.changesToSee
    },
    onHide: handleHide
});

function handleChange(state) {
    if (state.checked) {

        //Send updated parameters when popup is opened
        panel.port.emit("update",{
            "lastSent":preferences.lastSent,
            "nbEvol": preferences.nbEvol,
            "changesToSee":preferences.changesToSee
        });

        panel.show({
            position: button
        });
    }
}

function handleHide() {
    button.state('window', {checked: false});
}

//If the user has clicked on the "View changes" button
//We reset the text the badge of the browser action
panel.port.on("viewChanges", function() {
    button.badge = "";
    preferences.changesToSee = false;
    tabs.open({url: "https://amiunique.org/timeline/"+ preferences.AmIUniqueID+"#"+ preferences.nbEvol});
});

//If the user has clicked on the "X" button
//We remove the changes message
panel.port.on("discardChanges", function() {
    button.badge = "";
    preferences.changesToSee = false;
});

//Panel click event to open Fingerprint url
panel.port.on("openFP",function(){
    tabs.open({ url: "https://amiunique.org/timeline/"+preferences.AmIUniqueID+"#fp" });
});

//Panel click event to open Timeline url
panel.port.on("openTimeline",function(){
    tabs.open({ url: "https://amiunique.org/timeline/"+preferences.AmIUniqueID });
});


/***************** FP Loop *****************/

//Launch of the page worker responsible for the
//loading of the AmIUnique extension webpage
var pageWorker = pageWorkers.Page({
    contentURL: self.data.url("page.html"),
    contentScriptFile: self.data.url("page-script.js"),
    contentScriptOptions: {"uuid":preferences.AmIUniqueID}
});

//Register any changes after sending the current FP
pageWorker.port.on("nbEvol", function(nbEvol){

    var newEvol = parseInt(nbEvol);

    //If the fingerprint has changed
    //We indicate it in the browser action
    if (newEvol > preferences.nbEvol) {
        button.badge = "!";
        preferences.nbEvol = newEvol;
        preferences.changesToSee = true;
    }

    //We update the time the last FP was sent
    preferences.lastSent = new Date().toString();
});

