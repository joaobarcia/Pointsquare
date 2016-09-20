Template.registerHelper('mapConceptStateToColor', function(stateValue) {
    if (!Meteor.userId()) {
        return "grey"; // when user is not logged show neutral color
    } else {
        if (stateValue >= 0 && stateValue < Session.get("readyThreshold")) return "grey darken-4"; // if concept state is low display grey light bulb
        else if (stateValue < Session.get("readyThreshold")) return "blue-grey lighten-1"; // if concept state is intermediate display light yellow light bulb
        else if (stateValue <= 1) return "yellow darken-1"; // if concept state is high display strong yellow light bulb
        else return "black"; // any other value (state error) display black bulb
    }
});
