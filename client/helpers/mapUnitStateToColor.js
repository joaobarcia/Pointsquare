Template.registerHelper('mapUnitStateToColor', function(stateValue) {
    if (!Meteor.userId()) {
        return "primary"; // when user is not logged show neutral color cyan
    } else {
        if (stateValue >= 0 && stateValue < Session.get("readyThreshold")) return "red"; // if concept state is low display red book
        else if (stateValue < Session.get("readyThreshold")) return "orange"; // if concept state is intermediate display yellow book
        else if (stateValue <= 1) return "green"; // if concept state is high display green book
        else return "grey"; // any other value (state error) display grey book
    }
});
