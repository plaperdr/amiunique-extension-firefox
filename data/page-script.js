//AmIUnique page-script.js

var iframe = window.document.getElementById("amiunique");

function loadIframe(){
    //iframe.src= "https://amiunique.org/extension#"+self.options.uuid;
    iframe.src= "http://localhost:9000/extension#"+self.options.uuid;
}

function clearIframe() {
    iframe.src= "";
    self.port.emit("getNbEvol");
}

//Send the FP every 4 hours to the server
//setInterval(loadIframe,4*60*60*1000);
setInterval(
    function(){
        loadIframe();
        setTimeout(clearIframe,10000);
    },
    15*1000
);