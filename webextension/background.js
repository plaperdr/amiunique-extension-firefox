"use strict";

var port = browser.runtime.connect({name: "sync-legacy-addon-data"});

port.onMessage.addListener(function(message) {
    if(message) {
        browser.storage.local.set(message);
    }
});