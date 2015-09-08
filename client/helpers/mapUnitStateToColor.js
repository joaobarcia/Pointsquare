Template.registerHelper('mapUnitStateToColor', function(stateValue) {
    if (!Meteor.userId()) {
        return "cyan";
    } else {
        if (stateValue < 0.2) return "red lighten-2";
        else if (stateValue < 0.8) return "orange lighten-2";
        else return "green"
    }
});
