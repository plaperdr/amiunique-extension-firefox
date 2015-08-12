//AmIUnique page-script.js

var fp;
var iframe;

function loadIframe(){
    console.log("Loading iframe");
    iframe.src= "https://amiunique.org/extension";
}

function clearIframe() {
    console.log("Clearing iframe");
    iframe.src= "";
}

iframe = window.document.getElementById("amiunique");
iframe.addEventListener("load", function () {

    if(iframe.src.length>0) {
        //Adding the UUID in the loaded iframe
        fp = iframe.contentWindow.document.getElementById("fp");
        fp.setAttribute("uuid", self.options.uuid);

        //Send back the number of evolutions to index.js
        setTimeout(function () {
            numb = fp.getAttribute("nbEvol");
            self.port.emit("nbEvol", numb.toString());
        }, 5000);

        setTimeout(clearIframe,10000);
    }

});

//Send FP on browser startup
loadIframe();

//Send the FP every 4 hours to the server
setInterval(loadIframe,4*60*60*1000);