Template.registerHelper('mapConceptStateToColor', function(stateValue) {
    if (!Meteor.userId()) {
        return "cyan"; // when user is not logged show neutral color cyan
    } else {
        if (stateValue >= 0 && stateValue < 0.4) return "grey darken-2"; // if concept state is low display grey light bulb
        else if (stateValue < 0.9) return "#blue-grey lighten-4"; // if concept state is intermediate display light yellow light bulb
        else if (stateValue <= 1) return "yellow darken-1"; // if concept state is high display strong yellow light bulb
        else return "grey"; // any other value (state error) display grey light bulb
    }
});
