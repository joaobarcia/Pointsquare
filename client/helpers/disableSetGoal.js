Template.registerHelper('goalAlreadyReached', function(state) {
    if (state !== "undefined") {
        if (state > 0.9) {
            return true;
        } else return null;
    } else return null;
});
