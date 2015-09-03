Template.registerHelper('mapUnitStateToColor', function(stateValue) {
    if (!Meteor.userId()) {
        return "cyan";
    } else {
        if (stateValue < 0.2) return "red lighten-3";
        else if (stateValue < 0.8) return "orange lighten-3";
        else return "green "
    }
});
