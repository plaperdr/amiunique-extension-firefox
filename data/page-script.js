//AmIUnique page-script.js

var iframe = window.document.getElementById("amiunique");

function loadIframe(){
    iframe.src= "https://amiunique.org/extension#"+self.options.uuid;
}

function clearIframe() {
    iframe.src= "";
    self.port.emit("getNbEvol");
}

//Send the FP every 4 hours to the server
setInterval(
    function(){
        loadIframe();
        setTimeout(clearIframe,10000);
    },
    4*60*60*1000
);