//AmIUnique page-script.js

var iframe = window.document.getElementById("amiunique");

function loadIframe(){
    iframe.src= "https://amiunique.org/extension#"+self.options.uuid;
}

function clearIframe() {
    iframe.src= "";
    self.port.emit("getNbEvol");
}

function sendFP(){
    loadIframe();
    setTimeout(clearIframe,10000);
}

//Send FP on startup
sendFP();

//Send the FP every 4 hours to the server
setInterval(sendFP,
    4*60*60*1000
);
