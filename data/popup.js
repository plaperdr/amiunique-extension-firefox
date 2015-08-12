$( document ).ready(function() {

    var nbEvol = self.options.nbEvol;
    var lastSent = self.options.lastSent;
    var changesToSee = self.options.changesToSee;

    function update(){
        $('#date').text(lastSent);
        $('#nbEvol').text(nbEvol);
        if (changesToSee) {
            $('#changes').show();
        }
    }

    update();

    //Adding update event
    self.port.on("update", function (data) {
        lastSent = data.lastSent;
        nbEvol = data.nbEvol;
        changesToSee = data.changesToSee;
        update();
    });

    //Adding click events for buttons
    $('#viewChanges').click(function () {
        self.port.emit("viewChanges");
        $('#changes').hide();
    });

    $('#discardChanges').click(function () {
        self.port.emit("discardChanges");
        $('#changes').hide();
    });

    $('#viewFP').click(function () {
        self.port.emit("openFP");
    });

    $('#viewTimeline').click(function () {
        self.port.emit("openTimeline");
    });

});
