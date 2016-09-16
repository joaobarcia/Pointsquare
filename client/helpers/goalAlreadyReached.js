Template.registerHelper('goalAlreadyReached', function(state) {
    if (typeof state !== "undefined") {
        if (state > Session.get("readyThreshold")) {
            return true;
        } else return null;
    } else return null;
});
