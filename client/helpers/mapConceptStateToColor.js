Template.registerHelper('mapConceptStateToColor', function(stateValue) {
    if (!Meteor.userId()) {
        return "cyan";
    } else {
        if (stateValue < 0.2) return "grey";
        else if (stateValue < 0.8) return "yellow lighten-1";
        else return "yellow darken-1"
    }
});
