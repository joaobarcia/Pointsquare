Template.registerHelper('goalAlreadyReached', function(state) {
    if (typeof state !== "undefined") {
        if (state > Session.get("ready threshold")) {
            return true;
        } else return null;
    } else return null;
});
