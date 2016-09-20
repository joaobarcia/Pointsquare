Template.registerHelper('mapUnitStateToColor', function(stateValue) {
    if (!Meteor.userId()) {
        return "grey"; // when user is not logged show neutral color
    } else {
        if (stateValue >= 0 && stateValue < Session.get("readyThreshold")) return "red lighten-2"; // if concept state is low display red book
        else if (stateValue < Session.get("readyThreshold")) return "orange lighten-2"; // if concept state is intermediate display yellow book
        else if (stateValue <= 1) return "green"; // if concept state is high display green book
        else return "black"; // any other value (state error) display black book
    }
});
