Template.registerHelper('mapConceptStateToColor', function(stateValue) {
    if (!Meteor.userId()) {
        return "primary"; // when user is not logged show neutral color cyan
    } else {
        if (stateValue >= 0 && stateValue < Session.get("readyThreshold")) return "black"; // if concept state is low display grey light bulb
        else if (stateValue < Session.get("readyThreshold")) return "grey"; // if concept state is intermediate display light yellow light bulb
        else if (stateValue <= 1) return "yellow"; // if concept state is high display strong yellow light bulb
        else return "grey"; // any other value (state error) display grey light bulb
    }
});
